"use client";

import { useState } from 'react';
import { send } from '@emailjs/browser';

export default function Feedback() {
  const [name, setName] = useState('');
  const [roll, setRoll] = useState('');
  const [klass, setKlass] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [issue, setIssue] = useState('General');
  const [comments, setComments] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

      const templateParams = {
        from_name: name,
        roll_no: roll,
        class: klass,
        from_email: email,
        phone,
        issue,
        comments,
      };

      await send(serviceId, templateId, templateParams, publicKey);
      setStatus('sent');
      setName(''); setRoll(''); setKlass(''); setEmail(''); setPhone(''); setComments(''); setIssue('General');
    } catch (err) {
      console.error('EmailJS error', err);
      setStatus('error');
    }
  };

  return (
    <div className="py-6">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Feedback Form</h2>
      <p className="mt-4 text-gray-600 dark:text-gray-400">Send us your feedback or report a problem.</p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4 max-w-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="w-full p-2 border rounded" required />
          <input value={roll} onChange={(e) => setRoll(e.target.value)} placeholder="Roll No" className="w-full p-2 border rounded" required />
          <input value={klass} onChange={(e) => setKlass(e.target.value)} placeholder="Class" className="w-full p-2 border rounded" required />
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full p-2 border rounded" required />
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" className="w-full p-2 border rounded" />
          <select value={issue} onChange={(e) => setIssue(e.target.value)} className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:text-gray-200">
            <option>General</option>
            <option>Technical</option>
            <option>Payment</option>
            <option>Academic</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-700 dark:text-gray-300">Comments</label>
          <textarea value={comments} onChange={(e) => setComments(e.target.value)} className="w-full mt-2 p-2 border rounded-md bg-white dark:bg-gray-700 dark:text-gray-200" rows={6} required />
        </div>
        <div className="flex items-center gap-4">
          <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-md">Send</button>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            {status === 'sending' && 'Sending...'}
            {status === 'sent' && 'Sent — thank you!'}
            {status === 'error' && 'Failed to send.'}
          </div>
        </div>
      </form>
    </div>
  );
}
