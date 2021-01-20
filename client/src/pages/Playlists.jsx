import React, {useState} from "react";
import Playlist from '../components/Playlist';

export default function Playlists() {

    const [playlists, setPlaylists] = useState(true);
    const [isLoaded, setIsLoaded] = useState(false);
    const [userId, setUserId] = useState('');

    function handleUserIdChange(event){
        setUserId(event.target.value);
    }

    function fetchPlaylists() {
        if (!userId) {
            throw new Error('Invalid user id.')
        }
        fetch(`http://localhost:3000/playlist/${userId}`)
            .then(res => {
                if (res.status !== 200) {
                    setIsLoaded(true);
                }
                return res.json();
            })
            .then(resData => {
                console.log(resData.playlists);
                setPlaylists(resData.playlists);
                setIsLoaded(true);
            })
    }

    if (!isLoaded) {
    return (
        <div>
          <div>
            <input className="spotify-user-id black" id="spotify-user-id" type="text" value={userId} onChange={(e) => { handleUserIdChange(e) }} />
            <button
                onClick={fetchPlaylists}
            >
              Get Playlists
            </button>
          </div>
          <div>
            Hey you ! Please, enter your spotify id above to get your playlists.
          </div>
        </div>
    )
  }
  else{

        const playlistComponents = playlists.map((playlist, i) => {
            return <Playlist key={i} playlistItem={playlist} />
        })

        const playlistsInfo = playlistComponents.length > 0 ? <div className="center display-container" style={{flexWrap: 'wrap'}}> {playlistComponents} </div> : 'You don\'t have any playlist. Volume up!';

        return (
            <div>
                <div>
                    <input className="spotify-user-id" id="spotify-user-id" type="text" value={userId} onChange={(e) => { handleUserIdChange(e) }} />
                    <button className="primary" onClick={fetchPlaylists}> Get Playlists </button>
                </div>
                <div className="center container-header">Playlists ({playlists.length}) </div>
                <div className="playlists-container playlists-container">
                    {playlistsInfo}
                </div>
            </div>
        )
    }
}