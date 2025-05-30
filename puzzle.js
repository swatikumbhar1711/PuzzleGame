const puzzle = document.getElementById("puzzle");
const moveCounter = document.getElementById("moveCounter");
const imageInput = document.getElementById("imageInput");
const difficultySelect = document.getElementById("difficulty");
const startButton = document.getElementById("startButton");


let moves = 0;
let tiles = [];
let imageUrl = '';
let gridSize = 3;

difficultySelect.addEventListener("change", () => {
  gridSize = parseInt(difficultySelect.value);
  if (imageUrl) 
  {
    createTiles();
    shuffleTiles();
  }
});

window.addEventListener("DOMContentLoaded", () => {
  const savedDifficulty = localStorage.getItem("puzzleDifficulty");
  if (savedDifficulty) 
  {
    difficultySelect.value = savedDifficulty;
    gridSize = parseInt(savedDifficulty);
  }
});

difficultySelect.addEventListener("change", () => {
  gridSize = parseInt(difficultySelect.value);
  localStorage.setItem("puzzleDifficulty", gridSize);
  if (imageUrl) 
  {
    createTiles();
    shuffleTiles();
  }
});


imageInput.addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (file && file.type.startsWith("image/")) 
  {
    const reader = new FileReader();
    reader.onload = function (event) 
    {
      imageUrl = event.target.result;
      createTiles();
      shuffleTiles();
    };
    reader.readAsDataURL(file);
  }
});

function getBestScore(size) {
  const key = `bestScore_${size}`;
  const stored = localStorage.getItem(key);
  return stored ? parseInt(stored) : null;
}

function saveBestScore(size, score) {
  const key = `bestScore_${size}`;
  const currentBest = getBestScore(size);
  if (currentBest === null || score < currentBest) {
    localStorage.setItem(key, score);
  }
}


function checkIfSolved() {
  const isSolved = [...puzzle.children].every((tile, index) => tile.dataset.index == index);
  if (isSolved) {
    saveBestScore(gridSize, moves);  
    updateMoveDisplay();              
    setTimeout(() => alert(`Congradulation Puzzle Solved in ${moves} moves!`), 100);
  }
}

function saveBestScore(size, score) {
  const key = `bestScore_${size}`;
  const currentBest = getBestScore(size);
  if (currentBest === null || score < currentBest) {
    localStorage.setItem(key, score);
  }
}

function createTiles() {
  puzzle.innerHTML = '';
  tiles = [];
  const tileSize = 100; 

  puzzle.style.gridTemplateColumns = `repeat(${gridSize}, ${tileSize}px)`;
  puzzle.style.gridTemplateRows = `repeat(${gridSize}, ${tileSize}px)`;

  for (let i = 0; i < gridSize * gridSize; i++) 
  {
    const tile = document.createElement("div");
    tile.classList.add("tile");
    tile.setAttribute("draggable", true);
    tile.dataset.index = i;

    const row = Math.floor(i / gridSize);
    const col = i % gridSize;


    tile.style.width = `${tileSize}px`;
    tile.style.height = `${tileSize}px`;
    tile.style.backgroundImage = `url(${imageUrl})`;
    tile.style.backgroundSize = `${gridSize * tileSize}px ${gridSize * tileSize}px`;
    tile.style.backgroundPosition = `-${col * tileSize}px -${row * tileSize}px`;

    tile.addEventListener("dragstart", dragStart);
    tile.addEventListener("drop", dropped);
    tile.addEventListener("dragover", (e) => e.preventDefault());

    tiles.push(tile);
    puzzle.appendChild(tile);
  }
}

let draggedTile;

function dragStart(e) {
  draggedTile = e.target;
}

function dropped(e) {
  const targetTile = e.target;
  if (draggedTile === targetTile) return;

  const draggedIndex = [...puzzle.children].indexOf(draggedTile);
  const targetIndex = [...puzzle.children].indexOf(targetTile);

  puzzle.insertBefore(draggedTile, puzzle.children[targetIndex]);
  puzzle.insertBefore(targetTile, puzzle.children[draggedIndex]);

  moves++;
  moveCounter.textContent = `Moves: ${moves}`;
  checkIfSolved();
}

function shuffleTiles() {
  moves = 0;
  moveCounter.textContent = `Moves: 0`;
  const shuffled = [...tiles].sort(() => Math.random() - 0.5);
  puzzle.innerHTML = '';
  shuffled.forEach(t => puzzle.appendChild(t));
}

function checkIfSolved() {
  const isSolved = [...puzzle.children].every((tile, index) => tile.dataset.index == index);
  if (isSolved) {
    setTimeout(() => alert(`Congradulation Puzzle Solved in ${moves} moves!`), 100);
  }
}


imageInput.addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (file && file.type.startsWith("image/")) 
  {
    const reader = new FileReader();
    reader.onload = function (event) 
    {
      imageUrl = event.target.result;
      startButton.disabled = false; 
    };
    reader.readAsDataURL(file);
  }
});

startButton.addEventListener("click", () => {
  moves = 0;
  moveCounter.textContent = `Moves: 0`;
  gridSize = parseInt(difficultySelect.value);
  createTiles();
  shuffleTiles();
});

function createTiles() {
  puzzle.innerHTML = '';
  tiles = [];
  const tileSize = 100;
  const totalSize = tileSize * gridSize;

  puzzle.style.gridTemplateColumns = `repeat(${gridSize}, ${tileSize}px)`;
  puzzle.style.gridTemplateRows = `repeat(${gridSize}, ${tileSize}px)`;
  puzzle.style.width = `${totalSize}px`;
  puzzle.style.height = `${totalSize}px`;

  for (let i = 0; i < gridSize * gridSize; i++) {
    const tile = document.createElement("div");
    tile.classList.add("tile");
    tile.setAttribute("draggable", true);
    tile.dataset.index = i;

    const row = Math.floor(i / gridSize);
    const col = i % gridSize;

    tile.style.backgroundImage = `url(${imageUrl})`;
    tile.style.backgroundSize = `${totalSize}px ${totalSize}px`;
    tile.style.backgroundPosition = `-${col * tileSize}px -${row * tileSize}px`;

    tile.addEventListener("dragstart", dragStart);
    tile.addEventListener("drop", dropped);
    tile.addEventListener("dragover", (e) => e.preventDefault());

    tiles.push(tile);
    puzzle.appendChild(tile);
  }
}

function shuffleTiles() {
  moves = 0;
  updateMoveDisplay();
  const shuffled = [...tiles].sort(() => Math.random() - 0.5);
  puzzle.innerHTML = '';
  shuffled.forEach(t => puzzle.appendChild(t));
}

function dropped(e) {
  const targetTile = e.target;
  if (draggedTile === targetTile) return;

  const draggedIndex = [...puzzle.children].indexOf(draggedTile);
  const targetIndex = [...puzzle.children].indexOf(targetTile);

  puzzle.insertBefore(draggedTile, puzzle.children[targetIndex]);
  puzzle.insertBefore(targetTile, puzzle.children[draggedIndex]);

  moves++;
  updateMoveDisplay();
  checkIfSolved();
}

function checkIfSolved() {
  const isSolved = [...puzzle.children].every((tile, index) => tile.dataset.index == index);
  if (isSolved) {
    saveBestScore(gridSize, moves);
    updateMoveDisplay();
    setTimeout(() => alert(`Congradulation Puzzle Solved in ${moves} moves!`), 100);
  }
}

function updateMoveDisplay() {
  const best = getBestScore(gridSize);
  moveCounter.textContent = `Moves: ${moves} | Best Score: ${best !== null ? best : '-'}`;
}
