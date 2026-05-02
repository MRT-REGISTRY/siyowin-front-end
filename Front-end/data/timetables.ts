import { BookOpen, GraduationCap, Medal, type LucideIcon } from 'lucide-react'

export type TimetableLevel = 'ol' | 'al' | 'scholarship'

export type TimetableClass = {
  id: string
  teacher: string
  subject: string
  classDetails: string[]
}

export type TimetableGroup = {
  id: TimetableLevel
  title: string
  shortTitle: string
  description: string
  href: string
  icon: LucideIcon
  classes: TimetableClass[]
}

export const timetableGroups: TimetableGroup[] = [
  {
    id: 'ol',
    title: 'O/L Classes Timetable',
    shortTitle: 'O/L',
    description: 'Grade 6-11 and O/L exam preparation schedules by subject teacher.',
    href: '/timetable/ol',
    icon: BookOpen,
    classes: [
      {
        id: 'ol-maths',
        teacher: 'Rukshan Kulakumara',
        subject: 'O/L Maths',
        classDetails: ['Grade 6-11 theory and revision', 'Paper discussion and model exam practice'],
      },
      {
        id: 'ol-science',
        teacher: 'Pradeep Sudusingha',
        subject: 'O/L Science',
        classDetails: ['Theory, practical concepts, and short notes', 'Term test and O/L past paper preparation'],
      },
      {
        id: 'ol-english',
        teacher: 'Nalaka Pradeep',
        subject: 'O/L English',
        classDetails: ['Grammar, writing, and comprehension', 'Exam-focused paper classes'],
      },
    ],
  },
  {
    id: 'al',
    title: 'A/L Classes Timetable',
    shortTitle: 'A/L',
    description: 'Technology, Arts, Commerce, and subject revision class schedules.',
    href: '/timetable/al',
    icon: GraduationCap,
    classes: [
      {
        id: 'al-et',
        teacher: 'Sanjeewa Siriwardhana',
        subject: 'A/L ET',
        classDetails: ['Technology stream theory classes', 'Revision and structured paper practice'],
      },
      {
        id: 'al-sft',
        teacher: 'Akila Jayawardhana',
        subject: 'A/L SFT',
        classDetails: ['Core theory and calculation practice', 'Exam preparation and monthly tests'],
      },
      {
        id: 'al-commerce',
        teacher: 'Lahiru Dilumgoda',
        subject: 'A/L Accounting',
        classDetails: ['Commerce stream theory classes', 'Revision and marking scheme discussion'],
      },
    ],
  },
  {
    id: 'scholarship',
    title: 'Scholarship Classes Timetable',
    shortTitle: 'Scholarship',
    description: 'Grade 3-5 scholarship preparation schedules and practice sessions.',
    href: '/timetable/scholarship',
    icon: Medal,
    classes: [
      {
        id: 'scholarship-jagath',
        teacher: 'Jagath Maliyadda',
        subject: 'Grade 3-5 Scholarship',
        classDetails: ['Foundation lessons and activity-based practice', 'Model papers, speed practice, and discussion'],
      },
    ],
  },
]

export const timetableUpdateMessage =
  'The complete timetable is being revised and will be added here soon with final dates, times, and hall details.'

export const getTimetableGroup = (id: string) =>
  timetableGroups.find((group) => group.id === id)
