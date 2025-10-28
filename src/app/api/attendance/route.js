import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const className = searchParams.get('class');
    const section = searchParams.get('section');
    const date = searchParams.get('date');
    const studentId = searchParams.get('studentId');

    let query = supabase.from('attendance').select('*');

    if (className) query = query.eq('class', className);
    if (section) query = query.eq('section', section);
    if (date) query = query.eq('date', date);
    if (studentId) query = query.eq('student_id', studentId);

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function POST(request) {
  try {
    const attendanceData = await request.json();

    // Validate required fields
    if (!attendanceData.class || !attendanceData.section || !attendanceData.date || !attendanceData.records) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Insert attendance records
    const records = attendanceData.records.map(record => ({
      student_id: record.studentId,
      student_name: record.studentName,
      roll_number: record.rollNumber,
      class: attendanceData.class,
      section: attendanceData.section,
      subject: attendanceData.subject,
      period: attendanceData.period,
      teacher_uid: record.teacherUid,
      status: record.status,
      date: attendanceData.date,
      marked_by: record.markedBy || 'teacher',
      marked_at: record.markedAt || new Date().toISOString()
    }));

    const { data, error } = await supabase
      .from('attendance')
      .insert(records)
      .select();

    if (error) throw error;

    // Create notifications for students about their attendance
    await createAttendanceNotifications(records);

    // Create teacher notification about attendance activity
    await createTeacherAttendanceNotification(records);

    return new Response(JSON.stringify(data), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error saving attendance:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function createAttendanceNotifications(attendanceRecords) {
  try {
    const notifications = attendanceRecords.map(record => ({
      title: 'Attendance Marked',
      message: `Your attendance has been marked as ${record.status.charAt(0).toUpperCase() + record.status.slice(1)} for today's class.`,
      target_audience: 'specific_student',
      specific_student_id: record.student_id,
      priority: record.status === 'absent' ? 'medium' : 'low',
      notification_type: 'system_notification',
      sent_by: 'system',
      created_at: new Date().toISOString()
    }));

    // Insert notifications for students
    const { error } = await supabase
      .from('notifications')
      .insert(notifications);

    if (error) {
      console.error('Error creating attendance notifications:', error);
    }
  } catch (error) {
    console.error('Error in createAttendanceNotifications:', error);
  }
}

async function createTeacherAttendanceNotification(attendanceRecords) {
  try {
    // Get teacher information from the first record
    const teacherName = attendanceRecords[0]?.marked_by || 'teacher';
    const className = attendanceRecords[0]?.class;
    const section = attendanceRecords[0]?.section;

    // Count present and absent students
    const presentCount = attendanceRecords.filter(r => r.status === 'present').length;
    const absentCount = attendanceRecords.filter(r => r.status === 'absent').length;
    const lateCount = attendanceRecords.filter(r => r.status === 'late').length;

    // Create a summary message for the teacher
    let message = `Attendance marked for ${className} ${section}: `;
    const statusMessages = [];
    if (presentCount > 0) statusMessages.push(`${presentCount} present`);
    if (absentCount > 0) statusMessages.push(`${absentCount} absent`);
    if (lateCount > 0) statusMessages.push(`${lateCount} late`);

    message += statusMessages.join(', ');

    // Log attendance summary instead of saving to notifications table
    console.log('Attendance Summary:', {
      teacher: teacherName,
      class: className,
      section: section,
      summary: message,
      timestamp: new Date().toISOString()
    });

    // Note: Attendance notifications are no longer saved to the notifications table
    // to prevent them from appearing in the teacher's dashboard sidebar
    // The summary is logged for record-keeping purposes only

  } catch (error) {
    console.error('Error in createTeacherAttendanceNotification:', error);
  }
}

export async function PUT(request) {
  try {
    const { id, ...updateData } = await request.json();

    if (!id) {
      return new Response(JSON.stringify({ error: 'Missing attendance ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { data, error } = await supabase
      .from('attendance')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) throw error;

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error updating attendance:', error);
    return new Response(JSON.stringify({ error: error.message }), {
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
      return new Response(JSON.stringify({ error: 'Missing attendance ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { data, error } = await supabase
      .from('attendance')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error deleting attendance:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
