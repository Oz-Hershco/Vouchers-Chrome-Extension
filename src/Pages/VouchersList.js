import React from 'react'
import Header from '../Components/Header';
import VoucherItem from '../Components/VoucherItem';
import { sumByObjectField } from '../Constants/Functions';

import '../Styles/Pages/VouchersList.scss';

export default function VouchersList(props) {

    var vouchers = props.vouchers;
    var voucherFolderName = props.vouchers[0].folder.name;
    var navigateScreen = props.navigateScreen;
    var setSelectedVoucher = props.setSelectedVoucher;
    var updateVoucherItemField = props.updateVoucherItemField;
    // var availableVouchers = vouchers.filter(voucher => !voucher.used);
    // var availableVouchersBalance = sumByObjectField("amount", vouchers);
    return (
        <div className="VouchersList">
            <Header title={voucherFolderName} navigateScreen={navigateScreen} navigateScreenName="home" />
            <div className="VouchersList-Body">
                {
                    vouchers.map((voucher, i) => {
                        return <VoucherItem key={i} voucher={voucher} updateVoucherItemField={updateVoucherItemField} navigateScreen={navigateScreen} setSelectedVoucher={setSelectedVoucher}/>
                    })
                }
            </div>
            <div className="VouchersList-Footer">
                <div className="VouchersList-Footer-Left">
                    {/* {
                        availableVouchers.length ?
                            (
                                <span className="VouchersList-Footer-Labels">Unused Vouchers:<span>{availableVouchers.length}</span></span>
                            ) : null
                    } */}
                    <span className="VouchersList-Footer-Labels">Total:<span>{vouchers.length}</span></span>
                </div>
                <div className="VouchersList-Footer-Right">
                    {/* <span className="VouchersList-Footer-Labels">Balance:<span>{availableVouchersBalance} {vouchers[0].currency}</span></span> */}
                </div>
            </div>
        </div>
    )
}
