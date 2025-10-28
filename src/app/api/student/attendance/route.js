import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// GET /api/student/attendance - Get attendance data and percentage for a student
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');
    const period = searchParams.get('period') || 'week'; // week, month, year, all

    if (!studentId) {
      return new Response(JSON.stringify({ error: 'Student ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Calculate date range based on period
    const now = new Date();
    let startDate = new Date();

    switch (period) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      case 'all':
        startDate = new Date('2020-01-01'); // Far back enough to get all records
        break;
      default:
        startDate.setDate(now.getDate() - 7);
    }

    // Handle attendance records where student UIDs are stored as roll numbers
    let attendanceQuery = supabase
      .from('attendance')
      .select('*')
      .gte('date', startDate.toISOString().split('T')[0])
      .lte('date', now.toISOString().split('T')[0])
      .order('date', { ascending: false });

    // Since UIDs are stored as roll numbers in attendance database, use studentId to match roll_number field
    // The studentId from session is a UID string like "uid001", which matches the roll_number field
    attendanceQuery = attendanceQuery.eq('roll_number', studentId);

    const { data: attendanceData, error: attendanceError } = await attendanceQuery;

    if (attendanceError) {
      console.error('Error fetching attendance:', attendanceError);
      return new Response(JSON.stringify({ error: 'Failed to fetch attendance data' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Fetch teacher names for the attendance records
    let teacherMap = {};
    if (attendanceData && attendanceData.length > 0) {
      const teacherUids = [...new Set(attendanceData.map(record => record.teacher_uid).filter(Boolean))];
      if (teacherUids.length > 0) {
        const { data: teachers, error: teacherError } = await supabase
          .from('teachers')
          .select('uid, name')
          .in('uid', teacherUids);

        if (!teacherError && teachers) {
          teacherMap = teachers.reduce((map, teacher) => {
            map[teacher.uid] = teacher.name;
            return map;
          }, {});
        }
      }
    }

    // Add teacher_name to each attendance record
    const attendanceDataWithTeachers = attendanceData.map(record => ({
      ...record,
      teacher_name: teacherMap[record.teacher_uid] || 'N/A'
    }));

    // Calculate attendance statistics
    const totalRecords = attendanceData.length;
    const presentCount = attendanceData.filter(record => record.status === 'present').length;
    const absentCount = attendanceData.filter(record => record.status === 'absent').length;
    const lateCount = attendanceData.filter(record => record.status === 'late').length;

    const attendancePercentage = totalRecords > 0 ? (presentCount / totalRecords) * 100 : 0;

    // Get today's attendance
    const today = now.toISOString().split('T')[0];
    const todayAttendance = attendanceData.find(record => record.date === today);

    // Get all attendance records with teacher names
    const recentAttendance = attendanceDataWithTeachers;

    // Calculate streak information
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    // Calculate attendance streaks
    for (const record of attendanceData) {
      if (record.status === 'present') {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    }

    // Calculate current streak (consecutive present days from most recent)
    for (let i = 0; i < attendanceData.length; i++) {
      if (attendanceData[i].status === 'present') {
        currentStreak++;
      } else {
        break;
      }
    }

    const attendanceStats = {
      period,
      totalRecords,
      presentCount,
      absentCount,
      lateCount,
      attendancePercentage: Math.round(attendancePercentage * 100) / 100, // Round to 2 decimal places
      todayAttendance: todayAttendance ? {
        status: todayAttendance.status,
        class: todayAttendance.class,
        section: todayAttendance.section,
        markedAt: todayAttendance.marked_at
      } : null,
      recentAttendance,
      streaks: {
        current: currentStreak,
        longest: longestStreak
      },
      summary: {
        excellent: attendancePercentage >= 90,
        good: attendancePercentage >= 75 && attendancePercentage < 90,
        needsImprovement: attendancePercentage < 75
      }
    };

    return new Response(JSON.stringify(attendanceStats), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error in GET /api/student/attendance:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
