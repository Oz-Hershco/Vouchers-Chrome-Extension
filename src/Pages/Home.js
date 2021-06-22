import React, { useState } from 'react'
import { foldersCollection } from '../Firebase/firebase';
import uuid from 'react-uuid'
import Header from '../Components/Header'
import AddVoucherOptions from '../Components/AddVoucherOptions'
import VoucherFolder from '../Components/VoucherFolder';
import NewFolderInput from '../Components/NewFolderInput';
import VoucherItem from '../Components/VoucherItem';
import { groupBy } from '../Constants/Functions';

import '../Styles/Pages/Home.scss';


export default function Home(props) {

    const [newFolderMode, setNewFolderMode] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [newFolderInputValue, setNewFolderInputValue] = useState("");

    var user = props.user;
    var setUser = props.setUser;
    var folders = props.folders;
    var setFolders = props.setFolders;
    var navigateScreen = props.navigateScreen;
    var setSelectedImage = props.setSelectedImage;
    var setSelectedImageURL = props.setSelectedImageURL;
    var updateVoucherItemField = props.updateVoucherItemField;
    var setSelectedVoucher = props.setSelectedVoucher;
    var vouchers = props.vouchers;
    var setVouchers = props.setVouchers;

    var seperatedFoldersObject = groupBy(vouchers.filter(vouch => vouch.folder), "folder");
    var voucherfolderslist = Object.keys(seperatedFoldersObject).map((key) => seperatedFoldersObject[key]);
    var uncategorizedVouchers = vouchers.filter(vouch => !vouch.folder);
    var searchedVouchers = vouchers.filter(voucher => voucher.title.toUpperCase().indexOf(searchValue.toUpperCase()) > -1);

    const handleAddNewFolder = () => {
        if (newFolderInputValue.length) {
            var newFolderObject = {
                id: uuid(),
                name: newFolderInputValue
            };

            folders.push(newFolderObject)
            foldersCollection.doc(user.foldersid).set({
                uid: user.foldersid,
                folders
            }, { merge: true }).then(() => {
                setFolders([...folders])
            });
            setNewFolderMode(false);
        }
    }

    const handleVouchersSerach = (value) => {
        setSearchValue(value);
    }

    return (
        <div className="Home">
            <Header hasSearch={true} onSearch={handleVouchersSerach} setUser={setUser} logout={true} />
            {
                searchValue ?
                    (
                        <div className="Home-Body">
                            {
                                searchedVouchers.length ?
                                    (
                                        searchedVouchers.map((voucher, i) => {
                                            return (<VoucherItem key={i} voucher={voucher} updateVoucherItemField={updateVoucherItemField} navigateScreen={navigateScreen} setSelectedVoucher={setSelectedVoucher} />)
                                        })
                                    ) :
                                    (
                                        <div className="Home-Body-Empty-Container">
                                            <p className="Empty-State-Text">Sorry no vouchers found...</p>
                                        </div>
                                    )

                            }
                        </div>
                    ) :
                    (
                        <div className="Home-Body">
                            <div className="Folders-Controls-Container">
                                <div>
                                    <img src="images/folder-icon.png" alt="" />
                                    <span>FOLDERS</span>
                                </div>
                                {
                                    newFolderMode ?
                                        (
                                            <div className="Folders-Edit-Btns-Container">
                                                <div onClick={() => { setNewFolderMode(false) }} className="text-button-plain noselect">
                                                    Cancel
                                                </div>
                                                <div onClick={handleAddNewFolder} className="text-button-primary noselect">
                                                    Save
                                                </div>
                                            </div>
                                        ) :
                                        (
                                            <img onClick={() => { setNewFolderMode(true) }} className="Folders-Add-Btn" src="images/plus-icon.png" alt="" />
                                        )
                                }
                            </div>
                            {
                                newFolderMode ?
                                    (
                                        <NewFolderInput value={newFolderInputValue} onChange={setNewFolderInputValue} />
                                    )
                                    : null

                            }
                            <div className={folders.length || uncategorizedVouchers.length ? "Folders-Container" : "Folders-Container Empty"}>
                                {
                                    folders.length ?
                                        (
                                            folders.map((folder, i) => {
                                                return (
                                                    <VoucherFolder key={i} user={user} folderid={folder.id} name={folder.name} allvouchers={vouchers}  setVouchers={setVouchers} vouchers={vouchers.filter(voucher => voucher.folder.id === folder.id)} selectVoucherListFolder={props.selectVoucherListFolder} folders={folders} setFolders={setFolders} />
                                                )
                                            })
                                        ) : null
                                }
                                {

                                    (
                                        uncategorizedVouchers.length ?
                                            (
                                                <VoucherFolder name="Uncategorized" vouchers={uncategorizedVouchers} selectVoucherListFolder={props.selectVoucherListFolder} />
                                            ) : null
                                    )
                                }
                                {
                                    folders.length || uncategorizedVouchers.length ?
                                        null :
                                        (
                                            <p className="Empty-State-Text">Your vouchers will show here once you add them.</p>
                                        )
                                }
                            </div>
                        </div>
                    )
            }

            <div className="Home-Footer">
                <AddVoucherOptions navigateScreen={navigateScreen} setSelectedImage={setSelectedImage} setSelectedImageURL={setSelectedImageURL} />
            </div>
        </div>
    )
}
