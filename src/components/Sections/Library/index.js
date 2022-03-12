import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, Typography, Divider, IconButton, Tooltip, ListItemSecondaryAction, Modal, Button, TextField } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import FoldersView from '../FoldersView';
import useDeLib from '../../../methods/useDeLib';
import { Add } from '@material-ui/icons';
import BookCard from '../BookCard';

export const useStyles = makeStyles((theme) => ({
  absolute: {
    position: 'absolute',
    bottom: theme.spacing(3),
    right: theme.spacing(5),
  },
  paper: {
    position: 'absolute',
    left: '25vw',
    top: '5vh',
    width: '50vw',
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function Library(props) {
  const { wallet, sL, deLibCR, deLibC, deLibInterface } = props;

  const [books, setBooks] = useState([]);
  const [shelves, setShelves] = useState([]);

  const { getMyShelves, addShelf, getMyBooks } = useDeLib();

  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');

  const classes = useStyles();

  const handleOpen = async (Id) => {
    setName('');
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setName('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setName(value);
  };

  const handleAddShelf = async () => {
    try {
      sL(true);
      await addShelf(deLibC, deLibInterface, wallet, name, []);
      sL(false);
    }
    catch(err) {
      console.log(err);
      sL(false);
    }
  }

  const Load = async () => {
    try {
      const myB = await getMyBooks(deLibCR, wallet.address);
      const res = await getMyShelves(deLibCR, wallet.address);
      setBooks(myB);
      setShelves(res);
    }
    catch(err) {
      console.log(err);
    }
  }

  useEffect(() => {
    Load();
  }, [])

  const body = (
    <div className={classes.paper}>
      <h2 id="simple-modal-title">Add Shelf</h2>
      <div id="simple-modal-description">
        <TextField
          // variant="outlined"
          margin="normal"
          required
          fullWidth
          id="name"
          label="Name"
          name="name"
          value={name}
          onChange={(e) => handleChange(e)}
        /><br /><br />
        
        <Button variant="contained" color="secondary" style={{ width: "45%", marginRight: "10%"}} onClick={handleClose}>Cancel</Button>
        <Button variant="contained" color="primary" style={{ width: "45%"}} onClick={() => {
          handleAddShelf()
        }}>Add</Button>
      </div>
    </div>
  );

  return(
    <>
      <List>
        <ListItem>
          <ListItemText
            disableTypography
            primary={<Typography variant="h6" style={{cursor: 'default'}}>Your shelves</Typography>}
          />
          <ListItemSecondaryAction>
            <Tooltip title="Add Shelf" aria-label="add">
              <IconButton edge="end" style={{ border:'none',outline:'none' }}
                onClick={() => handleOpen()}
              >
                <Add fontSize="large" />
              </IconButton>
            </Tooltip>
          </ListItemSecondaryAction>
        </ListItem>      
        <Divider />
      </List>

      {/* Folders */}
      <FoldersView folders={shelves} />

      <List>
        <ListItem>
          <ListItemText
            disableTypography
            primary={<Typography variant="h6" style={{cursor: 'default'}}>Your books</Typography>}
          />
        </ListItem>      
        <Divider />
      </List>

      {/* My Books */}
      {books && books.map((boo, index) => (
        <BookCard key={boo.title} data={boo} />
      ))}

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </>
  )
}

export default Library;