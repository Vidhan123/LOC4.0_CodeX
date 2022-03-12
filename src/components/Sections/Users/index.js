import React, { useEffect, useState } from 'react';
import Fuse from 'fuse.js'
import { TextField, Tooltip, Fab, List, ListItem, ListItemText, IconButton, Typography, ListItemSecondaryAction, Card, CardContent, Button } from '@material-ui/core';
import { GetAppOutlined } from '@material-ui/icons';
import useDeLib from '../../../methods/useDeLib';
import moment from 'moment';

import { downloadCSV } from '../../../helpers'; 

function Users(props) {
  const { wallet, sL, deLibCR, deLibC, deLibInterface } = props;

  const [allUsers, setAllUsers] = useState([]);
  const [searchString, setSearchString] = useState('');
  const [fuse, setFuse] = useState(null);
  const [searchedUsers, setSearchedUsers] = useState([]);

  const { getAllUsers, updateMembership } = useDeLib();

  const handleUpdateMembership = async (email, isMember) => {
    try {
      sL(true);
      await updateMembership(deLibC, deLibInterface, wallet, email, isMember);
      sL(false);
    }
    catch(err) {
      console.log(err);
      sL(false);
    }
  }

  const Load = async () => {
    const usersT = await getAllUsers(deLibCR);
    setAllUsers(usersT.filter((user) => {
      return user.pub !== wallet.publicKey;
    }))
    console.log(usersT);
  }

  useEffect(() => { 
    if(allUsers && allUsers.length > 0) {
      setSearchedUsers(allUsers);
      const fuseT = new Fuse(allUsers, {
        keys: [
          'name',
          'email'
        ],
        includeScore: false
      });
      setFuse(fuseT);
    }
  }, [allUsers])

  useEffect(() => {
    if(!searchString || searchString === "") {
      setSearchedUsers(allUsers);
    }
    else if(fuse && allUsers) {
      const result = fuse.search(searchString);
      setSearchedUsers(result.map((res) => res.item));
    }
  }, [searchString])


  useEffect(() => {
    Load();
  }, [])

  return(
    <>
      <TextField
        variant="outlined"
        margin="normal"
        id="search"
        label="Search users by name or email"
        name="search"
        onChange={(e) => {
          setSearchString(e.target.value);
        }}
        fullWidth
      />

      <List>
        <ListItem>
          <ListItemText
            disableTypography
            primary={<Typography variant="h6" style={{cursor: 'default'}}>Number of Users: {searchedUsers && searchedUsers.length}</Typography>}
          />
            <ListItemSecondaryAction>
              <Tooltip title="Download CSV" aria-label="download">
                <IconButton edge="end" style={{border:'none',outline:'none'}}
                  onClick={() => downloadCSV(searchedUsers, "Users")}
                >
                  <GetAppOutlined fontSize="large" />
                </IconButton>
              </Tooltip>
            </ListItemSecondaryAction>
        </ListItem>      
      </List>

      {searchedUsers.map((user) => (
        <Card key={user.email} style={{ maxWidth: "450px", display: "inline-block", margin: "10px" }}>
          <CardContent>
            <Typography gutterBottom variant="h6" component="h6" style={{ color: user.isAdmin && '#ff0000' }}>
              Name: {user.name}
            </Typography>
            <Typography gutterBottom>
              Email: {user.email}
            </Typography>
            <Typography gutterBottom>
              Time of Joining: {moment.unix(user.dateAdded).format('h:mm:ss A M/D/Y')}
            </Typography>
            <Typography gutterBottom>
              Wallet Address: {user.account}
            </Typography>
            <br />
            {
              user.isMember ? 
              <Button variant="contained" color="secondary"
              onClick={() => handleUpdateMembership(user.email, false)}
              fullWidth>Remove from members</Button>
              :
              <Button variant="contained" color="primary"
              onClick={() => handleUpdateMembership(user.email, true)}
              fullWidth>Add as member</Button>
            }
          </CardContent>
      </Card>
      ))}
    </>
  )
}

export default Users;