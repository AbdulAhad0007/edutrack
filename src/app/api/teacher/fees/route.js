import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// GET /api/teacher/fees - Get all fees for students managed by the teacher
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const teacherId = searchParams.get('teacherId');
    const status = searchParams.get('status'); // pending, paid, overdue, cancelled
    const studentUid = searchParams.get('studentUid');

    if (!teacherId) {
      return new Response(JSON.stringify({ error: 'Teacher ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Add pagination for better performance
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    let query = supabase
      .from('fees')
      .select('*', { count: 'exact' })
      .eq('teacher_id', teacherId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Filter by status if provided
    if (status) {
      query = query.eq('status', status);
    }

    // Filter by student if provided
    if (studentUid) {
      query = query.eq('student_uid', studentUid);
    }

    const { data: fees, error, count } = await query;

    if (error) {
      console.error('Error fetching fees:', error);
      return new Response(JSON.stringify({ error: 'Failed to fetch fees' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Calculate summary statistics
    const totalFees = fees.length;
    const pendingFees = fees.filter(fee => fee.status === 'pending').length;
    const paidFees = fees.filter(fee => fee.status === 'paid').length;
    const overdueFees = fees.filter(fee => fee.status === 'overdue').length;
    const totalAmount = fees.reduce((sum, fee) => sum + parseFloat(fee.amount || 0), 0);
    const paidAmount = fees.filter(fee => fee.status === 'paid').reduce((sum, fee) => sum + parseFloat(fee.amount || 0), 0);
    const pendingAmount = fees.filter(fee => fee.status === 'pending').reduce((sum, fee) => sum + parseFloat(fee.amount || 0), 0);

    const summary = {
      totalFees,
      pendingFees,
      paidFees,
      overdueFees,
      totalAmount,
      paidAmount,
      pendingAmount,
      collectionRate: totalAmount > 0 ? (paidAmount / totalAmount) * 100 : 0
    };

    return new Response(JSON.stringify({
      success: true,
      fees,
      summary
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error in GET /api/teacher/fees:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// POST /api/teacher/fees - Create a new fee
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      studentUid,
      studentName,
      teacherId,
      teacherName,
      feeType,
      amount,
      description,
      dueDate,
      createdBy
    } = body;

    // Validate required fields
    if (!studentUid || !studentName || !teacherId || !teacherName || !feeType || !amount || !dueDate || !createdBy) {
      return new Response(JSON.stringify({ error: 'All required fields must be provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate amount is positive
    if (parseFloat(amount) <= 0) {
      return new Response(JSON.stringify({ error: 'Amount must be greater than 0' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate due date is not in the past
    const dueDateObj = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (dueDateObj < today) {
      return new Response(JSON.stringify({ error: 'Due date cannot be in the past' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { data: newFee, error } = await supabase
      .from('fees')
      .insert([{
        student_uid: studentUid,
        student_name: studentName,
        teacher_id: teacherId,
        teacher_name: teacherName,
        fee_type: feeType,
        amount: parseFloat(amount),
        description: description || '',
        due_date: dueDate,
        status: 'pending',
        created_by: createdBy
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating fee:', error);
      return new Response(JSON.stringify({ error: 'Failed to create fee' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      fee: newFee,
      message: 'Fee created successfully'
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error in POST /api/teacher/fees:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
