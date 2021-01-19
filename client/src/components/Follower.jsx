import React from 'react';
import noImage from '../public/no_image.png';
import "./Follower.css";

export default function Follower({ user }) {
    console.log(user)

    const userId = user.uri.split(':')[2];
    if (!user.imageUrl) {
        user.imageUrl = noImage;
    }
    // Render
    return (
        <div className="follower" >
            <a href={`https://open.spotify.com/user/${userId}`} target="_blank" rel="noreferrer">
                <img src={user.imageUrl} alt="Spotify user" />
            </a>
            <h1>{user.name}</h1>
            <div className="follower-field">
                <p> Followers Count: {user.followersCount} </p>
                <p> Following Count: {user.followingCount} </p>
            </div>
        </div>
    )
}