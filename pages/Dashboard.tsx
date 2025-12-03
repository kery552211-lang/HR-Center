import React from 'react';
import { useHR } from '../context/HRContext';
import { Users, Clock, CreditCard, TrendingUp, AlertCircle, Calendar, Wallet, Zap } from 'lucide-react';
import { LeaveStatus, PaymentStatus, UserRole } from '../types';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ title, value, icon, color, trend }: any) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
    <div>
      <p className="text-sm text-gray-500 font-medium">{title}</p>
      <h3 className="text-2xl font-bold text-gray-800 mt-1">{value}</h3>
      {trend && <p className="text-xs text-green-600 mt-1 flex items-center gap-1"><TrendingUp size={12}/> {trend}</p>}
    </div>
    <div className={`p-3 rounded-full ${color} text-white shadow-md`}>
      {icon}
    </div>
  </div>
);

const Dashboard = () => {
  const { employees, leaves, payrolls, user } = useHR();
  const isAdmin = user?.role === UserRole.ADMIN;
  const navigate = useNavigate();

  // Admin Stats
  const totalEmployees = employees.length;
  const pendingLeaves = leaves.filter(l => l.status === LeaveStatus.PENDING).length;
  const pendingPayroll = payrolls.filter(p => p.status === PaymentStatus.PENDING).length;
  
  // Employee Stats
  const myPendingLeaves = leaves.filter(l => l.employeeId === user?.id && l.status === LeaveStatus.PENDING).length;
  const myApprovedLeaves = leaves.filter(l => l.employeeId === user?.id && l.status === LeaveStatus.APPROVED).length;
  const myLatestPayroll = payrolls
    .filter(p => p.employeeId === user?.id && p.status === PaymentStatus.PAID)
    .sort((a, b) => new Date(b.month).getTime() - new Date(a.month).getTime())[0];

  // Recent activities (Admin sees all, Employee sees theirs)
  const recentLeaves = [...leaves]
    .filter(l => isAdmin ? true : l.employeeId === user?.id)
    .sort((a,b) => new Date(b.requestedOn).getTime() - new Date(a.requestedOn).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold text-slate-800">Welcome back, {user?.name}</h1>
            <p className="text-slate-500">
                {isAdmin ? "Here's what's happening at HR Central today." : "Here is your personal overview."}
            </p>
        </div>
        <div className="text-sm text-slate-500 bg-white px-4 py-2 rounded-lg border shadow-sm">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isAdmin ? (
            <>
                <StatCard 
                  title="Total Employees" 
                  value={totalEmployees} 
                  icon={<Users size={24} />} 
                  color="bg-blue-500" 
                  trend="+12% from last month"
                />
                <StatCard 
                  title="Pending Leaves" 
                  value={pendingLeaves} 
                  icon={<Clock size={24} />} 
                  color="bg-amber-500" 
                />
                <StatCard 
                  title="Pending Payrolls" 
                  value={pendingPayroll} 
                  icon={<CreditCard size={24} />} 
                  color="bg-emerald-500" 
                />
            </>
        ) : (
            <>
                <StatCard 
                  title="My Leave Balance" 
                  value="15 Days" 
                  icon={<Calendar size={24} />} 
                  color="bg-blue-500" 
                  trend="Annual Quota"
                />
                 <StatCard 
                  title="Pending Requests" 
                  value={myPendingLeaves} 
                  icon={<Clock size={24} />} 
                  color="bg-amber-500" 
                />
                <StatCard 
                  title="Last Net Salary" 
                  value={myLatestPayroll ? `$${myLatestPayroll.netSalary.toLocaleString()}` : '-'} 
                  icon={<Wallet size={24} />} 
                  color="bg-emerald-500" 
                  trend={myLatestPayroll ? `Paid on ${myLatestPayroll.paymentDate}` : ''}
                />
            </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Leave Requests */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-semibold text-lg text-slate-800">
                    {isAdmin ? 'Recent Leave Requests' : 'My Recent Requests'}
                </h3>
                <span className="text-xs font-medium bg-blue-50 text-blue-600 px-2 py-1 rounded">Last 5</span>
            </div>
            <div className="divide-y divide-gray-100">
                {recentLeaves.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">No recent requests</div>
                ) : (
                    recentLeaves.map(leave => (
                        <div key={leave.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">
                                    {leave.employeeName.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-800">{leave.employeeName}</p>
                                    <p className="text-xs text-slate-500">{leave.reason}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className={`text-xs px-2 py-1 rounded-full font-medium
                                    ${leave.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 
                                      leave.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 
                                      'bg-amber-100 text-amber-700'}`}>
                                    {leave.status}
                                </span>
                                <p className="text-xs text-slate-400 mt-1">{leave.startDate}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>

        {/* System Status / Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-lg text-slate-800 mb-4 flex items-center gap-2">
                {isAdmin ? <Zap size={20} className="text-amber-500"/> : <AlertCircle size={20} className="text-blue-500"/>}
                {isAdmin ? 'Quick Actions' : 'My Notifications'}
            </h3>
            
            {isAdmin ? (
                <div className="space-y-4">
                    <p className="text-sm text-gray-500">Manage your organization efficiently with these shortcuts.</p>
                    <div className="grid grid-cols-1 gap-3">
                            <button 
                                onClick={() => navigate('/employees')}
                                className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                            >
                                <Users size={16} /> Add / Manage Employees
                            </button>
                            <button 
                                onClick={() => navigate('/leaves')}
                                className="w-full bg-amber-50 hover:bg-amber-100 text-amber-700 py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                            >
                                <Clock size={16} /> Review Leave Requests
                            </button>
                             <button 
                                onClick={() => navigate('/payroll')}
                                className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                            >
                                <CreditCard size={16} /> Process Payroll
                            </button>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <h4 className="font-medium text-blue-900 text-sm">Profile Status</h4>
                        <p className="text-blue-700 text-xs mt-1">Your profile is active and up to date.</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                        <h4 className="font-medium text-green-900 text-sm">Next Payday</h4>
                        <p className="text-green-700 text-xs mt-1">Expected on the 25th of this month.</p>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;