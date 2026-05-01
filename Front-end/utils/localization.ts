export const teacherSinhalaNames: Record<string, string> = {
  'Rukshan Kulakumara': 'රුක්ෂාන් කුලකුමාර',
  'Pradeep Sudusingha': 'ප්‍රදීප් සුදුසිංහ',
  'Nalaka Pradeep': 'නාලක ප්‍රදීප්',
  'Shiva Sir': 'ශිවා සර්',
  'Rohitha Dissanayake': 'රෝහිත දිසානායක',
  'Charitha Bandara': 'චරිත බණ්ඩාර',
  'Dudeep Priyantha': 'දුදීප් ප්‍රියන්ත',
  'Akila Jayawardhana': 'අකිල ජයවර්ධන',
  'Sanjeewa Siriwardhana': 'සංජීව සිරිවර්ධන',
  'Suraj S. Kumara': 'සුරාජ් එස්. කුමාර',
  'Malaka Thalduwa': 'මලක තල්දුව',
  'Chamula Nuwanperuma': 'චමුල නුවන්පෙරුම',
  'Kanishka Madhuwara': 'කනිෂ්ක මධුවර',
  'Tharindu Rajapaksha': 'තරිඳු රාජපක්ෂ',
  'Vishula Gunawardhana': 'විශුල ගුණවර්ධන',
  'Dilshan S. Pathirana': 'ඩිල්ෂාන් එස්. පතිරණ',
  'Hashika Thilakarathne': 'හෂික තිලකරත්න',
  'Shalani Ranasinghe': 'ශලනි රණසිංහ',
  'Lahiru Dilumgoda': 'ලහිරු දිලුම්ගොඩ',
  'Nila Welikala': 'නිලා වැලිකල',
  'Udaya Sampath': 'උදය සම්පත්',
  'Jagath Maliyadda': 'ජගත් මාලියද්ද',
}

export const commonSinhalaTerms: Record<string, string> = {
  Grade: 'ශ්‍රේණිය',
  Siyowin: 'සියෝවින්',
  'Siyowin Higher Education Center': 'සියෝවින් උසස් අධ්‍යාපන ආයතනය',
  'Siyowin Higher Education Institute': 'සියෝවින් උසස් අධ්‍යාපන ආයතනය',
  'Palladeniya Road, Kegalle & Behind Commercial Bank, Kegalle.': 'පල්ලාදෙණිය පාර හා කොමර්ශල් බැංකුව පිටුපස',
  'Rukshan Kulakumara': 'රුක්ෂාන් කුලකුමාර',
}

export const toSinhalaTeacherName = (name: string, isSinhala: boolean) =>
  isSinhala ? teacherSinhalaNames[name] ?? name : name

export const toSinhalaSubject = (subject: string, isSinhala: boolean) => {
  if (!isSinhala) return subject

  return subject
    .replace(/Grade/g, commonSinhalaTerms.Grade)
    .replace(/Scholarship/g, 'ශිෂ්‍යත්ව')
    .replace(/teacher/g, 'ගුරුවරයා')
    .replace(/classes and exam preparation/g, 'පන්ති සහ විභාග සූදානම')
}
