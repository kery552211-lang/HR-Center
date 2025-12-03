import React, { useState } from 'react';
import { useHR } from '../context/HRContext';
import { Employee, UserRole } from '../types';
import { Search, Plus, Trash2, Edit2, Mail, MapPin, Briefcase, Camera, AlertTriangle, X } from 'lucide-react';

const Employees = () => {
  const { employees, addEmployee, updateEmployee, deleteEmployee, user } = useHR();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const isAdmin = user?.role === UserRole.ADMIN;

  // Form State
  const [formData, setFormData] = useState<Omit<Employee, 'id'>>({
    firstName: '',
    lastName: '',
    email: '',
    position: '',
    department: '',
    salary: 0,
    hireDate: '',
    phone: '',
    address: '',
    status: 'Active',
    avatar: ''
  });

  const handleOpenModal = (emp?: Employee) => {
    if (emp) {
      setEditingId(emp.id);
      setFormData(emp);
    } else {
      setEditingId(null);
      setFormData({
        firstName: '', lastName: '', email: '', position: '', department: '',
        salary: 0, hireDate: new Date().toISOString().split('T')[0], phone: '', address: '', status: 'Active', avatar: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateEmployee({ ...formData, id: editingId });
    } else {
      if (isAdmin) {
          addEmployee({ ...formData, id: Math.random().toString(36).substr(2, 9) });
      }
    }
    setIsModalOpen(false);
  };

  const handleDeleteClick = (id: string) => {
    if (!isAdmin) return;
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
        deleteEmployee(deleteId);
        setDeleteId(null);
    }
  };

  // If Admin: Show all filtered. If Employee: Show ONLY themselves.
  const visibleEmployees = isAdmin 
    ? employees 
    : employees.filter(e => e.id === user?.id);

  const filteredEmployees = visibleEmployees.filter(e => 
    e.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-2xl font-bold text-slate-800">
                {isAdmin ? "Employee Management" : "My Profile"}
            </h1>
            <p className="text-slate-500 text-sm">
                {isAdmin ? "Manage your workforce, profiles, and roles." : "View and update your personal information."}
            </p>
        </div>
        {isAdmin && (
            <button 
            onClick={() => handleOpenModal()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
            >
            <Plus size={18} />
            Add Employee
            </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {isAdmin && (
            <div className="p-4 border-b border-gray-100 flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                type="text" 
                placeholder="Search by name or department..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">Position</th>
                <th className="p-4 font-semibold">Department</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredEmployees.map(emp => (
                <tr key={emp.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {emp.avatar ? (
                        <img 
                            src={emp.avatar} 
                            alt={`${emp.firstName} ${emp.lastName}`} 
                            className="w-10 h-10 rounded-full object-cover border border-gray-200"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                            {emp.firstName.charAt(0)}{emp.lastName.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-slate-800">{emp.firstName} {emp.lastName}</p>
                        <p className="text-xs text-slate-500">{emp.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                        <Briefcase size={14} className="text-gray-400"/>
                        {emp.position}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-slate-600">
                    <span className="inline-block px-2 py-1 bg-slate-100 rounded text-xs font-medium">
                        {emp.department}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${emp.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {emp.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-100">
                      {isAdmin && (
                          <a 
                            href={`mailto:${emp.email}`}
                            className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                            title="Send Email"
                          >
                            <Mail size={16} />
                          </a>
                      )}
                      <button 
                        onClick={() => handleOpenModal(emp)}
                        className="p-2 hover:bg-amber-50 text-amber-600 rounded-lg transition-colors"
                        title="Edit Details"
                      >
                        <Edit2 size={16} />
                      </button>
                      {isAdmin && (
                          <button 
                            onClick={() => handleDeleteClick(emp.id)}
                            className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                            title="Delete Employee"
                          >
                            <Trash2 size={16} />
                          </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredEmployees.length === 0 && (
            <div className="p-8 text-center text-gray-500">
                {isAdmin ? "No employees found matching your search." : "Profile not found."}
            </div>
          )}
        </div>
      </div>

      {/* Edit/Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold text-slate-800">
                {editingId ? (isAdmin ? 'Edit Employee' : 'Edit My Profile') : 'New Employee'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[80vh] overflow-y-auto">
              
              <div className="md:col-span-2 flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {formData.avatar ? (
                          <img src={formData.avatar} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                          <Camera className="text-gray-400" />
                      )}
                  </div>
                  <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Avatar URL</label>
                      <input type="text" placeholder="https://..." className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm" 
                        value={formData.avatar || ''} onChange={e => setFormData({...formData, avatar: e.target.value})} />
                  </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input required type="text" className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                  value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} 
                  disabled={!isAdmin} title={!isAdmin ? "Contact Admin to change name" : ""}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input required type="text" className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                  value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} 
                  disabled={!isAdmin} title={!isAdmin ? "Contact Admin to change name" : ""}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input required type="email" className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                  value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} 
                  disabled={!isAdmin} title={!isAdmin ? "Contact Admin to change email" : ""}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input required type="text" className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                  value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <select className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})}
                  disabled={!isAdmin}
                >
                    <option value="">Select Dept</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Design">Design</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="Unassigned">Unassigned</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                <input required type="text" className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                  value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} 
                  disabled={!isAdmin}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Annual Salary ($)</label>
                <input required type="number" className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50" 
                    value={formData.salary} onChange={e => setFormData({...formData, salary: parseInt(e.target.value)})} 
                    disabled={!isAdmin} title={!isAdmin ? "Read-only" : ""}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hire Date</label>
                <input required type="date" className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                  value={formData.hireDate} onChange={e => setFormData({...formData, hireDate: e.target.value})} 
                  disabled={!isAdmin}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input required type="text" className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                  value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
              </div>
              
              <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                    Cancel
                </button>
                <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-md">
                    {editingId ? 'Save Changes' : 'Create Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setDeleteId(null)}></div>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm relative z-10 p-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4 text-red-600">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Delete Employee?</h3>
              <p className="text-slate-500 text-sm mb-6">
                Are you sure you want to delete this employee? This action cannot be undone.
              </p>
              <div className="flex gap-3 w-full">
                <button 
                  onClick={() => setDeleteId(null)}
                  className="flex-1 py-2.5 text-slate-700 font-medium bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 py-2.5 text-white font-medium bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-md"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;