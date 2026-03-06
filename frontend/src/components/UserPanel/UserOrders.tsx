'use client';

export default function UserOrders() {
  const orders = [
    {
      id: 'ORD-001',
      product: 'PlainFuel Basic (3-month)',
      amount: '$89.97',
      status: 'Delivered',
      date: '2024-03-01',
      trackingNumber: 'TRK-123456',
    },
    {
      id: 'ORD-002',
      product: 'PlainFuel Pro (Monthly)',
      amount: '$49.99',
      status: 'Processing',
      date: '2024-03-15',
      trackingNumber: 'TRK-789012',
    },
    {
      id: 'ORD-003',
      product: 'PlainFuel Bundle',
      amount: '$199.99',
      status: 'Pending',
      date: '2024-03-20',
      trackingNumber: 'TRK-345678',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Orders List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                Product
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                Date
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <td className="px-6 py-3 text-sm font-medium text-gray-900 dark:text-white">
                  {order.id}
                </td>
                <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">
                  {order.product}
                </td>
                <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">
                  {order.amount}
                </td>
                <td className="px-6 py-3 text-sm">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">
                  {order.date}
                </td>
                <td className="px-6 py-3 text-sm">
                  <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
