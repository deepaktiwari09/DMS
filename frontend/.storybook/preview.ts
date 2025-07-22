import type { Preview } from '@storybook/react-vite'
// Import our CSS file that includes Tailwind and our design system
import '../src/index.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
    // Add backgrounds for better component visualization
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#ffffff',
        },
        {
          name: 'dark',
          value: '#1f2937',
        },
        {
          name: 'secondary',
          value: '#e0f2fe',
        },
      ],
    },
  },
};

export default preview;