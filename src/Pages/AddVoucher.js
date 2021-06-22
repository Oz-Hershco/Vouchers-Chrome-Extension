import React, { useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { firebase, storage, vouchersCollection } from '../Firebase/firebase';
import uuid from 'react-uuid';
import Header from '../Components/Header';
import AddVoucherOptions from '../Components/AddVoucherOptions';

import '../Styles/Pages/AddVoucher.scss';

export default function AddVoucher(props) {

    const [isVoucherAddInProgress, setIsVoucherAddInProgress] = useState(false);
    const [title, setTitle] = useState("");
    const [folder, setFolder] = useState(null);
    const [amount, setAmount] = useState(0);
    const [currency, setCurrency] = useState("");

    var navigateScreen = props.navigateScreen;
    var selectedImage = props.selectedImage;
    var setSelectedImage = props.setSelectedImage;
    var setSelectedImageURL = props.setSelectedImageURL;
    var selectedImageURL = props.selectedImageURL;
    var user = props.user;
    var vouchers = props.vouchers;
    var setVouchers = props.setVouchers;
    var folders = props.folders;

    const handleAddNewVoucher = () => {

        setIsVoucherAddInProgress(true);

        var storageRef = storage.ref();
        var currentTime = new Date().getTime();
        var imgId = currentTime + '-' + uuid() + '-' + (selectedImage.name ? selectedImage.name.trim() : "captured");
        var uploadTask = storageRef.child('images/vouchers/' + imgId).put(selectedImage);

        uploadTask.on('state_changed', function (snapshot) {

            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED: // or 'paused'
                    console.log('Upload is paused');
                    break;
                case firebase.storage.TaskState.RUNNING: // or 'running'
                    console.log('Upload is running');
                    break;
                default:
                    break;
            }
        }, function (error) {
            // Handle unsuccessful uploads
            setIsVoucherAddInProgress(false)
        }, function () {

            uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {

                var voucherObj = {
                    id: uuid(),
                    created: new Date(),
                    thumbnail: {
                        id: imgId,
                        uri: downloadURL
                    },
                    title,
                    folder: folder ? folder : "",
                    amount,
                    currency,
                    used: false
                }
                vouchers.push(voucherObj);
                vouchersCollection.doc(user.vouchersid).set({
                    uid: user.vouchersid,
                    vouchers
                }, { merge: true }).then(() => {
                    console.log("Finished adding voucher with image data in firebase db.");
                    setIsVoucherAddInProgress(false)
                    setVouchers([...vouchers]);
                    navigateScreen("home");
                });
            });
        });

    }

    const handleTitleChange = (e) => {
        setTitle(e.currentTarget.value)
    }

    const handleFolderChange = (e) => {
        var selectedIndex = e.currentTarget.selectedIndex;
        if (selectedIndex) {
            var folderid = e.currentTarget[selectedIndex].getAttribute("folderid");
            setFolder({
                name: e.currentTarget.value,
                id: folderid
            })
        } else {
            setFolder(null)
        }

    }

    const handleAmountChange = (e) => {
        setAmount(parseInt(e.currentTarget.value))
    }

    const handleCurrencyChange = (e) => {
        setCurrency((e.currentTarget.value).toUpperCase())
    }

    const handleFormValidation = () => {
        return title.length && amount > 0 && currency;
    }

    return (
        <div className="AddVoucher">
            <Header title="NEW VOUCHER" navigateScreen={navigateScreen} navigateScreenName="home" />
            <div className="AddVoucher-Body">
                <input value={title} onChange={handleTitleChange} className="AddVoucher-Title-Input" type="text" placeholder="Title" />
                {
                    selectedImageURL ?
                        (
                            <img className="AddVoucher-Selected-Image" src={selectedImageURL ? selectedImageURL : "images/logo128.png"} alt="" />
                        )
                        :
                        (
                            <div className="AddVoucherOptions-Container">
                                <AddVoucherOptions navigateScreen={navigateScreen} setSelectedImage={setSelectedImage} setSelectedImageURL={setSelectedImageURL} />
                            </div>
                        )
                }
                <span onClick={() => { setSelectedImageURL(null) }} className="AddVoucher-Image-Replace-Btn">Replace</span>

                {
                    folders.length ?
                        (
                            <div className="AddVoucherOptions-Folderselect-Container">
                                <select onChange={handleFolderChange} style={{ backgroundImage: "url('images/folder-icon.png')" }} id="AddVoucherOptions-Folderselect-Input" className="AddVoucherOptions-Folderselect-Input" name="folders">
                                    <option value="null">Select a folder assignment</option>
                                    {
                                        folders.map((folderobj, i) => {
                                            return <option key={i} folderid={folderobj.id} value={folderobj.name}>{folderobj.name}</option>
                                        })
                                    }
                                </select>
                            </div>
                        ) : null
                }
                <div className="AddVoucherOptions-AmountCurrency-Container">
                    <input onClick={(e)=>{e.target.select()}} value={amount} onChange={handleAmountChange} className="AddVoucherOptions-Amount-Input" type="number" placeholder="Amount" />
                    <div className="AddVoucherOptions-Currency-Container">
                        <select onChange={handleCurrencyChange} className="AddVoucherOptions-Currencyselect-Input" name="currencies">
                            <option value="null">Currency</option>
                            <option value="usd">USD</option>
                            <option value="euro">EURO</option>
                            <option value="ils">ILS</option>
                        </select>
                    </div>
                </div>
            </div>
            <div onClick={handleAddNewVoucher} className="AddVoucher-Footer">
                <div className={isVoucherAddInProgress ? "button-secondary noselect disabled" : (handleFormValidation() ? "button-secondary noselect" : "button-secondary noselect disabled")}>
                    {
                        isVoucherAddInProgress ?
                            (
                                <Spinner animation="border" variant="light" />
                            ) :
                            (
                                <div>
                                    <img src="images/voucher-icon.png" alt="" />
                                    <span>ADD NEW VOUCHER</span>
                                </div>
                            )
                    }
                </div>
            </div>
        </div>
    )
}
