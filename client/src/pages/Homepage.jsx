import React from 'react';
import Follower from '../components/Follower';

export default class Homepage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isNewUser: false,
      followers: [],
      newFollowers: [],
      unFollowers: [],
      userId: '',
      message: ''
    }
  }

  handleUserIdChange = (event) => {
    this.setState({ userId: event.target.value })
  }

  getFollowersDif = () => {
    this.setState({ isLoading: true });
    const userId = document.getElementById('spotify-user-id').value;
    if (!userId || userId === '') {
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
          this.setState({
            followers: [],
            isLoading: false,
            isNewUser: true,
            message: resData.message
          });
        }
        else if (statusCode === 200) {
          this.setState({
            newFollowers: resData.diff.newFollowers,
            unFollowers: resData.diff.unFollowers,
            isNewUser: false,
            isLoading: false,
            message: resData.message
          });
        }
      })
  }

  fetchFollowers = () => {
    this.setState({ isLoading: true })
    const userId = document.getElementById('spotify-user-id').value;
    if (!userId || userId === '') {
      throw new Error('Invalid user id.')
    }
    console.log('Fetching followers');
    fetch(`http://localhost:3000/user/${userId}/followers`)
      .then(res => {
        if (res.status !== 200) {
          this.setState({
            followers: [],
            isLoading: false
          });
          // throw new Error('Failed to fetch users.');
        }
        return res.json();
      })
      .then(resData => {
        this.setState({
          followers: resData.followers,
          isLoading: false
        });
      })
  }

  render() {
    if (this.state.isLoading) {
      return (
        <div>Loading</div>
      )
    }
    else {
      if (this.state.isNewUser) {
        return (
          <div>
            {this.state.message}
          </div>
        )
      }
      else {
        const newFollowers = [];
        const unFollowers = [];

        this.state.newFollowers.forEach((follower, index) => {
          newFollowers.push(
            <Follower user={follower} />
          )
        })
        const newFollowersInfo = newFollowers.length > 0 ? newFollowers :  'There is no new follower. Keep rolling!';

        this.state.unFollowers.forEach((unFollower, index) => {
          unFollowers.push(
            <Follower user={unFollower} />
          )
        })
        
        const unFollowersInfo = unFollowers.length > 0 ? unFollowers :  'There is no unfollower. You are so popular!';

        return (
          <div>
            <div>
              <input className="spotify-user-id" id="spotify-user-id" type="text" value={this.state.userId} onChange={(e) => { this.handleUserIdChange(e) }} />
              <button className="primary" onClick={this.getFollowersDif}> Follower Changes </button>
            </div>
            <div className="followers-container new-followers-container">
              {newFollowersInfo}
            </div>
            <div className="followers-container unfollowers-container">
              {unFollowersInfo}
            </div>
          </div>
        )
      }
    }
  }
}
