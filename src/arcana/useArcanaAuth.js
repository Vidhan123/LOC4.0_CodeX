import { AuthProvider, SocialLoginType } from "@arcana/auth";
import { useHistory } from 'react-router-dom';

import { APP_ID } from '../config';

let authInstance;

function useArcanaAuth() {
  
  let history = useHistory();

  const initializeAuth = async () => {
    if(!authInstance) {
      authInstance = await AuthProvider.init({
        appID: APP_ID,
        flow: 'popup',
        redirectUri: 'http://localhost:3000/auth/redirect',
      });
    }
  }

  const isLoggedIn = () => {
    if(authInstance) {
      return authInstance.isLoggedIn();
    }
  }

  const login = async () => {
    if(!isLoggedIn()) {
      await authInstance.loginWithSocial(SocialLoginType.google);
    }
    else {
      await logout();
      login();
    }
  }

  const getUserDetails = async () => {
    if(isLoggedIn()) {
      return authInstance.getUserInfo();
    }
  }

  const handleRedirect = () => {
    AuthProvider.handleRedirectPage(window.location);
  }

  const logout = async () => {
    if(isLoggedIn()) {
      await authInstance.logout();
      history.push('/');
    }
    else {
      history.push('/');
    }
  }

  return {
    initializeAuth,
    handleRedirect,
    isLoggedIn,
    login,
    logout,
    getUserDetails,
  };
}

export default useArcanaAuth;
