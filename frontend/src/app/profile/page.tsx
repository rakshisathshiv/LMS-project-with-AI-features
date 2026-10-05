'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/store/useAuth';
import { useRouter } from 'next/navigation';
import { Award, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import api from '@/lib/axios';

export default function Profile() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [subjects, setSubjects] = useState<any[]>([]);
  const [progressData, setProgressData] = useState<any[]>([]);

  // Redirect guard — only redirect once auth has resolved
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Fetch real stats when user is available
  useEffect(() => {
    if (!user) return;
    Promise.all([
      api.get('/courses/enrolled'),
      api.get('/progress')
    ]).then(([subRes, progRes]) => {
      setSubjects(subRes.data);
      setProgressData(progRes.data);
    }).catch(() => {
      // Non-fatal — stats will default to empty
    });
  }, [user]);

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
    doc.text('Enrolled Courses:', 20, 95);
    if (subjects.length === 0) {
      doc.text('No enrolled courses yet.', 30, 110);
    } else {
      subjects.forEach((s: any, i: number) => {
        doc.text(`- ${s.title}`, 30, 110 + i * 10);
      });
    }

    doc.save(`${user?.name}_LMS_Report.pdf`);
  };

  if (isLoading || !isAuthenticated) return null;

  const completedCount = progressData.filter((p) => p.completed).length;

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-indigo-600 px-8 py-12 text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="h-24 w-24 rounded-full bg-indigo-500 border-4 border-indigo-400 flex items-center justify-center text-4xl font-bold">
              {user!.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-extrabold">{user!.name}</h1>
              <p className="text-indigo-200 mt-1">{user!.email}</p>
            </div>
          </div>
          <button
            onClick={downloadReport}
            className="flex items-center gap-2 bg-white text-indigo-700 font-medium px-5 py-2.5 rounded-full hover:bg-indigo-50 transition shadow-sm"
          >
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
              <div className="text-4xl font-extrabold text-indigo-600 mb-2">{subjects.length}</div>
              <div className="text-sm font-medium text-slate-600">Enrolled Courses</div>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center">
              <div className="text-4xl font-extrabold text-emerald-600 mb-2">{completedCount}</div>
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
