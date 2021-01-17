const { get } = require('axios');
const PlayList = require('../entities/playlist');
const accessToken = 'BQAGld0sMCykxS_1Vx2Tywz_UD_BD140YB5SPoiKmdSRsI7bIrrX4wbY02aHMapYyfZG1yQ8xrug24I1_QV6pPyOLxuuIsa37T2JM9puYoDV2y8r3u8Gov5CUsSMKaqcznslrGDuX0cdPZObgs1WGs7sOT3phx9c';
const maximumLimit = 50;

exports.getPlaylists = async function (req, res) {
    const userId = req.params.userId;
    return getPlaylistsOfUser(userId)
        .then(result => {
            const playlistCount = result.playlistCount;
            const playlists = result.playlists;
            res.status(200).json({ playlistCount, playlists });
        })
        .catch(err => console.log(err));
}

/**
 * Example: Playlist count of a user is 123. Both contains the owned and followed ones.
 * "https://api.spotify.com/v1/users/11173711023/playlists?limit=50&offset=0"
 * "https://api.spotify.com/v1/users/11173711023/playlists?limit=50&offset=50"
 * "https://api.spotify.com/v1/users/11173711023/playlists?limit=23&offset=100"
 * 
 * @param {String} userId 
 */
async function getPlaylistsOfUser(userId) {
    //To get playlist count
    let playlistResult = await getPlaylistOfUserResult(userId);
    let playlistCount = playlistResult.total;

    let array = [];
    const divisor = Math.floor(playlistCount / maximumLimit);

    let i;
    for(i=0; i< divisor; i++){
        await collectPlaylists(array,userId,maximumLimit,maximumLimit*i );
    }

    await collectPlaylists(array,userId,playlistCount % maximumLimit,maximumLimit *i );

    const playlistOfUser = array[0].filter(item => {
        return item.owner.id && item.owner.id === userId;
    });

    const playlists = playlistOfUser.map(item => {
        return new PlayList(item);
    });

    playlistCount = playlists.length;

    return {playlistCount, playlists};
}

/**
 * Given an array contains playlists of a user, adding remaining playlists to the given array.
 * @param {String} array 
 * @param {String} userId 
 * @param {String} limit 
 * @param {String} offset 
 */
async function collectPlaylists(array, userId,limit,offset){
    const list = await getPlaylistOfUserResult(userId, limit, offset);
    array.push(list.items);
    return array;
}

/**
 * Returns the playlists of a user with filters.
 * @param {String} userId 
 * @param {String} limit 
 * @param {String} offset 
 */
async function getPlaylistOfUserResult(userId,limit,offset) {
    const playlistsURL = `http://api.spotify.com/v1/users/${userId}/playlists${!limit ? '' : `?limit=${limit}`}${!offset ? '' : `&offset=${offset}`}`;
    console.log(playlistsURL);
    const playlistResult = await get(playlistsURL, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });
    return playlistResult.data;
}