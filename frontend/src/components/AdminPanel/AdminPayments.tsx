'use client';

export default function AdminPayments() {
  const payments = [
    {
      id: 'PAY-001',
      from: 'John Doe',
      amount: '$249.99',
      method: 'Credit Card',
      status: 'Completed',
      date: '2024-03-01',
    },
    {
      id: 'PAY-002',
      from: 'Jane Smith',
      amount: '$199.99',
      method: 'PayPal',
      status: 'Completed',
      date: '2024-03-02',
    },
    {
      id: 'PAY-003',
      from: 'Bob Johnson',
      amount: '$349.99',
      method: 'Bank Transfer',
      status: 'Pending',
      date: '2024-03-03',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
              Payment ID
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
              From
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
              Amount
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
              Method
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
              Status
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
              Date
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {payments.map((payment) => (
            <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <td className="px-6 py-3 text-sm font-medium text-gray-900 dark:text-white">
                {payment.id}
              </td>
              <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">
                {payment.from}
              </td>
              <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">
                {payment.amount}
              </td>
              <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">
                {payment.method}
              </td>
              <td className="px-6 py-3 text-sm">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    payment.status
                  )}`}
                >
                  {payment.status}
                </span>
              </td>
              <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">
                {payment.date}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
