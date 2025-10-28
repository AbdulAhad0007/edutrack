import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// GET /api/student/grades - Get grades for a specific student
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');
    const subject = searchParams.get('subject');
    const academicYear = searchParams.get('academicYear');
    const examType = searchParams.get('examType');

    // Validate environment variables
    if (!supabaseUrl || !supabaseServiceKey) {
      return Response.json({
        data: [],
        grouped: {},
        summary: {
          totalGrades: 0,
          subjects: 0,
          averagePercentage: 0
        }
      });
    }

    if (!studentId) {
      return Response.json({
        data: [],
        grouped: {},
        summary: {
          totalGrades: 0,
          subjects: 0,
          averagePercentage: 0
        }
      });
    }

    // Query grades directly by student_uid (which stores UID string like "uid001")
    let query = supabase
      .from('grades')
      .select('*')
      .eq('student_uid', studentId)
      .order('exam_date', { ascending: false });

    if (subject) {
      query = query.eq('subject', subject);
    }

    if (academicYear) {
      query = query.eq('academic_year', academicYear);
    }

    if (examType) {
      query = query.eq('exam_type', examType);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching student grades:', error);
      // Return empty data instead of error
      return Response.json({
        data: [],
        grouped: {},
        summary: {
          totalGrades: 0,
          subjects: 0,
          averagePercentage: 0
        }
      });
    }

    // If no data found, return empty structure
    if (!data || data.length === 0) {
      return Response.json({
        data: [],
        grouped: {},
        summary: {
          totalGrades: 0,
          subjects: 0,
          averagePercentage: 0
        }
      });
    }

    // Group grades by subject for better organization
    const groupedGrades = data.reduce((acc, grade) => {
      if (!acc[grade.subject]) {
        acc[grade.subject] = [];
      }
      acc[grade.subject].push(grade);
      return acc;
    }, {});

    // Calculate summary statistics safely
    const validGrades = data.filter(grade => grade.percentage && !isNaN(parseFloat(grade.percentage)));
    const averagePercentage = validGrades.length > 0
      ? (validGrades.reduce((sum, grade) => sum + parseFloat(grade.percentage), 0) / validGrades.length).toFixed(2)
      : 0;

    return Response.json({
      data,
      grouped: groupedGrades,
      summary: {
        totalGrades: data.length,
        subjects: Object.keys(groupedGrades).length,
        averagePercentage: parseFloat(averagePercentage)
      }
    });

  } catch (error) {
    console.error('Error in GET /api/student/grades:', error);
    // Return empty data instead of error
    return Response.json({
      data: [],
      grouped: {},
      summary: {
        totalGrades: 0,
        subjects: 0,
        averagePercentage: 0
      }
    });
  }
}
