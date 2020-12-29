import React from 'react';

export default class Follower extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: props.user.name,
            imageUrl: props.user.image_url,
            followingCount: props.user.following_count,
            followersCount: props.user.followers_count
        }
    }

    render() {
        return(
            <form>
                <h3>Name: {this.state.name}</h3>
                <h3>FollowingCount : {this.state.followingCount}</h3>
                <h3>FollowersCount : {this.state.followersCount}</h3>
            </form>


        )


    }
}