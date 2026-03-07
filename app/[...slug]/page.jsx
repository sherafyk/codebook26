import { notFound } from 'next/navigation'
import Breadcrumbs from '../../components/Breadcrumbs'
import MarkdownRenderer from '../../components/MarkdownRenderer'
import {
  getAllRouteParams,
  getDocumentBySlug,
} from '../../lib/content'

export const dynamicParams = false

export async function generateStaticParams() {
  return getAllRouteParams().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const doc = getDocumentBySlug(slug)

  if (!doc) {
    return {}
  }

  return {
    title: doc.title,
    description: doc.description || 'Sherafy Codebook page',
  }
}

export default async function DocPage({ params }) {
  const { slug } = await params
  const doc = getDocumentBySlug(slug)

  if (!doc) {
    notFound()
  }

  return (
    <article className="page-shell">
      <Breadcrumbs segments={doc.routeSegments} title={doc.title} />
      <MarkdownRenderer content={doc.body} />
    </article>
  )
}
