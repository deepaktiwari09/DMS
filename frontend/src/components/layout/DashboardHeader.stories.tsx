import type { Meta, StoryObj } from '@storybook/react';
import { DashboardHeader } from './DashboardHeader';

const meta: Meta<typeof DashboardHeader> = {
  title: 'Dashboard/DashboardHeader',
  component: DashboardHeader,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Dashboard page header with title, breadcrumbs, and action buttons.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'The main title of the page',
    },
    breadcrumbs: {
      control: 'object',
      description: 'Array of breadcrumb items for navigation',
    },
    actions: {
      description: 'React node containing action buttons or other elements',
    },
    showMenuToggle: {
      control: 'boolean',
      description: 'Whether to show mobile menu toggle button',
    },
    onMenuToggle: {
      action: 'menu-toggled',
      description: 'Callback fired when mobile menu toggle is clicked',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const BasicTitle: Story = {
  args: {
    title: 'Dashboard',
  },
};

export const WithBreadcrumbs: Story = {
  args: {
    title: 'Customer Details',
    breadcrumbs: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Customers', href: '/dashboard/customers' },
      { label: 'John Smith' },
    ],
  },
};

export const WithActions: Story = {
  args: {
    title: 'Customers',
    actions: (
      <div className="flex gap-3">
        <button className="button_secondary">Export</button>
        <button className="button_primary">New Customer</button>
      </div>
    ),
  },
};

export const WithBreadcrumbsAndActions: Story = {
  args: {
    title: 'Service Management',
    breadcrumbs: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Service Management' },
    ],
    actions: (
      <div className="flex gap-3">
        <button className="button_secondary">View Calendar</button>
        <button className="button_primary">New Job Card</button>
      </div>
    ),
  },
};

export const WithMobileToggle: Story = {
  args: {
    title: 'Inventory',
    showMenuToggle: true,
    onMenuToggle: () => {},
    actions: (
      <button className="button_primary">Add Item</button>
    ),
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Header with mobile menu toggle button visible on smaller screens.',
      },
    },
  },
};

export const LongTitle: Story = {
  args: {
    title: 'Financial Management and Accounting Integration Dashboard',
    breadcrumbs: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Finance', href: '/dashboard/finance' },
      { label: 'Accounting Integration', href: '/dashboard/finance/integration' },
      { label: 'QuickBooks Configuration' },
    ],
    actions: (
      <div className="flex gap-3">
        <button className="button_secondary">Export Data</button>
        <button className="button_secondary">Settings</button>
        <button className="button_primary">Create Invoice</button>
      </div>
    ),
  },
};

export const MinimalSales: Story = {
  args: {
    title: 'Sales Pipeline',
    breadcrumbs: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Sales' },
    ],
    actions: (
      <button className="button_primary">New Opportunity</button>
    ),
  },
};

export const ServiceWithMultipleActions: Story = {
  args: {
    title: 'Service Appointments',
    actions: (
      <div className="flex gap-2">
        <button className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
          Calendar View
        </button>
        <button className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
          List View
        </button>
        <button className="button_secondary">Import</button>
        <button className="button_primary">Schedule Service</button>
      </div>
    ),
  },
};