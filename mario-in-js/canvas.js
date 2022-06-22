const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 1024;
canvas.height = 576;
const gravity = 1.5;
const spd = 10;
let lastKey;

class Player {
  constructor() {
    this.position = {
      x: 100,
      y: 100,
    };
    this.speed = {
      x: 0,
      y: 0,
    };
    this.width = 66;
    this.height = 150;
    this.image = createImage('./img/spriteStandRight.png');
    this.frames = 0;
    this.sprites = {
      stand: {
        right: createImage('./img/spriteStandRight.png'),
        left: createImage('./img/spriteStandLeft.png'),
        framesMax: 60,
        width: 66,
        height: 150,
      },
      run: {
        right: createImage('./img/spriteRunRight.png'),
        left: createImage('./img/spriteRunLeft.png'),
        framesMax: 30,
        width: 127.875,
        height: 150,
      },
    };
    this.currentSprite = this.sprites.stand.right;
    this.framesMax = this.sprites.stand.framesMax;
  }

  draw() {
    ctx.drawImage(
      this.currentSprite,
      (this.currentSprite.width / this.framesMax) * this.frames,
      0,
      this.currentSprite.width / this.framesMax,
      this.currentSprite.height,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  update() {
    this.frames += 1;
    if (this.frames >= this.framesMax) {
      this.frames = 0;
    }
    this.draw();
    this.position.x += this.speed.x;
    this.position.y += this.speed.y;

    if (this.position.y + this.height + this.speed.y <= canvas.height) {
      this.speed.y += gravity;
    }
  }
}

class Platform {
  constructor({ x, y, image }) {
    this.position = {
      x,
      y,
    };
    this.image = image;
    this.width = this.image.width;
    this.height = this.image.height;
  }

  draw() {
    ctx.drawImage(this.image, this.position.x, this.position.y);
  }
}

class GenericObject {
  constructor({ x, y, image }) {
    this.position = {
      x,
      y,
    };
    this.image = image;
    this.width = this.image.width;
    this.height = this.image.height;
  }

  draw() {
    ctx.drawImage(this.image, this.position.x, this.position.y);
  }
}

const createImage = (imageSrc) => {
  const image = new Image();
  image.src = imageSrc;
  return image;
};

const platformImg = createImage('./img/platform.png');
const platformSmallTallImg = createImage('./img/platformSmallTall.png');

let player = new Player();
let platforms = [];
let genericObjects = [];

let keys = {
  right: {
    pressed: false,
  },
  left: {
    pressed: false,
  },
};

let scrollOffset = 0;

const start = () => {
  player = new Player();
  platforms = [
    new Platform({
      x:
        platformImg.width * 4 +
        300 -
        2 +
        platformImg.width -
        platformSmallTallImg.width,
      y: 270,
      image: platformSmallTallImg,
    }),
    new Platform({ x: -1, y: 470, image: platformImg }),
    new Platform({ x: platformImg.width - 3, y: 470, image: platformImg }),
    new Platform({
      x: platformImg.width * 2 + 100,
      y: 470,
      image: platformImg,
    }),
    new Platform({
      x: platformImg.width * 3 + 300,
      y: 470,
      image: platformImg,
    }),
    new Platform({
      x: platformImg.width * 4 + 300 - 2,
      y: 470,
      image: platformImg,
    }),
    new Platform({
      x: platformImg.width * 5 + 700,
      y: 470,
      image: platformImg,
    }),
  ];

  genericObjects = [
    new GenericObject({
      x: 0,
      y: 0,
      image: createImage('./img/background.png'),
    }),
    new GenericObject({
      x: 0,
      y: 0,
      image: createImage('./img/hills.png'),
    }),
  ];

  scrollOffset = 0;
  // fim da start
};

const animate = () => {
  requestAnimationFrame(animate);
  // ctx.fillStyle = 'white';
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  genericObjects.forEach((object) => {
    object.draw();
  });

  platforms.forEach((platform) => {
    platform.draw();
  });
  player.update();

  if (keys.right.pressed && player.position.x < 400) {
    player.speed.x = spd;
  } else if (
    (keys.left.pressed && player.position.x > 100) ||
    (keys.left.pressed && scrollOffset === 0 && player.position.x > 0)
  ) {
    player.speed.x = -spd;
  } else {
    player.speed.x = 0;

    if (keys.right.pressed) {
      scrollOffset += spd;
      platforms.forEach((platform) => {
        platform.position.x += -spd;
      });

      genericObjects.forEach((object) => {
        object.position.x -= spd - 2;
      });
    } else if (keys.left.pressed && scrollOffset > 0) {
      scrollOffset -= spd;
      platforms.forEach((platform) => {
        platform.position.x += spd;
      });
      genericObjects.forEach((object) => {
        object.position.x += spd - 2;
      });
    }
  }

  platforms.forEach((platform) => {
    if (
      player.position.y + player.height <= platform.position.y &&
      player.position.y + player.height + player.speed.y >
        platform.position.y &&
      player.position.x + player.width >= platform.position.x &&
      player.position.x <= platform.position.x + platform.width
    ) {
      player.speed.y = 0;
    }
  });

  if (
    keys.right.pressed &&
    lastKey === 'right' &&
    player.currentSprite !== player.sprites.run.right
  ) {
    player.frames = 1;
    player.currentSprite = player.sprites.run.right;
    player.framesMax = player.sprites.run.framesMax;
    player.width = player.sprites.run.width;
  } else if (
    keys.left.pressed &&
    lastKey === 'left' &&
    player.currentSprite !== player.sprites.run.left
  ) {
    player.currentSprite = player.sprites.run.left;
    player.framesMax = player.sprites.run.framesMax;
    player.width = player.sprites.run.width;
  } else if (
    !keys.left.pressed &&
    lastKey === 'left' &&
    player.currentSprite !== player.sprites.stand.left
  ) {
    player.currentSprite = player.sprites.stand.left;
    player.framesMax = player.sprites.stand.framesMax;
    player.width = player.sprites.stand.width;
  } else if (
    !keys.right.pressed &&
    lastKey === 'right' &&
    player.currentSprite !== player.sprites.stand.right
  ) {
    player.currentSprite = player.sprites.stand.right;
    player.framesMax = player.sprites.stand.framesMax;
    player.width = player.sprites.stand.width;
  }

  if (scrollOffset > platformImg.width * 5 + 300) {
    console.log('venceu');
  }

  if (player.position.y > canvas.height) {
    start();
  }
};

start();
animate();

addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'w':
      player.speed.y -= 25;
      break;
    case 'a':
      keys.left.pressed = true;
      lastKey = 'left';

      break;
    case 's':
      break;
    case 'd':
      keys.right.pressed = true;
      lastKey = 'right';
      break;

    default:
      break;
  }
});

addEventListener('keyup', (e) => {
  switch (e.key) {
    case 'a':
      keys.left.pressed = false;
      // player.currentSprite = player.sprites.stand.left;
      // player.framesMax = player.sprites.stand.framesMax;
      // player.width = player.sprites.stand.width;
      break;
    case 's':
      break;
    case 'd':
      keys.right.pressed = false;
      break;

    default:
      break;
  }
});
