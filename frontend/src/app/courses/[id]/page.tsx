'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PlayCircle, CheckCircle } from 'lucide-react';
import api from '@/lib/axios';
import { useAuth } from '@/store/useAuth';
import Link from 'next/link';

export default function CourseDetail({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    api.get(`/courses/${unwrappedParams.id}`).then(res => {
      setCourse(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [unwrappedParams.id]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    try {
      await api.post(`/courses/${course.id}/enroll`);
      router.push('/dashboard');
    } catch (err: any) {
      if(err.response?.data?.error === 'Already enrolled in this subject') {
        router.push('/dashboard');
      } else {
        alert(err.response?.data?.error || 'Failed to enroll');
      }
    }
  };

  if (loading) return <div className="p-12 text-center text-slate-500">Loading course details...</div>;
  if (!course) return <div className="p-12 text-center text-rose-500">Course not found</div>;

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">{course.title}</h1>
            <p className="mt-4 text-lg text-slate-600">{course.description}</p>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">Course Content</h2>
            <div className="space-y-4">
              {course.sections?.map((section: any) => (
                <div key={section.id} className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                  <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
                    <h3 className="font-semibold text-slate-900">{section.title}</h3>
                  </div>
                  <ul className="divide-y divide-slate-100">
                    {section.videos?.map((video: any) => (
                      <li key={video.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition">
                        <div className="flex items-center gap-3">
                          <PlayCircle className="h-5 w-5 text-indigo-400" />
                          <span className="text-sm font-medium text-slate-700">{video.title}</span>
                        </div>
                        <span className="text-xs text-slate-400">{Math.floor(video.durationSeconds / 60)} min</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 border border-slate-200 rounded-2xl bg-white p-6 shadow-sm h-fit sticky top-24">
          <div className="text-3xl font-extrabold text-slate-900 mb-6">${course.price}</div>
          <button 
            onClick={handleEnroll}
            className="w-full rounded-full bg-indigo-600 px-4 py-3 text-sm font-medium text-white hover:bg-indigo-700 transition"
          >
            {isAuthenticated ? 'Enroll Now' : 'Log in to Enroll'}
          </button>
          
          <ul className="mt-8 space-y-3">
            {[
              'Full lifetime access',
              'Access on mobile and desktop',
              'Certificate of completion',
              'AI Assistant integration'
            ].map((feature, i) => (
              <li key={i} className="flex items-center gap-3 text-sm text-slate-600">
                <CheckCircle className="h-5 w-5 text-indigo-500" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
