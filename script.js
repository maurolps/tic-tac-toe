const Gameboard = (() => {
  const gameBoard = [
  ["X", "O" , "X"],
  ["O", "X" , "X"],
  ["O", "X" , "O"],
  ];
  return {gameBoard};
})();

const DisplayController = (() => { 
  const gameBoard = Gameboard.gameBoard;
  const boardContainer = document.querySelector('.board-container');

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

})();

