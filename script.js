// script.js — Morpion Dynamique 2 Joueurs avec images /assets

const $board = document.getElementById("board");
const $log = document.getElementById("log");
const $reset = document.getElementById("reset");

let board = Array(9).fill(null); // null ou [X|O, lifetime]
let gameOver = false;
let currentPlayer = "X"; // X commence

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

      // Définit le suffixe de l’image selon la durée de vie
      let suffix = "";
      if (life === 3) suffix = "50";
      else if (life === 1) suffix = "30";

      // Exemple : /assets/cross50.png ou /assets/circle.png
      img.src = `/assets/${symbol === "X" ? "cross" : "circle"}${suffix}.png`;

      btn.appendChild(img);

      if (life <= 1) {
        btn.setAttribute("data-expiring", "true");
      }
    }

    $board.appendChild(btn);
  });
}


function log(message) {
  $log.textContent = message;
}

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

function decrementBoardTimers() {
  board = board.map(cell => {
    if (cell && cell[1] > 0) {
      const newLife = cell[1] - 1;
      return newLife === 0 ? null : [cell[0], newLife];
    }
    return cell;
  });
}

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
    log(`Au tour de ${currentPlayer}`);
  }
}

function endGame(result) {
  gameOver = true;
  if (result === "draw") log("Draw !");
  else log(`${result} wins !`);
  renderBoard();
}

$reset.addEventListener("click", () => {
  board = Array(9).fill(null);
  gameOver = false;
  currentPlayer = "X";
  renderBoard();
  log("New game ! X starts.");
});

// Initialisation
renderBoard();
log("New game ! X starts.");
