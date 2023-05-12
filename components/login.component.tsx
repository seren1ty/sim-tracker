import React, { useContext } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
// import GoogleLogin, {
//   GoogleLoginResponse,
//   GoogleLoginResponseOffline,
// } from 'react-google-login';
import { SessionContext } from '../context/session.context';

import Image from 'next/image';

const LoginComponent: React.FC = () => {
  const router = useRouter();

  const session = useContext(SessionContext);

  //   const isGoogleLoginResponse = (
  //     response: GoogleLoginResponse | GoogleLoginResponseOffline
  //   ): response is GoogleLoginResponse => {
  //     return (
  //       !!response &&
  //       typeof response === 'object' &&
  //       !!(response as GoogleLoginResponse).tokenId
  //     );
  //   };

  //   const responseSuccessGoogle = (
  //     googleResponse: GoogleLoginResponse | GoogleLoginResponseOffline
  //   ) => {
  //     if (isGoogleLoginResponse(googleResponse)) {
  //       axios
  //         .post('/login/google', { tokenId: googleResponse.tokenId })
  //         .then((response) => {
  //           if (session) session.setDriver(response.data);

  //           router.push('/');
  //         });
  //     }
  //   };

  const responseErrorGoogle = (googleResponse: any) => {
    console.error(googleResponse);
  };

  return (
    <React.Fragment>
      <div className="login-container">
        <div className="row-flex login-panel">
          <div className="col-2 col-2-a">
            <h1 className="title-line-1">Hit the Track.</h1>
            <h1 className="title-line-2">Make History</h1>
            <div className="google-login-holder">
              {/* TODO Use Next-Auth
                <GoogleLogin
                  clientId="290608108131-2oik11klmlpt0v1s1909u7pjrhrhon6c.apps.googleusercontent.com"
                  buttonText="Login with Google"
                  onSuccess={responseSuccessGoogle}
                  onFailure={responseErrorGoogle}
                  cookiePolicy={'single_host_origin'}
                />
              */}
            </div>
          </div>
          <div className="col-2 col-2-b">
            <Image src="/login.jpg" alt="exciting_road" priority />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default LoginComponent;
