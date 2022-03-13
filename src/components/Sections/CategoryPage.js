import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Divider, IconButton, List, ListItem, ListItemText,  ListItemSecondaryAction, Typography, Tooltip, ListItemIcon, Button } from '@material-ui/core';
import { ArrowBackIos, DeleteForeverOutlined, Edit } from '@material-ui/icons';

import BookCard from './BookCard';
import useDeLib from '../../methods/useDeLib';

function CategoryPage(props) {
  const { allBooks, wallet, admin, sL, deLibC, deLibInterface, allCategories, loadDetailsSecondary } = props;

  let history = useHistory();

  const { categoryName } = useParams();

  const [details, setDetails] = useState({});
  const [content, setContent] = useState([]);
  const [newData, setNewData] = useState([]);
  const [editing, setEditing] = useState(false);

  const { removeCategory, updateCategory } = useDeLib();

  const handleRemoveCategory = async () => {
    try {
      sL(true);
      await removeCategory(deLibC, deLibInterface, wallet, details.categoryId);
      await loadDetailsSecondary();
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

  const handleUpdateCategory = async () => {
    try {
      sL(true);
      await updateCategory(deLibC, deLibInterface, wallet, details.categoryId, details.name, details.displayImage, newData);
      await loadDetailsSecondary();
      sL(false);
    }
    catch(err) {
      sL(false);
      console.log(err);
    }
  }

  useEffect(() => {
    if(allCategories && categoryName) {
      const myCat = allCategories.filter((cat) => {
        return cat.name === categoryName;
      })
      if(myCat[0]) {
        setDetails(myCat[0]);
        setNewData(myCat[0].data);
      }
    }
  }, [categoryName, allCategories])

  useEffect(() => {
    if(newData && allBooks) {
      setContent(allBooks.filter((boo) => {
        return newData.map((newD) => parseInt(newD)).indexOf(parseInt(boo.bookId)) !== -1;
      }));
    }
  }, [newData, details, categoryName, allCategories])

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
            primary={<Typography variant="h6" style={{cursor: 'default'}}>{categoryName}</Typography>}
          />

          <>
          <ListItemSecondaryAction>
            {
              wallet.address === admin &&
              <>
                <Tooltip title="Edit Category" aria-label="edit">
                  <IconButton edge="end" style={{border:'none',outline:'none'}}
                    onClick={async () => {
                      editModeOn();
                    }}
                  >
                    <Edit fontSize="large" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete Category" aria-label="delete">
                  <IconButton edge="end" style={{border:'none',outline:'none'}}
                    onClick={async () => {
                      await handleRemoveCategory();
                      history.push('/dashboard');
                    }}
                  >
                    <DeleteForeverOutlined fontSize="large" />
                  </IconButton>
                </Tooltip>
              </>
            }
          </ListItemSecondaryAction>
          </>
        </ListItem>      
      </List>
      <Divider />
      <br />
      
      {/* Category books */}
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

      {editing && allBooks && content && allBooks
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


      {editing &&
        <div style={{ width: '100%', textAlign: 'center' }}>
          <br /><br />
          <Button variant="contained" color="secondary"
          onClick={() => editModeOff()} style={{ marginRight: "25px" }}
          >Cancel</Button>
          <Button variant="contained" color="primary"
            onClick={() => handleUpdateCategory()}
          >Confirm</Button>
        </div>
      }
    </>
  )
}

export default CategoryPage;