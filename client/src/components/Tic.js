import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { Dimmer, Loader} from 'semantic-ui-react'
import '../App.css'

class Tic extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tic: [0,0,0,0,0,0,0,0,0],
      turnP1: true,
      GO: false,
      result: ''
    };
  }

  gameStatus = () => {
    const {tic} = this.state;
    let show = tic.map((box,index) =>{

        if(box === 1){
          return(<div key={index} onClick={()=>this.change(index)} className = {`box box${index} player1`}></div>)
        }
        else if(box === 2){
          return(<div key={index} onClick={()=>this.change(index)} className = {`box box${index} player2`}></div>)
        } else {
          return(<div key={index} onClick={()=>this.change(index)} className = {`box box${index} `}></div>)
        }

    })
    return show
  }

  socketWatch = () => {
    const {socket} = this.props;
    socket.on('MakeMove',data =>{
      this.setState({
        tic: data.array,
        turnP1: data.turn
      });
    })
    socket.on('updatePlayers', client=>{
      this.props.update(client)
    })
    socket.on('results', result => {
      this.setState({
        result: result,
        GO: true
      });
    })
  }

  change = (index) => {
    const { tic, turnP1 , GO} = this.state;
    const {socket, id, players} = this.props;

    if(turnP1 && id === players[0] && !GO){

        tic[index] = 1
        socket.emit('MakeMove',
        {
          array: tic,
          room: this.props.room,
          turn: !turnP1
        })
        this.checkWinner();
    }

    if(!turnP1 && id === players[1] && !GO){

        tic[index] = 2
        socket.emit('MakeMove',
        {
          array: tic,
          room: this.props.room,
          turn: !turnP1
        })
        this.checkWinner();
    }

  }

  checkWinner = () => {
    const { socket, room } = this.props
    let player1 = this.playerCurrentStanding(1);
    let player2 = this.playerCurrentStanding(2);

    if (player1.length == 5) {
      socket.emit('results', {
        result: 'TIE',
        room: room
      })
    }
    else if(this.Win(player1)){
      socket.emit('results', {
        result: 'PLAYER ONE',
        room: room
      })
    }
    else if(this.Win(player2)){
      socket.emit('results', {
        result: 'PLAYER TWO',
        room: room
      })
    }
  }

  Win = (player) => {
    if (player.includes(0) && player.includes(1) && player.includes(2)) {
      return true
    }
    if (player.includes(0) && player.includes(4) && player.includes(8)) {
      return true
    }
    if (player.includes(0) && player.includes(3) && player.includes(6)) {
      return true
    }
    if (player.includes(3) && player.includes(4) && player.includes(5)) {
      return true
    }
    if (player.includes(6) && player.includes(7) && player.includes(8)) {
      return true
    }
    if (player.includes(6) && player.includes(4) && player.includes(2)) {
      return true
    }
    if (player.includes(2) && player.includes(5) && player.includes(8)) {
      return true
    }
    if (player.includes(1) && player.includes(4) && player.includes(7)) {
      return true
    }
  }

  playerCurrentStanding = (who) => {
    const { tic } = this.state
    let array=[];
    tic.forEach((value,index)=>{
      if(value === who){
        array.push(index);
      }
    })
    return array
  }

  leaveRoom = () =>{
    const {socket} = this.props;
    socket.emit('leaveRoom',this.props.room);
  }

  render() {
    this.socketWatch();
    const { players, id, name} = this.props
    const { turnP1, GO, result} = this.state
    return (
      <div className="tic-js">
        <h1 className="font game-title">TIC-TAC-TOE</h1>
        <div className="tic-content-contain">
          <div className="game-info">
            <h1 className="font">{this.props.room}</h1>
            {
              (id === players[0])
                ? <h1 className ="font">PLAYER ONE : {name}</h1>
                : null
            }
            {
              (id === players[1])
                ? <h1 className ="font">PLAYER TWO : {name}</h1>
                : null
            }
            <Link to = '/'><button onClick={()=>this.leaveRoom()} className="font input-field button-style">GAME SELECT</button></Link>
          </div>
          <div className="tic-contain">
            <div className="tic-board">
              {this.gameStatus()}
              {
                (GO)
                  ? (
                    <Dimmer active inverted>
                      {
                        (result === 'TIE')
                          ? <h1 className="font result-style" > IT'S A DRAW ! ! ! </h1>
                          : <h1 className="font result-style" >{result} WINS ! ! !</h1>
                      }
                      <Link to = '/'><button onClick={()=>this.leaveRoom()} className="font input-field button-style">BACK TO LOBBY</button></Link>
                    </Dimmer>
                  )
                  :((players.length === 2)
                    ? (
                      (turnP1)
                        ? <h1 className="font">Player 1, Make your Move!</h1>
                        : <h1 className="font">Player 2, Make your Move!</h1>
                    )
                    : (
                      <Dimmer active inverted>
                        <Loader size='massive'>Waiting For Another Player . . .</Loader>
                      </Dimmer>
                    )
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
