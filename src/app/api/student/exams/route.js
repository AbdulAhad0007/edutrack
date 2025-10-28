import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// GET /api/student/exams - Get exams for students (filtered by class/section when studentId provided)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');
    const showAll = searchParams.get('showAll') === 'true';
    const upcoming = searchParams.get('upcoming') === 'true';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    // Validate environment variables
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase configuration');
      return Response.json({
        data: [],
        upcoming: [],
        past: [],
        error: 'Database configuration error',
        pagination: { page: 1, limit: 50, total: 0, totalPages: 0 }
      });
    }

    let classToUse = null;
    let sectionToUse = null;

    // If studentId is provided and not showing all, look up the student's class and section
    if (studentId && !showAll) {
      const { data: studentData, error: studentError } = await supabase
        .from('students')
        .select('class, section')
        .eq('uid', studentId)
        .single();

      if (studentError) {
        console.error('Error fetching student data:', studentError);
        return Response.json({
          data: [],
          upcoming: [],
          past: [],
          error: `Failed to fetch student information: ${studentError.message}`,
          pagination: { page, limit, total: 0, totalPages: 0 }
        });
      }

      classToUse = studentData?.class;
      sectionToUse = studentData?.section;
    }

    let query = supabase
      .from('exams')
      .select('*', { count: 'exact' })
      .eq('is_active', true)
      .order('exam_date', { ascending: true })
      .range(offset, offset + limit - 1);

    // Filter by student's class and section when not in showAll mode
    if (!showAll && classToUse) {
      query = query.eq('class', classToUse);
      if (sectionToUse) {
        query = query.eq('section', sectionToUse);
      }
    }

    // Add date filter for upcoming exams
    if (upcoming) {
      const today = new Date().toISOString().split('T')[0];
      query = query.gte('exam_date', today);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Database error:', error);
      return Response.json({
        data: [],
        upcoming: [],
        past: [],
        error: `Database error: ${error.message}`,
        pagination: { page, limit, total: 0, totalPages: 0 }
      });
    }

    // Separate upcoming and past exams
    const today = new Date().toISOString().split('T')[0];
    const upcomingExams = data.filter(exam => exam.exam_date >= today);
    const pastExams = data.filter(exam => exam.exam_date < today);

    console.log(`Found ${data.length} total exams, ${upcomingExams.length} upcoming, ${pastExams.length} past`);

    return Response.json({
      data,
      upcoming: upcomingExams,
      past: pastExams,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit)
      },
      success: true,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('API Error:', error);
    return Response.json({
      data: [],
      upcoming: [],
      past: [],
      error: `Internal server error: ${error.message}`,
      pagination: { page: 1, limit: 50, total: 0, totalPages: 0 }
    });
  }
}

// POST /api/student/exams/generate-pdf - Generate PDF for student's exams
export async function POST(request) {
  try {
    const body = await request.json();
    const { studentId, studentName, studentClass, studentSection, examIds } = body;

    if (!studentId || !studentName || !studentClass || !examIds || examIds.length === 0) {
      return Response.json({ error: 'Student details and exam IDs are required' }, { status: 400 });
    }

    // Fetch exam details
    const { data: exams, error } = await supabase
      .from('exams')
      .select('*')
      .in('id', examIds)
      .eq('class', studentClass)
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching exams for PDF:', error);
      return Response.json({ error: 'Failed to fetch exam details' }, { status: 500 });
    }

    // Generate PDF using jsPDF
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();

    // Set font
    doc.setFont('helvetica');

    // Header
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('EXAM ADMIT CARD', 105, 30, { align: 'center' });

    // Academic Year
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Academic Year: ${exams[0]?.academic_year || '2025-26'}`, 105, 45, { align: 'center' });

    // Student Information
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Student Information', 20, 65);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Name: ${studentName}`, 20, 80);
    doc.text(`Student ID: ${studentId}`, 20, 90);
    doc.text(`Class: ${studentClass}`, 20, 100);
    doc.text(`Section: ${studentSection || 'N/A'}`, 20, 110);

    // Exam Details Header
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Exam Details', 20, 130);

    let yPosition = 145;

    // Exam Details
    exams.forEach((exam, index) => {
      if (yPosition > 250) { // New page if needed
        doc.addPage();
        yPosition = 30;
      }

      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(`Exam ${index + 1}:`, 20, yPosition);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Subject: ${exam.subject}`, 30, yPosition + 10);
      doc.text(`Date: ${new Date(exam.exam_date).toLocaleDateString()}`, 30, yPosition + 20);
      doc.text(`Time: ${exam.start_time} - ${exam.end_time}`, 30, yPosition + 30);
      doc.text(`Duration: ${exam.duration} minutes`, 30, yPosition + 40);
      doc.text(`Room: ${exam.room_number || 'TBA'}`, 30, yPosition + 50);
      doc.text(`Total Marks: ${exam.total_marks}`, 30, yPosition + 60);

      yPosition += 80;
    });

    // Instructions
    if (yPosition > 200) {
      doc.addPage();
      yPosition = 30;
    }

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Important Instructions:', 20, yPosition);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const instructions = [
      '1. Please arrive at the exam hall 15 minutes before the scheduled time.',
      '2. Bring your student ID card and this admit card.',
      '3. Electronic devices are not allowed in the exam hall.',
      '4. Late arrivals will not be permitted after 30 minutes.',
      '5. Follow all instructions given by the invigilator.'
    ];

    instructions.forEach((instruction, index) => {
      doc.text(instruction, 20, yPosition + 15 + (index * 8));
    });

    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, doc.internal.pageSize.height - 20);
      doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 20);
    }

    // Convert PDF to buffer
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

    // Return PDF as response
    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="admit_card_${studentName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf"`
      }
    });

  } catch (error) {
    console.error('Error in POST /api/student/exams/generate-pdf:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
