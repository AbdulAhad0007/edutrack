'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import {
  DollarSign,
  CreditCard,
  AlertCircle,
  CheckCircle,
  Clock,
  Calendar,
  Receipt,
  TrendingUp,
  FileText
} from 'lucide-react';

const StudentFees = React.memo(() => {
  const { data: session } = useSession();
  const [fees, setFees] = useState([]);
  const [upcomingFees, setUpcomingFees] = useState([]);
  const [overdueFees, setOverdueFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({});
  const [activeTab, setActiveTab] = useState('all');
  const [selectedFees, setSelectedFees] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [downloadingReceipt, setDownloadingReceipt] = useState(false);

  useEffect(() => {
    const loadCashFree = () => {
      // Check if already loaded
      if (window.Cashfree) {
        console.log('Cashfree SDK already loaded');
        return Promise.resolve(true);
      }

      // Check if script already exists
      const existingScript = document.querySelector('script[src*="cashfree.com"]');
      if (existingScript) {
        return new Promise((resolve) => {
          existingScript.onload = () => resolve(true);
          existingScript.onerror = () => resolve(false);
        });
      }

      return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
        script.onload = () => {
          console.log('Cashfree SDK loaded successfully');
          resolve(true);
        };
        script.onerror = () => {
          console.error('Failed to load Cashfree SDK');
          resolve(false);
        };
        document.body.appendChild(script);
      });
    };

    loadCashFree();
  }, []);

  const fetchFees = useCallback(async () => {
    if (!session?.user?.uid) {
      console.log('No session UID available');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('Fetching fees for student:', session.user.uid);

      const response = await fetch(`/api/student/fees?studentUid=${session.user.uid}`);

      if (!response.ok) {
        console.error('Failed to fetch fees:', response.status, response.statusText);
        throw new Error('Failed to fetch fees');
      }

      const result = await response.json();
      console.log('Fees API response:', result);

      if (result.success) {
        setFees(result.fees || []);
        setSummary(result.summary || {});
        setUpcomingFees(result.upcomingFees || []);
        setOverdueFees(result.overdueFees || []);
      } else {
        console.error('API returned error:', result);
      }
    } catch (error) {
      console.error('Error fetching fees:', error);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.uid]);

  useEffect(() => {
    fetchFees();

    // Check for payment success parameter
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('payment_success') === 'true') {
      const orderId = urlParams.get('order_id');
      if (orderId) {
        // Check for receipt cookie
        const receiptCookie = document.cookie.split(';').find(c => c.trim().startsWith(`payment_receipt_${orderId}=`));
        if (receiptCookie) {
          const pdfBase64 = decodeURIComponent(receiptCookie.split('=')[1]);
          const pdfBlob = new Blob([Uint8Array.from(atob(pdfBase64), c => c.charCodeAt(0))], { type: 'application/pdf' });
          const url = URL.createObjectURL(pdfBlob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `fee_receipt_${session?.user?.name?.replace(/\s+/g, '_') || 'student'}_${new Date().toISOString().split('T')[0]}.pdf`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);

          // Clear the cookie
          document.cookie = `payment_receipt_${orderId}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;

          // Clear URL parameters
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }
    }
  }, [fetchFees, session?.user?.name]);

  const getStatusColor = useCallback((status) => {
    switch (status) {
      case 'paid': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'overdue': return 'text-red-600 bg-red-100';
      case 'cancelled': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  }, []);

  const getStatusIcon = useCallback((status) => {
    switch (status) {
      case 'paid': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'overdue': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  }, []);

  const filteredFees = useMemo(() => {
    switch (activeTab) {
      case 'pending':
        return fees.filter(fee => fee.status === 'pending');
      case 'paid':
        return fees.filter(fee => fee.status === 'paid');
      case 'overdue':
        return fees.filter(fee => fee.status === 'overdue');
      case 'upcoming':
        return upcomingFees;
      default:
        return fees;
    }
  }, [fees, activeTab, upcomingFees]);

  // Payment functions with CashFree
  const handlePayment = useCallback(async (feeIds) => {
    console.log('Initiating payment for fees:', feeIds);
    console.log('Student details:', {
      uid: session?.user?.uid,
      name: session?.user?.name,
      email: session?.user?.email
    });

    setPaymentLoading(true);
    try {
      const requestBody = {
        feeIds,
        studentUid: session?.user?.uid,
        studentName: session?.user?.name,
        studentEmail: session?.user?.email,
      };
      console.log('Request body:', requestBody);

      const response = await fetch('/api/payments/cashfree', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Response status:', response.status);
      const result = await response.json();
      console.log('Payment API response:', result);

      if (result.success) {
        // Check if Cashfree SDK is loaded
        if (!window.Cashfree) {
          alert('Payment gateway is loading. Please try again in a moment.');
          setPaymentLoading(false);
          return;
        }

        console.log('Initializing Cashfree with session ID:', result.paymentSessionId);
        console.log('Payment session data:', {
          sessionId: result.paymentSessionId,
          orderId: result.orderId,
          amount: result.amount
        });

        // Drop-in checkout (simpler, more reliable)
        const cashfree = window.Cashfree({
          mode: 'production'
        });

        const checkoutOptions = {
          paymentSessionId: result.paymentSessionId,
        };

        console.log('Opening Cashfree checkout with options:', checkoutOptions);

        try {
          // Use drop method for embedded checkout
          cashfree.checkout(checkoutOptions).then(async function(checkoutResult) {
            console.log('Checkout result:', checkoutResult);
            
            if(checkoutResult.error){
              console.error('Checkout error:', checkoutResult.error);
              alert('Payment failed: ' + (checkoutResult.error.message || checkoutResult.error));
              setPaymentLoading(false);
            } else if (checkoutResult.redirect) {
              console.log('Redirect detected, payment may be processing');
            } else {
              console.log('Payment completed, checking status...');
              
              try {
                const verifyResponse = await fetch(`/api/payments/cashfree?order_id=${result.orderId}`);
                const verifyResult = await verifyResponse.json();
                
                console.log('Payment verification result:', verifyResult);
                
                if (verifyResult.success && verifyResult.status === 'PAID') {
                  
                  await fetchFees();
                  try {
                    const receiptResponse = await fetch('/api/student/fees/generate-receipt', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        studentId: session.user.uid,
                        studentName: session.user.name,
                        studentClass: session.user.class || 'N/A',
                        studentSection: session.user.section || 'N/A',
                        feeIds: feeIds
                      }),
                    });

                    if (receiptResponse.ok) {
                      const blob = await receiptResponse.blob();
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.style.display = 'none';
                      a.href = url;
                      a.download = `fee_receipt_${session.user.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
                      document.body.appendChild(a);
                      a.click();
                      window.URL.revokeObjectURL(url);
                      document.body.removeChild(a);
                    }
                  } catch (receiptError) {
                    console.error('Error downloading receipt:', receiptError);
                  }

                  alert('Payment successful! PDF receipt has been downloaded.');
                } else {
                  alert('Payment was not completed successfully. Status: ' + (verifyResult.status || 'Unknown'));
                }
              } catch (verifyError) {
                console.error('Error verifying payment:', verifyError);
                alert('Payment status unclear. Please check your payment history.');
              }
              
              setPaymentLoading(false);
            }
          }).catch(function(error) {
            console.error('Cashfree checkout error:', error);
            alert('Payment initialization failed: ' + error.message);
            setPaymentLoading(false);
          });
        } catch (error) {
          console.error('Error calling checkout:', error);
          alert('Failed to open payment gateway: ' + error.message);
          setPaymentLoading(false);
        }
      } else {
        // Display proper error message
        const errorMessage = result.message || result.error || 'Payment initiation failed';
        alert('Payment initiation failed: ' + errorMessage);
        console.error('Payment error details:', result);
        setPaymentLoading(false);
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
      setPaymentLoading(false);
    }
  }, [session, fetchFees]);

  const handlePayNow = useCallback(() => {
    const pendingFees = fees.filter(fee => fee.status === 'pending');
    if (pendingFees.length === 0) {
      alert('No pending fees to pay.');
      return;
    }

    setSelectedFees(pendingFees.map(fee => fee.id));
    setShowPaymentModal(true);
  }, [fees]);

  const handleFeeSelection = useCallback((feeId) => {
    setSelectedFees(prev =>
      prev.includes(feeId)
        ? prev.filter(id => id !== feeId)
        : [...prev, feeId]
    );
  }, []);

  const handleBulkPayment = useCallback(() => {
    if (selectedFees.length === 0) {
      alert('Please select at least one fee to pay.');
      return;
    }
    handlePayment(selectedFees);
    setShowPaymentModal(false);
  }, [selectedFees, handlePayment]);

  const generateReceipt = useCallback((paymentData) => {
    const receiptData = {
      paymentId: paymentData.transactionId,
      studentName: session?.user?.name,
      studentEmail: session?.user?.email,
      amount: paymentData.amount,
      status: paymentData.status,
      paymentDate: new Date().toLocaleString(),
      fees: paymentData.fees,
    };
    setReceipt(receiptData);
  }, [session]);

  const downloadReceipt = useCallback(async (feeId) => {
    if (!session?.user?.uid) return;

    setDownloadingReceipt(true);
    try {
      const response = await fetch('/api/student/fees/generate-receipt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: session.user.uid,
          studentName: session.user.name,
          studentClass: session.user.class || 'N/A',
          studentSection: session.user.section || 'N/A',
          feeIds: [feeId]
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate receipt');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `fee_receipt_${session.user.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.html`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

    } catch (error) {
      console.error('Error downloading receipt:', error);
      alert('Failed to download receipt. Please try again.');
    } finally {
      setDownloadingReceipt(false);
    }
  }, [session]);

  const downloadBulkReceipt = useCallback(async () => {
    if (!session?.user?.uid) return;

    const paidFees = fees.filter(fee => fee.status === 'paid');
    if (paidFees.length === 0) {
      alert('No paid fees found to download receipts for.');
      return;
    }

    setDownloadingReceipt(true);
    try {
      const response = await fetch('/api/student/fees/generate-receipt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: session.user.uid,
          studentName: session.user.name,
          studentClass: session.user.class || 'N/A',
          studentSection: session.user.section || 'N/A',
          feeIds: paidFees.map(fee => fee.id)
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate bulk receipt');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `fee_receipt_bulk_${session.user.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.html`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

    } catch (error) {
      console.error('Error downloading bulk receipt:', error);
      alert('Failed to download bulk receipt. Please try again.');
    } finally {
      setDownloadingReceipt(false);
    }
  }, [session, fees]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Fees</h2>
        <p className="text-gray-600 dark:text-gray-400">View and track your fee payments</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                Rs. {summary.totalAmount?.toFixed(2) || '0.00'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Paid</p>
              <p className="text-2xl font-bold text-green-600">
                Rs. {summary.paidAmount?.toFixed(2) || '0.00'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                Rs. {summary.pendingAmount?.toFixed(2) || '0.00'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Payment Rate</p>
              <p className="text-2xl font-bold text-indigo-600">
                {summary.paymentRate?.toFixed(1) || '0.0'}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts for overdue and upcoming fees */}
      {(overdueFees.length > 0 || upcomingFees.length > 0) && (
        <div className="space-y-3">
          {overdueFees.length > 0 && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                  Overdue Fees ({overdueFees.length})
                </h3>
              </div>
              <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                You have {overdueFees.length} overdue fee{overdueFees.length > 1 ? 's' : ''} totaling Rs. 
                {overdueFees.reduce((sum, fee) => sum + parseFloat(fee.amount || 0), 0).toFixed(2)}
              </p>
            </div>
          )}

          {upcomingFees.length > 0 && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-yellow-600 mr-2" />
                <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  Upcoming Due Dates ({upcomingFees.length})
                </h3>
              </div>
              <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
                {upcomingFees.length} fee{upcomingFees.length > 1 ? 's' : ''} due within the next 30 days
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'all', name: 'All Fees', count: fees.length },
            { id: 'pending', name: 'Pending', count: summary.pendingFees || 0 },
            { id: 'paid', name: 'Paid', count: summary.paidFees || 0 },
            { id: 'overdue', name: 'Overdue', count: summary.overdueFees || 0 },
            { id: 'upcoming', name: 'Upcoming', count: summary.upcomingFeesCount || 0 }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {tab.name}
              {tab.count > 0 && (
                <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                  activeTab === tab.id
                    ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-400'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Fees List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Fee Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Payment Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredFees.map((fee) => (
                <tr key={fee.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                        {fee.fee_type} Fee
                      </div>
                      {fee.description && (
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {fee.description}
                        </div>
                      )}
                      <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        Created: {new Date(fee.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      Rs. {fee.amount}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {new Date(fee.due_date).toLocaleDateString()}
                    </div>
                    {fee.status === 'overdue' && (
                      <div className="text-xs text-red-600 dark:text-red-400">
                        {Math.ceil((new Date() - new Date(fee.due_date)) / (1000 * 60 * 60 * 24))} days overdue
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(fee.status)}`}>
                      {getStatusIcon(fee.status)}
                      <span className="ml-1 capitalize">{fee.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {fee.status === 'paid' ? (
                      <div>
                        <div className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
                          <span>Paid on {new Date(fee.payment_date).toLocaleDateString()}</span>
                        </div>
                        {fee.payment_method && (
                          <div className="text-xs mt-1">
                            Method: {fee.payment_method}
                          </div>
                        )}
                      </div>
                    ) : fee.status === 'pending' ? (
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 text-yellow-600 mr-1" />
                        <span>Payment pending</span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <AlertCircle className="w-4 h-4 text-red-600 mr-1" />
                        <span>Overdue</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      {fee.status === 'paid' && (
                        <button
                          onClick={() => downloadReceipt(fee.id)}
                          disabled={downloadingReceipt}
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 disabled:opacity-50"
                          title="Download Receipt"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredFees.length === 0 && (
          <div className="text-center py-8">
            <Receipt className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No fees found</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {activeTab === 'all' ? 'You have no fees at the moment.' : `No ${activeTab} fees found.`}
            </p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      {fees.some(fee => fee.status === 'pending') && (
        <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-indigo-800 dark:text-indigo-200">
                Ready to make a payment?
              </h3>
              <p className="mt-1 text-sm text-indigo-700 dark:text-indigo-300">
                You have {summary.pendingFees || 0} pending fee{summary.pendingFees !== 1 ? 's' : ''} totaling Rs. 
                {summary.pendingAmount?.toFixed(2) || '0.00'}
              </p>
            </div>
            <button
              onClick={handlePayNow}
              disabled={paymentLoading}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              {paymentLoading ? 'Processing...' : 'Pay Now'}
            </button>
          </div>
        </div>
      )}

      {/* Bulk Receipt Download */}
      {fees.some(fee => fee.status === 'paid') && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
                Download Payment Receipts
              </h3>
              <p className="mt-1 text-sm text-green-700 dark:text-green-300">
                You have {summary.paidFees || 0} paid fee{summary.paidFees !== 1 ? 's' : ''} with available receipts
              </p>
            </div>
            <button
              onClick={downloadBulkReceipt}
              disabled={downloadingReceipt}
              className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              {downloadingReceipt ? 'Downloading...' : 'Download All Receipts'}
            </button>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 max-w-md shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Select Fees to Pay
              </h3>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {fees.filter(fee => fee.status === 'pending').map((fee) => (
                  <div key={fee.id} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id={`fee-${fee.id}`}
                      checked={selectedFees.includes(fee.id)}
                      onChange={() => handleFeeSelection(fee.id)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`fee-${fee.id}`} className="text-sm text-gray-900 dark:text-white">
                      {fee.fee_type} Fee - Rs. {fee.amount}
                      <span className="text-gray-500 dark:text-gray-400 ml-2">
                        Due: {new Date(fee.due_date).toLocaleDateString()}
                      </span>
                    </label>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total: Rs. {selectedFees.reduce((sum, feeId) => {
                    const fee = fees.find(f => f.id === feeId);
                    return sum + (fee ? parseFloat(fee.amount) : 0);
                  }, 0).toFixed(2)}
                </p>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBulkPayment}
                  disabled={selectedFees.length === 0 || paymentLoading}
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:bg-indigo-400"
                >
                  {paymentLoading ? 'Processing...' : 'Pay Selected'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {receipt && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Payment Receipt
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Payment ID:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{receipt.paymentId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Student:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{receipt.studentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Amount:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Rs. {receipt.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Status:</span>
                  <span className="text-sm font-medium text-green-600">{receipt.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Date:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{receipt.paymentDate}</span>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setReceipt(null)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  Close
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Print
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default StudentFees;
