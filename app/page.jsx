import MarkdownRenderer from '../components/MarkdownRenderer'
import { getHomeDocument } from '../lib/content'

export async function generateMetadata() {
  const doc = getHomeDocument()

  return {
    title: doc.title,
    description: doc.description || 'Sherafy Codebook home page',
  }
}

export default function HomePage() {
  const doc = getHomeDocument()

  return (
    <article className="page-shell">
      <MarkdownRenderer content={doc.body} />
    </article>
  )
}
