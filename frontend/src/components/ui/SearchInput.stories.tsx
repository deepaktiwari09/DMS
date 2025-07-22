import type { Meta, StoryObj } from '@storybook/react';
import { SearchInput } from './SearchInput';
import { useState } from 'react';

const meta: Meta<typeof SearchInput> = {
  title: 'Dashboard/SearchInput',
  component: SearchInput,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Search input component with magnifying glass icon and debounced search functionality.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: 'text',
      description: 'Placeholder text for the input',
    },
    debounceMs: {
      control: 'number',
      description: 'Debounce delay in milliseconds',
    },
    onSearch: {
      action: 'searched',
      description: 'Callback fired when search term changes (debounced)',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Search...',
    onSearch: (value) => console.log('Search:', value),
  },
};

export const CustomPlaceholder: Story = {
  args: {
    placeholder: 'Search customers by name, email, or phone',
    onSearch: (value) => console.log('Search:', value),
  },
};

export const FastDebounce: Story = {
  args: {
    placeholder: 'Fast search (100ms debounce)',
    debounceMs: 100,
    onSearch: (value) => console.log('Fast search:', value),
  },
};

export const SlowDebounce: Story = {
  args: {
    placeholder: 'Slow search (1000ms debounce)',
    debounceMs: 1000,
    onSearch: (value) => console.log('Slow search:', value),
  },
};

export const WithCustomClass: Story = {
  args: {
    placeholder: 'Custom styled search',
    className: 'w-96 border-2 border-blue-300 focus:border-blue-500',
    onSearch: (value) => console.log('Custom search:', value),
  },
};

// Interactive example with search results
const InteractiveSearchExample = () => {
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const mockData = [
    'John Smith',
    'Emily Davis',
    'Michael Johnson',
    'Sarah Wilson',
    'Robert Brown',
    'Lisa Chen',
    'David Rodriguez',
    'Amanda Taylor',
  ];

  const handleSearch = (searchTerm: string) => {
    setIsSearching(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const results = mockData.filter(name =>
        name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(results);
      setIsSearching(false);
    }, 300);
  };

  return (
    <div className="w-96">
      <SearchInput
        placeholder="Search customers..."
        onSearch={handleSearch}
        debounceMs={300}
      />
      
      <div className="mt-4 p-4 bg-gray-50 rounded-lg min-h-[100px]">
        {isSearching ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-sm text-gray-600">Searching...</span>
          </div>
        ) : searchResults.length > 0 ? (
          <div>
            <p className="text-sm text-gray-600 mb-2">
              Found {searchResults.length} results:
            </p>
            <ul className="space-y-1">
              {searchResults.map((result, index) => (
                <li key={index} className="text-sm py-1 px-2 bg-white rounded border">
                  {result}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center">
            Start typing to search...
          </p>
        )}
      </div>
    </div>
  );
};

export const Interactive: Story = {
  render: () => <InteractiveSearchExample />,
  parameters: {
    docs: {
      description: {
        story: 'Interactive example showing search with debounced results and loading state.',
      },
    },
  },
};