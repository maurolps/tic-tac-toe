const Gameboard = (() => {
  const gameBoard = [
  ["-", "-" , "-"],
  ["-", "-" , "-"],
  ["-", "-" , "-"],
  ];
  
  const getBoard = () => gameBoard;

  const checkWinner = (mark) => {
    let winner = false;
    for (i = 0; i < 3; i++) {
      // check rows
      winner = gameBoard[i].every((playerMark)=> {
        return playerMark === mark;
      });
      if (winner) { return true; }

     // check columns
      winner = gameBoard.every((playerMark)=> {
        return playerMark[i] === mark;
      });
      if (winner) { return true; }
    }

    //check diagonals
    let j = -1;
    winner = gameBoard.every((playerMark)=> {
      j++;
      return playerMark[j] === mark;
    });
    if (winner) { return true; }

    j = 3; 
    winner = gameBoard.every((playerMark)=> {
      j--;
      return playerMark[j] === mark;
    });
    if (winner) { return true; }

    return false;
    
  }

  const updateBoard = ( mark, x, y) => {
    gameBoard[x][y] = mark;
    console.log(checkWinner(mark));
  }



  return {getBoard, updateBoard, checkWinner};
})();

const Player = ( name, mark) => {
  const getName = () => name;
  const getMark = () => mark;

  const playNPC = (gameBoard, opponentMark) => {
    const emptyMoves = [];

    // all available moves
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
          if (gameBoard[i][j] !== mark && gameBoard[i][j] !== opponentMark) {
              emptyMoves.push({ x: i, y: j });
          }
      }
    }

    for (const move of emptyMoves) {
      const { x, y } = move;

      // check winner move
      gameBoard[x][y] = mark;
      if (Gameboard.checkWinner(mark)) {
        return move;
      }

      // check defensive move
      gameBoard[x][y] = opponentMark;
      if (Gameboard.checkWinner(opponentMark)) {
          return move;
      }

      // no good moves
      gameBoard[x][y] = "-";
    }

    // random move
    if (emptyMoves.length > 0) {
      const randomMove = Math.floor(Math.random() * emptyMoves.length);
      return emptyMoves[randomMove];
  }

  return null;

  }

  return {getName, getMark, playNPC}
}

const GameCore = () => {
  const playerTurn = document.querySelector('.player-turn');
  const player1 = Player("Player1","X");
  const player2 = Player("Player2","O");
  const gameBoard = Gameboard.getBoard();
  let activePlayer = 1;

  const switchPLayer = () => {
    activePlayer === 1? activePlayer = 2: activePlayer = 1;
    playerTurn.textContent = "Player: "+activePlayer;
  }

  const npcTurn = () => {
    const npcMove = player2.playNPC(gameBoard, player1.getMark());
    
    if (npcMove != null) {
      const { x, y } = npcMove;
      console.log(player2.getMark(), x, y);
      Gameboard.updateBoard(player2.getMark(), x, y);
      switchPLayer();
    } else {
      console.log("Something went wrong. NPC can't play!");
    }
  }

  const playTurn = (e) => {
    const x = e.target.coordx;
    const y = e.target.coordy;
    let mark = gameBoard[x][y];
    if (mark === player1.getMark() || mark === player2.getMark())  return;

    activePlayer === 1? mark = player1.getMark(): mark = player2.getMark();
    e.target.textContent = mark;
    Gameboard.updateBoard(mark, x, y);   
    switchPLayer();
    npcTurn();
  }

 return {playTurn}
}

const DisplayController = (() => { 
  const gameBoard = Gameboard.getBoard();
  const boardContainer = document.querySelector('.board-container');
  const core = GameCore();

  const loadDisplay = () => { 
    gameBoard.forEach((row,x) => {
      const boardRow = document.createElement('div');
      boardRow.className = "board-row";
      row.forEach((column,y) => {
        const btn = document.createElement('button');
        btn.className = "button";
        btn.textContent = column;
        btn.coordx = x; 
        btn.coordy = y;
        boardRow.appendChild(btn)
      })
      boardContainer.appendChild(boardRow);
    })
  }
  loadDisplay();

  const clickHandler = (e) => {
    if(e.target.className != "button") return;
    core.playTurn(e);
  }

  boardContainer.addEventListener("click", clickHandler);
})();
 