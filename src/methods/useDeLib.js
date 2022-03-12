import { ethers } from "ethers";
import abi from "ethereumjs-abi";
import { toBuffer } from "ethereumjs-util";

import { deLibContractAddress, CHAIN_ID } from '../config';

const getSignatureParameters = signature => {
  if (!ethers.utils.isHexString(signature)) {
    throw new Error(
        'Given value "'.concat(signature, '" is not a valid hex string.')
    );
  }
  var r = signature.slice(0, 66);
  var s = "0x".concat(signature.slice(66, 130));
  var v = "0x".concat(signature.slice(130, 132));
  v = ethers.BigNumber.from(v).toNumber();
  if (![27, 28].includes(v)) v += 27;
  return {
    r: r,
    s: s,
    v: v
  };
};             

const constructMetaTransactionMessage = (nonce, salt, functionSignature, contractAddress) => {
  return abi.soliditySHA3(
    ["uint256","address","uint256","bytes"],
    [nonce, contractAddress, salt, toBuffer(functionSignature)]
  );
}

function useDeLib() {

  // --------------- Write Methods -------------------
  const writeHelper = async (deLibC, wallet, functionSignature, deLibInterface, gasLimit) => {
    let nonce = await deLibC.getNonce(wallet.address);
    
    let messageToSign = constructMetaTransactionMessage(parseInt(nonce), CHAIN_ID, functionSignature, deLibContractAddress);
    
    const signature = await wallet.signMessage(messageToSign);
    console.info(`User signature is ${signature}`);

    let { r, s, v } = getSignatureParameters(signature);
  
    let rawTx, tx;
    rawTx = {
      to: deLibContractAddress,
      data: deLibInterface.encodeFunctionData("executeMetaTransaction", [wallet.address, functionSignature, r, s, v]),
      from: wallet.address,
      gasLimit: gasLimit,
    };
    console.log(rawTx);
  
    tx = await wallet.signTransaction(rawTx);
    console.log(tx);
  
    let transactionHash;
    try {
      let receipt = await window.web3.sendTransaction(tx);
      console.log(receipt);
    } 
    catch (error) {
      if (error.returnedHash && error.expectedHash) {
        console.log("Transaction hash : ", error.returnedHash);
        transactionHash = error.returnedHash;
      } 
      else {
        console.log(error);
        console.log("Error while sending transaction");
      }
    }
  
    if (transactionHash) {
      // display transactionHash
      let receipt = await window.web3.waitForTransaction(transactionHash);
      console.log(receipt);
      //show Success Message
    } 
    else {
      console.log("Could not get transaction hash");
    }
  }
 
  const signup = async (deLibC, deLibInterface, wallet, name, email) => {
    try {
      let functionSignature = deLibInterface.encodeFunctionData("signup", [name, email, wallet.publicKey]);

      const gasLimit = 500000;

      await writeHelper(deLibC, wallet, functionSignature, deLibInterface, gasLimit);
    }
    catch(err) {
      console.log(err);
    }
  }

  const updateMembership = async (deLibC, deLibInterface, wallet, email, isMember) => {
    try {
      let functionSignature = deLibInterface.encodeFunctionData("updateMembership", [email, isMember]);

      const gasLimit = 500000;

      await writeHelper(deLibC, wallet, functionSignature, deLibInterface, gasLimit);
    }
    catch(err) {
      console.log(err);
    }
  }

  const addBook = async (deLibC, deLibInterface, wallet, title, author, description, coverPage, eBook, fileHash, stock) => {
    try {
      let functionSignature = deLibInterface.encodeFunctionData("addBook", [title, author, description, coverPage, eBook, fileHash, stock]);

      const gasLimit = 500000;

      await writeHelper(deLibC, wallet, functionSignature, deLibInterface, gasLimit);
    }
    catch(err) {
      console.log(err);
    }
  }

  const updateBook = async (deLibC, deLibInterface, wallet, bookId, title, author, description, coverPage, eBook, fileHash, stock) => {
    try {
      let functionSignature = deLibInterface.encodeFunctionData("updateBook", [bookId, title, author, description, coverPage, eBook, fileHash, stock]);

      const gasLimit = 500000;

      await writeHelper(deLibC, wallet, functionSignature, deLibInterface, gasLimit);
    }
    catch(err) {
      console.log(err);
    }
  }

  const updateMyBooks = async (deLibC, deLibInterface, wallet, bookIds) => {
    try {
      let functionSignature = deLibInterface.encodeFunctionData("updateMyBooks", [bookIds]);

      const gasLimit = 500000;

      await writeHelper(deLibC, wallet, functionSignature, deLibInterface, gasLimit);
    }
    catch(err) {
      console.log(err);
    }
  }

  const borrowBook = async (deLibC, deLibInterface, wallet, bookId, borrower) => {
    try {
      let functionSignature = deLibInterface.encodeFunctionData("borrowBook", [bookId, borrower]);

      const gasLimit = 500000;

      await writeHelper(deLibC, wallet, functionSignature, deLibInterface, gasLimit);
    }
    catch(err) {
      console.log(err);
    }
  }

  const renewBook = async (deLibC, deLibInterface, wallet, bookId, borrower) => {
    try {
      let functionSignature = deLibInterface.encodeFunctionData("renewBook", [bookId, borrower]);

      const gasLimit = 500000;

      await writeHelper(deLibC, wallet, functionSignature, deLibInterface, gasLimit);
    }
    catch(err) {
      console.log(err);
    }
  }

  const returnBook = async (deLibC, deLibInterface, wallet, bookId, borrower) => {
    try {
      let functionSignature = deLibInterface.encodeFunctionData("returnBook", [bookId, borrower]);

      const gasLimit = 500000;

      await writeHelper(deLibC, wallet, functionSignature, deLibInterface, gasLimit);
    }
    catch(err) {
      console.log(err);
    }
  }

  const rateBook = async (deLibC, deLibInterface, wallet, bookId, rating, comment) => {
    try {
      let functionSignature = deLibInterface.encodeFunctionData("rateBook", [bookId, rating, comment]);

      const gasLimit = 500000;

      await writeHelper(deLibC, wallet, functionSignature, deLibInterface, gasLimit);
    }
    catch(err) {
      console.log(err);
    }
  }

  const requestBook = async (deLibC, deLibInterface, wallet, title, author) => {
    try {
      let functionSignature = deLibInterface.encodeFunctionData("requestBook", [title, author]);

      const gasLimit = 500000;

      await writeHelper(deLibC, wallet, functionSignature, deLibInterface, gasLimit);
    }
    catch(err) {
      console.log(err);
    }
  }

  const addCategory = async (deLibC, deLibInterface, wallet, name, displayImage, data) => {
    try {
      let functionSignature = deLibInterface.encodeFunctionData("addCategory", [name, displayImage, data]);

      const gasLimit = 500000;

      await writeHelper(deLibC, wallet, functionSignature, deLibInterface, gasLimit);
    }
    catch(err) {
      console.log(err);
    }
  }

  const updateCategory = async (deLibC, deLibInterface, wallet, categoryId, name, displayImage, data) => {
    try {
      let functionSignature = deLibInterface.encodeFunctionData("updateCategory", [categoryId, name, displayImage, data]);

      const gasLimit = 500000;

      await writeHelper(deLibC, wallet, functionSignature, deLibInterface, gasLimit);
    }
    catch(err) {
      console.log(err);
    }
  }

  const removeCategory = async (deLibC, deLibInterface, wallet, categoryId) => {
    try {
      let functionSignature = deLibInterface.encodeFunctionData("removeCategory", [categoryId]);

      const gasLimit = 500000;

      await writeHelper(deLibC, wallet, functionSignature, deLibInterface, gasLimit);
    }
    catch(err) {
      console.log(err);
    }
  }

  const addShelf = async (deLibC, deLibInterface, wallet, name, data) => {
    try {
      let functionSignature = deLibInterface.encodeFunctionData("addShelf", [name, data]);

      const gasLimit = 500000;

      await writeHelper(deLibC, wallet, functionSignature, deLibInterface, gasLimit);
    }
    catch(err) {
      console.log(err);
    }
  }

  const updateShelf = async (deLibC, deLibInterface, wallet, shelfId, name, data) => {
    try {
      let functionSignature = deLibInterface.encodeFunctionData("updateShelf", [shelfId, name, data]);

      const gasLimit = 500000;

      await writeHelper(deLibC, wallet, functionSignature, deLibInterface, gasLimit);
    }
    catch(err) {
      console.log(err);
    }
  }

  const removeShelf = async (deLibC, deLibInterface, wallet, shelfId) => {
    try {
      let functionSignature = deLibInterface.encodeFunctionData("removeShelf", [shelfId]);

      const gasLimit = 500000;

      await writeHelper(deLibC, wallet, functionSignature, deLibInterface, gasLimit);
    }
    catch(err) {
      console.log(err);
    }
  }

  const updateMyShelves = async (deLibC, deLibInterface, wallet, shelfIds) => {
    try {
      let functionSignature = deLibInterface.encodeFunctionData("updateMyShelves", [shelfIds]);

      const gasLimit = 500000;

      await writeHelper(deLibC, wallet, functionSignature, deLibInterface, gasLimit);
    }
    catch(err) {
      console.log(err);
    }
  }

  const setAdmin = async (deLibC, deLibInterface, wallet, admin) => {
    try {
      let functionSignature = deLibInterface.encodeFunctionData("setAdmin", [admin]);

      const gasLimit = 500000;

      await writeHelper(deLibC, wallet, functionSignature, deLibInterface, gasLimit);
    }
    catch(err) {
      console.log(err);
    }
  }

  // --------------- Read Methods -------------------
  const getAdmin = async (deLibC) => {
    return await deLibC.admin();
  }
  
  const getUser = async (deLibC, email) => {
    return await deLibC.getUser(email);
  }

  const getAllUsers = async (deLibC) => {
    return await deLibC.getAllUsers();
  }

  const getBook = async (deLibC, bookId) => {
    return await deLibC.getBook(bookId);
  }

  const getAllBooks = async (deLibC) => {
    return await deLibC.getAllBooks();
  }

  const getMyBooks = async (deLibC, account) => {
    return await deLibC.getMyBooks(account);
  }

  const getCategories = async (deLibC) => {
    return await deLibC.getCategories();
  }

  const getMyShelves = async (deLibC, account) => {
    return await deLibC.getMyShelves(account);
  }

  // --------------- Events Read Methods -------------------

  return {
    // Write Methods
    signup,
    updateMembership,
    addBook,
    updateBook,
    updateMyBooks,
    borrowBook,
    renewBook,
    returnBook,
    rateBook,
    requestBook,
    addCategory,
    updateCategory,
    removeCategory,
    addShelf,
    updateShelf,
    removeShelf,
    updateMyShelves,
    setAdmin,
    // Read Methods
    getAdmin,
    getUser,
    getAllUsers,
    getBook,
    getAllBooks,
    getMyBooks,
    getCategories,
    getMyShelves,
    // Events Read Methods
  };
}

export default useDeLib;