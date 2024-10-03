import { DTheApp } from 'lib/pages';
import GlobalLoading from "lib/components/Loading/components/global-loading.component";
import { AppPropsWithLayout } from "lib/interfaces";
import { useEffect, useState } from "react";
import MdDownloading from 'lib/assets/icon/svg/MdDownloading.svg'

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout || ((page) => page)

  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('beforeinstallprompt event:', e);
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
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
      <DTheApp>
          {isInstallable && (
            <button onClick={handleInstallClick} className="install-button">
              <MdDownloading />
            </button>
          )}
        {getLayout(
          <>
            <GlobalLoading />
            <Component {...pageProps} />
          </>
        )}
      </DTheApp>
    </>
  );
}

export default MyApp;