//Use 'grid' div to generate a 10x20 tetris-display
let pointer_grid = document.getElementById('grid');

for (let j=1; j <=10; j++) {
  pointer_grid.innerHTML += `<div class='grid-item'></div>` //original ceiling
}

for (let i = 1; i <= 200; i++) {
  pointer_grid.innerHTML += `<div class='grid-item'></div>`
}
for (let j=1; j <=10; j++) {
  pointer_grid.innerHTML += `<div class='taken grid-item'></div>`
}

let pointer_preview = document.getElementById('preview')
for (let x=1; x<=16; x++) { //16
  pointer_preview.innerHTML += `<div class='preview-item'></div>`
}

//Here, we define most constants.
//'squares' is a node-list made out of each cell on the grid.
const grid = document.querySelector(".grid");
let squares = Array.from(document.querySelectorAll('.grid-item'));
let previewSquares = Array.from(document.querySelectorAll('.preview-item'))
const scoreDisplay = document.querySelector('#score');
const startButton = document.querySelector('#start-button');
const gameOverDisplay = document.getElementById('game-over');
const w = 10 //width of game display
const pw = 4 //width of preview display
let score = 0

//Each Tetrominoes
const TetrominoL = [
  [1, w+1, w*2+1, 2],
  [w, w+1, w+2, w*2+2],
  [1, w+1, w*2, w*2+1],
  [w, w*2, w*2+1, w*2+2]
];
// const TetrominoZ = [
//   [0, w, w+1, w*2+1],
//   [w+1, w+2, w*2 ,w*2+1],
//   [0, w, w+1, w*2+1],
//   [w+1, w+2, w*2, w*2+1]
// ];

const TetrominoZ = [
  [0, w, w+1, w*2+1],
  [w+1, w+2, w*2 ,w*2+1],
  [2, w+1, w+2, w*2+1],
  [w, w+1, w*2+1, w*2+2]
];

const TetrominoT = [
  [1, w, w+1, w+2],
  [1, w+1, w+2, w*2+1],
  [w, w+1, w+2, w*2+1],
  [1, w, w+1, w*2+1]
];
const TetrominoO = [
  [0, 1, w, w+1],
  [0, 1, w, w+1],
  [0, 1, w, w+1],
  [0, 1, w, w+1]
];
const TetrominoI = [
  [1, w+1, w*2+1, w*3+1],
  [w, w+1, w+2, w+3],
  [1, w+1, w*2+1, w*3+1],
  [w, w+1, w+2, w+3]
];

//List containing all tetrominoes
const Tetrominoes = [TetrominoL, TetrominoZ, TetrominoT, TetrominoO, TetrominoI];
const upNext = [[1, pw+1, pw*2+1, 2], [0, pw, pw+1, pw*2+1], [1, pw, pw+1, pw+2], [0, 1, pw, pw+1],[1, pw+1, pw*2+1, pw*3+1] ]
//[[...TetrominoL[0]], [...TetrominoZ[0]], [...TetrominoT[0]], [...TetrominoO[0]], [...TetrominoI[0]]]
const colors = ['green','dodgerblue','red','gray','lightgreen']




//'currentPosition' is where tetrominoes spawn from.
//in 'currentRotation': 0,1,2,3 refer to each variant of a given tetromino
//i.e.: cell that corresponds to index 4
let currentPosition = 4;
let currentRotation = 0;
let random = Math.floor(Math.random()*Tetrominoes.length)
let nextRandom = Math.floor(Math.random()*Tetrominoes.length)
//let nextOne = [...Tetrominoes[Math.floor(Math.random()*Tetrominoes.length)][currentRotation]]
//let current = Tetrominoes[random][currentRotation];
let current = [...Tetrominoes[random][currentRotation]];
let nextT = [...upNext[nextRandom]]
console.log(`${nextT} → ${nextRandom}`)
let play = false

