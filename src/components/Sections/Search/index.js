import React, { useEffect, useState } from 'react';
import { TextField, Tooltip, Fab, List, ListItem, ListItemText, IconButton, Typography, ListItemSecondaryAction, Divider, Button, Modal, FormControl, Input, InputLabel } from '@material-ui/core';
import Fuse from 'fuse.js'
import BookCard from '../BookCard';
import { Add, GetAppOutlined } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { useStyles } from '../../styles';

import useDeLib from '../../../methods/useDeLib';
import useArcanaStorage from '../../../arcana/useArcanaStorage';

import { downloadCSV } from '../../../helpers'; 

export const useStyles2 = makeStyles((theme) => ({
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

function Search(props) {
  const { walletAddress, admin, allBooks, allCategories, ipfs, sL, deLibC, deLibCR, deLibInterface, wallet, loadDetailsSecondary } = props;

  const [searchString, setSearchString] = useState('');
  const [fuse, setFuse] = useState(null);
  const [searchedBooks, setSearchedBooks] = useState([]);

  const [open, setOpen] = useState(false);
  const [details, setDetails] = useState({});

  const { addBook } = useDeLib();
  const { upload } = useArcanaStorage();

  const classes2 = useStyles2();

  const handleOpen = async (Id) => {
    setDetails({
      title: "",
      author: "",
      description: "",
      coverPage: "",
      eBook: false,
      fileHash: "",
      stock: 0
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setDetails({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails({...details, [name]: value});
  };

  const handleAddBook = async () => {
    try {
      sL(true);
      const reader = new window.FileReader()
      let myBuffer;
      
      reader.readAsArrayBuffer(details.coverPage);
      reader.onloadend = async () => {
        myBuffer = await Buffer(reader.result);
        console.log(myBuffer);
        let CID = await ipfs.add(myBuffer);
        
        let coverPage = CID.path;
        
        if(details.eBook && details.eBook !== "") {
          const reader2 = new window.FileReader()
          let myBuffer2;
          
          reader2.readAsArrayBuffer(details.fileHash);
          reader2.onloadend = async () => {
            myBuffer2 = await Buffer(reader2.result);
            console.log(myBuffer2);
            let CID2 = await ipfs.add(myBuffer2);
          
            console.log(CID2.path, coverPage);
            await addBook(deLibC, deLibInterface, wallet, details.title, details.author, details.description, coverPage, details.eBook, CID2.path, details.stock);
            handleClose();
            await loadDetailsSecondary();
            sL(false);
          }
        }
      }
    }
    catch(err) {
      console.log(err);
      handleClose();
      sL(false);
    }
  }

  useEffect(() => { 
    if(allBooks && allBooks.length > 0) {
      setSearchedBooks(allBooks);
      const fuseT = new Fuse(allBooks, {
        keys: [
          'title',
          'author',
          'description'
        ],
        includeScore: false
      });
      setFuse(fuseT);
    }
  }, [allBooks])

  useEffect(() => {
    if(!searchString || searchString === "") {
      setSearchedBooks(allBooks);
    }
    else if(fuse && allBooks) {
      const result = fuse.search(searchString);
      setSearchedBooks(result.map((res) => res.item));
    }
  }, [searchString])

  const classes = useStyles();

  const body = (
    <div className={classes2.paper}>
      <h2 id="simple-modal-title">Add Book</h2>
      <div id="simple-modal-description">
        <TextField
          // variant="outlined"
          margin="normal"
          required
          fullWidth
          id="title"
          label="Title"
          name="title"
          value={details.title}
          onChange={(e) => handleChange(e)}
        />
        <TextField
          // variant="outlined"
          margin="normal"
          required
          fullWidth
          id="author"
          label="Author"
          name="author"
          value={details.author}
          onChange={(e) => handleChange(e)}
        />
        <TextField
          // variant="outlined"
          margin="normal"
          required
          fullWidth
          id="description"
          label="Description"
          name="description"
          value={details.description}
          onChange={(e) => handleChange(e)}
        />
        <FormControl>
          <InputLabel htmlFor="standard-adornment-amount">Stock</InputLabel>
          <Input
            id="stock"
            required
            name="stock"
            value={details.stock}
            onChange={(e) => handleChange(e)}
            style={{ marginRight: "20px" }}
          />
        </FormControl>
        <br /><br />
        {(details.coverPage && details.coverPage !== "") && (details.coverPage.name ? 
            <img src={URL.createObjectURL(details.coverPage)} alt="img_edit" style={{width: "100px", height: "100px"}} />
            :
            <img src={details.coverPage} alt="img_edit" style={{width: "100px", height: "100px"}} />)
        }
        <br /><br />
        <Button variant="outlined" color="primary" component="label">
          Upload Image
          <input
            type="file"
            style={{display: "none"}}
            onChange={
              (e) => {
                setDetails({...details, coverPage: e.target.files[0] })
              }
            }
          />
        </Button><br /><br />
        {/* <Button variant="outlined" color="primary" component="label"> */}
          Upload eBook
          <br />
          <input
            type="file"
            // style={{display: "none"}}
            onChange={
              (e) => {
                setDetails({...details, fileHash: e.target.files[0], eBook: true })
              }
            }
          />
        {/* </Button> */}
        <br /><br />
        <Button variant="contained" color="secondary" style={{ width: "45%", marginRight: "10%"}} onClick={handleClose}>Cancel</Button>
        <Button variant="contained" color="primary" style={{ width: "45%"}} onClick={() => {
          handleAddBook()
        }}>Add</Button>
      </div>
    </div>
  );

  return(
    <>
      <TextField
        variant="outlined"
        margin="normal"
        id="search"
        label="Search books by title, author or description"
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
            primary={<Typography variant="h6" style={{cursor: 'default'}}>Number of Books: {searchedBooks.length}</Typography>}
          />
            {
              walletAddress && admin &&
              walletAddress === admin &&
              <ListItemSecondaryAction>
                <Tooltip title="Download CSV" aria-label="download">
                  <IconButton edge="end" style={{border:'none',outline:'none'}}
                    onClick={() => downloadCSV(allBooks, "Books")}
                  >
                    <GetAppOutlined fontSize="large" />
                  </IconButton>
                </Tooltip>
              </ListItemSecondaryAction>
            }
        </ListItem>      
      </List>

      {/* Search Results */}
      {searchedBooks.map((boo) => (
        <BookCard data={boo} key={boo.title} />
      ))}

      {
        walletAddress && admin &&
        walletAddress === admin ?
        <Tooltip title="Add Book" aria-label="add">
          <Fab color="secondary" className={classes.absolute} style={{outline: 'none', border: 'none'}} 
          onClick={() => handleOpen()}
          >
            <Add />
          </Fab>
        </Tooltip>
        :
        <></>
      } 

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

export default Search;