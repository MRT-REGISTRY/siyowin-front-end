'use client'

import { useState } from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'
import { useLanguage } from './LanguageProvider'

const faqs = [
  {
    question: 'What classes are available at Siyowin?',
    answer:
      'Siyowin conducts classes for students from Grade 1 to Grade 13, including O/L, A/L, revision classes, paper classes, and selected open courses.',
  },
  {
    question: 'Where is Siyowin located?',
    answer:
      'Siyowin is located in Kegalle, with branches at Palladeniya Road, Kegalle, and behind Commercial Bank, Kegalle.',
  },
  {
    question: 'Who should I contact for website-related technical problems?',
    answer:
      'For website-related technical issues, login errors, page loading problems, or other online support needs, please contact the technical support team via +94 77 159 5616.',
  },
]

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const { isSinhala } = useLanguage()
  const visibleFaqs = isSinhala
    ? [
        {
          question: 'Siyowin හි තිබෙන පන්ති මොනවාද?',
          answer: 'Siyowin හි Grade 1 සිට Grade 13 දක්වා පන්ති, O/L, A/L, revision classes, paper classes සහ තෝරාගත් open courses පැවැත්වේ.',
        },
        {
          question: 'Siyowin පිහිටා තිබෙන්නේ කොහේද?',
          answer: 'Siyowin කෑගල්ලේ පිහිටා ඇත. ශාඛා Palladeniya Road, Kegalle සහ Commercial Bank පිටුපස, Kegalle යන ස්ථානවල ඇත.',
        },
        {
          question: 'වෙබ් අඩවිය සම්බන්ධ තාක්ෂණික ගැටළු සඳහා කාට සම්බන්ධ විය යුතුද?',
          answer: 'වෙබ් අඩවිය, login ගැටළු, පිටු load වීමේ ගැටළු හෝ online support සඳහා +94 77 159 5616 අංකයෙන් තාක්ෂණික සහාය කණ්ඩායම අමතන්න.',
        },
      ]
    : faqs

  return (
    <section id="faq" className="scroll-mt-20 bg-gradient-to-b from-white to-slate-50 py-20 lg:py-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-100 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-blue-600">
            <HelpCircle className="h-3.5 w-3.5" />
            {isSinhala ? 'නිතර අසන ප්‍රශ්න' : 'FAQ'}
          </span>
          <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            {isSinhala ? 'සාමාන්‍ය' : 'Common'}{' '}
            <span className="bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent">
              {isSinhala ? 'ප්‍රශ්න' : 'Questions'}
            </span>
          </h2>
        </div>

        <div className="space-y-4">
          {visibleFaqs.map((faq, index) => {
            const isOpen = openIndex === index

            return (
              <article
                key={faq.question}
                className={`overflow-hidden rounded-2xl border transition-all duration-200 ${
                  isOpen
                    ? 'border-red-200 bg-white shadow-md shadow-red-50'
                    : 'border-slate-200 bg-white shadow-sm hover:border-slate-300 hover:shadow'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 p-6 text-left"
                  aria-expanded={isOpen}
                >
                  <span className={`text-lg font-bold transition-colors duration-200 ${isOpen ? 'text-[#D9232D]' : 'text-slate-900'}`}>
                    {faq.question}
                  </span>
                  <span className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                    isOpen ? 'bg-red-50 text-[#D9232D]' : 'bg-slate-100 text-slate-500'
                  }`}>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </span>
                </button>

                <div
                  className={`grid transition-all duration-300 ease-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                >
                  <div className="overflow-hidden">
                    <p className="border-t border-slate-100 px-6 pb-6 pt-5 text-base leading-7 text-slate-600">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
