import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { ModulesSection } from './ModulesSection'

const meta: Meta<typeof ModulesSection> = {
  title: 'Landing/ModulesSection',
  component: ModulesSection,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Modules section showcasing the five main features of the DealerFlow system: Dashboard, Sales, Service, Inventory, and Customer Management.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    onExploreModulesClick: {
      action: 'explore modules clicked',
      description: 'Callback when "Explore All Modules" button is clicked'
    }
  }
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Default modules section with all five DealerFlow modules displayed in a responsive grid.'
      }
    }
  }
}

export const WithCallback: Story = {
  args: {
    onExploreModulesClick: () => alert('Exploring all modules!')
  },
  parameters: {
    docs: {
      description: {
        story: 'Modules section with interactive callback for the explore button.'
      }
    }
  }
}

export const MobileView: Story = {
  args: {},
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    },
    docs: {
      description: {
        story: 'Modules section on mobile devices with single-column layout.'
      }
    }
  }
}

export const TabletView: Story = {
  args: {},
  parameters: {
    viewport: {
      defaultViewport: 'tablet'
    },
    docs: {
      description: {
        story: 'Modules section on tablet devices with responsive grid layout.'
      }
    }
  }
}

export const LargeScreenView: Story = {
  args: {},
  parameters: {
    viewport: {
      defaultViewport: 'desktop'
    },
    docs: {
      description: {
        story: 'Modules section on large screens showing all five modules in a single row.'
      }
    }
  }
}