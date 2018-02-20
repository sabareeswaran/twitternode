
var express = require('express');
var router = express.Router();
const request = require('request');
const OAuth   = require('oauth-1.0a');
const crypto  = require('crypto');
var CreditCard = require('credit-card');
var http = require('http');
var unirest = require("unirest");
var arr_diff = require('arr-diff');
var twitter=require('./twitter');

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
		res.json(data[0]);
	}
});
});

router.post('/',function(req,res,next){
	var oauth_verifier=req.body.oauth_verifier;
	var oauth_token=req.body.oauth_token;
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
	  url: 'https://api.twitter.com/oauth/access_token',
	  method: 'POST',
	  data: 'oauth_verifier='+oauth_verifier
	};
 
	/* Note: The token is optional for some requests
	 */
	const token = {
	  key:oauth_token
	};
	request({
		url: request_data.url,
		method: request_data.method,
		form: request_data.data,
		headers: oauth.toHeader(oauth.authorize(request_data,token))
	}, function(error, response, body) {
		if(error)
			res.json(err);
		else{
			var data=body.split("&");
			var oauth_token=data[0].split("=")[1];
			var oauth_token_secret=data[1].split("=")[1];
			var user_id=data[2].split("=")[1];
			var screen_name=data[3].split("=")[1];
			res.json({
				access_token:oauth_token,
				access_token_secret:oauth_token_secret,
				user_id:user_id,
				screen_name:screen_name
			});
		}
	});
});

//Getting List of User is following
router.post('/following',function(req,res,next){
	var access_token_secret=req.body.access_token_secret;
	var access_token=req.body.access_token;
	
	twitter.following(access_token,access_token_secret,function(err,following){
		if(!err){
			res.json({
				success:true,
				users:following,
				length:following.length
			});
		}else{
			res.json({
				success:false
			});
		}
	});
	
});

router.post('/profile',function(req,res,next){
	
	var access_token_secret=req.body.access_token_secret;
	var access_token=req.body.access_token;
	
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
	  url: 'https://api.twitter.com/1.1/account/verify_credentials.json',
	  method: 'GET',
	  };
 
	/* Note: The token is optional for some requests
	 */
	const token = {
		key:access_token,
		secret:access_token_secret
	};

	request({
		url: request_data.url,
		method: request_data.method,
		form: request_data.data,
		headers: oauth.toHeader(oauth.authorize(request_data,token))
	}, function(error, response, body) {
		if(error)
			res.json(err);
		else{
			if(response['statusCode']==200){
				res.json({
					success:true,
					user:JSON.parse(body)
				});
			}else{
				res.json({
					success:false
				});
			}
		}
	});
});

//Getting List of User Followers
router.post('/followers',function(req,res,next){
	var access_token_secret=req.body.access_token_secret;
	var access_token=req.body.access_token;
	
	twitter.followers(access_token,access_token_secret,function(err,followers){
		if(!err){
			res.json({
				success:true,
				users:followers,
				length:followers.length
			});
		}else{
			res.json({
				success:false
			});
		}
	});

	

});

//Look Up
router.post('/lookup',function(req,res,next){
	
	var access_token_secret=req.body.access_token_secret;
	var access_token=req.body.access_token;
	
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
	  url: 'https://api.twitter.com/1.1/friendships/lookup.json?screen_name=tourismtn',
	  method: 'GET',
	  };
 
	/* Note: The token is optional for some requests
	 */
	const token = {
		key:access_token,
		secret:access_token_secret
	};

	request({
		url: request_data.url,
		method: request_data.method,
		form: request_data.data,
		headers: oauth.toHeader(oauth.authorize(request_data,token))
	}, function(error, response, body) {
		if(error)
			res.json(err);
		else{
			if(response['statusCode']==200){
				res.json({
					success:true,
					users:JSON.parse(body)
				});
			}else{
				res.json({
					success:false
				});
			}
		}
	});
});

