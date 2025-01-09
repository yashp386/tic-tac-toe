const cells = document.querySelectorAll('.cell');
const gameInfo = document.getElementById('game-info').querySelector('p');
const resetButton = document.getElementById('reset-button');
let currentPlayer = 'X'; // Player X starts
let gameActive = true; // Game is active
let board = ['', '', '', '', '', '', '', '', '']; // Game board

// Function to handle cell click
function handleCellClick(index) {
    if (board[index] !== '' || !gameActive) return; // Ignore if cell is already filled or game is over
    board[index] = currentPlayer; // Mark the cell
    cells[index].textContent = currentPlayer; // Update UI
    checkWin(); // Check for a win
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
            gameInfo.textContent = `${currentPlayer} Wins!`;
            gameActive = false; // End the game
            return;
        }
    }

    if (!board.includes('')) {
        gameInfo.textContent = 'It\'s a Draw!';
        gameActive = false; // End the game
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X'; // Switch player
        gameInfo.textContent = `Player ${currentPlayer}'s Turn`;
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