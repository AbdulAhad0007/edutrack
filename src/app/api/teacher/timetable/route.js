import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request) {
  try {
    // Get teacher information from session
    const { searchParams } = new URL(request.url);
    const teacherName = searchParams.get('teacher');

    if (!teacherName) {
      return new Response(JSON.stringify({ error: 'Teacher name is required' }), { status: 400 });
    }

    // Filter timetable by teacher's name
    const { data, error } = await supabase
      .from('timetable')
      .select('*')
      .eq('teacher_name', teacherName)
      .order('class', { ascending: true })
      .order('day_of_week', { ascending: true })
      .order('period', { ascending: true });

    if (error) throw error;

    // Group timetable by class and day for better organization
    const groupedTimetable = data.reduce((acc, entry) => {
      if (!acc[entry.class]) {
        acc[entry.class] = {};
      }
      if (!acc[entry.class][entry.day_of_week]) {
        acc[entry.class][entry.day_of_week] = [];
      }
      acc[entry.class][entry.day_of_week].push(entry);
      return acc;
    }, {});

    // Get unique classes and subjects for the teacher
    const uniqueClasses = [...new Set(data.map(entry => entry.class))];
    const uniqueSubjects = [...new Set(data.map(entry => entry.subject))];

    return new Response(JSON.stringify({
      timetable: data,
      groupedTimetable,
      teacher: teacherName,
      classes: uniqueClasses,
      subjects: uniqueSubjects,
      totalEntries: data.length
    }), { status: 200 });
  } catch (error) {
    console.error('Error fetching teacher timetable:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
