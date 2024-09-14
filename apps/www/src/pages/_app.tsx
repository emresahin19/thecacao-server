import { AppProps } from 'next/app';
import TheApp from 'lib/pages/www/app.page';
import "../assets/scss/variables.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <TheApp>
      <Component {...pageProps} />
    </TheApp>
  );
}

export default MyApp;