import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    const { data, error } = await supabase.from('timetable').select('*');
    if (error) throw error;
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function POST(request) {
  try {
    const timetable = await request.json();

    // Validate required fields
    if (!timetable.class || !timetable.day_of_week || !timetable.period || !timetable.subject || !timetable.teacher_name || !timetable.start_time || !timetable.end_time) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    // Validate class format (should be like "10th Grade", "11th Grade", "12th Grade", etc.)
    const validClasses = ['10th Grade', '11th Grade', '12th Grade', 'Computer Engineering', 'Mechanical Engineering', 'Electrical Engineering'];
    const normalizedClass = timetable.class.trim();

    // If class contains section info, separate it
    let className = normalizedClass;
    let section = null;

    if (normalizedClass.includes('Section-') || normalizedClass.includes('Section ')) {
      const parts = normalizedClass.split(/\s*Section[- ]?\s*/i);
      className = parts[0].trim();
      section = parts[1]?.trim() || null;
    }

    // Validate class name
    if (!validClasses.some(validClass => className.toLowerCase().includes(validClass.toLowerCase()))) {
      return new Response(JSON.stringify({
        error: `Invalid class format. Please use formats like: ${validClasses.join(', ')}`
      }), { status: 400 });
    }

    // Validate time format
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
    if (!timeRegex.test(timetable.start_time) || !timeRegex.test(timetable.end_time)) {
      return new Response(JSON.stringify({ error: 'Invalid time format. Use HH:MM:SS format' }), { status: 400 });
    }

    // Validate day of week
    const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    if (!validDays.includes(timetable.day_of_week)) {
      return new Response(JSON.stringify({ error: 'Invalid day of week' }), { status: 400 });
    }

    // Validate period
    if (timetable.period < 1 || timetable.period > 8) {
      return new Response(JSON.stringify({ error: 'Period must be between 1 and 8' }), { status: 400 });
    }

    // Prepare data with normalized values
    const normalizedData = {
      ...timetable,
      class: className,
      section: section || timetable.section,
      subject: timetable.subject.trim(),
      teacher_name: timetable.teacher_name.trim(),
      room_number: timetable.room_number?.trim() || null
    };

    const { data, error } = await supabase.from('timetable').insert([normalizedData]);
    if (error) throw error;
    return new Response(JSON.stringify(data), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const timetable = await request.json();

    // Validate required fields
    if (!timetable.id) {
      return new Response(JSON.stringify({ error: 'Missing id' }), { status: 400 });
    }

    if (!timetable.class || !timetable.day_of_week || !timetable.period || !timetable.subject || !timetable.teacher_name || !timetable.start_time || !timetable.end_time) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    const { data, error } = await supabase
      .from('timetable')
      .update({
        class: timetable.class,
        section: timetable.section,
        day_of_week: timetable.day_of_week,
        period: timetable.period,
        subject: timetable.subject,
        teacher_name: timetable.teacher_name,
        start_time: timetable.start_time,
        end_time: timetable.end_time,
        room_number: timetable.room_number
      })
      .eq('id', timetable.id);

    if (error) throw error;
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return new Response(JSON.stringify({ error: 'Missing id' }), { status: 400 });
    const { data, error } = await supabase.from('timetable').delete().eq('id', id);
    if (error) throw error;
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
