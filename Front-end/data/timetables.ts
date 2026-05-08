import { BookOpen, GraduationCap, Medal, type LucideIcon } from 'lucide-react'
import { teacherDirectory, type TeacherProfile } from './teachers'

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

export const branchLabels = {
  C: 'Behind the Commercial Bank branch',
  P: 'Palladeniya Road branch',
}

const fallbackClassDetails: Record<string, string[]> = {
  'Rukshan Kulakumara': ['Grade 6-11 theory and revision', 'Paper discussion and model exam practice'],
  'Pradeep Sudusingha': ['Theory, practical concepts, and short notes', 'Term test and O/L past paper preparation'],
  'Nalaka Pradeep': ['Grammar, writing, and comprehension', 'Exam-focused paper classes'],
  'Akila Jayawardhana': ['Core theory and calculation practice', 'Exam preparation and monthly tests'],
  'Jagath Maliyadda': ['Foundation lessons and activity-based practice', 'Model papers, speed practice, and discussion'],
}

const toSlug = (value: string, fallback: string) => {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  return slug || fallback
}

const expandBranchCode = (detail: string) => {
  const trimmed = detail.trim()
  const match = trimmed.match(/\s*-\s*([CP])\s*$/i)

  if (!match || match.index === undefined) return trimmed

  const code = match[1].toUpperCase() as keyof typeof branchLabels
  return `${trimmed.slice(0, match.index).trim()} - ${branchLabels[code]}`
}

const splitSchedule = (schedule?: string) =>
  schedule
    ?.split('\n')
    .map((detail) => expandBranchCode(detail))
    .filter(Boolean) ?? []

const getClassDetails = (teacher: TeacherProfile) => {
  const scheduleDetails = splitSchedule(teacher.schedule)
  const details = scheduleDetails.length > 0
    ? scheduleDetails
    : fallbackClassDetails[teacher.name] ?? ['Class schedule will be announced soon.']

  return [
    ...(teacher.medium ? [`Medium: ${teacher.medium}`] : []),
    ...details,
  ]
}

const toTimetableClass = (teacher: TeacherProfile, index: number): TimetableClass => ({
  id: `${teacher.category}-${toSlug(teacher.name, `teacher-${index + 1}`)}`,
  teacher: teacher.name,
  subject: teacher.subject,
  classDetails: getClassDetails(teacher),
})

const classesByLevel = (level: TimetableLevel) =>
  teacherDirectory
    .filter((teacher) => teacher.category === level)
    .map(toTimetableClass)

export const timetableGroups: TimetableGroup[] = [
  {
    id: 'ol',
    title: 'O/L Classes Timetable',
    shortTitle: 'O/L',
    description: 'Grade 6-11 and O/L exam preparation schedules by subject teacher.',
    href: '/timetable/ol',
    icon: BookOpen,
    classes: classesByLevel('ol'),
  },
  {
    id: 'al',
    title: 'A/L Classes Timetable',
    shortTitle: 'A/L',
    description: 'Technology, Arts, Commerce, and subject revision class schedules.',
    href: '/timetable/al',
    icon: GraduationCap,
    classes: classesByLevel('al'),
  },
  {
    id: 'scholarship',
    title: 'Scholarship Classes Timetable',
    shortTitle: 'Scholarship',
    description: 'Grade 3-5 scholarship preparation schedules and practice sessions.',
    href: '/timetable/scholarship',
    icon: Medal,
    classes: classesByLevel('scholarship'),
  },
]

export const getTimetableGroup = (id: string) =>
  timetableGroups.find((group) => group.id === id)
