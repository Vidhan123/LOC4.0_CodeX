import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { AppBar, CssBaseline, Grid, Toolbar, Box, Button } from '@material-ui/core';
import { useHomeStyles } from './HomeStyles';
import Particle from './Particle';
import '../../App.css';

import googleIcon from '../../assets/google.png';
import landingImg from '../../assets/landing.svg';

import useArcanaAuth from '../../arcana/useArcanaAuth';

function Home(props) {
  const { setIsLogin } = props;
  const history = useHistory();

  const { login, initializeAuth } = useArcanaAuth();

  const handleSignIn = async () => {
    try {
      await login();
      history.push('/dashboard');
    }
    catch(err) {
      console.log(err);
    }
  };

  const classes = useHomeStyles();

  useEffect(() => {
    setIsLogin(false);
    const Load = async () => {
      await initializeAuth();
    }
    Load();
  }, [])

  return (
    <React.Fragment>
      <div className={classes.root}>
        <CssBaseline />
          <AppBar className={classes.appbar} elevation={0}>
            <Toolbar>
              <h1 className={classes.appbarTitle}>De<span className={classes.highlight}>Lib</span></h1>
            </Toolbar>
          </AppBar>
          <br />
          <Grid container alignItems={'center'} justify={'center'}>
            <Grid item xs={10} sm={8} md={5}>
              <br />
              <Box display='flex' justifyContent='center'>
                <h5 className='typing'>Frame your Bookshelf Right</h5>
              </Box>
              
              <Box display={{xs:'none',md:'block'}} mt={7}>
                <Box display='flex'>
                <Button className={classes.button}
                  onClick={() => handleSignIn()}
                >
                  <img
                    src={googleIcon}
                    alt="google-icon"
                    style={{ width: "1.8rem", marginRight: "0.5rem", padding: "3px" }}
                  />
                    Continue with Google
                  </Button>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={11} sm={8} md={5} className={classes.imgWrapper}>
              <img src={landingImg} alt='landing' className={classes.img} />
              <Box display={{md:'none'}}>
                <br /><br />
                <Box display='flex' justifyContent='center'>
                  <Button className={classes.button}
                    onClick={() => handleSignIn()}
                  >
                  <img
                    src={googleIcon}
                    alt="google-icon"
                    style={{ width: "1.8rem", marginRight: "0.5rem", padding: "3px" }}
                  />
                    Continue with Google
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
      </div>
      <div className={classes.position}><Particle /></div>
    </React.Fragment>
  )
};

export default Home;