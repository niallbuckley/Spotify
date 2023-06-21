var querystring = require('querystring');
var stateKey = 'spotify_auth_state';

const setUpUser = require('./setupUserInApp');

//database
const { getRedisClient } = require('./redisConnection');
const client = getRedisClient();

const modeChoiceView = async(req, res) => {
  console.time();
  var code = req.query.code || null;
  var state = req.query.state || null;
  var stateInDatabase = false;
  // checking if the request has cookies, if it does, what it checks for the auth state if it can't find either return null.
  var storedState = req.cookies ? req.cookies[stateKey] : null;
  client.on("error", (error) => console.error(`Error : ${error}`));

  var r = await client.hExists('users', state);
  // This codition nver gets hit -- r is never true!!
  if (r) {
    console.log('Field exists!!!!');
    stateInDatabase = true;
  } 

  if ((state === null || state !== storedState) === true && stateInDatabase === false) {
      console.log("REDIRECT");
      res.redirect('/#' +
          querystring.stringify({
            error: 'state_mismatch'
          }));
    }
  else {  
      // TODO: Add a check for if state in database already. Is this necessary?

      // Setup user 
      setUpUser(code, state);
      return res.render("mode", {}); 
  }
}

module.exports = modeChoiceView;
