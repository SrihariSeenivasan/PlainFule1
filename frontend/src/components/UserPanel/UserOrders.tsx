'use client';

import { useEffect, useState } from 'react';
import { orderAPI, Order, OrderItem, ReturnRequest } from '@/lib/api';

type ViewMode = 'list' | 'detail';

interface ReturnModalState {
  open: boolean;
  order: Order | null;
  selectedItems: { orderItemId: number; quantity: number; maxQty: number; name: string }[];
  reason: string;
  submitting: boolean;
}

export default function UserOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [returnRequests, setReturnRequests] = useState<ReturnRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [view, setView] = useState<ViewMode>('list');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [actionMsg, setActionMsg] = useState('');
  const [returnModal, setReturnModal] = useState<ReturnModalState>({
    open: false,
    order: null,
    selectedItems: [],
    reason: '',
    submitting: false,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [fetchedOrders, fetchedReturns] = await Promise.all([
        orderAPI.getOrders(),
        orderAPI.getReturnRequests(),
      ]);
      setOrders(Array.isArray(fetchedOrders) ? fetchedOrders : []);
      setReturnRequests(Array.isArray(fetchedReturns) ? fetchedReturns : []);
      setError('');
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

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

  const getReturnStatusColor = (status: string) => {
    const map: Record<string, string> = {
      REQUESTED: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      APPROVED: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      REJECTED: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      RECEIVED: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      REFUNDED: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
    };
    return map[status] ?? 'bg-gray-100 text-gray-800';
  };

  const canCancel = (order: Order) => ['PENDING', 'PROCESSING'].includes(order.status);

  const canReturn = (order: Order) => {
    if (order.status !== 'DELIVERED') return false;
    if (!order.deliveryDate) return false;
    const deadline = new Date(order.deliveryDate);
    deadline.setDate(deadline.getDate() + 7);
    return new Date() <= deadline;
  };

  const getReturnForOrder = (orderId: number) =>
    returnRequests.find((r) => r.orderId === orderId);

  const handleCancel = async (order: Order) => {
    if (!confirm(`Cancel order ${order.orderNumber}? This action cannot be undone.`)) return;
    try {
      setActionMsg('');
      await orderAPI.cancelOrder(order.id);
      setActionMsg('Order cancelled successfully. Refund has been simulated.');
      await fetchData();
      if (selectedOrder?.id === order.id) {
        const refreshed = await orderAPI.getOrderById(order.id);
        setSelectedOrder(refreshed);
      }
    } catch (err) {
      setActionMsg(err instanceof Error ? err.message : 'Failed to cancel order');
    }
  };

  const openReturnModal = (order: Order) => {
    setReturnModal({
      open: true,
      order,
      selectedItems: (order.items ?? []).map((item) => ({
        orderItemId: item.id,
        quantity: item.quantity,
        maxQty: item.quantity,
        name: item.product?.name ?? `Product #${item.productId}`,
      })),
      reason: '',
      submitting: false,
    });
  };

  const handleReturnQtyChange = (orderItemId: number, qty: number) => {
    setReturnModal((prev) => ({
      ...prev,
      selectedItems: prev.selectedItems.map((si) =>
        si.orderItemId === orderItemId
          ? { ...si, quantity: Math.max(1, Math.min(qty, si.maxQty)) }
          : si
      ),
    }));
  };

  const handleReturnSubmit = async () => {
    if (!returnModal.order) return;
    setReturnModal((prev) => ({ ...prev, submitting: true }));
    try {
      await orderAPI.createReturnRequest(returnModal.order.id, {
        reason: returnModal.reason || undefined,
        items: returnModal.selectedItems.map((si) => ({
          orderItemId: si.orderItemId,
          quantity: si.quantity,
        })),
      });
      setActionMsg('Return request submitted successfully.');
      setReturnModal((prev) => ({ ...prev, open: false, submitting: false }));
      await fetchData();
    } catch (err) {
      setReturnModal((prev) => ({ ...prev, submitting: false }));
      setActionMsg(err instanceof Error ? err.message : 'Failed to submit return');
    }
  };

  const getItemName = (item: OrderItem) =>
    item.product?.name ?? item.name ?? `Product #${item.productId}`;

  const getPackageName = (item: OrderItem) =>
    item.package ? `${item.package.duration} · ${item.package.pouches} pouches` : '';

  if (loading) return <div className="p-6 text-gray-600 dark:text-gray-400">Loading orders...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  // ── Detail view ───────────────────────────────────────────────
  if (view === 'detail' && selectedOrder) {
    const existingReturn = getReturnForOrder(selectedOrder.id);
    return (
      <div className="space-y-4">
        <button
          onClick={() => { setView('list'); setSelectedOrder(null); setActionMsg(''); }}
          className="text-sm text-blue-600 hover:underline dark:text-blue-400"
        >
          ← Back to Orders
        </button>

        {actionMsg && (
          <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm">
            {actionMsg}
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">{selectedOrder.orderNumber}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Placed on {new Date(selectedOrder.createdAt).toLocaleDateString()}
              </p>
              {selectedOrder.deliveryDate && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Delivered on {new Date(selectedOrder.deliveryDate).toLocaleDateString()}
                </p>
              )}
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
              {selectedOrder.status}
            </span>
          </div>

          {selectedOrder.shippingAddress && (
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Shipping Address</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">{selectedOrder.shippingAddress}</p>
            </div>
          )}

          {/* Items */}
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Items</p>
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {selectedOrder.items?.map((item) => (
                <div key={item.id} className="py-3 flex justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{getItemName(item)}</p>
                    {getPackageName(item) && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">{getPackageName(item)}</p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-400">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    ₹{(parseFloat(String(item.price)) * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between border-t border-gray-100 dark:border-gray-700 pt-3">
            <span className="font-semibold text-gray-900 dark:text-white">Total</span>
            <span className="font-bold text-gray-900 dark:text-white">₹{parseFloat(String(selectedOrder.totalAmount)).toFixed(2)}</span>
          </div>

          {selectedOrder.payment && (
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Payment: {selectedOrder.payment.paymentMethod} · {selectedOrder.payment.status}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2 flex-wrap">
            {canCancel(selectedOrder) && (
              <button
                onClick={() => handleCancel(selectedOrder)}
                className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Cancel Order
              </button>
            )}
            {canReturn(selectedOrder) && !existingReturn && (
              <button
                onClick={() => openReturnModal(selectedOrder)}
                className="px-4 py-2 text-sm font-medium bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                Return Order
              </button>
            )}
            {existingReturn && (
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getReturnStatusColor(existingReturn.status)}`}>
                Return: {existingReturn.status}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── List view ─────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {actionMsg && (
        <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm">
          {actionMsg}
        </div>
      )}

      {orders.length === 0 ? (
        <p className="p-6 text-gray-500 dark:text-gray-400">No orders yet.</p>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>
                {['Order ID', 'Items', 'Amount', 'Status', 'Date', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {orders.map((order) => {
                const existingReturn = getReturnForOrder(order.id);
                return (
                  <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">
                      {order.orderNumber}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {order.items?.map((item) => getItemName(item)).join(', ')}
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
                    <td className="px-4 py-3 text-sm">
                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={() => { setSelectedOrder(order); setView('detail'); setActionMsg(''); }}
                          className="text-blue-600 hover:underline dark:text-blue-400 font-medium text-xs"
                        >
                          View
                        </button>
                        {canCancel(order) && (
                          <button
                            onClick={() => handleCancel(order)}
                            className="text-red-600 hover:underline dark:text-red-400 font-medium text-xs"
                          >
                            Cancel
                          </button>
                        )}
                        {canReturn(order) && !existingReturn && (
                          <button
                            onClick={() => openReturnModal(order)}
                            className="text-orange-600 hover:underline dark:text-orange-400 font-medium text-xs"
                          >
                            Return
                          </button>
                        )}
                        {existingReturn && (
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getReturnStatusColor(existingReturn.status)}`}>
                            Return: {existingReturn.status}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Return Modal */}      {returnModal.open && returnModal.order && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg">
            <div className="p-6 space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Return Items — {returnModal.order.orderNumber}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Select items and quantities to return. All products have a 7-day return policy from delivery date.
              </p>

              <div className="space-y-3">
                {returnModal.selectedItems.map((si) => (
                  <div key={si.orderItemId} className="flex items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-700 pb-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{si.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Max: {si.maxQty}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-gray-600 dark:text-gray-400">Qty:</label>
                      <input
                        type="number"
                        min={1}
                        max={si.maxQty}
                        value={si.quantity}
                        onChange={(e) => handleReturnQtyChange(si.orderItemId, parseInt(e.target.value) || 1)}
                        className="w-16 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Reason (optional)
                </label>
                <textarea
                  value={returnModal.reason}
                  onChange={(e) => setReturnModal((prev) => ({ ...prev, reason: e.target.value }))}
                  rows={3}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:text-white"
                  placeholder="Tell us why you are returning..."
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleReturnSubmit}
                  disabled={returnModal.submitting}
                  className="flex-1 py-2 px-4 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-colors"
                >
                  {returnModal.submitting ? 'Submitting...' : 'Submit Return Request'}
                </button>
                <button
                  onClick={() => setReturnModal((prev) => ({ ...prev, open: false }))}
                  className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors dark:text-white"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
