import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const teacherId = searchParams.get('id');

  if (!teacherId) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 });
  }

  // Try to fetch from users table first (assuming teachers are in users table)
  const { data, error } = await supabaseServer
    .from('users')
    .select('id, full_name, email, phone')
    .eq('id', teacherId)
    .single();

  if (!error && data) {
    return NextResponse.json({ teacher: data });
  }

  // If not found in users, try other possible table names (if your schema uses a teachers table)
  const { data: teacherData } = await supabaseServer
    .from('teachers')
    .select('id, name, email, phone')
    .eq('id', teacherId)
    .single();

  if (teacherData) {
    return NextResponse.json({ 
      teacher: { 
        id: teacherData.id, 
        full_name: (teacherData as any).name, 
        email: teacherData.email, 
        phone: teacherData.phone 
      } 
    });
  }

  return NextResponse.json({ teacher: { id: teacherId, full_name: 'Unknown Teacher' } });
}
