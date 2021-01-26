const { get } = require('axios');
const PlayList = require('../entities/playlist');
const accessToken = 'BQDRl44kt2Oqximh9J-RPmMPUU01RdKd95RcbF6OUCnhyeJiv0lQndn9aOagg7Fr70wwDauippg7YhJ5a_VXkK6T1d8Q4mmJ8pHL81sitI3m7cRSp545CquLq4T04z8m3TY6QOeQVhC301B3FTaoVaK-1jxf4wc9LzQZEdQQBPKaS97X5YBS6_PCjoqYQrFGrEJFSkFHJYnRF2pmwQX_5Sc9iXGv3AtjAkPOSiXY0cprd4UMloKj5zFeCIiIJ_cBgymKbHCR_QuBSw--Slfk';
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