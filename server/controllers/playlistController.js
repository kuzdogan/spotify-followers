const { get } = require('axios');
const PlayList = require('../entities/playlist');
const accessToken = 'BQA0XgfWiwT9zRRVhL1PpMDPUwSbwh6klq83dCD__arUuOFgrJ6tcrq7GVwNuzu9-kbZIfVnbFCYdFGbsWWeS6hOT806rFHsuyjKhv4YLqS0rfGwoMbD8fI4t-Vuk-VKBvEM3wvsP_91t3yJGhKt1vWCO5TMDz0t';
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