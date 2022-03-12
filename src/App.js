import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { CssBaseline, Container, Fab, Tooltip } from '@material-ui/core';
import { ethers } from "ethers";
import { Biconomy } from "@biconomy/mexa";
import ipfsClient from 'ipfs-http-client';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
// import FolderPage from './components/Sections/FolderPage';
import SideIcons from './components/SideIcons';
import { convertBytestoMB, convertGBtoMB } from './helpers';
import { useStyles } from './components/styles';
import Loading from './components/Loading/Loading';
import './App.css';
import Home from './components/Home/Home';
import AuthRedirect from './components/AuthRedirect';
import DeLib from './abis/DeLib.json';

import Main from './components/Sections/Main';
import Dues from './components/Sections/Dues';
import History from './components/Sections/History';
import Library from './components/Sections/Library';
import Request from './components/Sections/Request';
import Search from './components/Sections/Search';
import Users from './components/Sections/Users';

import useArcanaAuth from './arcana/useArcanaAuth';

import { Biconomy_API_Key, deLibContractAddress } from './config';

import { privateKeyToWallet } from './helpers';
import useDeLib from './methods/useDeLib';
import useArcanaStorage from './arcana/useArcanaStorage';
import CategoryPage from './components/Sections/CategoryPage';
import BookDetails from './components/Sections/BookDetails';
import ShelfPage from './components/Sections/ShelfPage';

const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

