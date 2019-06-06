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
      game: false
    } ;
  }
  toggleGame = () =>{
    this.setState({
      game: true
    });
  }

  handleChanges = (event)=>{
    const element = event.target
    const name = element.name
    const value = element.value
    this.setState({[name]: value})
  }

  makeGame = () => {
    const { socket, name, game } = this.state

    if(name != '' && game){
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
    const { socket, room, game, name } = this.state;
    
    if(name != '' && game && room != ''){
      socket.emit('joinRoom', room )
    }
  }

  render() {
    const {socket, room} = this.state

    return (
      <div className="app-contain">
        <Route exact path="/" render={()=><GameForm toggle={this.toggleGame} join={this.joinGame} sub = {this.makeGame} change={this.handleChanges}/> }/>
        <Route path = "/tic-tac-toe" render={()=> <Tic socket ={this.state.socket} name= {this.state.name} room = {this.state.room}/>}/>

      </div>
    );
  }

}

export default App;
