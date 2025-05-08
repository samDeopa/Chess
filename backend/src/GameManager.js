import { Game } from "./Game.js";
import { INIT_GAME, MOVE } from "./message.js";

export class GameManager {
  #games;
  #pendingUser;
  #users;
  constructor() {
    this.#games = [];
    this.#pendingUser = null;
    this.#users = [];
  }
  addUser(socket) {
    this.#users.push(socket);
    this.addHandler(socket);
  }
  removeUser(socket) {
    this.#users = this.#users.filter((user) => user !== socket);
  }
  addHandler(socket) {
    socket.on("message", (data) => {
      const message = JSON.parse(data.toString());

      if (message.type === INIT_GAME) {
        if (this.#pendingUser) {
          const game = new Game(this.#pendingUser, socket);
          this.#games.push(game);
          this.#pendingUser = null;
        } else {
          this.#pendingUser = socket;
        }
      }

      if (message.type === MOVE) {
        const game = this.#games.find(
          (game) => game.player1 === socket || game.player2 === socket
        );
        if (game) {
          game.makeMove(socket, message.move);
        }
      }
    });
  }
}
