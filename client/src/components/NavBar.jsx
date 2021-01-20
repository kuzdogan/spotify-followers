import {
    Link, useLocation
} from "react-router-dom";
import React from "react";
import "./NavBar.css"

export default function NavBar() {

    const location = useLocation();
    return (
        <div className='MainBar'>
            <Link className={location.pathname === '/Followers' ? 'NavBarItem theCurrent' : 'NavBarItem'}
                  to='/Followers'>
                Followers
            </Link>
            <Link className={location.pathname === '/Playlists' ? 'NavBarItem theCurrent' : 'NavBarItem'}
                  to='/Playlists'>
                Playlist
            </Link>
        </div>
    )
}