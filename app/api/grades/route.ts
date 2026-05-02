import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const subject = searchParams.get('subject');
  if (!subject) return NextResponse.json({ error: 'subject is required' }, { status: 400 });

  const { data, error } = await supabaseServer
    .from('classes')
    .select('grade')
    .eq('subject_name', subject)
    .eq('is_active', true)
    .order('grade', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const grades = Array.from(new Set((data || []).map((r: any) => r.grade))).filter(Boolean);
  return NextResponse.json({ grades });
}
