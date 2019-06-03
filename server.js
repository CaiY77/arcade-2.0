const express = require('express')
const http = require('http')
const socketIO = require('socket.io')
const PORT = process.env.PORT || 4001
const app = express()
const server = http.createServer(app)

// This creates our socket using the instance of the server
const io = socketIO(server)

// This is what the socket.io syntax is like, we will work this later
io.on('connection', socket => {
  console.log('User connected')

  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})

server.listen(PORT, () => console.log(`Arcade listening on port ${PORT}`))
