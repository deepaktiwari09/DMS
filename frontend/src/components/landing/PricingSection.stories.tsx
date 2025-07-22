import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { PricingSection } from './PricingSection'

const meta: Meta<typeof PricingSection> = {
  title: 'Landing/PricingSection',
  component: PricingSection,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Pricing section displaying three pricing tiers: Starter, Professional (popular), and Enterprise with detailed features and call-to-action buttons.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    onChoosePlan: {
      action: 'plan chosen',
      description: 'Callback when a pricing plan is selected'
    },
    onContactSales: {
      action: 'contact sales clicked',
      description: 'Callback when contact sales button is clicked for enterprise plan'
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
        story: 'Default pricing section with three pricing plans in a responsive grid layout.'
      }
    }
  }
}

export const WithCallbacks: Story = {
  args: {
    onChoosePlan: (planId: string) => alert(`Plan chosen: ${planId}`),
    onContactSales: () => alert('Contact sales clicked!')
  },
  parameters: {
    docs: {
      description: {
        story: 'Pricing section with interactive callbacks for plan selection and sales contact.'
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
        story: 'Pricing section on mobile devices with single-column stacked layout for better readability.'
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
        story: 'Pricing section on tablet devices with responsive grid layout.'
      }
    }
  }
}

export const DesktopView: Story = {
  args: {},
  parameters: {
    viewport: {
      defaultViewport: 'desktop'
    },
    docs: {
      description: {
        story: 'Pricing section on desktop showing all three plans in a single row with the Professional plan highlighted as most popular.'
      }
    }
  }
}

export const PopularPlanHighlight: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Shows the Professional plan with special highlighting and styling to indicate it\'s the most popular choice.'
      }
    }
  },
  decorators: [
    (Story) => (
      <div style={{ background: 'var(--secondary-color)', minHeight: '100vh', padding: '2rem 0' }}>
        <Story />
      </div>
    )
  ]
}