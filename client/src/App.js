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
      err: '',
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

    if(name != '' && game != ''){
      const roomName = Math.floor(Math.random()*10000)
      socket.emit("createRoom", roomName)
      socket.on("newGame", roomName=>{
        console.log(roomName)
        this.setState({
          room: roomName
        });
      })
    }
  }

  joinGame=()=>{
    const { socket, room, game, name, err } = this.state;

    if(name != '' && game != '' && room != ''){
      console.log('in')
      socket.emit('joinRoom', room )
      socket.on("msg", msg=>{
        this.setState({
          err: msg.message,
          clear: msg.clear
        });
      })
    }
  }


  render() {
    const {socket, room, err} = this.state

    return (
      <div className="app-contain">
        <Route exact path="/" render={()=><GameForm game={this.state.game} clear={this.state.clear} err={err} handleGame={this.handleGame} join={this.joinGame} sub = {this.makeGame} change={this.handleChanges}/> }/>
        <Route path = "/tic-tac-toe" render={()=> <Tic socket ={this.state.socket} name= {this.state.name} room = {this.state.room}/>}/>
      </div>
    );
  }

}

export default App;
