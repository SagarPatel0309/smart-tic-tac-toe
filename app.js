const PLAYER_X = 'X';
const PLAYER_O = 'O';

let currentPlayer = PLAYER_X;
let board = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let gameMode = 'user-vs-user';  // Default mode is User vs User

const gameBoard = document.getElementById('game-board');
const resetButton = document.getElementById('reset-button');
const userVsUserButton = document.getElementById('user-vs-user');
const systemVsUserButton = document.getElementById('system-vs-user');
const gameResult = document.getElementById('game-result');

function initGameBoard() {
  gameBoard.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.setAttribute('data-index', i);
    cell.addEventListener('click', handleCellClick);
    gameBoard.appendChild(cell);
  }
  gameResult.textContent = ''; // Clear the result message when restarting the game
  gameResult.classList.remove('win', 'draw');  // Reset result styles
}

function handleCellClick(event) {
  const index = event.target.getAttribute('data-index');
  if (board[index] !== '' || !gameActive) return;

  board[index] = currentPlayer;
  event.target.textContent = currentPlayer;
  event.target.classList.add(currentPlayer);

  if (checkWinner(currentPlayer)) {
    gameActive = false;
    highlightWinningCells(currentPlayer);
    showGameResult(`${currentPlayer} wins!`, 'win');
    return;
  }

  if (!board.includes('')) {
    gameActive = false;
    showGameResult("It's a draw!", 'draw');
    return;
  }

  if (gameMode === 'system-vs-user' && currentPlayer === PLAYER_X) {
    currentPlayer = PLAYER_O;
    setTimeout(systemMove, 500);  // Wait for 500ms to simulate a delay
  } else {
    currentPlayer = currentPlayer === PLAYER_X ? PLAYER_O : PLAYER_X;
  }
}

function systemMove() {
  let bestMove = minimax(board, PLAYER_O);
  const cell = gameBoard.children[bestMove.index];
  board[bestMove.index] = PLAYER_O;
  cell.textContent = PLAYER_O;
  cell.classList.add('O');

  if (checkWinner(PLAYER_O)) {
    gameActive = false;
    highlightWinningCells(PLAYER_O);
    showGameResult(`${PLAYER_O} wins!`, 'win');
    return;
  }

  currentPlayer = PLAYER_X;
}

function minimax(board, player) {
  const availableCells = board.map((value, index) => value === '' ? index : -1).filter(index => index !== -1);

  if (checkWinner(PLAYER_X)) return { score: -10 };
  if (checkWinner(PLAYER_O)) return { score: 10 };
  if (availableCells.length === 0) return { score: 0 };

  const moves = [];

  availableCells.forEach(index => {
    const move = { index: index };
    board[index] = player;

    if (player === PLAYER_O) {
      const result = minimax(board, PLAYER_X);
      move.score = result.score;
    } else {
      const result = minimax(board, PLAYER_O);
      move.score = result.score;
    }

    board[index] = '';  
    moves.push(move);
  });

  if (player === PLAYER_O) {
    return moves.reduce((bestMove, move) => move.score > bestMove.score ? move : bestMove);
  } else {
    return moves.reduce((bestMove, move) => move.score < bestMove.score ? move : bestMove);
  }
}

function checkWinner(player) {
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  return winningCombinations.some(combination => {
    return combination.every(index => board[index] === player);
  });
}

function highlightWinningCells(player) {
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let combination of winningCombinations) {
    if (combination.every(index => board[index] === player)) {
      combination.forEach(index => {
        gameBoard.children[index].classList.add('winning-cell');
      });
    }
  }
}

function showGameResult(message, resultClass) {
  gameResult.textContent = message;
  gameResult.classList.add(resultClass);
}

function resetGame() {
  board = ['', '', '', '', '', '', '', '', ''];
  currentPlayer = PLAYER_X;
  gameActive = true;
  initGameBoard();
}

userVsUserButton.addEventListener('click', () => {
  gameMode = 'user-vs-user';
  resetGame();
});

systemVsUserButton.addEventListener('click', () => {
  gameMode = 'system-vs-user';
  resetGame();
});

resetButton.addEventListener('click', resetGame);
initGameBoard();

