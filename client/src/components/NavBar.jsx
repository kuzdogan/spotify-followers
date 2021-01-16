import {
  Link
} from "react-router-dom";
export default function NavBar() {

  return (
    <div>
      <Link to='/Followers'>
        Followers
            </Link>
      <Link to='/Playlists'>
        Playlist
            </Link>
    </div>
  )
}