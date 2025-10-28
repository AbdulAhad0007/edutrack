import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// PUT /api/teacher/fees/[id] - Update a fee (mark as paid, update status, etc.)
export async function PUT(request, { params }) {
  try {
    const feeId = params.id;
    const body = await request.json();
    const {
      status,
      paymentDate,
      paymentMethod,
      transactionId,
      updatedBy
    } = body;

    if (!feeId) {
      return new Response(JSON.stringify({ error: 'Fee ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate status if provided
    if (status && !['pending', 'paid', 'overdue', 'cancelled'].includes(status)) {
      return new Response(JSON.stringify({ error: 'Invalid status value' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Prepare update data
    const updateData = {
      updated_at: new Date().toISOString()
    };

    if (status) updateData.status = status;
    if (paymentDate) updateData.payment_date = paymentDate;
    if (paymentMethod) updateData.payment_method = paymentMethod;
    if (transactionId) updateData.transaction_id = transactionId;
    if (updatedBy) updateData.updated_by = updatedBy;

    // If marking as paid, set payment date if not provided
    if (status === 'paid' && !paymentDate) {
      updateData.payment_date = new Date().toISOString();
    }

    // Check if fee exists and teacher has permission to update it
    const { data: existingFee, error: fetchError } = await supabase
      .from('fees')
      .select('*')
      .eq('id', feeId)
      .single();

    if (fetchError || !existingFee) {
      return new Response(JSON.stringify({ error: 'Fee not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { data: updatedFee, error: updateError } = await supabase
      .from('fees')
      .update(updateData)
      .eq('id', feeId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating fee:', updateError);
      return new Response(JSON.stringify({ error: 'Failed to update fee' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      fee: updatedFee,
      message: 'Fee updated successfully'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error in PUT /api/teacher/fees/[id]:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// DELETE /api/teacher/fees/[id] - Delete a fee
export async function DELETE(request, { params }) {
  try {
    const feeId = params.id;

    if (!feeId) {
      return new Response(JSON.stringify({ error: 'Fee ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check if fee exists
    const { data: existingFee, error: fetchError } = await supabase
      .from('fees')
      .select('*')
      .eq('id', feeId)
      .single();

    if (fetchError || !existingFee) {
      return new Response(JSON.stringify({ error: 'Fee not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Only allow deletion of pending fees
    if (existingFee.status !== 'pending') {
      return new Response(JSON.stringify({ error: 'Only pending fees can be deleted' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { error: deleteError } = await supabase
      .from('fees')
      .delete()
      .eq('id', feeId);

    if (deleteError) {
      console.error('Error deleting fee:', deleteError);
      return new Response(JSON.stringify({ error: 'Failed to delete fee' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Fee deleted successfully'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error in DELETE /api/teacher/fees/[id]:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
