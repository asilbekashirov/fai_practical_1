import { INumberCell, Player } from "./types";

const MAX_DEPTH = 4

export class Game {
  humanScore = 0;
  computerScore = 0;
  move: Player = Player.Human;
  gameStarted: Player = Player.Human;
  numbers: INumberCell[] = [];
  isStarted: boolean = false;
  isMinimax: boolean = true;
  update: (g?: Game) => void = () => {};

  public copyGame(): Game {
    const newGame = new Game();
    newGame.move = this.move;
    newGame.humanScore = this.humanScore;
    newGame.computerScore = this.computerScore;
    newGame.numbers = this.numbers;
    newGame.isStarted = this.isStarted;
    newGame.gameStarted = this.gameStarted;
    newGame.update = this.update;

    return newGame;
  }

  public restartGame(): void {}

  public makeMove(box: INumberCell): void {
    if (this.isGameOver()) return;

    this.updateScore(box);
    this.removeBox(box);

    this.move = this.move === Player.Computer ? Player.Human : Player.Computer;

    this.update(this);
  }

  public updateScore(box: INumberCell) {
    if (this.move === Player.Human) {
      this.humanScore += this.returnPoints(box);
    } else {
      this.computerScore += this.returnPoints(box);
    }
  }

  public computerMove(): void {
    let bestScore = -Infinity;
    let bestMove = null;
    let alpha = -Infinity;
    let beta = Infinity

    this.numbers.map((num) => {
      const gameCopy = this.copyGame();
      gameCopy.removeBox(num);
      let score = this.minimax(gameCopy, num, 0, alpha, beta, false);

      if (score > bestScore) {
        bestScore = score;
        bestMove = num;
      }
    });

    if (bestMove) {
      this.makeMove(bestMove);
    }
  }

  private removeBox(box: INumberCell): void {
    const newNodes = [];

    if (box.value === "4") {
      newNodes.push(
        { id: crypto.randomUUID().toString(), value: "2" },
        { id: crypto.randomUUID().toString(), value: "2" }
      );
    } else if (box.value === "2") {
      newNodes.push(
        { id: crypto.randomUUID().toString(), value: "1" },
        { id: crypto.randomUUID().toString(), value: "1" }
      );
    }

    const filteredNums = [
      ...this.numbers.filter((n) => n.id !== box.id),
      ...newNodes,
    ].filter(Boolean);
    this.numbers = filteredNums;

    if (filteredNums.length === 0) {
      this.isStarted = false;
    }
  }

  private minimax(
    gc: Game,
    num: INumberCell,
    depth: number,
    alpha: number,
    beta: number,
    isMax: boolean
  ): number {
    let currentGame = gc;

    if (currentGame.isGameOver() || depth === MAX_DEPTH) {
      return currentGame.returnPoints(num);
    }

    if (isMax) {
      let bestVal = -Infinity;
      currentGame.numbers.map((node) => {
        const gameCopy = currentGame.copyGame();
        gameCopy.removeBox(node);
        let score = currentGame.minimax(gameCopy, num, depth + 1, alpha, beta, false);
        bestVal = Math.max(score, bestVal);
        // alpha = Math.max(alpha, bestVal)
        // if (beta <= alpha && !this.isMinimax) {
        //   return bestVal;
        // }
      });
      return bestVal;
    } else {
      let bestVal = Infinity;
      currentGame.numbers.map((node) => {
        const gameCopy = currentGame.copyGame();
        gameCopy.removeBox(node);
        let score = currentGame.minimax(gameCopy, num, depth + 1, alpha, beta, true);
        bestVal = Math.min(score, bestVal);
        // beta = Math.min(beta, bestVal);
        // if (beta <= alpha && !this.isMinimax) {
        //   return bestVal;
        // }
      });
      return bestVal;
    }
  }

  public isGameOver(): boolean {
    return this.numbers.length === 0;
  }

  private returnPoints(box: INumberCell): number {
    let val = parseInt(box.value);

    if (box.value === "4") {
      val = 1;
    } else if (box.value === "2") {
      val = 0;
    }

    return val;
  }
}
