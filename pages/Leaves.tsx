import React, { useState } from 'react';
import { useHR } from '../context/HRContext';
import { LeaveStatus, LeaveRequest, UserRole } from '../types';
import { CheckCircle, XCircle, Clock, Plus } from 'lucide-react';

const Leaves = () => {
  const { leaves, employees, addLeaveRequest, updateLeaveStatus, user } = useHR();
  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    reason: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    // In a real app, admin could request for others, but here we assume self-request for simplicity unless admin selects user.
    // Let's assume user is requesting for themselves or if Admin, for the first employee just for demo.
    const empId = user.role === UserRole.ADMIN ? employees[0]?.id : user.id;
    const empName = user.role === UserRole.ADMIN ? (employees[0]?.firstName + ' ' + employees[0]?.lastName) : user.name;

    const newLeave: LeaveRequest = {
      id: Math.random().toString(36).substr(2, 9),
      employeeId: empId,
      employeeName: empName,
      startDate: formData.startDate,
      endDate: formData.endDate,
      reason: formData.reason,
      status: LeaveStatus.PENDING,
      requestedOn: new Date().toISOString().split('T')[0]
    };

    addLeaveRequest(newLeave);
    setIsModalOpen(false);
    setFormData({ startDate: '', endDate: '', reason: '' });
  };

  const filteredLeaves = activeTab === 'pending' 
    ? leaves.filter(l => l.status === LeaveStatus.PENDING)
    : leaves.filter(l => l.status !== LeaveStatus.PENDING);

  // Filter for employee view: only show their own leaves
  const displayedLeaves = user?.role === UserRole.ADMIN 
    ? filteredLeaves 
    : filteredLeaves.filter(l => l.employeeId === user?.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-2xl font-bold text-slate-800">Leave Management</h1>
            <p className="text-slate-500 text-sm">Track time off and approvals.</p>
        </div>
        <div className="flex gap-2">
            <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
            >
            <Plus size={18} />
            Request Leave
            </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-100">
            <button 
                className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'pending' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('pending')}
            >
                Pending Requests
            </button>
            <button 
                className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'history' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('history')}
            >
                History
            </button>
        </div>

        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
                    <tr>
                        <th className="p-4">Employee</th>
                        <th className="p-4">Dates</th>
                        <th className="p-4">Reason</th>
                        <th className="p-4">Requested On</th>
                        <th className="p-4">Status</th>
                        {user?.role === UserRole.ADMIN && activeTab === 'pending' && <th className="p-4 text-right">Actions</th>}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {displayedLeaves.map(leave => (
                        <tr key={leave.id} className="hover:bg-gray-50">
                            <td className="p-4 font-medium text-slate-800">{leave.employeeName}</td>
                            <td className="p-4 text-sm text-slate-600">
                                {leave.startDate} <span className="text-gray-400 mx-1">to</span> {leave.endDate}
                            </td>
                            <td className="p-4 text-sm text-slate-600">{leave.reason}</td>
                            <td className="p-4 text-sm text-slate-500">{leave.requestedOn}</td>
                            <td className="p-4">
                                <span className={`text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1 w-fit
                                    ${leave.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 
                                      leave.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 
                                      'bg-amber-100 text-amber-700'}`}>
                                    {leave.status === 'APPROVED' && <CheckCircle size={12}/>}
                                    {leave.status === 'REJECTED' && <XCircle size={12}/>}
                                    {leave.status === 'PENDING' && <Clock size={12}/>}
                                    {leave.status}
                                </span>
                            </td>
                            {user?.role === UserRole.ADMIN && activeTab === 'pending' && (
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button 
                                            onClick={() => updateLeaveStatus(leave.id, LeaveStatus.APPROVED)}
                                            className="text-green-600 hover:bg-green-50 p-2 rounded transition-colors"
                                            title="Approve"
                                        >
                                            <CheckCircle size={18} />
                                        </button>
                                        <button 
                                            onClick={() => updateLeaveStatus(leave.id, LeaveStatus.REJECTED)}
                                            className="text-red-600 hover:bg-red-50 p-2 rounded transition-colors"
                                            title="Reject"
                                        >
                                            <XCircle size={18} />
                                        </button>
                                    </div>
                                </td>
                            )}
                        </tr>
                    ))}
                    {displayedLeaves.length === 0 && (
                        <tr>
                            <td colSpan={6} className="p-8 text-center text-gray-500">
                                No {activeTab} leaves found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>

       {/* Request Modal */}
       {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md relative z-10 p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Request Time Off</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input required type="date" className="w-full border rounded-lg p-2" 
                        value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input required type="date" className="w-full border rounded-lg p-2" 
                        value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                    <textarea required className="w-full border rounded-lg p-2" rows={3}
                        value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})} />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">Cancel</button>
                    <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Submit Request</button>
                </div>
            </form>
          </div>
        </div>
       )}
    </div>
  );
};

export default Leaves;