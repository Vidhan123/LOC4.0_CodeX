import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import useArcanaAuth from '../arcana/useArcanaAuth';

function AuthRedirect() {
  const { handleRedirect } = useArcanaAuth();

  let history = useHistory();

  useEffect(() => {
    handleRedirect();
    // history.push('/dashboard');
  }, [])

  return (
    <>
      Redirecting...
    </>
  )
}

export default AuthRedirect;