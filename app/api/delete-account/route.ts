import { NextResponse } from 'next/server';
import { createServerClient, createServiceClient } from '@/lib/supabase/server';

export async function DELETE() {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await supabase.from('analyses').delete().eq('user_id', user.id);
    await supabase.from('audit_logs').delete().eq('user_id', user.id);
    await supabase.from('profiles').delete().eq('id', user.id);

    const serviceClient = await createServiceClient();
    await serviceClient.auth.admin.deleteUser(user.id);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 });
  }
}
