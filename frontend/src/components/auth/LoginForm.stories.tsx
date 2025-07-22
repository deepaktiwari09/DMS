import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { LoginForm } from './LoginForm'

const meta: Meta<typeof LoginForm> = {
  title: 'Auth/LoginForm',
  component: LoginForm,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Login form component with email/password validation and forgot password link.'
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
    onForgotPassword: {
      action: 'forgot password clicked',
      description: 'Callback when forgot password link is clicked'
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
      console.log('Login data:', data)
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Default login form with email and password fields.'
      }
    }
  }
}

export const Loading: Story = {
  args: {
    isLoading: true,
    onSubmit: async (data) => {
      console.log('Login data:', data)
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Login form in loading state during authentication.'
      }
    }
  }
}

export const WithCallbacks: Story = {
  args: {
    onSubmit: async (data) => {
      console.log('Login data:', data)
      await new Promise(resolve => setTimeout(resolve, 2000))
      alert(`Logging in with: ${data.email}`)
    },
    onForgotPassword: () => alert('Forgot password clicked!')
  },
  parameters: {
    docs: {
      description: {
        story: 'Login form with interactive callbacks for submit and forgot password actions.'
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
        story: 'Try submitting the form empty to see validation errors in action.'
      }
    }
  }
}

export const WithAPIError: Story = {
  args: {
    error: 'Invalid email or password',
    onSubmit: async (data) => {
      console.log('Login data:', data)
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Login form showing API error message for invalid credentials.'
      }
    }
  }
}

export const MobileView: Story = {
  args: {
    onSubmit: async (data) => console.log('Login data:', data)
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    },
    docs: {
      description: {
        story: 'Login form optimized for mobile devices.'
      }
    }
  }
}