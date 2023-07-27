// Define variables to store game elements and properties
let board;              // HTML5 Canvas element
let boardWidth = 360;   // Width of the canvas
let boardHeight = 640;  // Height of the canvas
let context;            // Canvas context for drawing

// Bird properties
let birdWidth = 34;     // Width of the bird sprite
let birdHeight = 24;    // Height of the bird sprite
let birdX = boardWidth / 8; // Initial X position of the bird
let birdY = boardHeight / 2; // Initial Y position of the bird
let birdImg;            // Image object for the bird sprite

// Define an object representing the bird
let bird = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight
};

// Array to store pipes
let pipeArray = [];

// Pipe properties
let pipeWidth = 64;     // Width of the pipe
let pipeHeight = 512;   // Height of the pipe
let pipeX = boardWidth; // Initial X position of the pipe
let pipeY = 0;          // Initial Y position of the pipe

// Image objects for the top and bottom pipes
let topPipeImg;
let bottomPipeImg;

// Variables to control bird movement
let velocityX = -2;     // Horizontal velocity
let velocityY = 0;      // Vertical velocity
let gravity = 0.4;      // Gravity effect

// Game state variables
let gameOver = false;   // Flag to indicate if the game is over
let score = 0;          // Player's score


// Wait for the window to load before setting up the game

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); 

    // Load the bird image
    birdImg = new Image();
    birdImg.src = "assets/images/flappybird.png";
    birdImg.onload = function() {
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }

    topPipeImg = new Image();
    topPipeImg.src = "assets/images/toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "assets/images/bottompipe.png";


    // Start the game loop by calling the update function
    requestAnimationFrame(update);
    // Create pipes at regular intervals using setInterval
    setInterval(placePipes, 1500); 
    // Listen for keydown events to control bird movement
    document.addEventListener("keydown", moveBird);
}

function update() {
    requestAnimationFrame(update);

    // If the game is over, stop updating the game
    if (gameOver) {
        return;
    }

    // Clear the canvas for the next frame
    context.clearRect(0, 0, board.width, board.height);

    // Apply gravity to the bird's vertical velocity
    velocityY += gravity;

    // Update the bird's position based on its velocity
    bird.y = Math.max(bird.y + velocityY, 0); // Ensure the bird doesn't go above the canvas

    // Draw the bird on the canvas
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    // Check if the bird has hit the ground
    if (bird.y > board.height) {
        gameOver = true;
    }

    // Iterate through each pipe in the pipeArray
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];

        // Move the pipe to the left
        pipe.x += velocityX;

        // Draw the pipe on the canvas
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        // Check if the bird has passed the pipe to update the score
        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5; // Increment score by 0.5 for each pipe passed
            pipe.passed = true;
        }

        // Check for collision between the bird and the pipe
        if (detectCollision(bird, pipe)) {
            gameOver = true;
        }
    }

    // Remove pipes that have moved off the canvas to optimize performance
    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift(); // Remove the first pipe from the array
    }

    // Draw the score on the canvas
    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(score, 5, 45);

    // If the game is over, display "GAME OVER" on the canvas
    if (gameOver) {
        context.fillText("GAME OVER", 5, 90);
    }
}

// Function to create and position new pipes
function placePipes() {
    // If the game is over, stop creating new pipes
    if (gameOver) {
        return;
    }

    // Calculate a random Y position for the opening of the pipes
    let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
    let openingSpace = board.height / 4;

    // Create a new top pipe object
    let topPipe = {
        img: topPipeImg,
        x: pipeX,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    };
    pipeArray.push(topPipe);

    // Create a new bottom pipe object
    let bottomPipe = {
        img: bottomPipeImg,
        x: pipeX,
        y: randomPipeY + pipeHeight + openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    };
    pipeArray.push(bottomPipe);
}

// Function to handle bird movement when the user presses a key
function moveBird(e) {
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") {
        // Give the bird an upward velocity when the user presses a key
        velocityY = -6;

        // If the game is over, reset the game when the user presses a key
        if (gameOver) {
            bird.y = birdY;
            pipeArray = [];
            score = 0;
            gameOver = false;
        }
    }
}

// Function to detect collision between two objects (a and b)
function detectCollision(a, b) {
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}