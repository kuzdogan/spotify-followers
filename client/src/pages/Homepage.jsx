import React from 'react';
import Follower from '../components/Follower';
const TOKEN_URL = "https://open.spotify.com/get_access_token?reason=transport&productType=web_player";

export default class Homepage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      followers: [],
      userId: ''
    }
  }

  handleUserIdChange = (event) => {
    this.setState({ userId: event.target.value })
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
      const followers = [];
      this.state.followers.forEach((follower, index) => {
        followers.push(
          <li id={index}>
            <Follower user={follower} />
          </li>
        )
      })
      const output = followers.length > 0 ? <ul className="followers"> {followers} </ul> : <h1> There is no follower.</h1>

      return (
        <div>
          <div>
            <input className="spotify-user-id" id="spotify-user-id" type="text" value={this.state.userId} onChange={(e) => { this.handleUserIdChange(e) }} />
            <button className="btn btn-get-followers" onClick={this.fetchFollowers}> Get Followers</button>
          </div>
          {output}
        </div>
      )
    }
  }
}
