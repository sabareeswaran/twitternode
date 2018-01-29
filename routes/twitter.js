var rp = require('request-promise');
var express = require('express');
var router = express.Router();
const request = require('request');
const OAuth   = require('oauth-1.0a');
const crypto  = require('crypto');
var CreditCard = require('credit-card');
var http = require('http');
var unirest = require("unirest");
var arr_diff = require('arr-diff');
var rp = require('request-promise');
module.exports={
    followers:function(access_token,access_token_secret,callback){
        
        var access_token_secret=access_token_secret;
        var access_token=access_token;
        
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
          url: 'https://api.twitter.com/1.1/followers/list.json?cursor=',
          method: 'GET',
        };
     
        const token = {
            key:access_token,
            secret:access_token_secret
        };
        
        let users = []; 
        
        var request_it = 0;
        
        const getFollowers=data=>new Promise(function(resolve,reject){
            rp(data).then(body=>{ 
                if(body.statusCode==200){
                    request_it++;
                    users = users.concat(body.users);
                    next =body.next_cursor;
                    console.log(next);
                    if (next!=0 && request_it <15) {
                        console.log(request_it);
                        getFollowers(getOptions(next));
                    } else {
                        // this was the last page, return the collected contacts
                        console.log("done");
                        callback(false,users);
                    }
                }else{
                    callback(true,null);
                }
            }).catch(error=>{
                callback(true,null);
            });
        });
        
        var getOptions=function(cursor){
           return {
                uri: request_data.url+cursor+'&skip_status=true&include_user_entities=false',
                method: request_data.method,
                headers:oauth.toHeader(oauth.authorize({
                    url:request_data.url+cursor+'&skip_status=true&include_user_entities=false',
                    method:'GET'
                },token)),
                json: true // Automatically parses the JSON string in the response
            }
        }

        return getFollowers(getOptions(-1));
}

};