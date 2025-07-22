import type { Meta, StoryObj } from '@storybook/react'
import { CTASection } from './CTASection'

const meta: Meta<typeof CTASection> = {
  title: 'Landing/CTASection',
  component: CTASection,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Call-to-action section with compelling headline and get started button, designed to convert landing page visitors.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    onGetStartedClick: {
      action: 'get started clicked',
      description: 'Callback when "Get Started" button is clicked'
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
        story: 'Default CTA section with compelling messaging and call-to-action button.'
      }
    }
  }
}

export const WithCallback: Story = {
  args: {
    onGetStartedClick: () => alert('Getting started!')
  },
  parameters: {
    docs: {
      description: {
        story: 'CTA section with interactive callback for the get started button.'
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
        story: 'CTA section optimized for mobile devices with responsive text sizing and button placement.'
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
        story: 'CTA section on tablet devices.'
      }
    }
  }
}