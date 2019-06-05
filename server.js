const express = require('express')
const http = require('http')
const socketIO = require('socket.io')
const PORT = process.env.PORT || 4001
const app = express()
const server = http.createServer(app)
const io = socketIO(server)

io.on('connection', socket => {
  console.log(`${socket.id} connected`)

  socket.on('MakeMove', data => {
    let everyone = io.sockets.adapter.rooms[data.room].sockets
    .emit('MakeMove', data.array)
  })

  socket.on('createRoom', roomName=>{
    console.log(`${socket.id} created a room: ${roomName}`)
    socket.join(roomName)
    console.log(io.sockets.adapter.rooms[roomName].sockets)
    socket.emit('newGame', roomName)
  })

  socket.on('joinRoom', roomName=>{
    console.log(`${socket.id} joined ${roomName}`)
    socket.join(roomName)
    console.log(io.sockets.adapter.rooms[roomName].sockets)
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
