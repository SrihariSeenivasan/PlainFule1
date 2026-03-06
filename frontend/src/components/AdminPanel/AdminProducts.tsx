'use client';

export default function AdminProducts() {
  const products = [
    {
      id: 'PRD-001',
      name: 'PlainFuel Basic',
      price: '$29.99',
      stock: 150,
      status: 'Active',
    },
    {
      id: 'PRD-002',
      name: 'PlainFuel Pro',
      price: '$49.99',
      stock: 85,
      status: 'Active',
    },
    {
      id: 'PRD-003',
      name: 'PlainFuel Bundle',
      price: '$79.99',
      stock: 0,
      status: 'Out of Stock',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Out of Stock':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'Inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
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
              Product ID
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
              Name
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
              Price
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
              Stock
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <td className="px-6 py-3 text-sm font-medium text-gray-900 dark:text-white">
                {product.id}
              </td>
              <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">
                {product.name}
              </td>
              <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">
                {product.price}
              </td>
              <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">
                {product.stock} units
              </td>
              <td className="px-6 py-3 text-sm">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    product.status
                  )}`}
                >
                  {product.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
