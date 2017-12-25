var express = require('express');
var router = express.Router();
const request = require('request');
const OAuth   = require('oauth-1.0a');
const crypto  = require('crypto');
/* GET users listing. */
router.get('/', function(req, res, next) {
 const oauth = OAuth({
  consumer: {
    key: 'ZoNxViPw2sHSDKhYeBXxKqZvI',
    secret: 'kfHbyueFbpgRUbHVPgJLcjrlo1CyZL7nhpIAZi4ExXe59IOChT'
  },
  signature_method: 'HMAC-SHA1',
  hash_function(base_string, key) {
    return crypto.createHmac('sha1', key).update(base_string).digest('base64');
  }
});
 
const request_data = {
  url: 'https://api.twitter.com/oauth/request_token',
  method: 'POST',
  data: ''
};
 
/* Note: The token is optional for some requests
const token = {
  key:'ZoNxViPw2sHSDKhYeBXxKqZvI',
  secret: 'kfHbyueFbpgRUbHVPgJLcjrlo1CyZL7nhpIAZi4ExXe59IOChT',
  callback:'127.0.0.1'
};
 */
request({
    url: request_data.url,
    method: request_data.method,
    form: request_data.data,
    headers: oauth.toHeader(oauth.authorize(request_data))
}, function(error, response, body) {
    if(error)
	res.json(error);
	else{
	var data = body.split("&");
		res.json(token:data[0]);
	}
});
});

module.exports = router;
