import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { StateProvider } from '@/context/state.context';
import Layout from '@/components/layout/layout';
import '@/styles/globals.scss';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <StateProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </StateProvider>
    </SessionProvider>
  );
}
