import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// GET /api/admin/grades - Get all grades with optional filters
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const subject = searchParams.get('subject');
    const academicYear = searchParams.get('academicYear');
    const examType = searchParams.get('examType');
    const studentId = searchParams.get('studentId');

    // Validate environment variables
    if (!supabaseUrl || !supabaseServiceKey) {
      return Response.json({
        data: [],
        grouped: {},
        summary: {
          totalGrades: 0,
          subjects: 0,
          students: 0,
          averagePercentage: 0
        }
      });
    }

    // Query all grades
    let query = supabase
      .from('grades')
      .select('*')
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

    if (studentId) {
      query = query.eq('student_uid', studentId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching all grades:', error);
      return Response.json({
        data: [],
        grouped: {},
        summary: {
          totalGrades: 0,
          subjects: 0,
          students: 0,
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
          students: 0,
          averagePercentage: 0
        }
      });
    }

    // Group grades by student for better organization
    const groupedGrades = data.reduce((acc, grade) => {
      if (!acc[grade.student_uid]) {
        acc[grade.student_uid] = [];
      }
      acc[grade.student_uid].push(grade);
      return acc;
    }, {});

    // Calculate summary statistics safely
    const validGrades = data.filter(grade => grade.percentage && !isNaN(parseFloat(grade.percentage)));
    const averagePercentage = validGrades.length > 0
      ? (validGrades.reduce((sum, grade) => sum + parseFloat(grade.percentage), 0) / validGrades.length).toFixed(2)
      : 0;

    const uniqueStudents = new Set(data.map(grade => grade.student_uid)).size;

    return Response.json({
      data,
      grouped: groupedGrades,
      summary: {
        totalGrades: data.length,
        subjects: new Set(data.map(grade => grade.subject)).size,
        students: uniqueStudents,
        averagePercentage: parseFloat(averagePercentage)
      }
    });

  } catch (error) {
    console.error('Error in GET /api/admin/grades:', error);
    return Response.json({
      data: [],
      grouped: {},
      summary: {
        totalGrades: 0,
        subjects: 0,
        students: 0,
        averagePercentage: 0
      }
    });
  }
}
