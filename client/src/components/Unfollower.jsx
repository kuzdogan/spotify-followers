import React from 'react';
import "./Unfollower.css";

export default function Unfollower({ user }) {
    console.log(user)

    const userId = user.uri.split(':')[2];
    // Render
    if(!user.imageURL){
        return (
            <div className="unfollower" >
                <a href={`https://open.spotify.com/user/${userId}`} target="_blank" rel="noreferrer">
                    <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" alt="Spotify user" />
                </a>
                <h1>{user.name}</h1>
                <div className="unfollower-field">
                    <p> Followers Count: {user.followersCount} </p>
                    <p> Following Count: {user.followingCount} </p>
                </div>
            </div>
        )
    }
    return (
        <div className="unfollower" >
            <a href={`https://open.spotify.com/user/${userId}`} target="_blank" rel="noreferrer">
                <img src={user.imageURL} alt="Spotify user" />
            </a>
            <h1>{user.name}</h1>
            <div className="unfollower-field">
                <p> Followers Count: {user.followersCount} </p>
                <p> Following Count: {user.followingCount} </p>
            </div>
        </div>
    )
}