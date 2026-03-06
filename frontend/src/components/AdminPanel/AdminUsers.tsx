'use client';

export default function AdminUsers() {
  const users = [
    {
      id: 'USR-001',
      name: 'John Doe',
      email: 'john@example.com',
      joinDate: '2024-01-15',
      status: 'Active',
    },
    {
      id: 'USR-002',
      name: 'Jane Smith',
      email: 'jane@example.com',
      joinDate: '2024-02-10',
      status: 'Active',
    },
    {
      id: 'USR-003',
      name: 'Bob Johnson',
      email: 'bob@example.com',
      joinDate: '2024-03-05',
      status: 'Inactive',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      case 'Suspended':
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
              User ID
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
              Name
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
              Email
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
              Join Date
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <td className="px-6 py-3 text-sm font-medium text-gray-900 dark:text-white">
                {user.id}
              </td>
              <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">
                {user.name}
              </td>
              <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">
                {user.email}
              </td>
              <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">
                {user.joinDate}
              </td>
              <td className="px-6 py-3 text-sm">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    user.status
                  )}`}
                >
                  {user.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
