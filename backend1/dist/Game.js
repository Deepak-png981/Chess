"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const chess_js_1 = require("chess.js");
const messages_1 = require("./messages");
class Game {
    constructor(player1, player2) {
        this.moveCount = 0;
        this.player1 = player1;
        this.player2 = player2;
        this.board = new chess_js_1.Chess();
        this.startTime = new Date();
        this.player1.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: {
                color: 'white'
            }
        }));
        this.player2.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: {
                color: 'black'
            }
        }));
    }
    makeMove(player, move) {
        console.log("making move");
        if (this.moveCount % 2 === 0 && player !== this.player1) {
            console.log('not your turn 1');
            return;
        }
        if (this.moveCount % 2 === 1 && player !== this.player2) {
            console.log('not your turn 2');
            return;
        }
        try {
            this.board.move(move); // we donot need to update the board as the library does it for us
        }
        catch (error) {
            console.log(error);
            return;
        }
        //check if the game is over
        if (this.board.isGameOver()) {
            console.log('game over');
            this.player1.emit(JSON.stringify({
                type: messages_1.GAME_OVER,
                payload: {
                    winner: this.board.turn() === 'w' ? 'black' : 'white'
                }
            }));
            this.player2.emit(JSON.stringify({
                type: messages_1.GAME_OVER,
                payload: {
                    winner: this.board.turn() === 'w' ? 'black' : 'white'
                }
            }));
        }
        if (this.moveCount % 2 === 0) {
            console.log('sending to player 2');
            this.player2.send(JSON.stringify({
                type: messages_1.MOVE,
                payload: move
            }));
        }
        else {
            console.log('sending to player 1');
            this.player1.send(JSON.stringify({
                type: messages_1.MOVE,
                payload: move
            }));
        }
        this.moveCount++;
    }
}
exports.Game = Game;