//Incoming Pending Outgoing Request for a protected User
router.post('/friendRequest',function(req,res,next){
	
	var access_token_secret=req.body.access_token_secret;
	var access_token=req.body.access_token;
	
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
	  url: 'https://api.twitter.com/1.1/friendships/incoming.json',
	  method: 'GET',
	  };
 
	/* Note: The token is optional for some requests
	 */
	const token = {
		key:access_token,
		secret:access_token_secret
	};

	request({
		url: request_data.url,
		method: request_data.method,
		form: request_data.data,
		headers: oauth.toHeader(oauth.authorize(request_data,token))
	}, function(error, response, body) {
		if(error)
			res.json(err);
		else{
			if(response['statusCode']==200){
				res.json({
					success:true,
					users:JSON.parse(body)
				});
			}else{
				res.json({
					success:false
				});
			}
		}
	});
});


// Friend Request for a protected User
router.post('/pending',function(req,res,next){
	
	var access_token_secret=req.body.access_token_secret;
	var access_token=req.body.access_token;
	
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
	  url: 'https://api.twitter.com/1.1/friendships/outgoing.json',
	  method: 'GET',
	  };
 
	/* Note: The token is optional for some requests
	 */
	const token = {
		key:access_token,
		secret:access_token_secret
	};

	request({
		url: request_data.url,
		method: request_data.method,
		form: request_data.data,
		headers: oauth.toHeader(oauth.authorize(request_data,token))
	}, function(error, response, body) {
		if(error)
			res.json(err);
		else{
			if(response['statusCode']==200){
				res.json({
					success:true,
					users:JSON.parse(body)
				});
			}else{
				res.json({
					success:false
				});
			}
		}
	});
});


// Get a User Profile
router.post('/getProfile',function(req,res,next){
	
	var access_token_secret=req.body.access_token_secret;
	var access_token=req.body.access_token;
	var id=req.body.id;
	
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
	  url: 'https://api.twitter.com/1.1/users/show.json?id='+id,
	  method: 'GET',
	  };
 
	/* Note: The token is optional for some requests
	 */
	const token = {
		key:access_token,
		secret:access_token_secret
	};

	request({
		url: request_data.url,
		method: request_data.method,
		form: request_data.data,
		headers: oauth.toHeader(oauth.authorize(request_data,token))
	}, function(error, response, body) {
		if(error)
			res.json(err);
		else{
			if(response['statusCode']==200){
				res.json({
					success:true,
					user:JSON.parse(body)
				});
			}else{
				res.json({
					success:false
				});
			}
		}
	});
});


// List of Blocked User
router.post('/blocked',function(req,res,next){
	
	var access_token_secret=req.body.access_token_secret;
	var access_token=req.body.access_token;
	
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
	  url: 'https://api.twitter.com/1.1/blocks/list.json',
	  method: 'GET',
	  };
 
	/* Note: The token is optional for some requests
	 */
	const token = {
		key:access_token,
		secret:access_token_secret
	};

	request({
		url: request_data.url,
		method: request_data.method,
		form: request_data.data,
		headers: oauth.toHeader(oauth.authorize(request_data,token))
	}, function(error, response, body) {
		if(error)
			res.json(err);
		else{
			if(response['statusCode']==200){
				res.json({
					success:true,
					users:JSON.parse(body)['users']
				});
			}else{
				res.json({
					success:false
				});
			}
		}
	});
});


// List of Muted User
router.post('/muted',function(req,res,next){
	
	var access_token_secret=req.body.access_token_secret;
	var access_token=req.body.access_token;
	
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
	  url: 'https://api.twitter.com/1.1/mutes/users/list.json',
	  method: 'GET',
	  };
 
	/* Note: The token is optional for some requests
	 */
	const token = {
		key:access_token,
		secret:access_token_secret
	};

	request({
		url: request_data.url,
		method: request_data.method,
		form: request_data.data,
		headers: oauth.toHeader(oauth.authorize(request_data,token))
	}, function(error, response, body) {
		if(error)
			res.json(err);
		else{
			if(response['statusCode']==200){
				res.json({
					success:true,
					users:JSON.parse(body)['users']
				});
			}else{
				res.json({
					success:false
				});
			}
		}
	});
});

