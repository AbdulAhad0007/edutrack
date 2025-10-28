import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    const { data, error } = await supabase.from('meetings').select('*');
    if (error) {
      console.error('Supabase error:', error);

      // If the table doesn't exist, provide helpful error message
      if (error.code === '42P01') {
        return new Response(JSON.stringify({
          error: 'Database table not found',
          details: 'The meetings table does not exist. Please run the database setup script.',
          solution: 'Execute the SQL script in supabase-meetings-schema.sql in your Supabase SQL editor'
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }

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

    // Map selected_teachers to attendees if needed
    const meetingData = {
      ...meeting,
      attendees: meeting.attendees || meeting.selected_teachers || [],
      scheduled_by: meeting.scheduled_by || 'admin'
    };

    // Remove selected_teachers from the data to avoid conflicts
    delete meetingData.selected_teachers;

    console.log('Inserting meeting data:', meetingData);

    const { data, error } = await supabase.from('meetings').insert([meetingData]);
    if (error) {
      console.error('Supabase error:', error);

      // If the table doesn't exist, provide helpful error message
      if (error.code === '42P01') {
        return new Response(JSON.stringify({
          error: 'Database table not found',
          details: 'The meetings table does not exist. Please run the database setup script.',
          solution: 'Execute the SQL script in supabase-meetings-schema.sql in your Supabase SQL editor'
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }

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
