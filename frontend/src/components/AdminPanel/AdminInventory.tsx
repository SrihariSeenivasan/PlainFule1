'use client';

import { useEffect, useState } from 'react';
import { Plus, Minus, Search, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { adminAPI, Product } from '@/lib/api';

export default function AdminInventory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [updating, setUpdating] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await adminAPI.getProducts();
        if (Array.isArray(data)) {
          setProducts(data);
          setFilteredProducts(data);
        }
        setError('');
      } catch (err) {
        setError('Failed to load products');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(value.toLowerCase()) ||
      product.id.toString().includes(value)
    );
    setFilteredProducts(filtered);
  };

  const handleStockChange = async (productId: number, action: 'up' | 'down', quantity: number = 1) => {
    try {
      setUpdating(productId);
      const product = products.find(p => p.id === productId);
      if (!product) return;

      const currentStock = product.stock || 0;
      const newStock = action === 'up' ? currentStock + quantity : Math.max(0, currentStock - quantity);

      await adminAPI.updateProduct(productId, { ...product, stock: newStock });

      setProducts(products.map(p => p.id === productId ? { ...p, stock: newStock } : p));
      setFilteredProducts(filteredProducts.map(p => p.id === productId ? { ...p, stock: newStock } : p));

      setSuccessMessage(`Stock updated for ${product.name}`);
      setTimeout(() => setSuccessMessage(''), 3000);
      setError('');
    } catch (err) {
      setError('Failed to update stock');
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

  const handleQuickAdjust = async (productId: number, newStock: number) => {
    try {
      setUpdating(productId);
      const product = products.find(p => p.id === productId);
      if (!product) return;

      await adminAPI.updateProduct(productId, { ...product, stock: Math.max(0, newStock) });

      setProducts(products.map(p => p.id === productId ? { ...p, stock: Math.max(0, newStock) } : p));
      setFilteredProducts(filteredProducts.map(p => p.id === productId ? { ...p, stock: Math.max(0, newStock) } : p));

      setSuccessMessage(`Stock updated for ${product.name}`);
      setTimeout(() => setSuccessMessage(''), 3000);
      setError('');
    } catch (err) {
      setError('Failed to update stock');
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: 'Out of Stock', class: 'bg-red-900/40 text-red-400' };
    if (stock <= 5) return { label: 'Critical', class: 'bg-orange-900/40 text-orange-400' };
    if (stock <= 15) return { label: 'Low Stock', class: 'bg-yellow-900/40 text-yellow-400' };
    return { label: 'In Stock', class: 'bg-green-900/40 text-green-400' };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-green-500" size={36} />
          <p className="text-sm text-gray-400">Loading inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 bg-gray-900 min-h-screen p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Inventory Management
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} · Adjust stock levels
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {[
            { label: 'In Stock', count: products.filter(p => p.stock > 15).length, color: 'bg-green-900/40 text-green-400' },
            { label: 'Low', count: products.filter(p => p.stock > 0 && p.stock <= 15).length, color: 'bg-yellow-900/40 text-yellow-400' },
            { label: 'Out', count: products.filter(p => p.stock === 0).length, color: 'bg-red-900/40 text-red-400' },
          ].map(({ label, count, color }) => (
            <span key={label} className={`text-xs font-semibold px-2.5 py-1 rounded-full ${color}`}>
              {count} {label}
            </span>
          ))}
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-900/20 border border-red-800 rounded-xl p-3 flex items-center gap-3">
          <AlertCircle className="text-red-500 shrink-0" size={18} />
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}
      {successMessage && (
        <div className="bg-green-900/20 border border-green-800 rounded-xl p-3 flex items-center gap-3">
          <CheckCircle className="text-green-500 shrink-0" size={18} />
          <p className="text-sm text-green-300">{successMessage}</p>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
        <input
          type="text"
          placeholder="Search by name or ID..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-700 rounded-xl bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
        />
      </div>

      {/* Products Grid */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
        {filteredProducts.map((product) => {
          const status = getStockStatus(product.stock || 0);
          const isUpdating = updating === product.id;

          return (
            <div
              key={product.id}
              className="bg-gray-800 border border-gray-700 rounded-xl p-4 sm:p-5 hover:shadow-lg hover:shadow-black/30 transition-shadow flex flex-col gap-4"
            >
              {/* Product header */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-white text-sm leading-tight truncate">
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5 font-mono">ID: {product.id}</p>
                </div>
                <span className={`shrink-0 text-xs font-semibold px-2 py-1 rounded-full ${status.class}`}>
                  {status.label}
                </span>
              </div>

              {/* Description */}
              {product.description && (
                <p className="text-xs text-gray-400 line-clamp-2 -mt-2">
                  {product.description}
                </p>
              )}

              {/* Stock display + price row */}
              <div className="flex items-center justify-between bg-gray-700/50 rounded-lg px-4 py-3">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Stock</p>
                  <p className="text-3xl font-bold text-white leading-tight mt-0.5">
                    {product.stock || 0}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Price</p>
                  <p className="text-lg font-bold text-white mt-0.5">₹{product.price}</p>
                </div>
              </div>

              {/* Direct input */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                  Set Stock Directly
                </label>
                <input
                  type="number"
                  min="0"
                  defaultValue={product.stock || 0}
                  onBlur={(e) => {
                    const value = parseInt(e.currentTarget.value) || 0;
                    if (value !== product.stock) {
                      handleQuickAdjust(product.id, value);
                    }
                  }}
                  className="w-full px-3 py-2 text-sm border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
              </div>

              {/* ±5 buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleStockChange(product.id, 'up', 5)}
                  disabled={isUpdating}
                  className="flex items-center justify-center gap-1.5 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2 px-3 rounded-lg transition-colors text-sm"
                >
                  {isUpdating ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
                  +5
                </button>
                <button
                  onClick={() => handleStockChange(product.id, 'down', 5)}
                  disabled={isUpdating}
                  className="flex items-center justify-center gap-1.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2 px-3 rounded-lg transition-colors text-sm"
                >
                  {isUpdating ? <Loader2 size={15} className="animate-spin" /> : <Minus size={15} />}
                  -5
                </button>
              </div>

              {/* ±1 buttons */}
              <div className="grid grid-cols-2 gap-2 -mt-2">
                <button
                  onClick={() => handleStockChange(product.id, 'up', 1)}
                  disabled={isUpdating}
                  className="text-xs font-semibold bg-green-900/30 text-green-400 hover:bg-green-900/50 disabled:opacity-50 disabled:cursor-not-allowed py-1.5 rounded-lg transition-colors"
                >
                  +1
                </button>
                <button
                  onClick={() => handleStockChange(product.id, 'down', 1)}
                  disabled={isUpdating}
                  className="text-xs font-semibold bg-orange-900/30 text-orange-400 hover:bg-orange-900/50 disabled:opacity-50 disabled:cursor-not-allowed py-1.5 rounded-lg transition-colors"
                >
                  -1
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-16">
          <p className="text-3xl mb-3">🔍</p>
          <p className="font-medium text-gray-300">No products found</p>
          {searchTerm && (
            <p className="text-sm text-gray-500 mt-1">
              Try a different search term
            </p>
          )}
        </div>
      )}
    </div>
  );
}