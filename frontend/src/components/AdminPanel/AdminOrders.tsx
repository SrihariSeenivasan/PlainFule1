'use client';

import { useEffect, useState } from 'react';
import { adminAPI, Order, OrderItem } from '@/lib/api';

const ORDER_STATUSES = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'] as const;

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [updating, setUpdating] = useState<number | null>(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const fetched = await adminAPI.getOrders(filterStatus || undefined);
      setOrders(Array.isArray(fetched) ? fetched : []);
      setError('');
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchOrders(); }, [filterStatus]);

  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    setUpdating(orderId);
    setSuccessMsg('');
    try {
      await adminAPI.updateOrderStatus(orderId, { status: newStatus });
      setSuccessMsg(`Order updated to ${newStatus}`);
      await fetchOrders();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update order');
    } finally {
      setUpdating(null);
    }
  };

  const getStatusColor = (status: string) => {
    const map: Record<string, string> = {
      DELIVERED: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      SHIPPED: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      PROCESSING: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };
    return map[status] ?? 'bg-gray-100 text-gray-800';
  };

  const getItemLabel = (item: OrderItem) => {
    const productName = item.product?.name ?? `Product #${item.productId}`;
    const packageLabel = item.package ? ` (${item.package.duration})` : '';
    return `${productName}${packageLabel} ×${item.quantity}`;
  };

  if (loading) return <div className="p-6 text-gray-600 dark:text-gray-400">Loading orders...</div>;

  return (
    <div className="space-y-4">
      {/* Header + Filter */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">All Orders</h2>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 text-sm dark:bg-gray-700 dark:text-white"
        >
          <option value="">All Statuses</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {error && <div className="text-red-600 text-sm p-3 bg-red-50 dark:bg-red-900/30 rounded-lg">{error}</div>}
      {successMsg && <div className="text-green-700 text-sm p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">{successMsg}</div>}

      {orders.length === 0 ? (
        <p className="p-6 text-gray-500 dark:text-gray-400">No orders found.</p>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>
                {['Order #', 'Customer', 'Items', 'Amount', 'Status', 'Date', 'Update Status'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {orders.map((order) => {
                const orderWithUser = order as Order & { user?: { firstName?: string; lastName?: string; email?: string } };
                return (
                  <>
                    <tr
                      key={order.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                      onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                    >
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">
                        {order.orderNumber}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                        {orderWithUser.user
                          ? `${orderWithUser.user.firstName ?? ''} ${orderWithUser.user.lastName ?? ''}`.trim() || orderWithUser.user.email
                          : '—'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                        {order.items?.length ?? 0} item(s)
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                        ₹{parseFloat(String(order.totalAmount)).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-sm" onClick={(e) => e.stopPropagation()}>
                        {order.status !== 'CANCELLED' ? (
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                            disabled={updating === order.id}
                            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-xs dark:bg-gray-700 dark:text-white disabled:opacity-50"
                          >
                            {ORDER_STATUSES.filter((s) => s !== 'CANCELLED').map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                    </tr>

                    {/* Expanded item details */}
                    {expandedOrder === order.id && (
                      <tr key={`${order.id}-detail`} className="bg-gray-50 dark:bg-gray-700/50">
                        <td colSpan={7} className="px-6 py-4">
                          <div className="space-y-2">
                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Order Items</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {order.items?.map((item) => (
                                <div key={item.id} className="text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 rounded p-2 border border-gray-100 dark:border-gray-600">
                                  {getItemLabel(item)} — ₹{(parseFloat(String(item.price)) * item.quantity).toFixed(2)}
                                </div>
                              ))}
                            </div>
                            {order.shippingAddress && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                <span className="font-medium">Ship to:</span> {order.shippingAddress}
                              </p>
                            )}
                            {order.deliveryDate && (
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                <span className="font-medium">Delivered:</span> {new Date(order.deliveryDate).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
