import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');
    const unreadOnly = searchParams.get('unreadOnly') === 'true';

    if (!studentId) {
      return new Response(JSON.stringify({ error: 'Student ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // First, get the student's class and section information
    const { data: studentData, error: studentError } = await supabase
      .from('students')
      .select('class, section')
      .eq('uid', studentId)
      .single();

    if (studentError) {
      console.error('Error fetching student data:', studentError);
      return new Response(JSON.stringify({ error: 'Student not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Extract numeric part from studentId (e.g., "uid001" -> 1)
    const numericStudentId = parseInt(studentId.replace(/\D/g, ''), 10);

    // Fetch notifications for different target audiences
    const queries = [
      // All students notifications from main notifications table
      supabase
        .from('notifications')
        .select('*')
        .eq('target_audience', 'all')
        .neq('notification_type', 'admin_notice'),

      // Class-specific notifications from main notifications table
      supabase
        .from('notifications')
        .select('*')
        .eq('target_audience', 'specific_class')
        .eq('specific_class', studentData.class)
        .neq('notification_type', 'admin_notice'),

      // Section-specific notifications from main notifications table
      supabase
        .from('notifications')
        .select('*')
        .eq('target_audience', 'specific_section')
        .eq('specific_section', studentData.section)
        .neq('notification_type', 'admin_notice'),

      // Student-specific notifications from main notifications table
      supabase
        .from('notifications')
        .select('*')
        .eq('target_audience', 'specific_student')
        .eq('specific_student_id', numericStudentId)
        .neq('notification_type', 'admin_notice'),

      // Teacher notifications for all students
      supabase
        .from('teacher_notifications')
        .select('*')
        .eq('target_audience', 'all_students'),

      // Teacher notifications for specific class
      supabase
        .from('teacher_notifications')
        .select('*')
        .eq('target_audience', 'specific_class')
        .eq('specific_class', studentData.class),

      // Teacher notifications for specific section
      supabase
        .from('teacher_notifications')
        .select('*')
        .eq('target_audience', 'specific_section')
        .eq('specific_section', studentData.section),

      // Teacher notifications for specific student
      supabase
        .from('teacher_notifications')
        .select('*')
        .eq('target_audience', 'specific_student')
        .eq('specific_student_id', studentId)
    ];

    // Execute all queries
    const results = await Promise.all(queries.map(q => q.order('created_at', { ascending: false })));

    // Process results separately for different tables
    const allNotifications = [];
    const seenIds = new Set();

    // Process main notifications table results (queries 0-3)
    for (let i = 0; i < 4; i++) {
      const { data, error } = results[i];
      if (error) {
        console.error('Error fetching notifications:', error);
        continue;
      }
      if (data) {
        data.forEach(notification => {
          if (!seenIds.has(notification.id)) {
            seenIds.add(notification.id);
            allNotifications.push(notification);
          }
        });
      }
    }

    for (let i = 4; i < 8; i++) {
      const { data, error } = results[i];
      if (error) {
        console.error('Error fetching teacher notifications:', error);
        continue;
      }
      if (data) {
        data.forEach(notification => {
          const normalized = {
            ...notification,
            is_read: false, 
            read_at: null,
            notification_type: 'teacher_notification'
          };
          if (!seenIds.has(notification.id)) {
            seenIds.add(notification.id);
            allNotifications.push(normalized);
          }
        });
      }
    }

    allNotifications.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    const limitedNotifications = allNotifications.slice(0, 4);

    let data = limitedNotifications;
    if (unreadOnly) {
      data = limitedNotifications.filter(n => !n.is_read);
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching student notifications:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function PUT(request) {
  try {
    const { notificationIds, markAllRead } = await request.json();

    if (markAllRead) {
      // Mark all notifications as read for the student
      const { searchParams } = new URL(request.url);
      const studentId = searchParams.get('studentId');

      if (!studentId) {
        return new Response(JSON.stringify({ error: 'Student ID is required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Extract numeric part from studentId for database query
      const numericStudentId = parseInt(studentId.replace(/\D/g, ''), 10);

      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('specific_student_id', numericStudentId)
        .eq('is_read', false);

      if (error) throw error;

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else if (notificationIds && notificationIds.length > 0) {
      // Mark specific notifications as read
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .in('id', notificationIds);

      if (error) throw error;

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      return new Response(JSON.stringify({ error: 'Invalid request' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    console.error('Error updating notifications:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
