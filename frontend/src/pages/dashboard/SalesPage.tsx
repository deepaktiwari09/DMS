import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout';
import { DashboardHeader } from '../../components/layout/DashboardHeader';
import { DataTable, StatusBadge, TabNavigation } from '../../components/ui';
import type { Column } from '../../components/ui/DataTable';
import type { TabItem } from '../../components/ui/TabNavigation';
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

interface SalesOpportunity {
  id: string;
  customer: string;
  vehicle: string;
  value: number;
  stage: 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  probability: number;
  expectedCloseDate: string;
  salesRep: string;
}

interface Sale {
  id: string;
  saleNumber: string;
  customer: string;
  vehicle: string;
  amount: number;
  date: string;
  status: 'pending' | 'completed' | 'cancelled';
  salesRep: string;
}

// Mock data
const mockOpportunities: SalesOpportunity[] = [
  {
    id: '1',
    customer: 'John Smith',
    vehicle: 'Yamaha R6 2024',
    value: 12999,
    stage: 'proposal',
    probability: 75,
    expectedCloseDate: '2024-01-15',
    salesRep: 'Sarah Johnson',
  },
  {
    id: '2',
    customer: 'Emily Davis',
    vehicle: 'Honda CBR1000RR',
    value: 16999,
    stage: 'negotiation',
    probability: 85,
    expectedCloseDate: '2024-01-10',
    salesRep: 'Mike Wilson',
  },
  {
    id: '3',
    customer: 'Robert Brown',
    vehicle: 'Kawasaki Ninja ZX-10R',
    value: 18999,
    stage: 'qualified',
    probability: 60,
    expectedCloseDate: '2024-01-20',
    salesRep: 'Lisa Chen',
  },
];

const mockSales: Sale[] = [
  {
    id: '1',
    saleNumber: 'SALE-001',
    customer: 'Michael Johnson',
    vehicle: 'Yamaha YZF-R1',
    amount: 19999,
    date: '2024-01-05',
    status: 'completed',
    salesRep: 'Sarah Johnson',
  },
  {
    id: '2',
    saleNumber: 'SALE-002',
    customer: 'Jessica Wilson',
    vehicle: 'Honda CBR650R',
    amount: 9999,
    date: '2024-01-03',
    status: 'completed',
    salesRep: 'Mike Wilson',
  },
  {
    id: '3',
    saleNumber: 'SALE-003',
    customer: 'David Lee',
    vehicle: 'Suzuki GSX-R750',
    amount: 13499,
    date: '2024-01-07',
    status: 'pending',
    salesRep: 'Lisa Chen',
  },
];

const SalesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('pipeline');

  const tabs: TabItem[] = [
    {
      id: 'pipeline',
      label: 'Sales Pipeline',
      icon: ChartBarIcon,
    },
    {
      id: 'sales',
      label: 'Sales Records',
      icon: CurrencyDollarIcon,
    },
    {
      id: 'reps',
      label: 'Sales Reps',
      icon: UserGroupIcon,
    },
  ];

  const getStageStatus = (stage: string) => {
    switch (stage) {
      case 'lead':
        return 'lead';
      case 'qualified':
        return 'pending';
      case 'proposal':
        return 'in-progress';
      case 'negotiation':
        return 'in-progress';
      case 'closed-won':
        return 'completed';
      case 'closed-lost':
        return 'pending';
      default:
        return 'pending';
    }
  };

  const opportunityColumns: Column<SalesOpportunity>[] = [
    {
      key: 'customer',
      header: 'Customer',
      cell: (opportunity) => (
        <span className="font-medium text-[var(--text-primary)]">
          {opportunity.customer}
        </span>
      ),
    },
    { key: 'vehicle', header: 'Vehicle' },
    {
      key: 'value',
      header: 'Value',
      cell: (opportunity) => `$${opportunity.value.toLocaleString()}`,
    },
    {
      key: 'stage',
      header: 'Stage',
      cell: (opportunity) => (
        <StatusBadge status={getStageStatus(opportunity.stage)}>
          {opportunity.stage.charAt(0).toUpperCase() + opportunity.stage.slice(1).replace('-', ' ')}
        </StatusBadge>
      ),
    },
    {
      key: 'probability',
      header: 'Probability',
      cell: (opportunity) => `${opportunity.probability}%`,
    },
    { 
      key: 'expectedCloseDate', 
      header: 'Expected Close',
    },
    { key: 'salesRep', header: 'Sales Rep' },
  ];

  const salesColumns: Column<Sale>[] = [
    { key: 'saleNumber', header: 'Sale #' },
    {
      key: 'customer',
      header: 'Customer',
      cell: (sale) => (
        <span className="font-medium text-[var(--text-primary)]">
          {sale.customer}
        </span>
      ),
    },
    { key: 'vehicle', header: 'Vehicle' },
    {
      key: 'amount',
      header: 'Amount',
      cell: (sale) => `$${sale.amount.toLocaleString()}`,
    },
    { key: 'date', header: 'Date' },
    {
      key: 'status',
      header: 'Status',
      cell: (sale) => {
        const statusMap = {
          pending: 'pending' as const,
          completed: 'completed' as const,
          cancelled: 'pending' as const, // Map cancelled to pending style
        };
        return (
          <StatusBadge status={statusMap[sale.status]}>
            {sale.status.charAt(0).toUpperCase() + sale.status.slice(1)}
          </StatusBadge>
        );
      },
    },
    { key: 'salesRep', header: 'Sales Rep' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'pipeline':
        return (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="text-sm font-medium text-gray-500">Total Opportunities</h3>
                <p className="text-2xl font-bold text-[var(--text-primary)]">{mockOpportunities.length}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="text-sm font-medium text-gray-500">Pipeline Value</h3>
                <p className="text-2xl font-bold text-[var(--text-primary)]">
                  ${mockOpportunities.reduce((sum, opp) => sum + opp.value, 0).toLocaleString()}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="text-sm font-medium text-gray-500">Avg. Deal Size</h3>
                <p className="text-2xl font-bold text-[var(--text-primary)]">
                  ${Math.round(mockOpportunities.reduce((sum, opp) => sum + opp.value, 0) / mockOpportunities.length).toLocaleString()}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="text-sm font-medium text-gray-500">Close Rate</h3>
                <p className="text-2xl font-bold text-[var(--text-primary)]">68%</p>
              </div>
            </div>
            <DataTable
              columns={opportunityColumns}
              data={mockOpportunities}
              keyExtractor={(opportunity) => opportunity.id}
            />
          </div>
        );
      case 'sales':
        return (
          <DataTable
            columns={salesColumns}
            data={mockSales}
            keyExtractor={(sale) => sale.id}
          />
        );
      case 'reps':
        return (
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <p className="text-[var(--text-secondary)]">
              Sales Rep performance metrics coming soon...
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <DashboardHeader
        title="Sales Management"
        actions={
          <div className="flex gap-3">
            <button className="button_secondary">Import Leads</button>
            <button className="button_primary">New Opportunity</button>
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

export default SalesPage;