import React, { Component } from 'react';
import {Route} from 'react-router-dom'
import socketIOClient from 'socket.io-client'
import GameForm from './components/GameForm'
import Tic from './components/Tic'
import Connect from './components/Connect'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: socketIOClient("localhost:4001"),
      socketID:'',
      name:'',
      room:'',
      game: '',
      players: [],
      message: '',
      clear: false
    } ;
  }

  handleLeave =()=>{
    this.setState({
      message: [],
      clear: false
    });
  }

  handleChanges = (event)=>{
    const element = event.target
    const name = element.name
    const value = element.value
    this.setState({[name]: value})
  }

  handleGame=(value)=>{
    this.setState({
      game: value
    })
  }

  makeGame = () => {
    const { socket, name, game } = this.state

    if(name !== '' && game !== ''){
      const roomName = Math.floor(Math.random()*10000)
      socket.emit("createRoom", {
        room: roomName,
        who: name
      })
      socket.on("newGame", data=>{
        this.setState({
          room: data.room,
          players: data.players,
          socketID: socket.id
        });
      })
    }

  }

  joinGame=()=>{
    const { socket, room, game, name } = this.state;

    if(name !== '' && game !== '' && room !== ''){
      console.log('in')
      socket.emit('joinRoom', {
        room: room,
        who: name
      })

      socket.on("msg", msg=>{
        this.setState({
          message: msg.message,
          clear: msg.clear,
          players: msg.players,
          socketID: socket.id
        });
      })
    }
  }

  updatePlayers=(people)=>{
    this.setState({
      players: people
    });
  }

  render() {
  const {socket, room, message, players, name, socketID, game, clear} = this.state

    return (
      <div className="app-contain">

        <Route exact path="/" render={()=>
          <GameForm
            game={game}
            clear={clear}
            message={message}
            handleGame={this.handleGame}
            join={this.joinGame}
            sub={this.makeGame}
            change={this.handleChanges}
          />
        }/>

        <Route path = "/tic-tac-toe" render={()=>
          <Tic
            update={this.updatePlayers}
            players= {players}
            socket ={socket}
            id={socketID}
            name= {name}
            room = {room}
            leave={this.handleLeave}
          />
        }/>

        <Route path = "/connect-four" render={()=>
          <Connect
            update={this.updatePlayers}
            players= {players}
            socket ={socket}
            id={socketID}
            name= {name}
            room = {room}
            leave={this.handleLeave}
          />
        }/>
      </div>
    );
  }

}

export default App;
