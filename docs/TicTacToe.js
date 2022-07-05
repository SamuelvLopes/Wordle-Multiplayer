import { Player } from "./Player.js";
import { CellState } from "./CellState.js";
import { Winner } from "./Winner.js";

function TicTacToe(player) {
    let turn = player;
    let rows = 3;
    let cols = 3;
    let board = [
        [CellState.EMPTY, CellState.EMPTY, CellState.EMPTY],
        [CellState.EMPTY, CellState.EMPTY, CellState.EMPTY],
        [CellState.EMPTY, CellState.EMPTY, CellState.EMPTY]
    ];
    function getBoard() {
        return board;
    }

    function getTurn() {
        return turn;
    }

    function onBoard({ x, y }) {
        let inLimit = (value, limit) => value >= 0 && value < limit;
        return (inLimit(x, rows) && inLimit(y, cols));
    }

    function move(cell) {
        let { x: or, y: oc } = cell;
        if (!onBoard(cell)) {
            throw new Error("Cell is not on board.");
        }
        if (board[or][oc] !== CellState.EMPTY) {
            throw new Error("Cell is not empty.");
        }
        board[or][oc] = turn === Player.PLAYER1 ? CellState.PLAYER1 : CellState.PLAYER2;
        turn = (turn === Player.PLAYER1) ? Player.PLAYER2 : Player.PLAYER1;
        return endOfGame();
    }

    function endOfGame(matrix = board) {
        let testRow = (row) => {
            let p1 = matrix[row].every(x => x === CellState.PLAYER1);
            let p2 = matrix[row].every(x => x === CellState.PLAYER2);
            return p1 || p2;
        };
        for (let i = 0; i < rows; i++) {
            if (testRow(i)) {
                return matrix[i][0] === CellState.PLAYER1 ? Winner.PLAYER1 : Winner.PLAYER2;
            }
        }
        let testColumn = (col) => {
            let p1 = matrix.map(a => a[col]).every(x => x === CellState.PLAYER1);
            let p2 = matrix.map(a => a[col]).every(x => x === CellState.PLAYER2);
            return p1 || p2;
        };
        for (let i = 0; i < cols; i++) {
            if (testColumn(i)) {
                return matrix[0][i] === CellState.PLAYER1 ? Winner.PLAYER1 : Winner.PLAYER2;
            }
        }
        let testMainDiagonal = () => {
            let cells = [];
            for (let i = 0, max = rows; i < max; i++) {
                cells.push(matrix[i][i]);
            }
            let p1 = cells.every(x => x === CellState.PLAYER1);
            let p2 = cells.every(x => x === CellState.PLAYER2);
            return p1 || p2;
        };
        let testSecondDiagonal = () => {
            let cells = [];
            for (let i = 0, j = rows - 1, max = rows; i < max; i++, j--) {
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
    return { move, getBoard, getTurn, endOfGame };
}

export { TicTacToe };