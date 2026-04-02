'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Truck, CheckCircle, Clock, XCircle, ArrowLeft, RotateCcw, ShieldCheck, CreditCard, MapPin } from 'lucide-react';
import { orderAPI, Order, OrderItem, ReturnRequest } from '@/lib/api';
import { F_SIZE, BRAND } from '@/lib/typography';
import Image from 'next/image';

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



  const getStatusStyle = (status: string) => {
    const styles: Record<string, { bg: string; color: string; icon: any }> = {
      DELIVERED: { bg: '#dcfce7', color: '#16a34a', icon: CheckCircle },
      SHIPPED: { bg: '#dbeafe', color: '#2563eb', icon: Truck },
      PROCESSING: { bg: '#f3e8ff', color: '#9333ea', icon: Clock },
      PENDING: { bg: '#fef9c3', color: '#ca8a04', icon: Clock },
      CANCELLED: { bg: '#fee2e2', color: '#dc2626', icon: XCircle },
    };
    return styles[status] ?? { bg: '#f3f4f6', color: '#4b5563', icon: Package };
  };

  const getReturnStatusStyle = (status: string) => {
    const styles: Record<string, { bg: string; color: string }> = {
      REQUESTED: { bg: '#fef9c3', color: '#ca8a04' },
      APPROVED: { bg: '#dcfce7', color: '#16a34a' },
      REJECTED: { bg: '#fee2e2', color: '#dc2626' },
      RECEIVED: { bg: '#dbeafe', color: '#2563eb' },
      REFUNDED: { bg: '#ccfbf1', color: '#0d9488' },
    };
    return styles[status] ?? { bg: '#f3f4f6', color: '#4b5563' };
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 gap-4">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
        <RotateCcw size={40} className="text-[#16a34a]" />
      </motion.div>
      <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: F_SIZE.md }} className="font-bold text-[#0a3d1f] opacity-50">Syncing order history...</p>
    </div>
  );

  if (error) return (
    <div className="p-12 text-center" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <XCircle size={48} className="mx-auto text-red-500 mb-4" />
      <p style={{ fontSize: F_SIZE.lg }} className="font-black text-red-600">{error}</p>
    </div>
  );

  return (
    <div style={{ fontFamily: "'Montserrat', sans-serif" }} className="space-y-8">
      {/* Messages */}
      {actionMsg && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-[#0a3d1f05] border border-[#0a3d1f10] text-[#0a3d1f] font-bold flex items-center gap-3"
          style={{ fontSize: F_SIZE.sm }}
        >
          <ShieldCheck size={18} className="text-[#16a34a]" /> {actionMsg}
        </motion.div>
      )}

      {/* Header Area */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 style={{ fontSize: F_SIZE.lg, color: BRAND.primary }} className="font-black tracking-tight mb-1 uppercase">
            Order History
          </h1>
          <p style={{ fontSize: F_SIZE.sm, color: BRAND.secondary }} className="font-semibold uppercase tracking-widest">
            Track your nutritional journey
          </p>
        </div>
        {view === 'detail' && (
          <motion.button
            whileHover={{ x: -5 }}
            onClick={() => { setView('list'); setSelectedOrder(null); setActionMsg(''); }}
            className="flex items-center gap-2 font-black uppercase tracking-widest text-[#0a3d1f] transition-all"
            style={{ fontSize: F_SIZE.sm }}
          >
            <ArrowLeft size={16} /> All Shipments
          </motion.button>
        )}
      </div>

      <AnimatePresence>
        {orders.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="p-20 text-center rounded-[32px] border-2 border-dashed border-[#0a3d1f10]"
            style={{ background: BRAND.light, backdropFilter: 'blur(32px)' }}
          >
            <Package size={48} className="mx-auto text-[#0a3d1f20] mb-4" />
            <p style={{ fontSize: F_SIZE.md }} className="font-bold text-[#0a3d1f50]">No order history found.</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {orders.map((order, i) => {
              const status = getStatusStyle(order.status);
              const existingReturn = getReturnForOrder(order.id);
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.05 }}
                  whileHover={{ y: -8 }}
                  onClick={() => { setSelectedOrder(order); setView('detail'); setActionMsg(''); }}
                  className="group relative cursor-pointer"
                  style={{
                    borderRadius: 40,
                    overflow: 'hidden',
                    background: 'rgba(255, 255, 255, 0.45)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255, 255, 255, 0.5)',
                    boxShadow: '0 20px 60px -10px rgba(10, 61, 31, 0.04)',
                  }}
                >
                  {/* Image Header Area */}
                  <div className="h-48 relative bg-white flex items-center justify-center p-8">
                    {order.items?.[0] ? (
                      <Image 
                        src={order.items[0].imageUrl || '/images/product.png'} 
                        alt={getItemName(order.items[0])}
                        fill
                        style={{ objectFit: 'contain', padding: 24 }}
                        className="transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-white" />
                    )}
                    
                    <div className="absolute top-6 left-6 z-10">
                       <div 
                         className="px-3 py-1 rounded-lg font-black uppercase tracking-widest flex items-center gap-1.5"
                         style={{ fontSize: 8, backgroundColor: status.bg, color: status.color }}
                       >
                         <status.icon size={10} /> {order.status}
                       </div>
                    </div>
                  </div>

                  <div className="p-8">
                    <div className="flex justify-between items-center mb-6">
                       <span style={{ fontSize: 9 }} className="font-black text-[#0a3d1f40] uppercase tracking-widest">
                         {new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                       </span>
                    </div>

                    <div className="mb-6">
                      <span style={{ fontSize: 10 }} className="font-black text-[#16a34a] uppercase tracking-widest block mb-1">Order ID</span>
                      <h3 style={{ fontSize: F_SIZE.md }} className="font-black text-[#0a3d1f] tracking-tight">{order.orderNumber}</h3>
                    </div>

                    <div className="mb-8">
                      <p style={{ fontSize: F_SIZE.sm }} className="font-bold text-[#0a3d1f] line-clamp-1 opacity-70">
                        {order.items?.map((item) => getItemName(item)).join(', ')}
                      </p>
                    </div>

                    <div className="flex items-end justify-between">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#9eaaa0] block mb-1">Total Amount</span>
                        <span className="text-xl font-black text-[#0a3d1f]">₹{parseFloat(String(order.totalAmount)).toFixed(2)}</span>
                      </div>
                      
                      <motion.div
                        whileHover={{ scale: 1.05, backgroundColor: BRAND.primary, color: '#fff' }}
                        className="px-5 py-2.5 rounded-xl font-black uppercase tracking-widest text-[#0a3d1f] border border-[#0a3d1f10] transition-all"
                        style={{ fontSize: 9 }}
                      >
                        View Details
                      </motion.div>
                    </div>
                  </div>

                  {existingReturn && (
                    <div 
                      className="absolute bottom-0 left-0 right-0 h-1" 
                      style={{ backgroundColor: getReturnStatusStyle(existingReturn.status).color }} 
                    />
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* DETAIL MODAL (PREMIUM GLASS) */}
      <AnimatePresence>
        {view === 'detail' && selectedOrder && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#071a0d70] backdrop-blur-md flex items-center justify-center z-[110] p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white/95 rounded-[48px] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-white relative flex flex-col"
            >
              {/* Close Button */}
              <button 
                onClick={() => { setView('list'); setSelectedOrder(null); setActionMsg(''); }}
                className="absolute top-8 right-8 z-10 w-12 h-12 rounded-2xl bg-[#0a3d1f05] flex items-center justify-center text-[#0a3d1f] hover:bg-[#dc262610] hover:text-[#dc2626] transition-all"
              >
                <XCircle size={24} />
              </button>

              <div className="p-12 overflow-y-auto custom-scrollbar space-y-12">
                <div className="flex items-center justify-between gap-8 flex-wrap">
                  <div className="space-y-1">
                    <span style={{ fontSize: F_SIZE.sm }} className="font-black text-[#16a34a] uppercase tracking-widest block mb-1">Confirmed Order</span>
                    <h2 style={{ fontSize: F_SIZE.xl }} className="font-black text-[#0a3d1f] tracking-tighter leading-none">{selectedOrder.orderNumber}</h2>
                    <p className="text-sm font-semibold text-[#9eaaa0] uppercase tracking-widest">
                      {new Date(selectedOrder.createdAt).toLocaleDateString(undefined, { dateStyle: 'full' })}
                    </p>
                  </div>
                  <div>
                    <div 
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-black uppercase tracking-widest"
                      style={{ 
                        fontSize: 12, 
                        backgroundColor: getStatusStyle(selectedOrder.status).bg, 
                        color: getStatusStyle(selectedOrder.status).color 
                      }}
                    >
                      {(() => {
                        const Icon = getStatusStyle(selectedOrder.status).icon;
                        return <Icon size={16} />;
                      })()}
                      {selectedOrder.status}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                  <div className="space-y-12">
                    {/* Delivery Terminals */}
                    <div className="space-y-4">
                      <h3 style={{ fontSize: F_SIZE.sm }} className="font-black text-[#0a3d1f] uppercase tracking-widest flex items-center gap-2">
                         <MapPin size={16} className="text-[#16a34a]" /> Shipping Address
                      </h3>
                      <div className="bg-[#0a3d1f05] p-8 rounded-[32px] border border-[#0a3d1f05]">
                        <p className="font-bold text-[#0a3d1f] leading-relaxed text-lg">{selectedOrder.shippingAddress}</p>
                      </div>
                    </div>

                    {/* Transaction Audit */}
                    <div className="space-y-4">
                      <h3 style={{ fontSize: F_SIZE.sm }} className="font-black text-[#0a3d1f] uppercase tracking-widest flex items-center gap-2">
                         <CreditCard size={16} className="text-[#16a34a]" /> Payment Details
                      </h3>
                      <div className="bg-[#0a3d1f05] p-8 rounded-[32px] border border-[#0a3d1f05] flex justify-between items-center">
                         <div>
                           <p className="text-xs font-black uppercase tracking-widest text-[#9eaaa0] mb-2">Payment</p>
                           <p className="font-bold text-[#0a3d1f] uppercase tracking-tight text-xl">{selectedOrder.payment?.paymentMethod || 'Credit/Debit'}</p>
                         </div>
                         <div className="text-right">
                           <p className="text-xs font-black uppercase tracking-widest text-[#9eaaa0] mb-2">Total Paid</p>
                           <p className="text-3xl font-black text-[#0a3d1f]">₹{parseFloat(String(selectedOrder.totalAmount)).toFixed(2)}</p>
                         </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <h3 style={{ fontSize: F_SIZE.sm }} className="font-black text-[#0a3d1f] uppercase tracking-widest flex items-center gap-2">
                       <Package size={16} className="text-[#16a34a]" /> Order Items
                    </h3>
                    <div className="space-y-4">
                      {selectedOrder.items?.map((item) => (
                        <div key={item.id} className="flex items-center gap-6 p-6 rounded-[32px] bg-white border border-[#0a3d1f05] shadow-sm">
                          <div className="w-20 h-20 rounded-2xl bg-white border border-[#0a3d1f05] flex items-center justify-center relative overflow-hidden">
                            {item.imageUrl ? (
                              <Image 
                                src={item.imageUrl} 
                                alt={getItemName(item)} 
                                fill 
                                style={{ objectFit: 'contain', padding: 8 }} 
                              />
                            ) : (
                              <Package size={32} className="text-[#16a34a]" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-[#0a3d1f] tracking-tight text-lg">{getItemName(item)}</p>
                            <p className="text-xs font-semibold text-[#9eaaa0] uppercase tracking-wider">{getPackageName(item) || `ID: ${item.productId}`}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-black text-[#1d1d1f] tracking-tight">₹{(parseFloat(String(item.price)) * item.quantity).toFixed(2)}</p>
                            <p className="text-xs font-black text-[#16a34a] uppercase tracking-wider">UNT: {item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-8 flex gap-4">
                      {canCancel(selectedOrder) && (
                        <motion.button
                          whileHover={{ scale: 1.02, backgroundColor: '#dc2626', color: '#fff' }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleCancel(selectedOrder)}
                          className="flex-1 py-4 border-2 border-[#dc262640] text-[#dc2626] rounded-2xl font-black uppercase tracking-widest transition-all"
                          style={{ fontSize: 11 }}
                        >
                          Cancel Order
                        </motion.button>
                      )}
                      {canReturn(selectedOrder) && !getReturnForOrder(selectedOrder.id) && (
                        <motion.button
                          whileHover={{ scale: 1.02, backgroundColor: '#ca8a04', color: '#fff' }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => openReturnModal(selectedOrder)}
                          className="flex-1 py-4 border-2 border-[#ca8a0440] text-[#ca8a04] rounded-2xl font-black uppercase tracking-widest transition-all"
                          style={{ fontSize: 11 }}
                        >
                          Request Return
                        </motion.button>
                      )}
                      {getReturnForOrder(selectedOrder.id) && (
                        <div 
                          className="flex-1 py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2"
                          style={{ 
                            fontSize: 11, 
                            backgroundColor: getReturnStatusStyle(getReturnForOrder(selectedOrder.id)!.status).bg, 
                            color: getReturnStatusStyle(getReturnForOrder(selectedOrder.id)!.status).color 
                          }}
                        >
                          <RotateCcw size={14} /> Return Status: {getReturnForOrder(selectedOrder.id)!.status}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Return Modal (Premium Glass) */}
      <AnimatePresence>
        {returnModal.open && returnModal.order && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#071a0d70] backdrop-blur-md flex items-center justify-center z-[150] p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white/95 rounded-[32px] shadow-2xl w-full max-w-xl overflow-hidden border border-white"
            >
              <div className="p-10 space-y-8">
                <div>
                  <h3 style={{ fontSize: F_SIZE.lg, color: BRAND.primary }} className="font-black tracking-tight mb-2 uppercase">
                    Return Details
                  </h3>
                  <p style={{ fontSize: F_SIZE.sm, color: BRAND.secondary }} className="font-semibold uppercase tracking-widest leading-relaxed">
                    Order: {returnModal.order.orderNumber}
                  </p>
                </div>

                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {returnModal.selectedItems.map((si) => (
                    <div key={si.orderItemId} className="flex items-center justify-between p-4 rounded-2xl bg-[#0a3d1f05] border border-[#0a3d1f05]">
                      <div>
                        <p className="font-bold text-[#0a3d1f] tracking-tight">{si.name}</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#9eaaa0]">Max Quantity: {si.maxQty}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[#0a3d1f60]">UNITS:</label>
                        <input
                          type="number"
                          min={1}
                          max={si.maxQty}
                          value={si.quantity}
                          onChange={(e) => handleReturnQtyChange(si.orderItemId, parseInt(e.target.value) || 1)}
                          className="w-20 bg-white border border-[#0a3d1f10] rounded-xl px-3 py-2 text-center font-black text-[#0a3d1f] focus:border-[#16a34a] focus:ring-4 focus:ring-[#16a34a05] outline-none transition-all"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#0a3d1f60] pl-1">Reason for Return</label>
                  <textarea
                    value={returnModal.reason}
                    onChange={(e) => setReturnModal((prev) => ({ ...prev, reason: e.target.value }))}
                    rows={3}
                    className="w-full bg-[#0a3d1f05] border border-transparent rounded-2xl px-5 py-4 font-bold text-[#0a3d1f] focus:bg-white focus:border-[#16a34a] focus:ring-4 focus:ring-[#16a34a05] outline-none transition-all"
                    placeholder="Tell us why you'd like to return these items..."
                  />
                </div>

                <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setReturnModal((prev) => ({ ...prev, open: false }))}
                    className="flex-1 py-4 font-black uppercase tracking-widest text-[#0a3d1f60] hover:text-[#0a3d1f] transition-all"
                    style={{ fontSize: 11 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02, backgroundColor: BRAND.primaryDark }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleReturnSubmit}
                    disabled={returnModal.submitting}
                    className="flex-2 px-10 py-4 bg-[#0a3d1f] text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-[#0a3d1f20] disabled:bg-gray-300 transition-all"
                    style={{ fontSize: 11 }}
                  >
                    {returnModal.submitting ? 'Submitting...' : 'Submit Request'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #0a3d1f10; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #0a3d1f20; }
      `}</style>
    </div>
  );
}
