import React from 'react';
import { useSession, signIn } from 'next-auth/react';

import Image from 'next/image';
import googleImg from '@/public/google.svg';
import loginImg from '@/public/login.jpg';

const LoginComponent: React.FC = () => {
  const { status } = useSession();

  const handleSignIn = async () => {
    signIn('google');
  };

  if (status === 'authenticated' || status === 'loading') {
    return null;
  }

  return (
    <div className="login-container">
      <div className="row-flex login-panel">
        <div className="col-2 col-2-a">
          <h1 className="title-line-1">Hit the Track.</h1>
          <h1 className="title-line-2">Make History</h1>
          <div className="google-login-holder">
            <button onClick={() => handleSignIn()}>
              <Image src={googleImg} alt="google_logo" priority />
              <div>Login with Google</div>
            </button>
          </div>
        </div>
        <div className="col-2 col-2-b">
          <Image src={loginImg} width="420" alt="exciting_road" priority />
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
