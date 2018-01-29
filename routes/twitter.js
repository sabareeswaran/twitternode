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
        console.log("Followes");
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
        console.log("2");
        const getFollowers=data=>new Promise(function(resolve,reject){
            console.log("3");
            rp(data).then(body=>{ 
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
    },
    nonfollowers:function(access_token,access_token_secret,callback){
        console.log("1");
            
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

        const following_data = {
            url: 'https://api.twitter.com/1.1/friends/ids.json?cursor=-1&count=5000',
            method: 'GET',
        };
        
        const followers_data = {
            url: 'https://api.twitter.com/1.1/followers/ids.json?cursor=-1&count=5000',
            method: 'GET',
        };

        const token = {
            key:access_token,
            secret:access_token_secret
        };

        var following = new Promise(function(resolve, reject) {
            request({
                url: following_data.url,
                method: following_data.method,
                form: following_data.data,
                headers: oauth.toHeader(oauth.authorize(following_data,token))
            }, function(error, response, body) {
                if(error){
                    resolve(false);
                }else{
                    resolve(JSON.parse(body));
                }
            });
        });

        var followers=new Promise(function(resolve,reject){
            
            request({
                url: followers_data.url,
                method: followers_data.method,
                form: followers_data.data,
                headers: oauth.toHeader(oauth.authorize(followers_data,token))
            }, function(err, response, body) {
                if(err){
                    resolve(false);
                }else{
                    resolve(JSON.parse(body));
                }
            });
        });

        let result = []; 
        
        const request_data = {
            url: 'https://api.twitter.com/1.1/users/show.json?id=',
            method: 'GET',
        };
       

        Promise.all([following,followers]).then(users=>{
            var follower_user=users[1]['ids'];
            var following_user=users[0]['ids'];
            console.log("2");
            var diff=arr_diff(following_user, follower_user);
            
            var request_it = 0;
            const getNonFollowers=data=>new Promise(function(resolve,reject){
                console.log("3");
                rp(data).then(body=>{
                        console.log("4"); 
                        request_it++;
                        result = result.concat(body);
                        if (request_it<diff.length && request_it <900) {
                            console.log(request_it);
                            getNonFollowers(getOptions(request_it));
                        } else {
                            // this was the last page, return the collected contacts
                            console.log("done");
                            callback(false,result);
                        }
                    
                }).catch(error=>{
                    console.log(error);
                    callback(true,null);
                });
            });
            
            var getOptions=function(id){
                console.log(id);
               return {
                    uri: request_data.url+id,
                    method: request_data.method,
                    headers:oauth.toHeader(oauth.authorize({
                        url:request_data.url+id,
                        method:'GET'
                    },token)),
                    json: true // Automatically parses the JSON string in the response
                }
            }
    
            getNonFollowers(getOptions(diff[0]));
    

        }).catch(err=>{
            
        });

       
    }

};