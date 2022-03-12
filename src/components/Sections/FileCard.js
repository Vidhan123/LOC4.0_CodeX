import React, { useState, useEffect, useRef } from 'react';
import { IconButton, List, ListItem,ListItemIcon, ListItemText, ListItemSecondaryAction, Popper, ClickAwayListener, Grow, Paper } from '@material-ui/core';
import { Delete, GetApp, Info, InsertDriveFile, MoreVert, PersonAdd, Restore, Star } from '@material-ui/icons';
import { convertBytes } from '../../helpers';
import moment from 'moment';
import '../../App.css';
import Swal from 'sweetalert2';

function FileCard(props) {
  const { star, unstar, deleteFile, sL, shareAFile, restoreFile, section } = props;
  const { fileName, fileDescription, fileHash, fileId, fileType, fileSize, uploadTime, starred, receivers, uploader } = props.file;

  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  const handleDownload = () => {
    // sL(true);
      fetch('https://ipfs.infura.io/ipfs/' + fileHash, {
      method: 'GET',
      headers: {
        'Content-Type': fileType,
      },
    })
    .then((response) => response.blob())
    .then((blob) => {
      // Create blob link to download
      const url = window.URL.createObjectURL(
        new Blob([blob]),
      );
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        fileName,
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

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  }

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  }

  const handleShowDetails = () => {
    handleToggle();
    Swal.fire({
      allowOutsideClick: false,
      allowEscapeKey: false,
      title: 'Details',
      html: 
      `<h4><b>File Name:</b> ${fileName}</h4><br />`
      +`<h4><b>Description:</b> ${fileDescription}</h4><br />`
      +`<h4><b>File Type:</b> ${fileType}</h4><br />`
      +`<h4><b>File Size:</b> ${convertBytes(fileSize)}</h4><br />`
      +`<h4><b>Upload Time:</b> ${moment.unix(uploadTime).format('h:mm:ss A M/D/Y')}</h4><br />`
      +`<h4><b>Uploaded By</b> ${uploader}</h4>`
      ,
      confirmButtonText: 'Okay',
      icon: 'info',
      backdrop: false,
      customClass: {
        container: 'my-swal'
      }
    })
  }

  const handleShare = (id, hash, receivers) => {
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
      if (result.value) {
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
          let newR = receivers.split('0Vidhan0');
          newR.pop();
          let k = newR.indexOf(myAd);
          if(k === -1) {
            let mm = receivers += `${myAd}0Vidhan0`;
            shareAFile(id, hash, mm, myAd);
          }
          else {
            Swal.fire({
              allowOutsideClick: false,
              allowEscapeKey: false,
              text: 'You have already shared this file to this address',
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
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <div className='fileCard'>
      <a className="fileCard--top" href={`https://ipfs.infura.io/ipfs/${fileHash}`} target="_blank" rel="noopener noreferrer" >
      {/* <div id="wrap">
        <iframe title={props.name} id="scaled-frame" src="https://bafybeia244fuooxiqf6k5qi4hdcwlwd3ikdyqigryq3x3u63xyms5nes6i.ipfs.infura-ipfs.io/"></iframe>
      </div> */}
        <InsertDriveFile color="primary" style={{fontSize:130,opacity:0.7}} />
      </a>
      <div className="fileCard--bottom">
        <List>
          <ListItem>
            <ListItemText secondary={fileDescription} style={{cursor: 'default'}} />
            <ListItemSecondaryAction>
              <IconButton edge="end" style={{border:'none',outline:'none'}}
                ref={anchorRef}
                aria-controls={open ? 'menu-list-grow' : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
              >
                <MoreVert />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>      
        </List>
      </div>

      <div>
        <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <List>
                    <ListItem button onClick={() => handleShowDetails()}>
                      <ListItemIcon>
                        <Info />
                      </ListItemIcon>
                      <ListItemText primary="Details" />
                    </ListItem>
                    {/* <ListItem button>
                      <ListItemIcon>
                        <Visibility />
                      </ListItemIcon>
                      <ListItemText primary="View" />
                    </ListItem> */}
                    {
                      section !== 'Trash' &&
                      <>
                        <ListItem button onClick={() => handleDownload()}>
                          <ListItemIcon>
                            <GetApp />
                          </ListItemIcon>
                          <ListItemText primary="Download" />
                        </ListItem>
                        <ListItem button
                          onClick={() => {
                            starred ? unstar(fileId, fileHash)
                            : star(fileId, fileHash)
                          }}
                        >
                          <ListItemIcon>
                            <Star />
                          </ListItemIcon>
                          <ListItemText primary={starred?'Remove from Starred':'Add to Starred'} />
                        </ListItem>
                        <ListItem button
                          onClick={() => handleShare(fileId, fileHash, receivers)}
                        >
                          <ListItemIcon>
                            <PersonAdd />
                          </ListItemIcon>
                          <ListItemText primary="Share" />
                        </ListItem>
                      </>
                    }
                    {
                      section === 'Trash' &&
                      <>
                        <ListItem button
                          onClick={() => restoreFile(fileId, fileHash)}
                        >
                          <ListItemIcon>
                            <Restore />
                          </ListItemIcon>
                          <ListItemText primary="Restore" />
                        </ListItem>
                      </>  
                    }
                    <ListItem button
                      onClick={() => deleteFile(fileId, fileHash)}
                    >
                      <ListItemIcon>
                        <Delete />
                      </ListItemIcon>
                      <ListItemText primary="Delete" />
                    </ListItem>
                  </List>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>

    </div>
  )
}

export default FileCard;
