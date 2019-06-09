import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { Form } from 'semantic-ui-react'
import '../App.css'

class Connect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chat:[],
      say: '',
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
    socket.on('say', chat =>{
      this.setState({
        chat: chat
      });
    })
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

  render() {
    // this.socketWatch();
    const { players, id, name, room} = this.props
    const {say, chat} = this.state
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
