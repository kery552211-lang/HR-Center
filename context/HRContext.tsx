import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Employee, LeaveRequest, PayrollRecord, User, UserRole, LeaveStatus, PaymentStatus } from '../types';
import { StorageService } from '../services/storageService';

interface HRContextType {
  user: User | null;
  employees: Employee[];
  leaves: LeaveRequest[];
  payrolls: PayrollRecord[];
  login: (email: string, role: UserRole) => void;
  logout: () => void;
  registerEmployee: (emp: Employee) => void;
  addEmployee: (emp: Employee) => void;
  updateEmployee: (emp: Employee) => void;
  deleteEmployee: (id: string) => void;
  addLeaveRequest: (leave: LeaveRequest) => void;
  updateLeaveStatus: (id: string, status: LeaveStatus) => void;
  generatePayroll: (records: PayrollRecord[]) => void;
  markPayrollPaid: (id: string) => void;
}

const HRContext = createContext<HRContextType | undefined>(undefined);

export const HRProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [payrolls, setPayrolls] = useState<PayrollRecord[]>([]);

  // Load initial data
  useEffect(() => {
    setEmployees(StorageService.getEmployees());
    setLeaves(StorageService.getLeaves());
    setPayrolls(StorageService.getPayrolls());
    
    // Check for existing session (mock)
    const storedUser = localStorage.getItem('hr_central_user');
    if (storedUser) {
        setUser(JSON.parse(storedUser));
    }
  }, []);

  // Save changes
  useEffect(() => {
    StorageService.saveEmployees(employees);
  }, [employees]);

  useEffect(() => {
    StorageService.saveLeaves(leaves);
  }, [leaves]);

  useEffect(() => {
    StorageService.savePayrolls(payrolls);
  }, [payrolls]);

  const login = (email: string, role: UserRole) => {
    const normalizedEmail = email.trim().toLowerCase();
    
    let userData: User;
    if (role === UserRole.ADMIN) {
        userData = { id: 'admin', name: 'Administrator', email: normalizedEmail, role };
    } else {
        const emp = employees.find(e => e.email.toLowerCase() === normalizedEmail);
        if (!emp) {
            alert(`Employee not found with email: ${email}\n\nTip: Try 'sarah.c@hrcentral.com'`);
            return;
        }
        userData = { id: emp.id, name: `${emp.firstName} ${emp.lastName}`, email: emp.email, role };
    }
    setUser(userData);
    localStorage.setItem('hr_central_user', JSON.stringify(userData));
  };

  const registerEmployee = (emp: Employee) => {
    setEmployees(prev => [...prev, emp]);
    const userData: User = { 
        id: emp.id, 
        name: `${emp.firstName} ${emp.lastName}`, 
        email: emp.email, 
        role: UserRole.EMPLOYEE 
    };
    setUser(userData);
    localStorage.setItem('hr_central_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hr_central_user');
  };

  const addEmployee = (emp: Employee) => {
    setEmployees(prev => [...prev, emp]);
  };

  const updateEmployee = (emp: Employee) => {
    setEmployees(prev => prev.map(e => e.id === emp.id ? emp : e));
  };

  const deleteEmployee = (id: string) => {
    setEmployees(prev => prev.filter(e => e.id !== id));
  };

  const addLeaveRequest = (leave: LeaveRequest) => {
    setLeaves(prev => [leave, ...prev]);
  };

  const updateLeaveStatus = (id: string, status: LeaveStatus) => {
    setLeaves(prev => prev.map(l => l.id === id ? { ...l, status } : l));
  };

  const generatePayroll = (records: PayrollRecord[]) => {
    setPayrolls(prev => [...prev, ...records]);
  };

  const markPayrollPaid = (id: string) => {
    setPayrolls(prev => prev.map(p => p.id === id ? { ...p, status: PaymentStatus.PAID, paymentDate: new Date().toISOString().split('T')[0] } : p));
  };

  return (
    <HRContext.Provider value={{
      user, employees, leaves, payrolls,
      login, logout, registerEmployee,
      addEmployee, updateEmployee, deleteEmployee,
      addLeaveRequest, updateLeaveStatus,
      generatePayroll, markPayrollPaid
    }}>
      {children}
    </HRContext.Provider>
  );
};

export const useHR = () => {
  const context = useContext(HRContext);
  if (!context) throw new Error("useHR must be used within HRProvider");
  return context;
};