'use client';

import { useState, useMemo } from 'react';
import { Users, Clock, ArrowLeft, Mail, Phone, UserCircle, Search } from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';

interface Props {
  subjects: any[];
  students: any[];
}

export default function TeacherClassesPage({ subjects, students }: Props) {
  const { isSinhala } = useLanguage();
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedClass = useMemo(() => {
    return selectedClassId ? subjects.find(s => s.id === selectedClassId) : null;
  }, [selectedClassId, subjects]);

  const enrolledStudents = useMemo(() => {
    if (!selectedClassId) return [];
    const query = searchQuery.toLowerCase().trim();
    
    return students.filter(student => {
      const inClass = student.classId === selectedClassId || student.enrollments?.some((e: any) => e.classId === selectedClassId);
      if (!inClass) return false;
      
      if (!query) return true;
      return student.name.toLowerCase().includes(query) || student.index.toLowerCase().includes(query);
    });
  }, [selectedClassId, students, searchQuery]);

  if (selectedClass) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => { setSelectedClassId(null); setSearchQuery(''); }}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-slate-50 hover:text-slate-800 flex-shrink-0"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {selectedClass.name}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 uppercase">
                {selectedClass.grade}
              </span>
              <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 uppercase">
                {selectedClass.medium}
              </span>
            </div>
          </div>
        </div>

        <div className="sdp-card p-6">
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-4">
            <div className="flex items-center gap-4">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Users size={18} className="text-[#1B3A8C]" />
                {isSinhala ? 'ලියාපදිංචි සිසුන්' : 'Enrolled Students'}
              </h3>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                {enrolledStudents.length} {isSinhala ? 'සිසුන්' : 'Total'}
              </span>
            </div>
            <div className="sd-search-bar bg-white border border-slate-200 w-full sm:w-64">
              <Search size={15} className="sd-search-icon" />
              <input
                type="text"
                placeholder={isSinhala ? 'සිසුවා සොයන්න...' : 'Search by name or ID...'}
                className="sd-search-input bg-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-3">
            {enrolledStudents.map(student => (
              <div key={student.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-lg">
                    {student.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{student.name}</h4>
                    <p className="text-xs text-slate-500 uppercase font-medium">{student.index}</p>
                  </div>
                </div>
                
                <div className="mt-3 sm:mt-0 flex flex-col gap-1.5 text-xs text-slate-500">
                  {student.email && (
                    <div className="flex items-center gap-2">
                      <Mail size={14} className="text-slate-400" />
                      {student.email}
                    </div>
                  )}
                  {student.phone && (
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-slate-400" />
                      {student.phone}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {enrolledStudents.length === 0 && (
              <div className="py-12 text-center text-sm text-slate-500 flex flex-col items-center">
                <UserCircle size={40} className="text-slate-300 mb-3" />
                {searchQuery 
                  ? (isSinhala ? 'මෙම නම හෝ හැඳුනුම්පත සහිත සිසුවෙකු හමු නොවීය.' : 'No students match your search query.')
                  : (isSinhala ? 'මෙම පන්තිය සඳහා කිසිදු සිසුවෙකු ලියාපදිංචි වී නොමැත.' : 'No students are currently enrolled in this class.')}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">
          {isSinhala ? 'මගේ පන්ති' : 'My Classes'}
        </h2>
      </div>

      <div className="sd-mid-grid">
        {subjects.map((subject) => (
          <button
            key={subject.id}
            onClick={() => setSelectedClassId(subject.id)}
            className="sdp-card p-5 text-left transition-all hover:border-[#1B3A8C] hover:shadow-md group"
          >
            <div className="mb-3 flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="rounded bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600">
                  {subject.grade}
                </span>
                <span className="rounded bg-blue-50 px-2 py-1 text-xs font-bold text-blue-700">
                  {subject.medium}
                </span>
              </div>
            </div>

            <h3 className="text-base font-bold text-slate-800 mb-4 group-hover:text-[#1B3A8C] transition-colors">{subject.name}</h3>

            <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-medium text-slate-500">
              <div className="flex items-center gap-1.5">
                <Users size={14} />
                <span>{subject.studentCount} {isSinhala ? 'සිසුන්' : 'Students'}</span>
              </div>
            </div>
          </button>
        ))}
        {subjects.length === 0 && (
          <div className="sdp-card col-span-full p-8 text-center text-sm text-slate-500">
            {isSinhala ? 'පන්ති කිසිවක් හමු නොවීය.' : 'No classes assigned.'}
          </div>
        )}
      </div>
    </div>
  );
}
