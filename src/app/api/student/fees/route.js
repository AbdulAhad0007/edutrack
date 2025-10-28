import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map();

// GET /api/student/fees - Get fees for a specific student (Enhanced with better error handling and performance)
export async function GET(request) {
  const startTime = Date.now();

  try {
    const { searchParams } = new URL(request.url);
    const studentUid = searchParams.get('studentUid');
    const status = searchParams.get('status'); // pending, paid, overdue, cancelled
    const sortBy = searchParams.get('sortBy') || 'due_date';
    const sortOrder = searchParams.get('sortOrder') || 'asc';
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100); // Max 100 records
    const offset = (page - 1) * limit;

    // Rate limiting
    const clientIP = request.headers.get('x-forwarded-for') ||
                     request.headers.get('x-real-ip') ||
                     'unknown';
    const rateLimitKey = `${clientIP}-${studentUid}`;

    const now = Date.now();
    const windowStart = now - 60000; // 1 minute window

    if (rateLimitStore.has(rateLimitKey)) {
      const requests = rateLimitStore.get(rateLimitKey).filter(time => time > windowStart);

      if (requests.length >= 30) { // 30 requests per minute
        return new Response(JSON.stringify({
          error: 'Rate limit exceeded. Please try again later.',
          retryAfter: 60
        }), {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': '60'
          }
        });
      }

      requests.push(now);
      rateLimitStore.set(rateLimitKey, requests);
    } else {
      rateLimitStore.set(rateLimitKey, [now]);
    }

    // Enhanced validation
    if (!studentUid) {
      return new Response(JSON.stringify({
        error: 'Student UID is required',
        code: 'MISSING_STUDENT_UID'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!/^[A-Za-z0-9_-]{1,50}$/.test(studentUid)) {
      return new Response(JSON.stringify({
        error: 'Invalid student UID format',
        code: 'INVALID_STUDENT_UID'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate sort parameters
    const validSortFields = ['due_date', 'amount', 'fee_type', 'status', 'created_at'];
    const validSortOrders = ['asc', 'desc'];

    if (!validSortFields.includes(sortBy)) {
      return new Response(JSON.stringify({
        error: 'Invalid sort field',
        code: 'INVALID_SORT_FIELD'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!validSortOrders.includes(sortOrder)) {
      return new Response(JSON.stringify({
        error: 'Invalid sort order',
        code: 'INVALID_SORT_ORDER'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Build optimized query
    let query = supabase
      .from('fees')
      .select('*', { count: 'exact' })
      .eq('student_uid', studentUid);

    // Add search functionality
    if (search) {
      query = query.or(`fee_type.ilike.%${search}%,description.ilike.%${search}%,amount::text.ilike.%${search}%`);
    }

    // Add status filter
    if (status && status !== 'all') {
      const validStatuses = ['pending', 'paid', 'overdue', 'cancelled'];
      if (validStatuses.includes(status)) {
        query = query.eq('status', status);
      }
    }

    // Add sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Add pagination
    query = query.range(offset, offset + limit - 1);

    const { data: fees, error, count } = await query;

    if (error) {
      console.error('Error fetching student fees:', error);
      return new Response(JSON.stringify({
        error: 'Database error occurred',
        code: 'DATABASE_ERROR',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Enhanced calculations with better performance
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    // Optimized single-pass calculation
    const stats = fees.reduce((acc, fee) => {
      const amount = parseFloat(fee.amount || 0);
      const dueDate = new Date(fee.due_date);
      const isOverdue = fee.status === 'pending' && dueDate < today;
      const isUpcoming = fee.status === 'pending' && dueDate <= thirtyDaysFromNow && dueDate >= today;

      // Update counters
      acc.totalFees++;
      acc.totalAmount += amount;

      switch (fee.status) {
        case 'paid':
          acc.paidFees++;
          acc.paidAmount += amount;
          break;
        case 'pending':
          acc.pendingFees++;
          acc.pendingAmount += amount;
          break;
        case 'overdue':
          acc.overdueFees++;
          acc.overdueAmount += amount;
          break;
      }

      // Categorize fees
      if (isOverdue) {
        acc.overdueFeesList.push(fee);
      }
      if (isUpcoming) {
        acc.upcomingFees.push(fee);
      }

      return acc;
    }, {
      totalFees: 0,
      paidFees: 0,
      pendingFees: 0,
      overdueFees: 0,
      totalAmount: 0,
      paidAmount: 0,
      pendingAmount: 0,
      overdueAmount: 0,
      upcomingFees: [],
      overdueFeesList: []
    });

    const summary = {
      totalFees: stats.totalFees,
      pendingFees: stats.pendingFees,
      paidFees: stats.paidFees,
      overdueFees: stats.overdueFees,
      totalAmount: parseFloat(stats.totalAmount.toFixed(2)),
      paidAmount: parseFloat(stats.paidAmount.toFixed(2)),
      pendingAmount: parseFloat(stats.pendingAmount.toFixed(2)),
      overdueAmount: parseFloat(stats.overdueAmount.toFixed(2)),
      upcomingFeesCount: stats.upcomingFees.length,
      overdueFeesCount: stats.overdueFeesList.length,
      paymentRate: stats.totalAmount > 0 ? parseFloat(((stats.paidAmount / stats.totalAmount) * 100).toFixed(1)) : 0
    };

    const responseTime = Date.now() - startTime;

    // Add caching headers
    const headers = {
      'Content-Type': 'application/json',
      'Cache-Control': 'private, max-age=30', // Cache for 30 seconds
      'X-Response-Time': `${responseTime}ms`,
      'X-Total-Count': count.toString(),
      'X-Page': page.toString(),
      'X-Limit': limit.toString(),
      'X-Total-Pages': Math.ceil(count / limit).toString()
    };

    return new Response(JSON.stringify({
      success: true,
      fees,
      summary,
      upcomingFees: stats.upcomingFees,
      overdueFees: stats.overdueFeesList,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
        hasNext: page * limit < count,
        hasPrev: page > 1
      },
      search: search ? { term: search, results: fees.length } : null,
      performance: {
        responseTime: `${responseTime}ms`,
        timestamp: new Date().toISOString()
      }
    }), {
      status: 200,
      headers
    });

  } catch (error) {
    console.error('Error in GET /api/student/fees:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// POST /api/student/fees - Create a new fee (for admin use)
export async function POST(request) {
  try {
    const body = await request.json();
    const { studentUid, feeType, amount, description, dueDate, createdBy } = body;

    // Validation
    if (!studentUid || !feeType || !amount || !dueDate || !createdBy) {
      return new Response(JSON.stringify({
        error: 'Missing required fields',
        code: 'MISSING_REQUIRED_FIELDS'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { data, error } = await supabase
      .from('fees')
      .insert([{
        student_uid: studentUid,
        student_name: body.studentName || '',
        teacher_id: body.teacherId || '',
        teacher_name: body.teacherName || '',
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
      return new Response(JSON.stringify({
        error: 'Failed to create fee',
        code: 'CREATE_FAILED'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      fee: data
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in POST /api/student/fees:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