function App() {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const [folders, setFolders] = useState([]);
  const [allFolders, setAllFolders] = useState([]);
  const [recentFiles, setRecentFiles] = useState([]);
  const [starredFiles, setStarredFiles] = useState([]);
  const [sharedFiles, setSharedFiles] = useState([]);
  const [sharedFolders, setSharedFolders] = useState([]);
  const [sharedFoldersData, setSharedFoldersData] = useState([]);
  const [token, setToken] = useState({});
  const [ethSwapData, setEthSwapData] = useState({});
  const [dstorage, setDstorage] = useState(null);
  
  const [section, setSection] = useState('Home');
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [privateKey, setPrivateKey] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  const [publicKey, setPublicKey] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [deLibC, setDeLibC] = useState(null);
  const [deLibCR, setDeLibCR] = useState(null);
  const [deLibInterface, setDeLibInterface] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [user, setUser] = useState(null);
  const [isLogIn, setIsLogin] = useState(false);
  const [allBooks, setAllBooks] = useState([]);
  const [allCategories, setAllCategories] = useState([]);

  const { getUserDetails } = useArcanaAuth();
  const { initializeStorage } = useArcanaStorage();

  const { getAdmin, getUser, signup, getAllBooks, getCategories } = useDeLib();

  const loadWeb3 = async () => {
    try {
      setLoading(true);

      const web3 = new ethers.providers.JsonRpcProvider('https://rpc-mumbai.matic.today/');

      const details = await getUserDetails();
      const walle = privateKeyToWallet(details.privateKey, web3);
      
      console.log(walle);
      setWallet(walle);
      setWalletAddress(walle.address);
      setPrivateKey(details.privateKey);
      setPublicKey(walle.publicKey);
      setName(details.userInfo.name);
      setEmail(details.userInfo.email);

      await initializeStorage(details.privateKey, details.userInfo.email);

      const biconomy = new Biconomy(web3, { apiKey: Biconomy_API_Key, debug: true });
      window.web3 = new ethers.providers.Web3Provider(biconomy);
     
      biconomy.onEvent(biconomy.READY, async () => {
        try {
          // Initialize your dapp here like getting user accounts etc
          
          // Assign contract
          const deLibCTemp = new ethers.Contract(deLibContractAddress, DeLib.abi, window.web3);
          const deLibCRTemp = new ethers.Contract(deLibContractAddress, DeLib.abi, web3);
          setDeLibC(deLibCTemp);
          setDeLibCR(deLibCRTemp);

          const contractInterface = new ethers.utils.Interface(DeLib.abi);
          setDeLibInterface(contractInterface);

          const me = await getUser(deLibCRTemp, details.userInfo.email);
          console.log(me, parseInt(me.userId));
          
          if(parseInt(me.userId) === 0) {
            await signup(deLibCTemp, contractInterface, walle, details.userInfo.name, details.userInfo.email);
          }

          const adm = await getAdmin(deLibCRTemp);
          setAdmin(adm);
          setUser(me);
          console.log(adm);

          const books = await getAllBooks(deLibCRTemp);
          const categories = await getCategories(deLibCRTemp);
          setAllBooks(books);
          setAllCategories(categories);
          console.log(books, categories);
          setLoading(false);
        }
        catch(err) {
          console.log(err);
          setLoading(false);
        }
      }).onEvent(biconomy.ERROR, (error, message) => {
        // Handle error while initializing mexa
        console.log(error);
        setLoading(false);
      });
    }
    catch(err) {
      console.log(err);
      setLoading(false);
    }
  } 
  
  const loadDetailsSecondary = async () => {
    try {
      const books = await getAllBooks(deLibCR);
      const categories = await getCategories(deLibCR);
      setAllBooks(books);
      setAllCategories(categories);
      console.log(books, categories);
    }
    catch(err) {
      console.log(err);
    }
  }

  const loadDetails = async () => {
    try {
      await loadWeb3();
    }
    catch(err) {
      console.log(err);
      setLoading(false);
    }
  }
  
  const classes = useStyles();

  const [open, setOpen] = useState(true);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if(isLogIn) {
      loadDetails();
    }
  }, [isLogIn])

  return (
    <>
    <Router>
    {loading ? <Loading /> :
    <div className={classes.root}>
      <CssBaseline />
      
      <Switch>
        <Route path="/dashboard">
          <Navbar open={open} handleDrawerOpen={handleDrawerOpen} />
          
          <Sidebar 
            open={open}
            handleDrawerClose={handleDrawerClose} 
            section={section} 
            setSection={setSection} 
            sL={setLoading}
            walletAddress={walletAddress}
            admin={admin}
            user={user}
            setIsLogin={setIsLogin}
            isLogIn={isLogIn}
          />

          <main className={classes.content}>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="xl" className={classes.container}>
                {/* <Switch> */}
                  <Route path="/dashboard/categories/:categoryName">
                    <CategoryPage 
                      allBooks={allBooks} 
                      wallet={wallet}
                      admin={admin}
                      sL={setLoading}
                      deLibC={deLibC}
                      deLibInterface={deLibInterface}
                      allCategories={allCategories}
                      loadDetailsSecondary={loadDetailsSecondary}
                    />
                  </Route>
                  <Route path="/dashboard/shelves/:shelfName">
                    <ShelfPage 
                      allBooks={allBooks} 
                      wallet={wallet}
                      admin={admin}
                      sL={setLoading}
                      deLibC={deLibC}
                      deLibCR={deLibCR}
                      deLibInterface={deLibInterface}
                      allCategories={allCategories}
                      loadDetailsSecondary={loadDetailsSecondary}
                    />
                  </Route>
                  <Route path="/dashboard/books/:bookName">
                    <BookDetails 
                      allBooks={allBooks} 
                      wallet={wallet}
                      admin={admin}
                      sL={setLoading}
                      deLibC={deLibC}
                      deLibCR={deLibCR}
                      deLibInterface={deLibInterface}
                      allCategories={allCategories}
                      loadDetailsSecondary={loadDetailsSecondary}
                    />                    
                  </Route>
                  {
                    admin === walletAddress &&
                    <Route path="/dashboard/admin/users">
                      <Users 
                        wallet={wallet}
                        sL={setLoading}
                        deLibCR={deLibCR}
                        deLibC={deLibC}
                        deLibInterface={deLibInterface}
                      />
                    </Route>
                  }
                  <Route exact path="/dashboard">
                    <div>
                      {
                        section && section === "Home" &&
                        <Main 
                          ipfs={ipfs}
                          walletAddress={walletAddress} 
                          admin={admin} 
                          allBooks={allBooks}
                          allCategories={allCategories}
                          sL={setLoading}
                          deLibC={deLibC}
                          deLibCR={deLibCR}
                          deLibInterface={deLibInterface}
                          wallet={wallet} 
                          loadDetailsSecondary={loadDetailsSecondary}
                        />
                      }
                      {
                        section && section === "Search" &&
                        <Search 
                          ipfs={ipfs}
                          walletAddress={walletAddress} 
                          admin={admin} 
                          allBooks={allBooks}
                          allCategories={allCategories}
                          sL={setLoading}
                          deLibC={deLibC}
                          deLibCR={deLibCR}
                          deLibInterface={deLibInterface}
                          wallet={wallet} 
                          loadDetailsSecondary={loadDetailsSecondary}
                        />
                      }
                      {
                        section && section === "Library" &&
                        <Library 
                          wallet={wallet}
                          sL={setLoading}
                          deLibCR={deLibCR}
                          deLibC={deLibC}
                          deLibInterface={deLibInterface}
                        />
                      }
                      {
                        section && section === "Dues" &&
                        <Dues 
                          walletAddress={walletAddress} 
                          admin={admin}
                        />
                      }
                      {
                        section && section === "Request" &&
                        <Request />
                      }
                      {
                        section && section === "History" &&
                        <History 
                          walletAddress={walletAddress} 
                          admin={admin}
                        />
                      }
                    </div>
                  </Route>  
                {/* </Switch> */}
            </Container>
          </main>

          <SideIcons admin={admin} walletAddress={walletAddress} />
          
        </Route>
        
        <Route exact path="/">
          <Home sL={setLoading} setIsLogin={setIsLogin} />
        </Route>
        <Route path="*">
          <AuthRedirect />
        </Route>
      </Switch>
    </div>
    }
    </Router>
  </>
  );
}

export default App;