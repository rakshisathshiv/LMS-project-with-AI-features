'use client';

import { use, useEffect, useState } from 'react';
import { PlayCircle, CheckCircle } from 'lucide-react';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';
import AIWidget from '@/components/AIWidget';

export default function LearningInterface({ params }: { params: Promise<{ courseId: string }> }) {
  const unwrappedParams = use(params);
  const [course, setCourse] = useState<any>(null);
  const [activeVideo, setActiveVideo] = useState<any>(null);
  const [progress, setProgress] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    Promise.all([
      api.get(`/courses/${unwrappedParams.courseId}`),
      api.get('/progress')
    ]).then(([courseRes, progRes]) => {
      setCourse(courseRes.data);
      setProgress(progRes.data);
      
      // Determine what video to start on (resume)
      const courseVideos = courseRes.data.sections.flatMap((s: any) => s.videos);
      
      const lastProgress = progRes.data
        .filter((p: any) => courseVideos.some((v: any) => v.id === p.videoId))
        .sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0];

      if (lastProgress) {
        const vid = courseVideos.find((v: any) => v.id === lastProgress.videoId);
        setActiveVideo(vid || courseVideos[0]);
      } else {
        setActiveVideo(courseVideos[0]);
      }
    }).catch(() => router.push('/dashboard'));
  }, [unwrappedParams.courseId, router]);

  const markComplete = async () => {
    if(!activeVideo) return;
    try {
      await api.post('/progress', {
        videoId: activeVideo.id,
        completed: true,
        watchedSeconds: activeVideo.durationSeconds // simulate fully watched
      });
      // Refresh progress
      const res = await api.get('/progress');
      setProgress(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const isCompleted = (vidId: number) => {
    return progress.some(p => p.videoId === vidId && p.completed);
  };

  if (!course || !activeVideo) return <div className="p-12 text-center text-slate-500">Loading learning environment...</div>;

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)] bg-slate-50">
      {/* Sidebar Content */}
      <div className="w-full md:w-80 bg-white border-r border-slate-200 overflow-y-auto h-[calc(100vh-4rem)]">
        <div className="p-6 border-b border-slate-200">
          <h2 className="font-bold text-lg text-slate-900 leading-tight">{course.title}</h2>
        </div>
        <div>
          {course.sections.map((section: any) => (
            <div key={section.id}>
              <div className="bg-slate-100/50 px-6 py-3 border-y border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wider">
                {section.title}
              </div>
              <ul className="divide-y divide-slate-100">
                {section.videos.map((video: any) => {
                  const active = activeVideo.id === video.id;
                  const comp = isCompleted(video.id);
                  return (
                    <li 
                      key={video.id} 
                      onClick={() => setActiveVideo(video)}
                      className={`cursor-pointer px-6 py-4 flex items-start gap-3 transition-colors ${active ? 'bg-indigo-50 border-l-4 border-indigo-600' : 'hover:bg-slate-50 border-l-4 border-transparent'}`}
                    >
                      <div className="mt-0.5">
                        {comp ? <CheckCircle className="h-5 w-5 text-emerald-500" /> : <PlayCircle className={`h-5 w-5 ${active ? 'text-indigo-600' : 'text-slate-400'}`} />}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${active ? 'text-indigo-900' : 'text-slate-700'}`}>{video.title}</p>
                        <p className="text-xs text-slate-400 mt-1">{Math.floor(video.durationSeconds / 60)} min</p>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Main Video Area */}
      <div className="flex-1 flex flex-col items-center p-6 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-4xl space-y-6">
          <div className="relative w-full pb-[56.25%] bg-black rounded-2xl overflow-hidden shadow-xl ring-1 ring-slate-900/10">
            <iframe 
              src={`${activeVideo.youtubeUrl}?autoplay=1`} 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full"
            />
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{activeVideo.title}</h1>
              <p className="mt-2 text-slate-600 leading-relaxed">{activeVideo.description}</p>
            </div>
            <button 
              onClick={markComplete}
              className={`whitespace-nowrap rounded-full px-6 py-2.5 text-sm font-medium transition shadow-sm ${isCompleted(activeVideo.id) ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
            >
              {isCompleted(activeVideo.id) ? 'Completed' : 'Mark as Complete'}
            </button>
          </div>
        </div>
      </div>
      
      {/* AI Assistant Contextual to the active video */}
      <AIWidget context={`Course: ${course.title}. Video: ${activeVideo.title}. Description: ${activeVideo.description}`} />
    </div>
  );
}
