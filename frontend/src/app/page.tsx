import Link from 'next/link';
import { ArrowRight, BookOpen, CheckCircle, PlayCircle } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative px-4 py-24 sm:px-6 lg:px-8 bg-indigo-50 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
        <div className="relative mx-auto max-w-7xl text-center">
          <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl md:text-7xl">
            Master the Art of <span className="text-indigo-600 block sm:inline">Software Engineering</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 sm:text-xl">
            Level up your skills with production-ready courses. Learn from industry experts and build real-world applications.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/courses" className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-full shadow-sm hover:bg-indigo-700 transition">
              Explore Courses
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link href="/signup" className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-indigo-700 bg-white border border-indigo-200 rounded-full shadow-sm hover:bg-indigo-50 transition">
              Join for Free
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Everything you need to succeed</h2>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[ 
              { title: 'Project-Based Learning', icon: <BookOpen className="h-6 w-6 text-indigo-600" />, desc: 'Build actual applications instead of watching slides.' },
              { title: 'Learn at Your Pace', icon: <PlayCircle className="h-6 w-6 text-indigo-600" />, desc: 'Lifetime access to all enrolled courses with progress tracking.' },
              { title: 'AI Assistant Included', icon: <CheckCircle className="h-6 w-6 text-indigo-600" />, desc: 'Stuck on a problem? Chat with our AI assistant immediately.' }
            ].map((feature, i) => (
              <div key={i} className="flex flex-col p-8 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-lg transition">
                <div className="mb-4 h-12 w-12 flex items-center justify-center rounded-xl bg-indigo-100">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900">{feature.title}</h3>
                <p className="mt-2 text-slate-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
