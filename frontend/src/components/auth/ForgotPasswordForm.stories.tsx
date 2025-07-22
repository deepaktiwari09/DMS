import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { ForgotPasswordForm } from './ForgotPasswordForm'

const meta: Meta<typeof ForgotPasswordForm> = {
  title: 'Auth/ForgotPasswordForm',
  component: ForgotPasswordForm,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Forgot password form component for requesting password reset emails with email validation.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    onSubmit: {
      action: 'form submitted',
      description: 'Callback when form is submitted with valid email'
    },
    onBackToLogin: {
      action: 'back to login clicked',
      description: 'Callback when back to login button is clicked'
    },
    isLoading: {
      control: 'boolean',
      description: 'Show loading state during form submission'
    },
    successMessage: {
      control: 'text',
      description: 'Success message to display after form submission'
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
    successMessage: 'If a user with this email exists, a password reset link has been sent.',
  },
}

export const WithError: Story = {
  args: {
    isLoading: false,
    error: 'An error occurred while processing your request. Please try again.',
  },
}

export const WithoutBackButton: Story = {
  args: {
    isLoading: false,
    onBackToLogin: undefined,
  },
}

// Interactive example showing the complete flow
export const InteractiveFlow: Story = {
  args: {
    isLoading: false,
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
      <ForgotPasswordForm
        {...args}
        isLoading={state === 'loading'}
        successMessage={state === 'success' ? 'If a user with this email exists, a password reset link has been sent.' : undefined}
        error={state === 'error' ? 'An error occurred. Please try again.' : undefined}
        onSubmit={handleSubmit}
        onBackToLogin={handleBackToLogin}
      />
    )
  },
}