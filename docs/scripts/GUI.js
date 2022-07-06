import CellState from "./CellState.js";
import TicTacToe from "./TicTacToe.js";
import TicTacToePlayer from "./TicTacToePlayer.js";
import Player from "./Player.js";
import Cell from "./Cell.js";
import Winner from "./Winner.js";

function GUI() {
    let game;
    function registerEvents() {
        init();
        let iniciar = document.querySelector("input[type='button']");
        iniciar.onclick = init;
    }
    function computerPlay() {
        let against = document.querySelector("#playAgainst");
        if (parseInt(against.value) === 0) {
            setMessage("Computing move...");
            let currentTurn = game.getTurn();
            let c = new TicTacToePlayer(currentTurn == Player.PLAYER1 ? CellState.PLAYER1 : CellState.PLAYER2, game);
            let ret = c.minimax(game.getBoard());
            if (ret.cell) {
                let d = ret.cell;
                try {
                    let mr = game.move(d);
                    let table = document.querySelector("table");
                    table.rows[d.x].cells[d.y].textContent = game.getTurn() === Player.PLAYER1 ? "O" : "X";
                    changeMessage(mr);
                } catch (ex) {
                    setMessage(ex.message);
                }
            }
        }
    }
    function init() {
        let symbol = document.querySelector("#symbol");
        game = new TicTacToe(symbol.value === 'X' ? Player.PLAYER1 : Player.PLAYER2);
        let tab = game.getBoard();
        let tbody = document.querySelector("tbody");
        tbody.innerHTML = "";
        for (let i = 0; i < tab.length; i++) {
            let tr = document.createElement("tr");
            for (let j = 0; j < tab[i].length; j++) {
                let td = document.createElement("td");
                td.onclick = play;
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        }
        changeMessage();
        let cp = document.querySelector("#currentPlayer");
        if (parseInt(cp.value) === 1) {
            computerPlay();
        }
    }
    function coordinates(cell) {
        return new Cell(cell.parentNode.rowIndex, cell.cellIndex);
    }
    function setMessage(message) {
        let msg = document.getElementById("message");
        msg.textContent = message;
    }
    function changeMessage(m) {
        let winnerMSG = { DRAW: "Draw!", PLAYER2: "'O' win!", PLAYER1: "'X' win!" };
        if (winnerMSG[m]) {
            setMessage(`Game Over! ${winnerMSG[m]}`);
        } else {
            let turnMSG = { PLAYER1: "'X' turn.", PLAYER2: "'O' turn." };
            setMessage(turnMSG[game.getTurn()]);
        }
    }
    function play() {
        let cell = coordinates(this);
        try {
            let mr = game.move(cell);
            this.textContent = game.getTurn() === Player.PLAYER1 ? "O" : "X";
            changeMessage(mr);
            if (mr === Winner.NONE) {
                computerPlay();
            }
        } catch (ex) {
            setMessage(ex.message);
        }
    }
    return { registerEvents };
}
let gui = new GUI();
gui.registerEvents();