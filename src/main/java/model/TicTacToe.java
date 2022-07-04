package model;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.function.BiFunction;
import java.util.stream.Stream;

public class TicTacToe {

    private Player turn = Player.PLAYER1;
    private CellState[][] board = {
            { CellState.EMPTY, CellState.EMPTY, CellState.EMPTY },
            { CellState.EMPTY, CellState.EMPTY, CellState.EMPTY },
            { CellState.EMPTY, CellState.EMPTY, CellState.EMPTY }, };

    public Player getTurn() {
        return turn;
    }

    public CellState[][] getBoard() {
        return board;
    }

    public Winner move(Player player, Cell beginCell) {
        int or = beginCell.getX(), oc = beginCell.getY();
        /* It is your turn? */
        if (player != turn) {
            throw new IllegalArgumentException("It is not your turn.");
        }
        /* The cell is on board? */
        if (!onBoard(beginCell)) {
            throw new IllegalArgumentException("Position is invalid.");
        }
        /* THe cell is empty? */
        if (board[or][oc] != CellState.EMPTY) {
            throw new IllegalArgumentException("The cell is not empty.");
        }
        board[or][oc] = turn == Player.PLAYER1 ? CellState.PLAYER1 : CellState.PLAYER2;
        turn = (turn == Player.PLAYER1) ? Player.PLAYER2 : Player.PLAYER1;
        return isGameOver();
    }

    private Winner isGameOver() {
        for (int i = 0; i < board.length; i++) {
            if (this.testRow(i)) {
                return board[i][0] == CellState.PLAYER1 ? Winner.PLAYER1 : Winner.PLAYER2;
            }
        }
        for (int i = 0; i < board[0].length; i++) {
            if (this.testColumn(i)) {
                return board[0][i] == CellState.PLAYER1 ? Winner.PLAYER1 : Winner.PLAYER2;
            }
        }
        if (this.testMainDiagonal() || this.testSecondDiagonal()) {
            return board[1][1] == CellState.PLAYER1 ? Winner.PLAYER1 : Winner.PLAYER2;
        }
        long count = Stream.of(board).flatMap(Stream::of).filter(x -> x == CellState.EMPTY).count();
        return count == 0 ? Winner.DRAW : Winner.NONE;
    }

    private boolean testRow(int row) {
        boolean p1 = Arrays.stream(board[row]).allMatch(x -> x == CellState.PLAYER1);
        boolean p2 = Arrays.stream(board[row]).allMatch(x -> x == CellState.PLAYER2);
        return p1 || p2;
    }

    private boolean testColumn(int col) {
        boolean p1 = Arrays.stream(board).map(a -> a[col]).allMatch(x -> x == CellState.PLAYER1);
        boolean p2 = Arrays.stream(board).map(a -> a[col]).allMatch(x -> x == CellState.PLAYER2);
        return p1 || p2;
    }

    private boolean testMainDiagonal() {
        List<CellState> cells = new ArrayList<>();
        for (int i = 0, max = board.length; i < max; i++) {
            cells.add(board[i][i]);
        }
        boolean p1 = cells.stream().allMatch(x -> x == CellState.PLAYER1);
        boolean p2 = cells.stream().allMatch(x -> x == CellState.PLAYER2);
        return p1 || p2;
    }

    private boolean testSecondDiagonal() {
        List<CellState> cells = new ArrayList<>();
        for (int i = 0, j = board.length - 1, max = board.length; i < max; i++, j--) {
            cells.add(board[i][j]);
        }
        boolean p1 = cells.stream().allMatch(x -> x == CellState.PLAYER1);
        boolean p2 = cells.stream().allMatch(x -> x == CellState.PLAYER2);
        return p1 || p2;
    }

    private boolean onBoard(Cell cell) {
        BiFunction<Integer, Integer, Boolean> inLimit = (value, limit) -> value >= 0 && value < limit;
        return (inLimit.apply(cell.getX(), board.length) && inLimit.apply(cell.getY(), board[0].length));
    }
}
