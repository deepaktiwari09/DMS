import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout';
import { DashboardHeader } from '../../components/layout/DashboardHeader';
import { DataTable, StatusBadge, TabNavigation } from '../../components/ui';
import type { Column } from '../../components/ui/DataTable';
import type { TabItem } from '../../components/ui/TabNavigation';
import {
  DocumentTextIcon,
  ChartBarIcon,
  CogIcon,
} from '@heroicons/react/24/outline';

interface Invoice {
  id: string;
  invoiceNumber: string;
  customer: string;
  amount: number;
  date: string;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
}

// Mock data
const mockInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2024-001',
    customer: 'John Smith',
    amount: 12999.99,
    date: '2024-01-01',
    dueDate: '2024-01-31',
    status: 'paid',
  },
  {
    id: '2',
    invoiceNumber: 'INV-2024-002',
    customer: 'Emily Davis',
    amount: 8750.00,
    date: '2024-01-05',
    dueDate: '2024-02-05',
    status: 'pending',
  },
  {
    id: '3',
    invoiceNumber: 'INV-2024-003',
    customer: 'Michael Johnson',
    amount: 15299.99,
    date: '2023-12-15',
    dueDate: '2024-01-15',
    status: 'overdue',
  },
];

const FinancePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('invoicing');

  const tabs: TabItem[] = [
    {
      id: 'invoicing',
      label: 'Invoicing',
      icon: DocumentTextIcon,
    },
    {
      id: 'reports',
      label: 'Financial Reports',
      icon: ChartBarIcon,
    },
    {
      id: 'integration',
      label: 'Accounting Integration',
      icon: CogIcon,
    },
  ];

  const invoiceColumns: Column<Invoice>[] = [
    { key: 'invoiceNumber', header: 'Invoice #' },
    {
      key: 'customer',
      header: 'Customer',
      cell: (invoice) => (
        <span className="font-medium text-[var(--text-primary)]">
          {invoice.customer}
        </span>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      cell: (invoice) => `$${invoice.amount.toLocaleString()}`,
    },
    { key: 'date', header: 'Invoice Date' },
    { key: 'dueDate', header: 'Due Date' },
    {
      key: 'status',
      header: 'Status',
      cell: (invoice) => {
        const statusMap = {
          paid: 'completed' as const,
          pending: 'pending' as const,
          overdue: 'pending' as const, // Map overdue to pending style with red appearance
        };
        return (
          <StatusBadge 
            status={statusMap[invoice.status]}
            className={invoice.status === 'overdue' ? 'bg-red-100 text-red-800' : ''}
          >
            {invoice.status === 'paid' ? 'Paid' : 
             invoice.status === 'pending' ? 'Pending' : 'Overdue'}
          </StatusBadge>
        );
      },
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'invoicing':
        return (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="text-sm font-medium text-gray-500">Total Outstanding</h3>
                <p className="text-2xl font-bold text-[var(--text-primary)]">
                  ${mockInvoices.filter(i => i.status !== 'paid').reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="text-sm font-medium text-gray-500">This Month</h3>
                <p className="text-2xl font-bold text-[var(--text-primary)]">
                  ${mockInvoices.reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="text-sm font-medium text-gray-500">Overdue</h3>
                <p className="text-2xl font-bold text-red-600">
                  ${mockInvoices.filter(i => i.status === 'overdue').reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()}
                </p>
              </div>
            </div>
            <DataTable
              columns={invoiceColumns}
              data={mockInvoices}
              keyExtractor={(invoice) => invoice.id}
            />
          </div>
        );
      case 'reports':
        return (
          <div className="bg-white p-8 rounded-lg shadow-sm text-center">
            <ChartBarIcon className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">
              Financial Reports
            </h3>
            <p className="text-[var(--text-secondary)]">
              Financial reporting dashboard coming soon. View profit & loss, cash flow, and revenue analytics.
            </p>
          </div>
        );
      case 'integration':
        return (
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4">
              Accounting Software Integration
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 p-4 rounded-lg">
                <h4 className="font-medium mb-2">QuickBooks</h4>
                <p className="text-sm text-[var(--text-secondary)] mb-3">
                  Sync invoices and payments with QuickBooks Online
                </p>
                <button className="button_secondary text-sm">Connect QuickBooks</button>
              </div>
              <div className="border border-gray-200 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Xero</h4>
                <p className="text-sm text-[var(--text-secondary)] mb-3">
                  Automatic synchronization with Xero accounting
                </p>
                <button className="button_secondary text-sm">Connect Xero</button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <DashboardHeader
        title="Financial Management"
        actions={
          <div className="flex gap-3">
            <button className="button_secondary">Export Data</button>
            <button className="button_primary">Create Invoice</button>
          </div>
        }
      />

      {/* Tabs */}
      <div className="mb-8">
        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </DashboardLayout>
  );
};

export default FinancePage;