import {
  BrowserRouter as Router,

  Route, Switch
} from "react-router-dom";
import './App.css';
import NavBar from './components/NavBar';
import Followers from './pages/Followers';
import Playlists from './pages/Playlists';

function App() {
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
        </Switch>
      </Router>
    </div>
  );
}

export default App;
