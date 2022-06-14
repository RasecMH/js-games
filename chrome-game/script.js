const character = document.getElementById('character');
const block = document.getElementById('block');
let counter = 0;

const jump = () => {
  if(character.classList != 'animate'){
  character.classList.add('animate');
}
  setTimeout(() => {
    character.classList.remove('animate');
  }, 500);
};

const checkDead = setInterval(() => {
const characterTop = parseInt(window.getComputedStyle(character).getPropertyValue('top'));
const blockLeft = parseInt(window.getComputedStyle(block).getPropertyValue('left'));

if(blockLeft < 20 && blockLeft > -20 && characterTop >= 130){
  block.style.animation = 'none';
  alert('Game Over. score: '+Math.floor(counter/100));
  counter=0;
  block.style.animation = "block 1s infinite linear";
} else {
  counter++;
  document.getElementById("scoreSpan").innerHTML = Math.floor(counter/100);
}

}, 10)