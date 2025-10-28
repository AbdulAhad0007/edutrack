import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    const { data, error } = await supabase.from('meetings').select('*');
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

export async function POST(request) {
  try {
    const meeting = await request.json();

    // Validate required fields
    if (!meeting.title || !meeting.meeting_date || !meeting.meeting_time || !meeting.meeting_type) {
      return new Response(JSON.stringify({
        error: 'Missing required fields',
        required: ['title', 'meeting_date', 'meeting_time', 'meeting_type']
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate meeting_type
    if (!['online', 'offline', 'hybrid'].includes(meeting.meeting_type)) {
      return new Response(JSON.stringify({
        error: 'Invalid meeting type',
        validTypes: ['online', 'offline', 'hybrid']
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Ensure attendees is an array
    if (!Array.isArray(meeting.attendees)) {
      meeting.attendees = [];
    }

    const { data, error } = await supabase.from('meetings').insert([meeting]);
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
      status: 201,
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

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return new Response(JSON.stringify({
        error: 'Missing meeting ID'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { data, error } = await supabase.from('meetings').delete().eq('id', id);
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
