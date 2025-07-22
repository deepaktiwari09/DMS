import type { Meta, StoryObj } from '@storybook/react';
import { DashboardLayout } from './DashboardLayout';
import { DashboardHeader } from './DashboardHeader';
import { DataTable, StatusBadge } from '../ui';

// Mock router provider for Storybook
const mockRouterState = {
  location: { pathname: '/dashboard/customers' }
};

// Mock the router hooks
const MockedDashboardLayout = ({ children }: { children: React.ReactNode }) => {
  // Mock the router context
  return (
    <div style={{ minHeight: '100vh' }}>
      <DashboardLayout>
        {children}
      </DashboardLayout>
    </div>
  );
};

const meta: Meta<typeof DashboardLayout> = {
  title: 'Dashboard/DashboardLayout',
  component: MockedDashboardLayout,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Complete dashboard layout with sidebar, header, and main content area.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample page content
const SampleCustomersPage = () => {
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
  ];

  const columns = [
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
    <>
      <DashboardHeader
        title="Customers"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Customers' },
        ]}
        actions={
          <button className="button_primary">New Customer</button>
        }
      />
      
      <div className="mb-6">
        <div className="relative">
          <input
            className="input w-full pl-10"
            placeholder="Search customers"
            type="text"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-[var(--text-secondary)]"
              fill="currentColor"
              viewBox="0 0 256 256"
            >
              <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" />
            </svg>
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={customers}
        keyExtractor={(customer) => customer.id}
      />
    </>
  );
};

const SampleDashboardHome = () => (
  <>
    <DashboardHeader title="Dashboard Overview" />
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-sm font-medium text-gray-500">Total Customers</h3>
        <p className="text-2xl font-bold text-[var(--text-primary)]">2,847</p>
        <p className="text-sm text-green-600">+12% from last month</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-sm font-medium text-gray-500">Active Leads</h3>
        <p className="text-2xl font-bold text-[var(--text-primary)]">156</p>
        <p className="text-sm text-green-600">+8% from last month</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-sm font-medium text-gray-500">Monthly Revenue</h3>
        <p className="text-2xl font-bold text-[var(--text-primary)]">$284,750</p>
        <p className="text-sm text-green-600">+22% from last month</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-sm font-medium text-gray-500">Service Appointments</h3>
        <p className="text-2xl font-bold text-[var(--text-primary)]">89</p>
        <p className="text-sm text-green-600">+15% from last month</p>
      </div>
    </div>

    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="typography_h2 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <button className="button_primary">+ New Customer</button>
        <button className="button_secondary">Schedule Service</button>
        <button className="button_secondary">Add Inventory Item</button>
        <button className="button_secondary">Create Invoice</button>
      </div>
    </div>
  </>
);

export const DashboardHome: Story = {
  args: {
    children: <SampleDashboardHome />,
  },
};

export const CustomersPage: Story = {
  args: {
    children: <SampleCustomersPage />,
  },
};

export const EmptyPage: Story = {
  args: {
    children: (
      <>
        <DashboardHeader title="Empty Page" />
        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
          <p className="text-gray-500">This is an empty dashboard page.</p>
        </div>
      </>
    ),
  },
};

export const ComplexPage: Story = {
  args: {
    children: (
      <>
        <DashboardHeader
          title="Service Management"
          breadcrumbs={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Service Management' },
          ]}
          actions={
            <div className="flex gap-3">
              <button className="button_secondary">Export Report</button>
              <button className="button_primary">New Job Card</button>
            </div>
          }
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Today's Appointments</h3>
            <p className="text-2xl font-bold text-[var(--text-primary)]">12</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">In Progress</h3>
            <p className="text-2xl font-bold text-blue-600">5</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Completed Today</h3>
            <p className="text-2xl font-bold text-green-600">8</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Recent Job Cards</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">JC-001 - Oil Change</p>
                <p className="text-sm text-gray-500">Yamaha R6 - John Smith</p>
              </div>
              <StatusBadge status="in-progress">In Progress</StatusBadge>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">JC-002 - Brake Service</p>
                <p className="text-sm text-gray-500">Honda CBR - Emily Davis</p>
              </div>
              <StatusBadge status="completed">Completed</StatusBadge>
            </div>
          </div>
        </div>
      </>
    ),
  },
};