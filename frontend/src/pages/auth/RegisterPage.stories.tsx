import type { Meta, StoryObj } from '@storybook/react'
import { BrowserRouter } from 'react-router-dom'
import { RegisterPage } from './RegisterPage'

const meta: Meta<typeof RegisterPage> = {
  title: 'Pages/Auth/RegisterPage',
  component: RegisterPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Full registration page with clean design, matching the register.html layout. Features centered form with logo and footer links.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    onRegisterSuccess: {
      action: 'registration successful',
      description: 'Callback for successful registration'
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
        story: 'Default registration page with clean gray background and centered form.'
      }
    }
  }
}

export const WithCallback: Story = {
  args: {
    onRegisterSuccess: () => alert('Registration successful! Would redirect to onboarding.')
  },
  parameters: {
    docs: {
      description: {
        story: 'Registration page with custom success callback for testing registration flow.'
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
        story: 'Registration page optimized for mobile devices with responsive layout.'
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
        story: 'Registration page on tablet devices showing responsive form layout.'
      }
    }
  }
}

export const Interactive: Story = {
  args: {
    onRegisterSuccess: () => {
      console.log('Registration completed successfully')
      // In a real app, this would navigate to onboarding
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive registration page - try filling out the form to see validation and submission behavior.'
      }
    }
  }
}