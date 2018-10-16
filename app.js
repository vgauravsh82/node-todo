var schema = require('./db');
var filestream = require('./filestream');
var express = require('express');
var mongoose = require("mongoose");
var routes = require('./routes');
var tasks = require('./routes/tasks');
var analytics = require('./routes/analytics');
var multer = require('multer')
var schedule = require('node-schedule');
var logger = require('log-timestamp');


logger(function () {
  return '[' + new Date().toLocaleString() + ']';
})

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'D:/apps/todo-app/todo-express/fileupload/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname + '-' + Date.now())
  }
});

var rule = new schedule.RecurrenceRule();
rule.second = 10;

var j = schedule.scheduleJob('*/5 * * * * *', function (fireDate) {
  console.log('This job was supposed to run at ' + fireDate + ', but actually ran at ' + new Date());
});

var upload = multer({ storage: storage });

var http = require('http');
var path = require('path');
var app = express();
var Todo = schema.Todo;

var favicon = require('serve-favicon'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  cookieParser = require('cookie-parser'),
  session = require('express-session'),
  csrf = require('csurf'),
  errorHandler = require('errorhandler');

mongoose.Promise = global.Promise;
var options = {
  useNewUrlParser: true,
  reconnectInterval: 500, // Reconnect every 500ms
  reconnectTries: 3,
  connectTimeoutMS: 2000, // Give up initial connection after 10 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4 // Use IPv4, skip trying IPv6
};
mongoose.connect('mongodb://localhost:27017/todo', options);


app.use(function (req, res, next) {
  next();
})
app.locals.appname = 'Express.js Todo App'
app.locals.moment = require('moment');

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(favicon(path.join('public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());
app.use(cookieParser('CEAF3FA4-F385-49AA-8FE4-54766A9874F1'));
app.use(session({
  secret: '59B93087-78BC-4EB9-993A-A61FC844F6C9',
  resave: true,
  saveUninitialized: true
}));


app.use(upload.single('avatar'));
app.use(csrf());

app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(function (req, res, next) {
  res.locals._csrf = req.csrfToken();
  return next();
})

app.param('task_id', function (req, res, next, taskId) {
  Todo.findById(taskId, function (error, task) {
    if (error) return next(error);
    if (!task) return next(new Error('Task is not found.'));
    req.task = task;
    return next();
  });
});

app.get('/', routes.index);
app.get('/tasks', tasks.list);
app.post('/tasks', tasks.markAllCompleted)
app.post('/tasks', tasks.add);
app.post('/tasks/:task_id', tasks.markCompleted);
app.delete('/tasks/:task_id', tasks.del);
app.get('/tasks/completed', tasks.completed);

app.get('/analytics/added', analytics.added);
app.get('/analytics/completed', analytics.completed);
app.get('/analytics/deleted', analytics.deleted);
app.get('/analytics/summary', analytics.summary);

app.get('/file/stream', function (req, res) {
  filestream.read();
  res.send('reading file and loging on console.')
})


app.post('/profile', upload.single('avatar'), function (req, res) {
  res.send('data is being processed')
  // req.body will hold the text fields, if there were any
})


app.all('*', function (req, res) {
  res.status(404).send();
})
// development only
if ('development' == app.get('env')) {
  app.use(errorHandler());
}
http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});