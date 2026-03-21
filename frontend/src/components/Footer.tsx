import { BookOpen, Github, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2 text-xl font-bold tracking-tighter text-slate-900">
            <BookOpen className="h-6 w-6 text-indigo-600" />
            <span>LMS Platform</span>
          </div>
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} LMS Platform, Inc. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-slate-400 hover:text-slate-500">
              <span className="sr-only">Twitter</span>
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="text-slate-400 hover:text-slate-500">
              <span className="sr-only">GitHub</span>
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
