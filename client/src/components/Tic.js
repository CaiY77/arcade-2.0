import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import '../App.css'
import socketIOClient from 'socket.io-client'

class Tic extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tic: [
      [1,0,0],
      [0,2,0],
      [0,0,0]
      ]
    };
  }

  gameStatus = () => {
    const {tic} = this.state;
    let show = tic.map(row =>{
      return row.map(col =>{
        if(col===1){
          return(<div className = "box player1"></div>)
        }
        else if(col===2){
          return(<div className = "box player2"></div>)
        } else {
          return(<div className = "box"></div>)
        }
      })
    })
    return show
  }

  socketWatch = () => {
    const {socket} = this.props;
    socket.on('MakeMove',data =>{
      console.log(data)
      this.setState({
        tic:data
      });
    })
  }
  change = () => {
    console.log("changing")
    const {tic} = this.state;
    const {socket} = this.props;
    tic[0][0] = 2;
    socket.emit('MakeMove',
    {
      array: tic,
      room: this.props.room
    })
  }

  render() {
    this.socketWatch();
    console.log(this.state.tic)
    return (
      <div className="tic-js">
        <h1 className="font game-title">TIC-TAC-TOE</h1>
        <div className="tic-content-contain">
          <div className="game-info">
            <h1 className="font">{this.props.name}</h1>
            <h1 className="font">{this.props.room}</h1>
          </div>
          <div className="tic-contain">
            <div class="tic-board">
              {this.gameStatus()}
            </div>
          </div>
          <div className="possible-chat">
            <button onClick={()=>{this.change()}}>Testing</button>
          </div>
        </div>
      </div>
    );
  }

}

export default Tic;
