import React from 'react';
import Follower from '../components/Follower';

export default class Homepage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      followers: [],
      userId: ''
    }
  }

  handleUserIdChange = (event) => {
    this.setState({ userId: event.target.value })
  }

  fetchFollowers = () => {
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
            isLoaded: true
          });
        }
        return res.json();
      })
      .then(resData => {
        this.setState({
          followers: resData.followers,
          isLoaded: true
        });
      })
  }

  render() {
    if (!this.state.isLoaded) {
      return (
          <div>
            <div>
              <input className="spotify-user-id" id="spotify-user-id" type="text" value={this.state.userId} onChange={(e) => { this.handleUserIdChange(e) }} />
              <button className="primary" onClick={this.fetchFollowers}> Get Followers</button>
            </div>
            <div>
            </div>
          </div >      )
    }
    else {
      const followers = [];
      this.state.followers.forEach((follower) => {
        followers.push(
          <Follower user={follower} />
        )
      })
      const output = followers.length > 0 ? <div className="followers-container"> {followers} </div> : <h1> There is no follower.</h1>

      return (
        <div>
          <div>
            <input className="spotify-user-id" id="spotify-user-id" type="text" value={this.state.userId} onChange={(e) => { this.handleUserIdChange(e) }} />
            <button className="primary" onClick={this.fetchFollowers}> Get Followers</button>
          </div>
          { output}
          <div>
          </div>
        </div >
      )
    }
  }
}
