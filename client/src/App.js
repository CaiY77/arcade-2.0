import React, { Component } from 'react';
import { Button, Form } from 'semantic-ui-react'
const GameOptions = [
  {
    key: 1,
    value: "tic",
    text: 'Tic-Tac-Toe'
  }
]
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      game: ""
    } ;
  }
  handleGame=(value)=>{
    this.setState({
      game: value
    })
  }
  handleChanges =(event)=>{
    const element = event.target
    const name = element.name
    const value = element.value
    this.setState({[name]: value})
  }
  
  render() {
    return (
      <div>
        <Form>
          <Form.Field>
            <label>Enter your name</label>
            <input onChange={this.handleChanges} placeholder="Enter a Funny Word" />
          </Form.Field>
          <Form.Field>
            <label>Select a Game</label>
            <Form.Select onChange={(e, {value}) => this.handleGame(value)} options={GameOptions} name="game" placeholder='I Want to play...' />
          </Form.Field>
          <Button type='submit'>Create Game!</Button>
        </Form>
      </div>
    );
  }

}

export default App;
