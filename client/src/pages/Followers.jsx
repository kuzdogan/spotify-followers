import React, {useState} from 'react';
import Follower from '../components/Follower';

export default function Followers(){

  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  // const [followers, setFollowers] = useState([]);
  const [newFollowers, setNewFollowers] = useState([]);
  const [unFollowers, setUnFollowers] = useState([]);
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState('');

 function handleUserIdChange(event){
    setUserId(event.target.value);
  }

  function getFollowersDif() {
    setIsLoading(true);
    if (!userId) {
      throw new Error('Invalid user id.')
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

  // function fetchFollowers(){
  //   setIsLoading(true);
  //   if (!userId || userId === '') {
  //     throw new Error('Invalid user id.')
  //   }
  //   console.log('Fetching followers');
  //   fetch(`http://localhost:3000/user/${userId}/followers`)
  //     .then(res => {
  //       if (res.status !== 200) {
  //         setIsLoading(false);
  //       }
  //       return res.json();
  //     })
  //     .then(resData => {
  //       setFollowers(resData.followers);
  //       setIsLoading(false);
  //     })
  // }

    if (isFirstLoad) {
      return (
        <div>
          <div>
            <input className="spotify-user-id black" id="spotify-user-id" type="text" value={userId} onChange={(e) => { handleUserIdChange(e) }} />
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
        <div>Loading</div>
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

        const newFollowersInfo = newFollowerComponents.length > 0 ? <div className="center display-container"> {newFollowerComponents} </div> : 'There is no new follower. Keep rolling!';

        unFollowers.forEach((unFollower, i) => {
          unFollowerComponents.push(
            <Follower key={i} user={unFollower} />
          )
        })

        const unFollowersInfo = unFollowerComponents.length > 0 ? <div className="center display-container"> {unFollowerComponents} </div> : 'There is no unfollower. You are so popular!';

        return (
          <div>
            <div>
              <input className="spotify-user-id" id="spotify-user-id" type="text" value={userId} onChange={(e) => { handleUserIdChange(e) }} />
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
