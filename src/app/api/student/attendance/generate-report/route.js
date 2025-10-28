import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// POST /api/student/attendance/generate-report - Generate PDF report for student's attendance
export async function POST(request) {
  try {
    const body = await request.json();
    const { studentId, studentName, studentClass, studentSection, attendance } = body;

    if (!studentId || !studentName || !studentClass || !attendance) {
      return new Response(JSON.stringify({ error: 'Student details and attendance data are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Generate PDF using jsPDF
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();

    // Set font
    doc.setFont('helvetica');

    // Header
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('ATTENDANCE REPORT', 105, 30, { align: 'center' });

    // Academic Year
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Academic Year: 2025-26`, 105, 45, { align: 'center' });

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

    // Attendance Summary
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Attendance Summary', 20, 130);

    const totalRecords = attendance.length;
    const presentCount = attendance.filter(record => record.status === 'present').length;
    const absentCount = attendance.filter(record => record.status === 'absent').length;
    const lateCount = attendance.filter(record => record.status === 'late').length;
    const attendancePercentage = totalRecords > 0 ? (presentCount / totalRecords) * 100 : 0;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Total Records: ${totalRecords}`, 20, 145);
    doc.text(`Present: ${presentCount}`, 20, 155);
    doc.text(`Absent: ${absentCount}`, 20, 165);
    doc.text(`Late: ${lateCount}`, 20, 175);
    doc.text(`Attendance Percentage: ${Math.round(attendancePercentage * 100) / 100}%`, 20, 185);

    // Attendance Details Header
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Attendance Details', 20, 205);

    let yPosition = 220;

    // Attendance Details
    attendance.slice(0, 20).forEach((record, index) => { // Limit to first 20 records to fit on page
      if (yPosition > 250) { // New page if needed
        doc.addPage();
        yPosition = 30;
      }

      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(`Record ${index + 1}:`, 20, yPosition);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`Date: ${new Date(record.date).toLocaleDateString()}`, 30, yPosition + 8);
      doc.text(`Status: ${record.status.charAt(0).toUpperCase() + record.status.slice(1)}`, 30, yPosition + 16);
      doc.text(`Subject: ${record.subject || 'General'}`, 30, yPosition + 24);
      doc.text(`Period: ${record.period || 'N/A'}`, 30, yPosition + 32);

      yPosition += 45;
    });

    // Performance Analysis
    if (yPosition > 200) {
      doc.addPage();
      yPosition = 30;
    }

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Performance Analysis', 20, yPosition);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');

    if (attendancePercentage >= 90) {
      doc.text('Excellent attendance! Keep up the great work.', 20, yPosition + 15);
    } else if (attendancePercentage >= 75) {
      doc.text('Good attendance. Try to improve further.', 20, yPosition + 15);
    } else {
      doc.text('Attendance needs improvement. Please focus on regular attendance.', 20, yPosition + 15);
    }

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
        'Content-Disposition': `attachment; filename="attendance_report_${studentName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf"`
      }
    });

  } catch (error) {
    console.error('Error in POST /api/student/attendance/generate-report:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
