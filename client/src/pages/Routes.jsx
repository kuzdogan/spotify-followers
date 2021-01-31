import NavBar from "../components/NavBar";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Followers from "./Followers";
import Playlists from "./Playlists";
import React, {useState} from "react";
import Callback from "./Callback";
import Homepage from "./Homepage";


export default function Routes() {

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleIsLoggedIn = (value) =>{
        setIsLoggedIn(value);
    }

    return (
        <div className="Routes">
            <Router>
                <Switch>
                    <Route path="/Followers">
                        <NavBar/>
                        <Followers/>
                    </Route>
                    <Route path="/Playlists">
                        <NavBar/>
                        <Playlists/>
                    </Route>
                    <Route path="/callback">
                        <Callback handleLogin={handleIsLoggedIn}/>
                    </Route>
                    <Route path="/">
                        <Homepage isLoggedIn={isLoggedIn}/>
                    </Route>
                </Switch>
            </Router>
        </div>
    );
}