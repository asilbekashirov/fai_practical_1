import { useEffect, useRef, useState } from "react";
import { checkGeneratedNumbers, genNumbers } from "../utils";
import { Game } from "../models/Game";
import { INumberCell, Player } from "../models/types";

export function useGame() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const checkBoxRef = useRef<HTMLInputElement | null>(null);
  const [game, setGame] = useState<Game>(new Game());

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const restart = () => {
    if (
      !inputRef.current ||
      !inputRef.current.value.trim() ||
      !checkBoxRef.current
    )
      return;
    const inputValue = parseInt(inputRef.current.value);
    const algorithm = document.querySelector('#minimax') as HTMLInputElement

    if (inputValue < 15 || inputValue > 20) {
      alert("Entered value does not satisfy range requirements. [15-20]");
      return;
    }

    const generatedNumbers = genNumbers(inputValue);
    if (!checkGeneratedNumbers(generatedNumbers)) {
      restart();
      return;
    }

    const transformNumbers = generatedNumbers.split("").map((n) => {
      return { id: crypto.randomUUID().toString(), value: n };
    });

    game.humanScore = 0
    game.computerScore = 0
    game.numbers = transformNumbers;
    game.isMinimax = algorithm.checked
    game.update = updateBoard;
    game.move = checkBoxRef.current.checked ? Player.Computer : Player.Human;
    game.gameStarted = checkBoxRef.current.checked
      ? Player.Computer
      : Player.Human;
    game.isStarted = true;
    updateBoard(game);

    if (checkBoxRef.current.checked) {
      game.computerMove()
    }
  };

  const updateBoard = (g?: Game) => {
    const selector = g || game
    setGame(selector.copyGame());
  };


  const makeMove = (box: INumberCell) => {
    game.makeMove(box);
  };

  return { restart, inputRef, checkBoxRef, game, makeMove };
}
