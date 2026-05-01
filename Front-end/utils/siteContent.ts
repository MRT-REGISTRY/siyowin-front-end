import { createClient } from '@/utils/supabase/server';
import { SiteContent, SiteLecturerSection } from '@/types/siteContent';

const fallbackSiteContent: SiteContent = {
  heroImages: [
    { id: 'hero-1', src: '/photos/bggrund (1).jpg', alt: 'Siyowin academy classroom event', width: 2048, height: 2048 },
    { id: 'hero-2', src: '/photos/bggrund (2).jpg', alt: 'Siyowin academy student program', width: 2048, height: 1542 },
    { id: 'hero-3', src: '/photos/bggrund (3).jpg', alt: 'Siyowin higher education institute', width: 2048, height: 1542 },
    { id: 'hero-4', src: '/photos/bggrund (4).jpg', alt: 'Siyowin academy learning session', width: 2048, height: 1536 },
    { id: 'hero-5', src: '/photos/bggrund (5).jpg', alt: 'Siyowin academy event crowd', width: 2048, height: 1366 },
    { id: 'hero-6', src: '/photos/bggrund (6).jpg', alt: 'Siyowin academy lecture hall', width: 2048, height: 1366 },
    { id: 'hero-7', src: '/photos/bggrund (7).jpg', alt: 'Siyowin academy student gathering', width: 2048, height: 1414 },
    { id: 'hero-8', src: '/photos/bggrund (8).jpg', alt: 'Siyowin academy campus moment', width: 2048, height: 1536 },
  ],
  aboutFeatures: [
    { id: 'feature-1', text: 'Classes from Grade 1 to 13, including O/L and A/L' },
    { id: 'feature-2', text: 'Open courses for practical, continued learning' },
    { id: 'feature-3', text: 'Student-focused academic and career guidance' },
    { id: 'feature-4', text: 'Dedicated scholarship and exam preparation support' },
  ],
  aboutStats: [
    { id: 'students', value: '5,000+', label: 'Students Enrolled' },
    { id: 'teachers', value: '30+', label: 'Expert Teachers' },
    { id: 'established', value: '2024', label: 'Established' },
  ],
  lecturerSections: [
    {
      id: 1,
      title: 'O/L',
      highlight: 'Teachers',
      description: 'Strong subject guidance for Ordinary Level students.',
      viewAllHref: '#ol-teachers',
      lecturers: [
        {
          id: 101,
          name: 'Tissa Jananayake',
          subject: 'Science',
          credentials: 'O/L science theory, revision and paper discussion',
          image: '/lecturer-1.jpg',
          photoBg: '#dfb08f',
          infoBg: '#dceee5',
          accent: '#1fac74',
        },
        {
          id: 102,
          name: 'Charitha Dissanayake',
          subject: 'Mathematics',
          credentials: 'O/L mathematics theory and model paper training',
          image: '/lecturer-2.jpg',
          photoBg: '#ecd681',
          infoBg: '#eee8dc',
          accent: '#f28a1f',
        },
        {
          id: 103,
          name: 'Dushyantha Mahabadugge',
          subject: 'English',
          credentials: 'Grammar, writing and exam-focused language practice',
          image: '/lecturer-3.jpg',
          photoBg: '#fb8fa0',
          infoBg: '#e8fbff',
          accent: '#08a7cc',
        },
        {
          id: 104,
          name: 'Samitha Rathnayake',
          subject: 'History',
          credentials: 'Structured lessons, short notes and past papers',
          image: '/lecturer-4.jpg',
          photoBg: '#8d93ef',
          infoBg: '#e3dde5',
          accent: '#a761dd',
        },
        {
          id: 105,
          name: 'Hiru Siriwardana',
          subject: 'Commerce',
          credentials: 'Business studies and accounting fundamentals',
          image: '/lecturer-5.jpg',
          photoBg: '#b6e58d',
          infoBg: '#dfe8ee',
          accent: '#3c86e8',
        },
      ],
    },
    {
      id: 2,
      title: 'A/L',
      highlight: 'Teachers',
      description: 'Advanced Level classes led by experienced subject specialists.',
      viewAllHref: '#al-teachers',
      lecturers: [
        {
          id: 201,
          name: 'Dushyantha Mahabadugge',
          subject: 'Engineering Technology',
          credentials: 'B.Sc. Eng. (Hons.) UOM, C.I.M.A., L.I.C.A., P.G. Dip.',
          image: '/lecturer-3.jpg',
          photoBg: '#fb8fa0',
          infoBg: '#e8fbff',
          accent: '#08a7cc',
        },
        {
          id: 202,
          name: 'Samitha Rathnayake',
          subject: 'Chemistry',
          credentials: 'B.Sc. (Phy. Sp.) Colombo',
          image: '/lecturer-4.jpg',
          photoBg: '#8d93ef',
          infoBg: '#e3dde5',
          accent: '#a761dd',
        },
        {
          id: 203,
          name: 'Charitha Dissanayake',
          subject: 'Physics',
          credentials: 'B.Sc Engineering Honours, University of Moratuwa',
          image: '/lecturer-2.jpg',
          photoBg: '#ecd681',
          infoBg: '#eee8dc',
          accent: '#f28a1f',
        },
        {
          id: 204,
          name: 'Tissa Jananayake',
          subject: 'Biology',
          credentials: 'B.Sc. Honours Microbiology, Psychology Counselling',
          image: '/lecturer-1.jpg',
          photoBg: '#dfb08f',
          infoBg: '#dceee5',
          accent: '#1fac74',
        },
        {
          id: 205,
          name: 'Hiru Siriwardana',
          subject: 'Accounting',
          credentials: 'University of Sri Jayewardenepura',
          image: '/lecturer-5.jpg',
          photoBg: '#b6e58d',
          infoBg: '#dfe8ee',
          accent: '#3c86e8',
        },
      ],
    },
    {
      id: 3,
      title: 'Scholarship',
      highlight: '& Other Courses',
      description: 'Foundation support, scholarship preparation and practical open courses.',
      viewAllHref: '#scholarship-courses',
      lecturers: [
        {
          id: 301,
          name: 'Nethmi Perera',
          subject: 'Grade 5 Scholarship',
          credentials: 'Scholarship paper classes, IQ and Sinhala practice',
          image: '/lecturer-5.jpg',
          photoBg: '#b6e58d',
          infoBg: '#dfe8ee',
          accent: '#3c86e8',
        },
        {
          id: 302,
          name: 'Kasun Jayasinghe',
          subject: 'ICT Course',
          credentials: 'Computer basics, office tools and practical ICT skills',
          image: '/lecturer-3.jpg',
          photoBg: '#fb8fa0',
          infoBg: '#e8fbff',
          accent: '#08a7cc',
        },
        {
          id: 303,
          name: 'Ayesha Fernando',
          subject: 'English Course',
          credentials: 'Spoken English, grammar and communication skills',
          image: '/lecturer-1.jpg',
          photoBg: '#dfb08f',
          infoBg: '#dceee5',
          accent: '#1fac74',
        },
        {
          id: 304,
          name: 'Ravindu Bandara',
          subject: 'Primary Classes',
          credentials: 'Grade 1 to 5 foundation learning and activity classes',
          image: '/lecturer-2.jpg',
          photoBg: '#ecd681',
          infoBg: '#eee8dc',
          accent: '#f28a1f',
        },
        {
          id: 305,
          name: 'Dinuka Herath',
          subject: 'Exam Skills',
          credentials: 'Study planning, model papers and confidence building',
          image: '/lecturer-4.jpg',
          photoBg: '#8d93ef',
          infoBg: '#e3dde5',
          accent: '#a761dd',
        },
      ],
    },
  ],
  galleryImages: [
    { id: 1, src: '/gallery-1.jpg', alt: 'Siyowin Academy indoor event', category: 'indoor' },
    { id: 2, src: '/gallery-2.jpg', alt: 'Siyowin Academy outdoor event', category: 'outdoor' },
    { id: 3, src: '/gallery-3.jpg', alt: 'Siyowin Academy classroom activity', category: 'indoor' },
    { id: 4, src: '/gallery-4.jpg', alt: 'Siyowin Academy outdoor student program', category: 'outdoor' },
    { id: 5, src: '/gallery-5.jpg', alt: 'Siyowin Academy lecture moment', category: 'indoor' },
    { id: 6, src: '/gallery-6.jpg', alt: 'Siyowin Academy outdoor gathering', category: 'outdoor' },
  ],
  articles: [
    {
      id: 1,
      title: 'Why Specialized Guidance Matters for O/L Examinations',
      description: 'Discover why structured tuition beyond school helps students build confidence, fill knowledge gaps, and perform at their best when it counts most.',
      image: '/article-1.jpg',
      date: '12 Oct 2024',
      category: 'Education',
      readTime: '4 min read',
      href: '#',
    },
    {
      id: 2,
      title: 'Simple Ways to Measure and Track Your Exam Progress',
      description: 'Learn the techniques our teachers use to monitor student growth and how you can apply the same methods at home for consistent improvement.',
      image: '/article-2.jpg',
      date: '28 Sep 2024',
      category: 'Study Tips',
      readTime: '5 min read',
      href: '#',
    },
    {
      id: 3,
      title: 'Exploring Career Paths After A/L Examinations',
      description: 'Not sure what comes next? We break down promising higher education routes and career options available to A/L students in Sri Lanka.',
      image: '/article-3.jpg',
      date: '5 Sep 2024',
      category: 'Career',
      readTime: '6 min read',
      href: '#',
    },
  ],
};

