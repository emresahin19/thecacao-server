import { SidebarItemProps } from "../interfaces";
import RiApps2AddLine from "lib/assets/icon/svg/RiApps2AddLine.svg"
import RiCake3Line from "lib/assets/icon/svg/RiCake3Line.svg"
import RiDrinks2Line from "lib/assets/icon/svg/RiDrinks2Line.svg"
import RiUser2Line from "lib/assets/icon/svg/RiUser2Line.svg"
import RiListSettingsLine from "lib/assets/icon/svg/RiListSettingsLine.svg"
import LuMilk from "lib/assets/icon/svg/LuMilk.svg"
import LuIceCream from "lib/assets/icon/svg/LuIceCream.svg"

const dashRoutes: SidebarItemProps[] = [
  {
    label: 'Analitik',
    children: [
      {
        href: '/dashboard',
        icon: <RiApps2AddLine />,
        label: 'Dashboard',
      },
    ]
  },
  {
    label: 'Menü Yönetimi',
    children: [
      {
        href: '/products',
        icon: <RiCake3Line />,
        label: 'Ürünler',
      },
      {
        href: '/categories',
        icon: <RiDrinks2Line />,
        label: 'Kategoriler',
      },
      {
        href: '/extra-categories',
        icon: <LuIceCream />,
        label: 'Extra Kategoriler',
      },
      {
        href: '/extra',
        icon: <LuMilk />,
        label: 'Extra',
      },
    ]
  },
  {
    label: 'Kullanıcı Yönetimi',
    children: [
      {
        href: '/users',
        icon: <RiUser2Line />,
        label: 'Kullanıcılar',
      },
    ]
  },
  {
    href: '/settings',
    icon: <RiListSettingsLine />,
    label: 'Genel Ayarlar',
  },
]
export default dashRoutes;