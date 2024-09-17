import React from 'react';
import Head from "next/head";
import { Provider } from 'react-redux';
import { VariableProvider, ModalProvider, LoadingProvider } from '../../contexts';
import { LayoutContainer } from "../../layouts";
import { store } from '../../store';
import '../../assets/scss/index.scss';

// import { apiDomain, googleTagManagerId, appMode } from "lib/constants";
// import Script from "next/script";

function TheApp({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Provider store={store}>
        <LoadingProvider>
          <ModalProvider>
            <VariableProvider>
              <LayoutContainer>
                <Head>
                  <meta name="viewport" content="width=device-width, initial-scale=1" />
                </Head>

                {/* {appMode === 'production' && (
                  <>
                    <Script
                      src={`https://www.googletagmanager.com/gtag/js?id=${googleTagManagerId}`}
                      strategy="afterInteractive"
                      async 
                      defer 
                    />
                    <Script id="google-analytics" strategy="afterInteractive">
                      {`
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', '${googleTagManagerId}', {
                          'cookie_domain': '${apiDomain}',
                          'cookie_expires': 63072000,
                          'cookie_flags': 'SameSite=None;Secure',
                        });
                      `}
                    </Script>
                  </>
                )} */}
                {children}
              </LayoutContainer>
            </VariableProvider>
          </ModalProvider>
        </LoadingProvider>
      </Provider>
    </>
  );
}

export default TheApp;
