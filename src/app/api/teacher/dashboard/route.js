import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const teacherName = searchParams.get('teacherName');

    if (!teacherName) {
      return Response.json(
        { error: 'Teacher name is required' },
        { status: 400 }
      );
    }

    console.log('Fetching dashboard data for teacher:', teacherName);

    // First, let's check what teachers exist in the database
    const { data: availableTeachers, error: teachersError } = await supabase
      .from('teachers')
      .select('name');

    console.log('Available teachers:', availableTeachers?.map(t => t.name));

    // Get total students count for this specific teacher
    const { data: students, error: studentsError } = await supabase
      .from('students')
      .select('id, gender, class_teacher_name')
      .eq('class_teacher_name', teacherName);

    if (studentsError) {
      console.error('Error fetching students:', studentsError);
    }

    // Get total teachers count
    const { data: teachers, error: teacherCountError } = await supabase
      .from('teachers')
      .select('id')
      .eq('name', teacherName);

    if (teacherCountError) {
      console.error('Error fetching teachers:', teacherCountError);
    }

    // Get total employees count (teachers + staff)
    const { data: employees, error: employeesError } = await supabase
      .from('teachers')
      .select('id');

    if (employeesError) {
      console.error('Error fetching employees:', employeesError);
    }

    // Get attendance data for the current week
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6));

    const { data: attendanceData, error: attendanceError } = await supabase
      .from('attendance')
      .select('date, status, student_id')
      .gte('date', startOfWeek.toISOString().split('T')[0])
      .lte('date', endOfWeek.toISOString().split('T')[0])
      .in('student_id', students?.map(s => s.id) || []);

    if (attendanceError) {
      console.error('Error fetching attendance:', attendanceError);
    }

    // Calculate attendance by day
    const attendanceByDay = {};
    const daysOfWeek = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

    daysOfWeek.forEach(day => {
      attendanceByDay[day] = 0;
    });

    if (attendanceData) {
      attendanceData.forEach(record => {
        const dayOfWeek = daysOfWeek[new Date(record.date).getDay() - 1];
        if (dayOfWeek && record.status === 'present') {
          attendanceByDay[dayOfWeek]++;
        }
      });
    }

    // Calculate percentages
    const totalStudents = students?.length || 0;
    const totalAttendanceRecords = attendanceData?.length || 0;

    Object.keys(attendanceByDay).forEach(day => {
      const dayAttendance = attendanceByDay[day];
      attendanceByDay[day] = totalStudents > 0 ? Math.round((dayAttendance / totalStudents) * 100) : 0;
    });

    // Get gender distribution
    const genderDistribution = {
      boys: students?.filter(s => s.gender?.toLowerCase() === 'male').length || 0,
      girls: students?.filter(s => s.gender?.toLowerCase() === 'female').length || 0
    };

    // Get notices
    const { data: notices, error: noticesError } = await supabase
      .from('notifications')
      .select('id, title, content, created_at, views')
      .order('created_at', { ascending: false })
      .limit(4);

    if (noticesError) {
      console.error('Error fetching notices:', noticesError);
    }

    // Format notices
    const formattedNotices = notices?.map(notice => ({
      id: notice.id,
      title: notice.title,
      date: new Date(notice.created_at).toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      views: notice.views || '0',
      content: notice.content
    })) || [];

    // Calculate total earnings (this would typically come from a fees/payments table)
    const totalEarnings = 10000; // Placeholder - would calculate from actual fee records

    const dashboardData = {
      totalStudents: totalStudents,
      totalTeachers: teachers?.length || 0,
      totalEmployees: employees?.length || 0,
      totalEarnings: totalEarnings,
      studentsByGender: genderDistribution,
      attendanceData: attendanceByDay,
      notices: formattedNotices,
      teacherInfo: {
        name: teacherName,
        studentsCount: totalStudents,
        classesCount: [...new Set(students?.map(s => s.class) || [])].length,
        availableTeachers: availableTeachers?.map(t => t.name) || [],
        debugInfo: {
          studentsFound: students?.length || 0,
          studentsError: studentsError?.message || null,
          teacherCountError: teacherCountError?.message || null
        }
      }
    };

    console.log('Dashboard data fetched successfully:', dashboardData);

    return Response.json({
      success: true,
      data: dashboardData
    });

  } catch (error) {
    console.error('Error in dashboard API:', error);
    return Response.json(
      {
        error: 'Internal server error',
        details: error.message
      },
      { status: 500 }
    );
  }
}
