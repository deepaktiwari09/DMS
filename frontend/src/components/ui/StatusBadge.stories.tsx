import type { Meta, StoryObj } from '@storybook/react';
import { StatusBadge } from './StatusBadge';

const meta: Meta<typeof StatusBadge> = {
  title: 'Dashboard/StatusBadge',
  component: StatusBadge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Color-coded status indicators used throughout the dashboard for showing various states.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'select',
      options: [
        'active',
        'pending',
        'lead',
        'scheduled',
        'in-progress',
        'completed',
        'awaiting-parts',
        'available',
        'busy'
      ],
      description: 'The status type which determines the color scheme',
    },
    children: {
      control: 'text',
      description: 'The text content of the badge',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic stories for each status type
export const Active: Story = {
  args: {
    status: 'active',
    children: 'Active',
  },
};

export const Pending: Story = {
  args: {
    status: 'pending',
    children: 'Pending',
  },
};

export const Lead: Story = {
  args: {
    status: 'lead',
    children: 'Lead',
  },
};

export const Scheduled: Story = {
  args: {
    status: 'scheduled',
    children: 'Scheduled',
  },
};

export const InProgress: Story = {
  args: {
    status: 'in-progress',
    children: 'In Progress',
  },
};

export const Completed: Story = {
  args: {
    status: 'completed',
    children: 'Completed',
  },
};

export const AwaitingParts: Story = {
  args: {
    status: 'awaiting-parts',
    children: 'Awaiting Parts',
  },
};

export const Available: Story = {
  args: {
    status: 'available',
    children: 'Available',
  },
};

export const Busy: Story = {
  args: {
    status: 'busy',
    children: 'Busy',
  },
};

// All statuses showcase
export const AllStatuses: Story = {
  render: () => (
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
  ),
  parameters: {
    docs: {
      description: {
        story: 'Overview of all available status badge variants.',
      },
    },
  },
};