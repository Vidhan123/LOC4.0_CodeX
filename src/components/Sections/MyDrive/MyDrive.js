import React, { useEffect } from 'react';
import { Divider, IconButton, List, ListItem, ListItemText,  ListItemSecondaryAction, Typography, Tooltip } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import FilesView from '../FilesView';
import FoldersView from '../FoldersView';

import Swal from 'sweetalert2';

function MyDrive(props) {
  const { recents, files, folders, star, unstar, deleteFile, sL, createFolder, shareAFile, restoreFile, section } = props;

  const handleCreateFolder = () => {
    let myName;
    Swal.fire({
      input: 'text',
      title: 'Enter a name for your folder',
      confirmButtonText: 'Continue &rarr;',
      allowOutsideClick: false,
      allowEscapeKey: false,
      backdrop: false,
      customClass: {
        container: 'my-swal'
      }
    }).then((result) => {
      if (result.value) {
        const answers = result.value;
        myName = answers;
        if(!myName || myName.trim() === ''){
          myName = 'Default';
        }
        
        createFolder(myName);
      }
    })
  }

  return (
    <>
      <List>
        <ListItem>
          <ListItemText
            disableTypography
            primary={<Typography variant="h6" style={{cursor: 'default'}}>My Drive</Typography>}
          />
          {/* <ListItemSecondaryAction>
            <IconButton edge="end" style={{border:'none',outline:'none'}}>
              <DeleteForever fontSize="large" />
            </IconButton>
          </ListItemSecondaryAction> */}
        </ListItem>      
      </List>
      
      <Divider />

      <List>
        <ListItem>
          <ListItemText primary="Recent" style={{cursor: 'default'}} />
        </ListItem>      
      </List>
      <FilesView 
        files={recents} 
        deleteFile={deleteFile} 
        star={star}
        unstar={unstar}
        sL={sL}
        shareAFile={shareAFile}
        restoreFile={restoreFile}
        section={section}
      />

      <List>
        <ListItem>
          <ListItemText primary="Folders" style={{cursor: 'default'}} />
          <ListItemSecondaryAction>
            <Tooltip title="Create new folder" aria-label="create">
              <IconButton edge="end" style={{border:'none',outline:'none'}}
                onClick={handleCreateFolder}
              >
                <Add />
              </IconButton>
            </Tooltip>
          </ListItemSecondaryAction>
        </ListItem>      
      </List>
      <FoldersView folders={folders} />

      <List>
        <ListItem>
          <ListItemText primary="Files" style={{cursor: 'default'}} />
        </ListItem>      
      </List>
      <FilesView
        files={files} 
        deleteFile={deleteFile} 
        star={star}
        unstar={unstar}
        sL={sL}
        shareAFile={shareAFile}
        restoreFile={restoreFile}
        section={section}
      />
    </>
  );
}

export default MyDrive;