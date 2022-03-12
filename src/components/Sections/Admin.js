import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Divider, IconButton, List, ListItem, ListItemText, Typography, ListItemIcon, TextField, Button } from '@material-ui/core';
import { AccountBalance, ArrowBackIos } from '@material-ui/icons';

function Admin(props) {
  const { deployer, account, tokenBalance, withdrawTokens } = props;

  const [amount, setAmount] = useState(null);
  const [address, setAddress] = useState(null);

  let history = useHistory();

  useEffect(() => {
    if(!window.web3.utils) history.push('/dashboard');
  }, [])

  const handleTransfer = () => {
    if(amount && address) {
      if(amount <= parseInt(window.web3.utils.fromWei(tokenBalance))) {
        withdrawTokens(amount.toString(), address);
      }
    }
  }

  return (
    <>
      <List>
        <ListItem>
          <ListItemIcon>
            <IconButton edge="end" style={{border:'none',outline:'none', marginRight: '10px'}}
              onClick={() => history.push('/dashboard')}
            >
              <ArrowBackIos />
            </IconButton>
          </ListItemIcon>
          <ListItemText
            disableTypography
            primary={<Typography variant="h6" style={{cursor: 'default'}}>Transfer Tokens</Typography>}
          />
        </ListItem>      
      </List>
      
      <Divider />
      <br />

      <List>
        <ListItem style={{ cursor: "default" }}>
          <ListItemIcon>
            <AccountBalance />
          </ListItemIcon>
          <ListItemText primary={`${window.web3.utils ? window.web3.utils.fromWei(tokenBalance) : 0} VID Tokens`} />
        </ListItem>
        <ListItem>
          <TextField
            variant="outlined"
            margin="normal"
            required
            // fullWidth
            style={{ width: "50vw" }}
            id="token"
            label="Enter Token Amount"
            name="token"
            autoFocus
            onChange={(e) => setAmount(e.target.value)}
          />
        </ListItem>
        <ListItem>
          <TextField
            variant="outlined"
            margin="normal"
            required
            // fullWidth
            style={{ width: "50vw" }}
            id="wallet"
            label="Enter Wallet Address"
            name="wallet"
            onChange={(e) => setAddress(e.target.value)}
          />
        </ListItem>
        <br />
        <ListItem>
          <Button
            // type="submit"
            // fullWidth
            variant="contained"
            color="primary"
            onClick={() => handleTransfer()}
          >
            Transfer Tokens
          </Button>
        </ListItem>
      </List>

    </>
  )
}

export default Admin;