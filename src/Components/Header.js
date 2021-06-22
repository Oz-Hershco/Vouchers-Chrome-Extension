import React from 'react'
import { BiLogOut } from 'react-icons/bi';
import { firebase } from '../Firebase/firebase';
import '../Styles/Components/Header.scss';

export default function Header(props) {
    var logout = props.logout;
    var hasSearch = props.hasSearch;
    var onSearch = props.onSearch;
    var title = props.title;
    var subtitle = props.subtitle;
    var navigateScreen = props.navigateScreen;
    var navigateScreenName = props.navigateScreenName;

    const handleUserLogout = () => {
        firebase.auth().signOut().then(() => {
            // Sign-out successful.
        }).catch((error) => {
            // An error happened.
        });
    }
    return (
        <div className="Header">
            {
                hasSearch ?
                    (
                        <div id="Header-Search-Container">
                            <img src="images/search-icon.png" alt="" />
                            <input id="Header-Search" type="text" placeholder="Search your voucher can" onChange={(e) => { onSearch(e.currentTarget.value) }} />
                            {
                                logout ?
                                    (
                                        <BiLogOut onClick={handleUserLogout} className="App-Logout-Btn" />
                                    ) : null
                            }
                        </div>
                    ) :
                    (
                        <div className="Header-Container">
                            <div>
                                <img onClick={() => { navigateScreen(navigateScreenName) }} src="images/chev-left-icon.png" alt="" />
                                <p>{title ? title : "Uncategorized"}</p>
                            </div>
                            {subtitle ? <p>{subtitle}</p> : null}
                        </div>
                    )
            }
        </div>
    )
}