//movement is modeled as a drawing and undrawing of cells.
//'draw' adds styling to 'squares' based on 'currentPosition' and
//each coordinate listed on 'current' tetromino. 'undraw' removes such styling
function draw() {
  current.forEach(index => squares[currentPosition+index].style.backgroundColor=colors[random]);
  //current.forEach(index => squares[currentPosition+index].classList.add('tetromino'));
}

function undraw(){
  current.forEach(index => squares[currentPosition+index].style.backgroundColor="")
  //current.forEach(index => squares[currentPosition+index].classList.remove('tetromino'))
}

function displayPreview(){
  //remove all trace of previous tetromino first...

  previewSquares.forEach(item => {
    //item.classList.remove('tetromino')
    item.style = ""
  })

  //Display next tetromino by adding style to it...

  //nextT
  // upNext[nextRandom].forEach(index => previewSquares[index].classList.add('tetromino'))

  // upNext[nextRandom].forEach(index => {
  //   previewSquares[index].classList.add('tetromino')
  // })

  upNext[nextRandom].forEach(index => {
    previewSquares[index].style.backgroundColor=colors[nextRandom]
  })

}



moveDownTimer=500
edgeCheckerTimer=5
//make the tetromino move down at a regular interval in miliseconds
//and check if an edge has been reached evry 10 miliseconds
//timerId = setInterval(moveDown, moveDownTimer);
edgeChecker = setInterval(freeze, edgeCheckerTimer);
let timerId

function preview (){

random = nextRandom
nextRandom = Math.floor(Math.random()*Tetrominoes.length)
current = [...Tetrominoes[random][currentRotation]]
nextT = [...upNext[nextRandom]]
currentPosition = 4


  draw()
  displayPreview()
}

//freeze function
//when moving down, 'freeze' evaluates if the next square is 'taken'.
//if so, tetromino will become 'taken' and remain still.
//then, a new tetromino will start falling down from 'currentPosition = 4'.
function freeze() {

  if (play==true) {
    //if cell below is 'taken'...
  if (current.some(index => squares[currentPosition+index+w].classList.contains('taken'))){

    //add 'taken' style to current tetromino to render it 'frozen'
    current.forEach(index=>squares[currentPosition+index].classList.add('taken'))

    //finally, start a new tetromino fall
    preview()
    addScore()
  }
  }
}

//move down function
function moveDown() {
  if (play==true) {
  undraw();
  currentPosition+=w;
  draw();
  //freeze();

  newMargin()
  gameOver();
}
}

//checks if edge has been reached and allows movement in that direction
//as long as it's not reached.
//currentPosition-=1 is ← |currentPosition+=1 is → |currentPosition+=w is ↓
// w===0 Left edge | w===w-1 Right edge
function moveLeft() {
  undraw();
  const isAtLeftEdge = current.some(index => (currentPosition+index)%w===0)
  if (!isAtLeftEdge) currentPosition -=1
  //currentPosition-=1;
  if (current.some(index=> squares[currentPosition+index].classList.contains('taken'))){
    currentPosition+=1
  }
  //freeze()
  draw()
}

function moveRight(){
  undraw()
  const isAtRightEdge = current.some(index => (currentPosition+index)%w===w-1)
  if (!isAtRightEdge) currentPosition+=1

  if (current.some(index=> squares[currentPosition+index].classList.contains('taken'))){
    currentPosition-=1
  }
  //freeze()
  draw()


}

function Rotate (){

  console.log(`current shape: ${random}`);

  undraw()

  currentRotation++
  if (currentRotation >= TetrominoI.length) {currentRotation=0}
  current = [...Tetrominoes[random][currentRotation]]

  draw()
  //currentRotation = 0
  //console.log(`| ${current} | ${nextOne} | shape: ${random}`);
  console.log(`next shape: ${nextRandom}`);

}



//
// upNext[nextRandom].forEach(index => {
//   previewSquares[index].classList.add('tetromino')
// })


