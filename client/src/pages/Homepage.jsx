import React from 'react';

const TOKEN_URL = "https://open.spotify.com/get_access_token?reason=transport&productType=web_player";

export default class Homepage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      followers: [],
      userId: null
    }
    this.userId = 11101586339 // TODO: Dynamically handle userId inside state
  }

  handleIncrement = () => {
    this.setState(prevState => ({ count: prevState.count + 1 }))
  }


  componentDidMount() {
    // TODO: fetch all followers from the server endpoint. Then assign followers into the state.
    // TODO: If input is dynamic fetch followers after clicking the button.
  }

  render() {
    if (this.state.isLoading) {
      return (
        <div> Loading </div>
      )
    }
    return (
      // TODO: if isloading == false render each follower in Follower component.
      // {
      //   this.followers.forEach(follower => {
      //     <Follower user={follwer} />
      //   })
      // }
      <div>
        <div>
          HELLO
        </div>
        <div>
          {/* Followers: <br /> */}
          {/* {this.state.followers} */}
          Count: {this.state.count}
          <button type='button' onClick={this.handleIncrement}>Increment</button>
          <input onChange={this.handleUserIdChange}> </input>
        </div>
      </div>
    )
  }
}