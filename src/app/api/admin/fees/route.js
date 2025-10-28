import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// GET /api/admin/fees - Get all fees data with analytics
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const feeType = searchParams.get('feeType');
    const academicYear = searchParams.get('academicYear');
    const classFilter = searchParams.get('class');
    const section = searchParams.get('section');

    let query = supabase
      .from('fees')
      .select('*')
      .order('due_date', { ascending: false });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    if (feeType) {
      query = query.ilike('fee_type', `%${feeType}%`);
    }

    if (academicYear) {
      query = query.eq('academic_year', academicYear);
    }

    if (classFilter) {
      query = query.ilike('student_class', `%${classFilter}%`);
    }

    if (section) {
      query = query.ilike('student_section', `%${section}%`);
    }

    const { data: feesData, error } = await query;

    if (error) {
      console.error('Error fetching fees:', error);
      return new Response(JSON.stringify({ error: 'Failed to fetch fees data' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Calculate analytics
    const totalFees = feesData.length;
    const paidFees = feesData.filter(fee => fee.status === 'paid').length;
    const pendingFees = feesData.filter(fee => fee.status === 'pending').length;
    const overdueFees = feesData.filter(fee => fee.status === 'overdue').length;

    const totalAmount = feesData.reduce((sum, fee) => sum + parseFloat(fee.amount || 0), 0);
    const paidAmount = feesData.filter(fee => fee.status === 'paid').reduce((sum, fee) => sum + parseFloat(fee.amount || 0), 0);
    const pendingAmount = feesData.filter(fee => fee.status === 'pending').reduce((sum, fee) => sum + parseFloat(fee.amount || 0), 0);
    const overdueAmount = feesData.filter(fee => fee.status === 'overdue').reduce((sum, fee) => sum + parseFloat(fee.amount || 0), 0);

    // Group by fee type
    const feeTypeStats = {};
    feesData.forEach(fee => {
      const type = fee.fee_type;
      if (!feeTypeStats[type]) {
        feeTypeStats[type] = { count: 0, amount: 0, paid: 0, pending: 0, overdue: 0 };
      }
      feeTypeStats[type].count++;
      feeTypeStats[type].amount += parseFloat(fee.amount || 0);
      if (fee.status === 'paid') feeTypeStats[type].paid++;
      else if (fee.status === 'pending') feeTypeStats[type].pending++;
      else if (fee.status === 'overdue') feeTypeStats[type].overdue++;
    });

    // Group by status for pie chart
    const statusStats = {
      paid: paidFees,
      pending: pendingFees,
      overdue: overdueFees
    };

    // Monthly collection trend (last 12 months)
    const monthlyStats = {};
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = date.toISOString().slice(0, 7); // YYYY-MM
      monthlyStats[monthKey] = { collected: 0, pending: 0, total: 0 };
    }

    feesData.forEach(fee => {
      const monthKey = fee.due_date.slice(0, 7);
      if (monthlyStats[monthKey]) {
        monthlyStats[monthKey].total += parseFloat(fee.amount || 0);
        if (fee.status === 'paid') {
          monthlyStats[monthKey].collected += parseFloat(fee.amount || 0);
        } else {
          monthlyStats[monthKey].pending += parseFloat(fee.amount || 0);
        }
      }
    });

    const monthlyTrend = Object.keys(monthlyStats).sort().map(month => ({
      month,
      collected: monthlyStats[month].collected,
      pending: monthlyStats[month].pending,
      total: monthlyStats[month].total,
      collectionRate: monthlyStats[month].total > 0 ? (monthlyStats[month].collected / monthlyStats[month].total) * 100 : 0
    }));

   const paymentRate = totalAmount > 0 ? Math.round((paidAmount / totalAmount) * 100 * 100) / 100 : 0;

const analytics = {
  totalFees,
  paidFees,
  pendingFees,
  overdueFees,
  totalAmount: Math.round(totalAmount * 100) / 100,
  paidAmount: Math.round(paidAmount * 100) / 100,
  pendingAmount: Math.round(pendingAmount * 100) / 100,
  overdueAmount: Math.round(overdueAmount * 100) / 100,
  paymentRate,
  feeTypeStats,
  statusStats,
  monthlyTrend,
  summary: {
    excellent: paymentRate >= 90,
    good: paymentRate >= 75 && paymentRate < 90,
    needsImprovement: paymentRate < 75
  }
};


    return new Response(JSON.stringify(analytics), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error in GET /api/admin/fees:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
