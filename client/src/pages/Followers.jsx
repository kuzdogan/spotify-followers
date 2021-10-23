import React, {useState} from 'react';
import Follower from '../components/Follower';
import PacmanLoader from 'react-spinners/PacmanLoader';

export default function Followers(){

  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [newFollowers, setNewFollowers] = useState([]);
  const [unFollowers, setUnFollowers] = useState([]);
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState('');

  function getFollowersDif() {
    setIsLoading(true);
    if (!userId) {
      alert('Invalid user.');
    }
    let statusCode;
    fetch(`http://localhost:3000/user/${userId}/follower-unfollower-diff`)
      .then(res => {
        statusCode = res.status;
        return res.json();
      })
      .then(resData => {
        if (statusCode === 201) {
          setIsLoading(false);
          setIsNewUser(true);
          setMessage(resData.message);
          setIsFirstLoad(false);
          alert("Please come back later to see your follower changes!");
        }
        else if (statusCode === 200) {
          setNewFollowers(resData.diff.newFollowers);
          setUnFollowers(resData.diff.unFollowers);
          setIsNewUser(false);
          setIsLoading(false);
          setMessage(resData.message);
          setIsFirstLoad(false);
        }
      })
  }


    if (isFirstLoad) {
      return (
        <div>
          <div>
            <input className="spotify-user-id black" id="spotify-user-id" type="text" value={userId} onChange={(e) => { setUserId(e.target.value); }} />
            <button
              onClick={getFollowersDif}
            >
              Follower Changes
            </button>
          </div>
          <div>
            Hey you ! Please, enter your spotify id above.
          </div>
        </div>
      )
    }
    else if (isLoading) {
      return (
        <div>
          <PacmanLoader color="#1DB954" size={50} css={"top:250px;"} />
        </div>
      )
    }
    else {
      if (isNewUser) {
        return (
          <div>
            {message}
          </div>
        )
      }
      else {
        const unFollowerComponents = [];

        const newFollowerComponents = newFollowers.map((follower, i) => {
          return <Follower key={i} user={follower} />
        })

        const newFollowersInfo = newFollowerComponents.length > 0 ? <div className="center display-container" style={{flexWrap: 'wrap'}}> {newFollowerComponents} </div> : 'There is no new follower. Keep rolling!';

        unFollowers.forEach((unFollower, i) => {
          unFollowerComponents.push(
            <Follower key={i} user={unFollower} />
          )
        })

        const unFollowersInfo = unFollowerComponents.length > 0 ? <div className="center display-container" style={{flexWrap: 'wrap'}}> {unFollowerComponents} </div> : 'There is no unfollower. You are so popular!';

        return (
          <div>
            <div>
              <input className="spotify-user-id" id="spotify-user-id" type="text" value={userId} onChange={(e) => { setUserId(e.target.value); }} />
              <button className="primary" onClick={getFollowersDif}> Follower Changes </button>
            </div>
            <div className="center container-header">Followers ({newFollowers.length}) </div>
            <div className="followers-container new-followers-container">
              {newFollowersInfo}
            </div>
            <div className="center container-header">Unfollowers ({unFollowers.length}) </div>
            <div className="followers-container unfollowers-container">
              {unFollowersInfo}
            </div>
          </div>
        )
      }
    }
}