//KeyCodes: w=87(↑) a=65(←) s=83(↓) d=68(→)
//Event handler 'control' will call a function based on the key pressed
function control(e){
  if (play==true){

  if(e.key === 'a') {
    moveLeft()
  }
  else if(e.key === 's') {
    moveDown()
  }
  else if(e.key === 'd'){
    moveRight()
  }
  else if(e.key === 'w'){
    Rotate()
  }
}
}


document.addEventListener('keydown', control)

startButton.addEventListener('click', ()=>{

  switch (play) {
    case true:
      clearInterval(timerId)
      play=false
      break;
    case false:
      displayPreview()
      timerId = setInterval(moveDown, moveDownTimer)

      play=true
      break



  }
})


let scoreMultiplier=  0 //
let tempScore = 0 //

function addScore(){
  for (let i=10; i<209; i+=w) {
    const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]
  // for (let i=0; i<199; i+=w) {
  //   const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

    if (row.every(index => squares[index].classList.contains('taken'))){
      //score += 10
      scoreDisplay.innerHTML = score

      document.querySelector('#score').classList.add('animated-text')
      stopAnimation()

      tempScore+=10
      scoreMultiplier++

      multiplyScore()


      row.forEach(index => {
        squares[index].classList.remove('taken')
        squares[index].classList.remove('tetromino')
        squares[index].classList.remove('ceiling')

        squares[index].style.backgroundColor = ""
      })

      const squaresRemoved = squares.splice(i,w)
      squares = squaresRemoved.concat(squares)
      squares.forEach(cell => pointer_grid.appendChild(cell)) //resarch more into this


//debugger
    }
  }
}

scorePeek = document.getElementById('scorePeek')

function multiplyScore (){

console.log(tempScore*scoreMultiplier)
scorePeek.innerHTML=`+${tempScore*scoreMultiplier}`
scorePeek.classList.add('fading-font')


  setTimeout(function(){
    if (scoreMultiplier>0){

      score += tempScore*scoreMultiplier
    }

      scoreMultiplier = 0
      tempScore = 0


      scoreDisplay.innerHTML = score
    }
  , 1500)


  setTimeout(function(){

    scorePeek.classList.remove('fading-font')


  }, 2000)


}



let fontSizeInc = 1;
function stopAnimation() {
  setTimeout(function(){
    document.querySelector('#score').classList.remove('animated-text')
    console.log('works!')
  },1000)

//multiplyScore()
//also, increase fontsize cuz... lol

document.querySelector('#score').style.fontSize = `${fontSizeInc}em`
fontSizeInc += 0.001



}

//let margin = Array.from(document.querySelectorAll('.ceiling'));
//let margin = squares[4]//[squares[0+(w*ceilingAdder)], squares[1+(w*ceilingAdder)], squares[2+(w*ceilingAdder)], squares[3-(w*ceilingAdder)], squares[4-(w*ceilingAdder)], squares[5-(w*ceilingAdder)], squares[6-(w*ceilingAdder)], squares[7-(w*ceilingAdder)], squares[8-(w*ceilingAdder)], squares[9-(w*ceilingAdder)]]

function newMargin(){
squares.forEach(cell => cell.classList.remove('ceiling'))
for (i=0;i<10;i++){
  squares[i].classList.add('ceiling')



}

}




function gameOver(){
//if (current.some(index => squares[currentPosition+index].classList.contains('taken'))){//ceiling
if (current.some(index => squares[currentPosition+index-w].classList.contains('ceiling')) && current.some(index => squares[currentPosition+index].classList.contains('taken'))){//ceiling

console.log('true lol')
play = false;
//   for (x in w){
//     squares[x].classList.remove('taken')
//     squares[x].style.backgroundColor = "black"
// }
  gameOverDisplay.innerHTML = 'ゲームオーバー' //ゲームオーバー'//'(╯°□°）╯︵ ┻━┻'
  clearInterval(timerId)
}

}



//enhancement proposals:
//add animation to #score everytime score is updated ✔
//add a score multiplier per row simultaneously resolved ✔
//modify animation duration ✔
//add x2 more rotations to TetrominoZ ✔
//show briefly new total ✔
//increase fall time periodically
