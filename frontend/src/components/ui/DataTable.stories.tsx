import type { Meta, StoryObj } from '@storybook/react';
import { DataTable } from './DataTable';
import { StatusBadge } from './StatusBadge';

const meta: Meta<typeof DataTable> = {
  title: 'Dashboard/DataTable',
  component: DataTable,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Reusable data table component with sorting, filtering, and custom cell rendering.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample data for customers
const mockCustomers = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '555-123-4567',
    status: 'active' as const,
    lastInteraction: '2024-01-15',
    salesRep: 'Sarah Johnson',
  },
  {
    id: '2',
    name: 'Emily Davis',
    email: 'emily.davis@email.com',
    phone: '555-987-6543',
    status: 'lead' as const,
    lastInteraction: '2024-01-20',
    salesRep: 'Mike Wilson',
  },
  {
    id: '3',
    name: 'Robert Brown',
    email: 'robert.brown@email.com',
    phone: '555-456-7890',
    status: 'active' as const,
    lastInteraction: '2024-01-18',
    salesRep: 'Lisa Chen',
  },
];

const customerColumns = [
  {
    key: 'name',
    header: 'Name',
    cell: (customer: typeof mockCustomers[0]) => (
      <span className="font-medium text-[var(--text-primary)]">
        {customer.name}
      </span>
    ),
  },
  {
    key: 'email',
    header: 'Email',
  },
  {
    key: 'phone',
    header: 'Phone',
  },
  {
    key: 'status',
    header: 'Status',
    cell: (customer: typeof mockCustomers[0]) => (
      <StatusBadge status={customer.status}>
        {customer.status === 'active' ? 'Active' : 'Lead'}
      </StatusBadge>
    ),
  },
  {
    key: 'lastInteraction',
    header: 'Last Interaction',
  },
  {
    key: 'salesRep',
    header: 'Sales Rep',
  },
];

export const Default: Story = {
  args: {
    columns: customerColumns,
    data: mockCustomers,
    keyExtractor: (customer) => customer.id,
  },
};

export const WithRowClick: Story = {
  args: {
    columns: customerColumns,
    data: mockCustomers,
    keyExtractor: (customer) => customer.id,
    onRowClick: (customer) => {
      alert(`Clicked on ${customer.name}`);
    },
  },
};

export const Loading: Story = {
  args: {
    columns: customerColumns,
    data: [],
    keyExtractor: () => '',
    isLoading: true,
  },
};

export const EmptyState: Story = {
  args: {
    columns: customerColumns,
    data: [],
    keyExtractor: () => '',
    emptyMessage: 'No customers found',
  },
};

export const CustomEmptyMessage: Story = {
  args: {
    columns: customerColumns,
    data: [],
    keyExtractor: () => '',
    emptyMessage: 'No search results found. Try adjusting your filters.',
  },
};

// Sample inventory data
const mockInventory = [
  {
    id: '1',
    sku: 'YAM-R6-001',
    name: 'Yamaha R6 Engine Oil Filter',
    category: 'Engine Parts',
    quantity: 45,
    price: 24.99,
    status: 'in-stock' as const,
  },
  {
    id: '2',
    sku: 'HON-CBR-002',
    name: 'Honda CBR Brake Pads',
    category: 'Brake System',
    quantity: 8,
    price: 89.99,
    status: 'low-stock' as const,
  },
  {
    id: '3',
    sku: 'KAW-NIN-003',
    name: 'Kawasaki Ninja Front Tire',
    category: 'Tires',
    quantity: 0,
    price: 159.99,
    status: 'out-of-stock' as const,
  },
];

const inventoryColumns = [
  { key: 'sku', header: 'SKU' },
  {
    key: 'name',
    header: 'Item Name',
    cell: (item: typeof mockInventory[0]) => (
      <span className="font-medium text-[var(--text-primary)]">
        {item.name}
      </span>
    ),
  },
  { key: 'category', header: 'Category' },
  {
    key: 'quantity',
    header: 'Quantity',
    cell: (item: typeof mockInventory[0]) => (
      <span className={item.quantity <= 10 ? 'text-red-600 font-bold' : ''}>
        {item.quantity}
      </span>
    ),
  },
  {
    key: 'price',
    header: 'Price',
    cell: (item: typeof mockInventory[0]) => `$${item.price.toFixed(2)}`,
  },
  {
    key: 'status',
    header: 'Status',
    cell: (item: typeof mockInventory[0]) => {
      const statusMap = {
        'in-stock': 'active' as const,
        'low-stock': 'pending' as const,
        'out-of-stock': 'pending' as const,
      };
      return (
        <StatusBadge status={statusMap[item.status]}>
          {item.status === 'in-stock' ? 'In Stock' :
           item.status === 'low-stock' ? 'Low Stock' : 'Out of Stock'}
        </StatusBadge>
      );
    },
  },
];

export const InventoryTable: Story = {
  args: {
    columns: inventoryColumns,
    data: mockInventory,
    keyExtractor: (item) => item.id,
  },
};