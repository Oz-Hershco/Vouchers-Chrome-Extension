import React, { useState } from 'react'
import { Spinner } from 'react-bootstrap';
import { storage, vouchersCollection } from '../Firebase/firebase';
import { BiTrash } from 'react-icons/bi';
import Lightbox from 'react-image-lightbox';

import Header from '../Components/Header';

import '../Styles/Pages/Voucher.scss';

export default function Voucher(props) {
    const [isLoading, setIsLoading] = useState(false);
    const [showLightbox, setShowLightbox] = useState(false);

    var user = props.user;
    var navigateScreen = props.navigateScreen;
    var voucher = props.voucher;
    var vouchers = props.vouchers;
    var setVouchers = props.setVouchers;
    var updateVoucherItemField = props.updateVoucherItemField;

    const handleUseVoucher = () => {
        updateVoucherItemField(voucher.id, "used");
    }

    const handleDeleteVoucher = () => {
        setIsLoading(true)
        var storageRef = storage.ref();

        // Create a reference to the file to delete
        var voucherRef = storageRef.child('images/vouchers/' + voucher.thumbnail.id);

        // Delete the file
        voucherRef.delete().then(() => {
            console.log("Image deleted from storage")

            var newVouchersArr = vouchers.filter(vouch => vouch.id !== voucher.id);
            return vouchersCollection.doc(user.vouchersid).update({
                vouchers: newVouchersArr
            })
                .then(() => {
                    console.log("Voucher record removed from db");
                    setVouchers([...newVouchersArr])
                    setIsLoading(false);
                    navigateScreen("home");
                })
                .catch((error) => {
                    // The document probably doesn't exist.
                    console.error("Error updating document: ", error);
                });
        }).catch((error) => {
            // Uh-oh, an error occurred!
        });

    }

    const handleVoucherImageLightboxClose = () => {
        setShowLightbox(false);
    }

    return (
        <div className="Voucher Lightbox-Shown">
            <Header title={voucher.title} subtitle={`${voucher.amount} ${voucher.currency}`} navigateScreen={navigateScreen} navigateScreenName="voucherslist" />
            <div className="Voucher-Body">
                <img onClick={() => setShowLightbox(true)} className="Voucher-Image" src={voucher.thumbnail.uri} alt="" />
            </div>
            {
                isLoading ?
                    (
                        <div className="Voucher-Footer">
                            <Spinner animation="border" variant="info" />
                        </div>
                    ) :
                    (
                        <div className="Voucher-Footer">
                            <div onClick={handleUseVoucher} className={voucher.used ? "button-main noselect" : "button-secondary noselect"}>
                                <img src={voucher.used ? "images/checked-white-icon.png" : "images/unchecked-white-icon.png"} alt="" />
                                <span>{voucher.used ? "USED VOUCHER" : "MARK AS USED"}</span>
                            </div>
                            <div onClick={handleDeleteVoucher} className="text-button-danger noselect">
                                <BiTrash />
                                <span>DELETE</span>
                            </div>
                        </div>
                    )
            }

            {
                showLightbox && (
                    <Lightbox
                        mainSrc={voucher.thumbnail.uri}
                        nextSrc={null}
                        prevSrc={null}
                        onCloseRequest={handleVoucherImageLightboxClose}
                    />
                )
            }
        </div>
    )
}
