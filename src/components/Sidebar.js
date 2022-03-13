import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useStyles } from './styles';
import clsx from 'clsx';
import { Drawer, List, Typography, Divider, IconButton, ListItem, ListItemIcon, ListItemText, Avatar, ListSubheader, Button, Chip } from '@material-ui/core';
import { ChevronLeft, FolderShared, QueryBuilder, StarBorder, DeleteOutline, Storage, CloudQueue, LibraryBooks, DataUsage, Home, Search, History, AddCircleOutline, Face, Done } from '@material-ui/icons';
import Identicon from 'identicon.js';
import '../App.css';
import './Plans/Plans.css';

import { myColor } from '../helpers';

function Sidebar(props) {
  const { open, handleDrawerClose, section, setSection, walletAddress, admin, user, isLogin, setIsLogin } = props;

  let history = useHistory();
  const classes = useStyles();

  const myItemsArray = [
    {
      name: "Home",
      icon: <Home fontSize="large" />
    },
    {
      name: "Search",
      icon: <Search fontSize="large" />
    },
    {
      name: "Library",
      icon: <LibraryBooks fontSize="large" />
    },
    {
      name: "Dues",
      icon: <QueryBuilder fontSize="large" />
    },
    // {
    //   name: "Request",
    //   icon: <AddCircleOutline fontSize="large" />
    // },
    {
      name: "History",
      icon: <History fontSize="large" />
    }
  ];

  const secondaryListItems = (
    <div>
      <List>
        <br />
        <ListSubheader inset style={{cursor: 'default'}}>Account Details</ListSubheader>
        <ListItem>
          <ListItemIcon>
          {/* {account?  */}
            <Avatar src={walletAddress ? `data:image/png;base64,${new Identicon(walletAddress, 30).toString()}` : `data:image/png;base64,${new Identicon('0xdD2e2120F45cc6627447f33d0298F63A7B70C628', 30).toString()}`} />
            : <span></span>
          {/* } */}
          </ListItemIcon>
          <ListItemText primary={walletAddress ? walletAddress.substring(0,8)+'...'+walletAddress.substring(38,42): ('0xdD2e2120F45cc6627447f33d0298F63A7B70C628').substring(0,8)+'...'+('0xdD2e2120F45cc6627447f33d0298F63A7B70C628').substring(38,42)} style={{cursor: 'default', textTransform: "uppercase"}} secondary={
            (walletAddress && admin) && walletAddress === admin ? 
          <Chip
            size="small"
            icon={<Face />}
            label="Admin"
            // color="primary"
          />
          : 
          user && user.isMember ? 
          <Chip
            size="small"
            icon={<Face />}
            label="Member"
            // color="primary"
          />
          : ""
          } />
        </ListItem>
      </List>
      <List>
      <br />
        <Divider />
        {myItemsArray.map((item, index) => 
           <ListItem button
           key={index} 
           onClick={() => {
              setSection(item.name);
              history.push('/dashboard');
            }}
           style={{backgroundColor: section === item.name && "rgba(63,81,181,0.4)", color: section === item.name && myColor}}  
          >
            <ListItemIcon style={{color: section === item.name && myColor}}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              disableTypography
              primary={section === item.name ?
                <Typography style={{fontWeight: '750'}}>
                  {item.name}
                </Typography>
                :
                <Typography>{item.name}</Typography>
              } 
            />
         </ListItem>
        )}
        {/* <Divider /> */}
       </List>
    </div>
  );

  useEffect(() => {
    setIsLogin(true);
  }, [])

  return (
    <>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose} style={{border:'none',outline:'none'}}>
            <ChevronLeft />
          </IconButton>
        </div>
        <Divider />
        {secondaryListItems}
      </Drawer>
    </>
  )
}

export default Sidebar;