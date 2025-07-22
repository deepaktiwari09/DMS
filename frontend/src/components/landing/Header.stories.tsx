import type { Meta, StoryObj } from '@storybook/react'
import { Header } from './Header'

const meta: Meta<typeof Header> = {
  title: 'Landing/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Landing page header with responsive navigation and authentication buttons.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    onLoginClick: {
      action: 'login clicked',
      description: 'Callback when login button is clicked'
    },
    onRegisterClick: {
      action: 'register clicked',
      description: 'Callback when register button is clicked'
    }
  }
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Default header with all navigation elements and authentication buttons.'
      }
    }
  }
}

export const WithCallbacks: Story = {
  args: {
    onLoginClick: () => alert('Login clicked!'),
    onRegisterClick: () => alert('Register clicked!')
  },
  parameters: {
    docs: {
      description: {
        story: 'Header with interactive callbacks for authentication buttons.'
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
        story: 'Header on mobile devices with hamburger menu.'
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
        story: 'Header on tablet devices.'
      }
    }
  }
}