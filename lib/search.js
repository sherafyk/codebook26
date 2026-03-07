import { getAllDocs } from './docs'

function extractHeadings(markdown = '') {
  const lines = markdown.split('\n')
  const headings = []

  for (const line of lines) {
    const match = line.match(/^(#{1,6})\s+(.+?)\s*$/)
    if (match) {
      headings.push({
        level: match[1].length,
        text: match[2].trim(),
      })
    }
  }

  return headings
}

export function getSearchIndex() {
  const docs = getAllDocs()

  return docs.map((doc) => {
    const headings = extractHeadings(doc.content)

    return {
      title: doc.title,
      slug: doc.slug,
      path: `/${doc.slug.join('/')}`,
      headings,
      searchableText: [
        doc.title,
        doc.slug.join(' '),
        headings.map((h) => h.text).join(' '),
      ]
        .join(' ')
        .toLowerCase(),
    }
  })
}

export function searchDocs(query = '') {
  const q = query.trim().toLowerCase()
  if (!q) return []

  const index = getSearchIndex()

  return index
    .map((doc) => {
      let score = 0

      if (doc.title.toLowerCase().includes(q)) score += 100
      if (doc.slug.join(' ').toLowerCase().includes(q)) score += 40

      for (const heading of doc.headings) {
        if (heading.text.toLowerCase().includes(q)) {
          score += 20
        }
      }

      if (doc.searchableText.includes(q)) score += 10

      return {
        ...doc,
        score,
      }
    })
    .filter((doc) => doc.score > 0)
    .sort((a, b) => b.score - a.score)
}