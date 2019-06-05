import React, { Component } from 'react';
import { Button, Form, Divider,Segment,Grid } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import '../App.css'

const GameOptions = [
  {
    key: 1,
    value: "tic-tac-toe",
    text: 'Tic-Tac-Toe'
  }
]

class GameForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      game:''
    };
  }
  handleGame=(value)=>{
    this.setState({
      game: value
    })
  }

  render() {
    return (<div>
      <Segment>
        <Grid columns={2} relaxed='very'>
          <Grid.Column>
            <Form>
              <Form.Field>
                <label>Enter your name</label>
                <input onChange={this.props.change} name="name"placeholder="Enter a Funny Word" />
              </Form.Field>
              <Form.Field>
                <label>Select a Game</label>
                <Form.Select onChange={(e, {value}) => this.handleGame(value)} options={GameOptions} name="game" placeholder='I Want to play...' />
              </Form.Field>
              <Link to={`/${this.state.game}`}><Button onClick={()=>this.props.sub()} type='submit'>Create Game!</Button></Link>
            </Form>
          </Grid.Column>
          <Grid.Column>
            <Form>
              <Form.Field>
                <label>Enter your name</label>
                <input onChange={this.props.change} name="name" placeholder="Enter a Funny Word" />
              </Form.Field>
              <Form.Field>
                <label>Enter Room Code</label>
                <input onChange={this.props.change} name="room" placeholder="Enter Room Code" />
              </Form.Field>
              <Form.Field>
                <label>Select a Game</label>
                <Form.Select onChange={(e, {value}) => this.handleGame(value)} options={GameOptions} name="game" placeholder='I Want to play...' />
              </Form.Field>
              <Link to={`/${this.state.game}`}><Button onClick={()=>this.props.join()} type='submit'>Join Game!</Button></Link>
            </Form>
          </Grid.Column>
        </Grid>
        <Divider vertical>OR</Divider>
      </Segment>
    </div>);
  }

}

export default GameForm;
