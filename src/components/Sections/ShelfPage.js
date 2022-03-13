import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Divider, IconButton, List, ListItem, ListItemText,  ListItemSecondaryAction, Typography, Tooltip, ListItemIcon, Button } from '@material-ui/core';
import { ArrowBackIos, DeleteForeverOutlined, Edit } from '@material-ui/icons';

import BookCard from './BookCard';
import useDeLib from '../../methods/useDeLib';

function ShelfPage(props) {
  const { allBooks, wallet, sL, deLibC, deLibCR, deLibInterface } = props;

  let history = useHistory();

  const { shelfName } = useParams();

  const [details, setDetails] = useState({});
  const [content, setContent] = useState([]);
  const [newData, setNewData] = useState([]);
  const [myBooks, setMyBooks] = useState([]);
  const [editing, setEditing] = useState(false);
  const [allShelves, setAllShelves] = useState([]);

  const { removeShelf, updateShelf, getMyBooks, getMyShelves } = useDeLib();

  const loadShelves = async () => {
    const res = await getMyShelves(deLibCR, wallet.address);
    setAllShelves(res);
  }

  const handleRemoveShelf = async () => {
    try {
      sL(true);
      await removeShelf(deLibC, deLibInterface, wallet, details.shelfId);
      await loadShelves();
      sL(false);
    }
    catch(err) {
      sL(false);
      console.log(err);
    }
  }

  const editModeOn = () => {
    setEditing(true);
    setNewData(details.data);
  }

  const editModeOff = () => {
    setEditing(false);
    setNewData(details.data);
  }

  const handleUpdateShelf = async () => {
    try {
      sL(true);
      await updateShelf(deLibC, deLibInterface, wallet, details.shelfId, details.name, newData);
      await loadShelves();
      sL(false);
    }
    catch(err) {
      sL(false);
      console.log(err);
    }
  }

  const Load = async () => {
    setContent(myBooks.filter((boo) => {
      return newData.map((newD) => parseInt(newD)).indexOf(parseInt(boo.bookId)) !== -1;
    }));
  }

  useEffect(() => {
    if(allShelves && shelfName) {
      const myCat = allShelves.filter((cat) => {
        return cat.name === shelfName;
      })
      if(myCat[0]) {
        setDetails(myCat[0]);
        setNewData(myCat[0].data);
      }
    }
  }, [shelfName, allShelves])

  useEffect(() => {
    if(newData && allBooks && myBooks) {
      Load();
    }
  }, [shelfName, allBooks, newData, myBooks, allShelves])

  useEffect(() => {
    const Load = async () => {
      await loadShelves();
      const res = await getMyBooks(deLibCR, wallet.address);
      setMyBooks(res);
    }
    Load();
  }, [])

  return(
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
            primary={<Typography variant="h6" style={{cursor: 'default'}}>{shelfName}</Typography>}
          />

          <>
          <ListItemSecondaryAction>
            {/* {
              wallet.address === admin && */}
              <>
                <Tooltip title="Edit Shelf" aria-label="edit">
                  <IconButton edge="end" style={{border:'none',outline:'none'}}
                    onClick={async () => {
                      editModeOn();
                    }}
                  >
                    <Edit fontSize="large" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete Shelf" aria-label="delete">
                  <IconButton edge="end" style={{border:'none',outline:'none'}}
                    onClick={async () => {
                      await handleRemoveShelf();
                      history.push('/dashboard');
                    }}
                  >
                    <DeleteForeverOutlined fontSize="large" />
                  </IconButton>
                </Tooltip>
              </>
            {/* } */}
          </ListItemSecondaryAction>
          </>
        </ListItem>      
      </List>
      <Divider />
      <br />
      
      {/* Shelf books */}
      {content && content.map((boo, index) => (
        <div key={boo.title} style={{ display: 'inline-block', textAlign: 'center' }}>
          <BookCard data={boo} />
          <br />
          {editing && 
            <Button variant="outlined" color="secondary" style={{ width: 180 }}
              onClick={() => setNewData((prev) => {
                let temp = prev.filter((Id) => {
                  return parseInt(Id) !== parseInt(boo.bookId);
                })

                return ([...temp])
              })}
            >Remove</Button>
          }
        </div>
      ))}
      {editing && myBooks && newData && content && myBooks
      .filter((myB) => {
        return (content.map((newD) => parseInt(newD)).indexOf(parseInt(myB.bookId)) === -1 && newData.map((newD) => parseInt(newD)).indexOf(parseInt(myB.bookId)) === -1);
      })
      .map((boo, index) => (
        <div key={boo.title} style={{ display: 'inline-block', textAlign: 'center' }}>
          <BookCard data={boo} />
          <br />
          {editing && 
            <Button variant="outlined" color="primary" style={{ width: 180 }}
              onClick={() => setNewData([...newData, boo.bookId])}
            >Add</Button>
          }
        </div>
      ))}


      <br /><br />
      {editing &&
        <div style={{ width: '100%', textAlign: 'center' }}>
          <Button variant="contained" color="secondary"
          onClick={() => editModeOff()} style={{ marginRight: "25px" }}
          >Cancel</Button>
          <Button variant="contained" color="primary"
            onClick={() => handleUpdateShelf()}
          >Confirm</Button>
        </div>
      }
    </>
  )
}

export default ShelfPage;