import React, {useState} from "react";
import Playlist from '../components/Playlist';
import PacmanLoader from "react-spinners/PacmanLoader";

export default function Playlists() {

    const [playlists, setPlaylists] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [userId, setUserId] = useState('');
    const [isLoading, setIsLoading] = useState(false);


    function fetchPlaylists() {
        if (!userId) {
            alert('Invalid user.');
        }
        setIsLoading(true);
        fetch(`http://localhost:3000/playlist/${userId}`)
            .then(res => {
                if (res.status === 200) {
                    setIsLoading(false);
                    setIsLoaded(true);
                    setHasError(false);
                }
                if (res.status === 401 || res.status === 500) {
                    setIsLoading(false);
                    setHasError(true);
                    setIsLoaded(true);
                }
                return res.json();
            })
            .then(resData => {
                console.log(resData.playlists);
                setPlaylists(resData.playlists);
                setIsLoaded(true);
                setIsLoading(false);
            })
    }


    if (!isLoaded) {
        return (
            <div>
                <div>
                    <input className="spotify-user-id black" id="spotify-user-id" type="text" value={userId}
                           onChange={(e) => {
                               setUserId(e.target.value);
                           }}/>
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
    }else if (isLoading) {
        return (
            <div>
                <PacmanLoader color="#1DB954" size={50} css={"top:250px;"} />
            </div>
        )
    }else if (hasError) {
        return <div>
            <div>
                <input className="spotify-user-id black" id="spotify-user-id" type="text" value={userId}
                       onChange={(e) => {
                           setUserId(e.target.value);
                       }}/>
                <button
                    onClick={fetchPlaylists}
                >
                    Get Playlists
                </button>
            </div>
            <div>
                There is an error to get playlists, please try again.
            </div>
        </div>
    } else {

        const playlistComponents = playlists.map((playlist, i) => {
            return <Playlist key={i} playlistItem={playlist}/>
        })

        const playlistsInfo = playlistComponents.length > 0 ? <div className="center display-container"
                                                                   style={{flexWrap: 'wrap'}}> {playlistComponents} </div> : 'You don\'t have any playlist. Volume up!';

        return (
            <div>
                <div>
                    <input className="spotify-user-id" id="spotify-user-id" type="text" value={userId}
                           onChange={(e) => {
                               setUserId(e.target.value);
                           }}/>
                    <button className="primary" onClick={fetchPlaylists}> Get Playlists</button>
                </div>
                <div className="center container-header">Playlists ({playlists.length})</div>
                <div className="playlists-container playlists-container">
                    {playlistsInfo}
                </div>
            </div>
        )
    }
}