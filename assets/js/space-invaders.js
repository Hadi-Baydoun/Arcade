// Define game elements and properties
let tileSize = 32;          // Size of a single tile (in pixels)
let rows = 16;              // Number of rows on the game board
let columns = 16;           // Number of columns on the game board

let board;                  // HTML5 Canvas element
let boardWidth = tileSize * columns; // Width of the game board (in pixels)
let boardHeight = tileSize * rows;   // Height of the game board (in pixels)
let context;                // Canvas context for drawing

let shipWidth = tileSize * 2;   // Width of the player's ship
let shipHeight = tileSize;      // Height of the player's ship
let shipX = tileSize * columns / 2 - tileSize; // Initial X position of the player's ship
let shipY = tileSize * rows - tileSize * 2;   // Initial Y position of the player's ship

// Define an object representing the player's ship
let ship = {
    x: shipX,
    y: shipY,
    width: shipWidth,
    height: shipHeight
};

let shipImg;                // Image object for the player's ship
let shipVelocityX = tileSize;   // Horizontal velocity of the player's ship

let alienArray = [];        // Array to store alien objects
let alienWidth = tileSize * 2;  // Width of each alien
let alienHeight = tileSize;     // Height of each alien
let alienX = tileSize;          // Initial X position of the first alien
let alienY = tileSize;          // Initial Y position of the first alien
let alienImg;               // Image object for the aliens

let alienRows = 2;          // Number of rows of aliens
let alienColumns = 3;       // Number of columns of aliens
let alienCount = 0;         // Count of active aliens on the screen
let alienVelocityX = 1;     // Horizontal velocity of the aliens

let bulletArray = [];       // Array to store bullets
let bulletVelocityY = -10;  // Vertical velocity of bullets

let score = 0;              // Player's score
let gameOver = false;       // Flag to indicate if the game is over


// Wait for the window to load before setting up the game
window.onload = function() {
    // Get the canvas element and context
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d"); 

    // Load the player's ship image
    shipImg = new Image();
    shipImg.src = "assets/images/ship.png";
    shipImg.onload = function() {
        // Draw the player's ship on the canvas
        context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);
    }

    // Load the alien image and create aliens
    alienImg = new Image();
    alienImg.src = "assets/images/alien.png";
    createAliens();

    // Start the game loop by calling the update function
    requestAnimationFrame(update);

    // Listen for key events to control the player's ship and shoot bullets
    document.addEventListener("keydown", moveShip);
    document.addEventListener("keyup", shoot);
}

// The game loop responsible for updating and drawing the game
function update() {
    requestAnimationFrame(update);

    // If the game is over, stop updating the game
    if (gameOver) {
        return;
    }

    // Clear the canvas for the next frame
    context.clearRect(0, 0, board.width, board.height);

    // Draw the player's ship on the canvas
    context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);

    // Update the position of each alien and check for collisions with the walls
    for (let i = 0; i < alienArray.length; i++) {
        let alien = alienArray[i];
        if (alien.alive) {
            alien.x += alienVelocityX;

            // If an alien hits the left or right wall, reverse their horizontal direction
            if (alien.x + alien.width >= board.width || alien.x <= 0) {
                alienVelocityX *= -1;
                alien.x += alienVelocityX * 2;

                // Move all aliens down when they hit the wall
                for (let j = 0; j < alienArray.length; j++) {
                    alienArray[j].y += alienHeight;
                }
            }

            // Draw the alien on the canvas
            context.drawImage(alienImg, alien.x, alien.y, alien.width, alien.height);

            // Check if any aliens have reached the player's ship (game over condition)
            if (alien.y >= ship.y) {
                gameOver = true;
            }
        }
    }

    // Update the position of each bullet and check for collisions with aliens
    for (let i = 0; i < bulletArray.length; i++) {
        let bullet = bulletArray[i];
        bullet.y += bulletVelocityY;
        context.fillStyle = "white";
        context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

        // Check for collisions between bullets and aliens
        for (let j = 0; j < alienArray.length; j++) {
            let alien = alienArray[j];
            if (!bullet.used && alien.alive && detectCollision(bullet, alien)) {
                bullet.used = true;
                alien.alive = false;
                alienCount--;
                score += 100;
            }
        }
    }

    // Remove bullets that have moved off the canvas or hit aliens
    while (bulletArray.length > 0 && (bulletArray[0].used || bulletArray[0].y < 0)) {
        bulletArray.shift(); 
    }

    // Check if all aliens are destroyed and level up
    if (alienCount == 0) {
        // Increase the player's score based on the number of aliens destroyed
        score += alienColumns * alienRows * 100; 

        // Increase the number of aliens and their speed
        alienColumns = Math.min(alienColumns + 1, columns / 2 - 2); 
        alienRows = Math.min(alienRows + 1, rows - 4);  
        if (alienVelocityX > 0) {
            alienVelocityX += 0.2; 
        }
        else {
            alienVelocityX -= 0.2; 
        }

        // Clear alien and bullet arrays and create new aliens for the next level
        alienArray = [];
        bulletArray = [];
        createAliens();
    }

    // Draw the player's score on the canvas
    context.fillStyle = "white";
    context.font = "16px courier";
    context.fillText(score, 5, 20);
}

// Function to handle player ship movement when a key is pressed
function moveShip(e) {
    if (gameOver) {
        return;
    }
    // Move the player's ship left or right based on the pressed key
    if (e.code == "ArrowLeft" && ship.x - shipVelocityX >= 0) {
        ship.x -= shipVelocityX; 
    }
    else if (e.code == "ArrowRight" && ship.x + shipVelocityX + ship.width <= board.width) {
        ship.x += shipVelocityX; 
    }
}

// Function to create and position new aliens
function createAliens() {
    for (let c = 0; c < alienColumns; c++) {
        for (let r = 0; r < alienRows; r++) {
            let alien = {
                img : alienImg,
                x : alienX + c*alienWidth,
                y : alienY + r*alienHeight,
                width : alienWidth,
                height : alienHeight,
                alive : true
            }
            alienArray.push(alien);
        }
    }
    alienCount = alienArray.length;
}

// Function to shoot bullets when the Space key is pressed
function shoot(e) {
    if (gameOver) {
        return;
    }

    // Create a new bullet when the Space key is pressed
    if (e.code == "Space") {
        
        let bullet = {
            x : ship.x + shipWidth*15/32,
            y : ship.y,
            width : tileSize/8,
            height : tileSize/2,
            used : false
        }
        bulletArray.push(bullet);
    }
}

// Function to detect collision between two objects (a and b)
function detectCollision(a, b) {
    return a.x < b.x + b.width &&   
           a.x + a.width > b.x &&   
           a.y < b.y + b.height &&  
           a.y + a.height > b.y;    
}
