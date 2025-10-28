// Test script to verify Cashfree API connection
// Run with: node test-cashfree.js

require('dotenv').config({ path: '.env.local' });

const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID;
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY;
const CASHFREE_BASE_URL = 'https://api.cashfree.com/pg';

console.log('=== Cashfree Configuration Test ===\n');

// Check environment variables
console.log('1. Environment Variables:');
console.log('   CASHFREE_APP_ID:', CASHFREE_APP_ID ? `${CASHFREE_APP_ID.substring(0, 10)}...` : 'NOT SET');
console.log('   CASHFREE_SECRET_KEY:', CASHFREE_SECRET_KEY ? `${CASHFREE_SECRET_KEY.substring(0, 15)}...` : 'NOT SET');
console.log('   CASHFREE_BASE_URL:', CASHFREE_BASE_URL);
console.log('');

if (!CASHFREE_APP_ID || !CASHFREE_SECRET_KEY) {
  console.error('❌ ERROR: Cashfree credentials not configured!');
  process.exit(1);
}

// Test API connection
async function testCashfreeAPI() {
  console.log('2. Testing Cashfree API Connection...\n');
  
  const orderId = `TEST_${Date.now()}`;
  const orderData = {
    order_id: orderId,
    order_amount: 10.00,
    order_currency: 'INR',
    customer_details: {
      customer_id: 'test_customer_123',
      customer_email: 'test@example.com',
      customer_phone: '8826324063',
      customer_name: 'Test Customer'
    },
    order_note: 'EduTrack-ERP - Fee Payment',
    order_meta: {
      return_url: 'http://localhost:3000/test',
      notify_url: 'http://localhost:3000/test/webhook',
    }
  };

  const headers = {
    'Content-Type': 'application/json',
    'x-api-version': '2022-09-01',
    'x-client-id': CASHFREE_APP_ID,
    'x-client-secret': CASHFREE_SECRET_KEY,
  };

  console.log('   Request URL:', `${CASHFREE_BASE_URL}/orders`);
  console.log('   Order ID:', orderId);
  console.log('   Amount: ₹10.00');
  console.log('');

  try {
    const response = await fetch(`${CASHFREE_BASE_URL}/orders`, {
      method: 'POST',
      headers,
      body: JSON.stringify(orderData),
    });

    console.log('   Response Status:', response.status, response.statusText);
    
    const responseData = await response.json();
    console.log('   Response Data:', JSON.stringify(responseData, null, 2));
    console.log('');

    if (response.ok) {
      console.log('✅ SUCCESS: Cashfree API connection working!');
      console.log('   Payment Session ID:', responseData.payment_session_id);
      return true;
    } else {
      console.log('❌ ERROR: Cashfree API returned an error');
      console.log('   Error Message:', responseData.message || 'Unknown error');
      
      // Common error explanations
      if (response.status === 401) {
        console.log('\n   💡 Tip: Check your APP_ID and SECRET_KEY are correct');
      } else if (response.status === 400) {
        console.log('\n   💡 Tip: Check the request format matches Cashfree requirements');
      } else if (response.status === 403) {
        console.log('\n   💡 Tip: Your Cashfree account may not be active or verified');
      }
      
      return false;
    }
  } catch (error) {
    console.log('❌ NETWORK ERROR:', error.message);
    console.log('\n   💡 Tip: Check your internet connection and firewall settings');
    return false;
  }
}

// Run the test
testCashfreeAPI().then(success => {
  console.log('\n=== Test Complete ===');
  process.exit(success ? 0 : 1);
});
