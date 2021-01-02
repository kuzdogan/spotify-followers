import React from 'react';
import "./Unfollower.css";

export default function Unfollower({ user }) {
    console.log(user)

    const userId = user.uri.split(':')[2];
    // Render
    return (
        <div className="unfollower" >
            <a href={`https://open.spotify.com/user/${userId}`} target="_blank" rel="noreferrer">
                <img src={user.imageURL} alt="Spotify user" />//todo:show dummy image for if empty url
            </a>
            <h1>{user.name}</h1>
            <div className="follower-field">
                <p> Followers Count: {user.followersCount} </p>
                <p> Following Count: {user.followingCount} </p>
            </div>
        </div>
    )
}