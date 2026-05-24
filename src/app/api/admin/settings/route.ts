import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSupabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

async function checkAuth() {
  const cookieStore = await cookies();
  return !!cookieStore.get('admin-token');
}

export async function GET() {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .limit(1)
    .single();

  if (error) {
    return NextResponse.json({ settings: null });
  }

  return NextResponse.json({ settings: data });
}

export async function PUT(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const supabase = getSupabase();

  const { data: existing } = await supabase
    .from('settings')
    .select('id')
    .limit(1)
    .single();

  if (existing) {
    const { error } = await supabase
      .from('settings')
      .update(body)
      .eq('id', existing.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  } else {
    const { error } = await supabase.from('settings').insert(body);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true });
}
