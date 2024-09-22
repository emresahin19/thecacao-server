import { DTheApp } from 'lib/pages';
import GlobalLoading from "lib/components/Loading/components/global-loading.component";
import { AppPropsWithLayout } from "lib/interfaces";

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout || ((page) => page)

  return (
    <>
      <DTheApp>
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