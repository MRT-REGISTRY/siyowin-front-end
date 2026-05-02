'use client';

import { useEffect, useState } from 'react';
import { Bell, ChevronRight, Globe, Lock, Palette, ShieldCheck, User } from 'lucide-react';
import { StudentProfile } from '@/types';
import { useLanguage } from '@/components/LanguageProvider';

const SECTIONS = [
  { id: 'profile', label: 'Profile', sinhalaLabel: 'පැතිකඩ', icon: User },
  { id: 'notif', label: 'Notifications', sinhalaLabel: 'දැනුම්දීම්', icon: Bell },
  { id: 'security', label: 'Security', sinhalaLabel: 'ආරක්ෂාව', icon: Lock },
  { id: 'appear', label: 'Appearance', sinhalaLabel: 'පෙනුම', icon: Palette },
  { id: 'language', label: 'Language', sinhalaLabel: 'භාෂාව', icon: Globe },
];

export default function SettingsPage({ profile }: { profile: StudentProfile | null }) {
  const { isSinhala, toggleLanguage } = useLanguage();
  const [activeSection, setActiveSection] = useState('profile');
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);
  const [hwReminder, setHwReminder] = useState(true);
  const [theme, setTheme] = useState('Light');
  const [timezone, setTimezone] = useState('Asia/Colombo (UTC+5:30)');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const rawPreferences = window.localStorage.getItem('student-dashboard-preferences');
    if (!rawPreferences) return;

    try {
      const preferences = JSON.parse(rawPreferences) as {
        emailNotif?: boolean;
        pushNotif?: boolean;
        hwReminder?: boolean;
        theme?: string;
        timezone?: string;
      };
      setEmailNotif(preferences.emailNotif ?? true);
      setPushNotif(preferences.pushNotif ?? true);
      setHwReminder(preferences.hwReminder ?? true);
      setTheme(preferences.theme ?? 'Light');
      setTimezone(preferences.timezone ?? 'Asia/Colombo (UTC+5:30)');
    } catch {
      window.localStorage.removeItem('student-dashboard-preferences');
    }
  }, []);

  const handlePreferenceSave = () => {
    window.localStorage.setItem('student-dashboard-preferences', JSON.stringify({
      emailNotif,
      pushNotif,
      hwReminder,
      theme,
      timezone,
    }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="sdp-wrap">
      <div className="sdp-header">
        <div>
          <h1 className="sdp-title">{isSinhala ? 'සැකසුම්' : 'Settings'}</h1>
          <p className="sdp-sub">
            {isSinhala ? 'ඔබගේ ගිණුම් තොරතුරු සහ මනාප බලන්න.' : 'View your account details and manage dashboard preferences.'}
          </p>
        </div>
      </div>

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
                <span>{isSinhala ? s.sinhalaLabel : s.label}</span>
                <ChevronRight size={14} className="stg-nav-arrow" />
              </button>
            );
          })}
        </nav>

        <div className="stg-content sdp-card">
          {activeSection === 'profile' && (
            <div className="stg-section">
              <h2 className="stg-section-title">{isSinhala ? 'පැතිකඩ තොරතුරු' : 'Profile Information'}</h2>
              <p className="stg-section-sub">
                {isSinhala
                  ? 'සිසුන්ගේ පැතිකඩ තොරතුරු ආයතනය විසින් කළමනාකරණය කෙරේ. ඡායාරූප එකතු කිරීම අනාගත යාවත්කාලීනයකි.'
                  : 'Student profile data is managed by the institute. Photo collection is planned for a future update.'}
              </p>

              <div className="stg-form-grid">
                <ReadOnlyField label={isSinhala ? 'සම්පූර්ණ නම' : 'Full Name'} value={profile?.name ?? ''} />
                <ReadOnlyField label={isSinhala ? 'ඊමේල් ලිපිනය' : 'Email Address'} value={profile?.email ?? ''} />
                <ReadOnlyField label={isSinhala ? 'ශ්‍රේණිය' : 'Grade'} value={profile?.grade ?? ''} />
                <ReadOnlyField label={isSinhala ? 'පන්තිය' : 'Class'} value={profile?.classId?.toUpperCase() ?? ''} />
              </div>
            </div>
          )}

          {activeSection === 'notif' && (
            <div className="stg-section">
              <h2 className="stg-section-title">{isSinhala ? 'දැනුම්දීම්' : 'Notifications'}</h2>
              <p className="stg-section-sub">{isSinhala ? 'ඔබට ලැබෙන දැනුම්දීම් තෝරන්න.' : 'Choose what alerts you receive.'}</p>
              <div className="stg-toggle-list">
                {[
                  { label: isSinhala ? 'ඊමේල් දැනුම්දීම්' : 'Email Notifications', sub: isSinhala ? 'ඊමේල් මඟින් යාවත්කාලීන ලබාගන්න' : 'Receive updates via email', val: emailNotif, set: setEmailNotif },
                  { label: isSinhala ? 'Push දැනුම්දීම්' : 'Push Notifications', sub: isSinhala ? 'Browser alerts ලබාගන්න' : 'Browser push alerts', val: pushNotif, set: setPushNotif },
                  { label: isSinhala ? 'ගෙදර වැඩ මතක් කිරීම්' : 'Homework Reminders', sub: isSinhala ? 'අවසන් දිනයට පෙර මතක් කිරීම්' : 'Reminders before due dates', val: hwReminder, set: setHwReminder },
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
              <SaveButton saved={saved} isSinhala={isSinhala} onClick={handlePreferenceSave} />
            </div>
          )}

          {activeSection === 'security' && (
            <div className="stg-section">
              <h2 className="stg-section-title">{isSinhala ? 'ආරක්ෂාව' : 'Security'}</h2>
              <p className="stg-section-sub">
                {isSinhala
                  ? 'සිසුන්ට තමන්ගේ මුරපදය වෙනස් කළ නොහැක. මුරපද නැවත සැකසීම ආයතනයේ account admin විසින් කළමනාකරණය කරයි.'
                  : 'Students cannot change their own password. Password resets are managed by the institute account admin.'}
              </p>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                  <p className="text-sm leading-6 text-slate-700">
                    {isSinhala
                      ? 'Login ගැටළු හෝ password reset අවශ්‍ය නම් ආයතනය හෝ තාක්ෂණික සහාය කණ්ඩායම අමතන්න.'
                      : 'For login issues or password reset requests, contact the institute or technical support team.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'appear' && (
            <div className="stg-section">
              <h2 className="stg-section-title">{isSinhala ? 'පෙනුම' : 'Appearance'}</h2>
              <p className="stg-section-sub">{isSinhala ? 'ඔබගේ dashboard පෙනුම තෝරන්න.' : 'Customize your dashboard look.'}</p>
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
              <SaveButton saved={saved} isSinhala={isSinhala} onClick={handlePreferenceSave} />
            </div>
          )}

          {activeSection === 'language' && (
            <div className="stg-section">
              <h2 className="stg-section-title">{isSinhala ? 'භාෂාව සහ කලාපය' : 'Language & Region'}</h2>
              <p className="stg-section-sub">{isSinhala ? 'ඔබගේ කැමති භාෂාව සහ කාල කලාපය තෝරන්න.' : 'Set your preferred language and timezone.'}</p>
              <div className="stg-form-grid">
                <div className="stg-field">
                  <label className="stg-label">{isSinhala ? 'භාෂාව' : 'Language'}</label>
                  <button type="button" className="stg-input text-left" onClick={toggleLanguage}>
                    {isSinhala ? 'සිංහල' : 'English'}
                  </button>
                </div>
                <div className="stg-field">
                  <label className="stg-label">{isSinhala ? 'කාල කලාපය' : 'Timezone'}</label>
                  <select className="stg-input" value={timezone} onChange={(event) => setTimezone(event.target.value)}>
                    <option>Asia/Colombo (UTC+5:30)</option>
                    <option>UTC</option>
                  </select>
                </div>
              </div>
              <SaveButton saved={saved} isSinhala={isSinhala} onClick={handlePreferenceSave} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="stg-field">
      <label className="stg-label">{label}</label>
      <input className="stg-input" value={value || '-'} readOnly />
    </div>
  );
}

function SaveButton({ saved, isSinhala, onClick }: { saved: boolean; isSinhala: boolean; onClick: () => void }) {
  return (
    <button className="stg-save-btn" type="button" onClick={onClick}>
      {saved ? (isSinhala ? 'සුරකින ලදී' : 'Saved') : (isSinhala ? 'සුරකින්න' : 'Save')}
    </button>
  );
}
