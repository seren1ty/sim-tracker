import '@/styles/imports.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { StateProvider } from '@/context/state.context';
import Layout from '@/components/layout/layout';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@/styles/globals.scss';
import ClientSideRender from '@/components/common/client-side-render';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <StateProvider>
        <ClientSideRender>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ClientSideRender>
      </StateProvider>
    </SessionProvider>
  );
}
