const { get } = require("axios");

const EPHEMERAL_TOKEN_URL =
  "https://open.spotify.com/get_access_token?reason=transport&productType=web_player";

exports.getOneTimeAccessToken = async () => {
  const { data } = await get(EPHEMERAL_TOKEN_URL);
  console.log(`Got one time access token ${data.accessToken}`);
  return data.accessToken;
};
