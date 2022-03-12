import React, { useState } from 'react';
import useDeLib from '../../../methods/useDeLib';

function Request(props) {
  const { deLibC, deLibInterface, wallet } = props;

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');

  const { requestBook } = useDeLib();

  const handleRequest = async () => {
    
  }

  return(
    <>
      Request
    </>
  )
}

export default Request;