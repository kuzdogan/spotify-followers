import React from 'react';
import "./Follower.css";

export default function Follower({ user }) {
    console.log(user)

    const userId = user.uri.split(':')[2];
    // Render
    return (
        <div className="follower" >
            <a href={`https://open.spotify.com/user/${userId}`} target="_blank" rel="noreferrer">
                <img src={user.image_url} alt="Spotify user" />
            </a>
            <h1>{user.name}</h1>
            <div className="follower-field">
                <p> Followers Count: {user.followers_count} </p>
                <p> Following Count: {user.following_count} </p>
            </div>
        </div>
    )
}