import React, { Component } from 'react';
import '../App.css'
import socketIOClient from 'socket.io-client'

class Tic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: socketIOClient("localhost:4001"),
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
          return(<div className = "box one"></div>)
        }
        else if(col===2){
          return(<div className = "box two"></div>)
        } else {
          return(<div className = "box empty"></div>)
        }
      })
    })
    return show
  }

  change = () => {
    console.log("changing")
    const {socket,tic} = this.state;
    tic[0][0] = 2;
    socket.emit('MakeMove',
    {
      array: tic,
      room: this.props.room
    })
  }

  render() {
    const {socket} = this.state;
    socket.on('MakeMove',data =>{
      console.log(data)
      this.setState({
        tic:data
      });
    })

    console.log(this.state.tic)
    return (
      <div className="main-contain">
        {this.props.name}
        {this.props.room}
        <br/>
        {this.gameStatus()}
        <button onClick={()=>{this.change()}}>Testing</button>
      </div>
    );
  }

}

export default Tic;
