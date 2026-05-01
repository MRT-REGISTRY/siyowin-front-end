export type SiteHeroImage = {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type SiteAboutFeature = {
  id: string;
  text: string;
};

export type SiteAboutStat = {
  id: string;
  value: string;
  label: string;
};

export type SiteLecturer = {
  id: number;
  name: string;
  subject: string;
  credentials: string;
  image: string;
  photoBg: string;
  infoBg: string;
  accent: string;
};

export type SiteLecturerSection = {
  id: number;
  title: string;
  highlight: string;
  description: string;
  viewAllHref: string;
  lecturers: SiteLecturer[];
};

export type SiteGalleryImage = {
  id: number;
  src: string;
  alt: string;
  category: 'indoor' | 'outdoor';
};

export type SiteArticle = {
  id: number;
  title: string;
  description: string;
  image: string;
  date: string;
  category: string;
  readTime: string;
  href: string;
};

export type SiteContent = {
  heroImages: SiteHeroImage[];
  aboutFeatures: SiteAboutFeature[];
  aboutStats: SiteAboutStat[];
  lecturerSections: SiteLecturerSection[];
  galleryImages: SiteGalleryImage[];
  articles: SiteArticle[];
};
