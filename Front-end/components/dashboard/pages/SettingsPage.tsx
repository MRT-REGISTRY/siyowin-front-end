'use client';

import { useState } from 'react';
import { User, Bell, Lock, Palette, Globe, ChevronRight, Camera } from 'lucide-react';

const SECTIONS = [
  { id: 'profile',   label: 'Profile',        icon: User },
  { id: 'notif',     label: 'Notifications',  icon: Bell },
  { id: 'security',  label: 'Security',       icon: Lock },
  { id: 'appear',    label: 'Appearance',     icon: Palette },
  { id: 'language',  label: 'Language',       icon: Globe },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('profile');
  const [name, setName]     = useState('Alex Johnson');
  const [email, setEmail]   = useState('alex@siyowin.lk');
  const [grade, setGrade]   = useState('Grade 11');
  const [section, setSection] = useState('Section B');
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif]   = useState(true);
  const [hwReminder, setHwReminder] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="sdp-wrap">
      <div className="sdp-header">
        <div>
          <h1 className="sdp-title">⚙️ Settings</h1>
          <p className="sdp-sub">Manage your account and preferences</p>
        </div>
      </div>

      <div className="stg-layout">
        {/* Sidebar */}
        <nav className="stg-nav">
          {SECTIONS.map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                className={`stg-nav-item ${activeSection === s.id ? 'stg-nav-active' : ''}`}
                onClick={() => setActiveSection(s.id)}
              >
                <Icon size={16} />
                <span>{s.label}</span>
                <ChevronRight size={14} className="stg-nav-arrow" />
              </button>
            );
          })}
        </nav>

        {/* Content */}
        <div className="stg-content sdp-card">

          {activeSection === 'profile' && (
            <div className="stg-section">
              <h2 className="stg-section-title">Profile Information</h2>
              <p className="stg-section-sub">Update your personal details and student info.</p>

              {/* Avatar */}
              <div className="stg-avatar-row">
                <div className="stg-avatar">A</div>
                <button className="stg-avatar-btn"><Camera size={14} /> Change Photo</button>
              </div>

              <div className="stg-form-grid">
                <div className="stg-field">
                  <label className="stg-label">Full Name</label>
                  <input className="stg-input" value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div className="stg-field">
                  <label className="stg-label">Email Address</label>
                  <input className="stg-input" value={email} onChange={e => setEmail(e.target.value)} type="email" />
                </div>
                <div className="stg-field">
                  <label className="stg-label">Grade</label>
                  <select className="stg-input" value={grade} onChange={e => setGrade(e.target.value)}>
                    {['Grade 9','Grade 10','Grade 11','Grade 12','Grade 13'].map(g => <option key={g}>{g}</option>)}
                  </select>
                </div>
                <div className="stg-field">
                  <label className="stg-label">Section</label>
                  <select className="stg-input" value={section} onChange={e => setSection(e.target.value)}>
                    {['Section A','Section B','Section C'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <button className="stg-save-btn" onClick={handleSave}>
                {saved ? '✓ Saved!' : 'Save Changes'}
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
                  { label: 'Push Notifications',  sub: 'Browser push alerts',       val: pushNotif,  set: setPushNotif  },
                  { label: 'Homework Reminders',  sub: 'Reminders before due dates', val: hwReminder, set: setHwReminder },
                ].map(item => (
                  <div key={item.label} className="stg-toggle-row">
                    <div>
                      <p className="stg-toggle-label">{item.label}</p>
                      <p className="stg-toggle-sub">{item.sub}</p>
                    </div>
                    <button
                      className={`stg-toggle ${item.val ? 'stg-toggle-on' : ''}`}
                      onClick={() => item.set(!item.val)}
                      aria-label={item.label}
                    >
                      <span className="stg-toggle-thumb" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'security' && (
            <div className="stg-section">
              <h2 className="stg-section-title">Security</h2>
              <p className="stg-section-sub">Keep your account safe.</p>
              <div className="stg-form-grid">
                <div className="stg-field stg-full">
                  <label className="stg-label">Current Password</label>
                  <input className="stg-input" type="password" placeholder="••••••••" />
                </div>
                <div className="stg-field">
                  <label className="stg-label">New Password</label>
                  <input className="stg-input" type="password" placeholder="••••••••" />
                </div>
                <div className="stg-field">
                  <label className="stg-label">Confirm New Password</label>
                  <input className="stg-input" type="password" placeholder="••••••••" />
                </div>
              </div>
              <button className="stg-save-btn" onClick={handleSave}>{saved ? '✓ Updated!' : 'Update Password'}</button>
            </div>
          )}

          {activeSection === 'appear' && (
            <div className="stg-section">
              <h2 className="stg-section-title">Appearance</h2>
              <p className="stg-section-sub">Customize your dashboard look.</p>
              <div className="stg-appear-grid">
                {['Light', 'Dark', 'System'].map(t => (
                  <button key={t} className={`stg-theme-card ${t === 'Light' ? 'stg-theme-active' : ''}`}>
                    <div className={`stg-theme-preview stg-preview-${t.toLowerCase()}`} />
                    <span className="stg-theme-label">{t}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'language' && (
            <div className="stg-section">
              <h2 className="stg-section-title">Language & Region</h2>
              <p className="stg-section-sub">Set your preferred language.</p>
              <div className="stg-form-grid">
                <div className="stg-field">
                  <label className="stg-label">Language</label>
                  <select className="stg-input">
                    <option>English</option>
                    <option>Sinhala</option>
                    <option>Tamil</option>
                  </select>
                </div>
                <div className="stg-field">
                  <label className="stg-label">Timezone</label>
                  <select className="stg-input">
                    <option>Asia/Colombo (UTC+5:30)</option>
                    <option>UTC</option>
                  </select>
                </div>
              </div>
              <button className="stg-save-btn" onClick={handleSave}>{saved ? '✓ Saved!' : 'Save'}</button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
