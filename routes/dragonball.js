
var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();
const request = require('request');
var Dragonball = require("../model/dragonball")
var App = require("../model/App")
/* GET users listing. */
router.post('/', function(req, res, next) {

    var db=new Dragonball({
        name:'Dragonball',
        number:500
    });

    
    db.save(function(err,data){
        res.json({
            err:err,
            data:data
        });
    });
});


router.get('/list',function(req,res,next){

    Dragonball.find({},function(err,data){
        res.json({
            err:err,
            data:data
        });
    });
});

router.get('/update',function(req,res,next){

    
    App.find({name:'Dragonball'},function(err,data){
        res.json({
            err:err,
            data:data
        });
    });
})

module.exports = router;
