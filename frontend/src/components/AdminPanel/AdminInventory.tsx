'use client';

import { useEffect, useState } from 'react';
import { Plus, Minus, Search, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { adminAPI, Product, ProductPackage } from '@/lib/api';

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

  const handleStockChange = async (productId: number, packageId: string, action: 'up' | 'down', quantity: number = 1) => {
    try {
      setUpdating(productId);
      const product = products.find(p => p.id === productId);
      if (!product || !product.packages) return;

      const updatedPackages = product.packages.map((pkg: ProductPackage) => {
        if (pkg.id === packageId) {
          const currentStock = pkg.stock || 0;
          const newStock = action === 'up' ? currentStock + quantity : Math.max(0, currentStock - quantity);
          return { ...pkg, stock: newStock };
        }
        return pkg;
      });

      await adminAPI.updateProduct(productId, { 
        name: product.name, 
        description: product.description, 
        category: product.category, 
        packages: updatedPackages 
      });

      setProducts(products.map(p => p.id === productId ? { ...p, packages: updatedPackages } : p));
      setFilteredProducts(filteredProducts.map(p => p.id === productId ? { ...p, packages: updatedPackages } : p));

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

  const handleQuickAdjust = async (productId: number, packageId: string, newStock: number) => {
    try {
      setUpdating(productId);
      const product = products.find(p => p.id === productId);
      if (!product || !product.packages) return;

      const updatedPackages = product.packages.map((pkg: ProductPackage) => {
        if (pkg.id === packageId) {
          return { ...pkg, stock: Math.max(0, newStock) };
        }
        return pkg;
      });

      await adminAPI.updateProduct(productId, { 
        name: product.name, 
        description: product.description, 
        category: product.category, 
        packages: updatedPackages 
      });

      setProducts(products.map(p => p.id === productId ? { ...p, packages: updatedPackages } : p));
      setFilteredProducts(filteredProducts.map(p => p.id === productId ? { ...p, packages: updatedPackages } : p));

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
            { label: 'In Stock', count: filteredProducts.filter(p => {
              const total = (p.packages || []).reduce((sum: number, pkg: ProductPackage) => sum + (pkg.stock || 0), 0);
              return total > 15;
            }).length, color: 'bg-green-900/40 text-green-400' },
            { label: 'Low', count: filteredProducts.filter(p => {
              const total = (p.packages || []).reduce((sum: number, pkg: ProductPackage) => sum + (pkg.stock || 0), 0);
              return total > 0 && total <= 15;
            }).length, color: 'bg-yellow-900/40 text-yellow-400' },
            { label: 'Out', count: filteredProducts.filter(p => {
              const total = (p.packages || []).reduce((sum: number, pkg: ProductPackage) => sum + (pkg.stock || 0), 0);
              return total === 0;
            }).length, color: 'bg-red-900/40 text-red-400' },
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
      <div className="grid gap-3 sm:gap-4 grid-cols-1 lg:grid-cols-2">
        {filteredProducts.map((product) => {
          const isUpdating = updating === product.id;
          const packages = (product.packages || []) as ProductPackage[];
          const totalStock = packages.reduce((sum, pkg) => sum + (pkg.stock || 0), 0);

          return (
            <div
              key={product.id}
              className="bg-gray-800 border border-gray-700 rounded-xl p-4 sm:p-5 hover:shadow-lg hover:shadow-black/30 transition-shadow"
            >
              {/* Product header */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-white text-base leading-tight">
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5 font-mono">ID: {product.id}</p>
                </div>
                <div className="text-right text-xs">
                  <p className="text-gray-400">Total Stock</p>
                  <p className="text-2xl font-bold text-white">{totalStock}</p>
                </div>
              </div>

              {/* Description */}
              {product.description && (
                <p className="text-xs text-gray-400 line-clamp-2 mb-4">
                  {product.description}
                </p>
              )}

              {/* Packages */}
              <div className="space-y-3 border-t border-gray-700 pt-4">
                {packages.length === 0 ? (
                  <p className="text-xs text-gray-500 italic">No packages configured</p>
                ) : (
                  packages.map((pkg: ProductPackage) => {
                    const pkgStatus = getStockStatus(pkg.stock || 0);
                    return (
                      <div key={pkg.id} className="bg-gray-700/30 rounded-lg p-3">
                        {/* Package header */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white">{pkg.duration}</p>
                            <p className="text-xs text-gray-400">{pkg.pouches} pouches</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-400">Price</p>
                            <p className="text-sm font-bold text-green-400">₹{(pkg.price || 0).toLocaleString()}</p>
                          </div>
                        </div>

                        {/* Stock display and status */}
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Stock</p>
                            <p className="text-2xl font-bold text-white leading-tight mt-0.5">
                              {pkg.stock || 0}
                            </p>
                          </div>
                          <span className={`shrink-0 text-xs font-semibold px-2 py-1 rounded-full ${pkgStatus.class}`}>
                            {pkgStatus.label}
                          </span>
                        </div>

                        {/* Direct input */}
                        <div className="mb-2">
                          <input
                            type="number"
                            min="0"
                            defaultValue={pkg.stock || 0}
                            onBlur={(e) => {
                              const value = parseInt(e.currentTarget.value) || 0;
                              if (value !== pkg.stock) {
                                handleQuickAdjust(product.id, pkg.id, value);
                              }
                            }}
                            className="w-full px-2 py-1 text-xs border border-gray-600 rounded-lg bg-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                            placeholder="Set stock"
                          />
                        </div>

                        {/* ±5 buttons */}
                        <div className="grid grid-cols-2 gap-1.5 mb-1.5">
                          <button
                            onClick={() => handleStockChange(product.id, pkg.id, 'up', 5)}
                            disabled={isUpdating}
                            className="flex items-center justify-center gap-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-1.5 px-2 rounded text-xs transition-colors"
                          >
                            {isUpdating ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
                            +5
                          </button>
                          <button
                            onClick={() => handleStockChange(product.id, pkg.id, 'down', 5)}
                            disabled={isUpdating}
                            className="flex items-center justify-center gap-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-1.5 px-2 rounded text-xs transition-colors"
                          >
                            {isUpdating ? <Loader2 size={12} className="animate-spin" /> : <Minus size={12} />}
                            -5
                          </button>
                        </div>

                        {/* ±1 buttons */}
                        <div className="grid grid-cols-2 gap-1.5">
                          <button
                            onClick={() => handleStockChange(product.id, pkg.id, 'up', 1)}
                            disabled={isUpdating}
                            className="text-xs font-semibold bg-green-900/30 text-green-400 hover:bg-green-900/50 disabled:opacity-50 disabled:cursor-not-allowed py-1 rounded transition-colors"
                          >
                            +1
                          </button>
                          <button
                            onClick={() => handleStockChange(product.id, pkg.id, 'down', 1)}
                            disabled={isUpdating}
                            className="text-xs font-semibold bg-orange-900/30 text-orange-400 hover:bg-orange-900/50 disabled:opacity-50 disabled:cursor-not-allowed py-1 rounded transition-colors"
                          >
                            -1
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
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