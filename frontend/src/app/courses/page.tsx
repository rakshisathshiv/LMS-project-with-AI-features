'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';
import api from '@/lib/axios';

interface Course {
  id: number;
  title: string;
  slug: string;
  description: string;
  price: number;
}

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/courses').then(res => {
      setCourses(res.data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-12 text-center text-slate-500">Loading courses...</div>;

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Course Catalog</h1>
        <p className="mt-4 text-lg text-slate-600 max-w-2xl">
          Browse our premium selection of courses designed to take your engineering skills to the next level.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <div key={course.id} className="flex flex-col overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-lg transition">
            <div className="bg-indigo-50 p-8 flex items-center justify-center border-b border-indigo-100">
              <BookOpen className="h-16 w-16 text-indigo-400" />
            </div>
            <div className="flex flex-1 flex-col justify-between p-6">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900">{course.title}</h3>
                <p className="mt-3 text-sm text-slate-600 line-clamp-3">{course.description}</p>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <span className="text-xl font-bold text-indigo-600">${course.price}</span>
                <Link href={`/courses/${course.id}`} className="group flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-700">
                  View Details
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
