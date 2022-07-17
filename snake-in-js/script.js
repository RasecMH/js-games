const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 400;
canvas.height = 400;

const snake = [];
let positionX = 10;
let positionY = 10;
let foodX = 15;
let foodY = 15;
let velX = 0;
let velY = 0;
const grid = 20;
let size = 3;

const game = () => {
  ctx.fillStyle = 'blue';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  positionX += velX;
  positionY += velY;

  if (positionX < 0) {
    positionX = grid;
  }
  if (positionX > grid) {
    positionX = 0;
  }
  if (positionY < 0) {
    positionY = grid;
  }
  if (positionY > grid) {
    positionY = 0;
  }

  ctx.fillStyle = 'green';
  snake.forEach((block) => {
    ctx.fillRect(block.x * grid, block.y * grid, grid, grid);
    if (block.x === positionX && block.y === positionY) {
      size = 3;
    }
  });

  snake.push({ x: positionX, y: positionY });

  while (snake.length > size) {
    snake.shift();
  }

  ctx.fillStyle = 'yellow';
  ctx.fillRect(foodX * grid, foodY * grid, grid, grid);

  if (positionX === foodX && positionY === foodY) {
    size += 1;
    foodX = Math.floor(Math.random() * grid);
    foodY = Math.floor(Math.random() * grid);
  }
};

setInterval(game, 100);

document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowRight':
      velX = 1;
      velY = 0;
      break;
    case 'ArrowLeft':
      velX = -1;
      velY = 0;
      break;
    case 'ArrowUp':
      velX = 0;
      velY = -1;
      break;
    case 'ArrowDown':
      velX = 0;
      velY = 1;
      break;
  }
});
