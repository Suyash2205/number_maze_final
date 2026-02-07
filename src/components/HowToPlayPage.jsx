export default function HowToPlayPage({ onContinue, isModal = false }) {
  return (
    <div className={isModal ? "howto-card howto-card-modal" : "howto-page"}>
      <div className={isModal ? "" : "howto-card"}>
        <div className="howto-header">
          <div className="howto-badge">How to Play</div>
          <h1 className="howto-title">Reach the golden exit</h1>
          <p className="howto-subtitle">
            Choose the correct answer to move through the maze. Only one option is
            correct—wrong choices can lead to dead ends.
          </p>
        </div>

        <div className="howto-text-block">
          <div className="howto-section">
            <h3>Goal</h3>
            <p>Reach the golden-bordered exit before the timer runs out.</p>
          </div>
          <div className="howto-section">
            <h3>Moving</h3>
            <p>
              Each cell is a question. Pick one answer chip to move in that
              direction. Only one option is correct at a time.
            </p>
          </div>
          <div className="howto-section">
            <h3>Trail &amp; Backtracking</h3>
            <p>
              Your trail stays visible so you can backtrack. Tap any previously
              visited adjacent cell to move back.
            </p>
          </div>
          <div className="howto-section">
            <h3>Dead Ends</h3>
            <p>
              Wrong choices can lead to dead ends. Dead ends add time, so
              backtrack and try a different path.
            </p>
          </div>
          <div className="howto-section">
            <h3>Timer</h3>
            <p>
              You have 3 minutes total. The timer counts down; when it hits
              00:00 the game ends and your final score is shown.
            </p>
          </div>
        </div>

        <div className="howto-actions">
          <button type="button" className="howto-start" onClick={onContinue}>
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
