import React from 'react';

export default class Homepage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            uri: props.user.uri,
            name: props.user.name,
            imageUrl: props.user.image_url,
            followersCount: props.user.followers_count,
            followingCount: props.user.following_count,
        }
    }
    
    render(){
        return(
            <div className="follower" >
                <h1>{this.state.name}</h1>
                <h2>{this.state.uri}</h2>
                <ul className="follower-following-count">
                    <li className="follower-count"> Followers Count: {this.state.followersCount} </li>
                    <li className="following-count"> Following Count: {this.state.followingCount} </li>
                </ul>
            </div>
        )
    }
}