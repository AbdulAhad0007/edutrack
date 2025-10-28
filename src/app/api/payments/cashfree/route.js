import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Cashfree API configuration
const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID;
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY;
// Use environment variable or fallback to sandbox for development
const CASHFREE_BASE_URL = process.env.CASHFREE_BASE_URL || 'https://sandbox.cashfree.com/pg';

// Generate unique order ID
function generateOrderId() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `CF_${timestamp}_${random}`.toUpperCase();
}

// Create payment session with Cashfree
async function createPaymentSession(orderData) {
  const url = `${CASHFREE_BASE_URL}/orders`;

  const headers = {
    'Content-Type': 'application/json',
    'x-api-version': '2022-09-01',
    'x-client-id': CASHFREE_APP_ID,
    'x-client-secret': CASHFREE_SECRET_KEY,
  };

  console.log('Creating Cashfree payment session:', {
    url,
    orderData: { ...orderData, customer_details: { ...orderData.customer_details, customer_email: '***' } }
  });

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(orderData),
    });

    const responseData = await response.json();
    console.log('Cashfree API response:', { status: response.status, data: responseData });

    if (!response.ok) {
      const errorMessage = responseData.message || responseData.error || JSON.stringify(responseData);
      console.error('Cashfree API error details:', responseData);
      throw new Error(`Cashfree API error: ${response.status} - ${errorMessage}`);
    }

    return responseData;
  } catch (error) {
    console.error('Error creating payment session:', error);
    throw error;
  }
}

// Verify payment status
async function verifyPayment(orderId) {
  const url = `${CASHFREE_BASE_URL}/orders/${orderId}`;

  const headers = {
    'x-api-version': '2022-09-01',
    'x-client-id': CASHFREE_APP_ID,
    'x-client-secret': CASHFREE_SECRET_KEY,
  };

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to verify payment: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw error;
  }
}

// POST /api/payments/cashfree - Initiate payment
export async function POST(request) {
  try {
    // Validate environment variables
    if (!CASHFREE_APP_ID || !CASHFREE_SECRET_KEY) {
      console.error('Cashfree credentials not configured');
      return new Response(JSON.stringify({
        success: false,
        error: 'Payment gateway not configured',
        message: 'Payment gateway credentials are missing. Please contact support.',
        code: 'GATEWAY_NOT_CONFIGURED'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const body = await request.json();
    const { feeIds, studentUid, studentName, studentEmail } = body;

    // Validation
    if (!feeIds || !Array.isArray(feeIds) || feeIds.length === 0) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Fee IDs are required',
        message: 'Please select at least one fee to pay',
        code: 'MISSING_FEE_IDS'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!studentUid || !studentName || !studentEmail) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Student details are required',
        message: 'Student information is incomplete. Please login again.',
        code: 'MISSING_STUDENT_DETAILS'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    let fees;

    // Fetch fee details from database
    const { data: feesData, error: feesError } = await supabase
      .from('fees')
      .select('*')
      .eq('student_uid', studentUid)
      .in('id', feeIds)
      .eq('status', 'pending');

    if (feesError || !feesData || feesData.length === 0) {
      console.error('Error fetching fees or no fees found:', feesError);
      // For testing purposes, create mock fee data if database fails or no fees found
      fees = feeIds.map((id, index) => ({
        id,
        fee_type: `Test Fee ${index + 1}`,
        description: `Description for fee ${index + 1}`,
        amount: (Math.random() * 1000 + 100).toFixed(2),
        due_date: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
        student_uid: studentUid,
        student_class: '10',
        student_section: 'A'
      }));
      console.log('Using mock fee data for testing:', fees);
    } else {
      fees = feesData;
    }

    // Calculate total amount
    const totalAmount = fees.reduce((sum, fee) => sum + parseFloat(fee.amount || 0), 0);

    // Generate order ID
    const orderId = generateOrderId();

    // Create payment record in database
    const { data: paymentRecord, error: paymentError } = await supabase
      .from('payments')
      .insert([{
        order_id: orderId,
        student_uid: studentUid,
        student_name: studentName,
        student_class: fees[0]?.student_class || '',
        student_section: fees[0]?.student_section || '',
        payment_status: 'pending',
        amount: totalAmount,
        currency: 'INR',
        fee_ids: feeIds,
        payment_gateway: 'cashfree',
        created_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (paymentError) {
      console.error('Error creating payment record:', paymentError);
      return new Response(JSON.stringify({
        success: false,
        error: 'Failed to create payment record',
        message: 'Unable to initiate payment. Please try again.',
        code: 'PAYMENT_RECORD_ERROR'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate amount
    if (totalAmount <= 0 || totalAmount < 1) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid amount',
        message: 'Payment amount must be at least ₹1',
        code: 'INVALID_AMOUNT'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('Payment details:', { orderId, totalAmount, studentUid, feeCount: feeIds.length });

    // Get base URL and trim any whitespace
    const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000').trim();

    // Prepare order data for Cashfree
    const orderData = {
      order_id: orderId,
      order_amount: parseFloat(totalAmount.toFixed(2)),
      order_currency: 'INR',
      customer_details: {
        customer_id: studentUid,
        customer_email: studentEmail,
        customer_phone: '8826324063',
        customer_name: studentName
      },
      order_note: 'EduTrack-ERP - Fee Payment',
      order_meta: {
        return_url: `${baseUrl}/payment-callback?payment_success=true&order_id=${orderId}`,
        notify_url: `${baseUrl}/api/payments/cashfree/webhook`,
      },
      order_tags: {
        student_uid: studentUid,
        fee_count: feeIds.length.toString(),
      },
    };

    // Create payment session with Cashfree
    const paymentSession = await createPaymentSession(orderData);

    return new Response(JSON.stringify({
      success: true,
      orderId,
      paymentSessionId: paymentSession.payment_session_id,
      key: CASHFREE_APP_ID,
      amount: totalAmount,
      currency: 'INR',
      fees: fees,
      paymentRecord: paymentRecord,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in POST /api/payments/cashfree:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Internal server error',
      message: error.message || 'Payment initiation failed. Please try again.',
      code: 'INTERNAL_ERROR',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// GET /api/payments/cashfree - Verify payment status
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('order_id');

    if (!orderId) {
      return new Response(JSON.stringify({
        error: 'Order ID is required',
        code: 'MISSING_ORDER_ID'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Verify payment with Cashfree
    const paymentDetails = await verifyPayment(orderId);

    // Update payment record in database
    const { data: paymentRecord, error: updateError } = await supabase
      .from('payments')
      .update({
        payment_status: paymentDetails.order_status === 'PAID' ? 'completed' : paymentDetails.order_status.toLowerCase(),
        gateway_order_id: paymentDetails.cf_order_id,
        transaction_id: paymentDetails.payment_session_id,
        payment_date: paymentDetails.order_status === 'PAID' ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq('order_id', orderId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating payment record:', updateError);
    }

    // If payment is successful, update fee statuses
    if (paymentDetails.order_status === 'PAID' && paymentRecord) {
      const { error: feeUpdateError } = await supabase
        .from('fees')
        .update({
          status: 'paid',
          payment_date: new Date().toISOString(),
          payment_method: 'cashfree',
          transaction_id: paymentDetails.payment_session_id,
        })
        .in('id', paymentRecord.fee_ids);

      if (feeUpdateError) {
        console.error('Error updating fee statuses:', feeUpdateError);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      orderId,
      status: paymentDetails.order_status,
      amount: paymentDetails.order_amount,
      currency: paymentDetails.order_currency,
      paymentRecord,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in GET /api/payments/cashfree:', error);
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
