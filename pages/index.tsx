import Head from 'next/head';
import Image from 'next/image';
import { Inter } from 'next/font/google';
import styles from '@/styles/Home.module.css';
import LapList from '@/components/lap-list.component';
import { NextPage } from 'next';
import Navbar from '@/components/common/navbar.component';

const inter = Inter({ subsets: ['latin'] });

const LapListPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Sim Tracker</title>
        <meta name="description" content="Sim racing laptime tracker" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <LapList />
    </>
  );
};

export default LapListPage;
