import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// GET /api/teacher/exams - Get all exams created by teacher
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const teacherId = searchParams.get('teacherId');
    const classFilter = searchParams.get('class');
    const subject = searchParams.get('subject');
    const isActive = searchParams.get('isActive');

    if (!teacherId) {
      return Response.json({ error: 'Teacher ID is required' }, { status: 400 });
    }

    // Add pagination for better performance
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    let query = supabase
      .from('exams')
      .select('*', { count: 'exact' })
      .eq('teacher_uid', teacherId)
      .order('exam_date', { ascending: true })
      .range(offset, offset + limit - 1);

    if (classFilter) {
      query = query.eq('class', classFilter);
    }

    if (subject) {
      query = query.eq('subject', subject);
    }

    if (isActive !== null && isActive !== undefined) {
      query = query.eq('is_active', isActive === 'true');
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching exams:', error);
      return Response.json({ error: 'Failed to fetch exams' }, { status: 500 });
    }

    return Response.json({ data });
  } catch (error) {
    console.error('Error in GET /api/teacher/exams:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/teacher/exams - Create new exam
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      subject,
      teacher_id,
      teacher_name,
      class: className,
      section,
      exam_date,
      start_time,
      end_time,
      total_marks,
      passing_marks,
      instructions,
      room_number,
      academic_year,
      semester,
      exam_type
    } = body;

    // Validate required fields
    if (!title || !subject || !teacher_id || !className || !exam_date || !start_time || !end_time || !total_marks || !academic_year || !exam_type) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('exams')
      .insert([{
        title,
        description,
        subject,
        teacher_uid: teacher_id,
        teacher_name,
        class: className,
        section,
        exam_date,
        start_time,
        end_time,
        total_marks,
        passing_marks,
        instructions,
        room_number,
        academic_year,
        semester,
        exam_type
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating exam:', error);
      return Response.json({ error: 'Failed to create exam' }, { status: 500 });
    }

    return Response.json({ data }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/teacher/exams:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/teacher/exams - Update existing exam
export async function PUT(request) {
  try {
    const body = await request.json();
    const {
      id,
      title,
      description,
      subject,
      teacher_id,
      teacher_name,
      class: className,
      section,
      exam_date,
      start_time,
      end_time,
      total_marks,
      passing_marks,
      instructions,
      room_number,
      academic_year,
      semester,
      exam_type,
      is_active
    } = body;

    if (!id) {
      return Response.json({ error: 'Exam ID is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('exams')
      .update({
        title,
        description,
        subject,
        teacher_uid: teacher_id,
        teacher_name,
        class: className,
        section,
        exam_date,
        start_time,
        end_time,
        total_marks,
        passing_marks,
        instructions,
        room_number,
        academic_year,
        semester,
        exam_type,
        is_active,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating exam:', error);
      return Response.json({ error: 'Failed to update exam' }, { status: 500 });
    }

    return Response.json({ data });
  } catch (error) {
    console.error('Error in PUT /api/teacher/exams:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/teacher/exams - Delete exam
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return Response.json({ error: 'Exam ID is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('exams')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting exam:', error);
      return Response.json({ error: 'Failed to delete exam' }, { status: 500 });
    }

    return Response.json({ message: 'Exam deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/teacher/exams:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
