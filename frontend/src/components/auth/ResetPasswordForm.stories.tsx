import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { ResetPasswordForm } from './ResetPasswordForm'

const meta: Meta<typeof ResetPasswordForm> = {
  title: 'Auth/ResetPasswordForm',
  component: ResetPasswordForm,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Password reset form component for setting new password with token validation and password strength indicator.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    onSubmit: {
      action: 'form submitted',
      description: 'Callback when form is submitted with valid password data'
    },
    token: {
      control: 'text',
      description: 'Reset token from URL or email link'
    },
    onBackToLogin: {
      action: 'back to login clicked',
      description: 'Callback when back to login button is clicked'
    },
    isLoading: {
      control: 'boolean',
      description: 'Show loading state during password reset'
    },
    successMessage: {
      control: 'text',
      description: 'Success message to display after password reset'
    },
    error: {
      control: 'text',
      description: 'Error message to display'
    },
    isTokenValid: {
      control: 'boolean',
      description: 'Whether the reset token is valid'
    }
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    token: 'abc123def456',
    isLoading: false,
    isTokenValid: true,
  },
}

export const Loading: Story = {
  args: {
    token: 'abc123def456',
    isLoading: true,
    isTokenValid: true,
  },
}

export const WithSuccessMessage: Story = {
  args: {
    token: 'abc123def456',
    isLoading: false,
    isTokenValid: true,
    successMessage: 'Password has been reset successfully! You can now login with your new password.',
  },
}

export const WithError: Story = {
  args: {
    token: 'abc123def456',
    isLoading: false,
    isTokenValid: true,
    error: 'Failed to reset password. Please check your new password and try again.',
  },
}

export const InvalidToken: Story = {
  args: {
    token: 'invalid-token',
    isLoading: false,
    isTokenValid: false,
  },
}

export const WithoutBackButton: Story = {
  args: {
    token: 'abc123def456',
    isLoading: false,
    isTokenValid: true,
    onBackToLogin: undefined,
  },
}

// Interactive example showing password strength
export const InteractivePasswordStrength: Story = {
  args: {
    token: 'abc123def456',
    isLoading: false,
    isTokenValid: true,
  },
  render: (args) => {
    const [state, setState] = React.useState<'form' | 'loading' | 'success' | 'error'>('form')
    
    const handleSubmit = async () => {
      setState('loading')
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      // Randomly succeed or fail for demo
      if (Math.random() > 0.3) {
        setState('success')
      } else {
        setState('error')
      }
    }
    
    const handleBackToLogin = () => {
      setState('form')
    }
    
    return (
      <ResetPasswordForm
        {...args}
        isLoading={state === 'loading'}
        successMessage={state === 'success' ? 'Password has been reset successfully!' : undefined}
        error={state === 'error' ? 'Failed to reset password. Please try again.' : undefined}
        onSubmit={handleSubmit}
        onBackToLogin={handleBackToLogin}
      />
    )
  },
}

// Example showing the complete reset flow
export const CompleteResetFlow: Story = {
  args: {
    token: 'abc123def456',
  },
  render: (args) => {
    const [tokenValid, setTokenValid] = React.useState(true)
    const [state, setState] = React.useState<'form' | 'loading' | 'success' | 'error'>('form')
    
    const handleSubmit = async () => {
      setState('loading')
      await new Promise(resolve => setTimeout(resolve, 1500))
      setState('success')
    }
    
    return (
      <div className="space-y-4">
        <div className="flex gap-2 mb-4">
          <button 
            onClick={() => setTokenValid(true)}
            className={`px-3 py-1 text-sm rounded ${tokenValid ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Valid Token
          </button>
          <button 
            onClick={() => setTokenValid(false)}
            className={`px-3 py-1 text-sm rounded ${!tokenValid ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Invalid Token
          </button>
        </div>
        
        <ResetPasswordForm
          {...args}
          isTokenValid={tokenValid}
          isLoading={state === 'loading'}
          successMessage={state === 'success' ? 'Password has been reset successfully!' : undefined}
          error={state === 'error' ? 'Failed to reset password. Please try again.' : undefined}
          onSubmit={handleSubmit}
        />
      </div>
    )
  },
}