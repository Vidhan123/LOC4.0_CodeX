import React from 'react';
import { useHistory } from 'react-router-dom';
import { useStyles } from './styles';
import clsx from 'clsx';
import { AppBar, Toolbar, Typography, IconButton, Badge } from '@material-ui/core';
import { Menu, PowerSettingsNew } from '@material-ui/icons';
import '../App.css';

import useArcanaAuth from '../arcana/useArcanaAuth';

function Navbar(props) {
  const { open, handleDrawerOpen } = props;

  const { logout } = useArcanaAuth();

  const handleSignOut = async () => {
    await logout();
  }

  const classes = useStyles();

  return (
    <>
      <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
            style={{border:'none',outline:'none'}}
          >
            <Menu />
          </IconButton>
          <IconButton color="primary" 
            onClick={() => handleSignOut()}
            style={{ marginLeft: 'auto' }}
          >
            <Badge color="secondary">
              <PowerSettingsNew />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>
    </>
  )
}

export default Navbar;