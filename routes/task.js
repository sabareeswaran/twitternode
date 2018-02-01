var mongoose = require('mongoose');
var Data=require('./Data');

module.exports={
    save:function(data,callback){
        
        var n_data=new Data({
            data:data
        });

        n_data.save(function(err,s_data){
            console.log("3");
            if(err){
                console.log(err);
                callback(true,null);
            }else{
                callback(false,data);
            }
        });
    },
    get:function(callback){
        Data.find({},function(err,data){
            if(err){
                callback(true,null);
            }else{
                callback(false,data);
            }
        });

    }
}