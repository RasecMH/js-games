import Game from "./game.js";

const canvas = document.getElementById('gameScreen');
const imgBrick = document.getElementById('img_brick');
const ctx = canvas.getContext('2d');

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

const game = new Game(GAME_WIDTH, GAME_HEIGHT);

let lastTime = 0;

function gameLoop(timeStamp) {
  let deltaTime = timeStamp - lastTime;
  lastTime = timeStamp;

  ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  game.update(deltaTime);
  game.draw(ctx);

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
