import LayoutAuthenticated from '../../layouts/authenticated'
import React, { useEffect, useState } from 'react'
import type { ReactElement } from 'react'
import dashRoutes from "lib/utils/dash-route.config";
import { SidebarItemProps } from 'lib/interfaces';
import Link from 'next/link';
import { useRouter } from 'next/router';

const DashboardPage = () => {
  const routes = dashRoutes.flatMap((route) => route.children || route);
  const router = useRouter();

  return (
    <>
      <div className="dash-container">
        <div className="dash-apps">
          {routes.map(({ label, icon, href }: SidebarItemProps) => (
            href != router.pathname && (
              <Link
                key={label}
                className='dash-app'
                href={href || '/'}
                draggable="false"
                role="button"
                aria-label={`${label} sayfasına git`}
              >
                {icon}
                {label}
              </Link>
            )
          ))}
        </div>
      </div>
    </>
  )
}

DashboardPage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>
}

export default DashboardPage
