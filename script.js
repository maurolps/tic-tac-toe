const Gameboard = (() => {
  const gameBoard = [
  ["-", "-" , "-"],
  ["-", "-" , "-"],
  ["-", "-" , "-"],
  ];
  return {gameBoard};
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
  let activePlayer = 1;

  const switchPLayer = () => {
    activePlayer === 1? activePlayer = 2: activePlayer = 1;
    playerTurn.textContent = "Player: "+activePlayer;
  }

  const playTurn = (e) => {
    // console.log(e.target);
    activePlayer === 1? e.target.textContent = player1.getMark(): 
                        e.target.textContent = player2.getMark();

    //gameBoard.Update
    switchPLayer();
  }



 return {playTurn}
}

const DisplayController = (() => { 
  const gameBoard = Gameboard.gameBoard;
  const boardContainer = document.querySelector('.board-container');
  const core = GameCore();

  const loadDisplay = () => {
    gameBoard.forEach((row,x) => {
      const boardRow = document.createElement('div');
      boardRow.className = "board-row";
      row.forEach((column,y) => {
        const btn = document.createElement('button');
        btn.textContent = column;
        boardRow.appendChild(btn)
      })
      boardContainer.appendChild(boardRow);
    })
  }
  loadDisplay();

  const clickHandler = (e) => {
    core.playTurn(e);
  }

  boardContainer.addEventListener("click", clickHandler);
})();

