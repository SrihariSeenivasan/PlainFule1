'use client';

import { useEffect, useState } from 'react';
import { adminAPI, User } from '@/lib/api';

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const fetchedUsers = await adminAPI.getUsers();
        setUsers(Array.isArray(fetchedUsers) ? fetchedUsers : []);
        setError('');
      } catch (err) {
        console.error('Failed to fetch users:', err);
        setError('Failed to load users');
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const getStatusColor = (role: string) => {
    switch (role) {
      case 'USER':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'ADMIN':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="p-6 text-gray-600">Loading users...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  if (users.length === 0) {
    return <div className="p-6 text-gray-600">No users found</div>;
  }

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
              Phone
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
              Role
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
                {user.firstName} {user.lastName}
              </td>
              <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">
                {user.email}
              </td>
              <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">
                {user.phone}
              </td>
              <td className="px-6 py-3 text-sm">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    user.role
                  )}`}
                >
                  {user.role}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
