import type { Meta, StoryObj } from '@storybook/react'
import { AuthPage } from './AuthPage'

const mockOrganizations = [
  { id: '1', name: 'Velocity Auto Group', memberCount: 24 },
  { id: '2', name: 'Two-Wheel Titans', memberCount: 8 },
  { id: '3', name: 'Premium Motors', memberCount: 15 }
]

const meta: Meta<typeof AuthPage> = {
  title: 'Pages/AuthPage',
  component: AuthPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Complete authentication page with login, registration, and onboarding flows.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    onLogin: {
      action: 'login attempted',
      description: 'Callback when user attempts to log in'
    },
    onRegister: {
      action: 'register attempted',
      description: 'Callback when user attempts to register'
    },
    onCreateOrganization: {
      action: 'organization created',
      description: 'Callback when user creates new organization'
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
      description: 'Show loading state across all authentication forms'
    },
    availableOrganizations: {
      description: 'List of organizations available for registration and joining'
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
        story: 'Complete authentication page with all flows available.'
      }
    }
  }
}

export const FullWorkflow: Story = {
  args: {
    availableOrganizations: mockOrganizations,
    onLogin: async (data) => {
      console.log('🔐 Login attempt:', data)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simulate successful login
      alert(`✅ Login successful!\n\nEmail: ${data.email}\nRedirecting to dashboard...`)
    },
    onRegister: async (data) => {
      console.log('📝 Registration attempt:', data)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2500))
      
      // Simulate successful registration
      alert(`✅ Registration successful!\n\nWelcome ${data.firstName} ${data.lastName}!\nProceed to organization setup...`)
    },
    onCreateOrganization: async (data) => {
      console.log('🏢 Organization creation:', data)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simulate successful creation
      alert(`✅ Organization created!\n\n${data.name}\n${data.address}\n\nWelcome to DealerFlow!`)
    },
    onJoinOrganization: async (orgId) => {
      const org = mockOrganizations.find(o => o.id === orgId)
      console.log('🤝 Joining organization:', orgId, org?.name)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Simulate successful join
      alert(`✅ Successfully joined!\n\nOrganization: ${org?.name}\nMembers: ${org?.memberCount}\n\nWelcome to the team!`)
    },
    onForgotPassword: () => {
      alert('📧 Password reset email sent!\n\nCheck your inbox for further instructions.')
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive authentication page demonstrating the complete user onboarding workflow from login/registration to organization setup.'
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
        story: 'Authentication page in loading state during form submissions.'
      }
    }
  }
}

export const NoOrganizations: Story = {
  args: {
    availableOrganizations: [],
    onCreateOrganization: async (data) => {
      console.log('Creating organization:', data)
      await new Promise(resolve => setTimeout(resolve, 2000))
      alert(`Organization "${data.name}" created successfully!`)
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Authentication page when no existing organizations are available - users must create new ones.'
      }
    }
  }
}

export const MobileExperience: Story = {
  args: {
    availableOrganizations: mockOrganizations,
    onLogin: async (data) => console.log('Mobile login:', data),
    onRegister: async (data) => console.log('Mobile registration:', data)
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    },
    docs: {
      description: {
        story: 'Authentication page optimized for mobile devices with touch-friendly forms and responsive design.'
      }
    }
  }
}

export const TabletExperience: Story = {
  args: {
    availableOrganizations: mockOrganizations
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet'
    },
    docs: {
      description: {
        story: 'Authentication page experience on tablet devices.'
      }
    }
  }
}