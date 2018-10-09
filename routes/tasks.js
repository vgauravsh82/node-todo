var Schema = require("../db.js")
var Todo = Schema.Todo;
var eventEmitter = require("../event.js")


exports.list = function(req, res, next){
  Todo.find({completed:false}).exec(function(error, tasks){
    if (error) return next(error);
    res.render('tasks', {
      title: 'Todo List',
      tasks: tasks || []
    });
  });
};

exports.add = function(req, res, next){
  if (!req.body || !req.body.name) return next(new Error('No data provided.'));
  var myData = new Todo({
    name: req.body.name,
    createTime: new Date(),
    completed: false
  });
  myData.save(function(error){
    if(error) next(error);
    eventEmitter.sendMessage({type: 'add',taskCount:1, description:'Task added'})    
    res.redirect('/tasks');
  });
  
};

exports.markAllCompleted = function(req, res, next) {
  if (!req.body.all_done || req.body.all_done !== 'true') return next();
  Todo.update({
    completed: false
  }, {$set: {
    completeTime: new Date(),
    completed: true
  }}, {multi: true}, function(error, count){
    if (error) return next(error);
    console.info('Marked %s task(s) completed.', count.n);
    eventEmitter.sendMessage({type: 'complete',taskCount:count.n, description:'All task completed'})    
    res.redirect('/tasks');
  })
};

exports.completed = function(req, res, next) {
  Todo.find({completed: true}).exec(function(error, tasks) {
    res.render('tasks_completed', {
      title: 'Completed',
      tasks: tasks || []
    });
  });
};

exports.markCompleted = function(req, res, next) {
  if (!req.body.completed) return next(new Error('Param is missing.'));
  var completed = req.body.completed === 'true';

  Todo.findById(req.task._id, function(err, doc){
    if(err) next(err);
    doc.completed = true;
    doc.completeTime = new Date;
    doc.save(function(err){
      if(err) next(err);
      eventEmitter.sendMessage({type: 'complete',taskCount:1, description:'Single task completed'})    
    });
    
   }); 
    res.redirect('/tasks');
};

exports.del = function(req, res, next) {
  Todo.deleteOne({_id:req.task._id}, function(error) {
    if (error) return next(error);
    eventEmitter.sendMessage({type: 'delete',taskCount:1, description:'Task deleted'});
    console.info('Deleted task %s with id=%s completed.', req.task.name, req.task.id);
    res.status(204).send();
  });
};