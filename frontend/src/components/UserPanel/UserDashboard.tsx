'use client';

import React, { useState } from 'react';
import UserOrders from './UserOrders';
import UserProfile from './UserProfile';

type TabType = 'overview' | 'orders' | 'profile';

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const tabs: { id: TabType; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'orders', label: 'My Orders' },
    { id: 'profile', label: 'Profile' },
  ];

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          My Dashboard
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Welcome! Manage your account and orders here.
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
        {activeTab === 'orders' && <UserOrders />}
        {activeTab === 'profile' && <UserProfile />}
      </div>
    </div>
  );
}

function OverviewTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Quick Stats */}
      <StatsCard title="Total Orders" value="12" icon="📦" />
      <StatsCard title="Total Spent" value="$2,499" icon="💳" />
      <StatsCard title="Active Subscriptions" value="2" icon="📅" />

      {/* Recent Activity */}
      <div className="md:col-span-3 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Activity
        </h3>
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Order Shipped</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Order #12345 is on the way</p>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">2 days ago</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface StatsCardProps {
  title: string;
  value: string;
  icon: string;
}

function StatsCard({ title, value, icon }: StatsCardProps) {
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
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  );
}
