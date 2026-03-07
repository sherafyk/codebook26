import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

const CONTENT_DIR = path.join(process.cwd(), 'content')
const MARKDOWN_EXTENSIONS = new Set(['.md'])

let cachedIndex = null

function sortEntries(entries) {
  return [...entries].sort((a, b) => {
    if (a.isDirectory() && !b.isDirectory()) return -1
    if (!a.isDirectory() && b.isDirectory()) return 1
    return a.name.localeCompare(b.name)
  })
}

function isMarkdownFile(name) {
  return MARKDOWN_EXTENSIONS.has(path.extname(name).toLowerCase())
}

function readMarkdownFile(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(raw)
  return { data, content }
}

function cleanText(value) {
  return value.replace(/\s+/g, ' ').trim()
}

function getFirstHeading(body) {
  const match = body.match(/^#\s+(.+)$/m)
  return match ? cleanText(match[1]) : ''
}

function getFirstParagraph(body) {
  const lines = body.split(/\r?\n/)
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue
    if (trimmed.startsWith('#')) continue
    if (trimmed.startsWith('```')) continue
    if (trimmed.startsWith('>')) continue
    if (trimmed.startsWith('|')) continue
    if (trimmed === '---') continue
    return cleanText(trimmed)
  }
  return ''
}

export function humanizeSlugSegment(segment) {
  return segment
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function humanizeFileName(name) {
  const base = path.parse(name).name
  return humanizeSlugSegment(slugifySegment(base))
}

export function slugifySegment(value) {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/&/g, ' and ')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
    .toLowerCase()
}

function stripInlineMarkdown(text) {
  return cleanText(
    text
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/__([^_]+)__/g, '$1')
      .replace(/_([^_]+)_/g, '$1')
      .replace(/~~([^~]+)~~/g, '$1')
      .replace(/<[^>]+>/g, '')
  )
}

function extractHeadings(body) {
  const headings = []
  const lines = body.split(/\r?\n/)

  for (const line of lines) {
    const match = line.match(/^(#{1,6})\s+(.+?)\s*#*\s*$/)
    if (!match) continue

    const level = match[1].length
    const text = stripInlineMarkdown(match[2])

    if (!text) continue

    headings.push({
      level,
      text,
      id: slugifySegment(text),
    })
  }

  return headings
}

function createDocument({ filePath, sourceSegments, routeSegments }) {
  const { data, content } = readMarkdownFile(filePath)
  const trimmed = content.trim()

  if (!trimmed) {
    return null
  }

  const title = String(data.title || getFirstHeading(content) || humanizeFileName(filePath))
  const description = String(data.description || getFirstParagraph(content) || '')
  const order = Number.isFinite(Number(data.order)) ? Number(data.order) : 9999
  const href = routeSegments.length ? `/${routeSegments.join('/')}` : '/'
  const headings = extractHeadings(content)

  return {
    title,
    description,
    order,
    href,
    body: content,
    headings,
    routeSegments,
    sourceSegments,
    filePath,
    isHome: routeSegments.length === 0,
    isIndex: path.parse(filePath).name.toLowerCase() === 'index',
  }
}

function compareNodes(a, b) {
  const aOrder = a.order ?? 9999
  const bOrder = b.order ?? 9999
  if (aOrder !== bOrder) return aOrder - bOrder
  return a.title.localeCompare(b.title)
}

function buildIndex() {
  const docs = []
  const byHref = new Map()

  function registerDoc(doc) {
    if (!doc) return null
    if (byHref.has(doc.href)) {
      throw new Error(`Duplicate route detected for ${doc.href}`)
    }
    byHref.set(doc.href, doc)
    docs.push(doc)
    return doc
  }

  function walk(dirPath, routePrefix = [], sourcePrefix = []) {
    const entries = sortEntries(
      fs.readdirSync(dirPath, { withFileTypes: true }).filter((entry) => !entry.name.startsWith('.'))
    )

    let indexDoc = null
    const pages = []
    const folders = []

    for (const entry of entries) {
      const absolutePath = path.join(dirPath, entry.name)

      if (entry.isDirectory()) {
        const folderSlug = slugifySegment(entry.name)
        const folder = walk(absolutePath, [...routePrefix, folderSlug], [...sourcePrefix, entry.name])
        if (folder) {
          folders.push(folder)
        }
        continue
      }

      if (!isMarkdownFile(entry.name)) {
        continue
      }

      const baseName = path.parse(entry.name).name
      const isIndexFile = baseName.toLowerCase() === 'index'
      const routeSegments = isIndexFile
        ? routePrefix
        : [...routePrefix, slugifySegment(baseName)]

      const doc = registerDoc(
        createDocument({
          filePath: absolutePath,
          sourceSegments: [...sourcePrefix, entry.name],
          routeSegments,
        })
      )

      if (!doc) {
        continue
      }

      if (isIndexFile) {
        indexDoc = doc
      } else {
        pages.push({
          type: 'page',
          key: doc.href,
          title: doc.title,
          href: doc.href,
          order: doc.order,
        })
      }
    }

    folders.sort(compareNodes)
    pages.sort(compareNodes)

    const title = indexDoc?.title || humanizeSlugSegment(routePrefix.at(-1) || path.basename(dirPath))
    const href = indexDoc?.href || null
    const order = indexDoc?.order ?? 9999

    return {
      type: 'folder',
      key: `folder:${routePrefix.join('/') || 'root'}`,
      title,
      href,
      order,
      children: [...folders, ...pages],
      indexDoc,
      routeSegments: routePrefix,
    }
  }

  const root = walk(CONTENT_DIR)
  const home = byHref.get('/')

  if (!home) {
    throw new Error('content/index.md is required for the home page.')
  }

  return {
    docs: docs.sort((a, b) => compareNodes(a, b)),
    byHref,
    home,
    navigation: root.children,
  }
}

function getIndex() {
  if (!cachedIndex) {
    cachedIndex = buildIndex()
  }
  return cachedIndex
}

export function getAllDocuments() {
  return getIndex().docs
}

export function getHomeDocument() {
  return getIndex().home
}

export function getDocumentBySlug(slug = []) {
  const href = slug.length ? `/${slug.join('/')}` : '/'
  return getIndex().byHref.get(href) || null
}

export function getAllRouteParams() {
  return getAllDocuments()
    .filter((doc) => !doc.isHome)
    .map((doc) => doc.routeSegments)
}

export function getNavigationTree() {
  return getIndex().navigation
}