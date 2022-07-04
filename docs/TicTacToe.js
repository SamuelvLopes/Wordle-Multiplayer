import {Player} from "./Player.js";
import {CellState} from "./CellState.js";
import {Winner} from "./Winner.js";

function TicTacToe() {
    let turn = Player.PLAYER1;
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

    function onBoard( {x, y}) {
        let inLimit = (value, limit) => value >= 0 && value < limit;
        return (inLimit(x, rows) && inLimit(y, cols));
    }

    function move(cell) {
        let {x: or, y: oc} = cell;
        if ((board[or][oc] === CellState.PLAYER1 && turn === Player.PLAYER2) || (board[or][oc] === CellState.PLAYER2 && turn === Player.PLAYER1)) {
            throw new Error("It's not your turn.");
        }
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

    function endOfGame() {
        for (let i = 0; i < board.length; i++) {
            if (testRow(i)) {
                return board[i][0] === CellState.PLAYER1 ? Winner.PLAYER1 : Winner.PLAYER2;
            }
        }
        for (let i = 0; i < board[0].length; i++) {
            if (testColumn(i)) {
                return board[0][i] === CellState.PLAYER1 ? Winner.PLAYER1 : Winner.PLAYER2;
            }
        }
        if (testMainDiagonal() || testSecondDiagonal()) {
            return board[1][1] === CellState.PLAYER1 ? Winner.PLAYER1 : Winner.PLAYER2;
        }
        let count = board.flat().filter(x => x === CellState.EMPTY).length;
        return count === 0 ? Winner.DRAW : Winner.NONE;
    }
    function testRow(row) {
        let p1 = board[row].every(x => x === CellState.PLAYER1);
        let p2 = board[row].every(x => x === CellState.PLAYER2);
        return p1 || p2;
    }
    function testColumn(col) {
        let p1 = board.map(a => a[col]).every(x => x === CellState.PLAYER1);
        let p2 = board.map(a => a[col]).every(x => x === CellState.PLAYER2);
        return p1 || p2;
    }
    function testMainDiagonal() {
        let cells = [];
        for (let i = 0, max = board.length; i < max; i++) {
            cells.push(board[i][i]);
        }
        let p1 = cells.every(x => x === CellState.PLAYER1);
        let p2 = cells.every(x => x === CellState.PLAYER2);
        return p1 || p2;
    }
    function testSecondDiagonal() {
        let cells = [];
        for (let i = 0, j = board.length - 1, max = board.length; i < max; i++, j--) {
            cells.push(board[i][j]);
        }
        let p1 = cells.every(x => x === CellState.PLAYER1);
        let p2 = cells.every(x => x === CellState.PLAYER2);
        return p1 || p2;
    }
    return {move, getBoard, getTurn};
}

export {TicTacToe};