require('dotenv').config()
const { get, post } = require('axios');
const SPOTIFY_ACCESS_TOKEN_URL = 'https://accounts.spotify.com/api/token';
const SPOTIFY_CURRENT_USER_URL = 'https://api.spotify.com/v1/me';
const queryString = require('querystring');
const UserToken = require('../models/UserToken');

exports.getAccessToken = async (req, res) => {
    const authCode = req.body.auth_code;
    try {
        const accessTokenData = await retrieveAccessToken(authCode);
        console.log(`AccessTokenData: ${accessTokenData}`);
        if (!accessTokenData) {
            return res.status(500).json({ message:'Access token could not be retrieved.'});
        }

        const user_id = await getCurrentUserId(accessTokenData.access_token);
        if (!user_id) {
            return res.status(500).json({ message:'User could not be found.'});
        }

        await UpsertUserToken(user_id, accessTokenData);

        return res.status(200).json({ userId: user_id });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ err });
    }
}

/**
 * Before acting user request, if we notice the accessToken is expired, refreshed accessToken will be fetched. Db record updated.
 */
exports.getRefreshedToken = async (req,res) => {
    try {
        const userId = req.params.userId;
        const userToken = await UserToken.findOne({ userId: userId });
        const newToken = await retrieveAccessToken(userToken.refreshToken);
        const refreshedToken = await UpsertUserToken(userId, newToken);
        return res.status(200).json({token: refreshedToken.accessToken});
    }
    catch(err){
        return res.status(500).json({ err });
    }
}

/**
 * Exchange authorization code with an access token.
 * When refresh token is available, it can be used for retrieving access token
 * @param {String} authCode 
 */
async function retrieveAccessToken(authCode) {
    try {
        var requestBody = {
            grant_type: 'authorization_code',
            code: authCode,
            redirect_uri: "http://localhost:3001/callback",
            client_id: process.env.SPOTIFY_CLIENT_ID,
            client_secret: process.env.SPOTIFY_CLIENT_SECRET
        };

        //Request body is needed to be stringified according to Axios documents for x-www-form-urlencoded content
        const response = await post(SPOTIFY_ACCESS_TOKEN_URL,
            queryString.stringify(requestBody), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        return response.data;
    }
    catch (err) {
        return null;
    }
}

/**
 * To retrieve current user from accessToken by sending get request to
 * "https://api.spotify.com/v1/me" endpoint.
 * @param {String} accessToken 
 */
async function getCurrentUserId(accessToken) {
    try {
        const userResponse = await get(SPOTIFY_CURRENT_USER_URL, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return userResponse.data.id;
    }
    catch (err) {
        return null;
    }
}

/**
 * Given spotify token object for a user, upserts to db.
 * @param {String} userId 
 * @param {object} token 
 */
async function UpsertUserToken(userId, token) {
    let userToken = await UserToken.findOne({ userId: userId });

    //Create
    if (!userToken) {
        userToken = new UserToken({
            userId: userId
        });
    }
    
    userToken.accessToken = token.access_token;
    userToken.refreshToken = token.refresh_token;
    userToken.expireDate = Date.now() + token.expires_in * 1000;

    return await userToken.save();
}

