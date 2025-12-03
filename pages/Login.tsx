import React, { useState } from 'react';
import { useHR } from '../context/HRContext';
import { Employee, UserRole } from '../types';
import { Lock, User, UserPlus, ArrowLeft } from 'lucide-react';

const Login = () => {
  const { login, registerEmployee, employees } = useHR();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.ADMIN);
  const [isRegistering, setIsRegistering] = useState(false);

  // Registration State
  const [regData, setRegData] = useState({
      firstName: '',
      lastName: '',
      email: '',
      password: '' // Dummy field
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, role);
  };

  const handleRegister = (e: React.FormEvent) => {
      e.preventDefault();
      // Check if email already exists
      if (employees.some(emp => emp.email.toLowerCase() === regData.email.toLowerCase())) {
          alert('An account with this email already exists.');
          return;
      }

      const newEmployee: Employee = {
          id: Math.random().toString(36).substr(2, 9),
          firstName: regData.firstName,
          lastName: regData.lastName,
          email: regData.email,
          position: 'Applicant / New Hire',
          department: 'Unassigned',
          salary: 0,
          hireDate: new Date().toISOString().split('T')[0],
          phone: '',
          address: '',
          status: 'Active',
          avatar: ''
      };

      registerEmployee(newEmployee);
  };

  if (isRegistering) {
      return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-blue-600 p-8 text-center relative">
                    <button onClick={() => setIsRegistering(false)} className="absolute left-4 top-8 text-white hover:bg-blue-700 p-2 rounded-full transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-2xl font-bold text-white mb-2">Create Account</h1>
                    <p className="text-blue-100 text-sm">Join HR Central as an Employee</p>
                </div>
                
                <form onSubmit={handleRegister} className="p-8 space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                            <input required type="text" className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                                value={regData.firstName} onChange={e => setRegData({...regData, firstName: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                            <input required type="text" className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                                value={regData.lastName} onChange={e => setRegData({...regData, lastName: e.target.value})} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input required type="email" className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                             value={regData.email} onChange={e => setRegData({...regData, email: e.target.value})} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input required type="password" className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                            value={regData.password} onChange={e => setRegData({...regData, password: e.target.value})} />
                        <p className="text-xs text-gray-400 mt-1">Passwords are not checked in this demo.</p>
                    </div>

                    <button 
                        type="submit" 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors shadow-lg shadow-blue-200"
                    >
                        Create Account
                    </button>
                </form>
            </div>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-slate-900 p-8 text-center">
                <h1 className="text-3xl font-bold text-white mb-2">HR Central</h1>
                <p className="text-slate-400">Enterprise Management System</p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Role</label>
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                        <button 
                            type="button"
                            onClick={() => setRole(UserRole.ADMIN)}
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${role === UserRole.ADMIN ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}
                        >
                            Admin
                        </button>
                        <button 
                            type="button"
                            onClick={() => setRole(UserRole.EMPLOYEE)}
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${role === UserRole.EMPLOYEE ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}
                        >
                            Employee
                        </button>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email / Username</label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
                        <input 
                            type="text" 
                            required 
                            placeholder={role === UserRole.ADMIN ? "Enter 'admin'" : "Enter employee email"}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
                        <input 
                            type="password" 
                            placeholder="••••••••"
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow"
                        />
                    </div>
                    <p className="text-xs text-gray-400 mt-1 text-right">Any password works for demo</p>
                </div>

                <div className="space-y-3">
                    <button 
                        type="submit" 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors shadow-lg shadow-blue-200"
                    >
                        Sign In
                    </button>
                    
                    {role === UserRole.EMPLOYEE && (
                        <button 
                            type="button"
                            onClick={() => setIsRegistering(true)}
                            className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            <UserPlus size={18} />
                            Create Account
                        </button>
                    )}
                </div>
                
                {role === UserRole.EMPLOYEE && (
                    <div className="text-center bg-blue-50 p-3 rounded text-xs text-blue-700 mt-2">
                        Tip: Use <b>sarah.c@hrcentral.com</b> to login as employee
                    </div>
                )}
            </form>
        </div>
    </div>
  );
};

export default Login;