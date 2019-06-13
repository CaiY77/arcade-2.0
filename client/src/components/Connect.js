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
      ],
      PA: true
    };
    const {socket} = this.props
    socket.on('say', chat =>{
      this.setState({
        chat: chat
      });
    })
    socket.on('MakeMove',data =>{
      this.setState({
        board: data.array,
        turnP1: data.turn
      });
    })

    socket.on('updatePlayers', client=>{
      this.props.update(client)
    })
    socket.on('results', data => {
      this.setState({
        result: data.result,
        GO: true,
        PA: data.PA
      });
    })
    socket.on('resetGame', data=>{
      this.setState({
        result: data.result,
        GO: data.GO,
        board: data.board
      });
    })

  }
  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  }

  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
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

  change = (row,col) => {
    const { board, turnP1 , GO} = this.state;
    const {socket, id, players, room} = this.props;

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
    if(this.checkWinner(1)){
      socket.emit('results', {
        result: 'PLAYER ONE WINS ! ! !',
        room: room,
        PA: true
      })
    }
    }

    if(!turnP1 && id === players[1] && !GO){
      for(let i = 5; i >= 0 ; i--){
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
        if(this.checkWinner(2)){
          socket.emit('results', {
            result: 'PLAYER TWO WINS ! ! !',
            room: room,
            PA: true
          })
        }
        if(this.isTie()){
          socket.emit('results', {
            result: 'TIE',
            room: room,
            PA: true
          })
        }
    }

  }

  isTie = () => {
    const { board } = this.state;
    let counter = 0;

    board.forEach(row =>{
      row.forEach(col =>{
        if(col === 2){
          counter++;
        }
      })
    })

    if (counter === 21){
      return true;
    }

    return false
  }

  checkWinner = (player) => {
    const {board} = this.state

    //horizontal
    for (let c=0; c < (board[0].length - 3); c++) {
      for (let r=0; r < board.length; r++) {
        if (board[r][c] === player && board[r][c+1] === player && board[r][c+2] === player && board[r][c+3] === player) {
          return true
        }
      }
    }
    //vertical
    for (let c=0; c < board[0].length; c++) {
      for (let r=0; r < (board.length - 3); r++) {
        if (board[r][c] === player && board[r+1][c] === player && board[r+2][c] === player && board[r+3][c] === player) {
          return true
        }
      }
    }
    // diagonal down
    for (let c=0; c < (board[0].length - 3); c++) {
      for (let r=0; r < (board.length - 3); r++) {
        if (board[r][c] === player && board[r+1][c+1] === player && board[r+2][c+2] === player && board[r+3][c+3] === player) {
          return true
        }
      }
    }
    // diagonal up
    for (let c=0; c < (board[0].length - 3); c++) {
      for (let r=3; r < board.length; r++) {
        if (board[r][c] === player && board[r-1][c+1] === player && board[r-2][c+2] === player && board[r-3][c+3] === player) {
          return true
        }
      }
    }
    return false
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

  resetGame = () => {
    const { socket, room} = this.props
    socket.emit('resetGame',{
      board:[
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0]
      ],
      result: '',
      GO: false,
      room : room
    })
  }

  leaveRoom = () => {
    const {socket} = this.props;
    socket.emit('leaveRoom',this.props.room)
    socket.emit('results', {
      result: 'YOUR OPPONENT HAS FLEED :(',
      room: room,
      PA: false
    })
  }

  render() {
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
                        : <h1 className="font result-style" >{result}</h1>
                    }
                    <Link to = '/'><button onClick={()=>{this.leaveRoom();this.props.leave()}} className="font input-field button-style">BACK TO LOBBY</button></Link>
                    {
                      (PA)
                        ?<button onClick={()=>this.resetGame()} className="font input-field button-style">PLAY AGAIN</button>
                        :null
                    }                  </Dimmer>
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
                <div style={{ float:"left", clear: "both" }}
                  ref={(el) => { this.messagesEnd = el; }}>
                </div>
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
