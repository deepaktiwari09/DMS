import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { ChangePasswordForm } from './ChangePasswordForm'

const meta: Meta<typeof ChangePasswordForm> = {
  title: 'Auth/ChangePasswordForm',
  component: ChangePasswordForm,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Change password form component for authenticated users with current password verification and password strength indicator.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    onSubmit: {
      action: 'form submitted',
      description: 'Callback when form is submitted with valid password data'
    },
    onCancel: {
      action: 'cancel clicked',
      description: 'Callback when cancel button is clicked'
    },
    isLoading: {
      control: 'boolean',
      description: 'Show loading state during password change'
    },
    successMessage: {
      control: 'text',
      description: 'Success message to display after password change'
    },
    error: {
      control: 'text',
      description: 'Error message to display'
    }
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    isLoading: false,
  },
}

export const Loading: Story = {
  args: {
    isLoading: true,
  },
}

export const WithSuccessMessage: Story = {
  args: {
    isLoading: false,
    successMessage: 'Password changed successfully! Your account is now more secure.',
  },
}

export const WithError: Story = {
  args: {
    isLoading: false,
    error: 'Current password is incorrect. Please try again.',
  },
}

export const WithErrorWrongPassword: Story = {
  args: {
    isLoading: false,
    error: 'Current password is incorrect. Please verify your current password and try again.',
  },
}

export const WithErrorWeakPassword: Story = {
  args: {
    isLoading: false,
    error: 'New password does not meet security requirements. Please choose a stronger password.',
  },
}

export const WithoutCancelButton: Story = {
  args: {
    isLoading: false,
    onCancel: undefined,
  },
}

// Interactive example showing the complete flow
export const InteractiveFlow: Story = {
  args: {
    isLoading: false,
  },
  render: (args) => {
    const [state, setState] = React.useState<'form' | 'loading' | 'success' | 'error'>('form')
    const [errorType, setErrorType] = React.useState<'wrong-password' | 'weak-password' | 'generic'>('generic')
    
    const handleSubmit = async () => {
      setState('loading')
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simulate random error scenarios for demo
      const randomError = Math.random()
      if (randomError < 0.3) {
        setErrorType('wrong-password')
        setState('error')
      } else if (randomError < 0.6) {
        setErrorType('weak-password')
        setState('error')
      } else if (randomError > 0.8) {
        setState('success')
        // Reset to form after showing success
        setTimeout(() => setState('form'), 3000)
      } else {
        setErrorType('generic')
        setState('error')
      }
    }
    
    const handleCancel = () => {
      setState('form')
    }
    
    const getErrorMessage = () => {
      switch (errorType) {
        case 'wrong-password':
          return 'Current password is incorrect. Please verify your current password and try again.'
        case 'weak-password':
          return 'New password does not meet security requirements. Please choose a stronger password.'
        default:
          return 'An error occurred while changing your password. Please try again.'
      }
    }
    
    return (
      <div className="space-y-4">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded text-sm">
          <strong>Try these inputs for different scenarios:</strong>
          <ul className="mt-2 list-disc list-inside">
            <li>Current Password: "wrong" → Shows wrong password error</li>
            <li>New Password: "weak" → Shows weak password error</li>
            <li>Other inputs → Random success/error</li>
          </ul>
        </div>
        
        <ChangePasswordForm
          {...args}
          isLoading={state === 'loading'}
          successMessage={state === 'success' ? 'Password changed successfully!' : undefined}
          error={state === 'error' ? getErrorMessage() : undefined}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    )
  },
}

// Example showing password strength indicator
export const PasswordStrengthDemo: Story = {
  args: {
    isLoading: false,
  },
  render: (args) => (
    <div className="space-y-4">
      <div className="p-4 bg-green-50 border border-green-200 rounded text-sm">
        <strong>Password Strength Indicator:</strong>
        <p>Start typing in the "New Password" field to see the strength indicator in action.</p>
        <ul className="mt-2 list-disc list-inside">
          <li>Length: 6+ characters</li>
          <li>8+ chars: 8+ characters for better security</li>
          <li>Letter + Number: Contains both letters and numbers</li>
          <li>Uppercase: Contains uppercase letters</li>
        </ul>
      </div>
      
      <ChangePasswordForm {...args} />
    </div>
  ),
}

// Example in modal/settings context
export const InSettingsModal: Story = {
  args: {
    isLoading: false,
  },
  render: (args) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <ChangePasswordForm {...args} />
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
}