import React, { useState } from 'react';
import { List, ListItemText, Typography, ListItem } from '@material-ui/core'

function Dues(props) {
  const [dues, setDues] = useState([]);

  return(
    <>
      <List>
            <ListItem>
              <ListItemText
                disableTypography
                primary={<Typography variant="h6" style={{cursor: 'default'}}>Number of Dues: {dues.length}</Typography>}
              />
               
            </ListItem>      
          </List>
    </>
  )
}

export default Dues;