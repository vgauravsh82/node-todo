# Todo Sample application!

Hi, It is sample Todo application created as a POC for node.js and express application. As part of this POC simple TODO app is created.

**Todo** express application has been setup using https://github.com/azat-co/todo-express. Jade templates for html, css used to build UI.

- Later mongoskin code is replaced with mongoose library. {app.js}
- Event store implemented for different actions with concept of event emitter. {db.js, event.js}
- Seperate analytics api to support summary functions. {analytics.js}
- Async file read and write. {filestream.js}
- File upload function using multer {app.js}
