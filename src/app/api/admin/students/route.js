import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section');

    let query = supabase.from('students').select('*');

    if (section) {
      query = query.eq('section', section);
    }

    const { data, error } = await query;
    if (error) throw error;
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function POST(request) {
  try {
    const student = await request.json();

    // Validate required fields
    if (!student.uid || !student.password || !student.name) {
      return new Response(JSON.stringify({ error: 'Missing required fields: uid, password, name' }), { status: 400 });
    }

    // Validate age if provided
    if (student.age && (student.age < 5 || student.age > 100)) {
      return new Response(JSON.stringify({ error: 'Age must be between 5 and 100' }), { status: 400 });
    }

    const { data, error } = await supabase.from('students').insert([student]);
    if (error) throw error;
    return new Response(JSON.stringify(data), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return new Response(JSON.stringify({ error: 'Missing id' }), { status: 400 });
    const { data, error } = await supabase.from('students').delete().eq('id', id);
    if (error) throw error;
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
