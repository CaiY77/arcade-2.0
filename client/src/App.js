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
      room:''
    } ;
  }

  handleChanges = (event)=>{
    const element = event.target
    const name = element.name
    const value = element.value
    this.setState({[name]: value})
  }

  makeGame = () => {
    const {socket} = this.state
    const roomName = Math.floor(Math.random()*10000)
    console.log(roomName)
    socket.emit("createRoom", roomName)

    socket.on("newGame", roomName=>{
      console.log(roomName)
      this.setState({
        room: roomName
      });
    })
  }

  joinGame=()=>{
    const {socket,room} = this.state;
    socket.emit('joinRoom', room )
  }

  render() {
    const {socket, room} = this.state

    return (
      <div className="app-contain">
        <Route exact path="/" render={()=><GameForm join={this.joinGame} sub = {this.makeGame} change={this.handleChanges}/> }/>
        <Route path = "/tic-tac-toe" render={()=> <Tic name= {this.state.name} room = {this.state.room}/>}/>

      </div>
    );
  }

}

export default App;
