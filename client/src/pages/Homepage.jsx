import React from 'react';
import Follower from '../components/Follower';
import Unfollower from "../components/Unfollower";

export default class Homepage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      followers: [],
      newFollowers: [],
      unfollowers: [],
      userId: '',
      isUserAlreadyCreated: false,
      isErrorHappened: false
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

  fetchFollowerAndUnfollowers = () => {
    const userId = document.getElementById('spotify-user-id').value;
    if (!userId || userId === '') {
      throw new Error('Invalid user id.')
    }
    console.log('Fetching followers');
    fetch(`http://localhost:3000/user/${userId}/follower-unfollower-diff`)
        .then(res => {
          if (res.status === 201) {
            this.setState({
              newFollowers: [],
              unfollowers: [],
              isUserAlreadyCreated: false,
            });
          }else if (res.status === 200){
            this.setState({
                newFollowers: [],
                unfollowers: [],
              isUserAlreadyCreated: true,
            });
          }else {
            this.setState({
              newFollowers: [],
              unfollowers: [],
              isErrorHappened: true
            });
          }
          return res.json();
        })
        .then(resData => {
            console.log("test");
          this.setState({
            newFollowers: resData.newFollowers,
            unfollowers: resData.unfollowers,
            isLoaded: true
          });
        })
  }

  render() {
    if (!this.state.isLoaded) {
      return this.getFollowerButton()
    }else if (this.state.isErrorHappened){
      return (
          <div>
            {this.getFollowerButton()}
            <h1> Followers couldn't be fetched right now. Please try again.</h1>
          </div>
      );
    }else if (!this.state.isUserAlreadyCreated){
      return (
          <div>
            {this.getFollowerButton()}
            <h1> User created for first time. Please check later for difference.</h1>
          </div>
      );
    }
    else{
      const newFollowers = [];
      this.state.newFollowers.forEach((follower) => {
        newFollowers.push(
          <Follower user={follower} />
        )
      })
      const newFollowerOutput = newFollowers.length > 0 ? <div className="followers-container"> {newFollowers} </div> :
          <h1> There is no new follower.</h1>

      const newUnfollowers = [];
      this.state.unfollowers.forEach((unfollower) => {
        newUnfollowers.push(
            <Unfollower user={unfollower} />
        )
      })
      const newUnfollowerOutput = newUnfollowers.length > 0 ? <div className="followers-container"> {newUnfollowers} </div> :
          <h1> There is no unfollower.</h1>

      return (
          //todo:css for infos
        <div>
          {this.getFollowerButton()}
          <h2> New Followers </h2>
          { newFollowerOutput}
          <h2> Unfollowers </h2>
          { newUnfollowerOutput}
          <div>
          </div>
        </div >
      )
    }
  }

  getFollowerButton() {
    return (
          <div>
            <input className="spotify-user-id" id="spotify-user-id" type="text" value={this.state.userId}
                   onChange={(e) => {
                     this.handleUserIdChange(e)
                   }}/>
            <button className="primary" onClick={this.fetchFollowerAndUnfollowers}> Get New Followers</button>
          </div>
    );
  }
}
