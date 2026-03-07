import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const contentDirectory = path.join(process.cwd(), 'content')

function walkDir(dir, base = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  const docs = []

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      docs.push(...walkDir(fullPath, [...base, entry.name]))
      continue
    }

    if (!entry.name.endsWith('.md')) continue

    const raw = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(raw)

    const name = entry.name.replace(/\.md$/, '')
    const slug = name === 'index' ? base : [...base, name]

    const title =
      data.title ||
      extractTitleFromMarkdown(content) ||
      (slug[slug.length - 1] || 'Home')

    docs.push({
      title,
      slug,
      content,
    })
  }

  return docs
}

function extractTitleFromMarkdown(content = '') {
  const match = content.match(/^#\s+(.+)$/m)
  return match ? match[1].trim() : null
}

export function getAllDocs() {
  return walkDir(contentDirectory)
}