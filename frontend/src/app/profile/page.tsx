'use client';

import { useAuth } from '@/store/useAuth';
import { Award, Download } from 'lucide-react';
import jsPDF from 'jspdf';

export default function Profile() {
  const { user } = useAuth();

  const downloadReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text('LMS Course Completion Report', 20, 30);
    doc.setFontSize(16);
    doc.text(`Student: ${user?.name}`, 20, 50);
    doc.text(`Email: ${user?.email}`, 20, 60);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 70);
    
    doc.setFontSize(12);
    doc.text('---------------------------------------------------------', 20, 85);
    doc.text('Completed Courses:', 20, 95);
    doc.text('- Full Stack Development 101 (Example)', 30, 110);
    doc.text('- Advanced React Patterns (Example)', 30, 120);

    doc.save(`${user?.name}_LMS_Report.pdf`);
  };

  if (!user) return null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-indigo-600 px-8 py-12 text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="h-24 w-24 rounded-full bg-indigo-500 border-4 border-indigo-400 flex items-center justify-center text-4xl font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-extrabold">{user.name}</h1>
              <p className="text-indigo-200 mt-1">{user.email}</p>
            </div>
          </div>
          <button onClick={downloadReport} className="flex items-center gap-2 bg-white text-indigo-700 font-medium px-5 py-2.5 rounded-full hover:bg-indigo-50 transition shadow-sm">
            <Download className="h-4 w-4" />
            Download Progress Report
          </button>
        </div>
        
        <div className="p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Award className="h-5 w-5 text-amber-500" />
            Your Achievements
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center">
              <div className="text-4xl font-extrabold text-indigo-600 mb-2">2</div>
              <div className="text-sm font-medium text-slate-600">Enrolled Courses</div>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center">
              <div className="text-4xl font-extrabold text-emerald-600 mb-2">4</div>
              <div className="text-sm font-medium text-slate-600">Completed Videos</div>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center">
              <div className="text-4xl font-extrabold text-amber-600 mb-2">0</div>
              <div className="text-sm font-medium text-slate-600">Certificates Earned</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
