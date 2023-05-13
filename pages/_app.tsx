import type { AppProps } from 'next/app';
import { SessionProvider } from '@/context/session.context';
import Layout from '@/components/layout/layout';
import '@/styles/globals.scss';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  );
}
