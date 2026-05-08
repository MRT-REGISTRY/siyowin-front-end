'use client';

import { useState } from 'react';
import { ArrowLeft, ChevronDown, ChevronRight, MessageSquare, FileText } from 'lucide-react';
import { SubjectRecord } from '@/types';

interface Props {
  subject: SubjectRecord;
  onBack: () => void;
}

interface Module {
  id: string;
  title: string;
  items: { id: string; title: string; type: 'announcement' | 'assignment' | 'resource' }[];
}

const SAMPLE_MODULES: Module[] = [
  {
    id: 'general',
    title: 'General',
    items: [{ id: 'a1', title: 'Announcements', type: 'announcement' }],
  },
  {
    id: 'lecture',
    title: 'Lecture',
    items: [],
  },
  {
    id: 'week1',
    title: '1 February - 7 February',
    items: [{ id: 'g1', title: 'Group Project', type: 'assignment' }],
  },
  {
    id: 'week2',
    title: '8 February - 14 February',
    items: [],
  },
  {
    id: 'week3',
    title: '15 February - 21 February',
    items: [],
  },
  {
    id: 'week4',
    title: '22 February - 28 February',
    items: [],
  },
];

export default function SubjectReportPage({ subject, onBack }: Props) {
  const [expandedModules, setExpandedModules] = useState<string[]>(['general', 'week1']);
  const allExpanded = expandedModules.length === SAMPLE_MODULES.length;

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) =>
      prev.includes(moduleId) ? prev.filter((id) => id !== moduleId) : [...prev, moduleId]
    );
  };

  const toggleAll = () => {
    if (allExpanded) {
      setExpandedModules([]);
    } else {
      setExpandedModules(SAMPLE_MODULES.map((m) => m.id));
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      {/* Header Area */}
      <div className="px-4 md:px-8 pt-4 md:pt-6">
        <div className="max-w-[1400px] mx-auto rounded-2xl bg-slate-200 border border-slate-300 shadow-sm px-6 py-5">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center text-sm text-slate-500 hover:text-slate-900 mb-4 transition-colors"
          >
            <ArrowLeft size={16} className="mr-1" /> Back to My courses
          </button>
          <h1 className="text-2xl font-bold text-slate-900">
            {subject.name} - {subject.teacher}
          </h1>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 w-full px-4 md:px-8 py-4 md:py-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden w-full max-w-[1400px] mx-auto">
          <div className="px-4 md:px-6 py-3 border-b border-slate-100 flex justify-end">
            <button
              onClick={toggleAll}
              className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
            >
              {allExpanded ? 'Collapse all' : 'Expand all'}
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {SAMPLE_MODULES.map((module) => {
              const isExpanded = expandedModules.includes(module.id);
              return (
                <div key={module.id} className="group">
                  <button
                    onClick={() => toggleModule(module.id)}
                    className="w-full flex items-center px-4 md:px-6 py-5 hover:bg-slate-50 transition-colors
      focus:outline-none focus:bg-slate-50"
                  >
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100
      text-slate-500 mr-4 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                      {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </div>
                    <h2 className="text-lg font-semibold text-slate-800">{module.title}</h2>
                  </button>

                  {isExpanded && (
                    <div className="px-4 md:px-6 pb-6 pl-14 md:pl-16">
                      {module.items.length > 0 ? (
                        <ul className="space-y-3">
                          {module.items.map((item) => (
                            <li key={item.id} className="flex items-start">
                              <span className={`mt-0.5 mr-3 ${item.type === 'announcement' ? 'text-purple-600' :
      'text-rose-500'}`}>
                                {item.type === 'announcement' ? (
                                  <MessageSquare size={18} />
                                ) : (
                                  <FileText size={18} />
                                )}
                              </span>
                              <a href="#" className="text-blue-600 hover:underline font-medium text-[15px]">
                                {item.title}
                              </a>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-slate-400 italic">No resources available.</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
