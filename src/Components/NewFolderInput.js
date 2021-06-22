import React from 'react'

import '../Styles/Components/NewFolderInput.scss';

export default function NewFolderInput(props) {

    var value = props.value;
    var onChange = props.onChange;

    const handleInputOnChange = (e) => {
        var enteredValue = e.currentTarget.value;
        onChange(enteredValue);
    }
    return (
        <div className="NewFolderInput noselect">
            <div className="NewFolderInput-Left">
                <img src="images/folder-outline-icon.png" alt="" />
                <input value={value} onChange={handleInputOnChange} type="text" placeholder="Enter folder name" />
            </div>
            <div className="NewFolderInput-Right">

            </div>
        </div>
    )
}
