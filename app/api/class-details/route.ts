import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const subject = searchParams.get('subject');
  const grade = searchParams.get('grade');

  if (!subject || !grade) {
    return NextResponse.json({ error: 'subject and grade are required' }, { status: 400 });
  }

  const { data, error } = await supabaseServer
    .from('classes')
    .select('id, name, subject_name, grade, schedule, teacher_id, medium, label')
    .eq('subject_name', subject)
    .eq('grade', grade)
    .eq('is_active', true);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ classes: data || [] });
}
