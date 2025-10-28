import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables:', {
    NEXT_PUBLIC_SUPABASE_URL: !!supabaseUrl,
    SUPABASE_SERVICE_ROLE_KEY: !!supabaseServiceKey
  });
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const teacherId = searchParams.get('teacherId');
    const studentId = searchParams.get('studentId');
    const subject = searchParams.get('subject');
    const academicYear = searchParams.get('academicYear');

    if (!teacherId) {
      return Response.json({ error: 'Teacher ID is required' }, { status: 400 });
    }

    let query = supabase
      .from('grades')
      .select('*')
      .eq('teacher_uid', teacherId)
      .order('exam_date', { ascending: false });

    if (studentId) {
      query = query.eq('student_uid', studentId);
    }

    if (subject) {
      query = query.eq('subject', subject);
    }

    if (academicYear) {
      query = query.eq('academic_year', academicYear);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching grades:', error);
      return Response.json({
        error: 'Failed to fetch grades',
        details: error.message || 'Database error occurred',
        code: error.code
      }, { status: 500 });
    }

    return Response.json({ data });
  } catch (error) {
    console.error('Error in GET /api/teacher/grades:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET_STUDENTS(request) {
  try {
    const { searchParams } = new URL(request.url);
    const teacherName = searchParams.get('teacherName');

    if (!teacherName) {
      return Response.json({ error: 'Teacher name is required' }, { status: 400 });
    }
    const { data: students, error } = await supabase
      .from('students')
      .select('*')
      .eq('class_teacher_name', teacherName)
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching teacher students:', error);
      return Response.json({ error: 'Failed to fetch students' }, { status: 500 });
    }

    return Response.json({ data: students });
  } catch (error) {
    console.error('Error in GET_STUDENTS /api/teacher/grades:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return Response.json({
        error: 'Invalid request body',
        details: 'Request body must be valid JSON'
      }, { status: 400 });
    }
    const {
      student_id,
      student_name,
      student_class,
      student_section,
      subject,
      teacher_uid,
      teacher_name,
      marks_obtained,
      total_marks,
      academic_year,
      semester,
      exam_type,
      exam_date,
      remarks
    } = body;

    const missingFields = [];
    if (!student_id) missingFields.push('student_id');
    if (!student_name) missingFields.push('student_name');
    if (!subject) missingFields.push('subject');
    if (!teacher_uid) missingFields.push('teacher_uid');
    if (!marks_obtained) missingFields.push('marks_obtained');
    if (!total_marks) missingFields.push('total_marks');
    if (!academic_year) missingFields.push('academic_year');
    if (!exam_type) missingFields.push('exam_type');
    if (!exam_date) missingFields.push('exam_date');

    if (missingFields.length > 0) {
      console.log('Missing fields:', missingFields);
      console.log('Request body:', JSON.stringify(body, null, 2));
      return Response.json({
        error: 'Missing required fields',
        details: `Missing fields: ${missingFields.join(', ')}`,
        missingFields: missingFields,
        receivedData: body
      }, { status: 400 });
    }

    // Validate marks
    const marksObtained = parseFloat(marks_obtained);
    const totalMarks = parseFloat(total_marks);

    if (isNaN(marksObtained) || isNaN(totalMarks) || marksObtained < 0 || totalMarks <= 0) {
      return Response.json({
        error: 'Invalid marks',
        details: 'Marks obtained and total marks must be valid positive numbers'
      }, { status: 400 });
    }

    if (marksObtained > totalMarks) {
      return Response.json({
        error: 'Invalid marks',
        details: 'Marks obtained cannot be greater than total marks'
      }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('grades')
      .insert([{
        student_id: student_id, // Set student_id column
        student_uid: student_id, // Also set student_uid for compatibility
        student_name,
        student_class,
        student_section,
        subject,
        teacher_uid,
        teacher_name,
        marks_obtained: marksObtained,
        total_marks: totalMarks,
        // Note: percentage is automatically calculated by the database as a generated column
        // Note: grade is automatically calculated by the database trigger
        academic_year,
        semester,
        exam_type,
        exam_date,
        remarks
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating grade:', error);
      return Response.json({
        error: 'Failed to create grade',
        details: error.message || 'Database error occurred',
        code: error.code
      }, { status: 500 });
    }

    return Response.json({ data }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/teacher/grades:', error);
    console.error('Error stack:', error.stack);
    return Response.json({
      error: 'Internal server error',
      details: error.message || 'An unexpected error occurred',
      stack: error.stack
    }, { status: 500 });
  }
}

// PUT /api/teacher/grades - Update existing grade
export async function PUT(request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return Response.json({
        error: 'Invalid request body',
        details: 'Request body must be valid JSON'
      }, { status: 400 });
    }
    const {
      id,
      student_id,
      student_name,
      student_class,
      student_section,
      subject,
      teacher_uid,
      teacher_name,
      marks_obtained,
      total_marks,
      academic_year,
      semester,
      exam_type,
      exam_date,
      remarks
    } = body;

    if (!id) {
      return Response.json({ error: 'Grade ID is required' }, { status: 400 });
    }

    // Validate required fields
    if (!student_id || !student_name || !subject || !teacher_uid || !marks_obtained || !total_marks || !academic_year || !exam_type || !exam_date) {
      return Response.json({
        error: 'Missing required fields',
        details: 'Please ensure all required fields are filled: student, subject, marks, exam type, and date'
      }, { status: 400 });
    }

    // Validate marks
    const marksObtained = parseFloat(marks_obtained);
    const totalMarks = parseFloat(total_marks);

    if (isNaN(marksObtained) || isNaN(totalMarks) || marksObtained < 0 || totalMarks <= 0) {
      return Response.json({
        error: 'Invalid marks',
        details: 'Marks obtained and total marks must be valid positive numbers'
      }, { status: 400 });
    }

    if (marksObtained > totalMarks) {
      return Response.json({
        error: 'Invalid marks',
        details: 'Marks obtained cannot be greater than total marks'
      }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('grades')
      .update({
        student_id: student_id, // Set student_id column
        student_uid: student_id, // Also set student_uid for compatibility
        student_name,
        student_class,
        student_section,
        subject,
        teacher_uid,
        teacher_name,
        marks_obtained: marksObtained,
        total_marks: totalMarks,
        // Note: percentage is automatically calculated by the database as a generated column
        // Note: grade is automatically calculated by the database trigger
        academic_year,
        semester,
        exam_type,
        exam_date,
        remarks,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating grade:', error);
      return Response.json({
        error: 'Failed to update grade',
        details: error.message || 'Database error occurred',
        code: error.code
      }, { status: 500 });
    }

    return Response.json({ data });
  } catch (error) {
    console.error('Error in PUT /api/teacher/grades:', error);
    console.error('Error stack:', error.stack);
    return Response.json({
      error: 'Internal server error',
      details: error.message || 'An unexpected error occurred',
      stack: error.stack
    }, { status: 500 });
  }
}

// DELETE /api/teacher/grades - Delete grade
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return Response.json({ error: 'Grade ID is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('grades')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting grade:', error);
      return Response.json({
        error: 'Failed to delete grade',
        details: error.message || 'Database error occurred',
        code: error.code
      }, { status: 500 });
    }

    return Response.json({ message: 'Grade deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/teacher/grades:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
