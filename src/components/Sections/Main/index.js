import React, { useEffect, useState } from 'react';
import { ethers } from "ethers";
import { List, ListItem, ListItemText, Typography, Divider, ListItemSecondaryAction, Tooltip, IconButton, Button, TextField, Modal } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import BookCard from '../BookCard';
import CategoryCard from '../CategoryCard';
import { Add } from '@material-ui/icons';

import useDeLib from '../../../methods/useDeLib';

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

function Main(props) {
  const { walletAddress, admin, allBooks, allCategories, ipfs, sL, deLibC, deLibCR, deLibInterface, wallet, loadDetailsSecondary } = props;

  const [topRated, setTopRated] = useState([]);
  const [recentlyAdded, setRecentlyAdded] = useState([]);

  const [open, setOpen] = useState(false);
  const [details, setDetails] = useState({});

  const { addCategory } = useDeLib();

  const classes = useStyles();

  const handleOpen = async (Id) => {
    setDetails({
      name: "",
      displayImage: "",
      data: []
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

  const handleAddCategory = async () => {
    try {
      sL(true);
      const reader = new window.FileReader()
      let myBuffer;
      
      reader.readAsArrayBuffer(details.displayImage);
      reader.onloadend = async () => {
        myBuffer = await Buffer(reader.result);
        console.log(myBuffer);
        let CID = await ipfs.add(myBuffer);
        console.log(CID.path);
        
        await addCategory(deLibC, deLibInterface, wallet, details.name, CID.path, details.data);
        handleClose();
        await loadDetailsSecondary();
        sL(false);
      }
    }
    catch(err) {
      console.log(err);
      handleClose();
      sL(false);
    }
  }

  useEffect(() => {
    if(allBooks) {
      let temp = allBooks;
      if(allBooks.length <= 5) {
        setRecentlyAdded(allBooks);
        setTopRated(allBooks);
      }
      else {
        setRecentlyAdded(allBooks.slice(Math.max(allBooks.length - 5, 0)));
        // if(temp && temp.length > 0)
        // temp.sort((a, b) => parseInt(a.avgRating) - parseInt(b.avgRating));
        setTopRated(temp.slice(Math.max(allBooks.length - 5, 0)));
      }
    }
  }, [allBooks])

  const body = (
    <div className={classes.paper}>
      <h2 id="simple-modal-title">Create Category</h2>
      <div id="simple-modal-description">
        <TextField
          // variant="outlined"
          margin="normal"
          required
          fullWidth
          id="name"
          label="Name"
          name="name"
          value={details.name}
          onChange={(e) => handleChange(e)}
        /><br /><br />
        {(details.displayImage && details.displayImage !== "") && (details.displayImage.name ? 
            <img src={URL.createObjectURL(details.displayImage)} alt="img_edit" style={{width: "100px", height: "100px"}} />
            :
            <img src={details.displayImage} alt="img_edit" style={{width: "100px", height: "100px"}} />)
        }
        <br /><br />
        <Button variant="outlined" color="primary" component="label">
          Upload Image
          <input
            type="file"
            style={{display: "none"}}
            onChange={
              (e) => {
                setDetails({...details, displayImage: e.target.files[0] })
              }
            }
          />
        </Button><br /><br />
        
        <Button variant="contained" color="secondary" style={{ width: "45%", marginRight: "10%"}} onClick={handleClose}>Cancel</Button>
        <Button variant="contained" color="primary" style={{ width: "45%"}} onClick={() => {
          handleAddCategory()
        }}>Create</Button>
      </div>
    </div>
  );

  return(
    <>
      <List>
        <ListItem>
          <ListItemText
            disableTypography
            primary={<Typography variant="h6" style={{cursor: 'default'}}>Recently Added</Typography>}
          />
        </ListItem>      
        <Divider />
      </List>  

      {/* Recent 5 */}
      {recentlyAdded && recentlyAdded.map((boo, index) => (
        <BookCard key={boo.title} data={boo} />
      ))}

      <List>
        <ListItem>
          <ListItemText
            disableTypography
            primary={<Typography variant="h6" style={{cursor: 'default'}}>Top-Rated</Typography>}
          />
        </ListItem>      
        <Divider />
      </List>

      {/* Top 5 */}
      {topRated && topRated.map((boo, index) => (
        <BookCard key={boo.title} data={boo} />
      ))}

      <List>
        <ListItem>
          <ListItemText
            disableTypography
            primary={<Typography variant="h6" style={{cursor: 'default'}}>Browse by Category</Typography>}
          />
          {
            walletAddress && admin &&
            walletAddress === admin ?
            <ListItemSecondaryAction>
              <Tooltip title="Add Category" aria-label="add">
                <IconButton edge="end" style={{ border:'none',outline:'none' }}
                  onClick={() => handleOpen()}
                >
                  <Add fontSize="large" />
                </IconButton>
              </Tooltip>
            </ListItemSecondaryAction>
            :
            <></>
          }
        </ListItem>      
        <Divider />
      </List>

      {/* Categories */}
      {allCategories && allCategories.map((cat, index) => (
        <CategoryCard key={cat.name} data={cat} />
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

export default Main;