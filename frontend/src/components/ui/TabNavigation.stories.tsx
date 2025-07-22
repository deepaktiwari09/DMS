import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { TabNavigation } from './TabNavigation';
import {
  CalendarIcon,
  DocumentTextIcon,
  UsersIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';

const meta: Meta<typeof TabNavigation> = {
  title: 'Dashboard/TabNavigation',
  component: TabNavigation,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Tab navigation component for switching between different views or sections.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const basicTabs = [
  { id: 'all', label: 'All Customers' },
  { id: 'leads', label: 'Leads' },
  { id: 'active', label: 'Active Customers' },
];

const serviceTabs = [
  {
    id: 'schedule',
    label: 'Service Schedule',
    icon: CalendarIcon,
  },
  {
    id: 'job_cards',
    label: 'Job Cards',
    icon: DocumentTextIcon,
  },
  {
    id: 'technicians',
    label: 'Technicians',
    icon: UsersIcon,
  },
];

const financeTabs = [
  {
    id: 'invoicing',
    label: 'Invoicing',
    icon: DocumentTextIcon,
  },
  {
    id: 'reports',
    label: 'Financial Reports',
    icon: ChartBarIcon,
  },
  {
    id: 'integration',
    label: 'Accounting Integration',
    icon: CurrencyDollarIcon,
  },
];

const tabsWithDisabled = [
  { id: 'available', label: 'Available' },
  { id: 'pending', label: 'Pending' },
  { id: 'disabled', label: 'Disabled Feature', disabled: true },
  { id: 'coming-soon', label: 'Coming Soon', disabled: true },
];

// Interactive wrapper component
const InteractiveTabNavigation = ({ tabs, initialTab }: { tabs: any[], initialTab: string }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  
  return (
    <div>
      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">Active tab: <strong>{activeTab}</strong></p>
      </div>
    </div>
  );
};

export const Basic: Story = {
  render: () => (
    <InteractiveTabNavigation tabs={basicTabs} initialTab="all" />
  ),
};

export const WithIcons: Story = {
  render: () => (
    <InteractiveTabNavigation tabs={serviceTabs} initialTab="schedule" />
  ),
};

export const WithDisabledTabs: Story = {
  render: () => (
    <InteractiveTabNavigation tabs={tabsWithDisabled} initialTab="available" />
  ),
};

export const FinanceExample: Story = {
  render: () => (
    <InteractiveTabNavigation tabs={financeTabs} initialTab="invoicing" />
  ),
};

// Static examples for testing specific states
export const StaticBasic: Story = {
  args: {
    tabs: basicTabs,
    activeTab: 'leads',
    onTabChange: () => {},
  },
};

export const StaticWithIcons: Story = {
  args: {
    tabs: serviceTabs,
    activeTab: 'job_cards',
    onTabChange: () => {},
  },
};

export const StaticWithDisabled: Story = {
  args: {
    tabs: tabsWithDisabled,
    activeTab: 'pending',
    onTabChange: () => {},
  },
};