import React from 'react';
import "./Homepage.css";
import entranceImage from '../public/entrance-image.png';
import entranceImage2 from '../public/entrance-image-2.png';

export default function Homepage({isLoggedIn}) {

    function handleSpotifyLogin() {
        let clientId = process.env.REACT_APP_CLIENT_ID;
        let state = process.env.REACT_APP_STATE;
        let url = 'https://accounts.spotify.com/authorize';
        let requestUrl = `${url}?client_id=${clientId}&response_type=code&redirect_uri=http://localhost:3001/callback&state=${state}`;
        window.open(requestUrl, 'popup', 'width=600,height=600');
    }

    console.log(isLoggedIn);
    if(isLoggedIn){
        return window.location.replace('/Followers');
    }

    return (
        <div>
            <h2 className={"header-Spotify"}> Enter your Spotify Id!</h2>
            <button className={"primary-button"} onClick={handleSpotifyLogin} >
                Log In
            </button>
            <div id="entrance-images">
                <img className={"bottom"} src={entranceImage} alt="Entrance Image"/>
                <img className={"top"} src={entranceImage2} alt="Entrance Image"/>
            </div>
            <h5 className={"footer-primary"}>Keep track of your followers/unfollowers </h5>
            <h5 className={"footer-secondary"}>See who’s following your playlists </h5>
        </div>

    );

}