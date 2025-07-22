import type { Meta, StoryObj } from '@storybook/react'
import { AuthBackground } from './AuthBackground'

const meta: Meta<typeof AuthBackground> = {
  title: 'Auth/AuthBackground',
  component: AuthBackground,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Background component for auth pages with image overlay and centered content area.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    imageUrl: {
      control: 'text',
      description: 'URL of the background image'
    },
    overlayOpacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.1 },
      description: 'Opacity of the dark overlay (0-1)'
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes'
    }
  }
}

export default meta
type Story = StoryObj<typeof meta>

const SampleContent = () => (
  <div className="bg-white p-8 rounded-xl shadow-2xl text-center">
    <h1 className="text-2xl font-bold text-gray-900 mb-4">Sample Auth Content</h1>
    <p className="text-gray-600 mb-6">This is how content appears over the background.</p>
    <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
      Sample Button
    </button>
  </div>
)

export const Default: Story = {
  args: {
    children: <SampleContent />
  },
  parameters: {
    docs: {
      description: {
        story: 'Default background with car image and 50% opacity overlay.'
      }
    }
  }
}

export const LightOverlay: Story = {
  args: {
    overlayOpacity: 0.3,
    children: <SampleContent />
  },
  parameters: {
    docs: {
      description: {
        story: 'Background with lighter overlay for better image visibility.'
      }
    }
  }
}

export const DarkOverlay: Story = {
  args: {
    overlayOpacity: 0.7,
    children: <SampleContent />
  },
  parameters: {
    docs: {
      description: {
        story: 'Background with darker overlay for better text contrast.'
      }
    }
  }
}

export const CustomImage: Story = {
  args: {
    imageUrl: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    children: <SampleContent />
  },
  parameters: {
    docs: {
      description: {
        story: 'Background with custom car showroom image from Unsplash.'
      }
    }
  }
}

export const WithLoginForm: Story = {
  args: {
    children: (
      <div className="bg-white p-8 rounded-xl shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">DealerFlow DMS</h1>
          <p className="text-gray-600 mt-2">Access your dealership management system.</p>
        </div>
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username or Email</label>
            <input
              type="text"
              className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              placeholder="e.g., yourname@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
          >
            Login
          </button>
        </form>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Example of how the background looks with a login form, matching the HTML design.'
      }
    }
  }
}