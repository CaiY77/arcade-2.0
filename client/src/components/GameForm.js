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
    value: "another-game",
    text: 'Another Game'
  }
]

class GameForm extends Component {

  render() {
    return (<div className="form-contain">
      <h1 className="font app-title">ARCADE V2</h1>

      <div className="sizing">
        <Segment className="join-create-form">
          <Grid columns={2} relaxed='very'>
            <Grid.Column>
              <Form>
                <Form.Field>
                  <label className="font label-style">ENTER YOUR NAME</label>
                  <input type="text" className="input-field" onChange={this.props.change} name="name"/>
                </Form.Field>
                <Form.Field>
                  <label className="font label-style">SELECT A GAME</label>
                  <Form.Select onChange={(e, {value}) => this.props.handleGame(value)} options={GameOptions} name="game" placeholder='I want to play...'/>
                </Form.Field>
                <Link to={`/${this.props.game}`}><button className="font input-field button-style" onClick={()=>this.props.sub()} type='submit'>CREATE GAME!</button></Link>
              </Form>
            </Grid.Column>
            <Grid.Column>
              <Form>
                <Form.Field>
                  <label className="font label-style">ENTER YOUR NAME</label>
                  <input type="text" className="input-field" onChange={this.props.change} name="name"/>
                </Form.Field>
                <Form.Field>
                  <label className="font label-style">ENTER ROOM CODE</label>
                  <input type="text" className="input-field" onChange={this.props.change} name="room"/>
                </Form.Field>
                <Form.Field>
                  <label className="font label-style">SELECT A GAME</label>
                  <Form.Select onChange={(e, {value}) => this.props.handleGame(value)} options={GameOptions} name="game" placeholder='I want to play...' />
                </Form.Field>
                <button className="font input-field button-style" onClick={()=>this.props.join()} type='submit'>CHECK</button>
                {
                  (this.props.clear)
                    ? <Link to={`/${this.props.game}`}><button className="font input-field button-style">JOIN GAME!</button></Link>
                    : null
                }
              </Form>
            </Grid.Column>
          </Grid>
          <Divider vertical className="font label-style">OR</Divider>
        </Segment>
      </div>

      <h1 className="font error-form">{this.props.message}</h1>


    </div>);
  }

}

export default GameForm;
