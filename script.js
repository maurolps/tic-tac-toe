const Gameboard = (() => {
  const gameBoard = [
  ["-", "-" , "-"],
  ["-", "-" , "-"],
  ["-", "-" , "-"],
  ];
  
  const getBoard = () => gameBoard;

  const checkWinner = (mark) => {
    // check rows
    let winner = false;
    for (i = 0; i < 3; i++) {
      winner = gameBoard[i].every((playerMark)=> {
        return playerMark === mark;
      });
      if (winner) { 
        console.log ("winner at row " +i)
        return;
      } else { console.log("not for u " +mark)}
    }

    //check columns
    //...
    
    //check diagonals
    //...
  }

  const updateBoard = ( mark, x, y) => {
    gameBoard[x][y] = mark;
    checkWinner(mark);
  }



  return {getBoard, updateBoard, checkWinner};
})();

const Player = ( name, mark) => {
  const getName = () => name;
  const getMark = () => mark;
  return {getName, getMark}
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

  const playTurn = (e) => {
    const x = e.target.coordx;
    const y = e.target.coordy;
    let mark = gameBoard[x][y];
    if (mark === player1.getMark() || mark === player2.getMark())  return;

    activePlayer === 1? mark = player1.getMark(): mark = player2.getMark();
    e.target.textContent = mark;
    Gameboard.updateBoard(mark, x, y);   
    switchPLayer();
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
 