'use client';

import { useEffect, useState } from 'react';
import { adminAPI, ReturnRequest, ReturnStatus } from '@/lib/api';

const STATUS_ACTIONS: Record<ReturnStatus, { label: string; next: string[] }> = {
  REQUESTED: { label: 'Requested', next: ['APPROVED', 'REJECTED'] },
  APPROVED: { label: 'Approved', next: ['RECEIVED'] },
  REJECTED: { label: 'Rejected', next: [] },
  RECEIVED: { label: 'Received', next: ['REFUNDED'] },
  REFUNDED: { label: 'Refunded', next: [] },
};

const STATUS_COLOR: Record<ReturnStatus, string> = {
  REQUESTED: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  APPROVED: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  REJECTED: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  RECEIVED: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  REFUNDED: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
};

export default function AdminReturns() {
  const [returns, setReturns] = useState<ReturnRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [updating, setUpdating] = useState<number | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);

  const fetchReturns = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getReturnRequests(filterStatus || undefined);
      setReturns(Array.isArray(data) ? data : []);
      setError('');
    } catch (err) {
      setError('Failed to load return requests');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchReturns(); }, [filterStatus]);

  const handleUpdateStatus = async (returnId: number, newStatus: string) => {
    setUpdating(returnId);
    setSuccessMsg('');
    try {
      await adminAPI.updateReturnStatus(returnId, newStatus);
      setSuccessMsg(`Return request ${newStatus.toLowerCase()} successfully.`);
      await fetchReturns();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update return status');
    } finally {
      setUpdating(null);
    }
  };

  if (loading) return <div className="p-6 text-gray-600 dark:text-gray-400">Loading return requests...</div>;

  return (
    <div className="space-y-4">
      {/* Header + Filter */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Return Requests</h2>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 text-sm dark:bg-gray-700 dark:text-white"
        >
          <option value="">All Statuses</option>
          {(Object.keys(STATUS_ACTIONS) as ReturnStatus[]).map((s) => (
            <option key={s} value={s}>{STATUS_ACTIONS[s].label}</option>
          ))}
        </select>
      </div>

      {error && <div className="text-red-600 text-sm p-3 bg-red-50 dark:bg-red-900/30 rounded-lg">{error}</div>}
      {successMsg && <div className="text-green-700 text-sm p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">{successMsg}</div>}

      {returns.length === 0 ? (
        <p className="p-6 text-gray-500 dark:text-gray-400">No return requests found.</p>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto">
          <table className="w-full min-w-[680px]">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>
                {['ID', 'Order', 'Customer', 'Refund Amt', 'Status', 'Date', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {returns.map((rr) => {
                const statusInfo = STATUS_ACTIONS[rr.status as ReturnStatus];
                const rrWithUser = rr as ReturnRequest & { user?: { firstName?: string; lastName?: string; email?: string } };
                return (
                  <>
                    <tr
                      key={rr.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                      onClick={() => setExpanded(expanded === rr.id ? null : rr.id)}
                    >
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">#{rr.id}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                        {rr.order?.orderNumber ?? `#${rr.orderId}`}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                        {rrWithUser.user
                          ? `${rrWithUser.user.firstName ?? ''} ${rrWithUser.user.lastName ?? ''}`.trim() || rrWithUser.user.email
                          : '—'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                        {rr.refundAmount != null ? `₹${parseFloat(String(rr.refundAmount)).toFixed(2)}` : '—'}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLOR[rr.status as ReturnStatus] ?? 'bg-gray-100 text-gray-800'}`}>
                          {rr.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                        {new Date(rr.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-sm" onClick={(e) => e.stopPropagation()}>
                        <div className="flex gap-2 flex-wrap">
                          {statusInfo?.next.map((nextStatus) => (
                            <button
                              key={nextStatus}
                              disabled={updating === rr.id}
                              onClick={() => handleUpdateStatus(rr.id, nextStatus)}
                              className={`px-2 py-1 text-xs font-medium rounded transition-colors disabled:opacity-50 ${
                                nextStatus === 'APPROVED'
                                  ? 'bg-green-600 text-white hover:bg-green-700'
                                  : nextStatus === 'REJECTED'
                                  ? 'bg-red-600 text-white hover:bg-red-700'
                                  : 'bg-blue-600 text-white hover:bg-blue-700'
                              }`}
                            >
                              {nextStatus}
                            </button>
                          ))}
                          {statusInfo?.next.length === 0 && <span className="text-xs text-gray-400">—</span>}
                        </div>
                      </td>
                    </tr>

                    {/* Expanded return items */}
                    {expanded === rr.id && (
                      <tr key={`${rr.id}-detail`} className="bg-gray-50 dark:bg-gray-700/50">
                        <td colSpan={7} className="px-6 py-4">
                          <div className="space-y-2">
                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Return Items</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {rr.items?.map((ri) => {
                                const productName = ri.orderItem?.product?.name ?? `Product #${ri.orderItem?.productId}`;
                                const pkgLabel = ri.orderItem?.package ? ` (${ri.orderItem.package.duration})` : '';
                                return (
                                  <div key={ri.id} className="text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 rounded p-2 border border-gray-100 dark:border-gray-600">
                                    {productName}{pkgLabel} — Return qty: <strong>{ri.quantity}</strong>
                                  </div>
                                );
                              })}
                            </div>
                            {rr.reason && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                <span className="font-medium">Reason:</span> {rr.reason}
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
