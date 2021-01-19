const { get } = require('axios');
const PlayList = require('../entities/playlist');
//add your token to get playlists
const accessToken = 'BQAOGaZP9ge4VcFIS9CEdqa6BC7KtpqIxsYYFeAxxO1pWDgG_5ynbb52u_lsYzzRtRV_LcvFubODbRkPQELkzyH9jZeckMIo84XLK5epi4f5v1ssT_MkCPWA0Ujdk8I9LcWJtjk9IYN7WM0-dkRFcle-IgruT1-0o36fUfyOgcBUtVoh3UDhAIOEyr_uCwuaLEqkc-kjjh17th51EXYq4eeyVAy0bYFjrmHEX5BiEPq-_QUFwte4gd8wYBrGE77rdiNxhPYueaAGjfZ_6A3qSTLasKxLIIPUMtF0';
const maximumLimit = 50;

exports.getPlaylists = async function (req, res) {
    const userId = req.params.userId;
    return getPlaylistsOfUser(userId)
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => console.log(err));
}

/**
 * @param {String} userId 
 */
async function getPlaylistsOfUser(userId) {
    let playlistsURL = `https://api.spotify.com/v1/users/${userId}/playlists?limit=${maximumLimit}`;
    let array = [];
    
    while(playlistsURL){
        let playlistResult = await getPlaylistOfUserResult(playlistsURL);
        array.push(playlistResult.items.filter(item =>{
            return item.owner.id && item.owner.id === userId
        }));
        playlistsURL = playlistResult.next;
    }
    //Converts spotify playlist to our playlist entity
    const playlists = array[0].map(item => {
        return new PlayList(item);
    });

    return {playlistCount: playlists.length, playlists};
}

/**
 * fetch playlists by request url
 * @param {String} requestUrl 
 */
async function getPlaylistOfUserResult(requestUrl) {
    console.log(requestUrl);
    const playlistResult = await get(requestUrl, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });
    return playlistResult.data;
}