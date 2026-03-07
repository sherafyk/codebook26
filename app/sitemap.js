import { getAllDocuments } from '../lib/content'

export default function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://codebook.sherafi.com'

  return getAllDocuments().map((doc) => ({
    url: `${baseUrl}${doc.href}`,
    lastModified: new Date(),
  }))
}
