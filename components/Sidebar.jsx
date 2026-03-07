import { getAllDocuments, getNavigationTree } from '../lib/content'
import SidebarNav from './SidebarNav'

export default function Sidebar() {
  const navigation = getNavigationTree()
  const searchItems = getAllDocuments()
    .filter((doc) => doc.href !== '/')
    .map((doc) => ({
      title: doc.title,
      href: doc.href,
      description: doc.description,
    }))

  return <SidebarNav navigation={navigation} searchItems={searchItems} />
}
