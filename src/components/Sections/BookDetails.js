import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { TextField, Tooltip, Fab, List, ListItem, ListItemText, IconButton, Typography, ListItemSecondaryAction, Card, CardContent, Button, CardMedia, CardActionArea, Grid, Divider, Box } from '@material-ui/core';
import { Rating } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import useDeLib from '../../methods/useDeLib';
import { Add, AddCircleOutline, Bookmark, BookmarkBorderOutlined, Edit, GetAppOutlined } from '@material-ui/icons';

function BookDetails(props) {
  const { allBooks, wallet, admin, sL, deLibC, deLibCR, deLibInterface, allCategories, loadDetailsSecondary, user } = props;

  const { updateBook, updateMyBooks, borrowBook, returnBook, rateBook, getMyBooks } = useDeLib();  

  const [details, setDetails] = useState({});
  const [myBookIds, setMyBookIds] = useState([]);

  const { bookName } = useParams();

  const handleDownload = () => {
    // sL(true);
    fetch('https://ipfs.infura.io/ipfs/' + details.fileHash, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/pdf',
      },
    })
    .then((response) => {
      response.blob() 
    })
    .then((blob) => {
      // Create blob link to download
      const url = window.URL.createObjectURL(
        new Blob([blob]),
      );
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `download.pdf`,
      );

      // Append to html link element page
      document.body.appendChild(link);

      // sL(false);
      // Start download
      link.click();

      // Clean up and remove the link
      link.parentNode.removeChild(link);
    });
  }

  const handleBookmark = async (toBook) => {
    try {
      sL(true);
      if(toBook) {
        let newIds = [...myBookIds, details.bookId];
        await updateMyBooks(deLibC, deLibInterface, wallet, newIds);
        await Load();
        sL(false);
      }
      else {
        let newIds = myBookIds.filter((myI) => {
          return myI !== details.bookId;
        })
        await updateMyBooks(deLibC, deLibInterface, wallet, newIds);
        await Load();
        sL(false);
      }
    }
    catch(err) {
      console.log(err);
      sL(false);
    }
  }

  const Load = async () => {
    const myCat = allBooks.filter((cat) => {
      return cat.title === bookName;
    })
    setDetails(myCat[0]);
    const res = await getMyBooks(deLibCR, wallet.address);
    setMyBookIds(res.map((re) => parseInt(re.bookId)));
    console.log(res.map((re) => re.bookId))
  }

  useEffect(() => {
    if(bookName) {
      Load();
    }
  }, [bookName])

  return(
    <>
      <Grid container spacing={3} style={{ margin: "30px", padding: "20px" }}>
        <Grid item xs={12} sm={6} md={3}>
          <CardMedia
            component="img"
            alt={'title'}
            image={details && `https://ipfs.infura.io/ipfs/${details.coverPage}`}
            title={'title'}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={9}>
        <List style={{ marginRight: "100px"}}>
          <ListItem>
            <ListItemText
              disableTypography
              primary={<Typography variant="h4" style={{cursor: 'default'}}>{details && details.title}</Typography>}
              secondary={<Typography variant="h6" style={{cursor: 'default', color: '#808080'}}>{details && details.author}</Typography>}
            />
            <ListItemSecondaryAction>
            
            <Tooltip title="Bookmark" aria-label="bookmark">
              {
                myBookIds && details && details.bookId && myBookIds.indexOf(parseInt(details.bookId)) !== -1 ?
                <IconButton style={{border:'none',outline:'none'}}
                  onClick={async () => {
                    await handleBookmark(false);
                  }}
                >
                  <Bookmark fontSize="large" />
                </IconButton>
                :
                <IconButton style={{border:'none',outline:'none'}}
                  onClick={async () => {
                    await handleBookmark(true);
                  }}
                >
                  <BookmarkBorderOutlined fontSize="large" />
                </IconButton>
              }
              
            </Tooltip>
            <Tooltip title="Download" aria-label="download">
              <IconButton style={{border:'none',outline:'none'}}
                onClick={async () => {
                  handleDownload();
                }}
                disabled={user && !(user.isMember)}
              >
                <GetAppOutlined fontSize="large" />
              </IconButton>
            </Tooltip>
          </ListItemSecondaryAction>
          
          </ListItem>      
          <Divider />
          <br />
          <ListItem>
            {/* <Box component="fieldset" borderColor="transparent"> */}
              <Rating name="read-only" value={details && parseFloat(details.avgRating)} precision={0.5} readOnly /> 
              <Typography style={{ marginTop: '2px'}}>&nbsp;{details && parseFloat(details.avgRating)}({details && parseInt(details.reviewersCount)} ratings)</Typography>
            {/* </Box> */}
          </ListItem>

          <ListItem>
            <ListItemText
              // disableTypography
              primary={<Typography variant="h6" style={{cursor: 'default'}}>About this book</Typography>}
              secondary={details.description}
            />
          </ListItem>
          <ListItem>
          {
              // wallet && admin && wallet.address === admin &&
              <>
                <Button variant="contained" color="primary" style={{ marginRight: "25px" }}
                // onClick={() => handleUpdateMembership(user.email, false)}
                >Issue Book</Button>
                <Button variant="contained" color="secondary"
                // onClick={() => handleUpdateMembership(user.email, false)}
                >Return Book</Button>
              </>
          }
          </ListItem>
        </List>
        </Grid>
        
        <Grid item xs={12}>
          <List style={{ marginRight: "100px"}}>
            <ListItem>
              <ListItemText primary={<Typography variant="h6" style={{cursor: 'default'}}>Ratings and reviews</Typography>} />
              <ListItemSecondaryAction>
              <Tooltip title="Write Review" aria-label="write">
                <IconButton style={{ border:'none',outline:'none' }}
                  // onClick={() => handleOpen()}
                >
                  <Edit />
                </IconButton>
              </Tooltip>
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
          </List>
        </Grid>
      </Grid>
    </>
  )
}

export default BookDetails;