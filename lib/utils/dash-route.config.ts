import { SidebarItemProps } from "../interfaces";

const dashRoutes: SidebarItemProps[] = [
  {
    label: 'Analitik',
    children: [
      {
        href: '/dashboard',
        icon: 'xd',
        label: 'Dashboard',
      },
    ]
  },
  {
    label: 'Menü Yönetimi',
    children: [
      {
        href: '/products',
        icon: 'xd',
        label: 'Ürünler',
      },
      {
        href: '/categories',
        icon: 'xd',
        label: 'Kategoriler',
      },
    ]
  },
  {
    label: 'Kullanıcı Yönetimi',
    children: [
      {
        href: '/users',
        icon: 'xd',
        label: 'Kullanıcılar',
      },
    ]
  },
  {
    href: '/settings',
    icon: 'xd',
    label: 'Genel Ayarlar',
  },
]
export default dashRoutes;