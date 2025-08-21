const $board = document.getElementById("board");
const $log = document.getElementById("log");
const $reset = document.getElementById("reset");

let board = Array(9).fill(null);
let gameOver = false;
let currentPlayer = "X";

/**
 * Renders the entire game board with current state and visual styles.
 * @param {void}
 * @returns {void}
 * @example
 * renderBoard();
 */
function renderBoard() {
  $board.innerHTML = "";
  board.forEach((val, i) => {
    const btn = document.createElement("button");
    btn.className = "cell";
    btn.disabled = !!val || gameOver;
    btn.onclick = () => playerMove(i);

    if (val) {
      const [symbol, life] = val;
      const img = document.createElement("img");
      img.alt = symbol;
      img.className = "piece";

      let suffix = "";
      if (life === 3) suffix = "50";
      else if (life === 1) suffix = "30";

      img.src = `/assets/${symbol === "X" ? "cross" : "circle"}${suffix}.png`;
      btn.appendChild(img);

      if (life <= 1) {
        btn.setAttribute("data-expiring", "true");
      }
    }

    $board.appendChild(btn);
  });
}

/**
 * Displays a message in the log area.
 * @param {string} message - Message to display.
 * @returns {void}
 * @example
 * log("X wins!");
 */
function log(message) {
  $log.textContent = message;
}

/**
 * Checks the board to determine if a player has won or if it's a draw.
 * @param {Array} b - The current board array.
 * @returns {string|null} - Returns 'X', 'O', 'draw', or null.
 * @example
 * const result = checkWinner(board);
 */
function checkWinner(b) {
  const flat = b.map(cell => (cell ? cell[0] : null));
  const lines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for (const [a, b2, c] of lines) {
    if (flat[a] && flat[a] === flat[b2] && flat[a] === flat[c]) {
      return flat[a];
    }
  }
  return flat.every(x => x) ? "draw" : null;
}

/**
 * Decrements lifetime counters for all cells on the board.
 * Removes any that reach 0.
 * @param {void}
 * @returns {void}
 * @example
 * decrementBoardTimers();
 */
function decrementBoardTimers() {
  board = board.map(cell => {
    if (cell && cell[1] > 0) {
      const newLife = cell[1] - 1;
      return newLife === 0 ? null : [cell[0], newLife];
    }
    return cell;
  });
}

/**
 * Processes a move for the current player at a given index.
 * @param {number} i - Index of the board to place the move.
 * @returns {void}
 * @example
 * playerMove(4);
 */
function playerMove(i) {
  if (gameOver || board[i]) return;

  decrementBoardTimers();
  board[i] = [currentPlayer, 5];
  const result = checkWinner(board);

  renderBoard();

  if (result) {
    endGame(result);
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    log(`Turn: ${currentPlayer}`);
  }
}

/**
 * Ends the current game and displays the result.
 * @param {string} result - 'X', 'O' or 'draw'
 * @returns {void}
 * @example
 * endGame("draw");
 */
function endGame(result) {
  gameOver = true;
  if (result === "draw") log("Draw!");
  else log(`${result} wins!`);
  renderBoard();
}

/**
 * Resets the game state to start a new match.
 * @param {void}
 * @returns {void}
 * @example
 * $reset.click();
 */
$reset.addEventListener("click", () => {
  board = Array(9).fill(null);
  gameOver = false;
  currentPlayer = "X";
  renderBoard();
  log("New game! X starts.");
});

renderBoard();
log("New game! X starts.");
