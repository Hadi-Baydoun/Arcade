// Selecting elements and defining constants
const grid = document.querySelector('.grid') // The grid element
const scoreDisplay = document.querySelector('#score') // Element to display the score
const blockWidth = 100 // Width of each block
const blockHeight = 20 // Height of each block
const ballDiameter = 20 // Diameter of the ball
const boardWidth = 560 // Width of the game board
const boardHeight = 300 // Height of the game board
let xDirection = -2 // Horizontal direction of the ball (left: -2, right: 2)
let yDirection = 2 // Vertical direction of the ball (up: -2, down: 2)

// Starting positions for the user and the ball
const userStart = [230, 10] // Initial position of the user
let currentPosition = userStart // Current position of the user

const ballStart = [270, 40] // Initial position of the ball
let ballCurrentPosition = ballStart // Current position of the ball

let timerId // Timer ID to control the ball movement
let score = 0 // Current score


// Block class to represent each block on the board
class Block {
  constructor(xAxis, yAxis) {
    this.bottomLeft = [xAxis, yAxis]  // Bottom-left corner of the block
    this.bottomRight = [xAxis + blockWidth, yAxis]  // Bottom-right corner of the block
    this.topRight = [xAxis + blockWidth, yAxis + blockHeight]  // Top-right corner of the block
    this.topLeft = [xAxis, yAxis + blockHeight]  // Top-left corner of the block
  }
}

// Creating instances of the Block class to represent all the blocks on the board
const blocks = [
  new Block(10, 270),
  new Block(120, 270),
  new Block(230, 270),
  new Block(340, 270),
  new Block(450, 270),
  new Block(10, 240),
  new Block(120, 240),
  new Block(230, 240),
  new Block(340, 240),
  new Block(450, 240),
  new Block(10, 210),
  new Block(120, 210),
  new Block(230, 210),
  new Block(340, 210),
  new Block(450, 210),
]

// Function to add the blocks to the grid
function addBlocks() {
  for (let i = 0; i < blocks.length; i++) {
    const block = document.createElement('div')
    block.classList.add('block')
    block.style.left = blocks[i].bottomLeft[0] + 'px'  
    block.style.bottom = blocks[i].bottomLeft[1] + 'px'  
    grid.appendChild(block)
    console.log(blocks[i].bottomLeft)
  }
}
addBlocks()

// Adding user and ball elements to the grid and drawing their initial positions
const user = document.createElement('div')
user.classList.add('user')
grid.appendChild(user)
drawUser()

const ball = document.createElement('div')
ball.classList.add('ball')
grid.appendChild(ball)
drawBall()

// Function to move the user when arrow keys are pressed
function moveUser(e) {
  switch (e.key) {
    case 'ArrowLeft':
      if (currentPosition[0] > 0) {
        currentPosition[0] -= 10
        console.log(currentPosition[0] > 0)
        drawUser()   
      }
      break
    case 'ArrowRight':
      if (currentPosition[0] < (boardWidth - blockWidth)) {
        currentPosition[0] += 10
        console.log(currentPosition[0])
        drawUser()   
      }
      break
  }
}
document.addEventListener('keydown', moveUser)

// Function to draw the user at its current position
function drawUser() {
  user.style.left = currentPosition[0] + 'px'
  user.style.bottom = currentPosition[1] + 'px'
}

// Function to draw the ball at its current position
function drawBall() {
  ball.style.left = ballCurrentPosition[0] + 'px'
  ball.style.bottom = ballCurrentPosition[1] + 'px'
}

// Function to move the ball
function moveBall() {
    ballCurrentPosition[0] += xDirection
    ballCurrentPosition[1] += yDirection
    drawBall()
    checkForCollisions()
}
timerId = setInterval(moveBall, 15)

// Function to check for collisions with blocks, walls, and the user
function checkForCollisions() {
 // Check for block collisions
  for (let i = 0; i < blocks.length; i++){
    if
    (
      (ballCurrentPosition[0] > blocks[i].bottomLeft[0] && ballCurrentPosition[0] < blocks[i].bottomRight[0]) &&
      ((ballCurrentPosition[1] + ballDiameter) > blocks[i].bottomLeft[1] && ballCurrentPosition[1] < blocks[i].topLeft[1]) 
    )
      {
        // Remove the collided block from the array and update score
      const allBlocks = Array.from(document.querySelectorAll('.block'))
      allBlocks[i].classList.remove('block')
      blocks.splice(i,1)
      changeDirection()   
      score++
      scoreDisplay.innerHTML = score

      // Check if all blocks are cleared to display victory message and stop the game
      if (blocks.length == 0) {
        scoreDisplay.innerHTML = 'You Won!'
        clearInterval(timerId)
        document.removeEventListener('keydown', moveUser)
      }
    }
  }
  // Check for wall collisions
  if (ballCurrentPosition[0] >= (boardWidth - ballDiameter) || ballCurrentPosition[0] <= 0 || ballCurrentPosition[1] >= (boardHeight - ballDiameter))
  {
    changeDirection()
  }

  // Check for user collision
  if
  (
    (ballCurrentPosition[0] > currentPosition[0] && ballCurrentPosition[0] < currentPosition[0] + blockWidth) &&
    (ballCurrentPosition[1] > currentPosition[1] && ballCurrentPosition[1] < currentPosition[1] + blockHeight ) 
  )
  {
    changeDirection()
  }

  // Check for game over (ball reaches the top of the grid)
  if (ballCurrentPosition[1] <= 0) {
    clearInterval(timerId)
    scoreDisplay.innerHTML = 'You lost!'
    document.removeEventListener('keydown', moveUser)
  }
}

// Function to change the ball direction when it collides with objects
function changeDirection() {
  if (xDirection === 2 && yDirection === 2) {
    yDirection = -2
    return
  }
  if (xDirection === 2 && yDirection === -2) {
    xDirection = -2
    return
  }
  if (xDirection === -2 && yDirection === -2) {
    yDirection = 2
    return
  }
  if (xDirection === -2 && yDirection === 2) {
    xDirection = 2
    return
  }
}