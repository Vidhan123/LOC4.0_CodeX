import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, CardMedia, Typography, Box, CardActionArea, CardActions, Button } from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    display: 'inline-block',
    margin: '1.5rem',
    marginTop: '10px',
    marginBottom: '0px',
    maxWidth: 180,
  },
  card: {
    maxWidth: 180,
    marginBottom: '5px',
  },
  label: {
    padding: '5px',
    color: '#808080',
    textAlign: 'center',
  },
  subs: {
    fontWeight: 'normal',
  },
});

function BookCard(props) {
  const { title, author, coverPage, bookId } = props.data;

  let history = useHistory();

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Card className={classes.card}>
        <CardActionArea onClick={() => history.push(`/dashboard/books/${title}`)}>
          <CardMedia
            component="img"
            alt={title}
            image={`https://ipfs.infura.io/ipfs/${coverPage}`}
            title={title}
          />
        </CardActionArea>
      </Card>

      <div className={classes.label}>
        <h4 className={classes.subs}>{title}</h4>
        <h4 className={classes.subs}>{author}</h4>
      </div>
    </div>
  )
}

export default BookCard;
