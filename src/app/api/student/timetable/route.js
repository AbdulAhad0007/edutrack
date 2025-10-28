import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');
    const searchClass = searchParams.get('class');
    const searchSection = searchParams.get('section');
    const searchSubject = searchParams.get('subject');
    const searchDay = searchParams.get('day');
    const searchTeacher = searchParams.get('teacher');
    const showAll = searchParams.get('showAll') === 'true';

    // Validate environment variables
    if (!supabaseUrl || !supabaseKey) {
      return new Response(JSON.stringify({
        timetable: [],
        groupedTimetable: {},
        filters: {},
        totalEntries: 0,
        availableClasses: [],
        availableSections: [],
        availableSubjects: [],
        availableDays: []
      }), { status: 200 });
    }

    let classToUse = searchClass;
    let sectionToUse = searchSection;

    // If studentId is provided and not showing all, look up the student's class and section
    if (studentId && !showAll) {
      const { data: studentData, error: studentError } = await supabase
        .from('students')
        .select('class, section')
        .eq('uid', studentId)
        .single();

      if (studentError) {
        console.error('Error fetching student data:', studentError);
        // Return empty data instead of error
        return new Response(JSON.stringify({
          timetable: [],
          groupedTimetable: {},
          filters: { studentId, searchClass, searchSection, searchSubject, searchDay, searchTeacher },
          totalEntries: 0,
          availableClasses: [],
          availableSections: [],
          availableSubjects: [],
          availableDays: []
        }), { status: 200 });
      }

      classToUse = studentData?.class;
      sectionToUse = studentData?.section;
    }

    // Build query - if showAll is true, get all records, otherwise filter by class/section
    let query = supabase.from('timetable').select('*');

    if (showAll) {
      // For showAll, apply search filters but don't filter by specific class/section
      if (searchClass) {
        query = query.eq('class', searchClass);
      }
      if (searchSection) {
        query = query.eq('section', searchSection);
      }
      if (searchSubject) {
        query = query.ilike('subject', `%${searchSubject}%`);
      }
      if (searchDay) {
        query = query.eq('day_of_week', searchDay);
      }
      if (searchTeacher) {
        query = query.ilike('teacher_name', `%${searchTeacher}%`);
      }
    } else {
      // For student-specific view, filter by their class/section
      if (classToUse) {
        query = query.eq('class', classToUse);
      }
      if (sectionToUse) {
        query = query.eq('section', sectionToUse);
      }
    }

    // Order by day and period for consistent display
    query = query.order('day_of_week', { ascending: true })
                 .order('period', { ascending: true });

    const { data, error } = await query;

    if (error) {
      console.error('Database error:', error);
      // Return empty data instead of error
      return new Response(JSON.stringify({
        timetable: [],
        groupedTimetable: {},
        filters: { studentId, searchClass, searchSection, searchSubject, searchDay, searchTeacher, showAll },
        totalEntries: 0,
        availableClasses: [],
        availableSections: [],
        availableSubjects: [],
        availableDays: []
      }), { status: 200 });
    }

    // Get unique values for filter dropdowns
    const availableClasses = [...new Set(data.map(item => item.class))].filter(Boolean);
    const availableSections = [...new Set(data.map(item => item.section))].filter(Boolean);
    const availableSubjects = [...new Set(data.map(item => item.subject))].filter(Boolean);
    const availableDays = [...new Set(data.map(item => item.day_of_week))].filter(Boolean);

    // Group timetable by day for better organization
    const groupedTimetable = data.reduce((acc, entry) => {
      if (!acc[entry.day_of_week]) {
        acc[entry.day_of_week] = [];
      }
      acc[entry.day_of_week].push(entry);
      return acc;
    }, {});

    return new Response(JSON.stringify({
      timetable: data,
      groupedTimetable,
      filters: {
        studentId,
        searchClass,
        searchSection,
        searchSubject,
        searchDay,
        searchTeacher,
        showAll
      },
      totalEntries: data.length,
      availableClasses,
      availableSections,
      availableSubjects,
      availableDays
    }), { status: 200 });

  } catch (error) {
    console.error('Error fetching timetable:', error);
    // Return empty data instead of error
    return new Response(JSON.stringify({
      timetable: [],
      groupedTimetable: {},
      filters: {},
      totalEntries: 0,
      availableClasses: [],
      availableSections: [],
      availableSubjects: [],
      availableDays: []
    }), { status: 200 });
  }
}
