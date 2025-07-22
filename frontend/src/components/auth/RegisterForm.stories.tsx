import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { RegisterForm } from './RegisterForm'

const mockOrganizations = [
  { id: '1', name: 'Velocity Auto Group', memberCount: 24 },
  { id: '2', name: 'Two-Wheel Titans', memberCount: 8 },
  { id: '3', name: 'Premium Motors', memberCount: 15 }
]

const meta: Meta<typeof RegisterForm> = {
  title: 'Auth/RegisterForm',
  component: RegisterForm,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Registration form component with fields for user details, organization selection, and role assignment.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    onSubmit: {
      action: 'form submitted',
      description: 'Callback when form is submitted with valid data'
    },
    isLoading: {
      control: 'boolean',
      description: 'Show loading state on form submission'
    },
    availableOrganizations: {
      description: 'List of organizations user can join'
    }
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg">
        <Story />
      </div>
    )
  ]
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    onSubmit: async (data) => {
      console.log('Register data:', data)
      await new Promise(resolve => setTimeout(resolve, 1000))
    },
    availableOrganizations: mockOrganizations
  },
  parameters: {
    docs: {
      description: {
        story: 'Default registration form with all required fields and organization selection.'
      }
    }
  }
}

export const Loading: Story = {
  args: {
    isLoading: true,
    onSubmit: async (data) => {
      console.log('Register data:', data)
    },
    availableOrganizations: mockOrganizations
  },
  parameters: {
    docs: {
      description: {
        story: 'Registration form in loading state during account creation.'
      }
    }
  }
}

export const NoOrganizations: Story = {
  args: {
    onSubmit: async (data) => {
      console.log('Register data:', data)
    },
    availableOrganizations: []
  },
  parameters: {
    docs: {
      description: {
        story: 'Registration form when no organizations are available for selection.'
      }
    }
  }
}

export const WithCallback: Story = {
  args: {
    onSubmit: async (data) => {
      console.log('Register data:', data)
      await new Promise(resolve => setTimeout(resolve, 2000))
      alert(`Creating account for: ${data.firstName} ${data.lastName} (${data.email})`)
    },
    availableOrganizations: mockOrganizations
  },
  parameters: {
    docs: {
      description: {
        story: 'Registration form with interactive callback that shows submitted data.'
      }
    }
  }
}

export const MobileView: Story = {
  args: {
    onSubmit: async (data) => console.log('Register data:', data),
    availableOrganizations: mockOrganizations
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    },
    docs: {
      description: {
        story: 'Registration form optimized for mobile devices with responsive grid layout.'
      }
    }
  }
}

export const WithValidationErrors: Story = {
  args: {
    onSubmit: async () => {
      // Form will show validation errors for empty fields
    },
    availableOrganizations: mockOrganizations
  },
  parameters: {
    docs: {
      description: {
        story: 'Try submitting the form empty or with invalid data to see validation errors.'
      }
    }
  }
}