import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Divider, IconButton, List, ListItem, ListItemText,  ListItemSecondaryAction, Typography, Tooltip, ListItemIcon, Modal, Button, Checkbox } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { AddCircleOutline, ArrowBackIos, PersonAddOutlined, DeleteForeverOutlined, GetAppOutlined, RemoveCircleOutline } from '@material-ui/icons';
import FilesView from './FilesView';
import Swal from 'sweetalert2';

const useStyles = makeStyles((theme) => ({
  modal: {
    position: 'absolute',
    // width: '50vw',
    // minWidth: '300px',
    maxWidth: 'fit-content',
    maxHeight: 'fit-content', 
    backgroundColor: theme.palette.background.paper,
    // border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    textAlign: 'center'
  },
}))

function FolderPage(props) {
  const { files, folders, updateFiles, deleteFolder, shareAFile, shareAFolder, star, unstar, sL, deleteFile, myFiles, account, section } = props;

  let history = useHistory();

  useEffect(() => {
    return () => {
      history.push('/dashboard');
    }
  }, [account])

  const { folderName } = useParams();
  const classes = useStyles();

  const [fD, setFD] = useState(null);
  const [content, setContent] = useState([]);
  const [checked, setChecked] = useState([]);
  const [selectedIds, setIds] = useState('');
  const [isAdd, setAdd] = useState(true);

  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);

  const handleAddFiles = () => {
    setAdd(true);
    handleOpen2();    
  }

  const handleRemoveFiles = () => {
    setAdd(false);
    handleOpen2();
  }

  const handleToggle = (value) => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];
    let newIds = selectedIds;

    if (currentIndex === -1) {
      newChecked.push(value);
      newIds += `${files[value].fileId}0Vidhan0`;
    } else {
      newChecked.splice(currentIndex, 1);
      newIds = newIds.replace(`${files[value].fileId}0Vidhan0`, '');
    }

    setChecked(newChecked);
    setIds(newIds);
  };

  useEffect(() => {
    setChecked([]);
    setContent([]);
    setIds('');
    let myF = folders.filter((folder) => {
      return (folder.name === folderName)
    })

    if(myF[0]) {
      let newIds;
      let checks = false;
      
      setFD(myF[0]);
      if(myF[0].data.length > 0) {
        let ids = myF[0].data.split('0Vidhan0');
        ids.pop();
        let myFiles = [], listed = [];
        let myFile, k;
        for(let i=0;i<ids.length;i++) {
          myFile = files.filter((file) => {
            return (file.fileId === ids[i])
          });
          if(myFile.length > 0) {
            k = files.indexOf(myFile[0]);
          
            if(k !== -1) {
              listed.push(k);
              myFiles.push(myFile[0]);
            }
            else {
              if(!checks) newIds = myF[0].data;
              newIds = newIds.replace(`${ids[i]}0Vidhan0`, '');
              setIds(newIds);
              checks=true;
            }
          }
          else if(myFile.length === 0) {
            if(!checks) newIds = myF[0].data;
            newIds = newIds.replace(`${ids[i]}0Vidhan0`, '');
            setIds(newIds);
            checks=true;
          }
        }
        if(myF[0] && checks && !done) {
          if(!done) {
            Swal.fire({
              allowOutsideClick: false,
              allowEscapeKey: false,
              title: 'Update Folder',
              text: 'Some files have been deleted',
              confirmButtonText: 'Okay',
              icon: 'info',
              backdrop: false,
              customClass: {
                container: 'my-swal'
              }
            }).then(() => {
              setDone(true);
              updateFiles(myF[0].folderId, newIds);
              setContent([]);
              setFD(null);
              setIds('');
              history.push('/dashboard');
            })
          }  
        }
        if(!checks) {
          setIds(myF[0].data);
          setChecked(listed);
          setContent(myFiles);
        }
      }
    }
  }, [files, folders, open, done])

  const [modalStyle,setModalStyle] = useState({
    top: '20%',
    left: '40vw',
    transform: 'translate(-20%, -13%)'
  });

  const handleOpen2 = () => {
    setOpen(true);
  };

  const handleClose2 = () => {
    setOpen(false);
  };

  const handleShareFolder = () => {
    let myAd;
    Swal.fire({
      input: 'text',
      title: 'Enter address of receiver',
      confirmButtonText: 'Continue &rarr;',
      allowOutsideClick: false,
      allowEscapeKey: false,
      backdrop: false,
      customClass: {
        container: 'my-swal'
      }
    }).then((result) => {
      if(result.value) {
        const answers = result.value;
        myAd = answers;
        if(!myAd || myAd === ''){
          Swal.fire({
            allowOutsideClick: false,
            allowEscapeKey: false,
            title: 'Not a valid address',
            confirmButtonText: 'Okay',
            icon: 'error',
            backdrop: false,
            customClass: {
              container: 'my-swal'
            }
          })
        }
        else {
          let receivers = fD.receivers;
          let newR = receivers.split('0Vidhan0');
          newR.pop();
          let k = newR.indexOf(myAd);
          if(k === -1) {
            let mm = receivers += `${myAd}0Vidhan0`;
            shareAFolder(fD.folderId, mm, myAd);
          }
          else {
            Swal.fire({
              allowOutsideClick: false,
              allowEscapeKey: false,
              text: 'You have already shared this folder to this address',
              confirmButtonText: 'Okay',
              icon: 'info',
              backdrop: false,
              customClass: {
                container: 'my-swal'
              }
            })
          }
        }
      }
    })
  };
  
  const body = (
    <div style={modalStyle} className={classes.modal}>
      <h1 id="simple-modal-title">{isAdd ? 'Add' : 'Remove'} Files</h1>
      <div id="simple-modal-description">
        <List>
          {
            files
            .filter((file) => {
              if(isAdd && fD) {
                return (fD.data.indexOf(`${file.fileId}0Vidhan0`) === -1);
              }
              else if(fD && !isAdd) {
                return (fD.data.indexOf(`${file.fileId}0Vidhan0`) !== -1);
              } 
            })
            .map((file, index) => {
              const labelId = `checkbox-list-secondary-label-${files.indexOf(file)}`;
              return(
                <ListItem key={index}>
                  <ListItemText primary={file.fileDescription} />
                  <ListItemSecondaryAction>
                    <Checkbox
                      edge="end"
                      onChange={() => handleToggle(files.indexOf(file))}
                      // checked={checked.indexOf(files.indexOf(file)) !== -1}
                      inputProps={{ 'aria-labelledby': labelId }}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              )
            })
          }
        </List>
        <Button variant="contained" color="primary" onClick={async (e) => {
          updateFiles(fD.folderId, selectedIds);
          handleClose2();
        }}>
          Confirm
        </Button>
      </div>
    </div>
  );

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
            primary={<Typography variant="h6" style={{cursor: 'default'}}>{folderName}</Typography>}
          />
          {
          (fD && fD.uploader === account) ? 
          <>
          <ListItemSecondaryAction>
            <Tooltip title="Download Folder" aria-label="download">
              <IconButton edge="end" style={{border:'none',outline:'none',marginRight: '5px'}}
                  // onClick={() => handleDownloadFolder()}
              >
                <GetAppOutlined fontSize="large" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Add Files" aria-label="Add">
              <IconButton edge="end" style={{border:'none',outline:'none',marginRight: '5px'}}
                  onClick={() => handleAddFiles()}
              >
                <AddCircleOutline fontSize="large" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Remove Files" aria-label="remove">
              <IconButton edge="end" style={{border:'none',outline:'none',marginRight: '5px'}}
                  onClick={() => handleRemoveFiles()}
              >
                <RemoveCircleOutline fontSize="large" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Share Folder" aria-label="Share">
              <IconButton edge="end" style={{border:'none',outline:'none',marginRight: '5px'}}
                  onClick={() => handleShareFolder()}
              >
                <PersonAddOutlined fontSize="large" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete Folder" aria-label="delete">
              <IconButton edge="end" style={{border:'none',outline:'none'}}
                onClick={() => {
                  deleteFolder(fD.folderId);
                  history.push('/dashboard');
                }}
              >
                <DeleteForeverOutlined fontSize="large" />
              </IconButton>
            </Tooltip>
          </ListItemSecondaryAction>
          </>
          :
          <>
          </>
          }
        </ListItem>      
      </List>
      <Modal
        open={open}
        onClose={handleClose2}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
      <Divider />
      <br />
      <FilesView 
        files={content} 
        shareAFile={shareAFile}
        deleteFile={deleteFile} 
        star={star}
        unstar={unstar}
        sL={sL}
        section={section}
      />
    </>
  )
}

export default FolderPage;