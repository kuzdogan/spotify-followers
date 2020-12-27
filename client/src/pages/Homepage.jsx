import React from 'react';
import Follower from '../components/Follower';
const TOKEN_URL = "https://open.spotify.com/get_access_token?reason=transport&productType=web_player";

export default class Homepage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      followers: [],
      userId: 11101586339, //TODO:
    }
    this.userId = 11101586339 // TODO: Dynamically handle userId inside state
  }

  handleIncrement = () => {
    this.setState(prevState => ({ count: prevState.count + 1 }))
  }

  handleUserIdChange = () => {

  }

  fetchFollowers = (userId) => {
    console.log('Fetching followers');
    fetch(`http://localhost:3000/user/${userId}/followers`)
      .then(res => {
        if (res.status !== 200) {
          throw new Error('Failed to fetch users.');
        }
        return res.json();
      })
      .then(resData => {
        this.setState({ followers: resData.followers });
        this.setState({ isLoading: false });
      })
  }

  componentDidMount() {
    // TODO: fetch all followers from the server endpoint. Then assign followers into the state.
    this.fetchFollowers(this.state.userId);

    // TODO: If input is dynamic fetch followers after clicking the button.
  }

  render() {
    if (this.state.isLoading) {
      return (
        <div>Loading</div>
      )
    }
    else {
      if (this.state.followers.length > 0) {
        const followers = [];
        this.state.followers.forEach((follower,index) => {
          followers.push(
            <li id={index}>
              <Follower user={follower} />
            </li>
          )
        })
        return (
            <ul> {followers} </ul>
        )
      }
      else {
        return (
          <h1> There is no user.</h1>
        )
      }
    }
  }
}