import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
  DocumentInitialProps,
} from 'next/document';
import {
  defaultColor,
  metaDescription,
  metaImage,
  metaImageHeight,
  metaImageWidth,
  metaTitle,
} from '@asim-ui/constants';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps> {
    const originalRenderPage = ctx.renderPage;

    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App) => App,
        enhanceComponent: (Component) => Component,
      });

    const initialProps = await Document.getInitialProps(ctx);
    return initialProps;
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="preload" href="https://fonts.cdnfonts.com/css/sf-pro-display" as="style" />
          <link rel="stylesheet" href="https://fonts.cdnfonts.com/css/sf-pro-display" />

          <link rel="apple-touch-icon" sizes="57x57" href="/icons/apple-icon-57x57.png" />
          <link rel="apple-touch-icon" sizes="60x60" href="/icons/apple-icon-60x60.png" />
          <link rel="apple-touch-icon" sizes="72x72" href="/icons/apple-icon-72x72.png" />
          <link rel="apple-touch-icon" sizes="76x76" href="/icons/apple-icon-76x76.png" />
          <link rel="apple-touch-icon" sizes="114x114" href="/icons/apple-icon-114x114.png" />
          <link rel="apple-touch-icon" sizes="120x120" href="/icons/apple-icon-120x120.png" />
          <link rel="apple-touch-icon" sizes="144x144" href="/icons/apple-icon-144x144.png" />
          <link rel="apple-touch-icon" sizes="152x152" href="/icons/apple-icon-152x152.png" />
          <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-icon-180x180.png" />

          <link rel="icon" type="image/png" sizes="192x192" href="/icons/android-icon-192x192.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="96x96" href="/icons/favicon-96x96.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />

          <link rel="manifest" href="/manifest.json" />

          <meta name="description" content={metaDescription} />
          <meta name="keywords" content="çikolata, kahve, dünya mutfağı, the cacao, gebze" />
          <meta name="author" content="The Cacao" />

          <meta property="og:site_name" content="thecacao.com.tr" />
          <meta property="og:title" content={metaTitle} />
          <meta property="og:description" content={metaDescription} />
          <meta property="og:image" content={metaImage} />
          <meta property="og:image:type" content="image/webp" />
          <meta property="og:image:width" content={metaImageWidth.toString()} />
          <meta property="og:image:height" content={metaImageHeight.toString()} />
          <meta property="og:url" content="https://thecacao.com.tr" />
          <meta property="og:type" content="website" />

          <meta property="twitter:card" content="summary_large_image" />
          <meta property="twitter:title" content={metaTitle} />
          <meta property="twitter:description" content={metaDescription} />
          <meta property="twitter:image:src" content={metaImage} />
          <meta property="twitter:image:width" content={metaImageWidth.toString()} />
          <meta property="twitter:image:height" content={metaImageHeight.toString()} />
          <meta property="twitter:site" content="@asim-ui" />

          <meta name="msapplication-TileColor" content={defaultColor} />
          <meta name="msapplication-TileImage" content="/icons/apple-icon-144x144.png" />
          <meta name="theme-color" content={defaultColor} />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-capable" content="yes" />

          <meta httpEquiv="Content-Language" content="tr" />
        </Head>

        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
