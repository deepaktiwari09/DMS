import type { Meta, StoryObj } from '@storybook/react'
import { BrowserRouter } from 'react-router-dom'
import { ForgotPasswordPage } from './ForgotPasswordPage'

const meta: Meta<typeof ForgotPasswordPage> = {
  title: 'Pages/Auth/ForgotPasswordPage',
  component: ForgotPasswordPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Full forgot password page with background image, matching the forgotpassword.html design. Features key icon, centered form, and back to login link.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    backgroundImage: {
      control: 'text',
      description: 'Custom background image URL'
    },
    onSuccess: {
      action: 'forgot password success',
      description: 'Callback for successful password reset request'
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
        story: 'Default forgot password page with car background image and key icon.'
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
        story: 'Forgot password page with custom car showroom background image.'
      }
    }
  }
}

export const WithSuccessCallback: Story = {
  args: {
    onSuccess: (message: string) => alert(`Success: ${message}`)
  },
  parameters: {
    docs: {
      description: {
        story: 'Forgot password page with custom success callback for testing email sending flow.'
      }
    }
  }
}

export const ShowingSuccessMessage: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Try submitting the form with any email to see the success message display functionality.'
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
        story: 'Forgot password page optimized for mobile devices with responsive layout.'
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
        story: 'Forgot password page on tablet devices showing responsive behavior.'
      }
    }
  }
}

export const Interactive: Story = {
  args: {
    onSuccess: (message: string) => {
      console.log('Password reset email sent:', message)
      // In a real app, might show success message or redirect
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive forgot password page - try entering an email to see the form submission behavior.'
      }
    }
  }
}