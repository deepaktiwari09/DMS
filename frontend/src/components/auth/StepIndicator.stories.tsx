import type { Meta, StoryObj } from '@storybook/react'
import { StepIndicator } from './StepIndicator'

const meta: Meta<typeof StepIndicator> = {
  title: 'Auth/StepIndicator',
  component: StepIndicator,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Step indicator component for multi-step wizards like onboarding flow.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    currentStep: {
      control: { type: 'number', min: 1, max: 5 },
      description: 'Current active step (1-based)'
    },
    totalSteps: {
      control: { type: 'number', min: 1, max: 5 },
      description: 'Total number of steps'
    },
    steps: {
      control: 'object',
      description: 'Array of step labels'
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes'
    }
  },
  decorators: [
    (Story) => (
      <div className="max-w-4xl mx-auto p-8 bg-gray-50">
        <Story />
      </div>
    )
  ]
}

export default meta
type Story = StoryObj<typeof meta>

const onboardingSteps = [
  'Set up your Organization',
  'Add your first Dealership', 
  'Invite a User'
]

export const Step1Active: Story = {
  args: {
    currentStep: 1,
    totalSteps: 3,
    steps: onboardingSteps
  },
  parameters: {
    docs: {
      description: {
        story: 'First step active - organization setup phase.'
      }
    }
  }
}

export const Step2Active: Story = {
  args: {
    currentStep: 2,
    totalSteps: 3,
    steps: onboardingSteps
  },
  parameters: {
    docs: {
      description: {
        story: 'Second step active - first step completed, dealership setup in progress.'
      }
    }
  }
}

export const Step3Active: Story = {
  args: {
    currentStep: 3,
    totalSteps: 3,
    steps: onboardingSteps
  },
  parameters: {
    docs: {
      description: {
        story: 'Final step active - organization and dealership completed, user invite phase.'
      }
    }
  }
}

export const AllCompleted: Story = {
  args: {
    currentStep: 4,
    totalSteps: 3,
    steps: onboardingSteps
  },
  parameters: {
    docs: {
      description: {
        story: 'All steps completed - shows all steps with checkmarks.'
      }
    }
  }
}

export const FiveStepWizard: Story = {
  args: {
    currentStep: 3,
    totalSteps: 5,
    steps: [
      'Account Details',
      'Organization Setup',
      'Dealership Info',
      'Team Members', 
      'Final Review'
    ]
  },
  parameters: {
    docs: {
      description: {
        story: 'Example with 5 steps - shows how component handles more steps.'
      }
    }
  }
}

export const TwoStepSimple: Story = {
  args: {
    currentStep: 1,
    totalSteps: 2,
    steps: [
      'Basic Information',
      'Verification'
    ]
  },
  parameters: {
    docs: {
      description: {
        story: 'Simple 2-step process.'
      }
    }
  }
}

export const MobileView: Story = {
  args: {
    currentStep: 2,
    totalSteps: 3,
    steps: onboardingSteps
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    },
    docs: {
      description: {
        story: 'Step indicator on mobile devices - connector lines are hidden.'
      }
    }
  }
}