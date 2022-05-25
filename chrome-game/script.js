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
const characterTop = parseInt(window.getComputedStyle(character).getPropertyValue('top'));
const blockLeft = parseInt(window.getComputedStyle(block).getPropertyValue('left'));
const blockTop = parseInt(window.getComputedStyle(block).getPropertyValue('top'));
const blockWidth = parseInt(window.getComputedStyle(block).getPropertyValue('width'));
console.log(characterTop);
console.log(blockLeft);
console.log(blockTop);
console.log(blockWidth);

const checkDead = setInterval(() => {
const characterTop = parseInt(window.getComputedStyle(character).getPropertyValue('top'));
const blockLeft = parseInt(window.getComputedStyle(block).getPropertyValue('left'));

if(blockLeft < 44 && blockLeft > -44 && characterTop >= 104){
  block.style.animation = 'none';
  alert('Game Over. score: '+Math.floor(counter/100));
  counter=0;
  block.style.animation = "block 1s infinite linear";
} else {
  counter++;
  document.getElementById("scoreSpan").innerHTML = Math.floor(counter/100);
}

}, 10)