import React from 'react';
import { DashboardLayout } from '../../components/layout';
import { DashboardHeader } from '../../components/layout/DashboardHeader';
import { Card } from '../../components/ui';
import {
  UsersIcon,
  CubeIcon,
  ChartBarIcon,
  WrenchScrewdriverIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';

const DashboardHome: React.FC = () => {
  const stats = [
    {
      name: 'Total Customers',
      value: '2,847',
      change: '+12%',
      changeType: 'positive',
      icon: UsersIcon,
    },
    {
      name: 'Active Leads',
      value: '156',
      change: '+8%',
      changeType: 'positive',
      icon: ChartBarIcon,
    },
    {
      name: 'Inventory Items',
      value: '1,234',
      change: '-3%',
      changeType: 'negative',
      icon: CubeIcon,
    },
    {
      name: 'Service Appointments',
      value: '89',
      change: '+15%',
      changeType: 'positive',
      icon: WrenchScrewdriverIcon,
    },
    {
      name: 'Monthly Revenue',
      value: '$284,750',
      change: '+22%',
      changeType: 'positive',
      icon: CurrencyDollarIcon,
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'customer',
      message: 'New customer registration: John Smith',
      time: '2 hours ago',
    },
    {
      id: 2,
      type: 'sale',
      message: 'Sale completed: Yamaha R6 sold to Sarah Johnson',
      time: '4 hours ago',
    },
    {
      id: 3,
      type: 'service',
      message: 'Service appointment completed for Honda CBR500R',
      time: '6 hours ago',
    },
    {
      id: 4,
      type: 'inventory',
      message: 'Low stock alert: Yamaha brake pads (5 remaining)',
      time: '8 hours ago',
    },
  ];

  return (
    <DashboardLayout>
      <DashboardHeader title="Dashboard Overview" />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.name} className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Icon className="h-8 w-8 text-[var(--primary-color)]" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-[var(--text-secondary)]">
                    {stat.name}
                  </p>
                  <p className="text-2xl font-bold text-[var(--text-primary)]">
                    {stat.value}
                  </p>
                  <p
                    className={`text-sm ${
                      stat.changeType === 'positive'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {stat.change} from last month
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activities */}
        <Card className="p-6">
          <h2 className="typography_h2 mb-4">Recent Activities</h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div
                  className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'customer'
                      ? 'bg-blue-500'
                      : activity.type === 'sale'
                      ? 'bg-green-500'
                      : activity.type === 'service'
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[var(--text-primary)]">
                    {activity.message}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)]">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Stats */}
        <Card className="p-6">
          <h2 className="typography_h2 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full button_primary text-left">
              + New Customer
            </button>
            <button className="w-full button_secondary text-left">
              Schedule Service
            </button>
            <button className="w-full button_secondary text-left">
              Add Inventory Item
            </button>
            <button className="w-full button_secondary text-left">
              Create Invoice
            </button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DashboardHome;