//Non Follow
router.post('/nonfollower',function(req,res,next){
	var access_token=req.body.access_token;
	var access_token_secret=req.body.access_token_secret;

	twitter.nonfollowers(access_token,access_token_secret,function(error,users){
		if(!error){
			res.json({success:true,users:users});
		}else{
			res.json({success:false});
		}
	});
	
});


// Unfollow user by id
router.post('/unfollow',function(req,res,next){
	
	var access_token_secret=req.body.access_token_secret;
	var access_token=req.body.access_token;
	var id=req.body.id;
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
	  url: 'https://api.twitter.com/1.1/friendships/destroy.json?user_id='+id,
	  method: 'POST',
	  };
 
	/* Note: The token is optional for some requests
	 */
	const token = {
		key:access_token,
		secret:access_token_secret
	};

	request({
		url: request_data.url,
		method: request_data.method,
		form: request_data.data,
		headers: oauth.toHeader(oauth.authorize(request_data,token))
	}, function(error, response, body) {
		if(error)
			res.json(err);
		else{
			if(response['statusCode']==200){
				res.json({
					success:true
				});
			}else{
				res.json({
					success:false,
					description:JSON.parse(body)
					
				});
			}
		}
	});
});


// follow user by id
router.post('/follow',function(req,res,next){
	
	var access_token_secret=req.body.access_token_secret;
	var access_token=req.body.access_token;
	var id=req.body.id;
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
	  url: 'https://api.twitter.com/1.1/friendships/create.json?user_id='+id+'&follow=true',
	  method: 'POST',
	  };
 
	/* Note: The token is optional for some requests
	 */
	const token = {
		key:access_token,
		secret:access_token_secret
	};

	request({
		url: request_data.url,
		method: request_data.method,
		form: request_data.data,
		headers: oauth.toHeader(oauth.authorize(request_data,token))
	}, function(error, response, body) {
		if(error)
			res.json(err);
		else{
			if(response['statusCode']==200){
				res.json({
					success:true
				});
			}else{
				res.json({
					success:false,
					description:JSON.parse(body)
					
				});
			}
		}
	});
});




// Mute user by id
router.post('/mute',function(req,res,next){
	
	var access_token_secret=req.body.access_token_secret;
	var access_token=req.body.access_token;
	var id=req.body.id;
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
	  url: 'https://api.twitter.com/1.1/mutes/users/create.json?user_id='+id,
	  method: 'POST',
	  };
 
	/* Note: The token is optional for some requests
	 */
	const token = {
		key:access_token,
		secret:access_token_secret
	};

	request({
		url: request_data.url,
		method: request_data.method,
		form: request_data.data,
		headers: oauth.toHeader(oauth.authorize(request_data,token))
	}, function(error, response, body) {
		if(error)
			res.json(err);
		else{
			if(response['statusCode']==200){
				res.json({
					success:true
				});
			}else{
				res.json({
					success:false,
					description:JSON.parse(body)
					
				});
			}
		}
	});
});

// UnMute user by id
router.post('/unmute',function(req,res,next){
	
	var access_token_secret=req.body.access_token_secret;
	var access_token=req.body.access_token;
	var id=req.body.id;
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
	  url: 'https://api.twitter.com/1.1/mutes/users/destroy.json?user_id='+id,
	  method: 'POST',
	  };
 
	/* Note: The token is optional for some requests
	 */
	const token = {
		key:access_token,
		secret:access_token_secret
	};

	request({
		url: request_data.url,
		method: request_data.method,
		form: request_data.data,
		headers: oauth.toHeader(oauth.authorize(request_data,token))
	}, function(error, response, body) {
		if(error)
			res.json(err);
		else{
			if(response['statusCode']==200){
				res.json({
					success:true
				});
			}else{
				res.json({
					success:false,
					description:JSON.parse(body)
					
				});
			}
		}
	});
});


