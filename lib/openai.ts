import OpenAI from 'openai';

function getOpenAIClient(): OpenAI {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY || '' });
}

export async function generateAIResponse<T>(
  systemPrompt: string,
  userPrompt: string
): Promise<T> {
  const providers = [
    () => callOpenAI(systemPrompt, userPrompt),
    () => callGemini(systemPrompt, userPrompt),
  ];

  for (const provider of providers) {
    try {
      return await provider() as T;
    } catch {
      continue;
    }
  }

  throw new Error('AI service unavailable. All providers failed.');
}

async function callOpenAI(systemPrompt: string, userPrompt: string): Promise<unknown> {
  if (!process.env.OPENAI_API_KEY) throw new Error('No OpenAI key');

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await getOpenAIClient().chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
      max_tokens: 2000,
    }, { signal: controller.signal });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error('Empty AI response');

    return JSON.parse(content);
  } finally {
    clearTimeout(timeout);
  }
}

async function callGemini(systemPrompt: string, userPrompt: string): Promise<unknown> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('No Gemini key');

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: `${systemPrompt}\n\n${userPrompt}\n\nRespond ONLY with valid JSON.` }],
          }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 2000,
            responseMimeType: 'application/json',
          },
        }),
        signal: controller.signal,
      }
    );

    if (!response.ok) throw new Error(`Gemini error: ${response.status}`);

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('Empty Gemini response');

    return JSON.parse(text);
  } finally {
    clearTimeout(timeout);
  }
}
