import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const {
      studentId,
      studentName,
      studentClass,
      studentSection,
      examIds
    } = await request.json();

    if (!examIds || examIds.length === 0) {
      return NextResponse.json(
        { error: 'No exam IDs provided' },
        { status: 400 }
      );
    }

    // Fetch exam details
    const { data: exams, error: examsError } = await supabase
      .from('exams')
      .select(`
        *,
        teacher:users!exams_teacher_id_fkey(name)
      `)
      .in('id', examIds)
      .eq('is_active', true);

    if (examsError) {
      console.error('Error fetching exams:', examsError);
      return NextResponse.json(
        { error: 'Failed to fetch exam details' },
        { status: 500 }
      );
    }

    if (!exams || exams.length === 0) {
      return NextResponse.json(
        { error: 'No exams found' },
        { status: 404 }
      );
    }

    // Generate HTML content for the admit cards
    const htmlContent = generateAdmitCardsHTML({
      studentName,
      studentClass,
      studentSection,
      exams
    });

    // For now, return the HTML content
    // In a production environment, you would use a PDF library like Puppeteer or jsPDF
    return new NextResponse(htmlContent, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename="admit_cards_${studentName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.html"`
      }
    });

  } catch (error) {
    console.error('Error generating admit cards:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function generateAdmitCardsHTML({ studentName, studentClass, studentSection, exams }) {
  const currentDate = new Date().toLocaleDateString();
  const currentYear = new Date().getFullYear();

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admit Cards - ${studentName}</title>
    <style>
        @page {
            size: A4;
            margin: 20mm;
        }

        body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }

        .admit-card {
            background: white;
            border: 2px solid #2563eb;
            border-radius: 10px;
            padding: 30px;
            margin: 0 auto 20px;
            max-width: 800px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            page-break-inside: avoid;
        }

        .header {
            text-align: center;
            border-bottom: 2px solid #2563eb;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }

        .school-name {
            font-size: 28px;
            font-weight: bold;
            color: #2563eb;
            margin-bottom: 10px;
        }

        .exam-title {
            font-size: 24px;
            color: #1e40af;
            margin-bottom: 20px;
        }

        .admit-card-title {
            font-size: 20px;
            color: #dc2626;
            margin-bottom: 20px;
        }

        .student-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 30px;
        }

        .info-group {
            margin-bottom: 15px;
        }

        .info-label {
            font-weight: bold;
            color: #374151;
            font-size: 14px;
            margin-bottom: 5px;
        }

        .info-value {
            color: #1f2937;
            font-size: 16px;
            padding: 8px 0;
            border-bottom: 1px solid #e5e7eb;
        }

        .exam-details {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 25px;
        }

        .exam-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-bottom: 20px;
        }

        .instructions {
            background: #fef3c7;
            border: 1px solid #f59e0b;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 25px;
        }

        .instructions h4 {
            color: #92400e;
            margin-bottom: 15px;
            font-size: 16px;
        }

        .instructions ul {
            margin: 0;
            padding-left: 20px;
        }

        .instructions li {
            margin-bottom: 8px;
            color: #78350f;
        }

        .footer {
            text-align: center;
            border-top: 1px solid #e5e7eb;
            padding-top: 20px;
            margin-top: 30px;
            color: #6b7280;
            font-size: 12px;
        }

        .signature-section {
            display: flex;
            justify-content: space-between;
            margin-top: 40px;
        }

        .signature-box {
            text-align: center;
            flex: 1;
        }

        .signature-line {
            border-bottom: 1px solid #000;
            width: 200px;
            margin: 40px auto 10px;
        }

        .exam-count {
            background: #dbeafe;
            border: 1px solid #3b82f6;
            border-radius: 20px;
            padding: 5px 15px;
            display: inline-block;
            font-size: 12px;
            color: #1e40af;
            margin-bottom: 15px;
        }

        @media print {
            body {
                background: white;
                padding: 0;
            }

            .admit-card {
                box-shadow: none;
                border: 1px solid #2563eb;
                margin: 0 0 20px 0;
            }
        }
    </style>
</head>
<body>
    ${exams.map((exam, index) => `
    <div class="admit-card">
        <div class="header">
            <div class="school-name">EDUTRACK INSTITUTION</div>
            <div class="exam-title">Examination Admit Card</div>
            <div class="admit-card-title">ADMIT CARD ${currentYear}</div>
            <div class="exam-count">Exam ${index + 1} of ${exams.length}</div>
        </div>

        <div class="student-info">
            <div class="info-group">
                <div class="info-label">Student Name:</div>
                <div class="info-value">${studentName}</div>
            </div>
            <div class="info-group">
                <div class="info-label">Class & Section:</div>
                <div class="info-value">${studentClass}${studentSection ? ` - ${studentSection}` : ''}</div>
            </div>
            <div class="info-group">
                <div class="info-label">Exam Date:</div>
                <div class="info-value">${new Date(exam.exam_date).toLocaleDateString()}</div>
            </div>
            <div class="info-group">
                <div class="info-label">Exam Time:</div>
                <div class="info-value">${exam.start_time} - ${exam.end_time}</div>
            </div>
        </div>

        <div class="exam-details">
            <h3 style="color: #1e40af; margin-bottom: 15px;">Examination Details</h3>
            <div class="exam-grid">
                <div class="info-group">
                    <div class="info-label">Subject:</div>
                    <div class="info-value">${exam.subject}</div>
                </div>
                <div class="info-group">
                    <div class="info-label">Exam Type:</div>
                    <div class="info-value">${exam.exam_type}</div>
                </div>
                <div class="info-group">
                    <div class="info-label">Total Marks:</div>
                    <div class="info-value">${exam.total_marks}</div>
                </div>
                <div class="info-group">
                    <div class="info-label">Passing Marks:</div>
                    <div class="info-value">${exam.passing_marks || 'N/A'}</div>
                </div>
                <div class="info-group">
                    <div class="info-label">Duration:</div>
                    <div class="info-value">${exam.duration} minutes</div>
                </div>
                <div class="info-group">
                    <div class="info-label">Room Number:</div>
                    <div class="info-value">${exam.room_number || 'TBA'}</div>
                </div>
            </div>
        </div>

        <div class="instructions">
            <h4>📋 Important Instructions:</h4>
            <ul>
                <li>Report to the examination hall 15 minutes before the scheduled time</li>
                <li>Bring this admit card and a valid ID proof</li>
                <li>Mobile phones and electronic devices are strictly prohibited</li>
                <li>Do not carry any study material or notes inside the examination hall</li>
                <li>Late arrival will not be permitted after 30 minutes of exam start</li>
                <li>Follow all instructions given by the invigilator</li>
                <li>Any form of malpractice will result in immediate disqualification</li>
                <li>Students must wear school uniform during the examination</li>
            </ul>
        </div>

        <div class="signature-section">
            <div class="signature-box">
                <div class="signature-line"></div>
                <div style="font-size: 12px; color: #6b7280;">Student's Signature</div>
            </div>
            <div class="signature-box">
                <div class="signature-line"></div>
                <div style="font-size: 12px; color: #6b7280;">Invigilator's Signature</div>
            </div>
            <div class="signature-box">
                <div class="signature-line"></div>
                <div style="font-size: 12px; color: #6b7280;">Principal's Signature</div>
            </div>
        </div>

        <div class="footer">
            <p><strong>Generated on:</strong> ${currentDate} | <strong>Academic Year:</strong> ${exam.academic_year}</p>
            <p><strong>Teacher:</strong> ${exam.teacher?.name || 'N/A'} | <strong>Exam ID:</strong> ${exam.id}</p>
            <p style="margin-top: 10px; font-size: 10px; color: #9ca3af;">
                This is a computer-generated admit card. No signature is required.
            </p>
        </div>
    </div>
    `).join('')}
</body>
</html>`;
}
