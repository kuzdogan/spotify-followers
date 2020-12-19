# Who Followed/Unfollowed me

## Profile
https://open.spotify.com/user/11101586339

## Access token
https://open.spotify.com/get_access_token?reason=transport&productType=web_player

```js
{"clientId":"0971d","accessToken":"BQC3f8HWS5q4tusnqBkRVxDPIjPc1LTtLI5zLTeWwEWOZTqAbaOEVxlSYYf61xUwh-Dgp_c6MG71gcsC5b8","accessTokenExpirationTimestampMs":1608215600832,"isAnonymous":true}
```

## Followers request
https://spclient.wg.spotify.com/user-profile-view/v3/profile/11101586339/followers?market=TR

Token format: 
```
Bearer BQC3f8HWS5q4tusnqBkRVxDPIjPc1LTtLI5zLTeWwEWOZTqAbaOEVxlSYYf61xUwh-Dgp_c6MG71gcsC5b8
```

# My playlist followers among my friends

endpoint 1
- Bir takipçin senin hangi playlistlerini takip ediyor
- Bir takip ettiğin senin hangi playlistlerini takip ediyor

endpoint 2
- Bir playlistini hangi takipçilerin takip ediyor
- Bir playlistini hangi takpi ettiklerin takip ediyor

Rate limit?
- Bütün playlistlerini kimler takip ediyor?
  - Tüm takipçilerin takip ettiği playlistleri toplayıp karşılaştır.

## endpoint 1 - Get playlists followed by the user
https://developer.spotify.com/console/get-current-user-playlists/?limit=50&offset=1

## endpoint 2 - Check if users follow a playlist 
https://developer.spotify.com/console/get-playlist-followers-contains/