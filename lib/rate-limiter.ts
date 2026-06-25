import { createServerClient } from './supabase/server';

interface RateLimitResult {
  allowed: boolean;
  retryAfter?: number;
}

export async function checkRateLimit(
  userId: string,
  action: string,
  maxRequests: number,
  windowMs: number
): Promise<RateLimitResult> {
  const supabase = await createServerClient();
  const windowStart = new Date(Date.now() - windowMs).toISOString();

  const { count } = await supabase
    .from('audit_logs')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('action', action)
    .gte('created_at', windowStart);

  const requestCount = count || 0;

  if (requestCount >= maxRequests) {
    return { allowed: false, retryAfter: Math.ceil(windowMs / 1000) };
  }

  return { allowed: true };
}

export async function logAction(
  userId: string,
  action: string,
  details: Record<string, unknown> = {}
): Promise<void> {
  const supabase = await createServerClient();
  await supabase.from('audit_logs').insert({
    user_id: userId,
    action,
    details,
  });
}
