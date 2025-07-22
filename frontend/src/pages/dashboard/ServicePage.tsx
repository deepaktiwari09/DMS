import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout';
import { DashboardHeader } from '../../components/layout/DashboardHeader';
import { DataTable, StatusBadge, TabNavigation } from '../../components/ui';
import type { Column } from '../../components/ui/DataTable';
import type { TabItem } from '../../components/ui/TabNavigation';
import {
  CalendarIcon,
  DocumentTextIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';

interface ServiceAppointment {
  id: string;
  date: string;
  time: string;
  customer: string;
  vehicle: string;
  serviceType: string;
  technician: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'awaiting-parts';
}

interface JobCard {
  id: string;
  jobCardNumber: string;
  customer: string;
  vehicle: string;
  serviceType: string;
  technician: string;
  status: 'in-progress' | 'completed' | 'awaiting-parts';
}

interface Technician {
  id: string;
  technicianId: string;
  name: string;
  specialization: string;
  currentLoad: string;
  status: 'available' | 'busy';
}

// Mock data
const mockAppointments: ServiceAppointment[] = [
  {
    id: '1',
    date: '2024-07-25',
    time: '09:00 AM',
    customer: 'Ethan Carter',
    vehicle: 'Yamaha R6',
    serviceType: 'Oil Change',
    technician: 'Mike Miller',
    status: 'scheduled',
  },
  {
    id: '2',
    date: '2024-07-25',
    time: '11:00 AM',
    customer: 'Olivia Bennett',
    vehicle: 'Honda CBR500R',
    serviceType: 'Tire Replacement',
    technician: 'Sarah Chen',
    status: 'scheduled',
  },
  {
    id: '3',
    date: '2024-07-26',
    time: '02:00 PM',
    customer: 'Noah Thompson',
    vehicle: 'Kawasaki Ninja 400',
    serviceType: 'Brake Service',
    technician: 'David Rodriguez',
    status: 'scheduled',
  },
];

const mockJobCards: JobCard[] = [
  {
    id: '1',
    jobCardNumber: 'JC-001',
    customer: 'Ethan Carter',
    vehicle: 'Yamaha R6',
    serviceType: 'Oil Change',
    technician: 'Mike Miller',
    status: 'in-progress',
  },
  {
    id: '2',
    jobCardNumber: 'JC-002',
    customer: 'Olivia Bennett',
    vehicle: 'Honda CBR500R',
    serviceType: 'Tire Replacement',
    technician: 'Sarah Chen',
    status: 'completed',
  },
  {
    id: '3',
    jobCardNumber: 'JC-003',
    customer: 'Noah Thompson',
    vehicle: 'Kawasaki Ninja 400',
    serviceType: 'Brake Service',
    technician: 'David Rodriguez',
    status: 'awaiting-parts',
  },
];

const mockTechnicians: Technician[] = [
  {
    id: '1',
    technicianId: 'T-001',
    name: 'Mike Miller',
    specialization: 'Engine & Transmission',
    currentLoad: '2 Active Jobs',
    status: 'available',
  },
  {
    id: '2',
    technicianId: 'T-002',
    name: 'Sarah Chen',
    specialization: 'Tires & Brakes',
    currentLoad: '1 Active Job',
    status: 'available',
  },
  {
    id: '3',
    technicianId: 'T-003',
    name: 'David Rodriguez',
    specialization: 'Electrical Systems',
    currentLoad: '3 Active Jobs',
    status: 'busy',
  },
];

const ServicePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('schedule');

  const tabs: TabItem[] = [
    {
      id: 'schedule',
      label: 'Service Schedule',
      icon: CalendarIcon,
    },
    {
      id: 'job_cards',
      label: 'Job Cards',
      icon: DocumentTextIcon,
    },
    {
      id: 'technicians',
      label: 'Technicians',
      icon: UsersIcon,
    },
  ];

  const appointmentColumns: Column<ServiceAppointment>[] = [
    { key: 'date', header: 'Date' },
    { key: 'time', header: 'Time' },
    {
      key: 'customer',
      header: 'Customer',
      cell: (appointment) => (
        <span className="font-medium text-[var(--text-primary)]">
          {appointment.customer}
        </span>
      ),
    },
    { key: 'vehicle', header: 'Vehicle' },
    { key: 'serviceType', header: 'Service Type' },
    { key: 'technician', header: 'Technician' },
    {
      key: 'status',
      header: 'Status',
      cell: (appointment) => (
        <StatusBadge status={appointment.status}>
          {appointment.status === 'scheduled'
            ? 'Scheduled'
            : appointment.status === 'in-progress'
            ? 'In Progress'
            : appointment.status === 'completed'
            ? 'Completed'
            : 'Awaiting Parts'}
        </StatusBadge>
      ),
    },
  ];

  const jobCardColumns: Column<JobCard>[] = [
    { key: 'jobCardNumber', header: 'Job Card #' },
    {
      key: 'customer',
      header: 'Customer',
      cell: (jobCard) => (
        <span className="font-medium text-[var(--text-primary)]">
          {jobCard.customer}
        </span>
      ),
    },
    { key: 'vehicle', header: 'Vehicle' },
    { key: 'serviceType', header: 'Service Type' },
    { key: 'technician', header: 'Technician' },
    {
      key: 'status',
      header: 'Status',
      cell: (jobCard) => (
        <StatusBadge status={jobCard.status}>
          {jobCard.status === 'in-progress'
            ? 'In Progress'
            : jobCard.status === 'completed'
            ? 'Completed'
            : 'Awaiting Parts'}
        </StatusBadge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      cell: () => (
        <div className="flex gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <svg
              className="text-gray-500"
              fill="none"
              height="20"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="20"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <svg
              className="text-gray-500"
              fill="none"
              height="20"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="20"
            >
              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
            </svg>
          </button>
        </div>
      ),
    },
  ];

  const technicianColumns: Column<Technician>[] = [
    { key: 'technicianId', header: 'Technician ID' },
    {
      key: 'name',
      header: 'Name',
      cell: (technician) => (
        <span className="font-medium text-[var(--text-primary)]">
          {technician.name}
        </span>
      ),
    },
    { key: 'specialization', header: 'Specialization' },
    { key: 'currentLoad', header: 'Current Load' },
    {
      key: 'status',
      header: 'Status',
      cell: (technician) => (
        <StatusBadge status={technician.status}>
          {technician.status === 'available' ? 'Available' : 'Busy'}
        </StatusBadge>
      ),
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'schedule':
        return (
          <DataTable
            columns={appointmentColumns}
            data={mockAppointments}
            keyExtractor={(appointment) => appointment.id}
          />
        );
      case 'job_cards':
        return (
          <DataTable
            columns={jobCardColumns}
            data={mockJobCards}
            keyExtractor={(jobCard) => jobCard.id}
          />
        );
      case 'technicians':
        return (
          <DataTable
            columns={technicianColumns}
            data={mockTechnicians}
            keyExtractor={(technician) => technician.id}
          />
        );
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <DashboardHeader
        title="Service Management"
        actions={
          <button className="button_primary">New Job Card</button>
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

export default ServicePage;