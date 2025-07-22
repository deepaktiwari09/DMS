import type { Meta, StoryObj } from '@storybook/react';
import { StatusBadge, DataTable, TabNavigation, SearchInput } from '../components/ui';
import { DashboardHeader } from '../components/layout/DashboardHeader';
import { useState } from 'react';
import {
  CalendarIcon,
  DocumentTextIcon,
  UsersIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';

const meta: Meta = {
  title: 'Dashboard/Overview',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Complete overview of all dashboard components and their usage patterns.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample data
const customers = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '555-123-4567',
    status: 'active' as const,
    lastInteraction: '2024-01-15',
    salesRep: 'Sarah Johnson',
  },
  {
    id: '2',
    name: 'Emily Davis',
    email: 'emily.davis@email.com',
    phone: '555-987-6543',
    status: 'lead' as const,
    lastInteraction: '2024-01-20',
    salesRep: 'Mike Wilson',
  },
  {
    id: '3',
    name: 'Robert Brown',
    email: 'robert.brown@email.com',
    phone: '555-456-7890',
    status: 'active' as const,
    lastInteraction: '2024-01-18',
    salesRep: 'Lisa Chen',
  },
];

const ComponentShowcase = () => {
  const [activeTab, setActiveTab] = useState('customers');
  const [searchTerm, setSearchTerm] = useState('');

  const tabs = [
    {
      id: 'customers',
      label: 'Customers',
      icon: UsersIcon,
    },
    {
      id: 'sales',
      label: 'Sales Pipeline',
      icon: ChartBarIcon,
    },
    {
      id: 'service',
      label: 'Service Schedule',
      icon: CalendarIcon,
    },
    {
      id: 'finance',
      label: 'Invoicing',
      icon: CurrencyDollarIcon,
    },
  ];

  const customerColumns = [
    {
      key: 'name',
      header: 'Name',
      cell: (customer: typeof customers[0]) => (
        <span className="font-medium text-[var(--text-primary)]">
          {customer.name}
        </span>
      ),
    },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone' },
    {
      key: 'status',
      header: 'Status',
      cell: (customer: typeof customers[0]) => (
        <StatusBadge status={customer.status}>
          {customer.status === 'active' ? 'Active' : 'Lead'}
        </StatusBadge>
      ),
    },
    { key: 'lastInteraction', header: 'Last Interaction' },
    { key: 'salesRep', header: 'Sales Rep' },
  ];

  return (
    <div className="space-y-8">
      {/* Dashboard Header Example */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Dashboard Header</h2>
        <DashboardHeader
          title="Customer Management"
          breadcrumbs={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Customers' },
          ]}
          actions={
            <div className="flex gap-3">
              <button className="button_secondary">Export</button>
              <button className="button_primary">New Customer</button>
            </div>
          }
        />
      </section>

      {/* Status Badges */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Status Badges</h2>
        <div className="flex flex-wrap gap-2">
          <StatusBadge status="active">Active</StatusBadge>
          <StatusBadge status="pending">Pending</StatusBadge>
          <StatusBadge status="lead">Lead</StatusBadge>
          <StatusBadge status="scheduled">Scheduled</StatusBadge>
          <StatusBadge status="in-progress">In Progress</StatusBadge>
          <StatusBadge status="completed">Completed</StatusBadge>
          <StatusBadge status="awaiting-parts">Awaiting Parts</StatusBadge>
          <StatusBadge status="available">Available</StatusBadge>
          <StatusBadge status="busy">Busy</StatusBadge>
        </div>
      </section>

      {/* Search Input */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Search Input</h2>
        <div className="max-w-md">
          <SearchInput
            placeholder="Search customers..."
            onSearch={setSearchTerm}
          />
          {searchTerm && (
            <p className="mt-2 text-sm text-gray-600">
              Searching for: <strong>{searchTerm}</strong>
            </p>
          )}
        </div>
      </section>

      {/* Tab Navigation */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Tab Navigation</h2>
        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            Active tab: <strong>{activeTab}</strong>
          </p>
        </div>
      </section>

      {/* Data Table */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Data Table</h2>
        <DataTable
          columns={customerColumns}
          data={customers}
          keyExtractor={(customer) => customer.id}
          onRowClick={(customer) => {
            alert(`Clicked on ${customer.name}`);
          }}
        />
      </section>

      {/* Combined Example */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Complete Page Example</h2>
        <div className="border border-gray-200 rounded-lg p-6 bg-white">
          <DashboardHeader
            title="Service Management"
            actions={
              <button className="button_primary">New Job Card</button>
            }
          />
          
          <div className="mb-6">
            <SearchInput
              placeholder="Search service appointments..."
              onSearch={() => {}}
            />
          </div>

          <div className="mb-6">
            <TabNavigation
              tabs={[
                { id: 'schedule', label: 'Schedule', icon: CalendarIcon },
                { id: 'job_cards', label: 'Job Cards', icon: DocumentTextIcon },
                { id: 'technicians', label: 'Technicians', icon: UsersIcon },
              ]}
              activeTab="schedule"
              onTabChange={() => {}}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">Today's Appointments</h3>
              <p className="text-2xl font-bold text-[var(--text-primary)]">12</p>
              <div className="flex items-center gap-2 mt-2">
                <StatusBadge status="scheduled">5 Scheduled</StatusBadge>
                <StatusBadge status="in-progress">3 In Progress</StatusBadge>
                <StatusBadge status="completed">4 Completed</StatusBadge>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">Technicians</h3>
              <p className="text-2xl font-bold text-[var(--text-primary)]">8</p>
              <div className="flex items-center gap-2 mt-2">
                <StatusBadge status="available">5 Available</StatusBadge>
                <StatusBadge status="busy">3 Busy</StatusBadge>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">Parts Status</h3>
              <p className="text-2xl font-bold text-[var(--text-primary)]">156</p>
              <div className="flex items-center gap-2 mt-2">
                <StatusBadge status="completed">In Stock</StatusBadge>
                <StatusBadge status="awaiting-parts">5 Pending</StatusBadge>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export const ComponentShowcaseStory: Story = {
  render: () => <ComponentShowcase />,
  parameters: {
    docs: {
      description: {
        story: 'Complete showcase of all dashboard components working together in various combinations.',
      },
    },
  },
};

// Design System Colors
const DesignSystemColors = () => (
  <div className="space-y-6">
    <section>
      <h3 className="text-lg font-semibold mb-3">Color Palette</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[var(--primary-color)] rounded"></div>
          <div>
            <p className="font-medium">Primary</p>
            <p className="text-sm text-gray-500">#3d98f4</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[var(--secondary-color)] rounded"></div>
          <div>
            <p className="font-medium">Secondary</p>
            <p className="text-sm text-gray-500">#e0f2fe</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[var(--background-color)] border rounded"></div>
          <div>
            <p className="font-medium">Background</p>
            <p className="text-sm text-gray-500">#f9f9f9</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[var(--text-primary)] rounded"></div>
          <div>
            <p className="font-medium">Text Primary</p>
            <p className="text-sm text-gray-500">#111827</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[var(--text-secondary)] rounded"></div>
          <div>
            <p className="font-medium">Text Secondary</p>
            <p className="text-sm text-gray-500">#6b7280</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[var(--accent-color)] rounded"></div>
          <div>
            <p className="font-medium">Accent</p>
            <p className="text-sm text-gray-500">#bfdbfe</p>
          </div>
        </div>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-3">Typography</h3>
      <div className="space-y-2">
        <h1 className="typography_h1">Heading 1 - Dashboard Title</h1>
        <h2 className="typography_h2">Heading 2 - Section Title</h2>
        <p className="typography_body">Body text - Regular content and descriptions</p>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-3">Buttons</h3>
      <div className="flex gap-3">
        <button className="button_primary">Primary Button</button>
        <button className="button_secondary">Secondary Button</button>
      </div>
    </section>
  </div>
);

export const DesignSystem: Story = {
  render: () => <DesignSystemColors />,
  parameters: {
    docs: {
      description: {
        story: 'Design system overview showing colors, typography, and component styling.',
      },
    },
  },
};