package sockets;

import java.io.IOException;

import jakarta.websocket.CloseReason;
import jakarta.websocket.EncodeException;
import jakarta.websocket.OnClose;
import jakarta.websocket.OnMessage;
import jakarta.websocket.OnOpen;
import jakarta.websocket.Session;
import jakarta.websocket.server.ServerEndpoint;
import model.Cell;
import model.Player;
import model.TicTacToe;
import model.Wordle;
import model.Word;

import java.util.List;
import java.util.Random;

import model.Winner;

@ServerEndpoint(value = "/wordle", encoders = MessageEncoder.class, decoders = CellDecoder.class)
public class Endpoint {

    private static Session s1;
    private static Session s2;
    private static Wordle game;
    private static String secret;

    @OnOpen
    public void onOpen(Session session) throws IOException, EncodeException {
        List<String> words = Word.returnWords();

        // Selecionar uma palavra aleatória
        secret = words.get(new Random().nextInt(words.size()));

        if (s1 == null) {
            s1 = session;
            s1.getBasicRemote().sendObject(new Message(ConnectionType.OPEN, Player.PLAYER1, secret, null));
        } else if (s2 == null) {
            game = new Wordle(secret);
            s2 = session;
            s2.getBasicRemote().sendObject(new Message(ConnectionType.OPEN, Player.PLAYER2, secret, null));
            sendMessage(new Message(ConnectionType.MESSAGE, game.getTurn(),"dd", null));
        } else {
            session.close();
        }
    }

    @OnMessage
    public void onMessage(Session session, String message) throws IOException, EncodeException {
        try {
            String ret = game.move(session == s1 ? Player.PLAYER1 : Player.PLAYER2, message);
            if (game.winner == Winner.NONE) {
                sendMessage(new Message(ConnectionType.MESSAGE, game.getTurn(), ret, null));
            } else {
                sendMessage(new Message(ConnectionType.ENDGAME, null, ret, game.winner));
            }
        } catch (Exception ex) {
            System.out.println(ex.getMessage());
        }
    }

    @OnClose
    public void onClose(Session session, CloseReason reason) throws IOException, EncodeException {
        switch (reason.getCloseCode().getCode()) {
            case 4000 -> {
                if (session == s1) {
                    s1 = null;
                } else {
                    s2 = null;
                }
            }
            case 1001, 4001 -> {
                if (session == s1) {
                    s2.getBasicRemote()
                            .sendObject(new Message(ConnectionType.ENDGAME, null, "fim", Winner.PLAYER2));
                    s1 = null;
                } else {
                    s1.getBasicRemote()
                            .sendObject(new Message(ConnectionType.ENDGAME, null, "fim", Winner.PLAYER1));
                    s2 = null;
                }
            }
            default -> {
                System.out.println(String.format("Close code %d incorrect", reason.getCloseCode().getCode()));
            }
        }
    }

    private void sendMessage(Message msg) throws EncodeException, IOException {
        s1.getBasicRemote().sendObject(msg);
        s2.getBasicRemote().sendObject(msg);
    }
}
