/*global chrome*/
import React from 'react'
import { b64toBlob } from '../Constants/Functions';
import '../Styles/Components/AddVoucherOptions.scss';

export default function AddVoucherOptions(props) {

    var navigateScreen = props.navigateScreen;
    var setSelectedImage = props.setSelectedImage;
    var setSelectedImageURL = props.setSelectedImageURL;

    const handleAttachClick = () => {
        document.getElementById("Attach-Fileuploader-Input").click();
    }

    const handleCaptureClick = () => {
        chrome.runtime.sendMessage({ type: 'captureTab', data: "" }, (response) => {
            var imgSrc = response.imgSrc;
            var base64data = imgSrc.split("base64,")[1];
            var contentType = imgSrc.split(":")[1].split(";")[0];
            const blob = b64toBlob(base64data, contentType);
            const blobUrl = URL.createObjectURL(blob);

            navigateScreen("addvoucher");
            setSelectedImage(blob);

            var reader = new FileReader();

            reader.onload = function (e) {
                setSelectedImageURL(e.target.result);
            }

            reader.readAsDataURL(blob); // convert to base64 string
        });
    }

    const handleFileSelection = (e) => {
        var selectedFile = e.currentTarget.files[0];
        if (selectedFile && (selectedFile.type === "image/jpeg" || selectedFile.type === "image/png" || selectedFile.type === "image/gif")) {
            navigateScreen("addvoucher");
            setSelectedImage(selectedFile);

            var reader = new FileReader();

            reader.onload = function (e) {
                setSelectedImageURL(e.target.result);
            }

            reader.readAsDataURL(selectedFile); // convert to base64 string

        }
    }

    return (
        <div className="AddVoucherOptions">
            <div onClick={handleAttachClick} className="button-main noselect">
                <img src="images/paperclip-icon.png" alt="" />
                <span>ATTACH</span>
                <input onChange={handleFileSelection} id="Attach-Fileuploader-Input" type="file" />
            </div>

            <p className="Empty-State-Text">- OR -</p>

            <div id="AddVoucherOptions-Capture-Btn" onClick={handleCaptureClick} className="button-main noselect">
                <img src="images/camera-icon.png" alt="" />
                <span>CAPTURE</span>
            </div>
        </div>
    )
}
