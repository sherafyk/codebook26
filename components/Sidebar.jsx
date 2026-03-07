import { getAllDocuments, getNavigationTree } from '../lib/content'
import SidebarNav from './SidebarNav'

export default function Sidebar() {
  const navigation = getNavigationTree()

  const searchItems = getAllDocuments()
    .filter((doc) => doc.href !== '/')
    .flatMap((doc) => {
      const baseItem = {
        key: `${doc.href}::doc`,
        title: doc.title,
        href: doc.href,
        description: doc.description,
      }

      const headingItems = (doc.headings || []).map((heading, index) => {
        const href = heading.id ? `${doc.href}#${heading.id}` : doc.href

        return {
          key: `${href}::heading::${index}`,
          title: heading.text,
          href,
          description: doc.title,
        }
      })

      return [baseItem, ...headingItems]
    })

  return <SidebarNav navigation={navigation} searchItems={searchItems} />
}