const getRows = async <T>(table: string, orderColumn = 'display_order') => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from(table).select('*').order(orderColumn, { ascending: true });

    if (error) {
      const fallback = getFallbackRows(table);

      if (fallback) {
        return fallback as T[];
      }

      throw new Error(`Unable to load ${table}: ${error.message}`);
    }

    return (data ?? []) as T[];
  } catch {
    const fallback = getFallbackRows(table);

    if (fallback) {
      return fallback as T[];
    }

    throw new Error(`Unable to load ${table}: Supabase client initialization failed.`);
  }
};

const getFallbackRows = (table: string) => {
  switch (table) {
    case 'site_hero_images':
      return fallbackSiteContent.heroImages;
    case 'site_about_features':
      return fallbackSiteContent.aboutFeatures;
    case 'site_about_stats':
      return fallbackSiteContent.aboutStats;
    case 'site_lecturer_sections':
      return fallbackSiteContent.lecturerSections.map(({ lecturers, ...section }) => section);
    case 'site_lecturers':
      return fallbackSiteContent.lecturerSections.flatMap((section) => section.lecturers.map((lecturer) => ({ ...lecturer, section_id: section.id })));
    case 'site_gallery_images':
      return fallbackSiteContent.galleryImages;
    case 'site_articles':
      return fallbackSiteContent.articles;
    default:
      return null;
  }
};

