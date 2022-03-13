import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, CardMedia, Typography, Box, CardActionArea, CardActions, Button } from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    display: 'inline-block',
    marginRight: '15px',
    marginTop: '10px',
    marginBottom: '0px',
    maxWidth: 330,
  },
  card: {
    maxWidth: 330,
    // marginBottom: '5px',
    backgroundColor: '#fff',
    boxShadow: 'none',
  },
});

function CategoryCard(props) {
  const { name, displayImage } = props.data;

  let history = useHistory();

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Card className={classes.card}>
        <CardActionArea onClick={() => history.push(`/dashboard/categories/${name}`)}>
          <CardMedia
            component="img"
            alt={name}
            image={`https://ipfs.infura.io/ipfs/${displayImage}`}
            title={name}
            style={{ border: '2px dotted' }}
          />
        </CardActionArea>
      </Card>
    </div>
  )
}

export default CategoryCard;
