import { Employee, LeaveRequest, PayrollRecord, LeaveStatus, PaymentStatus } from '../types';

const STORAGE_KEYS = {
  EMPLOYEES: 'hr_central_employees',
  LEAVES: 'hr_central_leaves',
  PAYROLLS: 'hr_central_payrolls',
  USER: 'hr_central_user'
};

const MOCK_EMPLOYEES: Employee[] = [
  {
    id: '1',
    firstName: 'Sarah',
    lastName: 'Connor',
    email: 'sarah.c@hrcentral.com',
    position: 'Senior Engineer',
    department: 'Engineering',
    salary: 85000,
    hireDate: '2023-01-15',
    phone: '555-0101',
    address: '123 Tech Blvd, Silicon Valley',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150'
  },
  {
    id: '2',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.s@hrcentral.com',
    position: 'HR Manager',
    department: 'Human Resources',
    salary: 65000,
    hireDate: '2022-11-01',
    phone: '555-0102',
    address: '456 People Way, New York',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150'
  },
  {
    id: '3',
    firstName: 'Emily',
    lastName: 'Chen',
    email: 'emily.c@hrcentral.com',
    position: 'Product Designer',
    department: 'Design',
    salary: 72000,
    hireDate: '2023-03-20',
    phone: '555-0103',
    address: '789 Creative Ln, San Francisco',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150&h=150'
  }
];

const MOCK_LEAVES: LeaveRequest[] = [
  {
    id: 'l1',
    employeeId: '1',
    employeeName: 'Sarah Connor',
    startDate: '2023-11-10',
    endDate: '2023-11-12',
    reason: 'Medical checkup',
    status: LeaveStatus.APPROVED,
    requestedOn: '2023-11-01'
  },
  {
    id: 'l2',
    employeeId: '3',
    employeeName: 'Emily Chen',
    startDate: '2023-12-24',
    endDate: '2024-01-02',
    reason: 'Winter holidays',
    status: LeaveStatus.PENDING,
    requestedOn: '2023-12-01'
  }
];

export const StorageService = {
  getEmployees: (): Employee[] => {
    const data = localStorage.getItem(STORAGE_KEYS.EMPLOYEES);
    return data ? JSON.parse(data) : MOCK_EMPLOYEES;
  },

  saveEmployees: (employees: Employee[]) => {
    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));
  },

  getLeaves: (): LeaveRequest[] => {
    const data = localStorage.getItem(STORAGE_KEYS.LEAVES);
    return data ? JSON.parse(data) : MOCK_LEAVES;
  },

  saveLeaves: (leaves: LeaveRequest[]) => {
    localStorage.setItem(STORAGE_KEYS.LEAVES, JSON.stringify(leaves));
  },

  getPayrolls: (): PayrollRecord[] => {
    const data = localStorage.getItem(STORAGE_KEYS.PAYROLLS);
    return data ? JSON.parse(data) : [];
  },

  savePayrolls: (payrolls: PayrollRecord[]) => {
    localStorage.setItem(STORAGE_KEYS.PAYROLLS, JSON.stringify(payrolls));
  },

  clearAll: () => {
    localStorage.clear();
    window.location.reload();
  }
};