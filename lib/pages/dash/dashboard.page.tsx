import LayoutAuthenticated from '../../layouts/authenticated'
import React, { useEffect, useState } from 'react'
import type { ReactElement } from 'react'
import dashRoutes from "lib/utils/dash-route.config";
import { SidebarItemProps } from 'lib/interfaces';
import Link from 'next/link';
import { useRouter } from 'next/router';
import MdDownloading from 'lib/assets/icon/svg/MdDownloading.svg'

const DashboardPage = () => {
  const routes = dashRoutes.flatMap((route) => route.children || route);
  const router = useRouter();
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('beforeInstallPrompt event:', e);
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeInstallPrompt', handleBeforeInstallPrompt);

    return () => window.removeEventListener('beforeInstallPrompt', handleBeforeInstallPrompt);
  }, []);
  
  const handleInstallClick = () => {
    if (deferredPrompt) {
      (deferredPrompt as any).prompt(); 
      (deferredPrompt as any).userChoice.then((choiceResult: { outcome: string }) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('Kullanıcı yüklemeyi kabul etti.');
        } else {
          console.log('Kullanıcı yüklemeyi reddetti.');
        }
        setDeferredPrompt(null);
      });
    }
  };

  return (
    <>
      <div className="dash-container">
          {isInstallable && (
            <button onClick={handleInstallClick} className="install-button">
              <MdDownloading />
            </button>
          )}
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
