import { notFound } from 'next/navigation'
import TimetablePageContent from '@/components/TimetablePageContent'
import { getTimetableGroup, timetableGroups } from '@/data/timetables'

export function generateStaticParams() {
  return timetableGroups.map((group) => ({ level: group.id }))
}

export default async function TimetablePage({ params }: { params: Promise<{ level: string }> }) {
  const { level } = await params

  if (!getTimetableGroup(level)) {
    notFound()
  }

  return <TimetablePageContent level={level} />
}
