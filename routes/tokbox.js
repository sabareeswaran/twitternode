
var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();
const request = require('request');
var Dragonball = require("../model/dragonball");
var App = require("../model/App");
var OpenTok = require('opentok');
var opentok = new OpenTok('', '');
var Tokbox = require('../model/tokbox');
router.get('/create', function (req, res, next) {

    opentok.createSession(function (err, session) {
        var token = opentok.generateToken(session['sessionId']);
        if (err)
            console.log(err);
        else {
            var obj = new Tokbox({
                sessionId: session['sessionId'],
                token: token,
                apiKey:session['ot']['apiKey']
            });
            obj.save(function (err, data) {
                if (!err){
                    res.json(data);
                }else{
                    res.json(err);
                }
            });
        }


    });
});


router.get('/join',function(req,res,next){
    Tokbox.find({apiKey:'46083292'},function(err,data){
        res.json(data[0]);
    });
})
module.exports = router;
