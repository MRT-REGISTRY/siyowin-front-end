'use client';

import { useEffect, useState } from 'react';
import { User, Bell, Lock, Palette, Globe, ChevronRight, Camera } from 'lucide-react';
import { StudentProfile } from '@/types';
import { useLanguage } from '@/components/LanguageProvider';

const SECTIONS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notif', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Lock },
  { id: 'appear', label: 'Appearance', icon: Palette },
  { id: 'language', label: 'Language', icon: Globe },
];

export default function SettingsPage({ profile }: { profile: StudentProfile | null }) {
  const { isSinhala } = useLanguage();
  const [activeSection, setActiveSection] = useState('profile');
  const [name, setName] = useState(profile?.name ?? '');
  const [email, setEmail] = useState(profile?.email ?? '');
  const [grade, setGrade] = useState(profile?.grade ?? '');
  const [section, setSection] = useState(profile?.classId ?? '');
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);
  const [hwReminder, setHwReminder] = useState(true);
  const [theme, setTheme] = useState('Light');
  const [language, setLanguage] = useState('English');
  const [timezone, setTimezone] = useState('Asia/Colombo (UTC+5:30)');
  const [saved, setSaved] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const rawPreferences = window.localStorage.getItem('student-dashboard-preferences');
    if (!rawPreferences) return;

    try {
      const preferences = JSON.parse(rawPreferences) as {
        emailNotif?: boolean;
        pushNotif?: boolean;
        hwReminder?: boolean;
        theme?: string;
        language?: string;
        timezone?: string;
      };
      setEmailNotif(preferences.emailNotif ?? true);
      setPushNotif(preferences.pushNotif ?? true);
      setHwReminder(preferences.hwReminder ?? true);
      setTheme(preferences.theme ?? 'Light');
      setLanguage(preferences.language ?? 'English');
      setTimezone(preferences.timezone ?? 'Asia/Colombo (UTC+5:30)');
    } catch {
      window.localStorage.removeItem('student-dashboard-preferences');
    }
  }, []);

  useEffect(() => {
    if (!profile) return;
    setName(profile.name);
    setEmail(profile.email ?? '');
    setGrade(profile.grade);
    setSection(profile.classId);
  }, [profile]);

  const handlePreferenceSave = () => {
    window.localStorage.setItem('student-dashboard-preferences', JSON.stringify({
      emailNotif,
      pushNotif,
      hwReminder,
      theme,
      language,
      timezone,
    }));
    setMessage('');
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleUnavailableSave = () => {
    setSaved(false);
    setMessage('Account changes are disabled until a backend update endpoint is available.');
  };

  return (
    <div className="sdp-wrap">
      <div className="sdp-header">
        <div>
          <h1 className="sdp-title">{isSinhala ? 'සැකසුම්' : 'Settings'}</h1>
          <p className="sdp-sub">Manage your account and preferences</p>
        </div>
      </div>

      {message && <p className="sdp-card text-red-600">{message}</p>}

      <div className="stg-layout">
        <nav className="stg-nav">
          {SECTIONS.map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                className={`stg-nav-item ${activeSection === s.id ? 'stg-nav-active' : ''}`}
                onClick={() => setActiveSection(s.id)}
                type="button"
              >
                <Icon size={16} />
                <span>{s.label}</span>
                <ChevronRight size={14} className="stg-nav-arrow" />
              </button>
            );
          })}
        </nav>

        <div className="stg-content sdp-card">
          {activeSection === 'profile' && (
            <div className="stg-section">
              <h2 className="stg-section-title">Profile Information</h2>
              <p className="stg-section-sub">{isSinhala ? 'සිසුන්ගේ පැතිකඩ තොරතුරු ආයතනය විසින් කළමනාකරණය කෙරේ.' : 'Student profile data is managed by the institute.'}</p>

              <div className="stg-avatar-row">
                <div className="stg-avatar">{profile?.avatar ?? ''}</div>
                <button className="stg-avatar-btn" type="button" onClick={handleUnavailableSave}>
                  <Camera size={14} /> Change Photo
                </button>
              </div>

              <div className="stg-form-grid">
                <div className="stg-field">
                  <label className="stg-label">Full Name</label>
                  <input className="stg-input" value={name} onChange={(e) => setName(e.target.value)} readOnly />
                </div>
                <div className="stg-field">
                  <label className="stg-label">Email Address</label>
                  <input className="stg-input" value={email} onChange={(e) => setEmail(e.target.value)} type="email" readOnly />
                </div>
                <div className="stg-field">
                  <label className="stg-label">{isSinhala ? 'ශ්‍රේණිය' : 'Grade'}</label>
                  <select className="stg-input" value={grade} onChange={(e) => setGrade(e.target.value)} disabled>
                    {grade && <option>{grade}</option>}
                  </select>
                </div>
                <div className="stg-field">
                  <label className="stg-label">Section</label>
                  <select className="stg-input" value={section} onChange={(e) => setSection(e.target.value)} disabled>
                    {section && <option>{section.toUpperCase()}</option>}
                  </select>
                </div>
              </div>
              <button className="stg-save-btn" type="button" onClick={handleUnavailableSave}>
                Request Changes
              </button>
            </div>
          )}

          {activeSection === 'notif' && (
            <div className="stg-section">
              <h2 className="stg-section-title">Notifications</h2>
              <p className="stg-section-sub">Choose what alerts you receive.</p>
              <div className="stg-toggle-list">
                {[
                  { label: 'Email Notifications', sub: 'Receive updates via email', val: emailNotif, set: setEmailNotif },
                  { label: 'Push Notifications', sub: 'Browser push alerts', val: pushNotif, set: setPushNotif },
                  { label: 'Homework Reminders', sub: 'Reminders before due dates', val: hwReminder, set: setHwReminder },
                ].map((item) => (
                  <div key={item.label} className="stg-toggle-row">
                    <div>
                      <p className="stg-toggle-label">{item.label}</p>
                      <p className="stg-toggle-sub">{item.sub}</p>
                    </div>
                    <button
                      className={`stg-toggle ${item.val ? 'stg-toggle-on' : ''}`}
                      onClick={() => item.set(!item.val)}
                      aria-label={item.label}
                      type="button"
                    >
                      <span className="stg-toggle-thumb" />
                    </button>
                  </div>
                ))}
              </div>
              <button className="stg-save-btn" type="button" onClick={handlePreferenceSave}>
                {saved ? 'Saved' : 'Save'}
              </button>
            </div>
          )}

          {activeSection === 'security' && (
            <div className="stg-section">
              <h2 className="stg-section-title">Security</h2>
              <p className="stg-section-sub">Password changes are handled by the institute account admin.</p>
              <div className="stg-form-grid">
                <div className="stg-field stg-full">
                  <label className="stg-label">Current Password</label>
                  <input className="stg-input" type="password" placeholder="********" disabled />
                </div>
                <div className="stg-field">
                  <label className="stg-label">New Password</label>
                  <input className="stg-input" type="password" placeholder="********" disabled />
                </div>
                <div className="stg-field">
                  <label className="stg-label">Confirm New Password</label>
                  <input className="stg-input" type="password" placeholder="********" disabled />
                </div>
              </div>
              <button className="stg-save-btn" type="button" onClick={handleUnavailableSave}>
                Request Password Reset
              </button>
            </div>
          )}

          {activeSection === 'appear' && (
            <div className="stg-section">
              <h2 className="stg-section-title">Appearance</h2>
              <p className="stg-section-sub">Customize your dashboard look.</p>
              <div className="stg-appear-grid">
                {['Light', 'Dark', 'System'].map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={`stg-theme-card ${item === theme ? 'stg-theme-active' : ''}`}
                    onClick={() => setTheme(item)}
                  >
                    <div className={`stg-theme-preview stg-preview-${item.toLowerCase()}`} />
                    <span className="stg-theme-label">{item}</span>
                  </button>
                ))}
              </div>
              <button className="stg-save-btn" type="button" onClick={handlePreferenceSave}>
                {saved ? 'Saved' : 'Save'}
              </button>
            </div>
          )}

          {activeSection === 'language' && (
            <div className="stg-section">
              <h2 className="stg-section-title">Language & Region</h2>
              <p className="stg-section-sub">Set your preferred language.</p>
              <div className="stg-form-grid">
                <div className="stg-field">
                  <label className="stg-label">Language</label>
                  <select className="stg-input" value={language} onChange={(event) => setLanguage(event.target.value)}>
                    <option>English</option>
                    <option>Sinhala</option>
                    <option>Tamil</option>
                  </select>
                </div>
                <div className="stg-field">
                  <label className="stg-label">Timezone</label>
                  <select className="stg-input" value={timezone} onChange={(event) => setTimezone(event.target.value)}>
                    <option>Asia/Colombo (UTC+5:30)</option>
                    <option>UTC</option>
                  </select>
                </div>
              </div>
              <button className="stg-save-btn" type="button" onClick={handlePreferenceSave}>
                {saved ? 'Saved' : 'Save'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
