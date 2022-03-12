import React, { useState, useEffect } from 'react';
import { Divider, IconButton, List, ListItem, ListItemText,  ListItemSecondaryAction, Typography, Tooltip } from '@material-ui/core';
import { DeleteForever } from '@material-ui/icons';
import FilesView from '../FilesView';
import FoldersView from '../FoldersView';

function Others(props) {

  const { name, trashFiles, recents, starred, shared, sharedF, star, unstar, deleteFile, sL, emptyTrash, shareAFile, restoreFile, section } = props;

  const [fileIds, setFileIds] = useState([]);

  useEffect(() => {
    let myIds = [];
    for(let i=0;i<trashFiles.length;i++) {
      myIds.push(trashFiles[i].fileId);
    }
    setFileIds(myIds);
  }, [trashFiles])

  return (
    <>
      <List>
        <ListItem>
          <ListItemText
            disableTypography
            primary={<Typography variant="h6" style={{cursor: 'default'}}>{name}</Typography>}
          />
          {
            name !== 'Trash' ? <div></div> :
            <ListItemSecondaryAction>
              <Tooltip title="Empty Trash" aria-label="delete">
                <IconButton edge="end" style={{border:'none',outline:'none'}}
                  onClick={() => emptyTrash(fileIds)}
                >
                  <DeleteForever fontSize="large" />
                </IconButton>
              </Tooltip>
            </ListItemSecondaryAction>
          }
        </ListItem>      
      </List>
      
      <Divider />
      <br />
      
      {
        name === 'Shared with me' && 
        <>
          <List>
            <ListItem>
              <ListItemText primary="Files" style={{cursor: 'default'}} />
            </ListItem>      
          </List>
        </>
      } 

      <FilesView files={
        name === 'Trash' ? trashFiles 
        :
        name === 'Recent' ? recents
        :
        name === 'Starred' ? starred
        :
        shared
      }
        deleteFile={deleteFile}
        star={star}
        unstar={unstar}
        sL={sL}
        shareAFile={shareAFile}
        restoreFile={restoreFile}
        section={section}
      />

      {
        name === 'Shared with me' && 
        <>
          <List>
            <ListItem>
              <ListItemText primary="Folders" style={{cursor: 'default'}} />
            </ListItem>      
          </List>
          <FoldersView folders={sharedF} />
        </>
      } 
    </>
  );
}

export default Others;