import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { Form, Dimmer,Loader } from 'semantic-ui-react'
import '../App.css'

class Connect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chat:[],
      say: '',
      turnP1: true,
      GO: false,
      result: '',
      board:[
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0]
      ]
    };
  }
  gameStatus = () => {
    const {board} = this.state;
    let show = board.map((row,rindex) =>{

        return row.map((col,cindex)=>{
          if(col === 1){
            return(<div key={Math.random()} onClick={()=>this.change(rindex,cindex)} className = {`piece piece1`}></div>)
          }
          else if(col === 2){
            return(<div key={Math.random()} onClick={()=>this.change(rindex,cindex)} className = {`piece piece2`}></div>)
          } else {
            return(<div key={Math.random()} onClick={()=>this.change(rindex,cindex)} className = {`piece `}></div>)
          }
        })

    })
    return show
  }

  socketWatch = () => {
    const {socket} = this.props;

    socket.on('MakeMove',data =>{
      this.setState({
        board: data.array,
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
    socket.on('say', chat =>{
      this.setState({
        chat: chat
      });
    })
  }

  change = (row,col) => {
    const { board, turnP1 , GO} = this.state;
    const {socket, id, players,name} = this.props;

    if(turnP1 && id === players[0] && !GO){
      for(let i = 5; i >= 0 ; i--){
        if(board[i][col]===0){
          board[i][col]= 1;
          break;
        }
      }
    socket.emit('MakeMove',
    {
      array: board,
      room: this.props.room,
      turn: !turnP1
    })
    this.checkWinner();
    }

    if(!turnP1 && id === players[1] && !GO){
      for(let i = 5; i >= 0 ; i--){
        console.log(board[i][col])
        if(board[i][col]===0){
          board[i][col]= 2;
          break;
        }
      }
        socket.emit('MakeMove',
        {
          array: board,
          room: this.props.room,
          turn: !turnP1
        })
        this.checkWinner();
    }

  }

  checkWinner = () => {
    console.log('checking..')
  }

  showMessage = () => {
    const {chat} = this.state
    let array = chat.map(msg =>{
      return (<div className="msg-pair">
        <p className="font who"><span className={(msg.key) ? "redTxt" : "blueTxt"}>{msg.who}</span> says: </p>
        <p className="font what">{msg.what}</p>
      </div>)
    })
    return array
  }

  handleSay = (e) =>{
    this.setState({
      say: e.target.value
    });
  }

  saySomething = () => {
    const {say, chat} = this.state
    const {socket, name, room, id, players} = this.props
    let msg = {
      who: name,
      what: say,
      key: (id === players[0]) ? true : false
    }
    chat.push(msg);
    socket.emit('say', {
      chat: chat,
      room: room
    })
    this.setState({
      say: ''
    });
  }

  leaveRoom = () =>{
    const {socket} = this.props;
    socket.emit('leaveRoom',this.props.room);
  }

  render() {
    this.socketWatch();
    const { players, id, name, room} = this.props
    const {say, chat, turnP1, GO, result} = this.state
    return (
      <div>
        <h1 className="font game-title">CONNECT FOUR</h1>
        <div className="game-content-contain">
          <div className="game-info">
            <h1 className="font room">ROOM NUMBER</h1>
            <h1 className="font room-num">{room}</h1>
            {
              (id === players[0])
                ? (<div>
                  <h1 className ="font player"> YOU ARE PLAYER ONE </h1>
                  <h1 className="font name">{name}</h1>
                </div>)
                : null
            }
            {
              (id === players[1])
                ? (<div>
                  <h1 className ="font player"> YOU ARE PLAYER TWO </h1>
                  <h1 className="font name">{name}</h1>
                </div>)
                : null
            }
            <div className="leave-button">
              <Link to = '/'><button onClick={()=>{this.leaveRoom();this.props.leave()}} className="font input-field button-style">Leave Game</button></Link>
            </div>
          </div>

          <div className="game-space-contain">
            <div className="connect-board">
              {this.gameStatus()}
            </div>
            {
              (GO)
                ? (
                  <Dimmer active inverted>
                    {
                      (result === 'TIE')
                        ? <h1 className="font result-style" > IT'S A DRAW ! ! ! </h1>
                        : <h1 className="font result-style" >{result} WINS ! ! !</h1>
                    }
                    <Link to = '/'><button onClick={()=>{this.leaveRoom();this.props.leave()}} className="font input-field button-style">BACK TO LOBBY</button></Link>
                  </Dimmer>
                )
                :((players.length === 2)
                  ? (
                    (turnP1)
                      ? <h1 className="font turn">Player 1! Please Make your Move!</h1>
                      : <h1 className="font turn">Player 2! Please Make your Move!</h1>
                  )
                  : (
                    <Dimmer active inverted>
                      <Loader size='massive'>Waiting For Another Player . . .</Loader>
                      <Link to = '/'><button onClick={()=>{this.leaveRoom();this.props.leave()}} className="font input-field button-style cancel-button">CANCEL</button></Link>
                    </Dimmer>
                  )
                )
            }
          </div>

          <div className="chat">
            <div className="chat-box">
              <h1 className="font chat-style">CHAT ROOM</h1>
              <div className='messages'>
                {this.showMessage()}
              </div>
            </div>
            <Form onSubmit={()=>this.saySomething()}>
              <input value={say} onChange={this.handleSay} className="say" type="text"/>
            </Form>

          </div>

        </div>
      </div>
    );
  }

}

export default Connect;
