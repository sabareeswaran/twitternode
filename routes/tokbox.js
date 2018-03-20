
var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();
const request = require('request');
var Dragonball = require("../model/dragonball");
var App = require("../model/App");
var OpenTok = require('opentok');
var opentok = new OpenTok('46083292', '60d1921d4cc254cdb816d30f62614ac51e4c3473');
var Tokbox = require('../model/tokbox');
router.get('/create', function (req, res, next) {

    opentok.createSession(function (err, session) {
        var token = opentok.generateToken(session['sessionId']);
        if (err)
            console.log(err);
        else {
            var obj = new Tokbox({
                session: session['sessionId'],
                token: token
            });
            obj.save(function (err, data) {
                if (!err){
                    res.json(session);
                }else{
                    res.json(err);
                }
            });
        }


    });
});
module.exports = router;
