import { INumberCell, Player } from "./types";

/**
 * ### Game class to handle the game state
 * 
 * 
 * 
 */


export class Game {
  humanScore = 0;
  computerScore = 0;
  move: Player = Player.Human;
  gameStarted: Player = Player.Human;
  numbers: INumberCell[] = [];
  isStarted: boolean = false;
  isMinimax: boolean = true;
  maxDepth: number = 3;
  update: (g?: Game) => void = () => {};
  computerStartMove: number = 0
  computerEndMove: number = 0
  visitedNodes: number = 0

  public copyGame(): Game {
    const newGame = new Game();
    newGame.move = this.move;
    newGame.humanScore = this.humanScore;
    newGame.computerScore = this.computerScore;
    newGame.numbers = this.numbers;
    newGame.isStarted = this.isStarted;
    newGame.gameStarted = this.gameStarted;
    newGame.update = this.update;
    newGame.maxDepth = this.maxDepth;
    newGame.computerEndMove = this.computerEndMove;
    newGame.computerStartMove = this.computerStartMove
    newGame.visitedNodes = this.visitedNodes

    return newGame;
  }

  public makeMove(box: INumberCell): void {
    if (this.isGameOver()) return;

    this.updateScore(box);
    this.removeBox(box);

    if (this.move === Player.Computer) {
      this.computerEndMove = performance.now();
      this.move = Player.Human
    } else {
      this.computerStartMove = performance.now()
      this.move = Player.Computer
    }

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

    this.visitedNodes = 0
    this.numbers.map((num) => {
      const gameCopy = this.copyGame();
      gameCopy.removeBox(num);
      this.visitedNodes += 1

      let score = this.minimax(gameCopy, num, 0, alpha, beta, false, this.isMinimax);
      this.visitedNodes += gameCopy.visitedNodes

      if (score > bestScore) {
        bestScore = score;
        bestMove = num;
      }
    });

    if (bestMove) {
      this.makeMove(bestMove);
    }
  }

  public removeBox(box: INumberCell): void {
    // initiate an empty array to use it later
    const newNodes = [];

    // if the box to be removed has the value of 4 or 2, add two additional nodes to `newNodes` array with values of 2 and 1 acccordingly
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

    // remove clicked box
    const filteredNums = [
      ...this.numbers.filter((n) => n.id !== box.id),
      ...newNodes,
    ].filter(Boolean);
    // update numbers list
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
    isMax: boolean,
    isMinimaxAlgorithm: boolean
  ): number {
    let currentGame = gc;

    if (currentGame.isGameOver() || depth === currentGame.maxDepth) {
      return currentGame.returnPoints(num);
    }

    if (isMax) {

      let bestVal = -Infinity;

      currentGame.numbers.map((node) => {

        const gameCopy = currentGame.copyGame();
        gameCopy.removeBox(node);
        currentGame.visitedNodes += 1

        let score = currentGame.minimax(gameCopy, num, depth + 1, alpha, beta, false, isMinimaxAlgorithm);
        bestVal = Math.max(score, bestVal);

        if (!isMinimaxAlgorithm) {

          alpha = Math.max(alpha, bestVal)
          if (beta <= alpha) {
            return bestVal;
          }

        }

      });

      return bestVal;

    } else {

      let bestVal = Infinity;

      currentGame.numbers.map((node) => {

        const gameCopy = currentGame.copyGame();
        gameCopy.removeBox(node);
        currentGame.visitedNodes += 1

        let score = currentGame.minimax(gameCopy, num, depth + 1, alpha, beta, true, isMinimaxAlgorithm);
        bestVal = Math.min(score, bestVal);

        if (!isMinimaxAlgorithm) {

          beta = Math.min(beta, bestVal);
          if (beta <= alpha) {
            return bestVal;
          }

        }

      });

      return bestVal;
    }
  }

  public isGameOver(): boolean {
    return this.numbers.length === 0;
  }

  /** function that return the actual value of a box  */
  public returnPoints(box: INumberCell): number {
    let val = parseInt(box.value);

    if (box.value === "4") {
      val = 1;
    } else if (box.value === "2") {
      val = 0;
    }

    return val;
  }
}
