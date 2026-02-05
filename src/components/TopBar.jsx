export default function TopBar({ timeDisplay, recordDisplay, score = 0, onBack }) {
  return (
    <div className="topbar-content">
      <div className="topbar-left">
        <button type="button" className="topbar-back" onClick={onBack}>
          Back
        </button>
        <div className="game-title">
          Number Path Runner
          <span className="game-mode">Maze Mode</span>
        </div>
      </div>
      <div className="timer-stack">
        <div className="timer-chip" aria-label="Score">
          Score: {score}
        </div>
        <div className="timer-chip" aria-label="Time">
          {timeDisplay}
        </div>
        {recordDisplay != null ? (
          <div className="timer-chip record-chip" aria-label="Best record">
            Best: {recordDisplay}
          </div>
        ) : null}
      </div>
    </div>
  );
}
