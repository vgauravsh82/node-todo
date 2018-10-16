var Schema = require("../db.js")
var Event = Schema.Event;

actionCounts = function (eventType, res) {
    Event.countDocuments({ eventType: eventType }, function (err, count) {
        if (err) res.status(400).json({
            message: err.name
        });
        console.log(count);
        res.json({ count: count });
    });
}

exports.added = function (req, res) {
    actionCounts('add', res);
}


exports.deleted = function (req, res) {
    actionCounts('delete', res);
}

exports.completed = function (req, res) {
    actionCounts('complete', res)
}

exports.summary = function(req, res){
     Event.aggregate([
        { $group: {_id: "$eventType", total: {$sum : "$count"}}}
    ],
    function(err, results){
        if(err) res.status(200).json({message: err.name});
        console.log(results);   
        res.json(results); 
    }
    );
    
}
