const checkCollision = ({ obj1, obj2 }) => {
  return (
    obj1.attackBox.position.x + obj1.attackBox.width >= obj2.position.x &&
    obj1.attackBox.position.x <= obj2.position.x + obj2.width &&
    obj1.attackBox.position.y + obj1.attackBox.height >= obj2.position.y &&
    obj1.attackBox.position.y <= obj2.position.y + obj2.height
  );
};

const checkWinner = ({ player, enemy, timerId }) => {
  clearTimeout(timerId);
  displayTextEl.style.display = 'flex';
  if (player.health === enemy.health) {
    displayTextEl.textContent = 'Tie';
  } else if (player.health > enemy.health) {
    displayTextEl.textContent = 'Player 1 Wins';
  } else {
    displayTextEl.textContent = 'Player 2 Wins';
  }
};

let timer = 60;
let timerId;
const decreaseTimer = () => {
  if (timer > 0) {
    timerId = setTimeout(decreaseTimer, 1000);
    timer -= 1;
    timerEl.textContent = timer;
  }

  if (timer === 0) {
    checkWinner({
      player,
      enemy,
      timerId,
    });
  }
};
