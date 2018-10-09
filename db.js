var mongoose = require("mongoose");

var Todo = new mongoose.Schema({
  name: String,
  createTime: { type: Date, default: Date.now },
  completed: Boolean,
  completeTime: { type: Date},
 });

 var Event = new mongoose.Schema({
   eventType: String,
   createTime: {type: Date, default: Date.now },
   eventDesc: String,
   count:Number
    }
 );

 module.exports = {
  Todo:  mongoose.model("Todo", Todo),
  Event: mongoose.model("Event", Event)
 };

