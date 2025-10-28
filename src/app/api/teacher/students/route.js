import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// GET /api/teacher/students - Get students assigned to teacher
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const teacherName = searchParams.get('teacherName');

    if (!teacherName) {
      return Response.json({ error: 'Teacher name is required' }, { status: 400 });
    }

    console.log('Fetching students for teacher:', teacherName);

    // Fetch students assigned to this teacher
    const { data: students, error } = await supabase
      .from('students')
      .select('*')
      .eq('class_teacher_name', teacherName)
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching teacher students:', error);

      // If the table doesn't exist, provide helpful error message
      if (error.code === '42P01') {
        return Response.json({
          error: 'Database table not found',
          details: 'The students table does not exist. Please run the database setup script.',
          solution: 'Execute the SQL script in supabase-students-table-schema.sql in your Supabase SQL editor'
        }, { status: 500 });
      }

      return Response.json({ error: 'Failed to fetch students', details: error.message }, { status: 500 });
    }

    console.log('Found', students?.length || 0, 'students for teacher:', teacherName);

    // If no students found for this teacher, try to get all students as fallback
    if (!students || students.length === 0) {
      console.log('No students found for teacher, fetching all students as fallback...');

      const { data: allStudents, error: allError } = await supabase
        .from('students')
        .select('*')
        .order('name', { ascending: true });

      if (allError) {
        console.error('Error fetching all students:', allError);
        return Response.json({
          error: 'No students found',
          details: 'No students are assigned to this teacher and no students exist in the database.',
          teacherName: teacherName
        }, { status: 404 });
      }

      console.log('Found', allStudents?.length || 0, 'total students in database');

      return Response.json({
        data: allStudents,
        message: 'No students specifically assigned to this teacher. Showing all students.',
        fallback: true
      });
    }

    return Response.json({ data: students });
  } catch (error) {
    console.error('Error in GET /api/teacher/students:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/teacher/students - Add new student (for teachers)
export async function POST(request) {
  try {
    const { searchParams } = new URL(request.url);
    const teacherName = searchParams.get('teacherName');

    if (!teacherName) {
      return Response.json({ error: 'Teacher name is required' }, { status: 400 });
    }

    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      return Response.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const {
      password,
      name,
      age,
      dob,
      address,
      gender,
      class: studentClass,
      course,
      section
    } = body;

    // Validate required fields
    if (!password || !name) {
      return Response.json({ error: 'Password and name are required' }, { status: 400 });
    }

    // Get the next available UID
    const { data: maxUidData, error: maxUidError } = await supabase
      .from('students')
      .select('uid')
      .order('uid', { ascending: false })
      .limit(1);

    if (maxUidError) {
      console.error('Error fetching max UID:', maxUidError);
      return Response.json({ error: 'Failed to generate UID' }, { status: 500 });
    }

    const nextUid = maxUidData && maxUidData.length > 0 ? maxUidData[0].uid + 1 : 1;

    // Insert new student
    const { data, error } = await supabase
      .from('students')
      .insert([{
        uid: nextUid,
        password,
        name,
        age,
        dob,
        address,
        gender,
        class: studentClass,
        course,
        section,
        class_teacher_name: teacherName
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating student:', error);
      return Response.json({ error: 'Failed to create student', details: error.message }, { status: 500 });
    }

    return Response.json({ data }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/teacher/students:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
