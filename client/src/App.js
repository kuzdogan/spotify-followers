import {
  BrowserRouter as Router,

  Route, Switch
} from "react-router-dom";
import './App.css';
import React, { useState } from 'react';
import NavBar from './components/NavBar';
import Callback from './pages/Callback';
import Followers from './pages/Followers';
import Playlists from './pages/Playlists';

function App() {

  const [loggedIn, setLoggedIn] = useState(false);

  function changeLoggedIn() {
    setLoggedIn(prevState => !prevState);
  }

  function handleSpotifyLogin() {
    let clientId = process.env.REACT_APP_CLIENT_ID;
    let url = 'https://accounts.spotify.com/authorize';
    // TODO: Add state query param
    let requestUrl = `${url}?client_id=${clientId}&response_type=code&redirect_uri=http://localhost:3001/callback`;
    window.open(requestUrl, 'popup', 'width=600,height=600')
}

  return (
    <div className="App">
      <Router>
        <NavBar />
        <Switch>
          <Route path="/Followers">
            <Followers />
          </Route>
          <Route path="/Playlists">
            <Playlists />
          </Route>
          <Route path="/callback">
            <Callback />
          </Route>
        </Switch>
      </Router>
      <div>
        <p>
          {loggedIn ? "Do you wanna come inside ?" : "You are in !"}
        </p>
        <button onClick={handleSpotifyLogin} >
          Login
      </button>
      </div>
    </div>
  );
}

export default App;
