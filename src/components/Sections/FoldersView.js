import React from 'react';
import { Link } from "react-router-dom";
import { Button } from '@material-ui/core';
import { Folder } from '@material-ui/icons';
import '../../App.css';

function FoldersView(props) {
  
  const { folders } = props;

  return (
    <>
      {
        folders.map((folder, index) => 
          <div key={index} style={{display: 'inline-block', margin: '10px'}}>
            <Link to={`/dashboard/shelves/${folder.name}`} style={{textDecoration: 'none'}}>
              <Button
                variant="outlined"
                color="primary"
                size="large"
                startIcon={<Folder />}
                style={{ outline: 'none' }}
              >
                {folder.name}
              </Button>
            </Link>
          </div>
        )
      }
    </>
  )
}

export default FoldersView;