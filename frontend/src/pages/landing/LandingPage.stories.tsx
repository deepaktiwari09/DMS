import type { Meta, StoryObj } from '@storybook/react'
import { LandingPage } from './LandingPage'

const meta: Meta<typeof LandingPage> = {
  title: 'Pages/LandingPage',
  component: LandingPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Complete landing page for DealerFlow featuring header, hero section, modules showcase, testimonials, pricing, call-to-action, and footer.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    onLoginClick: {
      action: 'login clicked',
      description: 'Callback when login button is clicked in header'
    },
    onRegisterClick: {
      action: 'register clicked',
      description: 'Callback when register button is clicked in header'
    },
    onDemoClick: {
      action: 'demo requested',
      description: 'Callback when demo is requested in hero section'
    },
    onExploreModulesClick: {
      action: 'explore modules clicked',
      description: 'Callback when explore modules button is clicked'
    },
    onChoosePlan: {
      action: 'plan chosen',
      description: 'Callback when a pricing plan is selected'
    },
    onContactSales: {
      action: 'contact sales clicked',
      description: 'Callback when contact sales is clicked'
    },
    onGetStartedClick: {
      action: 'get started clicked',
      description: 'Callback when get started button is clicked in CTA section'
    },
    onPrivacyClick: {
      action: 'privacy policy clicked',
      description: 'Callback when privacy policy link is clicked in footer'
    },
    onTermsClick: {
      action: 'terms of service clicked',
      description: 'Callback when terms of service link is clicked in footer'
    },
    onContactClick: {
      action: 'contact us clicked',
      description: 'Callback when contact us link is clicked in footer'
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
        story: 'Complete landing page with all sections and default styling.'
      }
    }
  }
}

export const WithAllCallbacks: Story = {
  args: {
    onLoginClick: () => alert('Login clicked!'),
    onRegisterClick: () => alert('Register clicked!'),
    onDemoClick: () => alert('Demo requested!'),
    onExploreModulesClick: () => alert('Exploring modules!'),
    onChoosePlan: (planId: string) => alert(`Plan chosen: ${planId}`),
    onContactSales: () => alert('Contacting sales!'),
    onGetStartedClick: () => alert('Getting started!'),
    onPrivacyClick: () => alert('Privacy policy!'),
    onTermsClick: () => alert('Terms of service!'),
    onContactClick: () => alert('Contact us!')
  },
  parameters: {
    docs: {
      description: {
        story: 'Landing page with all interactive callbacks enabled for testing user interactions.'
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
        story: 'Landing page optimized for mobile devices with responsive layout and navigation.'
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
        story: 'Landing page on tablet devices with adaptive grid layouts.'
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
        story: 'Full desktop landing page experience with all sections displayed optimally.'
      }
    }
  }
}