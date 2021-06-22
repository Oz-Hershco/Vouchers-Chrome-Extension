/*global chrome*/
import React, { useState, useEffect } from 'react';
import uuid from 'react-uuid';
import Home from './Pages/Home';
import AddVoucher from './Pages/AddVoucher';
import VouchersList from './Pages/VouchersList';
import Voucher from './Pages/Voucher';
import { firebase, authUI, usersCollection, foldersCollection, vouchersCollection } from './Firebase/firebase';

import 'bootstrap/dist/css/bootstrap.min.css';
import './Styles/App.scss';

function App() {

  const [user, setUser] = useState(null);
  const [vouchers, setVouchers] = useState([]);
  const [folders, setFolders] = useState([]);
  const [selectedPage, setSelectedPage] = useState("home");
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageURL, setSelectedImageURL] = useState(null);
  const [selectedVoucherListFolder, setSelectedVoucherListFolder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedOnceAlready, setLoadedOnceAlready] = useState(false);

  useEffect(() => {
    // firebase.auth().signInAnonymously()
    //   .then(() => {
    //     // Signed in..
    //   })
    //   .catch((error) => {
    //     var errorCode = error.code;
    //     var errorMessage = error.message;
    //     // ...
    //   });
    // var ui = new firebaseui.auth.AuthUI(firebase.auth());
    // console.log(user)
    if (!user && !isLoading) {
      authUI.start(".google-login", {
        signInOptions: [
          firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        ],
        signInFlow: "popup",
      });
    }

    if (!loadedOnceAlready) {
      chrome.storage.local.get(['foldersData', 'vouchersData', 'userdata'], function (result) {
        console.log('foldersData:', result.foldersData);
        console.log('vouchersData:', result.vouchersData);
        console.log('userdata:', result.userdata);
      });
      firebase.auth().onAuthStateChanged((user) => {
        setLoadedOnceAlready(true);
        if (user) {
          var uid = user.uid;
          var userdata;
          //GET USER DATA
          usersCollection.doc(uid).get().then(async (doc) => {
            if (doc.exists) {

              userdata = doc.data();

              //GET USER FOLDERS
              await foldersCollection.doc(userdata.foldersid).get().then((doc) => {
                if (doc.exists) {
                  var foldersData = doc.data().folders;
                  setFolders(foldersData);
                  chrome.storage.local.set({ foldersData }, function () {
                  });
                }
              }).catch((error) => {
                console.log("Error getting document:", error);
              });

              //GET USER VOUCHERS
              await vouchersCollection.doc(userdata.vouchersid).get().then((doc) => {
                if (doc.exists) {
                  var vouchersData = doc.data().vouchers;
                  setVouchers(vouchersData);
                  chrome.storage.local.set({ vouchersData }, function () {
                  });
                }
              }).catch((error) => {
                console.log("Error getting document:", error);
              });

              setUser(userdata);
              chrome.storage.local.set({ userdata }, function () {
              });
            } else {
              console.log("running only once")
              userdata = {
                uid,
                foldersid: uuid(),
                vouchersid: uuid(),
              }
              usersCollection.doc(uid).set(userdata);
            }
            setUser(userdata);
            setIsLoading(false)
          }).catch((error) => {
            console.log("Error getting document:", error);
          });
        } else {
          // User is signed out
          setIsLoading(false);
          setUser(null);
        }
      });
    }

    return () => {

    }
  }, [user, isLoading]);

  const handleSelectVoucherFolder = (folderSelection) => {
    setSelectedVoucherListFolder(folderSelection);
    setSelectedPage("voucherslist");
  }

  const updateVoucherItemField = (id, field) => {
    vouchers.forEach(voucher => {
      if (voucher.id === id) {
        voucher[field] = !voucher.used;
      }
    });
    vouchersCollection.doc(user.vouchersid).set({
      uid: user.vouchersid,
      vouchers
    }, { merge: true }).then(() => {
      setVouchers([...vouchers]);
    });
  }

  const pages = {
    home: <Home user={user} folders={folders} setFolders={setFolders} vouchers={vouchers} setVouchers={setVouchers} navigateScreen={setSelectedPage} setSelectedImage={setSelectedImage} setSelectedImageURL={setSelectedImageURL} selectVoucherListFolder={handleSelectVoucherFolder} updateVoucherItemField={updateVoucherItemField} setSelectedVoucher={setSelectedVoucher} />,
    voucherslist: <VouchersList vouchers={selectedVoucherListFolder ? vouchers.filter(voucher => voucher.folder.id === selectedVoucherListFolder) : vouchers.filter(voucher => !voucher.folder)} navigateScreen={setSelectedPage} updateVoucherItemField={updateVoucherItemField} setSelectedVoucher={setSelectedVoucher} />,
    addvoucher: <AddVoucher user={user} folders={folders} vouchers={vouchers} setVouchers={setVouchers} navigateScreen={setSelectedPage} selectedImage={selectedImage} setSelectedImage={setSelectedImage} setSelectedImageURL={setSelectedImageURL} selectedImageURL={selectedImageURL} />,
    voucher: <Voucher user={user} voucher={selectedVoucher} vouchers={vouchers} setVouchers={setVouchers} navigateScreen={setSelectedPage} updateVoucherItemField={updateVoucherItemField} />
  }

  return isLoading ? (
    <div className="App EmptyLoading">
      <p>Loading...</p>
      <div>
        <img className="spinner" src="logo48.png" />
      </div>
    </div>
  ) :
    (
      user ?
        (
          <div className="App Lightbox-Shown">{pages[selectedPage]}</div>
        )
        :
        (
          <div className="App Login-State">
            <div className="Login-State-Header">
              <img src="logo48.png" />
            </div>
            <div className="Login-State-Footer">
              <div className="google-login"></div>
            </div>
          </div>
        )
    );
}

export default App;
