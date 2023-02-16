var querystring = require('querystring');
var stateKey = 'spotify_auth_state';


const modeChoiceView = (req, res) => {
    // your application requests refresh and access tokens
    // after checking the state parameter
    var code = req.query.code || null;
    var state = req.query.state || null;
    var storedState = req.cookies ? req.cookies[stateKey] : null;

    if (state === null || state !== storedState) {
      res.redirect('/#' +
	querystring.stringify({
	  error: 'state_mismatch'
	}));
    }
    // This is looking at views diretory and looking for login name
    else {
      res.render("mode", {
      }); 
    }
}

module.exports = modeChoiceView;
