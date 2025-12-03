import React, { useState } from 'react';
import { useHR } from '../context/HRContext';
import { PaymentStatus, PayrollRecord, UserRole } from '../types';
import { Download, Check, Play, FileText, Lock } from 'lucide-react';

const Payroll = () => {
  const { employees, payrolls, generatePayroll, markPayrollPaid, user } = useHR();
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
  const isAdmin = user?.role === UserRole.ADMIN;

  const handleGenerate = () => {
    if (!isAdmin) return;
    // Check if payroll already exists for this month
    const exists = payrolls.some(p => p.month === selectedMonth);
    if (exists) {
        if (!confirm(`Payroll for ${selectedMonth} already contains records. Generate remaining or duplicate?`)) return;
    }

    const newRecords: PayrollRecord[] = employees.map(emp => {
        // Simple calculation logic
        const basic = emp.salary / 12;
        const deductions = basic * 0.15; // Tax, insurance etc
        const bonus = 0; // Could be dynamic
        return {
            id: Math.random().toString(36).substr(2, 9),
            employeeId: emp.id,
            employeeName: `${emp.firstName} ${emp.lastName}`,
            month: selectedMonth,
            basicSalary: basic,
            bonus: bonus,
            deductions: deductions,
            netSalary: basic + bonus - deductions,
            status: PaymentStatus.PENDING
        };
    });

    generatePayroll(newRecords);
  };

  const handleExportCSV = () => {
    // If admin, export all for month. If employee, export only theirs.
    const records = currentRecords;
    if (records.length === 0) {
        alert("No records to export for this month.");
        return;
    }

    const headers = ["Employee", "Month", "Basic", "Deductions", "Net Salary", "Status", "Payment Date"];
    const rows = records.map(p => [
        p.employeeName,
        p.month,
        p.basicSalary.toFixed(2),
        p.deductions.toFixed(2),
        p.netSalary.toFixed(2),
        p.status,
        p.paymentDate || '-'
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
        + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `payroll_${selectedMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter records: Admin sees all, Employee sees only theirs
  const allMonthRecords = payrolls.filter(p => p.month === selectedMonth);
  const currentRecords = isAdmin 
    ? allMonthRecords 
    : allMonthRecords.filter(p => p.employeeId === user?.id);

  const totalPayout = currentRecords.reduce((sum, r) => sum + r.netSalary, 0);

  return (
    <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">
                    {isAdmin ? "Payroll System" : "My Payslips"}
                </h1>
                <p className="text-slate-500 text-sm">
                    {isAdmin ? "Process monthly salaries and track payments." : "View your salary history and download payslips."}
                </p>
            </div>
            <div className="flex items-center gap-2 bg-white p-1 rounded-lg border shadow-sm">
                <input 
                    type="month" 
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="p-2 text-sm text-gray-700 outline-none"
                />
            </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <p className="text-sm text-gray-500 font-medium">
                    {isAdmin ? "Total Payout" : "Net Pay"}
                </p>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">${totalPayout.toLocaleString(undefined, {minimumFractionDigits: 2})}</h3>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <p className="text-sm text-gray-500 font-medium">
                     {isAdmin ? "Pending Payments" : "Status"}
                </p>
                {isAdmin ? (
                    <h3 className="text-2xl font-bold text-amber-600 mt-1">
                        {currentRecords.filter(p => p.status === PaymentStatus.PENDING).length}
                    </h3>
                ) : (
                    <h3 className="text-xl font-bold text-gray-800 mt-1">
                        {currentRecords.length > 0 ? currentRecords[0].status : '-'}
                    </h3>
                )}
            </div>
            <div className="flex flex-col gap-2">
                {isAdmin ? (
                    <button 
                        onClick={handleGenerate}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors font-medium shadow-sm"
                    >
                        <Play size={18} />
                        Run Payroll
                    </button>
                ) : (
                     <div className="flex-1 bg-gray-50 text-gray-400 rounded-lg flex items-center justify-center gap-2 font-medium border border-dashed border-gray-200">
                        <Lock size={16} /> Run Payroll (Admin)
                    </div>
                )}
                <button 
                    onClick={handleExportCSV}
                    className="flex-1 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-lg flex items-center justify-center gap-2 transition-colors font-medium"
                >
                    <Download size={18} />
                    Export CSV
                </button>
            </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center gap-2">
                <FileText size={18} className="text-gray-400"/>
                <h3 className="font-semibold text-gray-800">Records for {selectedMonth}</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
                        <tr>
                            <th className="p-4">Employee</th>
                            <th className="p-4">Basic Salary</th>
                            <th className="p-4">Deductions</th>
                            <th className="p-4">Net Pay</th>
                            <th className="p-4">Status</th>
                            {isAdmin && <th className="p-4 text-right">Actions</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {currentRecords.map(record => (
                            <tr key={record.id} className="hover:bg-gray-50">
                                <td className="p-4 font-medium text-slate-800">{record.employeeName}</td>
                                <td className="p-4 text-sm text-slate-600">${record.basicSalary.toLocaleString()}</td>
                                <td className="p-4 text-sm text-red-500">-${record.deductions.toLocaleString()}</td>
                                <td className="p-4 font-bold text-slate-800">${record.netSalary.toLocaleString()}</td>
                                <td className="p-4">
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${record.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                        {record.status}
                                    </span>
                                </td>
                                {isAdmin && (
                                    <td className="p-4 text-right">
                                        {record.status === PaymentStatus.PENDING && (
                                            <button 
                                                onClick={() => markPayrollPaid(record.id)}
                                                className="text-sm bg-green-50 text-green-700 hover:bg-green-100 px-3 py-1 rounded transition-colors flex items-center gap-1 ml-auto"
                                            >
                                                <Check size={14} /> Mark Paid
                                            </button>
                                        )}
                                        {record.status === PaymentStatus.PAID && (
                                            <span className="text-xs text-gray-400">Paid on {record.paymentDate}</span>
                                        )}
                                    </td>
                                )}
                            </tr>
                        ))}
                        {currentRecords.length === 0 && (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-gray-500">
                                    {isAdmin 
                                        ? `No records generated for ${selectedMonth}. Click "Run Payroll" to start.` 
                                        : "No payslip found for this month."}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
};

export default Payroll;