// src/components/Fees.jsx
export default function Fees() {
  const feeStructure = [
    { term: 'Term 1', amount: 10000, due: '2025-09-15' },
    { term: 'Term 2', amount: 15000, due: '2026-01-10' },
  ];

  const upcomingDues = feeStructure.filter(f => new Date(f.due) > new Date()).map(f => f);

  return (
    <div>
      <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">Fees</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-4 shadow dark:bg-gray-800">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200">Fee Structure</h3>
          <ul className="mt-3 text-sm text-gray-600 dark:text-gray-300">
            {feeStructure.map((f, idx) => (
              <li key={idx} className="py-2 border-b dark:border-gray-700">{f.term} — <span className="font-semibold">Rs
                . {f.amount}</span> (Due: {f.due})</li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-lg p-4 shadow dark:bg-gray-800">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200">Payment</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">You can pay online using the secure gateway below.</p>
          <div className="mt-4">
            <button className="px-4 py-2 bg-indigo-600 text-white rounded">Pay Now</button>
          </div>
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
            <p>Upcoming dues:</p>
            <ul className="mt-2">
              {upcomingDues.map((u, i) => <li key={i}>{u.term} — Due {u.due} — <span className="font-semibold">Rs. {u.amount}</span></li>)}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-lg p-4 shadow dark:bg-gray-800">
        <h3 className="font-semibold text-gray-800 dark:text-gray-200">Scholarships & Reminders</h3>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">No scholarships applied. Late fee reminder will be shown here if payment missed.</p>
      </div>
    </div>
  );
}
