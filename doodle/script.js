const dino = document.getElementById('dino');
const obstacle = document.getElementById('obstacle');
const scoreDisplay = document.getElementById('score');
let score = 0;
let isJumping = false;

// Function to make the dino jump
function jump() {
    if (isJumping) return;
    isJumping = true;

    dino.classList.add('jump');

    setTimeout(() => {
        dino.classList.remove('jump');
        isJumping = false;
    }, 500); // Duration of the jump
}

// Function to check for collision
function checkCollision() {
    const dinoRect = dino.getBoundingClientRect();
    const obstacleRect = obstacle.getBoundingClientRect();

    if (
        dinoRect.x < obstacleRect.x + obstacleRect.width &&
        dinoRect.x + dinoRect.width > obstacleRect.x &&
        dinoRect.y < obstacleRect.y + obstacleRect.height &&
        dinoRect.height + dinoRect.y > obstacleRect.y
    ) {
        alert('Game Over! Your score: ' + score);
        clearInterval(scoreInterval);
        location.reload(); // Reload the game
    }
}

// Increase score over time
const scoreInterval = setInterval(() => {
    score++;
    scoreDisplay.innerText = 'Score: ' + score;
}, 1000);

// Event listener for jump
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        jump();
    }
});

