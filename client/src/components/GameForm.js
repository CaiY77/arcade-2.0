import React, { Component } from 'react';
import { Form, Divider,Segment,Grid } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import '../App.css'

const GameOptions = [
  {
    key: 1,
    value: "tic-tac-toe",
    text: 'Tic-Tac-Toe'
  },
  {
    key: 2,
    value: "connect-four",
    text: 'Connect Four'
  }
]

class GameForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      join: false,
      make: false
    };
  }

  handleMake = () =>{
    this.setState({
      make: true,
      join: false
    });
  }
  handleJoin = () =>{
    this.setState({
      make: false,
      join: true
    });
  }

  render() {
    const {join , make} = this.state;

    return (<div className="form-contain">
      <h1 className="font app-title">DODDLE ARCADE</h1>

      <div className="sizing">
        {
          (join === false && make === false)
            ? (<div><button className="font input-field button-style" onClick={()=>this.handleMake()}>CREATE A ROOM</button>
              <button className="font input-field button-style" onClick={()=>this.handleJoin()}>JOIN A GAME</button></div>)
            : null
        }
        {
          (make === true)
            ?(<Form>
              <Form.Field>
                <label className="font label-style">ENTER YOUR NAME</label>
                <input type="text" className="input-field" onChange={this.props.change} name="name"/>
              </Form.Field>
              <Form.Field>
                <label className="font label-style">SELECT A GAME</label>
                <Form.Select onChange={(e, {value}) => this.props.handleGame(value)} options={GameOptions} name="game" placeholder='I want to play...'/>
              </Form.Field>
              <Link to={`/${this.props.game}`}><button className="font input-field button-style" onClick={()=>this.props.sub()} type='submit'>CREATE GAME!</button></Link>
              <button className="font input-field button-style" onClick={()=>this.handleJoin()}>JOIN A GAME</button>
            </Form>)
            : null
        }
        {
          (join === true)
            ? (<Form>
              <Form.Field>
                <label className="font label-style">ENTER YOUR NAME</label>
                <input type="text" className="input-field" onChange={this.props.change} name="name"/>
              </Form.Field>
              <Form.Field>
                <label className="font label-style">ENTER ROOM CODE</label>
                <input type="number" className="input-field" onChange={this.props.change} name="room"/>
              </Form.Field>
              <Form.Field>
                <label className="font label-style">SELECT A GAME</label>
                <Form.Select onChange={(e, {value}) => this.props.handleGame(value)} options={GameOptions} name="game" placeholder='I want to play...' />
              </Form.Field>
              {
                (this.props.clear)
                  ? <Link to={`/${this.props.game}`}><button className="font input-field button-style">JOIN GAME!</button></Link>
                  : <button className="font input-field button-style" onClick={()=>this.props.join()} type='submit'>CHECK</button>

              }
              <button className="font input-field button-style" onClick={()=>this.handleMake()}>CREATE A ROOM</button>
            </Form>)
            : null
        }

      </div>

      <h1 className="font error-form">{this.props.message}</h1>


    </div>);
  }

}

export default GameForm;
