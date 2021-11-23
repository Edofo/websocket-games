const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const port = process.env.PORT || 4000;


// const io = new Server(server,{
//   cors: {
//     origin: "*",
//   }
// });

// let interval;

// io.on("connection", (socket) => {
//   console.log("New user connected");
//   // if (interval) {
//   //   clearInterval(interval);
//   // }
//   // interval = setInterval(() => getApiAndEmit(socket), 1000);

//   socket.on("SEND_NICKNAME", (nickname) => {
//     socket.join('Game')

//     const clients = io.sockets.adapter.rooms.get('Game')

//     const numClients = clients ? clients.size : 0

//     if(numClients < 2) return

//     console.log('game start!')
//     io.to('Game').emit('GAME_START')
//   })

//     socket.on("disconnect", () => {

//     socket.leave('Game')



//     console.log("Client disconnected");
//     // clearInterval(interval);
//     })
// });

// const getApiAndEmit = socket => {
//   const response = new Date();
//   // Emitting a new message. Will be consumed by the client
//   socket.emit("FromAPI", response);
// };

// server.listen(port, () => console.log(`Listening on port ${port}`));

/**	
 * Router section
 */

const indexRouter = require('./src/routes/index')

/**
 * Route section
 */
app.use('/', indexRouter);


// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

server.listen(port, () => {
  console.log(`listening on *: ${port}`);
});

module.exports = app;