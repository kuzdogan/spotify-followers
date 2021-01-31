const { get } = require('axios');
const PlayList = require('../entities/playlist');
const accessToken = 'BQBuHppBYUv6_y6ZvVSLgbF4SKqUl6Vwhs655dxVnwOfVQe52wDhy7TEY7wiZPuL-L6iOJMwuFg1REP85bgnpeFSZ_3Z5FOoJ4E3ZVri6QrgRKPbCgmz50CGaOnNwczKWIyo6I4YqnD6Z3U8';
const maximumLimit = 50;

exports.getPlaylists = async function (req, res) {
    const userId = req.params.userId;
    try {
        const playlistResult = await getPlaylistsOfUser(userId);
        return res.status(200).json(playlistResult);
    }
    catch (err) {
        return err.response && err.response.status === 401
            ? res.status(401).json({ message: "Unauthorized access" })
            : res.status(500).json({ message: "Unexpected error!", error: err });
    }
}

/**
 * @param {String} userId 
 */
async function getPlaylistsOfUser(userId) {
    let playlistsURL = `https://api.spotify.com/v1/users/${userId}/playlists?limit=${maximumLimit}`;
    let array = [];

    while (playlistsURL) {
        let playlistResult = await getPlaylistOfUserResult(playlistsURL);
        array.push(...playlistResult.items.filter(item => {
            return item.owner.id && item.owner.id === userId
        }));
        playlistsURL = playlistResult.next;
    }
    //Converts spotify playlist to our playlist entity
    const playlists = array.map(item => {
        return new PlayList(item);
    });

    return { playlistCount: playlists.length, playlists };
}

/**
 * fetch playlists by request url
 * @param {String} requestUrl 
 */
async function getPlaylistOfUserResult(requestUrl) {
    const playlistResult = await get(requestUrl, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });
    return playlistResult.data;
}