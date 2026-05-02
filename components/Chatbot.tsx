"use client";

import { useEffect, useRef, useState } from 'react';

type ChatState = 'initial' | 'subjects' | 'grades';
type Message = { id: number; sender: 'user' | 'bot'; text: string; suggestions?: string[] };

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, sender: 'bot', text: 'Hi! I can help — try one of the suggestions below.', suggestions: ['Subjects', 'Location', 'Office Hours', 'Contact'] }
  ]);
  const [state, setState] = useState<ChatState>('initial');
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  
  const nextId = useRef(1);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, open]);

  const addMessage = (sender: 'user' | 'bot', text: string, suggestions?: string[]) => {
    setMessages(prev => [...prev, { id: nextId.current++, sender, text, suggestions }]);
  };

  const handleSubjectsClick = async () => {
    addMessage('user', 'Subjects');
    setState('subjects');
    
    try {
      const res = await fetch('/api/subjects');
      const data = await res.json();
      
      if (data.error || !data.subjects?.length) {
        addMessage('bot', 'Sorry, I could not load subjects. Please try again.');
        setState('initial');
        return;
      }

      addMessage('bot', 'Here are the available subjects:', data.subjects);
    } catch (err) {
      addMessage('bot', 'Error loading subjects. Please try again.');
      setState('initial');
    }
  };

  const handleSubjectSelect = async (subject: string) => {
    addMessage('user', subject);
    setSelectedSubject(subject);
    setState('grades');
    
    try {
      const res = await fetch(`/api/grades?subject=${encodeURIComponent(subject)}`);
      const data = await res.json();
      
      if (data.error || !data.grades?.length) {
        addMessage('bot', 'No grades available for this subject.');
        setState('initial');
        return;
      }

      addMessage('bot', `Which grade are you interested in?`, data.grades);
    } catch (err) {
      addMessage('bot', 'Error loading grades. Please try again.');
      setState('initial');
    }
  };

  const handleGradeSelect = async (grade: string) => {
    addMessage('user', grade);
    
    if (!selectedSubject) return;

    try {
      const res = await fetch(`/api/class-details?subject=${encodeURIComponent(selectedSubject)}&grade=${encodeURIComponent(grade)}`);
      const data = await res.json();
      
      if (data.error || !data.classes?.length) {
        addMessage('bot', 'No classes found for this subject and grade.');
        setState('initial');
        setSelectedSubject(null);
        return;
      }

      // Display all classes for this subject and grade
      for (const classData of data.classes) {
        let teacherName = 'N/A';
        if (classData.teacher_id) {
          try {
            const teacherRes = await fetch(`/api/teacher?id=${encodeURIComponent(classData.teacher_id)}`);
            const teacherData = await teacherRes.json();
            if (teacherData.teacher?.full_name) {
              teacherName = teacherData.teacher.full_name;
            }
          } catch (err) {
            teacherName = classData.teacher_id;
          }
        }

        // Format schedule time
        let scheduleText = 'Not scheduled';
        if (classData.schedule) {
          const parts = classData.schedule.split(' ');
          const day = parts[0] ? parts[0].charAt(0).toUpperCase() + parts[0].slice(1) : '';
          const time = parts[1] ? parts[1] + ' AM' : '';
          scheduleText = [day, time].filter(Boolean).join(' ');
        }

        const details = `📚 ${classData.subject_name} (${classData.grade})
👨‍🏫 Teacher: ${teacherName}
🌐 Medium: ${classData.medium || 'N/A'}
⏰ Schedule: ${scheduleText}`;
        
        addMessage('bot', details);
      }

      setState('initial');
      setSelectedSubject(null);
    } catch (err) {
      addMessage('bot', 'Error loading class details. Please try again.');
      setState('initial');
      setSelectedSubject(null);
    }
  };

  const handleSend = (text?: string) => {
    const t = (text ?? input).trim();
    if (!t) return;
    
    setInput('');

    if (state === 'initial') {
      addMessage('user', t);
      const lower = t.toLowerCase();
      if (lower.includes('subject')) {
        handleSubjectsClick();
      } else if (lower.includes('location')) {
        addMessage('bot', `📍 Siyowin Education Centre
216/1 Main street, Kegalle 71010

🗺️ View on Google Maps:
https://maps.app.goo.gl/DUgkYCeNYevdC9AQ9`);
      } else if (lower.includes('office') || lower.includes('hours')) {
        addMessage('bot', 'Office hours are Mon-Fri 9:00–16:00.');
      } else if (lower.includes('contact')) {
        addMessage('bot', 'You can reach us at +94 77 123 4567 or email info@example.com.');
      } else {
        addMessage('bot', "Sorry, I don't have that yet — I'll learn that soon.");
      }
    } else if (state === 'subjects') {
      handleSubjectSelect(t);
    } else if (state === 'grades') {
      handleGradeSelect(t);
    }
  };

  return (
    <>
      <button
        className="chatbot-button"
        title="Open Chatbot"
        aria-label="Open Chatbot"
        onClick={() => setOpen(v => !v)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </button>

      {open && (
        <div className="chatbot-panel" role="dialog" aria-label="Chatbot">
          <div className="chatbot-header">
            <strong>Assistant</strong>
            <button className="chatbot-close" onClick={() => setOpen(false)} aria-label="Close">✕</button>
          </div>

          <div className="chatbot-body">
            <div className="chatbot-messages" ref={scrollRef}>
              {messages.map(m => (
                <div key={m.id}>
                  <div className={`chatbot-message ${m.sender === 'user' ? 'user' : 'bot'}`}>
                    {m.text}
                  </div>
                  {m.suggestions && m.suggestions.length > 0 && (
                    <div className="chatbot-suggestions">
                      {m.suggestions.slice(0, 5).map(s => (
                        <button
                          key={s}
                          className="chatbot-suggestion"
                          onClick={() => {
                            if (s === 'Location') {
                              addMessage('user', 'Location');
                              addMessage('bot', `📍 Siyowin Education Centre\n216/1 Main street, Kegalle 71010`, ['View on Google Maps']);
                            } else if (s === 'View on Google Maps') {
                              window.open('https://maps.app.goo.gl/DUgkYCeNYevdC9AQ9', '_blank');
                            } else if (state === 'initial' && (m.suggestions?.includes('Subjects'))) {
                              if (s === 'Subjects') handleSubjectsClick();
                              else handleSend(s);
                            } else if (state === 'subjects') {
                              handleSubjectSelect(s);
                            } else if (state === 'grades') {
                              handleGradeSelect(s);
                            } else {
                              handleSend(s);
                            }
                          }}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="chatbot-input-row">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask me..."
                className="chatbot-input"
              />
              <button className="chatbot-send" onClick={() => handleSend()}>Send</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
