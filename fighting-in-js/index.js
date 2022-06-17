const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const enemyHealthEl = document.getElementById('enemyHealth');
const playerHealthEl = document.getElementById('playerHealth');
const timerEl = document.getElementById('timer');
const displayTextEl = document.getElementById('displayText');
const GAME_WIDTH = 1024;
const GAME_HEIGHT = 576;
const gravity = 0.5;
const spd = 5;
const hspd = -15;
canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;
canvas.style.imageRendering = 'pixelated';
ctx.imageSmoothingEnabled = false;

ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: './img/background.png',
});

const shop = new Sprite({
  position: {
    x: 600,
    y: 128,
  },
  imageSrc: './img/shop.png',
  scale: 2.75,
  framesMax: 6,
});

const player = new Fighter({
  position: {
    x: 0,
    y: 0,
  },
  speed: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 0,
    y: 0,
  },
  imageSrc: './img/samuraiMack/Idle.png',
  framesMax: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 157,
  },
  sprites: {
    idle: {
      imageSrc: './img/samuraiMack/Idle.png',
      framesMax: 8,
    },
    run: {
      imageSrc: './img/samuraiMack/Run.png',
      framesMax: 8,
    },
    jump: {
      imageSrc: './img/samuraiMack/Jump.png',
      framesMax: 2,
    },
    fall: {
      imageSrc: './img/samuraiMack/Fall.png',
      framesMax: 2,
    },
    attack1: {
      imageSrc: './img/samuraiMack/Attack1.png',
      framesMax: 6,
    },
    takeHit: {
      imageSrc: './img/samuraiMack/Take Hit.png',
      framesMax: 4,
    },
    death: {
      imageSrc: './img/samuraiMack/Death.png',
      framesMax: 6,
    },
  },
  attackBox: {
    offset: {
      x: 100,
      y: 50,
    },
    width: 160,
    height: 50,
  },
});

const enemy = new Fighter({
  position: {
    x: 400,
    y: 100,
  },
  speed: {
    x: 0,
    y: 0,
  },
  imageSrc: './img/kenji/Idle.png',
  framesMax: 4,
  scale: 2.5,
  offset: {
    x: 215,
    y: 167,
  },
  sprites: {
    idle: {
      imageSrc: './img/kenji/Idle.png',
      framesMax: 4,
    },
    run: {
      imageSrc: './img/kenji/Run.png',
      framesMax: 8,
    },
    jump: {
      imageSrc: './img/kenji/Jump.png',
      framesMax: 2,
    },
    fall: {
      imageSrc: './img/kenji/Fall.png',
      framesMax: 2,
    },
    attack1: {
      imageSrc: './img/kenji/Attack1.png',
      framesMax: 4,
    },
    takeHit: {
      imageSrc: './img/kenji/Takehit.png',
      framesMax: 3,
    },
    death: {
      imageSrc: './img/kenji/Death.png',
      framesMax: 7,
    },
  },
  attackBox: {
    offset: {
      x: -170,
      y: 50,
    },
    width: 170,
    height: 50,
  },
});

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
};

decreaseTimer();

const animate = () => {
  window.requestAnimationFrame(animate);
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  background.update();
  shop.update();
  ctx.fillStyle = 'rgba(255,255,255,0.15)';
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT - 95);
  player.update();
  enemy.update();

  player.speed.x = 0;
  if (keys.a.pressed && player.lastKey === 'a') {
    player.speed.x = -spd;
    player.switchSprite('run');
  } else if (keys.d.pressed && player.lastKey === 'd') {
    player.speed.x = spd;
    player.switchSprite('run');
  } else {
    player.switchSprite('idle');
  }

  if (player.speed.y < 0) {
    player.switchSprite('jump');
  } else if (player.speed.y > 0) {
    player.switchSprite('fall');
  }

  enemy.speed.x = 0;
  if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
    enemy.speed.x = -spd;
    enemy.switchSprite('run');
  } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
    enemy.speed.x = spd;
    enemy.switchSprite('run');
  } else {
    enemy.switchSprite('idle');
  }

  if (enemy.speed.y < 0) {
    enemy.switchSprite('jump');
  } else if (enemy.speed.y > 0) {
    enemy.switchSprite('fall');
  }

  if (
    checkCollision({
      obj1: player,
      obj2: enemy,
    }) &&
    player.isAttacking &&
    player.framesCurrent === 4
  ) {
    enemy.takeHit();
    player.isAttacking = false;
    gsap.to('#enemyHealth', {
      width: `${enemy.health}%`,
    });
  }

  if (player.isAttacking && player.framesCurrent === 4) {
    player.isAttacking = false;
  }

  if (
    checkCollision({
      obj1: enemy,
      obj2: player,
    }) &&
    enemy.isAttacking &&
    enemy.framesCurrent === 2
  ) {
    player.takeHit();
    enemy.isAttacking = false;
    gsap.to('#playerHealth', {
      width: `${player.health}%`,
    });
  }

  if (enemy.isAttacking && enemy.framesCurrent === 2) {
    enemy.isAttacking = false;
  }

  if (enemy.health <= 0 || player.health <= 0) {
    checkWinner({
      player,
      enemy,
      timerId,
    });
  }
};

animate();

window.addEventListener('keydown', (e) => {
  if (!player.dead) {
    switch (e.key) {
      case 'w':
        player.speed.y = hspd;
        break;
      case 'a':
        keys.a.pressed = true;
        player.lastKey = 'a';
        break;
      case 'd':
        keys.d.pressed = true;
        player.lastKey = 'd';
        break;
      case ' ':
        player.attack();
        break;
    }
  }

  if (!enemy.dead) {
    switch (e.key) {
      case 'ArrowUp':
        enemy.speed.y = hspd;
        break;
      case 'ArrowLeft':
        keys.ArrowLeft.pressed = true;
        enemy.lastKey = 'ArrowLeft';
        break;
      case 'ArrowRight':
        keys.ArrowRight.pressed = true;
        enemy.lastKey = 'ArrowRight';
        break;
      case 'm':
        enemy.attack();
        break;
    }
  }
});

window.addEventListener('keyup', (e) => {
  switch (e.key) {
    case 'a':
      keys.a.pressed = false;
      break;
    case 'd':
      keys.d.pressed = false;
      break;
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false;
      break;
    case 'ArrowRight':
      keys.ArrowRight.pressed = false;
      break;
  }
});
