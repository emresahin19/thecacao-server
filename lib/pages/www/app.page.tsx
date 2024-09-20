import React from 'react';
import Head from "next/head";
import Script from "next/script";
import { Provider } from 'react-redux';
import { VariableProvider, ModalProvider, LoadingProvider } from '../../contexts';
import { LayoutContainer } from "../../layouts";
import { wrapper } from '../../store';
import { appDomain, appMode, googleTagManagerId } from 'lib/constants';
import '../../assets/scss/index.scss';

function TheApp({ children, ...rest }: { children: React.ReactNode }) {
  const { store, props } = wrapper.useWrappedStore(rest); 
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

                {appMode === 'production' && (
                  <>
                    <Script
                      src={`https://www.googletagmanager.com/gtag/js?id=${googleTagManagerId}`}
                      strategy="lazyOnload" // Changed from "afterInteractive" to "lazyOnload"
                      async 
                    />
                    <Script id="google-analytics" strategy="lazyOnload">
                      {`
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', '${googleTagManagerId}', {
                          'cookie_domain': '${appDomain}',
                          'cookie_expires': 63072000,
                          'cookie_update': false,
                          'cookie_flags': 'SameSite=None;Secure',
                        });
                      `}
                    </Script>
                  </>
                )}
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
