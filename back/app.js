const express = require("express");
const http = require("http");
const app = express();
const cors = require("cors");
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const rn = require('random-number')

const port = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static('public'))
app.use(cookieParser());

const options = {
  min:  0
, max:  1000
, integer: true
}

let userRoom1 = []
let numberRoom1 = []

const closestToZero = (numbers) => {
  if(!numbers.length){
      return 0;
  }
  
  let closest = 0;
  
  for (let i = 0; i < numbers.length ; i++) {
      if (closest === 0) {
          closest = numbers[i];
      } else if (numbers[i] > 0 && numbers[i] <= Math.abs(closest)) {
          closest = numbers[i];
      } else if (numbers[i] < 0 && - numbers[i] < Math.abs(closest)) {
          closest = numbers[i];
      }
  }
  
  return closest;
}

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
    socket.leave('Game')
  });

    socket.on("send nickname", (nickname) => {
      socket.join('Game')

      userRoom1.push(nickname)

      const clients = io.sockets.adapter.rooms.get('Game')

      const numClients = clients ? clients.size : 0
      
      if(numClients < 2) return    

      io.to('Game').emit('GAME_START', userRoom1, rn(options))
    })

    socket.on("send number", (number) => {

      numberRoom1.push(number)
      
      if(numberRoom1.length < 2) return   
      
      const num = closestToZero(numberRoom1)

      io.to('Game').emit('FINISH_NUMBER', numberRoom1)

      numberRoom1 = []
    })
});

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
  res.send('error');
});

server.listen(port, () => {
  console.log(`listening on *: ${port}`);
});

module.exports = app;