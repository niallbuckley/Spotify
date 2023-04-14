
const express = require('express');
const app = express();

const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '.././database.json');

const { getRedisClient } = require('./redisConnection');
const client = getRedisClient();

var getUserSpotifyUserName = async(req, res) => {
    user = req.cookies.spotify_auth_state;

    var r = await client.exists(user);
    if (!r){
        console.log("Error user not found in database.")
        return
    }

    var spot_user_name = await client.hGet(user, "spot_user_name");

    const data = { "user_name" : spot_user_name};
    
    return res.json(data)

};

module.exports = getUserSpotifyUserName;