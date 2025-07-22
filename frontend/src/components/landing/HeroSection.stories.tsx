import type { Meta, StoryObj } from '@storybook/react'
import { HeroSection } from './HeroSection'

const meta: Meta<typeof HeroSection> = {
  title: 'Landing/HeroSection',
  component: HeroSection,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Hero section with main headline, description, and call-to-action button for the landing page.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    onDemoClick: {
      action: 'demo requested',
      description: 'Callback when "Request a Demo" button is clicked'
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
        story: 'Default hero section with headline, description, and demo request button.'
      }
    }
  }
}

export const WithDemoCallback: Story = {
  args: {
    onDemoClick: () => alert('Demo requested!')
  },
  parameters: {
    docs: {
      description: {
        story: 'Hero section with interactive demo request callback.'
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
        story: 'Hero section optimized for mobile devices with stacked layout.'
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
        story: 'Hero section on tablet devices.'
      }
    }
  }
}