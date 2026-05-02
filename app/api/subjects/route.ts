import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

export async function GET() {
  const { data, error } = await supabaseServer
    .from('classes')
    .select('subject_name')
    .eq('is_active', true)
    .order('subject_name', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const subjects = Array.from(new Set((data || []).map((r: any) => r.subject_name))).filter(Boolean);
  return NextResponse.json({ subjects });
}
