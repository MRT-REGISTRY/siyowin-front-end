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
  medium?: string
  schedule?: string
  qualifications?: string
  whatsapp?: string
  email?: string
}

type TeacherSeed = {
  name: string
  subject: string
  category: TeacherCategory
  credentials?: string
  experience?: string
  about?: string
  medium?: string
  schedule?: string
  qualifications?: string
  whatsapp?: string
  email?: string
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
  {
    name: 'Charitha Bandara',
    subject: 'O/L ICT',
    category: 'ol',
    credentials: 'Diploma in Education',
    qualifications: 'Diploma in Education',
    experience: '15 years',
    medium: 'Sinhala Medium, English Medium',
    schedule: 'Grade 11 - Monday - 2.30 PM - Rs. 1200 - C\nGrade 10 - Tuesday - 2.30 PM - Rs. 1000 - P\nGrade 6 - Sunday - 1.15 PM - Rs. 1000 - P\nGrade 7 - Sunday - 3.15 PM - Rs. 1000 - P\nGrade 8 and 9 - Wednesday - 2.30 PM - Rs. 1000 - P',
    about: 'I am a dedicated ICT educator driven by the belief that digital literacy is the most powerful tool a student can own. I bridge the gap between complex technical theory and real-world application, helping students transition from being passive users of technology to active creators.',
    whatsapp: '0774009599',
    email: 'charithab86@gmail.com',
    photo: '/teachers/1777785482574 - charitha bandara.png',
  },
  { name: 'Dudeep Priyantha', subject: 'O/L Sinhala', category: 'ol' },
  { name: 'Akila Jayawardhana', subject: 'A/L SFT (Technology Stream)', category: 'al', photo: '/teachers/Akila Jayawardhana.jpg' },
  {
    name: 'Sanjeewa Siriwardana',
    subject: 'A/L Engineering Technology - ET',
    category: 'al',
    credentials: 'B.Tech in Mechatronics Technology',
    qualifications: 'B.Tech in Mechatronics Technology, University of Vocational Technology - Ratmalana',
    experience: '5 years',
    medium: 'Sinhala Medium',
    schedule: '2028 A/L Theory - Saturday - 8.00 AM - Rs. 2700\n2027 A/L Theory - Saturday - 10.30 AM - Rs. 2200\n2026 A/L Theory - Tuesday - 8.00 AM - Rs. 2000\n2026 A/L Revision - Thursday - 8.00 AM - Rs. 1500',
    about: 'Providing practical and theoretical knowledge in Technology Education.',
    whatsapp: '+94788241212',
    email: 'shalika.sanjeewa.siriwardhana@gmail.com',
    photo: '/teachers/IMG-20260126-WA0018 - Sanjeewa Siriwardana.jpg',
  },
  { name: 'Suraj S. Kumara', subject: 'A/L ICT (Technology Stream)', category: 'al' },
  {
    name: 'හේමාලෝක හාමුදුරුවෝ',
    subject: 'A/L Sinhala',
    category: 'al',
    credentials: 'අධ්‍යාපනවේදී, රාජකීය පණ්ඩිත',
    qualifications: 'අධ්‍යාපනවේදී (පේරාදෙණිය විශ්වවිද්‍යාලය)\nරාජකීය පණ්ඩිත (ප්‍රා.භා. ස.)',
    experience: 'අවුරුදු 10ක්',
    medium: 'Sinhala Medium',
    schedule: '2026 Theory - සෙනසුරාදා - ප.ව. 1.00-3.00\n2026 Revision - බ්‍රහස්පතින්දා - ප.ව. 2.30-5.00\n2027 Theory - සෙනසුරාදා - ප.ව. 3.00-5.00\n2028 Theory - අඟහරුවාදා - ප.ව. 2.45-5.00',
    about: 'සරසවියට පාර කියන භාෂාවේ අරුණාලෝකය',
    whatsapp: '0711360062',
    email: 'bhashawearunalokaya@gmail.com',
    photo: '/teachers/IMG_20260307_013821 - Ven_ Puwakpitiye Hemaloka.jpg',
  },
  {
    name: 'Upul Mannapperuma',
    subject: 'A/L Media',
    category: 'al',
    credentials: 'BA (Special) Mass Communication',
    qualifications: 'BA (Special) Mass Communication, University of Kelaniya',
    experience: '15 years',
    medium: 'Sinhala Medium',
    schedule: '2027 A/L - Wednesday - 3.00 PM - Rs. 2500\n2028 A/L - Friday - 3.00 PM - Rs. 2500',
    whatsapp: '0707458443',
    email: 'upulmedia@gmail.com',
    photo: '/teachers/DSC03348 - upul mannapperuma.jpg',
  },
  {
    name: 'Kosala Bandara',
    subject: 'A/L Geography (Arts Stream)',
    category: 'al',
    credentials: 'BA (Special), MA Geography',
    qualifications: 'BA (Special), University of Kelaniya\nMA (Geography), University of Kelaniya\nPsychological Counseling H.Dip - MHF',
    experience: '5 years',
    medium: 'Sinhala Medium',
    schedule: '2026 A/L Theory - Saturday - 3.00-5.00 PM - Rs. 2000\n2026 A/L Revision - Monday - 8.30 AM-2.00 PM - Rs. 2200\n2026 Theory + Revision - Rs. 3200\n2027 Theory Group I - Thursday - 2.45-4.45 PM - Rs. 2200\n2027 Theory Group II - Sunday - 1.00-3.00 PM - Rs. 2200\n2028 Theory - Monday - 2.45-4.45 PM - Rs. 2500',
    about: 'සරසවියට යන නිසැක A සාමාර්ථය තහවුරු කරන ජාතියටම භූගෝල විද්‍යාව උගන්වන ඔබේ ගුරුවරයා',
    whatsapp: '0785726843',
    email: 'kosalabandara1996@gmail.com',
    photo: '/teachers/WED_2758 - kosala Bandara.jpg',
  },
  { name: 'Tharindu Rajapaksha', subject: 'A/L History (Arts Stream)', category: 'al' },
  {
    name: 'Vipul Gunawardhana',
    subject: 'A/L Political Science (Arts Stream)',
    category: 'al',
    credentials: 'BA (Special), MA, LLB',
    qualifications: 'BA (Special), University of Kelaniya\nMA\nLLB, Open University of Sri Lanka',
    experience: '8 years',
    medium: 'Sinhala Medium',
    schedule: 'Grade 12 (2028) - Sunday - 8.00 AM - Rs. 2500\nGrade 12 (2027) - Saturday - 1.00 PM - Rs. 2200\nGrade 13 (2026) Theory & Revision - Saturday - 8.00 AM - Rs. 3200',
    about: 'The teacher, a distinguished alumnus of St. Mary\'s College, Kegalle, has pursued higher education through the Universities of Kelaniya and Colombo. He is also a lawyer, having completed his Bachelor of Laws degree from the Open University. He has produced top Kegalle district results for many years and has helped students secure admission to Law School and university. He is known for a psychological and attractive teaching style, and produced District 14 in 2023, District 29 in 2024, and District 29 in 2025 for Political Science.',
    whatsapp: '0719016796',
    email: 'vipulgunawardhana5@gmail.com',
    photo: '/teachers/1777741524258 - Vipul Sir Political Science.jpg',
  },
  {
    name: 'Dilshan Pathirana',
    subject: 'A/L Buddhist Civilization (Arts Stream)',
    category: 'al',
    credentials: 'BA, Counseling Psychology, HRM',
    qualifications: 'BA, University of Peradeniya\nCounseling Psychology - IMBS\nHRM - Youth\nHR - University of Peradeniya',
    experience: '7 years',
    medium: 'Sinhala Medium',
    schedule: 'Grade 12 Theory - Thursday - 2.30 PM - Rs. 2200 - C\nGrade 13 Theory and Revision - Monday - 8.30 AM - Rs. 3200 - C',
    about: 'A Ganna BC Panthiya',
    whatsapp: '0711118591',
    email: 'www.dc1995@gmail.com',
    photo: '/teachers/SAVE_20260503_060647 - Dilhan C Pathirana.jpg',
  },
  { name: 'Hashika Thilakarathne', subject: 'A/L Combined Mathematics', category: 'al' },
  {
    name: 'Shalani Ranasinghe',
    subject: 'A/L German Language & Literature',
    category: 'al',
    credentials: 'B.A.',
    qualifications: 'B.A.',
    experience: '22 years',
    medium: 'Sinhala Medium, English Medium',
    schedule: '2027 A/L - Friday - 2.30-4.30 PM - Rs. 3000 - C',
    about: 'Teacher of German since 2004.',
    whatsapp: '0742788516',
    email: 'ranasingheshalani@gmail.com',
    photo: '/teachers/IMG-20231017-WA0027 - Shalani Ranasinghe.jpg',
  },
  {
    name: 'Lahiru Damunupola',
    subject: 'A/L Accounting (Commerce Stream)',
    category: 'al',
    credentials: 'BSc Finance (Special), CA Sri Lanka Business Level',
    qualifications: 'BSc Finance (Special), University of Sri Jayewardenepura\nBusiness Level - CA Sri Lanka\nLecturer at ISBM Campus',
    experience: '6 years',
    medium: 'Sinhala Medium',
    schedule: '2026 A/L Revision and Paper Class - Tuesday - 8.00 AM-5.00 PM - Rs. 2500 - C\n2026 A/L Theory - Thursday - 8.00 AM-2.00 PM - Rs. 2500 - C\n2027 A/L Theory - Saturday - 7.45-10.00 AM - Rs. 2500 - C\n2028 A/L Theory - Saturday - 10.30 AM-12.45 PM - Rs. 2500 - C',
    about: 'Best Accounting class in Kegalle.',
    whatsapp: '0714554687',
    email: 'lahiru1.isanka@gmail.com',
    photo: '/teachers/B06A3295 - Lahiru Damunupola-compressed.jpg',
  },
  {
    name: 'Neil Welipitiya',
    subject: 'A/L Business Studies (Commerce Stream)',
    category: 'al',
    credentials: 'Bachelor of Commerce',
    qualifications: 'Bachelor of Commerce',
    experience: '5 years',
    medium: 'Sinhala Medium',
    schedule: 'A/L Business Studies',
    whatsapp: '0769272770',
    email: 'neilwelipitiya@gmail.com',
    photo: '/teachers/IMG_8550 - Neil Welipitiya.jpeg',
  },
  {
    name: 'Lakshantha Brian',
    subject: 'A/L Economics (Commerce Stream)',
    category: 'al',
    credentials: 'B.A. Economics, MPhil, LLB, Attorney at Law',
    qualifications: 'B.A. Economics, University of Peradeniya\nMPhil in Economics\nLLB\nAttorney at Law',
    experience: '15 years',
    medium: 'Sinhala Medium',
    schedule: '2028 A/L - Saturday - 1.30-4.00 PM - Rs. 2500\n2027 A/L - Friday - 8.00 AM-3.30 PM - Rs. 3000',
    about: 'No. 1 Economics in Sri Lanka.',
    whatsapp: '0772310480',
    email: 'lakshanbrian@gmail.com',
    photo: '/teachers/ab9b38c6-8ef0-4e03-b019-8508e9826289 - Lakshantha Brian De Silva I ECON.jpeg',
  },
  {
    name: 'Mahesh Dewanarayana',
    subject: 'A/L Chemistry',
    category: 'al',
    credentials: 'B.Sc. University of Ruhuna',
    qualifications: 'B.Sc. University of Ruhuna',
    medium: 'Sinhala Medium',
    schedule: '2026 A/L Revision - Wednesday - 8.00 AM-5.00 PM - Rs. 3000 - P\n2027 A/L Theory - Saturday - 1.00-5.00 PM - Rs. 3000 - P\n2028 A/L Theory - Thursday - 8.00 AM-12.00 PM - Rs. 3500 - P',
    about: 'Advanced Level Chemistry teacher and University of Ruhuna alumnus dedicated to student success. Specializing in high-yield revision and clear conceptual teaching, I empower students to achieve top-tier results through structured tutorials and a results-driven approach to the A/L syllabus.',
    whatsapp: '0755208010',
    email: 'maheshdewanarayana@gmail.com',
    photo: '/teachers/Mahesh aiya(chemistry) - Somasiri Dewanarayana.jpg',
  },
  {
    name: 'Shanuka Wimalarathna',
    subject: 'A/L Korean Language',
    category: 'al',
    credentials: 'B.A. (Special), Diploma in Korean',
    qualifications: 'B.A. (Special), University of Sri Jayewardenepura\nDiploma in Korean, University of Colombo',
    experience: '8 years',
    medium: 'Sinhala Medium',
    schedule: '2028 A/L - Sunday - 10.00 AM-12.00 PM - Rs. 3000 - C',
    about: 'The area\'s best Korean language teacher, who has made the university dreams of hundreds of local children come true for eight years.',
    whatsapp: '0713986526',
    email: 'hasashanshanuka35@gmail.com',
  },
  {
    name: 'Eranga Weerawardana',
    subject: 'A/L Home Economics Science',
    category: 'al',
    credentials: 'BA, HND Consumer Science and Product Technology',
    qualifications: 'BA, University of Sri Jayewardenepura\nHND in Consumer Science and Product Technology (Home Economics Science)\nChild Nutrition Course by UNICEF\nChild Care and Psychology Course by Gatwick College',
    experience: '5 years',
    medium: 'Sinhala Medium',
    schedule: '2026 A/L - Tuesday - 8.30 AM - Rs. 3000 - P\n2027 A/L - Monday - 2.30 PM - Rs. 2200 - C\n2028 A/L - Sunday - 8.00 AM - C',
    about: 'Highly qualified and experienced Home Economics Science A/L teacher with a proven record of producing excellent results. Dedicated to guiding students toward academic success through effective teaching methods, individual attention, theory, practical learning, revision classes, and exam-focused preparation.',
    whatsapp: '0712280396',
    email: 'erangahansi6@gmail.com',
    photo: '/teachers/IMG-20260319-WA0025 - Eranga Hansi.jpg',
  },
  {
    name: 'Eranga Rajapaksha',
    subject: 'A/L Japanese',
    category: 'al',
    credentials: 'BA in Languages, MSc Management',
    qualifications: 'BA in Languages, University of Sabaragamuwa\nMSc Management, University of Dundee, United Kingdom',
    experience: '20 years',
    medium: 'Sinhala Medium, English Medium',
    schedule: '2026 A/L - Tuesday - 8.00 AM-5.00 PM\n2027 A/L - Tuesday - 2.30-5.00 PM\n2028 A/L - Sunday - 2.00-5.00 PM\nJLPT N5/N4 - Sunday - 8.00 AM-12.00 PM',
    about: 'An experienced Japanese Language teacher with Japan teacher training.',
    whatsapp: '0705776495',
    email: 'caneranga3314@gmail.com',
    photo: '/teachers/IMG_7035 copy - Eranga Rajapaksha.jpg',
  },
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
  const credentials = teacher.credentials ?? teacher.notes ?? `${teacher.subject} classes and exam preparation`

  return {
    id: index + 1,
    name: teacher.name,
    subject: teacher.subject,
    category: teacher.category,
    credentials,
    experience: teacher.experience ?? getLevelLabel(teacher.category),
    about: teacher.about ?? `${teacher.name} leads ${teacher.subject} lessons with structured guidance and consistent practice.`,
    initials: getInitials(teacher.name),
    photo: teacher.photo,
    medium: teacher.medium,
    schedule: teacher.schedule,
    qualifications: teacher.qualifications,
    whatsapp: teacher.whatsapp,
    email: teacher.email,
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
      ['Sanjeewa Siriwardana']
    ).map(toLecturer),
  },
]