//Block user
router.post('/block',function(req,res,next){
	
	var access_token_secret=req.body.access_token_secret;
	var access_token=req.body.access_token;
	var id=req.body.id;
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
	  url: 'https://api.twitter.com/1.1/blocks/create.json?user_id='+id+'&skip_status=1',
	  method: 'POST',
	  };
 
	/* Note: The token is optional for some requests
	 */
	const token = {
		key:access_token,
		secret:access_token_secret
	};

	request({
		url: request_data.url,
		method: request_data.method,
		form: request_data.data,
		headers: oauth.toHeader(oauth.authorize(request_data,token))
	}, function(error, response, body) {
		if(error)
			res.json(err);
		else{
			if(response['statusCode']==200){
				res.json({
					success:true
				});
			}else{
				res.json({
					success:false,
					description:JSON.parse(body)
					
				});
			}
		}
	});
});

//Block user
router.post('/unblock',function(req,res,next){
	
	var access_token_secret=req.body.access_token_secret;
	var access_token=req.body.access_token;
	var id=req.body.id;
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
	  url: 'https://api.twitter.com/1.1/blocks/destroy.json?user_id='+id+'&skip_status=1',
	  method: 'POST',
	  };
 
	/* Note: The token is optional for some requests
	 */
	const token = {
		key:access_token,
		secret:access_token_secret
	};

	request({
		url: request_data.url,
		method: request_data.method,
		form: request_data.data,
		headers: oauth.toHeader(oauth.authorize(request_data,token))
	}, function(error, response, body) {
		if(error)
			res.json(err);
		else{
			if(response['statusCode']==200){
				res.json({
					success:true
				});
			}else{
				res.json({
					success:false,
					description:JSON.parse(body)
					
				});
			}
		}
	});
});


//Tweet user
router.post('/tweet',function(req,res,next){
	
	var access_token_secret=req.body.access_token_secret;
	var access_token=req.body.access_token;
	var id=req.body.id;
	var data=req.body.status;
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
	  url: 'https://api.twitter.com/1.1/statuses/update.json?status='+data,
	  method: 'POST',
	  };
 
	/* Note: The token is optional for some requests
	 */
	const token = {
		key:access_token,
		secret:access_token_secret
	};

	request({
		url: request_data.url,
		method: request_data.method,
		form: request_data.data,
		headers: oauth.toHeader(oauth.authorize(request_data,token))
	}, function(error, response, body) {
		if(error)
			res.json(err);
		else{
			if(response['statusCode']==200){
				res.json({
					success:true
				});
			}else{
				res.json({
					success:false,
					description:JSON.parse(body)
					
				});
			}
		}
	});
});


//homescreen
router.post('/homescreen',function(req,res,next){
	
	var access_token_secret=req.body.access_token_secret;
	var access_token=req.body.access_token;
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
	  url: 'https://api.twitter.com/1.1/statuses/home_timeline.json?count=200',
	  method: 'GET',
	  };
 
	/* Note: The token is optional for some requests
	 */
	const token = {
		key:access_token,
		secret:access_token_secret
	};

	request({
		url: request_data.url,
		method: request_data.method,
		form: request_data.data,
		headers: oauth.toHeader(oauth.authorize(request_data,token))
	}, function(error, response, body) {
		if(error)
			res.json(err);
		else{
			if(response['statusCode']==200){
				res.json({
					success:true,
					timeline:JSON.parse(body)
				});
			}else{
				res.json({
					success:false,
					description:JSON.parse(body)
					
				});
			}
		}
	});
});


//user timeline
router.post('/timeline',function(req,res,next){
	
	var access_token_secret=req.body.access_token_secret;
	var access_token=req.body.access_token;
	var id=req.body.id;
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
	  url: 'https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name='+id+'&count=100',
	  method: 'GET',
	  };
 
	/* Note: The token is optional for some requests
	 */
	const token = {
		key:access_token,
		secret:access_token_secret
	};

	request({
		url: request_data.url,
		method: request_data.method,
		form: request_data.data,
		headers: oauth.toHeader(oauth.authorize(request_data,token))
	}, function(error, response, body) {
		if(error)
			res.json(err);
		else{
			if(response['statusCode']==200){
				res.json({
					success:true,
					timeline:JSON.parse(body)
				});
			}else{
				res.json({
					success:false,
					description:JSON.parse(body)
					
				});
			}
		}
	});
});

router.post('/friends/ids',function(req,res,next){
	
});

module.exports = router;
