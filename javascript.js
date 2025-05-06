function createPlayer (name){
    const playerName = name;
    let score = 0;
    const getScore = () => score;
    const addScore = () => score++;
    return { playerName, getScore, addScore};
}
const gameBoard = (() => {
    let board = ["","","","","","","","",""];
    const getBoard = () => board;
    const setCell = (index, marker) => {
        if(board[index] === ""){
            board[index] = marker;
            return true;
        }
        return false;
    }
    const resetBoard = () => {
        board = ["","","","","","","","",""];
    }
    return {getBoard, setCell, resetBoard};
})();
const gameController = (p1Name, p2Name) => {
    const player1 = createPlayer(p1Name);
    const player2 = createPlayer(p2Name);
    let currentPlayer = player1;
    let currentMarker = "X";
    let gameOver = false;
    const switchPlayer = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
        currentMarker = currentMarker === "X" ? "O" : "X";
    };
    const playRound = (index) => {
        if(gameOver){
            return;
        }
        if(gameBoard.setCell(index, currentMarker)){
            if(checkWin(gameBoard.getBoard(), currentMarker)){
                document.querySelector("#status").textContent = `${currentPlayer.playerName} wins!`;
                gameOver = true;
                currentPlayer.addScore();
                updateScore();
                return;
            }
            if(checkDraw(gameBoard.getBoard())){
                document.querySelector("#status").textContent = "It's a draw!";
                gameOver = true;
                return;
            }

        }
        else{
            return;
        }
        switchPlayer();
        document.querySelector("#status").textContent = `${currentPlayer.playerName}'s turn (${currentMarker})`;
    }
    const restart = () => {
        gameBoard.resetBoard();
        currentPlayer = player1;
        currentMarker = "X";
        gameOver = false;
        document.querySelector("#status").textContent = `${currentPlayer.playerName}'s turn (${currentMarker})`;
    }
    return {playRound, restart, player1, player2};
};
function checkWin(board, marker){
    const winCombinations = [
        [0,1,2], [3,4,5], [6,7,8],
        [0,3,6], [1,4,7], [2,5,8],
        [0,4,8], [2,4,6]
    ];
    return winCombinations.some(pattern =>
        pattern.every(index => board[index] === marker)
    );
}
function updateScore() {
    const scoreDiv = document.querySelector("#score");
    scoreDiv.textContent = `${gameControl.player1.playerName}: ${gameControl.player1.getScore()} | ${gameControl.player2.playerName}: ${gameControl.player2.getScore()}`;
}
function checkDraw(board) {
    return board.every(cell => cell !== "");
}
const displayGame = (() => {
    const boardElem = document.querySelector(".board");
    const restartBtn = document.querySelector("#restartBtn");
    const render = () => {
        const board = gameBoard.getBoard();
        boardElem.innerHTML = '';
        board.forEach((cell, index) => {
            const cellDiv = document.createElement('div');
            cellDiv.classList.add('cell');
            cellDiv.textContent = cell;
            cellDiv.addEventListener('click', () => {
                if (gameControl){
                    gameControl.playRound(index);
                    render(); 
                }
            });
            boardElem.appendChild(cellDiv);
            updateScore();
        });

    }
    restartBtn.addEventListener('click', () => {
        if(gameControl){
            gameControl.restart();
            render();
        }
    });
    return {render};
})();
let gameControl;
const startBtn = document.querySelector("#startBtn")

startBtn.addEventListener("click", () => {
    const p1 = document.querySelector("#player1Name").value.trim();
    const p2 = document.querySelector("#player2Name").value.trim();
    if (!p1 || !p2) {
        alert("Please enter names for both players.");
        return;
    }

    gameControl = gameController(p1, p2);


    document.querySelector("#setup").style.display = "none";
    document.querySelector("#gameArea").style.display = "block";
    updateScore();
    document.querySelector("#status").textContent = `${p1}'s turn (X)`;

    displayGame.render();
});