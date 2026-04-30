import { createClient } from '@/utils/supabase/server';
import { SiteContent, SiteLecturerSection } from '@/types/siteContent';

const getRows = async <T>(table: string, orderColumn = 'display_order') => {
  const supabase = await createClient();
  const { data, error } = await supabase.from(table).select('*').order(orderColumn, { ascending: true });

  if (error) {
    throw new Error(`Unable to load ${table}: ${error.message}`);
  }

  return (data ?? []) as T[];
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