export async function getSiteContent(): Promise<SiteContent> {
  const [
    heroImages,
    aboutFeatures,
    aboutStats,
    lecturerSections,
    lecturers,
    galleryImages,
    articles,
  ] = await Promise.all([
    getRows<any>('site_hero_images'),
    getRows<any>('site_about_features'),
    getRows<any>('site_about_stats'),
    getRows<any>('site_lecturer_sections'),
    getRows<any>('site_lecturers'),
    getRows<any>('site_gallery_images'),
    getRows<any>('site_articles'),
  ]);

  const sections: SiteLecturerSection[] = lecturerSections.map((section) => ({
    id: section.id,
    title: section.title,
    highlight: section.highlight,
    description: section.description,
    viewAllHref: section.view_all_href,
    lecturers: lecturers
      .filter((lecturer) => lecturer.section_id === section.id)
      .map((lecturer) => ({
        id: lecturer.id,
        name: lecturer.name,
        subject: lecturer.subject,
        credentials: lecturer.credentials,
        image: lecturer.image,
        photoBg: lecturer.photo_bg,
        infoBg: lecturer.info_bg,
        accent: lecturer.accent,
      })),
  }));

  return {
    heroImages: heroImages.map((image) => ({
      id: image.id,
      src: image.src,
      alt: image.alt,
      width: image.width,
      height: image.height,
    })),
    aboutFeatures: aboutFeatures.map((feature) => ({ id: feature.id, text: feature.text })),
    aboutStats: aboutStats.map((stat) => ({ id: stat.id, value: stat.value, label: stat.label })),
    lecturerSections: sections,
    galleryImages: galleryImages.map((image) => ({
      id: image.id,
      src: image.src,
      alt: image.alt,
      category: image.category,
    })),
    articles: articles.map((article) => ({
      id: article.id,
      title: article.title,
      description: article.description,
      image: article.image,
      date: article.published_label,
      category: article.category,
      readTime: article.read_time,
      href: article.href,
    })),
  };
}
