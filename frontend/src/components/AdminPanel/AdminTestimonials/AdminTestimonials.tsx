'use client';

import { useState } from 'react';
import CustomerReviewManager from './CustomerReviewManager';
import VideoReviewManager from './VideoReviewManager';
import DoctorReviewManager from './DoctorReviewManager';

export const AdminTestimonials = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const tabs = [
    { name: 'Customer Reviews', component: <CustomerReviewManager /> },
    { name: 'Video Reviews', component: <VideoReviewManager /> },
    { name: 'Doctor Reviews', component: <DoctorReviewManager /> },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Testimonials & Reviews</h1>
        <p className="text-gray-600">Manage customer reviews and video testimonials that appear on the website</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
        {tabs.map((tab, idx) => (
          <button
            key={tab.name}
            onClick={() => setSelectedTab(idx)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              selectedTab === idx
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-700 hover:text-gray-900'
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        {tabs[selectedTab].component}
      </div>
    </div>
  );
};

export default AdminTestimonials;
