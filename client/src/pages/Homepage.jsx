import React from 'react';
import "./Homepage.css";
import entranceImage from '../public/entrance-image.png';
import entranceImage2 from '../public/entrance-image-2.png';

export default function Homepage() {

    return (
        <div>
            <h2 className={"header-Spotify"}>Enter your Spotify Id</h2>
            <button className={"primary-button"}>
                Log In
            </button>
            <div id="entrance-images">
                <img className={"bottom"} src={entranceImage}/>
                <img className={"top"} src={entranceImage2}/>
            </div>
            <h5 className={"footer-primary"}>Keep track of your followers/unfollowers </h5>
            <h5 className={"footer-secondary"}>See who’s following your playlists </h5>
        </div>

    );

}