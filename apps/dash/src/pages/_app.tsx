import { DTheApp } from '@asim-ui/pages';
import { GlobalLoading } from "@asim-ui/components";
import { AppPropsWithLayout } from "@asim-ui/interfaces";
import '../assets/scss/variables.scss';

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