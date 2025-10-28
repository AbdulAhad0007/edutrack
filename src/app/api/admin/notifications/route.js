import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    if (!supabaseUrl || !supabaseKey) {
      return new Response(JSON.stringify({ error: 'Server configuration error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { data, error } = await supabase
      .from('admin_notices')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return new Response(JSON.stringify({
        error: error.message,
        details: 'Failed to fetch admin notices from database'
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
      error: error.message,
      details: 'Failed to fetch admin notices from database'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function POST(request) {
  try {
    if (!supabaseUrl || !supabaseKey) {
      return new Response(JSON.stringify({ error: 'Server configuration error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const notification = await request.json();

    // Prepare admin notice data
    const noticeData = {
      title: notification.title,
      message: notification.message,
      priority: notification.priority || 'medium',
      target_audience: notification.target_audience || 'all',
      specific_class: notification.specific_class || null,
      specific_section: notification.specific_section || null,
      scheduled_for: notification.scheduled_for || null,
      sent_by: 'admin',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('admin_notices')
      .insert([noticeData])
      .select();

    if (error) {
      console.error('Error creating admin notice:', error);
      return new Response(JSON.stringify({
        error: error.message,
        details: 'Failed to create admin notice'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(data[0]), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('API error:', error);
    return new Response(JSON.stringify({
      error: error.message,
      details: 'Failed to create admin notice'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function DELETE(request) {
  try {
    if (!supabaseUrl || !supabaseKey) {
      return new Response(JSON.stringify({ error: 'Server configuration error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return new Response(JSON.stringify({ error: 'Missing id' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { data, error } = await supabase
      .from('admin_notices')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting admin notice:', error);
      return new Response(JSON.stringify({
        error: error.message,
        details: 'Failed to delete admin notice'
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
      error: error.message,
      details: 'Failed to delete admin notice'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
