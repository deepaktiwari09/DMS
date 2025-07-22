import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { RegisterForm } from './RegisterForm'

const meta: Meta<typeof RegisterForm> = {
  title: 'Auth/RegisterForm',
  component: RegisterForm,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Registration form component with fields for user personal details and password confirmation.'
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
    error: {
      control: 'text',
      description: 'API error message to display'
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
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Default registration form with personal details and password confirmation fields.'
      }
    }
  }
}

export const Loading: Story = {
  args: {
    isLoading: true,
    onSubmit: async (data) => {
      console.log('Register data:', data)
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Registration form in loading state during account creation.'
      }
    }
  }
}

export const WithAPIError: Story = {
  args: {
    error: 'A user with this email address already exists.',
    onSubmit: async (data) => {
      console.log('Register data:', data)
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Registration form showing API error message for duplicate email.'
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
    }
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
    onSubmit: async (data) => console.log('Register data:', data)
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
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Try submitting the form empty or with invalid data to see validation errors.'
      }
    }
  }
}