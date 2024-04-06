import { useEffect, useRef, useState } from "react";
import { checkGeneratedNumbers, genNumbers } from "../utils";
import { Game } from "../models/Game";
import { INumberCell, Player } from "../models/types";

/**
 * ### Hook to handle game life cycle events
 * 
 * When user clicks on `Generate` button, `restart` function will be called
 * 
 */



export function useGame() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const checkBoxRef = useRef<HTMLInputElement | null>(null);
  const maxDepthRef = useRef<HTMLInputElement | null>(null);
  const [game, setGame] = useState<Game>(new Game());

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const reset = () => {
    game.humanScore = 0
    game.computerScore = 0
    game.computerEndMove = 0
    game.computerStartMove = 0
    game.numbers = [];
    game.isMinimax = true
    game.maxDepth = 3;
    game.update = updateBoard;
    game.move = Player.Human;
    game.gameStarted = Player.Human
    game.isStarted = false;
    updateBoard(game);
  }

  const restart = () => {
    if (
      !inputRef.current ||
      !inputRef.current.value.trim() ||
      !checkBoxRef.current ||
      !maxDepthRef.current?.value.trim()
    )
      return;

    // (selector) get numerical string length
    const inputValue = parseInt(inputRef.current.value);
    // (selector) isMinimax algorith will be used
    const algorithm = document.querySelector('#minimax') as HTMLInputElement

    if (inputValue < 15 || inputValue > 20) {
      alert("Entered value does not satisfy range requirements. [15-20]");
      return;
    }

    // generate random numbers
    const generatedNumbers = genNumbers(inputValue);
    // to proceed, generated numbers should include 1, 2, 3 and 4
    if (!checkGeneratedNumbers(generatedNumbers)) {
      restart();
      return;
    }

    // generate unique id's for each generated number
    const transformNumbers = generatedNumbers.split("").map((n) => {
      return { id: crypto.randomUUID().toString(), value: n };
    });

    // set game parameters below
    game.humanScore = 0
    game.visitedNodes = 0
    game.computerScore = 0
    game.computerEndMove = 0
    game.computerStartMove = 0
    game.numbers = transformNumbers;
    game.isMinimax = algorithm.checked
    game.maxDepth = parseInt(maxDepthRef.current.value);
    game.update = updateBoard;
    game.move = checkBoxRef.current.checked ? Player.Computer : Player.Human;
    game.gameStarted = checkBoxRef.current.checked
      ? Player.Computer
      : Player.Human;
    game.isStarted = true;
    updateBoard(game);

    if (checkBoxRef.current.checked) {
    setTimeout(() => game.computerMove())
    }
  };

  const updateBoard = (g?: Game) => {
    const selector = g || game
    setGame(selector.copyGame());
  };


  const makeMove = (box: INumberCell) => {
    game.makeMove(box);
  };

  return { restart, inputRef, checkBoxRef, game, makeMove, maxDepthRef, reset };
}
