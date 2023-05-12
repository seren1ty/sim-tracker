import Navbar from '@/components/common/navbar.component';
import { SessionProvider } from '@/context/session.context';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider>
      <div className="container">
        <Navbar />
        <Component {...pageProps} />
      </div>
    </SessionProvider>
  );
}
