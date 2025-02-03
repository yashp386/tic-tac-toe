const cells = document.querySelectorAll('.cell');
const status = document.getElementById('status');
const resetBtn = document.getElementById('reset-btn');
const pvpBtn = document.getElementById('pvp-btn');
const pvcBtn = document.getElementById('pvc-btn');
const difficultySelection = document.getElementById('difficulty-selection');
const easyBtn = document.getElementById('easy-btn');
const mediumBtn = document.getElementById('medium-btn');
const hardBtn = document.getElementById('hard-btn');

let currentPlayer = 'X';
let gameActive = true;
let gameState = ['', '', '', '', '', '', '', '', ''];
let vsComputer = false;
let difficulty = 'easy'; // Default difficulty

const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
];

// Mode Selection
pvpBtn.addEventListener('click', () => {
    vsComputer = false;
    pvpBtn.classList.add('active');
    pvcBtn.classList.remove('active');
    difficultySelection.style.display = 'none';
    resetGame();
});

pvcBtn.addEventListener('click', () => {
    vsComputer = true;
    pvcBtn.classList.add('active');
    pvpBtn.classList.remove('active');
    difficultySelection.style.display = 'block';
    resetGame();
});

// Difficulty Selection
easyBtn.addEventListener('click', () => {
    difficulty = 'easy';
    updateDifficultyButtons(easyBtn);
    resetGame();
});

mediumBtn.addEventListener('click', () => {
    difficulty = 'medium';
    updateDifficultyButtons(mediumBtn);
    resetGame();
});

hardBtn.addEventListener('click', () => {
    difficulty = 'hard';
    updateDifficultyButtons(hardBtn);
    resetGame();
});

function updateDifficultyButtons(activeButton) {
    [easyBtn, mediumBtn, hardBtn].forEach(btn => btn.classList.remove('active'));
    activeButton.classList.add('active');
}

// Handle Cell Click
function handleCellClick(clickedCell, clickedCellIndex) {
    if (gameState[clickedCellIndex] !== '' || !gameActive) return;

    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;
    clickedCell.classList.add(currentPlayer.toLowerCase());

    if (checkWin()) {
        status.textContent = `Player ${currentPlayer} Wins!`;
        gameActive = false;
        celebrateWin();
        return;
    }

    if (checkDraw()) {
        status.textContent = 'Game Draw!';
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    status.textContent = `Player ${currentPlayer}'s Turn`;

    if (vsComputer && currentPlayer === 'O' && gameActive) {
        setTimeout(computerMove, 500);
    }
}

// Computer Move based on difficulty
function computerMove() {
    let move;
    switch(difficulty) {
        case 'easy':
            move = getRandomMove();
            break;
        case 'medium':
            move = Math.random() < 0.5 ? getBestMove() : getRandomMove();
            break;
        case 'hard':
            move = getBestMove();
            break;
    }
    handleCellClick(cells[move], move);
}

// Random move for easy difficulty
function getRandomMove() {
    let availableMoves = gameState.reduce((acc, cell, index) => {
        if (cell === '') acc.push(index);
        return acc;
    }, []);
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
}

// Best move for hard difficulty (Minimax algorithm)
function getBestMove() {
    let bestScore = -Infinity;
    let bestMove;
    
    for(let i = 0; i < gameState.length; i++) {
        if(gameState[i] === '') {
            gameState[i] = 'O';
            let score = minimax(gameState, 0, false);
            gameState[i] = '';
            if(score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }
    return bestMove;
}

// Minimax algorithm for AI
function minimax(board, depth, isMaximizing) {
    let result = checkWinForMinimax();
    if(result !== null) {
        return result;
    }

    if(isMaximizing) {
        let bestScore = -Infinity;
        for(let i = 0; i < board.length; i++) {
            if(board[i] === '') {
                board[i] = 'O';
                let score = minimax(board, depth + 1, false);
                board[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for(let i = 0; i < board.length; i++) {
            if(board[i] === '') {
                board[i] = 'X';
                let score = minimax(board, depth + 1, true);
                board[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

// Helper function for minimax
function checkWinForMinimax() {
    for(let condition of winningConditions) {
        if(gameState[condition[0]] === gameState[condition[1]] && 
           gameState[condition[1]] === gameState[condition[2]] && 
           gameState[condition[0]] !== '') {
            if(gameState[condition[0]] === 'O') return 1;
            return -1;
        }
    }
    
    if(!gameState.includes('')) return 0;
    return null;
}

// Check Win
function checkWin() {
    return winningConditions.some(condition => {
        return condition.every(index => {
            return gameState[index] === currentPlayer;
        });
    });
}

// Check Draw
function checkDraw() {
    return !gameState.includes('');
}

// Reset Game
function resetGame() {
    currentPlayer = 'X';
    gameActive = true;
    gameState = ['', '', '', '', '', '', '', '', ''];
    status.textContent = `Player ${currentPlayer}'s Turn`;
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o');
    });
}

// Add celebration function
function celebrateWin() {
    // First burst of confetti
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });

    // Multiple bursts of confetti
    let end = Date.now() + (2 * 1000); // 2 seconds of celebration

    let colors = ['#ff0000', '#00ff00', '#0000ff'];

    (function frame() {
        confetti({
            particleCount: 3,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: colors
        });
        
        confetti({
            particleCount: 3,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: colors
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());

    // Final burst after a delay
    setTimeout(() => {
        confetti({
            particleCount: 150,
            spread: 100,
            origin: { y: 0.6 }
        });
    }, 500);
}

// Event Listeners
cells.forEach((cell, index) => {
    cell.addEventListener('click', () => handleCellClick(cell, index));
});

resetBtn.addEventListener('click', resetGame); 