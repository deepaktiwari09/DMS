import type { Meta, StoryObj } from '@storybook/react'
import { BrowserRouter } from 'react-router-dom'
import { OnboardingPage } from './OnboardingPage'

const meta: Meta<typeof OnboardingPage> = {
  title: 'Pages/Auth/OnboardingPage',
  component: OnboardingPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Full onboarding page with 3-step wizard, matching the onboarding.html design. Features step indicator, organization setup, dealership creation, and user invitation.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    onComplete: {
      action: 'onboarding completed',
      description: 'Callback for when onboarding process is completed'
    }
  },
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    )
  ]
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Default onboarding page starting with organization setup step.'
      }
    }
  }
}

export const WithCallback: Story = {
  args: {
    onComplete: () => alert('Onboarding completed! Would redirect to dashboard.')
  },
  parameters: {
    docs: {
      description: {
        story: 'Onboarding page with custom completion callback for testing the full flow.'
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
        story: 'Onboarding page optimized for mobile devices with responsive step layout.'
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
        story: 'Onboarding page on tablet devices showing responsive wizard steps.'
      }
    }
  }
}

export const Interactive: Story = {
  args: {
    onComplete: () => {
      console.log('Onboarding process completed!')
      // In a real app, would redirect to dashboard or show success
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive onboarding - try going through all 3 steps to see the complete wizard flow with step indicator.'
      }
    }
  }
}