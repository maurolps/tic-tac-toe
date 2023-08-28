const Gameboard = (() => {
  const gameBoard = [
  ["-", "-" , "-"],
  ["-", "-" , "-"],
  ["-", "-" , "-"],
  ];
  return {gameBoard};
})();

const Player = ( name, mark) => {
  const playerTurn = document.querySelector('.player-turn');
  const getName = () => name;
  const getMark = () => mark;
  let playerIndex = 1;

  const switchPLayer = () => {
    console.log(playerIndex);
    playerIndex === 1? playerIndex = 2: playerIndex = 1;
    playerTurn.textContent = "Player: "+playerIndex;
  }

  return {getName, getMark, switchPLayer}
}

const GameCore = () => {
  const player1 = Player("Player1","X");
  const player2 = Player("Player2","O");

  const playTurn = (e) => {
    // console.log(e.target);
    console.log(player1.getName());
    player1.switchPLayer();
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

