import type { Meta, StoryObj } from '@storybook/react'
import { AuthTabs } from './AuthTabs'

const mockOrganizations = [
  { id: '1', name: 'Velocity Auto Group', memberCount: 24 },
  { id: '2', name: 'Two-Wheel Titans', memberCount: 8 },
  { id: '3', name: 'Premium Motors', memberCount: 15 }
]

const meta: Meta<typeof AuthTabs> = {
  title: 'Auth/AuthTabs',
  component: AuthTabs,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Complete authentication flow with login, register, and onboarding tabs.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    onLogin: {
      action: 'login attempted',
      description: 'Callback when login form is submitted'
    },
    onRegister: {
      action: 'register attempted',
      description: 'Callback when register form is submitted'
    },
    onCreateOrganization: {
      action: 'organization created',
      description: 'Callback when new organization is created'
    },
    onJoinOrganization: {
      action: 'organization joined',
      description: 'Callback when user joins existing organization'
    },
    onForgotPassword: {
      action: 'forgot password clicked',
      description: 'Callback when forgot password is clicked'
    },
    isLoading: {
      control: 'boolean',
      description: 'Show loading state across all forms'
    },
    availableOrganizations: {
      description: 'List of organizations available for registration and onboarding'
    }
  }
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    availableOrganizations: mockOrganizations
  },
  parameters: {
    docs: {
      description: {
        story: 'Default authentication tabs starting with login form active.'
      }
    }
  }
}

export const WithCallbacks: Story = {
  args: {
    availableOrganizations: mockOrganizations,
    onLogin: async (data) => {
      console.log('Login data:', data)
      await new Promise(resolve => setTimeout(resolve, 2000))
      alert(`Login successful: ${data.email}`)
    },
    onRegister: async (data) => {
      console.log('Register data:', data)
      await new Promise(resolve => setTimeout(resolve, 2500))
      alert(`Registration successful: ${data.firstName} ${data.lastName}`)
    },
    onCreateOrganization: async (data) => {
      console.log('Organization data:', data)
      await new Promise(resolve => setTimeout(resolve, 2000))
      alert(`Organization created: ${data.name}`)
    },
    onJoinOrganization: async (orgId) => {
      const org = mockOrganizations.find(o => o.id === orgId)
      await new Promise(resolve => setTimeout(resolve, 1500))
      alert(`Joined organization: ${org?.name}`)
    },
    onForgotPassword: () => alert('Forgot password clicked!')
  },
  parameters: {
    docs: {
      description: {
        story: 'Authentication tabs with full interactive callbacks for testing the complete flow.'
      }
    }
  }
}

export const Loading: Story = {
  args: {
    isLoading: true,
    availableOrganizations: mockOrganizations
  },
  parameters: {
    docs: {
      description: {
        story: 'Authentication tabs in loading state across all forms.'
      }
    }
  }
}

export const NoOrganizations: Story = {
  args: {
    availableOrganizations: []
  },
  parameters: {
    docs: {
      description: {
        story: 'Authentication tabs when no organizations are available for registration.'
      }
    }
  }
}

export const MobileView: Story = {
  args: {
    availableOrganizations: mockOrganizations
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    },
    docs: {
      description: {
        story: 'Authentication tabs optimized for mobile devices.'
      }
    }
  }
}

export const TabletView: Story = {
  args: {
    availableOrganizations: mockOrganizations
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet'
    },
    docs: {
      description: {
        story: 'Authentication tabs on tablet devices.'
      }
    }
  }
}