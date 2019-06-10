# Doodle Arcade

Welcome to my Doodle Arcade! This application is a throw back to the games that we use to scribble on our notebooks on our spare. What makes this application special compared to the previous arcade I created is the ability to play on as many computers as possible. It also allows for multiple rooms and multiple games to happen on multiple pages at once. Doodle Arcade also uses many cases of conditional rendering to meet all the different possible stages of the game, wether you're waiting for additional players, win status, ties, and reset. 

## React

Doodle Arcade is a full-stack React application that uses JSX/JS/ES, HTML, CSS, and Express. This application also takes advantage of some external libraries such as:

* # Socket.io | Socket.io-client
* React-Router-Dom
* Semantic-UI-React

## Minimum Viable Product

* A single game, tic-tac-toe that can be played on multiple devices through socket.

## Sneak Peak
```JSX
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
      result: 'PLAYER ONE',
      room: room
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
          result: 'PLAYER TWO',
          room: room
        })
      }
      if(this.isTie()){
        socket.emit('results', {
          result: 'TIE',
          room: room
        })
      }
  }
}
```

## Additional features

* Additional games such as Connect Four ( and more to come )
* Allow the creation of multiple rooms and have multiple games at once
* Include a in-game chat that is specific to that room

## WireFrames

<img width="843" alt="Screen Shot 2019-06-07 at 12 42 38 AM" src="https://user-images.githubusercontent.com/33525692/59082327-8bad4e80-88c0-11e9-876b-5c8d6c64a691.png">

<img width="833" alt="Screen Shot 2019-06-07 at 12 40 58 AM" src="https://user-images.githubusercontent.com/33525692/59082328-8d771200-88c0-11e9-9e51-f0150c04f4e3.png">

## Socket.io Diagram

<img width="832" alt="Screen Shot 2019-06-07 at 12 55 04 AM" src="https://user-images.githubusercontent.com/33525692/59082354-ae3f6780-88c0-11e9-970a-e94e567ca235.png">

## Component Hierarchy

<img width="682" alt="Screen Shot 2019-06-07 at 12 37 10 AM" src="https://user-images.githubusercontent.com/33525692/59082376-d038ea00-88c0-11e9-8165-dec483140471.png">

## GameFrom: Create || Join

<img width="1440" alt="Screen Shot 2019-06-07 at 12 57 01 AM" src="https://user-images.githubusercontent.com/33525692/59082406-f52d5d00-88c0-11e9-9c33-8a9b432a463e.png">

## Loading

<img width="1440" alt="Screen Shot 2019-06-07 at 12 58 39 AM" src="https://user-images.githubusercontent.com/33525692/59082422-04140f80-88c1-11e9-925d-1365f01f49da.png">

## Start

<img width="1440" alt="Screen Shot 2019-06-07 at 12 59 18 AM" src="https://user-images.githubusercontent.com/33525692/59082450-27d75580-88c1-11e9-89c6-2addd60e3950.png">

## Chat Feature w/ Socket.io

<img width="1440" alt="Screen Shot 2019-06-07 at 1 02 59 AM" src="https://user-images.githubusercontent.com/33525692/59082481-4b020500-88c1-11e9-9f2c-62febc71f629.png">

## Win Conditions


<img width="1440" alt="Screen Shot 2019-06-07 at 12 59 50 AM" src="https://user-images.githubusercontent.com/33525692/59082496-6240f280-88c1-11e9-9dca-dece455dc00e.png">

<img width="1440" alt="Screen Shot 2019-06-07 at 1 03 45 AM" src="https://user-images.githubusercontent.com/33525692/59082498-640ab600-88c1-11e9-847f-bfcf85006445.png">
