import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const teacherId = searchParams.get('teacher_id');

    if (!supabaseUrl || !supabaseKey) {
      return new Response(JSON.stringify({
        error: 'Server configuration error',
        details: 'Missing Supabase configuration'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!teacherId) {
      return new Response(JSON.stringify({
        error: 'Missing teacher_id parameter'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get current date for filtering upcoming meetings
    const currentDate = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('meetings')
      .select('*')
      .contains('attendees', [teacherId])
      .gte('meeting_date', currentDate)
      .order('meeting_date', { ascending: true })
      .order('meeting_time', { ascending: true });

    if (error) {
      console.error('Supabase error:', error);
      return new Response(JSON.stringify({
        error: 'Database error',
        details: error.message,
        code: error.code
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('API error:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error',
      details: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
