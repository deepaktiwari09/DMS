import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout';
import { DashboardHeader } from '../../components/layout/DashboardHeader';
import { DataTable, SearchInput, StatusBadge, TabNavigation } from '../../components/ui';
import type { Column } from '../../components/ui/DataTable';
import type { TabItem } from '../../components/ui/TabNavigation';

interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  supplier: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
}

// Mock data
const mockInventory: InventoryItem[] = [
  {
    id: '1',
    sku: 'YAM-R6-ENG-001',
    name: 'Yamaha R6 Engine Oil Filter',
    category: 'Engine Parts',
    quantity: 45,
    price: 24.99,
    supplier: 'Yamaha Parts Co.',
    status: 'in-stock',
  },
  {
    id: '2',
    sku: 'HON-CBR-BRK-002',
    name: 'Honda CBR Brake Pads Set',
    category: 'Brake System',
    quantity: 8,
    price: 89.99,
    supplier: 'Honda Genuine Parts',
    status: 'low-stock',
  },
  {
    id: '3',
    sku: 'KAW-NIN-TIR-003',
    name: 'Kawasaki Ninja Front Tire',
    category: 'Tires',
    quantity: 0,
    price: 159.99,
    supplier: 'Kawasaki Direct',
    status: 'out-of-stock',
  },
  {
    id: '4',
    sku: 'SUZ-GSX-CHA-004',
    name: 'Suzuki GSXR Chain Kit',
    category: 'Drive Train',
    quantity: 12,
    price: 124.99,
    supplier: 'Suzuki Parts Plus',
    status: 'in-stock',
  },
  {
    id: '5',
    sku: 'BMW-R12-BAT-005',
    name: 'BMW R1200 Battery',
    category: 'Electrical',
    quantity: 3,
    price: 189.99,
    supplier: 'BMW Motorrad',
    status: 'low-stock',
  },
];

const InventoryPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const tabs: TabItem[] = [
    { id: 'all', label: 'All Items' },
    { id: 'motorcycles', label: 'Motorcycles' },
    { id: 'parts', label: 'Parts' },
    { id: 'accessories', label: 'Accessories' },
  ];

  const filteredInventory = React.useMemo(() => {
    let filtered = mockInventory;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [searchTerm]);

  const getStockStatus = (quantity: number): 'in-stock' | 'low-stock' | 'out-of-stock' => {
    if (quantity === 0) return 'out-of-stock';
    if (quantity <= 10) return 'low-stock';
    return 'in-stock';
  };

  const columns: Column<InventoryItem>[] = [
    { key: 'sku', header: 'SKU' },
    {
      key: 'name',
      header: 'Item Name',
      cell: (item) => (
        <span className="font-medium text-[var(--text-primary)]">
          {item.name}
        </span>
      ),
    },
    { key: 'category', header: 'Category' },
    {
      key: 'quantity',
      header: 'Quantity',
      cell: (item) => (
        <span className={item.quantity <= 10 ? 'text-red-600 font-bold' : ''}>
          {item.quantity}
        </span>
      ),
    },
    {
      key: 'price',
      header: 'Price',
      cell: (item) => `$${item.price.toFixed(2)}`,
    },
    { key: 'supplier', header: 'Supplier' },
    {
      key: 'status',
      header: 'Status',
      cell: (item) => {
        const status = getStockStatus(item.quantity);
        return (
          <StatusBadge
            status={
              status === 'in-stock'
                ? 'active'
                : status === 'low-stock'
                ? 'pending'
                : 'pending'
            }
          >
            {status === 'in-stock'
              ? 'In Stock'
              : status === 'low-stock'
              ? 'Low Stock'
              : 'Out of Stock'}
          </StatusBadge>
        );
      },
    },
  ];

  return (
    <DashboardLayout>
      <DashboardHeader
        title="Inventory Management"
        actions={
          <div className="flex gap-3">
            <button className="button_secondary">Import Items</button>
            <button className="button_primary">Add Item</button>
          </div>
        }
      />

      {/* Search */}
      <div className="mb-6">
        <SearchInput
          placeholder="Search inventory by name, SKU, or category"
          onSearch={setSearchTerm}
        />
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      {/* Inventory Table */}
      <DataTable
        columns={columns}
        data={filteredInventory}
        keyExtractor={(item) => item.id}
        emptyMessage={
          searchTerm
            ? `No inventory items found matching "${searchTerm}"`
            : 'No inventory items found'
        }
        onRowClick={(item) => {
          console.log('Inventory item clicked:', item);
          // TODO: Navigate to item details
        }}
      />

      {/* Low Stock Alert */}
      {filteredInventory.some(item => item.quantity <= 10) && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="text-sm font-medium text-yellow-800">
            ⚠️ Low Stock Alert
          </h3>
          <p className="text-sm text-yellow-700 mt-1">
            {filteredInventory.filter(item => item.quantity <= 10).length} items are running low on stock.
          </p>
        </div>
      )}
    </DashboardLayout>
  );
};

export default InventoryPage;