import React from 'react';

const TOKEN_URL = "https://open.spotify.com/get_access_token?reason=transport&productType=web_player";

export default class Homepage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            followers: [],
        }
        this.userId = 11101586339 // TODO: Dynamically handle userId inside state
    }

    handleIncrement = () => {
        this.setState(prevState => ({count: prevState.count + 1}))
    }


    componentDidMount() {
        fetch(`http://localhost:3000/user/${this.userId}/followers`)
            .then(response => response.json())
            .then(data => {
                    this.setState({
                        isLoaded: true,
                        followers: data
                    });
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                })
        // TODO: If input is dynamic fetch followers after clicking the button.
    }

    render() {
        if (!this.state.isLoaded) {
            return (
                <div> Please wait.. Loading </div>
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
                    Followers: {this.state.followers.map(follower => <div>{follower.name}</div>)}
                    Count: {this.state.count}
                    <button type='button' onClick={this.handleIncrement}>Increment</button>
                    {/*<input onChange={this.handleUserIdChange}> </input>*/}
                </div>
            </div>
        )
    }
}