import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { TextField, Tooltip, Fab, List, ListItem, ListItemText, IconButton, Typography, ListItemSecondaryAction, Card, CardContent, Button, CardMedia, CardActionArea, Grid, Divider, Box } from '@material-ui/core';
import { Rating } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import useDeLib from '../../methods/useDeLib';
import { Add, AddCircleOutline, BookmarkBorderOutlined, Edit, GetAppOutlined } from '@material-ui/icons';

function BookDetails(props) {
  const { allBooks, wallet, admin, sL, deLibC, deLibInterface, allCategories, loadDetailsSecondary, user } = props;

  const { updateBook, updateMyBooks, borrowBook, returnBook, rateBook } = useDeLib();  

  const [details, setDetails] = useState({});

  const { bookName } = useParams();

  useEffect(() => {
    if(bookName) {
      const myCat = allBooks.filter((cat) => {
        return cat.title === bookName;
      })
      setDetails(myCat[0]);
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
            {
              wallet && admin && wallet.address === admin &&
              <Tooltip title="Add to Category" aria-label="add">
                <IconButton style={{border:'none',outline:'none'}}
                  onClick={async () => {
                    // editModeOn();
                  }}
                >
                  <AddCircleOutline fontSize="large" />
                </IconButton>
              </Tooltip>
            }
            
            <Tooltip title="Bookmark" aria-label="bookmark">
              <IconButton style={{border:'none',outline:'none'}}
                onClick={async () => {
                  // editModeOn();
                }}
              >
                <BookmarkBorderOutlined fontSize="large" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Download" aria-label="download">
              <IconButton style={{border:'none',outline:'none'}}
                onClick={async () => {
                  // editModeOn();
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