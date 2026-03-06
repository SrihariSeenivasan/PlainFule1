'use client';

import React, { useState } from 'react';
import AdminOrders from './AdminOrders';
import AdminPayments from './AdminPayments';
import AdminProducts from './AdminProducts';
import AdminUsers from './AdminUsers';

type TabType = 'overview' | 'orders' | 'payments' | 'products' | 'users';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const tabs: { id: TabType; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'orders', label: 'Orders' },
    { id: 'payments', label: 'Payments' },
    { id: 'products', label: 'Products' },
    { id: 'users', label: 'Users' },
  ];

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Admin Dashboard
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Welcome back! Heres your business overview.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div>
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'orders' && <AdminOrders />}
        {activeTab === 'payments' && <AdminPayments />}
        {activeTab === 'products' && <AdminProducts />}
        {activeTab === 'users' && <AdminUsers />}
      </div>
    </div>
  );
}

function OverviewTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Stats Cards */}
      <StatsCard
        title="Total Orders"
        value="1,234"
        change="+12%"
        icon="📦"
      />
      <StatsCard
        title="Total Revenue"
        value="$45,231"
        change="+5%"
        icon="💰"
      />
      <StatsCard
        title="Active Users"
        value="892"
        change="+2%"
        icon="👥"
      />
      <StatsCard
        title="Conversion Rate"
        value="3.24%"
        change="+0.5%"
        icon="📈"
      />
    </div>
  );
}

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  icon: string;
}

function StatsCard({ title, value, change, icon }: StatsCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
            {value}
          </p>
          <p className="text-green-600 dark:text-green-400 text-sm mt-1">
            {change} from last month
          </p>
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  );
}
