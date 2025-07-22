import type { Meta, StoryObj } from '@storybook/react'
import { AuthCard } from './AuthCard'

const meta: Meta<typeof AuthCard> = {
  title: 'Auth/AuthCard',
  component: AuthCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Card component for auth forms with optional logo, title, and subtitle.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Main heading for the card'
    },
    subtitle: {
      control: 'text',
      description: 'Subtitle or description text'
    },
    showLogo: {
      control: 'boolean',
      description: 'Whether to show the DealerFlow logo'
    },
    variant: {
      control: 'select',
      options: ['card', 'transparent'],
      description: 'Card style variant'
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes'
    }
  },
  decorators: [
    (Story) => (
      <div className="max-w-md mx-auto bg-gray-50 p-8">
        <Story />
      </div>
    )
  ]
}

export default meta
type Story = StoryObj<typeof meta>

const SampleFormContent = () => (
  <form className="space-y-6">
    <div>
      <label className="block text-sm font-medium text-gray-700">Email</label>
      <input
        type="email"
        className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
        placeholder="you@example.com"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">Password</label>
      <input
        type="password"
        className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
        placeholder="••••••••"
      />
    </div>
    <button
      type="submit"
      className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
    >
      Submit
    </button>
  </form>
)

export const Default: Story = {
  args: {
    title: 'DealerFlow DMS',
    subtitle: 'Access your dealership management system.',
    children: <SampleFormContent />
  },
  parameters: {
    docs: {
      description: {
        story: 'Default card with logo, title, subtitle, and form content.'
      }
    }
  }
}

export const WithoutLogo: Story = {
  args: {
    showLogo: false,
    title: 'Welcome Back',
    subtitle: 'Sign in to your account.',
    children: <SampleFormContent />
  },
  parameters: {
    docs: {
      description: {
        story: 'Card without logo, showing only title and subtitle.'
      }
    }
  }
}

export const TransparentVariant: Story = {
  args: {
    variant: 'transparent',
    title: 'Create Account',
    subtitle: 'Get started with DealerFlow.',
    children: <SampleFormContent />
  },
  parameters: {
    docs: {
      description: {
        story: 'Transparent variant without card background.'
      }
    }
  }
}

export const MinimalContent: Story = {
  args: {
    children: <SampleFormContent />
  },
  parameters: {
    docs: {
      description: {
        story: 'Card with only form content, no title or subtitle.'
      }
    }
  }
}

export const LongForm: Story = {
  args: {
    title: 'Register',
    subtitle: 'Create your new account.',
    children: (
      <form className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="John"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Doe"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="••••••••"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
          <input
            type="password"
            className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Register
        </button>
      </form>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Card with a longer registration form, showing how it handles more content.'
      }
    }
  }
}