import type { Meta, StoryObj } from '@storybook/react';
import { DashboardSidebar } from './DashboardSidebar';
import { useState } from 'react';

// Mock the router hooks for Storybook
const MockRouterProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <div style={{ height: '600px', display: 'flex' }}>
      {children}
      <div className="flex-1 p-8 bg-gray-50">
        <p className="text-gray-600">Main content area</p>
        <p className="text-sm text-gray-500 mt-2">
          This is where the dashboard content would appear. 
          The sidebar navigation is fully functional in the actual application.
        </p>
      </div>
    </div>
  );
};

const meta: Meta<typeof DashboardSidebar> = {
  title: 'Dashboard/DashboardSidebar',
  component: DashboardSidebar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Navigation sidebar for the dashboard with collapsible functionality and navigation items.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MockRouterProvider>
        <Story />
      </MockRouterProvider>
    ),
  ],
  argTypes: {
    isCollapsed: {
      control: 'boolean',
      description: 'Whether the sidebar is collapsed or expanded',
    },
    onToggle: {
      action: 'toggled',
      description: 'Callback fired when sidebar toggle is clicked',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isCollapsed: false,
    onToggle: () => {},
  },
};

export const Collapsed: Story = {
  args: {
    isCollapsed: true,
    onToggle: () => {},
  },
};

export const WithoutToggle: Story = {
  args: {
    isCollapsed: false,
    onToggle: undefined,
  },
};

// Interactive version with toggle functionality
const InteractiveSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <DashboardSidebar 
      isCollapsed={isCollapsed} 
      onToggle={handleToggle} 
    />
  );
};

export const Interactive: Story = {
  render: () => <InteractiveSidebar />,
  parameters: {
    docs: {
      description: {
        story: 'Interactive sidebar that can be toggled between collapsed and expanded states.',
      },
    },
  },
};

// Mobile simulation
export const MobileView: Story = {
  args: {
    isCollapsed: false,
    onToggle: () => {},
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Sidebar appearance on mobile devices.',
      },
    },
  },
};