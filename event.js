var EventEmitter = require('events');
var schema = require('./db');
var Event = schema.Event;

var deleteEvent = new EventEmitter();

deleteEvent.on('action', function (obj) {
    var actionEvent = new Event({
        eventType: obj.type,
        createTime: new Date(),
        count: obj.taskCount,
        eventDesc: obj.description
    });
    actionEvent.save(function (err) {
        if (err) console.log(err);
            console.log('Event log succesfully');
    });
});

exports.sendMessage = function (obj, callback) {
    deleteEvent.emit('action', obj);
};