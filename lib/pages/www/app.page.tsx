import React from 'react';
import Head from "next/head";
import Script from "next/script";
import { Provider } from 'react-redux';
import { VariableProvider, ModalProvider } from '@asim-ui/contexts';
import { LayoutContainer } from "@asim-ui/layouts";
import { apiDomain, googleTagManagerId, appMode } from "@asim-ui/constants";
import { store } from '@asim-ui/store';
import "../../assets/scss/variables.scss";

function TheApp({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Provider store={store}>
        <VariableProvider>
          <ModalProvider>
            <LayoutContainer>
              <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
              </Head>

              {appMode === 'production' && (
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
              )}
              {children}
            </LayoutContainer>
          </ModalProvider>
        </VariableProvider>
      </Provider>
    </>
  );
}

export default TheApp;
