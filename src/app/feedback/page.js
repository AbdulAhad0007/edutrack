"use client";

import { useState } from 'react';
import emailjs from '@emailjs/browser';

export default function FeedbackPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      // Replace SERVICE_ID, TEMPLATE_ID, PUBLIC_KEY with your EmailJS values
      await emailjs.send('SERVICE_ID', 'TEMPLATE_ID', {
        from_name: name,
        from_email: email,
        message,
      }, 'PUBLIC_KEY');
      setStatus('sent');
      setName(''); setEmail(''); setMessage('');
    } catch (err) {
      console.error('EmailJS error', err);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full bg-white dark:bg-gray-800 p-8 rounded-lg shadow">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Feedback</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">Send us your feedback and we'll get back to you.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="w-full p-2 border rounded" />
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email" className="w-full p-2 border rounded" />
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={6} placeholder="Message" className="w-full p-2 border rounded" />
          <div className="flex items-center justify-between">
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">Send</button>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              {status === 'sending' && 'Sending...'}
              {status === 'sent' && 'Sent — thank you!'}
              {status === 'error' && 'Failed to send.'}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}


