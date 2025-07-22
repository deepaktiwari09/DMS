import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout';
import { DashboardHeader } from '../../components/layout/DashboardHeader';
import { DataTable, SearchInput, StatusBadge, TabNavigation } from '../../components/ui';
import type { Column } from '../../components/ui/DataTable';
import type { TabItem } from '../../components/ui/TabNavigation';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'lead';
  lastInteraction: string;
  salesRep: string;
}

// Mock data matching the HTML prototype
const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Ethan Carter',
    email: 'ethan.carter@email.com',
    phone: '555-123-4567',
    status: 'active',
    lastInteraction: '2023-11-15',
    salesRep: 'Olivia Bennett',
  },
  {
    id: '2',
    name: 'Sophia Clark',
    email: 'sophia.clark@email.com',
    phone: '555-987-6543',
    status: 'lead',
    lastInteraction: '2023-11-20',
    salesRep: 'Liam Davis',
  },
  {
    id: '3',
    name: 'Noah Harris',
    email: 'noah.harris@email.com',
    phone: '555-246-8013',
    status: 'active',
    lastInteraction: '2023-11-10',
    salesRep: 'Ava Wilson',
  },
  {
    id: '4',
    name: 'Isabella Martinez',
    email: 'isabella.martinez@email.com',
    phone: '555-369-1470',
    status: 'lead',
    lastInteraction: '2023-11-22',
    salesRep: 'Lucas Taylor',
  },
  {
    id: '5',
    name: 'James Anderson',
    email: 'james.anderson@email.com',
    phone: '555-789-0123',
    status: 'active',
    lastInteraction: '2023-11-05',
    salesRep: 'Mia Evans',
  },
];

const CustomersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const tabs: TabItem[] = [
    { id: 'all', label: 'All Customers' },
    { id: 'leads', label: 'Leads' },
    { id: 'active', label: 'Active Customers' },
  ];

  const filteredCustomers = React.useMemo(() => {
    let filtered = mockCustomers;

    // Filter by tab
    if (activeTab === 'leads') {
      filtered = filtered.filter((customer) => customer.status === 'lead');
    } else if (activeTab === 'active') {
      filtered = filtered.filter((customer) => customer.status === 'active');
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (customer) =>
          customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.phone.includes(searchTerm)
      );
    }

    return filtered;
  }, [activeTab, searchTerm]);

  const columns: Column<Customer>[] = [
    {
      key: 'name',
      header: 'Name',
      cell: (customer) => (
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
      cell: (customer) => (
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

  return (
    <DashboardLayout>
      <DashboardHeader
        title="Customers"
        actions={
          <button className="button_primary">New Customer</button>
        }
      />

      {/* Search */}
      <div className="mb-6">
        <SearchInput
          placeholder="Search customers"
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

      {/* Customer Table */}
      <DataTable
        columns={columns}
        data={filteredCustomers}
        keyExtractor={(customer) => customer.id}
        emptyMessage={
          searchTerm
            ? `No customers found matching "${searchTerm}"`
            : activeTab === 'leads'
            ? 'No leads found'
            : activeTab === 'active'
            ? 'No active customers found'
            : 'No customers found'
        }
        onRowClick={(customer) => {
          console.log('Customer clicked:', customer);
          // TODO: Navigate to customer details
        }}
      />
    </DashboardLayout>
  );
};

export default CustomersPage;