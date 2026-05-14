'use client'

import { useState } from 'react'
import { Mail, MapPin, Phone, Send } from 'lucide-react'
import { useLanguage } from './LanguageProvider'

type FormState = {
  name: string
  email: string
  phone: string
  message: string
}

const initialForm: FormState = {
  name: '',
  email: '',
  phone: '',
  message: '',
}

export default function ContactSection() {
  const [form, setForm] = useState<FormState>(initialForm)
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [notice, setNotice] = useState('')
  const { isSinhala } = useLanguage()

  const updateField = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('sending')
    setNotice('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(data.error ?? 'Message could not be sent.')
      }

      setForm(initialForm)
      setStatus('success')
      setNotice('Your message has been sent. We will contact you soon.')
    } catch (error) {
      setStatus('error')
      setNotice(error instanceof Error ? error.message : 'Message could not be sent.')
    }
  }

  const contactItems = [
    {
      href: 'tel:+94705281466',
      icon: <Phone className="h-5 w-5" />,
      bg: 'bg-blue-600',
      label: isSinhala ? 'දුරකථන' : 'Phone',
      value: '070 528 1466',
      isLink: true,
    },
    {
      href: 'mailto:info@siyowin.lk',
      icon: <Mail className="h-5 w-5" />,
      bg: 'bg-[#D9232D]',
      label: isSinhala ? 'ඊමේල්' : 'Email',
      value: 'info@siyowin.lk',
      isLink: true,
    },
    {
      href: undefined,
      icon: <MapPin className="h-5 w-5" />,
      bg: 'bg-[#F47920]',
      label: isSinhala ? 'ශාඛා' : 'Branches',
      value: 'Palladeniya Road & Behind Commercial Bank, Kegalle',
      isLink: false,
    },
  ]

  return (
    <section id="contact" className="scroll-mt-20 bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-12 text-center">
          <span className="inline-flex items-center rounded-full bg-red-50 border border-red-100 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-[#D9232D]">
            {isSinhala ? 'සම්බන්ධ වන්න' : 'Contact'}
          </span>
          <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            {isSinhala ? 'Siyowin සමඟ' : 'Talk to'}{' '}
            <span className="bg-gradient-to-r from-[#D9232D] to-[#F47920] bg-clip-text text-transparent">
              {isSinhala ? 'සම්බන්ධ වන්න' : 'Siyowin'}
            </span>
          </h2>
          <p className="mt-3 mx-auto max-w-xl text-base leading-7 text-gray-500">
            {isSinhala
              ? 'පන්ති, කාලසටහන්, ලියාපදිංචි වීම හෝ LMS පිවිසුම පිළිබඳ ඔබගේ ප්‍රශ්නය අපට යොමු කරන්න.'
              : 'Send your question about classes, timetables, admissions, or LMS access. The message will be delivered to our office email.'}
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          {/* Contact cards */}
          <div className="flex flex-col gap-4">
            {contactItems.map((item) =>
              item.isLink ? (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 transition-all duration-200 hover:border-slate-200 hover:bg-white hover:shadow-md hover:shadow-black/5 hover:-translate-y-px"
                >
                  <span className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl ${item.bg} text-white shadow-sm`}>
                    {item.icon}
                  </span>
                  <span>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500">{item.label}</span>
                    <span className="font-bold text-slate-900">{item.value}</span>
                  </span>
                </a>
              ) : (
                <div
                  key={item.label}
                  className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4"
                >
                  <span className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl ${item.bg} text-white shadow-sm`}>
                    {item.icon}
                  </span>
                  <span>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500">{item.label}</span>
                    <span className="font-bold text-slate-900">{item.value}</span>
                  </span>
                </div>
              )
            )}
          </div>

          {/* Contact form */}
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xl shadow-slate-900/5 sm:p-8"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">{isSinhala ? 'නම' : 'Name'}</span>
                <input
                  value={form.name}
                  onChange={(event) => updateField('name', event.target.value)}
                  required
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#D9232D] focus:bg-white focus:ring-2 focus:ring-red-100"
                  placeholder={isSinhala ? 'ඔබගේ නම' : 'Your name'}
                />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">{isSinhala ? 'ඊමේල්' : 'Email'}</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => updateField('email', event.target.value)}
                  required
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#D9232D] focus:bg-white focus:ring-2 focus:ring-red-100"
                  placeholder="you@example.com"
                />
              </label>
            </div>

            <label className="mt-4 block">
              <span className="text-sm font-semibold text-slate-700">{isSinhala ? 'දුරකථන' : 'Phone'}</span>
              <input
                value={form.phone}
                onChange={(event) => updateField('phone', event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#D9232D] focus:bg-white focus:ring-2 focus:ring-red-100"
                placeholder={isSinhala ? 'අවශ්‍ය නම්' : 'Optional'}
              />
            </label>

            <label className="mt-4 block">
              <span className="text-sm font-semibold text-slate-700">{isSinhala ? 'පණිවිඩය' : 'Message'}</span>
              <textarea
                value={form.message}
                onChange={(event) => updateField('message', event.target.value)}
                required
                rows={5}
                className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#D9232D] focus:bg-white focus:ring-2 focus:ring-red-100"
                placeholder={isSinhala ? 'ඔබට අවශ්‍ය දේ ලියන්න...' : 'Tell us what you need...'}
              />
            </label>

            {notice ? (
              <p className={`mt-4 rounded-xl px-4 py-3 text-sm ${status === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                {notice}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={status === 'sending'}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#D9232D] to-[#F47920] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-300/20 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-300/30 disabled:cursor-not-allowed disabled:opacity-70 active:scale-95"
            >
              {status === 'sending' ? (isSinhala ? 'යවමින්...' : 'Sending...') : (isSinhala ? 'පණිවිඩය යවන්න' : 'Send Message')}
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
