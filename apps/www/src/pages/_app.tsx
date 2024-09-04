import { AppProps } from 'next/app';
import { TheApp } from "@asim-ui/pages";
import "../assets/scss/variables.scss";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <TheApp>
      <Component {...pageProps} />
    </TheApp>
  );
}

export default MyApp;