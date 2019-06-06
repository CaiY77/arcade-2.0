import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import socketIOClient from 'socket.io-client'
import { Dimmer, Loader, Segment } from 'semantic-ui-react'
import '../App.css'

class Tic extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tic: [1,0,0,0,0,0,0,0,0],
      turnP1: true
    };
  }

  gameStatus = () => {
    const {tic} = this.state;
    let show = tic.map((box,index) =>{

        if(box === 1){
          return(<div key={index} onClick={(e)=>this.change(e)} className = "box player1"></div>)
        }
        else if(box === 2){
          return(<div key={index} onClick={(e)=>this.change(e)} className = "box player2"></div>)
        } else {
          return(<div key={index} onClick={(e)=>this.change(e)} className = "box"></div>)
        }

    })
    return show
  }

  socketWatch = () => {
    const {socket} = this.props;
    const {players} = this.props
    socket.on('MakeMove',data =>{
      console.log(data)
      this.setState({
        tic:data
      });
    })

  }

  change = (e) => {
    console.log(e.target)
    const { tic, turnP1, players } = this.state;
    const {socket} = this.props;
    // tic[0][0] = 2;
    // socket.emit('MakeMove',
    // {
    //   array: tic,
    //   room: this.props.room
    // })
  }

  leaveRoom = () =>{
    const {socket} = this.props;
    socket.emit('leaveRoom',this.props.room);
  }

  render() {
    this.socketWatch();
    const { players } = this.props
    return (
      <div className="tic-js">
        <Link to = '/'><button onClick={()=>this.leaveRoom()} className="font input-field button-style">GAME SELECT</button></Link>
        <h1 className="font game-title">TIC-TAC-TOE</h1>
        <div className="tic-content-contain">
          <div className="game-info">
            <h1 className="font">{this.props.room}</h1>
            <h1 className="font"> Player 1 : {players[0]}</h1>
            {
              (players[1])
                ? <h1 className="font"> Player 1 : {players[1]}</h1>
                : <h1 className="font">Player 2 : Waiting...</h1>
            }
          </div>
          <div className="tic-contain">
            <div className="tic-board">
              {
                (players.length == 2)
                  ? this.gameStatus()
                  : (
                    <Dimmer active inverted>
                      <Loader size='massive'>Waiting For More Players</Loader>
                    </Dimmer>
                    )
              }
              </div>
          </div>
          <div className="possible-chat">
          </div>
        </div>
      </div>
    );
  }

}

export default Tic;
