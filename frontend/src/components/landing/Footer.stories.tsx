import type { Meta, StoryObj } from '@storybook/react'
import { Footer } from './Footer'

const meta: Meta<typeof Footer> = {
  title: 'Landing/Footer',
  component: Footer,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Footer component with copyright information and legal links for the landing page.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    onPrivacyClick: {
      action: 'privacy policy clicked',
      description: 'Callback when Privacy Policy link is clicked'
    },
    onTermsClick: {
      action: 'terms of service clicked',
      description: 'Callback when Terms of Service link is clicked'
    },
    onContactClick: {
      action: 'contact us clicked',
      description: 'Callback when Contact Us link is clicked'
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
        story: 'Default footer with copyright and legal links.'
      }
    }
  }
}

export const WithCallbacks: Story = {
  args: {
    onPrivacyClick: () => alert('Privacy Policy clicked'),
    onTermsClick: () => alert('Terms of Service clicked'),
    onContactClick: () => alert('Contact Us clicked')
  },
  parameters: {
    docs: {
      description: {
        story: 'Footer with interactive callbacks for all legal links.'
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
        story: 'Footer on mobile devices with stacked layout for better readability.'
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
        story: 'Footer on tablet devices.'
      }
    }
  }
}