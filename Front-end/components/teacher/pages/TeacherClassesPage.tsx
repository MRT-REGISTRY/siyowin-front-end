'use client';

import { useState, useMemo, useRef } from 'react';
import { Users, Clock, ArrowLeft, Mail, Phone, UserCircle, Search, X, TrendingUp, Award, BookOpen } from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  subjects: any[];
  students: any[];
}

export default function TeacherClassesPage({ subjects, students }: Props) {
  const { isSinhala } = useLanguage();
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProgressStudent, setSelectedProgressStudent] = useState<any | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  const classAssignments = useMemo(() => {
    if (!selectedClassId) return [];
    const map = new Map<string, any>();
    students.forEach((s: any) => {
      (s.marks || []).forEach((m: any) => {
        if (m.subjectId === selectedClassId) {
          const key = `${m.examName}-${m.examDate}`;
          if (!map.has(key)) {
            map.set(key, { name: m.examName, type: m.examType, date: m.examDate });
          }
        }
      });
    });
    return Array.from(map.values()).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [students, selectedClassId]);

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
            <div 
              onClick={() => inputRef.current?.focus()} 
              className="sd-search-bar bg-white border border-slate-200 w-full sm:max-w-md cursor-text"
            >
              <Search size={15} className="sd-search-icon" />
              <input
                ref={inputRef}
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

                <button 
                  onClick={() => setSelectedProgressStudent(student)}
                  className="mt-3 sm:mt-0 px-4 py-2 rounded-xl text-xs font-bold border border-[#1B3A8C] text-[#1B3A8C] hover:bg-[#1B3A8C] hover:text-white transition self-start sm:self-center"
                >
                  {isSinhala ? 'ප්‍රගතිය' : 'View Progress'}
                </button>
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

        {selectedProgressStudent && (() => {
          const studentSubjectMarks = (selectedProgressStudent.marks || [])
            .filter((m: any) => m.subjectId === selectedClassId)
            .sort((a: any, b: any) => new Date(a.examDate).getTime() - new Date(b.examDate).getTime());

          const averageMark = studentSubjectMarks.length === 0 
            ? 0 
            : Math.round(studentSubjectMarks.reduce((acc: number, m: any) => acc + (m.mark || 0), 0) / studentSubjectMarks.length);

          const gradeLabel = (() => {
            if (studentSubjectMarks.length === 0) return '-';
            if (averageMark >= 75) return isSinhala ? 'ඒ (විශිෂ්ට)' : 'A (Excellent)';
            if (averageMark >= 65) return isSinhala ? 'බී (ඉතා හොඳ)' : 'B (Very Good)';
            if (averageMark >= 50) return isSinhala ? 'සී (සාමාන්‍ය)' : 'C (Credit)';
            if (averageMark >= 35) return isSinhala ? 'එස් (සාමාර්ථය)' : 'S (Simple Pass)';
            return isSinhala ? 'ඩබ්ලිව් (අසමත්)' : 'F (Fail)';
          })();

          const chartData = studentSubjectMarks.map((m: any) => ({
            name: m.examName,
            score: m.mark,
          }));

          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
              <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="flex-shrink-0 relative flex items-center justify-center p-5 border-b border-slate-100 bg-slate-50/50">
                  <h3 className="font-bold text-lg text-slate-800 text-center">
                    {isSinhala ? 'සිසු ප්‍රගති වාර්තාව' : 'Student Progress Report'}
                  </h3>
                  <button 
                    onClick={() => setSelectedProgressStudent(null)} 
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors p-1" 
                    title={isSinhala ? 'වසන්න' : 'Close'}
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="p-6 space-y-6 overflow-y-auto flex-1">
                  {/* Student Profile Row */}
                  <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1B3A8C] text-white font-bold text-xl shadow-md">
                      {selectedProgressStudent.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-800">{selectedProgressStudent.name}</h4>
                      <p className="text-xs font-semibold text-[#1B3A8C] uppercase mt-0.5">{selectedProgressStudent.index}</p>
                      <p className="text-xs text-slate-500 font-medium uppercase mt-0.5">{selectedClass.name} • {selectedClass.grade}</p>
                    </div>
                  </div>

                  {/* Chart Section */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-1.5">
                      <Award size={14} className="text-[#1B3A8C]" />
                      {isSinhala ? 'පැවරුම් ලකුණු ප්‍රවණතාව' : 'Assignment Score Trend'}
                    </h4>
                    {studentSubjectMarks.length > 0 ? (
                      <div className="h-[220px] w-full bg-white rounded-xl border border-slate-100 p-2">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                            <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#6B7280' }} />
                            <YAxis domain={[0, 100]} tick={{ fontSize: 9, fill: '#6B7280' }} tickFormatter={v => `${v}%`} />
                            <Tooltip />
                            <Line type="monotone" dataKey="score" name={isSinhala ? 'ලකුණු' : 'Score'} stroke="#1B3A8C" strokeWidth={3} dot={{ r: 4, fill: '#1B3A8C' }} activeDot={{ r: 6 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="h-[220px] bg-slate-50 rounded-xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 text-xs text-center p-4">
                        <Clock size={32} className="text-slate-300 mb-2 animate-pulse" />
                        {isSinhala ? 'තවමත් ලකුණු කිසිවක් ඇතුළත් කර නොමැත.' : 'No assignments have been graded for this student yet.'}
                      </div>
                    )}
                  </div>

                  {/* Recent Assignments & Marks Section */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
                      <BookOpen size={14} className="text-[#1B3A8C]" />
                      {isSinhala ? 'පැවරුම් සහ ලකුණු' : 'Assignments & Marks'}
                    </h4>
                    {classAssignments.length > 0 ? (
                      <div className="border border-slate-100 rounded-xl overflow-hidden divide-y divide-slate-100 bg-white shadow-sm">
                        {classAssignments.map((assignment: any, index: number) => {
                          const sMark = (selectedProgressStudent.marks || []).find((m: any) => m.subjectId === selectedClassId && m.examName === assignment.name);
                          const isAbsent = sMark?.isAbsent === true;
                          const hasMark = sMark && sMark.mark !== undefined && sMark.mark !== null && !isAbsent;

                          return (
                            <div key={index} className="p-3.5 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                              <div className="pr-3">
                                <h5 className="text-xs font-bold text-slate-700">{assignment.name}</h5>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded uppercase">{assignment.type}</span>
                                  <span className="text-[10px] text-slate-400 font-medium">{assignment.date}</span>
                                </div>
                              </div>

                              <div className="flex-shrink-0">
                                {hasMark ? (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-50 text-green-700 border border-green-100 text-[10px] font-bold uppercase tracking-wider">
                                    {sMark.mark}%
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-50 text-slate-400 border border-slate-100 text-[10px] font-bold uppercase tracking-wider">
                                    {isSinhala ? 'නැත' : 'Pending'}
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-xs text-slate-400 text-center py-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        {isSinhala ? 'කිසිදු පැවරුමක් හමු නොවීය.' : 'No assignments have been created yet.'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
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

      <div className="flex flex-col gap-4">
        {subjects.map((subject) => (
          <button
            key={subject.id}
            onClick={() => setSelectedClassId(subject.id)}
            className="sdp-card p-5 text-left transition-all hover:border-[#1B3A8C] hover:shadow-md group flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="rounded bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
                  {subject.grade}
                </span>
                <span className="rounded bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
                  {subject.medium}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-800 group-hover:text-[#1B3A8C] transition-colors">{subject.name}</h3>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-slate-50 border border-slate-100 px-3.5 py-1.5 rounded-xl self-start sm:self-center">
              <Users size={14} className="text-[#1B3A8C]" />
              <span>{subject.studentCount} {isSinhala ? 'සිසුන්' : 'Students'}</span>
            </div>
          </button>
        ))}
        {subjects.length === 0 && (
          <div className="sdp-card p-8 text-center text-sm text-slate-500">
            {isSinhala ? 'පන්ති කිසිවක් හමු නොවීය.' : 'No classes assigned.'}
          </div>
        )}
      </div>
    </div>
  );
}
