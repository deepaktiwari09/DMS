import type { Meta, StoryObj } from '@storybook/react'
import { OnboardingForm } from './OnboardingForm'

const mockOrganizations = [
  { id: '1', name: 'Velocity Auto Group', memberCount: 24 },
  { id: '2', name: 'Two-Wheel Titans', memberCount: 8 },
  { id: '3', name: 'Premium Motors', memberCount: 15 }
]

const meta: Meta<typeof OnboardingForm> = {
  title: 'Auth/OnboardingForm',
  component: OnboardingForm,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Onboarding form allowing users to either create a new organization or join an existing one after registration.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    onCreateOrganization: {
      action: 'organization created',
      description: 'Callback when a new organization is created'
    },
    onJoinOrganization: {
      action: 'organization joined',
      description: 'Callback when user joins an existing organization'
    },
    onBack: {
      action: 'back clicked',
      description: 'Callback when back to login is clicked'
    },
    isLoading: {
      control: 'boolean',
      description: 'Show loading state during form submission'
    },
    availableOrganizations: {
      description: 'List of organizations user can join'
    }
  }
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    availableOrganizations: mockOrganizations,
    onCreateOrganization: async (data) => {
      console.log('Creating organization:', data)
      await new Promise(resolve => setTimeout(resolve, 1500))
    },
    onJoinOrganization: async (orgId) => {
      console.log('Joining organization:', orgId)
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Default onboarding form with options to create new organization or join existing ones.'
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
        story: 'Onboarding form in loading state during organization creation or joining.'
      }
    }
  }
}

export const NoOrganizations: Story = {
  args: {
    availableOrganizations: [],
    onCreateOrganization: async (data) => {
      console.log('Creating organization:', data)
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Onboarding form when no existing organizations are available to join.'
      }
    }
  }
}

export const WithCallbacks: Story = {
  args: {
    availableOrganizations: mockOrganizations,
    onCreateOrganization: async (data) => {
      console.log('Creating organization:', data)
      await new Promise(resolve => setTimeout(resolve, 2000))
      alert(`Organization created: ${data.name}`)
    },
    onJoinOrganization: async (orgId) => {
      const org = mockOrganizations.find(o => o.id === orgId)
      await new Promise(resolve => setTimeout(resolve, 1500))
      alert(`Joined organization: ${org?.name}`)
    },
    onBack: () => alert('Going back to login')
  },
  parameters: {
    docs: {
      description: {
        story: 'Onboarding form with interactive callbacks for testing user flows.'
      }
    }
  }
}

export const MobileView: Story = {
  args: {
    availableOrganizations: mockOrganizations,
    onCreateOrganization: async (data) => console.log('Creating organization:', data),
    onJoinOrganization: async (orgId) => console.log('Joining organization:', orgId)
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    },
    docs: {
      description: {
        story: 'Onboarding form optimized for mobile devices with stacked layout.'
      }
    }
  }
}

export const TabletView: Story = {
  args: {
    availableOrganizations: mockOrganizations,
    onCreateOrganization: async (data) => console.log('Creating organization:', data),
    onJoinOrganization: async (orgId) => console.log('Joining organization:', orgId)
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet'
    },
    docs: {
      description: {
        story: 'Onboarding form on tablet devices with responsive two-column layout.'
      }
    }
  }
}