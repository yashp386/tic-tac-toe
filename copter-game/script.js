const gameContainer = document.getElementById('game-container');
const copter = document.getElementById('copter');
const scoreElement = document.getElementById('score');
const startScreen = document.getElementById('start-screen');
const startButton = document.getElementById('start-button');

let isGameRunning = false;
let score = 0;
let gravity = 2;
let lift = -4;
let copterY = 200;
let gameLoop;
let obstacleLoop;
let isSpacePressed = false;

function updateCopterPosition() {
    if (isSpacePressed) {
        copterY += lift;
    }
    copterY += gravity;
    
    // Keep copter within game bounds
    if (copterY < 0) copterY = 0;
    if (copterY > gameContainer.offsetHeight - copter.offsetHeight) {
        copterY = gameContainer.offsetHeight - copter.offsetHeight;
        endGame();
    }
    
    copter.style.top = copterY + 'px';
    copter.style.transform = isSpacePressed ? 'rotate(-20deg)' : 'rotate(20deg)';
}

function createObstacle() {
    const obstacle = document.createElement('div');
    obstacle.className = 'obstacle';
    
    // Random height for top and bottom obstacles
    const gap = 150;
    const topHeight = Math.random() * (gameContainer.offsetHeight - gap);
    const bottomHeight = gameContainer.offsetHeight - topHeight - gap;
    
    // Create top obstacle
    const topObstacle = obstacle.cloneNode();
    topObstacle.style.height = topHeight + 'px';
    topObstacle.style.top = '0';
    
    // Create bottom obstacle
    const bottomObstacle = obstacle.cloneNode();
    bottomObstacle.style.height = bottomHeight + 'px';
    bottomObstacle.style.bottom = '0';
    
    gameContainer.appendChild(topObstacle);
    gameContainer.appendChild(bottomObstacle);
    
    let obstacleX = gameContainer.offsetWidth;
    
    function moveObstacle() {
        obstacleX -= 2;
        topObstacle.style.right = gameContainer.offsetWidth - obstacleX + 'px';
        bottomObstacle.style.right = gameContainer.offsetWidth - obstacleX + 'px';
        
        // Check collision
        if (checkCollision(topObstacle) || checkCollision(bottomObstacle)) {
            endGame();
        }
        
        // Remove obstacles when off screen
        if (obstacleX + obstacle.offsetWidth < 0) {
            topObstacle.remove();
            bottomObstacle.remove();
            score++;
            scoreElement.textContent = `Score: ${score}`;
        }
    }
    
    return moveObstacle;
}

function checkCollision(obstacle) {
    const copterRect = copter.getBoundingClientRect();
    const obstacleRect = obstacle.getBoundingClientRect();
    
    return !(copterRect.right < obstacleRect.left || 
             copterRect.left > obstacleRect.right || 
             copterRect.bottom < obstacleRect.top || 
             copterRect.top > obstacleRect.bottom);
}

function startGame() {
    isGameRunning = true;
    score = 0;
    copterY = 200;
    scoreElement.textContent = 'Score: 0';
    startScreen.style.display = 'none';
    
    // Clear existing obstacles
    document.querySelectorAll('.obstacle').forEach(obs => obs.remove());
    
    // Game loops
    let obstacles = [];
    
    gameLoop = setInterval(() => {
        updateCopterPosition();
        obstacles.forEach(moveObstacle => moveObstacle());
        obstacles = obstacles.filter(obs => obs !== null);
    }, 20);
    
    obstacleLoop = setInterval(() => {
        obstacles.push(createObstacle());
    }, 3000);
}

function endGame() {
    isGameRunning = false;
    clearInterval(gameLoop);
    clearInterval(obstacleLoop);
    startScreen.style.display = 'flex';
    startScreen.querySelector('h1').textContent = `Game Over! Score: ${score}`;
}

// Event listeners
startButton.addEventListener('click', startGame);

document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        event.preventDefault();
        isSpacePressed = true;
    }
});

document.addEventListener('keyup', (event) => {
    if (event.code === 'Space') {
        isSpacePressed = false;
    }
});

// Mobile support
document.addEventListener('touchstart', (event) => {
    event.preventDefault();
    isSpacePressed = true;
});

document.addEventListener('touchend', () => {
    isSpacePressed = false;
});