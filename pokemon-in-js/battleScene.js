const battleBackgroundImage = new Image();
battleBackgroundImage.src = './img/battleBackground.png';
const battleBackground = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  image: battleBackgroundImage,
});

let draggle
let emby
let renderedSprites
let battleAnimationId
let queue
const dialogueBox = document.getElementById('dialogueBox');
const userInterface = document.getElementById('userInterface');
const enemyHealthBar = document.getElementById('enemyHealthBar');
const playerHealthBar = document.getElementById('playerHealthBar');
const attacksBox = document.getElementById('attacksBox');

const initBattle = () => {
  userInterface.style.display = 'block';
  dialogueBox.style.display = 'none';
  playerHealthBar.style.width = '100%';
  enemyHealthBar.style.width = '100%';
  attacksBox.replaceChildren();

  draggle = new Monster(monsters.Draggle);
  emby = new Monster(monsters.Emby);
  renderedSprites = [draggle, emby];
  queue = [];


  emby.attacks.forEach((attack) => {
    const button = document.createElement('button');
    button.textContent = attack.name;
    const attacksBox = document.getElementById('attacksBox');
    attacksBox.append(button);
  });

const buttons = document.querySelectorAll('button');
buttons.forEach((button) => {
  button.addEventListener('click', (e) => {
    const selectedAttack = attacks[e.target.textContent]
    emby.attack({ 
      attack: selectedAttack,
      recipient: draggle,
      renderedSprites,
   });

   if (draggle.health <= 0) {
     queue.push(() => {
       draggle.faint();
     });
     queue.push(() => {
      gsap.to('#overlappingDiv', {
        opacity: 1,
        onComplete: () => {
          cancelAnimationFrame(battleAnimationId);
          animate();
          userInterface.style.display = 'none';
          gsap.to('#overlappingDiv', {
            opacity: 0,
          })
          battle.initiated = false;
          audio.map.play();
        }
      })
     });

     return
   }

   const randomAttacks = draggle.attacks[Math.floor(Math.random() * draggle.attacks.length)];

   queue.push(() => {
    draggle.attack({ 
      attack: randomAttacks,
      recipient: emby,
      renderedSprites,
   })

   if (emby.health <= 0) {
    queue.push(() => {
      emby.faint();
    });

    queue.push(() => {
      gsap.to('#overlappingDiv', {
        opacity: 1,
        onComplete: () => {
          cancelAnimationFrame(battleAnimationId);
          animate();
          userInterface.style.display = 'none';
          gsap.to('#overlappingDiv', {
            opacity: 0,
          })
          battle.initiated = false;
          audio.map.play();
        }
      })
     });
    
  }
   });
  });

  button.addEventListener('mouseenter', (e) => {
    const selectedAttack = attacks[e.target.textContent];
    const attackType = document.getElementById('attackType');
    attackType.textContent = selectedAttack.type;
    attackType.style.color = selectedAttack.color;
  });

  button.addEventListener('mouseleave', (e) => {
    const attackType = document.getElementById('attackType');
    attackType.textContent = 'Attack type';
    attackType.style.color = 'black';
  });
});
}

const animateBattle = () => {
  battleAnimationId = window.requestAnimationFrame(animateBattle);
  battleBackground.draw();
  
  renderedSprites.forEach((sprite) => {
    sprite.draw();
  })
}

// initBattle();
// animateBattle();

dialogueBox.addEventListener('click', (e) => {
  if (queue.length) {
    queue[0]();
    queue.shift();
  } else e.target.style.display = 'none';
})