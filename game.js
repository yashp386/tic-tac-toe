const cells = document.querySelectorAll('.cell');
const gameInfo = document.getElementById('game-info').querySelector('p');
const resetButton = document.getElementById('reset-button');
let currentPlayer = 'X'; // Player X starts
let gameActive = true; // Game is active
let board = ['', '', '', '', '', '', '', '', '']; // Game board
let isComputerMode = false; // Flag to check if playing against computer

// Check URL parameters to set game mode
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('mode') === 'computer') {
    isComputerMode = true; // Set to true if playing against computer
}

// Function to handle cell click
function handleCellClick(index) {
    if (board[index] !== '' || !gameActive) return; // Ignore if cell is already filled or game is over
    board[index] = currentPlayer; // Mark the cell
    cells[index].textContent = currentPlayer; // Update UI

    // Change color based on the current player
    if (currentPlayer === 'X') {
        cells[index].style.color = '#FF5733'; // Color for X (e.g., red)
    } else {
        cells[index].style.color = '#33C1FF'; // Color for O (e.g., blue)
    }

    checkWin(); // Check for a win

    // Switch player only if not in computer mode
    if (!isComputerMode) {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X'; // Switch player
        gameInfo.textContent = `Player ${currentPlayer}'s Turn`;
    } else if (gameActive) {
        currentPlayer = 'O'; // Set computer's symbol
        setTimeout(computerMove, 500); // Delay for computer's move
    }
}

// Function for computer's move
function computerMove() {
    const availableCells = Array.from(cells).filter(cell => !cell.textContent);
    if (availableCells.length > 0) {
        const randomCell = availableCells[Math.floor(Math.random() * availableCells.length)];
        const index = Array.from(cells).indexOf(randomCell);
        handleCellClick(index); // Call handleCellClick for the computer's move
    }
}

// Function to check for a win or draw
function checkWin() {
    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    for (let condition of winningConditions) {
        const [a, b, c] = condition;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            alert(`${currentPlayer} Wins!`); // Alert the winner
            gameActive = false; // End the game
            return;
        }
    }

    if (!board.includes('')) {
        alert('It\'s a Draw!'); // Alert for a draw
        gameActive = false; // End the game
    }
}

// Function to reset the game
function resetGame() {
    board = ['', '', '', '', '', '', '', '', '']; // Reset board
    gameActive = true; // Reset game status
    currentPlayer = 'X'; // Reset to Player X
    gameInfo.textContent = `Player ${currentPlayer}'s Turn`;
    cells.forEach(cell => cell.textContent = ''); // Clear UI
}

// Event listeners for cells and reset button
cells.forEach((cell, index) => {
    cell.classList.add('cell'); // Add class for styling
    cell.addEventListener('click', () => handleCellClick(index));
});
resetButton.addEventListener('click', resetGame);

// Initialize game info
gameInfo.textContent = `Player ${currentPlayer}'s Turn`; 