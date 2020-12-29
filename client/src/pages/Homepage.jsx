import React from 'react';
import Follower from "../components/Follower";

export default class Homepage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            followers: [],
            userId: ''
        }
    }

    handleFollowers = () => {
        fetch(`http://localhost:3000/user/${this.state.userId}/followers`)
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
    }

    handleUserIdChange = (e) => {
        this.setState({
            userId: e.target.value
        })
    }

    render() {
        if (this.state.isLoaded) {
            if(this.state.followers.length >0){
                return (
                    <ul>
                        {this.state.followers.map(follower => (
                            <li key={follower.id}>
                                <Follower user={follower}/>
                            </li>
                        ))}
                    </ul>
                );
            }else{
                return (
                    <div>
                        <h2>
                            No follower has been found :(
                        </h2>
                    </div>
                )
            }
        }
        return (
            <div>
                <div>
                    Followers
                </div>
                <div>
                    <label>UserId </label>
                    <input type='text' onChange={(e) => {
                        this.handleUserIdChange(e)
                    }}/>
                    <button type='submit' onClick={this.handleFollowers}>Get Followers</button>
                </div>
            </div>
        )
    }
}