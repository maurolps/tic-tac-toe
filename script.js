const Gameboard = (() => {
  const gameBoard = [
  ['', '' , ''],
  ['', '' , ''],
  ['', '' , ''],
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

  const resetBoard = () => {
    gameBoard.forEach((row,x) => {
      row.forEach((column,y) => {
        gameBoard[x][y] = "";
      })
    })
  }

  const updateBoard = ( mark, x, y) => {
    gameBoard[x][y] = mark;
    if (checkWinner(mark)){
      DisplayController.updateScore(mark);
    }

  }

  return {getBoard, updateBoard, checkWinner, resetBoard};
})();

const Player = ( name, mark, color) => {
  const getName  = () => name;
  const getMark  = () => mark;
  const getColor = () => color;

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
        gameBoard[x][y] = "";
        return move;
      }

      // check defensive move
      gameBoard[x][y] = opponentMark;
      if (Gameboard.checkWinner(opponentMark)) {
        gameBoard[x][y] = "";
        return move;
      }

      // no good moves
      gameBoard[x][y] = "";
    }

    // random move
    if (emptyMoves.length > 0) {
      const randomMove = Math.floor(Math.random() * emptyMoves.length);
      return emptyMoves[randomMove];
  }

  return null;

  }

  return {getName, getMark, getColor, playNPC}
}

const GameCore = () => {
  const playerTurn = document.querySelector('.player-turn');
  const loaderImage = document.querySelector('.loader-container');
  const player1 = Player("Player1","X", "#ebf5f2");
  const player2 = Player("NPC","O", "#ee6f61");
  const gameBoard = Gameboard.getBoard();
  let npcPlaying = false;
  let gameReseting = false;
  let activePlayer = 1;

  const switchPLayer = () => {
    activePlayer === 1? activePlayer = 2: activePlayer = 1;
    if ( !gameReseting ) { playerTurn.innerHTML = "<p>Your turn!</p>" };
  }

  const npcTurn = () => {
    const npcMove = player2.playNPC(gameBoard, player1.getMark());
    
    if (npcMove != null) {
      const { x, y } = npcMove;
      npcPlaying = false;
      DisplayController.npcClick(x+""+y);

    } else {
      playerTurn.innerHTML = '<p><span class="tie">Tie!</span></p>';
      resetGame("tie");
    }
  }

  const playTurn = (e) => {
    const x = e.target.coordx;
    const y = e.target.coordy;
    let mark = gameBoard[x][y];
    let color = "#ffff";

    if (npcPlaying) {return};
    if (mark === player1.getMark() 
    || mark === player2.getMark()
    || gameReseting)  return;

    if (activePlayer === 1) { 
      mark = player1.getMark();
      color = player1.getColor();
    } else {
      mark = player2.getMark();
      color = player2.getColor();
    }

    e.target.style.color = color;
    e.target.textContent = mark;
    Gameboard.updateBoard(mark, x, y);   
    switchPLayer();
    if (activePlayer === 2) {
      playerTurn.innerHTML = "<p>NPC...</p>";
      npcPlaying = true;
      setTimeout(() => {
        npcTurn();
      }, 1000);
    }
  }

  const resetGame = (mark) => {
    activePlayer = 2;
      gameReseting = true;
      if (mark === "X"){
        playerTurn.innerHTML = '<p><span class="player-win"> You Win!!! </span></p>';
      } 
      if (mark === "O") {
        playerTurn.innerHTML = '<p><span class="npc-win"> Npc beats you </span><p>';
      }
    setTimeout(() => {
      loaderImage.classList.add('loading');
    },200)
    setTimeout(() => {
      Gameboard.resetBoard();
      DisplayController.resetDisplay();
      gameReseting = false;
      loaderImage.classList.remove('loading');
      playerTurn.innerHTML = "<p>Your Turn</p>";
    }, 3000)

  }

 return { playTurn, resetGame}
}

const DisplayController = (() => { 
  const gameBoard = Gameboard.getBoard();
  const boardContainer = document.querySelector('.board-container');
  const playerScore = document.getElementById('player-score');
  const npcScore = document.getElementById('npc-score');
  const core = GameCore();
  let pScore = 0; 
  let nScore = 0;

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
        btn.id = x+""+y;

        boardRow.appendChild(btn)
      })
      boardContainer.appendChild(boardRow);
    })
  }
  loadDisplay();

  const npcClick = (id) => {
    const npcChoice = document.getElementById(id);
    npcChoice.click();
  }

  const updateScore = (mark) => {
    if (mark === "X") {
      pScore++;
      playerScore.textContent = pScore;
    }
    if (mark === "O") {
      nScore++
      npcScore.textContent = nScore;
    }
    core.resetGame(mark);
  }

  const clickHandler = (e) => {
    if(e.target.className != "button") return;
    core.playTurn(e);
  }

  const resetDisplay = () => {
      gameBoard.forEach((row,x) => {
      row.forEach((column,y) => {
        const btn = document.getElementById(x+""+y);
        btn.textContent = column;
      })
    })
  }

  boardContainer.addEventListener("click", clickHandler);

  return {npcClick, updateScore, resetDisplay}
})();
