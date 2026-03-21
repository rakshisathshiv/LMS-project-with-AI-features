'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PlayCircle } from 'lucide-react';
import api from '@/lib/axios';
import { useAuth } from '@/store/useAuth';

export default function Dashboard() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const [progressData, setProgressData] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (!isAuthenticated) return;
    
    Promise.all([
      api.get('/progress'),
      api.get('/courses')
    ]).then(([progRes, currRes]) => {
      setProgressData(progRes.data);
      // We will need to map progress to courses, ideally the backend supports this better via an enrollments endpoint.
      // For now, we fetch all courses and cross-reference if progress exists, or just show all for demo.
      // An LMS dashboard would show ENROLLED courses. Let's assume the user is enrolled in everything they have progress for.
      
      const enrolledIds = new Set(progRes.data.map((p: any) => p.video?.section?.subjectId /* Note: this might not exist based on Prisma include */));
      // For MVP, just show all courses indicating "Continue Learning"
      setSubjects(currRes.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [isAuthenticated]);

  if (isLoading || loading) return <div className="p-12 text-center text-slate-500">Loading dashboard...</div>;
  if (!isAuthenticated) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-8">Welcome back, {user?.name}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map(subject => (
          <div key={subject.id} className="border border-slate-200 rounded-2xl bg-white shadow-sm overflow-hidden flex flex-col hover:shadow-md transition">
            <div className="p-6 flex-1">
              <h3 className="font-bold text-lg text-slate-900 mb-2">{subject.title}</h3>
              <p className="text-sm text-slate-600 line-clamp-2">{subject.description}</p>
            </div>
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Enrolled</span>
              <Link href={`/learn/${subject.id}`} className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700">
                <PlayCircle className="h-4 w-4" />
                Resume
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
