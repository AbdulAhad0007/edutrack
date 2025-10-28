"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function PaymentCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [status, setStatus] = useState('processing'); 
  const [message, setMessage] = useState('Verifying your payment...');

  useEffect(() => {
    const verifyPayment = async () => {
      const orderId = searchParams.get('order_id');
      const paymentSuccess = searchParams.get('payment_success');

      if (!orderId) {
        setStatus('failed');
        setMessage('Invalid payment reference.');
        return;
      }

      try {
        // Verify payment with backend
        const response = await fetch(`/api/payments/cashfree?order_id=${orderId}`);
        const result = await response.json();

        if (result.success && result.status === 'PAID') {
          setStatus('success');
          setMessage('Payment completed successfully!');

          // Generate receipt
          if (result.paymentRecord && session?.user) {
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
                  feeIds: result.paymentRecord.fee_ids
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
          }
          setTimeout(() => {
            if (session?.user?.id) {
              router.push(`/erp/${session.user.id}`);
            }
          }, 3000);
        } else {
          setStatus('failed');
          setMessage(`Payment verification failed. Status: ${result.status || 'Unknown'}`);
          
          setTimeout(() => {
            if (session?.user?.id) {
              router.push(`/erp/${session.user.id}`);
            }
          }, 5000);
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        setStatus('failed');
        setMessage('Failed to verify payment. Please contact support.');
        
        setTimeout(() => {
          if (session?.user?.id) {
            router.push(`/erp/${session.user.id}`);
          }
        }, 5000);
      }
    };

    if (session) {
      verifyPayment();
    }
  }, [searchParams, session, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {status === 'processing' && (
          <>
            <Loader2 className="w-16 h-16 mx-auto text-blue-600 animate-spin mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Processing Payment</h2>
            <p className="text-gray-600">{message}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="w-16 h-16 mx-auto text-green-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <p className="text-sm text-gray-500">Your receipt has been downloaded.</p>
            <p className="text-sm text-gray-500 mt-2">Redirecting to dashboard...</p>
          </>
        )}

        {status === 'failed' && (
          <>
            <XCircle className="w-16 h-16 mx-auto text-red-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
          </>
        )}

        {session?.user?.id && (
          <button
            onClick={() => router.push(`/erp/${session.user.id}`)}
            className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Go to Dashboard
          </button>
        )}
      </div>
    </div>
  );
}
