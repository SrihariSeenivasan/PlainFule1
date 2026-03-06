'use client';

import { useEffect, useState } from 'react';
import { adminAPI, Order } from '@/lib/api';

export default function AdminPayments() {
  const [payments, setPayments] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        // Fetch orders and treat them as payments
        const fetchedOrders = await adminAPI.getOrders();
        setPayments(Array.isArray(fetchedOrders) ? fetchedOrders : []);
        setError('');
      } catch (err) {
        console.error('Failed to fetch payments:', err);
        setError('Failed to load payments');
        setPayments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED':
      case 'SHIPPED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'PROCESSING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'PENDING':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="p-6 text-gray-600">Loading payments...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  if (payments.length === 0) {
    return <div className="p-6 text-gray-600">No payments found</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
              Payment ID
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
              Order Number
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
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {payments.map((payment) => (
            <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <td className="px-6 py-3 text-sm font-medium text-gray-900 dark:text-white">
                PAY-{payment.id}
              </td>
              <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">
                {payment.orderNumber}
              </td>
              <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">
                ₹{payment.totalAmount}
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
                {new Date(payment.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
