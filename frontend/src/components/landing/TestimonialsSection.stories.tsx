import type { Meta, StoryObj } from '@storybook/react'
import { TestimonialsSection } from './TestimonialsSection'

const meta: Meta<typeof TestimonialsSection> = {
  title: 'Landing/TestimonialsSection',
  component: TestimonialsSection,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Customer testimonials section showcasing success stories from real dealership users.'
      }
    }
  },
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Default testimonials section with three customer success stories in a responsive grid layout.'
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
        story: 'Testimonials section on mobile devices with single-column layout for better readability.'
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
        story: 'Testimonials section on tablet devices with two-column layout.'
      }
    }
  }
}

export const DesktopView: Story = {
  args: {},
  parameters: {
    viewport: {
      defaultViewport: 'desktop'
    },
    docs: {
      description: {
        story: 'Testimonials section on desktop with three-column layout showing all testimonials in a single row.'
      }
    }
  }
}