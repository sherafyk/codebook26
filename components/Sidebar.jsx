import { getAllDocuments, getNavigationTree } from '../lib/content'
import SidebarNav from './SidebarNav'

export default function Sidebar() {
  const navigation = getNavigationTree()

  const searchItems = getAllDocuments()
    .filter((doc) => doc.href !== '/')
    .flatMap((doc) => {
      const baseItem = {
        title: doc.title,
        href: doc.href,
        description: doc.description,
      }

      const headingItems = (doc.headings || []).map((heading) => ({
        title: heading.text,
        href: heading.id ? `${doc.href}#${heading.id}` : doc.href,
        description: doc.title,
      }))

      return [baseItem, ...headingItems]
    })

  return <SidebarNav navigation={navigation} searchItems={searchItems} />
}