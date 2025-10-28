import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// GET /api/admin/attendance - Get all attendance data with analytics
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const classFilter = searchParams.get('class');
    const section = searchParams.get('section');
    const date = searchParams.get('date');
    const period = searchParams.get('period') || 'month'; // week, month, year

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
      default:
        startDate.setMonth(now.getMonth() - 1);
    }

    let query = supabase
      .from('attendance')
      .select('*')
      .gte('date', startDate.toISOString().split('T')[0])
      .lte('date', now.toISOString().split('T')[0])
      .order('date', { ascending: false });

    if (classFilter) {
      query = query.eq('class', classFilter);
    }

    if (section) {
      query = query.eq('section', section);
    }

    if (date) {
      query = query.eq('date', date);
    }

    const { data: attendanceData, error } = await query;

    if (error) {
      console.error('Error fetching attendance:', error);
      return new Response(JSON.stringify({ error: 'Failed to fetch attendance data' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Calculate analytics
    const totalRecords = attendanceData.length;
    const presentCount = attendanceData.filter(record => record.status === 'present').length;
    const absentCount = attendanceData.filter(record => record.status === 'absent').length;
    const lateCount = attendanceData.filter(record => record.status === 'late').length;

    const overallAttendancePercentage = totalRecords > 0 ? (presentCount / totalRecords) * 100 : 0;

    // Group by student
    const studentStats = {};
    attendanceData.forEach(record => {
      const studentId = record.roll_number;
      if (!studentStats[studentId]) {
        studentStats[studentId] = {
          total: 0,
          present: 0,
          absent: 0,
          late: 0,
          percentage: 0
        };
      }
      studentStats[studentId].total++;
      if (record.status === 'present') studentStats[studentId].present++;
      else if (record.status === 'absent') studentStats[studentId].absent++;
      else if (record.status === 'late') studentStats[studentId].late++;
    });

    // Calculate percentages for each student
    Object.keys(studentStats).forEach(studentId => {
      const stats = studentStats[studentId];
      stats.percentage = stats.total > 0 ? (stats.present / stats.total) * 100 : 0;
    });

    // Group by date for trend
    const dateStats = {};
    attendanceData.forEach(record => {
      if (!dateStats[record.date]) {
        dateStats[record.date] = { total: 0, present: 0, absent: 0, late: 0 };
      }
      dateStats[record.date].total++;
      if (record.status === 'present') dateStats[record.date].present++;
      else if (record.status === 'absent') dateStats[record.date].absent++;
      else if (record.status === 'late') dateStats[record.date].late++;
    });

    // Convert to arrays for charts
    const attendanceTrend = Object.keys(dateStats).sort().map(date => {
      const stats = dateStats[date];
      return {
        date,
        percentage: stats.total > 0 ? (stats.present / stats.total) * 100 : 0,
        present: stats.present,
        absent: stats.absent,
        late: stats.late
      };
    });

    const analytics = {
      period,
      totalRecords,
      presentCount,
      absentCount,
      lateCount,
      overallAttendancePercentage: Math.round(overallAttendancePercentage * 100) / 100,
      studentStats,
      attendanceTrend,
      summary: {
        excellent: overallAttendancePercentage >= 90,
        good: overallAttendancePercentage >= 75 && overallAttendancePercentage < 90,
        needsImprovement: overallAttendancePercentage < 75
      }
    };

    return new Response(JSON.stringify(analytics), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error in GET /api/admin/attendance:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
