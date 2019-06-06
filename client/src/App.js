import React, { Component } from 'react';
import {Route} from 'react-router-dom'
import socketIOClient from 'socket.io-client'
import Tic from './components/Tic'
import GameForm from './components/GameForm'


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: socketIOClient("localhost:4001"),
      name:'',
      room:'',
      game: '',
      players: [],
      message: '',
      clear: false
    } ;
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
          room: data.room
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
          clear: msg.clear
        });
      })
    }
  }


  render() {
    const {socket, room, message, players} = this.state
    return (
      <div className="app-contain">
        <Route exact path="/" render={()=><GameForm game={this.state.game} clear={this.state.clear} message={message} handleGame={this.handleGame} join={this.joinGame} sub = {this.makeGame} change={this.handleChanges}/> }/>
        <Route path = "/tic-tac-toe" render={()=> <Tic players= {players} socket ={this.state.socket} name= {this.state.name} room = {this.state.room}/>}/>
      </div>
    );
  }

}

export default App;
