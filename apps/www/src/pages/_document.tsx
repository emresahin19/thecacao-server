import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
  DocumentInitialProps,
} from 'next/document';

import {
  cdnUrl,
  defaultColor,
  metaDescription,
  metaKeywords,
} from 'lib/constants';

const metaImageSizes = [
  {
    rel: 'favicon',
    width: 16,
    height: 16,
  },
  {
    rel: 'apple-touch-icon',
    width: 57,
    height: 57,
  },
  {
    rel: 'apple-touch-icon',
    width: 60,
    height: 60,
  },
  {
    rel: 'apple-touch-icon',
    width: 72,
    height: 72,
  },
  {
    rel: 'apple-touch-icon',
    width: 76,
    height: 76,
  },
  {
    rel: 'apple-touch-icon',
    width: 114,
    height: 114,
  },
  {
    rel: 'apple-touch-icon',
    width: 120,
    height: 120,
  },
  {
    rel: 'apple-touch-icon',
    width: 144,
    height: 144,
  },
  {
    rel: 'apple-touch-icon',
    width: 152,
    height: 152,
  },
  {
    rel: 'apple-touch-icon',
    width: 180,
    height: 180,
  },
  {
    rel: 'icon',
    width: 192,
    height: 192,
  },
  {
    rel: 'icon',
    width: 32,
    height: 32,
  },
  {
    rel: 'icon',
    width: 96,
    height: 96,
  },
  {
    rel: 'icon',
    width: 16,
    height: 16,
  },
]

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
          <link rel="preload" href={`${cdnUrl}/font/fonts.css`} as="style" />
          <link rel="stylesheet" href={`${cdnUrl}/font/fonts.css`} />
          <link rel="manifest" href="/manifest.json" />

          <meta name="author" content="The Cacao" />
          <meta httpEquiv="Content-Language" content="tr" />

          <meta name="msapplication-TileColor" content={defaultColor} />
          <meta name="msapplication-TileImage" content="/icons/apple-icon-144x144.png" />
          <meta name="theme-color" content={defaultColor} />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-capable" content="yes" />

          {metaImageSizes.map(({ rel, width, height }) => (
            <link
              key={`${rel}-${width}x${height}`}
              rel={rel}
              sizes={`${width}x${height}`}
              href={`${cdnUrl}/images/crop,w=${width},h=${height},f=png,q=80/the-cacao-logo.png`}
            />
          ))}

        </Head>

        <body id="www">
            <Main />
            <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
