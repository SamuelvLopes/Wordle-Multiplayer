import Cell from "./Cell.js";

function GUI() {
    let ws = null;
    let player = null;
    const images = { PLAYER1: "X", PLAYER2: "O" };
    const closeCodes = { ENDGAME: { code: 4000, description: "End of game." }, ADVERSARY_QUIT: { code: 4001, description: "The opponent quit the game" } };
    function coordinates(cell) {
        return new Cell(cell.parentNode.rowIndex, cell.cellIndex);
    }
    function setMessage(msg) {
        let message = document.getElementById("message");
        message.innerHTML = msg;
    }
    function readData(evt) {
        let data = JSON.parse(evt.data);
        switch (data.type) {
            case "OPEN":
                /* Informando cor da peça do usuário atual */
                player = data.turn;
                setMessage("Waiting for opponent.");
                clearBoard();
                break;
            case "MESSAGE":
                /* Recebendo o tabuleiro modificado */
                printBoard(data.board);
                setMessage(data.turn === player ? "Your turn." : "Opponent's turn.");
                break;
            case "ENDGAME":
                /* Fim do jogo */
                printBoard(data.board);
                ws.close(closeCodes.ENDGAME.code, closeCodes.ENDGAME.description);
                endGame(data.winner);
                break;
        }
    }
    function endGame(type) {
        unsetEvents();
        ws = null;
        setButtonText(true);
        setMessage(`Game Over! ${(type === "DRAW") ? "Draw!" : (type === player ? "You win!" : "You lose!")}`);
    }
    function setButtonText(on) {
        let button = document.querySelector("input[type='button']");
        button.value = (on) ? "Start" : "Quit";
    }
    function clearBoard() {
        let cells = document.querySelectorAll("td");
        cells.forEach(td => {
            td.innerHTML = "";
            td.className = "";
            td.onclick = undefined;
        });
    }
    function unsetEvents() {
        let cells = document.querySelectorAll("td");
        cells.forEach(td => td.onclick = undefined);
    }
    function play() {
        let begin = coordinates(this);
        ws.send(JSON.stringify(begin));
    }
    function printBoard(matrix) {
        let tbody = document.querySelector("tbody");
        tbody.innerHTML = "";
        for (let i = 0; i < matrix.length; i++) {
            let tr = document.createElement("tr");
            for (let j = 0; j < matrix[i].length; j++) {
                let td = document.createElement("td");
                td.innerHTML = "";
                td.className = "";
                td.onclick = play;
                switch (matrix[i][j]) {
                    case "PLAYER1":
                    case "PLAYER2":
                        td.innerHTML = images[matrix[i][j]];
                        break;
                }
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        }
    }
    function startGame() {
        if (ws) {
            ws.close(closeCodes.ADVERSARY_QUIT.code, closeCodes.ADVERSARY_QUIT.description);
            endGame();
        } else {
            ws = new WebSocket("ws://" + document.location.host + document.location.pathname + "tictactoe");
            ws.onmessage = readData;
            setButtonText(false);
        }
    }
    function init() {
        let button = document.querySelector("input[type='button']");
        button.onclick = startGame;
        setButtonText(true);
    }

    return { init };
}
let gui = new GUI();
gui.init();
