import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Divider, IconButton, List, ListItem, ListItemText,  ListItemSecondaryAction, Typography, Tooltip, ListItemIcon, Button } from '@material-ui/core';
import { ArrowBackIos, DeleteForeverOutlined, Edit } from '@material-ui/icons';

import BookCard from './BookCard';
import useDeLib from '../../methods/useDeLib';

function ShelfPage(props) {
  const { allBooks, wallet, sL, deLibC, deLibInterface, allShelves, loadShelves } = props;

  let history = useHistory();

  const { shelfName } = useParams();

  const [details, setDetails] = useState({});
  const [content, setContent] = useState([]);
  const [newData, setNewData] = useState([]);
  const [editing, setEditing] = useState(false);

  const { removeShelf, updateShelf } = useDeLib();

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

  useEffect(() => {
    if(allShelves && shelfName) {
      const myCat = allShelves.filter((cat) => {
        return cat.name === shelfName;
      })
      setDetails(myCat[0]);
      setNewData(myCat[0].data);
    }
  }, [shelfName])

  useEffect(() => {
    if(newData && allBooks) {
      setContent(allBooks.filter((boo) => {
        return newData.indexOf(boo.bookId) !== -1;
      }));
    }
  }, [newData, details])

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
      
      {/* Category books */}
      {content && content.map((boo, index) => (
        <div key={boo.title}>
          <BookCard data={boo} />
          {editing && 
            <Button variant="outlined" color="secondary"
              onClick={() => setNewData((prev) => {
                let temp = prev.filter((Id) => {
                  return Id !== boo.bookId;
                })

                return ([...temp])
              })}
            >Remove</Button>
          }
        </div>
      ))}


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