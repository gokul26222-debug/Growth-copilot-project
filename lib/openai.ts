import OpenAI from 'openai';

export async function generateAIResponse<T>(
  systemPrompt: string,
  userPrompt: string
): Promise<T> {
  const errors: string[] = [];

  // Try OpenAI first
  if (process.env.OPENAI_API_KEY) {
    try {
      const result = await callOpenAI(systemPrompt, userPrompt);
      return result as T;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`OpenAI: ${msg}`);
      console.error('[AI] OpenAI failed:', msg);
    }
  } else {
    errors.push('OpenAI: no API key');
  }

  // Try Gemini second
  if (process.env.GEMINI_API_KEY) {
    try {
      const result = await callGemini(systemPrompt, userPrompt);
      return result as T;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`Gemini: ${msg}`);
      console.error('[AI] Gemini failed:', msg);
    }
  } else {
    errors.push('Gemini: no API key');
  }

  console.error('[AI] All providers failed:', errors.join(' | '));
  throw new Error(`AI unavailable: ${errors.join(' | ')}`);
}

function safeJsonParse(text: string): unknown {
  const cleaned = text
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    // Try extracting JSON object from the text
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        // fall through
      }
    }
    // Try extracting JSON array
    const arrMatch = cleaned.match(/\[[\s\S]*\]/);
    if (arrMatch) {
      try {
        return JSON.parse(arrMatch[0]);
      } catch {
        // fall through
      }
    }
    throw new Error(`Failed to parse AI response as JSON: ${cleaned.slice(0, 100)}`);
  }
}

async function callOpenAI(systemPrompt: string, userPrompt: string): Promise<unknown> {
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    timeout: 30000,
    maxRetries: 1,
  });

  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.3,
    max_tokens: 2000,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('Empty response');

  return safeJsonParse(content);
}

async function callGemini(systemPrompt: string, userPrompt: string): Promise<unknown> {
  const apiKey = process.env.GEMINI_API_KEY!;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `${systemPrompt}\n\n${userPrompt}\n\nIMPORTANT: Respond with ONLY valid JSON. No markdown, no code fences, no explanation.` }],
        }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 2000,
        },
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const body = await response.text().catch(() => 'no body');
      throw new Error(`HTTP ${response.status}: ${body.slice(0, 300)}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(`API error: ${data.error.message || JSON.stringify(data.error)}`);
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      const blockReason = data.candidates?.[0]?.finishReason || data.promptFeedback?.blockReason;
      throw new Error(`Empty response${blockReason ? ` (${blockReason})` : ''}`);
    }

    return safeJsonParse(text);
  } finally {
    clearTimeout(timeout);
  }
}
