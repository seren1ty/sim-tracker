import React from 'react';
import Navbar from '../common/navbar.component';
import Head from 'next/head';

type LayoutProps = { children: React.ReactNode };

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Head>
        <title>Sim Tracker</title>
        <meta name="description" content="Sim racing laptime tracker" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container">
        <Navbar />
        {children}
      </div>
    </>
  );
};

export default Layout;
