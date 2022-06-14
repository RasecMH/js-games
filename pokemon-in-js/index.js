const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;
ctx.save();

const collisionsMap = [];
for (let i = 0; i < collisions.length; i += 70) {
  collisionsMap.push(collisions.slice(i, 70 + i));
};

const battleZonesMap = [];
for (let i = 0; i < battleZonesData.length; i += 70) {
  battleZonesMap.push(battleZonesData.slice(i, 70 + i));
};

const boundaries = [];

const offset = {
  x: -750,
  y: -684
}

collisionsMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1025)
      boundaries.push(new Boundary({
        position: {
          x: (j * Boundary.width) + offset.x,
          y: (i * Boundary.height) + offset.y
        }
      }))
  })
});

const battleZones = [];

battleZonesMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1025)
      battleZones.push(new Boundary({
        position: {
          x: (j * Boundary.width) + offset.x,
          y: (i * Boundary.height) + offset.y
        }
      }))
  })
});

const image = new Image();
image.src = './img/Pellet Town.png'

const foregroundImage = new Image();
foregroundImage.src = './img/foreground.png'

const playerDownImage = new Image();
playerDownImage.src = './img/playerDown.png';

const playerUpImage = new Image();
playerUpImage.src = './img/playerUp.png';

const playerLeftImage = new Image();
playerLeftImage.src = './img/playerLeft.png';

const playerRightImage = new Image();
playerRightImage.src = './img/playerRight.png';

const player = new Sprite({
  position: {
    x: ((canvas.width / 2) - ((192 / 4) / 2)),
    y: ((canvas.height / 2) - (68 / 2)),
  },
  image: playerDownImage,
  frames: {
    max: 4,
    hold: 10,
  },
  sprites: {
    up: playerUpImage,
    left: playerLeftImage,
    right: playerRightImage,
    down: playerDownImage
  }
})


const background = new Sprite({
  position: {
    x: offset.x,
    y: offset.y
  },
  image: image,
});

const foreground = new Sprite({
  position: {
    x: offset.x,
    y: offset.y
  },
  image: foregroundImage,
});

const keys = {
  w: {
    pressed: false
  },
  a: {
    pressed: false
  },
  s: {
    pressed: false
  },
  d: {
    pressed: false
  }
}

const movables = [background, ...boundaries, foreground, ...battleZones]

const checkCollision = ({ obj1, obj2 }) => {
  return (
    obj1.position.x + obj1.width >= obj2.position.x
    && obj1.position.x <= obj2.position.x + obj2.width
    && obj1.position.y <= obj2.position.y + obj2.height
    && obj1.position.y + obj1.height >= obj2.position.y
  )
};

const battle = {
  initiated: false,
}

const speed = 5;


const animate = () => {
  userInterface.style.display = 'none';
  const animationId = window.requestAnimationFrame(animate);
  background.draw();
  boundaries.forEach(boundary => {
    boundary.draw();
  });
  battleZones.forEach(battleZone => {
    battleZone.draw();
  });

  player.draw();
  foreground.draw();

  let isColliding = false;
  let inBattleZone = false;
  player.animate = false;
  // console.log(animationId);
  if (battle.initiated) return;

  if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
    inBattleZone = battleZones.some(battleZone => {
      const overlappiingArea = (Math.min(player.position.x + player.width,
        battleZone.position.x + battleZone.width)
        - Math.max(player.position.x, battleZone.position.x))
        * (Math.min(player.position.y + player.height,
          battleZone.position.y + battleZone.height)
          - Math.max(player.position.y, battleZone.position.y));
      return checkCollision({
        obj1: player,
        obj2: battleZone
      })
        && overlappiingArea > (player.width * player.height) / 2
        && Math.random() < 0.01
    });
  };

  if (inBattleZone) {
    console.log('Batalha!');
    window.cancelAnimationFrame(animationId);
    audio.map.stop();
    audio.initBattle.play();
    audio.battle.play();

    battle.initiated = true;
    gsap.to('#overlappingDiv', {
      opacity: 1,
      repeat: 3,
      yoyo: true,
      duration: 0.4,
      onComplete() {
        gsap.to('#overlappingDiv', {
          opacity: 1,
          duration: 0.4,
          onComplete() {
           initBattle();
           animateBattle();
           gsap.to('#overlappingDiv', {
            opacity: 0,
            duration: 0.4,
          })
          }
        })
      }
    });
  };

  if (keys.w.pressed && lastKey === 'w') {
    player.animate = true;
    player.image = player.sprites.up;
    isColliding = boundaries.some(boundary => {
      return checkCollision({
        obj1: player,
        obj2: {
          ...boundary,
          position: {
            x: boundary.position.x,
            y: boundary.position.y + speed
          }
        }
      })
    });

    if (!isColliding)
      movables.forEach(movable => movable.position.y += speed)
  };

  if (keys.a.pressed && lastKey === 'a') {
    player.animate = true;
    player.image = player.sprites.left;
    isColliding = boundaries.some(boundary => {
      return checkCollision({
        obj1: player,
        obj2: {
          ...boundary,
          position: {
            x: boundary.position.x + speed,
            y: boundary.position.y
          }
        }
      })
    });

    if (!isColliding)
      movables.forEach(movable => movable.position.x += speed)
  };
  if (keys.s.pressed && lastKey === 's') {
    player.animate = true;
    player.image = player.sprites.down;
    isColliding = boundaries.some(boundary => {
      return checkCollision({
        obj1: player,
        obj2: {
          ...boundary,
          position: {
            x: boundary.position.x,
            y: boundary.position.y - speed
          }
        }
      })
    });

    if (!isColliding)
      movables.forEach(movable => movable.position.y -= speed)
  };
  if (keys.d.pressed && lastKey === 'd') {
    player.animate = true;
    player.image = player.sprites.right;
    isColliding = boundaries.some(boundary => {
      return checkCollision({
        obj1: player,
        obj2: {
          ...boundary,
          position: {
            x: boundary.position.x - speed,
            y: boundary.position.y
          }
        }
      })
    });

    if (!isColliding)
      movables.forEach(movable => movable.position.x -= speed)
  };
};

animate();
let clicked = false;
let isMuted = false;

const muteSounds = () => {
  if(!isMuted) {
    Howler.mute(true);
    isMuted = true;
  } else {
    Howler.mute(false);
    isMuted = false;
  }
  };

let lastKey = '';
window.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'w':
      keys.w.pressed = true;
      lastKey = 'w';
      break;
    case 'a':
      keys.a.pressed = true;
      lastKey = 'a';
      break;
    case 's':
      keys.s.pressed = true;
      lastKey = 's';
      break;
    case 'd':
      keys.d.pressed = true;
      lastKey = 'd';
      break;
    case 'm':
      muteSounds();
      break;
  };
});

window.addEventListener('keyup', (e) => {
  switch (e.key) {
    case 'w':
      keys.w.pressed = false;
      break;
    case 'a':
      keys.a.pressed = false;
      break;
    case 's':
      keys.s.pressed = false;
      break;
    case 'd':
      keys.d.pressed = false;
      break;
  };
});



addEventListener('keydown', () => {
if(!clicked){
  audio.map.play();
  clicked = true;
};
})