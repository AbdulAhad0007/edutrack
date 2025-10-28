import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const teacherId = searchParams.get('teacher_id');

    if (!supabaseUrl || !supabaseKey) {
      return new Response(JSON.stringify({ error: 'Server configuration error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Fetch teacher-created notifications
    let teacherNotificationsQuery = supabase
      .from('teacher_notifications')
      .select('*')
      .order('created_at', { ascending: false });

    // If teacher_id is provided, filter by teacher
    if (teacherId) {
      teacherNotificationsQuery = teacherNotificationsQuery.eq('teacher_id', teacherId);
    }

    const { data: teacherNotifications, error: teacherError } = await teacherNotificationsQuery;

    if (teacherError) {
      console.error('Error fetching teacher notifications:', teacherError);
    }

    // Fetch admin notices (received notices)
    const { data: adminNotices, error: adminError } = await supabase
      .from('admin_notices')
      .select('*')
      .or('target_audience.eq.all,and(target_audience.eq.teachers)')
      .order('created_at', { ascending: false });

    if (adminError) {
      console.error('Error fetching admin notices:', adminError);
    }

    // Combine and format the data
    const allNotifications = [];

    // Add teacher notifications with type 'sent'
    if (teacherNotifications) {
      const sentNotifications = teacherNotifications.map(notification => ({
        ...notification,
        type: 'sent',
        notification_type: 'teacher_notification'
      }));
      allNotifications.push(...sentNotifications);
    }

    // Add admin notices with type 'received'
    if (adminNotices) {
      const receivedNotices = adminNotices.map(notice => ({
        ...notice,
        type: 'received',
        notification_type: 'admin_notice',
        // Map admin notice fields to match teacher notification structure
        title: notice.title,
        message: `${notice.message} (sent by admin)`,
        priority: notice.priority,
        target_audience: notice.target_audience,
        teacher_id: teacherId,
        teacher_name: 'Admin' // Admin notices don't have specific teacher names
      }));
      allNotifications.push(...receivedNotices);
    }

    // Sort all notifications by creation date (most recent first)
    allNotifications.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return new Response(JSON.stringify(allNotifications), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Unexpected error in GET teacher notifications:', error);
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
    let requestBody;
    try {
      requestBody = await request.json();
    } catch (jsonError) {
      console.error('Failed to parse JSON:', jsonError);
      return new Response(JSON.stringify({ error: 'Invalid JSON in request body' }), { status: 400 });
    }

    const {
      title,
      message,
      priority,
      target_audience,
      teacher_id,
      teacher_name,
      specific_class,
      specific_section,
      specific_student_id
    } = requestBody;

    if (!title || !message || !priority || !target_audience || !teacher_id || !teacher_name) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    if (!supabaseUrl || !supabaseKey) {
      return new Response(JSON.stringify({ error: 'Server configuration error' }), { status: 500 });
    }

    // Prepare notification data based on target audience
    const notificationData = {
      title,
      message,
      priority,
      target_audience,
      teacher_id,
      teacher_name,
      notification_type: 'teacher_notification',
      created_at: new Date().toISOString()
    };

    // Add specific targeting fields based on audience type
    if (target_audience === 'specific_class' && specific_class) {
      notificationData.specific_class = specific_class;
    } else if (target_audience === 'specific_section' && specific_section) {
      notificationData.specific_section = specific_section;
    } else if (target_audience === 'specific_student' && specific_student_id) {
      notificationData.specific_student_id = specific_student_id;
    }

    console.log('Attempting to insert notification:', notificationData);

    const { data, error } = await supabase
      .from('teacher_notifications')
      .insert([notificationData])
      .select();

    if (error) {
      console.error('Error creating notification:', error);
      console.error('Error details:', error.message, error.details, error.hint);
      return new Response(JSON.stringify({
        error: 'Failed to create notification',
        details: error.message,
        databaseError: error
      }), { status: 500 });
    }

    console.log('Successfully created notification:', data);

    return new Response(JSON.stringify(data[0]), { status: 201 });
  } catch (error) {
    console.error('Unexpected error in POST notifications:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
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
      .from('teacher_notifications')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting teacher notification:', error);
      return new Response(JSON.stringify({
        error: 'Failed to delete teacher notification',
        details: error.message
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
