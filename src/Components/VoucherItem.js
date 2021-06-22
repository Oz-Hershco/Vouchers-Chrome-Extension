import React from 'react'
import Moment from 'react-moment';

import '../Styles/Components/VoucherItem.scss';

export default function VoucherItem(props) {

    var voucher = props.voucher;
    var updateVoucherItemField = props.updateVoucherItemField;

    const handleMarkAsUsed = () => {
        updateVoucherItemField(voucher.id, "used");
    }

    const handleVoucherSelect = (e) => {
        if(e.target.className !== "VoucherItem-Check-Btn"){
            props.setSelectedVoucher(voucher)
            props.navigateScreen("voucher")
        }
    }

    return (
        <div onClick={handleVoucherSelect} className="VoucherItem noselect">
            <div className="VoucherItem-Left">
                <img onClick={handleMarkAsUsed} className="VoucherItem-Check-Btn" src={voucher.used ? "images/checked-icon.png" : "images/unchecked-icon.png"} alt="" />
                <div className="VoucherItem-Left-Bottom">
                    <span className="VoucherItem-Title">{voucher.title}</span>
                    <Moment className="VoucherItem-Timestamp" format="ddd, MMMM Do YYYY">{voucher.created.seconds ? voucher.created.toDate() : voucher.created}</Moment>
                </div>
            </div>
            <div className="VoucherItem-Right">
                <span className="VoucherItem-Amount">{voucher.amount}</span>
                <span className="VoucherItem-Currency">{voucher.currency}</span>
                <img className="VoucherItem-Chev" src="images/chev-right-gray-icon.png" alt="" />
            </div>
        </div>
    )
}
