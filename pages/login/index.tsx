import Head from 'next/head';
import Image from 'next/image';
import { Inter } from 'next/font/google';
import styles from '@/styles/Home.module.css';
import LapList from '@/components/lap-list.component';
import { NextPage } from 'next';
import LoginComponent from '@/components/login.component';
import Navbar from '@/components/common/navbar.component';

const inter = Inter({ subsets: ['latin'] });

const LoginPage: NextPage = () => {
  return (
    <>
      <Navbar />
      <LoginComponent />;
    </>
  );
};

export default LoginPage;
