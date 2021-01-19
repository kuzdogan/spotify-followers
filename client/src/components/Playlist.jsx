import React from 'react';
import "./Playlist.css";

export default function Playlist({ user: playlistItem }) {
    console.log(playlistItem)
    // Render
    return (
        <div className="playlist" >
            <h1>{playlistItem.name}</h1>
            <div className="playlist-field">
                <p> Track Count: {playlistItem.trackCount} </p>
            </div>
        </div>
    )
}