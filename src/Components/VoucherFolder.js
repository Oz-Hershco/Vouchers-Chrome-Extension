import React, { useState } from 'react'
import { Spinner } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import { foldersCollection, vouchersCollection } from '../Firebase/firebase';

import '../Styles/Components/VoucherFolder.scss';

export default function VoucherFolder(props) {

    const [isFolderDeleteInProgress, setIsFolderDeleteInProgress] = useState(false);
    const [isHovering, setIsHovering] = useState(false);

    var user = props.user;
    var folderId = props.folderid;
    var folderName = props.name;
    var folderVouchers = props.vouchers;
    var folders = props.folders;
    var allvouchers = props.allvouchers;
    var setVouchers = props.setVouchers;
    var setFolders = props.setFolders;

    const handleFolderSelect = (e) => {
        console.log()
        var deleteButtonClassname = e.target.parentElement.className.baseVal;
        if (deleteButtonClassname !== "VoucherFolder-Delete-Btn") {
            props.selectVoucherListFolder(folderId)
        }
    }

    const handleDeleteFolder = () => {
        setIsFolderDeleteInProgress(false)
        allvouchers.forEach(voucher => {
            if (voucher.folder.id === folderId) {
                voucher.folder = "";
            }
        });
        var newFoldersList = folders.filter(folder => folder.id !== folderId);

        vouchersCollection.doc(user.vouchersid).set({
            uid: user.vouchersid,
            vouchers: allvouchers
        }, { merge: true }).then(() => {
            console.log("Finished updating vouchers without folder data in firebase db.");
            foldersCollection.doc(user.foldersid).set({
                uid: user.foldersid,
                folders: newFoldersList
            }, { merge: true }).then(() => {
                console.log("Finished updating folders list without folder in firebase db.");
                setIsFolderDeleteInProgress(true)
                setFolders([...newFoldersList]);
                setVouchers([...allvouchers]);
            });
        });
    }

    // const handleDeleteVoucher = () => {
    //     setIsLoading(true)
    //     var storageRef = storage.ref();

    //     // Create a reference to the file to delete
    //     var voucherRef = storageRef.child('images/vouchers/' + voucher.thumbnail.id);

    //     // Delete the file
    //     voucherRef.delete().then(() => {
    //         console.log("Image deleted from storage")

    //         var newVouchersArr = vouchers.filter(vouch => vouch.id !== voucher.id);
    //         return vouchersCollection.doc(user.vouchersid).update({
    //             vouchers: newVouchersArr
    //         })
    //             .then(() => {
    //                 console.log("Voucher record removed from db");
    //                 setVouchers([...newVouchersArr])
    //                 setIsLoading(false);
    //                 navigateScreen("home");
    //             })
    //             .catch((error) => {
    //                 // The document probably doesn't exist.
    //                 console.error("Error updating document: ", error);
    //             });
    //     }).catch((error) => {
    //         // Uh-oh, an error occurred!
    //     });

    // }

    return (
        <div onMouseEnter={() => { setIsHovering(true) }} onMouseLeave={() => { setIsHovering(false) }} onClick={folderVouchers.length ? handleFolderSelect : null} className={isFolderDeleteInProgress ? (folderVouchers.length ? "VoucherFolder noselect disabled" : "VoucherFolder noselect emptyfolder disabled") : (folderVouchers.length ? "VoucherFolder noselect" : "VoucherFolder noselect emptyfolder")}>
            <div className="VoucherFolder-Left">
                {
                    folderName !== "Uncategorized" ?
                        (
                            isHovering ?
                                (
                                    <FaTrash className="VoucherFolder-Delete-Btn" onClick={handleDeleteFolder} />
                                ) :
                                (
                                    <img src="images/folder-outline-icon.png" alt="" />
                                )
                        ) : <img src="images/folder-outline-icon.png" alt="" />

                }
                <span>{folderName}</span>
            </div>
            <div className="VoucherFolder-Right">
                {
                    isFolderDeleteInProgress ?
                        (
                            <Spinner animation="border" size="sm" />
                        ) :
                        (
                            <>
                                <span>{folderVouchers.length ? folderVouchers.length : "0"}</span>
                                <img src="images/chev-right-gray-icon.png" alt="" />
                            </>
                        )
                }

            </div>
        </div>
    )
}
