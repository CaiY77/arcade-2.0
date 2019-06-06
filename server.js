const express = require('express')
const http = require('http')
const socketIO = require('socket.io')
const PORT = process.env.PORT || 4001
const app = express()
const server = http.createServer(app)
const io = socketIO(server)

io.on('connection', socket => {

  socket.on('MakeMove', data => {
    io.to(`${data.room}`).emit('MakeMove', data.array);
  })

  socket.on('createRoom', data=>{
    socket.username = data.who
    console.log(`${socket.username} created a room: ${data.room}`)
    socket.join(`${data.room}`)
    io.in(data.room).clients((err,clients)=>{
      console.log(clients[0])
    })
    socket.emit('newGame', {
      room: data.room
    })
  })

  socket.on('joinRoom', data=>{
    socket.username = data.who
    let people = io.sockets.adapter.rooms[data.room].length
    if(people < 2){
      socket.join(`${data.room}`)
      console.log(`${socket.id} joined ${data.room}`)

      socket.emit('msg', {
        message:`COME ON IN!!!`,
        clear: true
      })
    } else {
      socket.emit('msg', {
         message:`Opps, looks like that room ${data.room} is full`,
         clear: false
       })
    }
  })

  socket.on('update',roomName=>{
    io.to(`${data.room}`).emit('MakeMove', data.array);
  })

  socket.on('leaveRoom',roomName=>{
    socket.leave(`${roomName}`)
  })

  socket.on('disconnect', () => {
    console.log(`${socket.id} disconnected`)
  })

})

app.get('/', async (request, response) => {
  try {
    response.json({
      msg: 'Welcome to Arcade 2.0 Application!'
    })
  } catch (e) {
    response.status(500).json({ msg: e.status })
  }
});

server.listen(PORT, () => console.log(`Arcade listening on port ${PORT}`))
