const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const overlay = document.getElementById("overlay");
const scoreEl = document.getElementById("score");

const GRID = 20;
const COLS = canvas.width / GRID;
const ROWS = canvas.height / GRID;

let snake, dir, nextDir, food, score, loop;

function startGame() {
  snake = [{ x: 10, y: 10 }];
  dir = { x: 1, y: 0 };
  nextDir = { x: 1, y: 0 };
  score = 0;
  scoreEl.textContent = "Score: 0";
  overlay.style.display = "none";
  spawnFood();
  clearInterval(loop);
  loop = setInterval(tick, 120);
}

function spawnFood() {
  let pos;
  do {
    pos = {
      x: Math.floor(Math.random() * COLS),
      y: Math.floor(Math.random() * ROWS),
    };
  } while (snake.some((s) => s.x === pos.x && s.y === pos.y));
  food = pos;
}

function tick() {
  dir = nextDir;

  const head = {
    x: snake[0].x + dir.x,
    y: snake[0].y + dir.y,
  };

  // Muur botsing
  if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
    return gameOver();
  }

  // Zelf botsing
  if (snake.some((s) => s.x === head.x && s.y === head.y)) {
    return gameOver();
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreEl.textContent = `Score: ${score}`;
    spawnFood();
  } else {
    snake.pop();
  }

  draw();
}

function draw() {
  // Achtergrond
  ctx.fillStyle = "#b4d65e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Grid
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 0.5;
  for (let x = 0; x < COLS; x++) {
    for (let y = 0; y < ROWS; y++) {
      ctx.strokeRect(x * GRID, y * GRID, GRID, GRID);
    }
  }

  // Snake
  snake.forEach((seg, i) => {
    const ratio = 1 - (i / snake.length) * 0.6;
    ctx.fillStyle = `rgba(0, 100, 0, ${ratio})`;
    ctx.beginPath();
    ctx.roundRect(seg.x * GRID + 2, seg.y * GRID + 2, GRID - 4, GRID - 4, 4);
    ctx.fill();
  });

  // Hoofd accent
  ctx.fillStyle = "rgb(0, 100, 0)";
  ctx.beginPath();
  ctx.roundRect(
    snake[0].x * GRID + 2,
    snake[0].y * GRID + 2,
    GRID - 4,
    GRID - 4,
    4,
  );
  ctx.fill();

  // Eten
  ctx.fillStyle = "#ff0000";
  ctx.beginPath();
  ctx.arc(
    food.x * GRID + GRID / 2,
    food.y * GRID + GRID / 2,
    GRID / 2 - 3,
    0,
    Math.PI * 2,
  );
  ctx.fill();
}

function gameOver() {
  clearInterval(loop);
  overlay.innerHTML = `
      <span class="big">GAME OVER</span>
      <p>Score: ${score}</p>
      <button onclick="startGame()">OPNIEUW</button>
    `;
  overlay.style.display = "flex";
}

document.addEventListener("keydown", (e) => {
  const keys = {
    ArrowUp: { x: 0, y: -1 },
    ArrowDown: { x: 0, y: 1 },
    ArrowLeft: { x: -1, y: 0 },
    ArrowRight: { x: 1, y: 0 },
  };
  const newDir = keys[e.key];
  if (!newDir) return;
  // Mag niet 180 graden draaien
  if (newDir.x === -dir.x && newDir.y === -dir.y) return;
  nextDir = newDir;
  e.preventDefault();
});
