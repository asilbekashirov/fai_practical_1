import { ChangeEvent, useState } from "react";
import { useGame } from "./hooks/useGame";
import { INumberCell } from "./models/types";

function App() {
  const [depth, setDepth] = useState<number>(4);
  const { restart, inputRef, game, checkBoxRef, makeMove, maxDepthRef } = useGame();

  const handleMove = async (num: INumberCell) => {
    makeMove(num);
    await game.computerMove();
  };

  const handleRangeChange = (e: ChangeEvent<HTMLInputElement>) =>
    setDepth(parseInt(e.target.value));

  return (
    <>
      <p className="move">{game.isStarted && game.move}</p>
      <div className="numbers">
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
        />
        <button className="generateNumbers" onClick={restart}>
          Generate
        </button>
        <br />
        <label className="label">
          <input
            ref={checkBoxRef}
            disabled={game.isStarted}
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
        />
        <label htmlFor="minimax">Minimax</label>
        <input id="alphabeta" type="radio" name="algorithm" value="alphabeta" />
        <label htmlFor="alphabeta">Alpha-beta</label>
        <br />
        <div className="depth_box">
          <input
            type="range"
            min="3"
            max="7"
            placeholder="Depth"
            onChange={handleRangeChange}
            value={depth}
            className="depth"
            ref={maxDepthRef}
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
