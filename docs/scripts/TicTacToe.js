import Player from "./Player.js";
import CellState from "./CellState.js";
import Winner from "./Winner.js";

export default class TicTacToe {
    constructor(player) {
        this.turn = player;
        this.rows = 3;
        this.cols = 3;
        this.board = [
            [CellState.EMPTY, CellState.EMPTY, CellState.EMPTY],
            [CellState.EMPTY, CellState.EMPTY, CellState.EMPTY],
            [CellState.EMPTY, CellState.EMPTY, CellState.EMPTY]
        ];    
    }
    getBoard() {
        return this.board;
    }

    getTurn() {
        return this.turn;
    }

    onBoard({ x, y }) {
        let inLimit = (value, limit) => value >= 0 && value < limit;
        return (inLimit(x, this.rows) && inLimit(y, this.cols));
    }

    move(cell) {
        let { x: or, y: oc } = cell;
        if (!this.onBoard(cell)) {
            throw new Error("Cell is not on board.");
        }
        if (this.board[or][oc] !== CellState.EMPTY) {
            throw new Error("Cell is not empty.");
        }
        this.board[or][oc] = this.turn === Player.PLAYER1 ? CellState.PLAYER1 : CellState.PLAYER2;
        this.turn = (this.turn === Player.PLAYER1) ? Player.PLAYER2 : Player.PLAYER1;
        return this.endOfGame();
    }

    endOfGame(matrix = this.board) {
        let testRow = (row) => {
            let p1 = matrix[row].every(x => x === CellState.PLAYER1);
            let p2 = matrix[row].every(x => x === CellState.PLAYER2);
            return p1 || p2;
        };
        for (let i = 0; i < this.rows; i++) {
            if (testRow(i)) {
                return matrix[i][0] === CellState.PLAYER1 ? Winner.PLAYER1 : Winner.PLAYER2;
            }
        }
        let testColumn = (col) => {
            let p1 = matrix.map(a => a[col]).every(x => x === CellState.PLAYER1);
            let p2 = matrix.map(a => a[col]).every(x => x === CellState.PLAYER2);
            return p1 || p2;
        };
        for (let i = 0; i < this.cols; i++) {
            if (testColumn(i)) {
                return matrix[0][i] === CellState.PLAYER1 ? Winner.PLAYER1 : Winner.PLAYER2;
            }
        }
        let testMainDiagonal = () => {
            let cells = [];
            for (let i = 0, max = this.rows; i < max; i++) {
                cells.push(matrix[i][i]);
            }
            let p1 = cells.every(x => x === CellState.PLAYER1);
            let p2 = cells.every(x => x === CellState.PLAYER2);
            return p1 || p2;
        };
        let testSecondDiagonal = () => {
            let cells = [];
            for (let i = 0, j = this.rows - 1, max = this.rows; i < max; i++, j--) {
                cells.push(matrix[i][j]);
            }
            let p1 = cells.every(x => x === CellState.PLAYER1);
            let p2 = cells.every(x => x === CellState.PLAYER2);
            return p1 || p2;
        };
        if (testMainDiagonal() || testSecondDiagonal()) {
            return matrix[1][1] === CellState.PLAYER1 ? Winner.PLAYER1 : Winner.PLAYER2;
        }
        let count = matrix.flat().filter(x => x === CellState.EMPTY).length;
        return count === 0 ? Winner.DRAW : Winner.NONE;
    }
}