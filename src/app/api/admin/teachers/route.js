import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    const { data, error } = await supabase.from('teachers').select('*');
    if (error) throw error;
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function POST(request) {
  try {
    const teacher = await request.json();

    // Validate required fields
    const requiredFields = ['uid', 'password', 'name', 'age', 'dob', 'address', 'department', 'experience', 'jobrole', 'profession', 'hobbies'];
    const missingFields = requiredFields.filter(field => !teacher[field]);

    if (missingFields.length > 0) {
      return new Response(JSON.stringify({
        error: `Missing required fields: ${missingFields.join(', ')}`
      }), { status: 400 });
    }

    // Validate data types
    if (isNaN(teacher.age) || teacher.age <= 0) {
      return new Response(JSON.stringify({
        error: 'Age must be a positive number'
      }), { status: 400 });
    }

    if (isNaN(teacher.experience) || teacher.experience < 0) {
      return new Response(JSON.stringify({
        error: 'Experience must be a non-negative number'
      }), { status: 400 });
    }

    const { data, error } = await supabase.from('teachers').insert([teacher]);
    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    return new Response(JSON.stringify(data), { status: 201 });
  } catch (error) {
    console.error('Error adding teacher:', error);
    return new Response(JSON.stringify({
      error: error.message || 'Failed to add teacher'
    }), { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return new Response(JSON.stringify({ error: 'Missing id' }), { status: 400 });
    const { data, error } = await supabase.from('teachers').delete().eq('id', id);
    if (error) throw error;
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
