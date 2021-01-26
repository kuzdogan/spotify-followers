class PlayList{
    constructor(playlistItem){
        this.id = playlistItem.id;
        this.name = playlistItem.name;
        this.ownerId = playlistItem.owner.id;
        this.isPublic = playlistItem.public;
        this.trackCount = playlistItem.tracks.total;
    }
}
module.exports = PlayList;