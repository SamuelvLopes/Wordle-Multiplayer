package model;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.function.BiFunction;
import java.util.stream.Stream;

public class Wordle {
    private String targetWord;
    public Winner winner = Winner.NONE;
    private final int maxAttempts = 6; 
    private Player turn = Player.PLAYER1;
    private final List<String> guesses  = new ArrayList<>(); 
    private CellState[][] board = {
            { CellState.EMPTY, CellState.EMPTY, CellState.EMPTY },
            { CellState.EMPTY, CellState.EMPTY, CellState.EMPTY },
            { CellState.EMPTY, CellState.EMPTY, CellState.EMPTY }, };

    public Player getTurn() {
        return turn;
    }

    public Wordle(String targetWord) {
        if (targetWord == null || targetWord.isEmpty()) {
            throw new IllegalArgumentException("Target word cannot be null or empty.");
        }
        this.targetWord = targetWord.toLowerCase();
    }

    public CellState[][] getBoard() {
        return board;
    }


    public String move(Player player, String message) {
        System.out.println("Palpite recebido: " + message);
        /* It is your turn? */
        if (player != turn) {
            throw new IllegalArgumentException("It is not your turn.");
        }
       
        return processGuess( player,message);
    }
    // Método para validar o palpite
    private void checaPalpite(String guess) {
        if (guess == null || guess.isEmpty()) {
            throw new IllegalArgumentException("Guess cannot be null or empty.");
        }
        if (guess.length() != targetWord.length()) {
            throw new IllegalArgumentException("Invalid guess length. Word must have " + targetWord.length() + " characters.");
        }
        if (!guess.matches("[a-zA-Z]+")) {
            throw new IllegalArgumentException("Invalid characters in guess. Only letters are allowed.");
        }
    }

    public String processGuess(Player player, String guess) {
        // Verifica se é o turno do jogador
        if (player != turn) {
            return "Error: It's not your turn.";
        }
    
        // Verifica se o número máximo de tentativas foi atingido
        if (guesses.size() >= maxAttempts) {
            return "Game Over: No more attempts allowed. The correct word was: " + targetWord;
        }
    
        // Valida o palpite
        try {
            checaPalpite(guess); // Valida o formato e o comprimento do palpite
        } catch (IllegalArgumentException e) {
            return "Error: " + e.getMessage();
        }
    
        // Normaliza o palpite para letras minúsculas
        guess = guess.toLowerCase();
        guesses.add(guess);
    
        // Gera feedback para o palpite
        StringBuilder feedback = new StringBuilder();
        for (int i = 0; i < guess.length(); i++) {
            char guessedChar = guess.charAt(i);
            char targetChar = targetWord.charAt(i);
    
            if (guessedChar == targetChar) {
                feedback.append("✔"); // Letra correta na posição correta
            } else if (targetWord.contains(String.valueOf(guessedChar))) {
                feedback.append("~"); // Letra correta, posição errada
            } else {
                feedback.append("✘"); // Letra incorreta
            }
        }
    
        // Verifica se o jogador acertou a palavra
        if (guess.equals(targetWord)) {
            winner =(turn == Player.PLAYER1) ? Winner.PLAYER1 : Winner.PLAYER2;
            return "Congratulations! " + player + " guessed the word: " + targetWord;
        }
    
        // Verifica se o jogo terminou por atingir o limite de tentativas
        if (guesses.size() >= maxAttempts) {
            winner =(turn == Player.PLAYER1) ? Winner.PLAYER2 : Winner.PLAYER1;
            return "Game Over: No more attempts allowed. The correct word was: " + targetWord;
        }
    
        // Alterna o turno
        turn = (turn == Player.PLAYER1) ? Player.PLAYER2 : Player.PLAYER1;
    
        return feedback.toString(); // Retorna o feedback
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
        return (inLimit.apply(cell.x(), board.length) && inLimit.apply(cell.y(), board[0].length));
    }
}
