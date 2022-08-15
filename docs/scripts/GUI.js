import CellState from "./CellState.js";
import TicTacToe from "./TicTacToe.js";
import TicTacToePlayer from "./TicTacToePlayer.js";
import Player from "./Player.js";
import Cell from "./Cell.js";
import Winner from "./Winner.js";

class GUI {
    constructor() {
        this.game = null;
    }
    registerEvents() {
        this.init();
        let iniciar = document.querySelector("input[type='button']");
        iniciar.onclick = this.init.bind(this);
    }
    computerPlay() {
        let against = document.querySelector("#playAgainst");
        if (parseInt(against.value) === 0) {
            this.setMessage("Computing move...");
            let currentTurn = this.game.getTurn();
            let c = new TicTacToePlayer(currentTurn == Player.PLAYER1 ? CellState.PLAYER1 : CellState.PLAYER2, this.game);
            let ret = c.minimax(this.game.getBoard());
            if (ret.cell) {
                let d = ret.cell;
                try {
                    let mr = this.game.move(d);
                    let table = document.querySelector("table");
                    table.rows[d.x].cells[d.y].textContent = this.game.getTurn() === Player.PLAYER1 ? "O" : "X";
                    this.changeMessage(mr);
                } catch (ex) {
                    this.setMessage(ex.message);
                }
            }
        }
    }
    init() {
        let symbol = document.querySelector("#symbol");
        this.game = new TicTacToe(symbol.value === 'X' ? Player.PLAYER1 : Player.PLAYER2);
        let tab = this.game.getBoard();
        let tbody = document.querySelector("tbody");
        tbody.innerHTML = "";
        for (let i = 0; i < tab.length; i++) {
            let tr = document.createElement("tr");
            for (let j = 0; j < tab[i].length; j++) {
                let td = document.createElement("td");
                td.onclick = this.play.bind(this);
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        }
        this.changeMessage();
        let cp = document.querySelector("#currentPlayer");
        if (parseInt(cp.value) === 1) {
            this.computerPlay();
        }
    }
    coordinates(cell) {
        return new Cell(cell.parentNode.rowIndex, cell.cellIndex);
    }
    setMessage(message) {
        let msg = document.getElementById("message");
        msg.textContent = message;
    }
    changeMessage(m) {
        let winnerMSG = { DRAW: "Draw!", PLAYER2: "'O' win!", PLAYER1: "'X' win!" };
        if (winnerMSG[m]) {
            this.setMessage(`Game Over! ${winnerMSG[m]}`);
        } else {
            let turnMSG = { PLAYER1: "'X' turn.", PLAYER2: "'O' turn." };
            this.setMessage(turnMSG[this.game.getTurn()]);
        }
    }
    play(evt) {
        let td = evt.target;
        let cell = this.coordinates(td);
        try {
            let mr = this.game.move(cell);
            td.textContent = this.game.getTurn() === Player.PLAYER1 ? "O" : "X";
            this.changeMessage(mr);
            if (mr === Winner.NONE) {
                this.computerPlay();
            }
        } catch (ex) {
            this.setMessage(ex.message);
        }
    }
}
let gui = new GUI();
gui.registerEvents();