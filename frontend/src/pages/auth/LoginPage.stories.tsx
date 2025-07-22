import type { Meta, StoryObj } from '@storybook/react'
import { BrowserRouter } from 'react-router-dom'
import { LoginPage } from './LoginPage'

const meta: Meta<typeof LoginPage> = {
  title: 'Pages/Auth/LoginPage',
  component: LoginPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Full login page with background image, matching the login.html design. Features centered card with logo, form, and footer links.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    backgroundImage: {
      control: 'text',
      description: 'Custom background image URL'
    },
    onLoginSuccess: {
      action: 'login successful',
      description: 'Callback for successful login'
    }
  },
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    )
  ]
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Default login page with car background image and standard DealerFlow branding.'
      }
    }
  }
}

export const CustomBackground: Story = {
  args: {
    backgroundImage: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
  },
  parameters: {
    docs: {
      description: {
        story: 'Login page with custom car showroom background image.'
      }
    }
  }
}

export const WithCallback: Story = {
  args: {
    onLoginSuccess: () => alert('Login successful! Would redirect to dashboard.')
  },
  parameters: {
    docs: {
      description: {
        story: 'Login page with custom success callback for testing login flow.'
      }
    }
  }
}

export const MobileView: Story = {
  args: {},
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    },
    docs: {
      description: {
        story: 'Login page optimized for mobile devices with responsive layout.'
      }
    }
  }
}

export const TabletView: Story = {
  args: {},
  parameters: {
    viewport: {
      defaultViewport: 'tablet'
    },
    docs: {
      description: {
        story: 'Login page on tablet devices showing responsive behavior.'
      }
    }
  }
}