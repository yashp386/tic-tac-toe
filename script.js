let character = document.getElementById('character');
let obstacle = document.getElementById('obstacle');
let score = document.getElementById('score');
let startButton = document.getElementById('start-button');
let soundToggle = document.getElementById('sound-toggle');
let characterSelect = document.getElementById('character-select');
let game = document.getElementById('game');

let isJumping = false;
let isGameOver = false;
let scoreValue = 0;
let soundEnabled = true;
let jumpHeight = 0;
let jumpSpeed = 8; // Increased jump speed
let gravity = 3; // Adjusted gravity for higher jump
let maxJumpHeight = 200; // Increased maximum jump height

// Sound effects
const jumpSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
const gameOverSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2658/2658-preview.mp3');
const pointSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2570/2570-preview.mp3');

// Character selection
document.querySelectorAll('.character').forEach(char => {
    char.addEventListener('click', () => {
        document.querySelectorAll('.character').forEach(c => c.classList.remove('selected'));
        char.classList.add('selected');
        character.innerHTML = char.innerHTML;
    });
});

// Jump function with custom physics and animations
function jump() {
    if (!isJumping && !isGameOver) {
        isJumping = true;
        if (soundEnabled) jumpSound.play();
        
        // Add jumping animation class
        character.classList.add('jumping');
        
        let jumpInterval = setInterval(() => {
            // Get current bottom position
            let characterBottom = parseInt(window.getComputedStyle(character).getPropertyValue('bottom'));
            
            // Going up
            if (jumpHeight < maxJumpHeight) { // Using new maxJumpHeight
                character.style.bottom = (characterBottom + jumpSpeed) + 'px';
                jumpHeight += jumpSpeed;
            }
            // Coming down
            else if (characterBottom > 0) {
                // Remove jumping class and add falling class
                character.classList.remove('jumping');
                character.style.bottom = (characterBottom - gravity) + 'px';
            }
            // Landing
            else {
                clearInterval(jumpInterval);
                character.style.bottom = '0px';
                
                // Add landing animation
                character.classList.add('falling');
                
                // Remove animation classes after landing
                setTimeout(() => {
                    character.classList.remove('jumping', 'falling');
                    isJumping = false;
                    jumpHeight = 0;
                }, 200);
            }
        }, 20);
    }
}

// Start game
startButton.addEventListener('click', () => {
    if (character.innerHTML === '') {
        alert('Please select a character first!');
        return;
    }
    
    characterSelect.style.display = 'none';
    game.style.display = 'block';
    startButton.style.display = 'none';
    startGame();
});

// Toggle sound
soundToggle.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundToggle.innerHTML = soundEnabled ? '🔊' : '🔈';
});

// Game loop
function startGame() {
    isGameOver = false;
    scoreValue = 0;
    score.innerHTML = 'Score: 0';
    
    // Move obstacle
    let obstacleInterval = setInterval(() => {
        if (isGameOver) {
            clearInterval(obstacleInterval);
            return;
        }
        
        let obstacleLeft = parseInt(window.getComputedStyle(obstacle).getPropertyValue('left'));
        
        if (obstacleLeft < -20) {
            obstacle.style.left = '600px';
            scoreValue++;
            score.innerHTML = `Score: ${scoreValue}`;
            if (soundEnabled) pointSound.play();
        } else {
            obstacle.style.left = (obstacleLeft - 5) + 'px';
        }
        
        // Collision detection
        let characterBottom = parseInt(window.getComputedStyle(character).getPropertyValue('bottom'));
        if (obstacleLeft < 100 && obstacleLeft > 50 && characterBottom < 40) {
            gameOver();
            clearInterval(obstacleInterval);
        }
    }, 20);
}

// Game over
function gameOver() {
    isGameOver = true;
    if (soundEnabled) gameOverSound.play();
    alert(`Game Over! Score: ${scoreValue}`);
    location.reload();
}

// Event listeners
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        jump();
    }
});

document.addEventListener('touchstart', jump); 