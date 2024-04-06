import { ChangeEvent, useState } from "react";
import { useGame } from "./hooks/useGame";
import { INumberCell, Player } from "./models/types";

function App() {
  const [depth, setDepth] = useState<number>(4);
  const { restart, inputRef, game, checkBoxRef, makeMove, maxDepthRef, reset } = useGame();
  const isDisabled = game.isStarted
  const isGameOver = game.isGameOver();

  const handleMove = async (num: INumberCell) => {
    makeMove(num);
    queueMicrotask(() => game.computerMove())
  };

  const handleRangeChange = (e: ChangeEvent<HTMLInputElement>) =>
    setDepth(parseInt(e.target.value));

  const makeStats = (): string => {
    if (!game.isStarted) return ''
    let str = ''

    if (game.move === Player.Human) {
      str = `Computer took ${(game.computerEndMove - game.computerStartMove).toFixed(2)}ms and visited ${game.visitedNodes} nodes`
    }

    return str
  }

  return (
    <>
      <p className="move">{game.isStarted && game.move}</p>
      <p className="info">{makeStats()}</p>
      <div className="numbers">
        {/* list of generated numbers is displayed here  */}
        {game.numbers.map((num, index) => (
          <div
            key={num.id}
            className="boxWrapper"
            onClick={() => handleMove(num)}
          >
            <div className="box">{num.value}</div>
            <span>{index + 1}</span>
          </div>
        ))}
      </div>

      <div>
        <input
          ref={inputRef}
          id="numbersLength"
          placeholder="Indicate the lenght of numerical string..."
          defaultValue="16"
          type="number"
          className="numsToGenerate"
          disabled={isDisabled}
        />
        <button className="generateNumbers" onClick={restart} disabled={isDisabled}>
          Generate
        </button>
        {(isDisabled || isGameOver) ? (
          <button className="reset" onClick={reset}>
            Restart
          </button>
        ) : null}
        <br />
        <label className="label">
          <input
            ref={checkBoxRef}
            disabled={isDisabled}
            type="checkbox"
            id="startSide"
          />
          <p>Computer starts the first move</p>
        </label>
        <input
          id="minimax"
          type="radio"
          name="algorithm"
          value="minimax"
          defaultChecked
          disabled={isDisabled}
        />
        <label htmlFor="minimax">Minimax</label>
        <input id="alphabeta" type="radio" name="algorithm" value="alphabeta" disabled={isDisabled} />
        <label htmlFor="alphabeta">Alpha-beta</label>
        <br />
        <div className="depth_box">
          <input
            type="range"
            min="3"
            max="6"
            placeholder="Depth"
            onChange={handleRangeChange}
            value={depth}
            className="depth"
            ref={maxDepthRef}
            disabled={isDisabled}
          />
          <div className="depth_num">Max depth: {depth}</div>
        </div>
        <div>Most optimal values for 'Max depth' are 4 & 5</div>
      </div>
      <div className="stat player">
        <span className="score">{game.humanScore}</span>
        <span>Player</span>
      </div>
      <div className="stat computer">
        <span className="score">{game.computerScore}</span>
        <span>Computer</span>
      </div>
    </>
  );
}

export default App;
