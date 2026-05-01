import { SiteLecturerSection } from '@/types/siteContent'

export type TeacherCategory = 'ol' | 'al' | 'scholarship'

export type TeacherProfile = {
  id: number
  name: string
  subject: string
  credentials: string
  experience: string
  about: string
  category: TeacherCategory
  photoBg: string
  infoBg: string
  accent: string
  initials: string
  photo?: string
}

type TeacherSeed = {
  name: string
  subject: string
  category: TeacherCategory
  notes?: string
  photo?: string
}

const palette = [
  { photoBg: '#dfb08f', infoBg: '#dceee5', accent: '#1fac74' },
  { photoBg: '#ecd681', infoBg: '#eee8dc', accent: '#f28a1f' },
  { photoBg: '#fb8fa0', infoBg: '#e8fbff', accent: '#08a7cc' },
  { photoBg: '#8d93ef', infoBg: '#e3dde5', accent: '#a761dd' },
  { photoBg: '#b6e58d', infoBg: '#dfe8ee', accent: '#3c86e8' },
]

const teachersSeed: TeacherSeed[] = [
  { name: 'Rukshan Kulakumara', subject: 'O/L Maths', category: 'ol', photo: '/teachers/rukshan_kulakuamara.webp' },
  { name: 'Pradeep Sudusingha', subject: 'O/L Science', category: 'ol', photo: '/teachers/pradeep sudusinghe.jpg' },
  { name: 'Nalaka Pradeep', subject: 'O/L English', category: 'ol', photo: '/teachers/Nalaka Pradeep.jpg' },
  { name: 'Shiva Sir', subject: 'O/L Tamil', category: 'ol' },
  { name: 'Rohitha Dissanayake', subject: 'O/L Sinhala', category: 'ol', photo: '/teachers/rohitha dissanayake .jpg' },
  { name: 'Charitha Bandara', subject: 'O/L ICT', category: 'ol', photo: '/teachers/Charitha Bandara.jpg' },
  { name: 'Dudeep Priyantha', subject: 'O/L Sinhala', category: 'ol' },
  { name: 'Akila Jayawardhana', subject: 'A/L SFT (Technology Stream)', category: 'al', photo: '/teachers/Akila Jayawardhana.jpg' },
  { name: 'Sanjeewa Siriwardhana', subject: 'A/L ET (Technology Stream)', category: 'al', photo: '/teachers/Sanjeewa Siriwardhana.jpg' },
  { name: 'Suraj S. Kumara', subject: 'A/L ICT (Technology Stream)', category: 'al' },
  { name: 'Malaka Thalduwa', subject: 'A/L Sinhala (Arts Stream)', category: 'al' },
  { name: 'Chamula Nuwanperuma', subject: 'A/L Media (Arts Stream)', category: 'al' },
  { name: 'Kanishka Madhuwara', subject: 'A/L Geography (Arts Stream)', category: 'al' },
  { name: 'Tharindu Rajapaksha', subject: 'A/L History (Arts Stream)', category: 'al' },
  { name: 'Vishula Gunawardhana', subject: 'A/L Political Science (Arts Stream)', category: 'al' },
  { name: 'Dilshan S. Pathirana', subject: 'A/L BC (Arts Stream)', category: 'al' },
  { name: 'Hashika Thilakarathne', subject: 'A/L Combined Mathematics', category: 'al' },
  { name: 'Shalani Ranasinghe', subject: 'A/L German Language & Literature', category: 'al' },
  { name: 'Lahiru Dilumgoda', subject: 'A/L Accounting (Commerce Stream)', category: 'al' },
  { name: 'Nila Welikala', subject: 'A/L Business Studies (Commerce Stream)', category: 'al' },
  { name: 'Udaya Sampath', subject: 'A/L Economics (Commerce Stream)', category: 'al' },
  { name: 'Jagath Maliyadda', subject: 'Grade 3-5 Scholarship', category: 'scholarship', notes: 'Scholarship lecturer', photo: '/teachers/jagath maliyadda.jpg' },
]

const getInitials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

const getLevelLabel = (category: TeacherCategory) => {
  if (category === 'ol') return 'O/L teacher'
  if (category === 'al') return 'A/L teacher'
  return 'Scholarship lecturer'
}

export const teacherDirectory: TeacherProfile[] = teachersSeed.map((teacher, index) => {
  const paletteEntry = palette[index % palette.length]
  const credentials = teacher.notes ?? `${teacher.subject} classes and exam preparation`

  return {
    id: index + 1,
    name: teacher.name,
    subject: teacher.subject,
    category: teacher.category,
    credentials,
    experience: getLevelLabel(teacher.category),
    about: `${teacher.name} leads ${teacher.subject} lessons with structured guidance and consistent practice.`,
    initials: getInitials(teacher.name),
    photo: teacher.photo,
    photoBg: paletteEntry.photoBg,
    infoBg: paletteEntry.infoBg,
    accent: paletteEntry.accent,
  }
})

const toLecturer = (teacher: TeacherProfile) => ({
  id: teacher.id,
  name: teacher.name,
  subject: teacher.subject,
  credentials: teacher.credentials,
  image: teacher.photo ?? '/teachers/lec_placeholder.jpg',
  photoBg: teacher.photoBg,
  infoBg: teacher.infoBg,
  accent: teacher.accent,
})

const sortByPreferredOrder = (
  teachers: TeacherProfile[],
  frontNames: string[] = [],
  backNames: string[] = []
) => {
  const frontSet = new Set(frontNames)
  const backSet = new Set(backNames)

  const front = frontNames
    .map((name) => teachers.find((teacher) => teacher.name === name))
    .filter(Boolean) as TeacherProfile[]
  const back = backNames
    .map((name) => (frontSet.has(name) ? undefined : teachers.find((teacher) => teacher.name === name)))
    .filter(Boolean) as TeacherProfile[]
  const middle = teachers.filter((teacher) => !frontSet.has(teacher.name) && !backSet.has(teacher.name))

  return [...front, ...middle, ...back]
}

export const lecturerSections: SiteLecturerSection[] = [
  {
    id: 1,
    title: 'O/L',
    highlight: 'Teachers',
    description: 'Focused O/L subject guidance and exam preparation.',
    viewAllHref: '/teachers',
    lecturers: sortByPreferredOrder(
      teacherDirectory.filter((teacher) => teacher.category === 'ol'),
      ['Rukshan Kulakumara', 'Nalaka Pradeep'],
      ['Pradeep Sudusingha']
    ).map(toLecturer),
  },
  {
    id: 2,
    title: 'A/L',
    highlight: 'Teachers',
    description: 'Technology, Arts, and Commerce stream specialists.',
    viewAllHref: '/teachers',
    lecturers: sortByPreferredOrder(
      teacherDirectory.filter((teacher) => teacher.category === 'al'),
      ['Sanjeewa Siriwardhana']
    ).map(toLecturer),
  },
]
