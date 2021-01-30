import NavBar from "../components/NavBar";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Followers from "./Followers";
import Playlists from "./Playlists";
import React from "react";


export default function Routes() {

    return (
        <div className="Routes">
            <Router>
                <NavBar/>
                <Switch>
                    <Route path="/Followers">
                        <Followers/>
                    </Route>
                    <Route path="/Playlists">
                        <Playlists/>
                    </Route>
                    <Route path="/YourFollowers">
                        <Playlists/>
                    </Route>
                </Switch>
            </Router>
        </div>
    );
}