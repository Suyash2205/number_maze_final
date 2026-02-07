import { useState, useCallback, useEffect } from "react";
import { setGrade } from "../data/questionGenerator.js";

export default function GradeSelectPage({
  onStart,
  onHowToPlay,
  onBack,
  howToPlayOpen = false,
  howToPlayContent = null,
}) {
  const [selectedGrade, setSelectedGrade] = useState(null);

  const handleSelect = useCallback((grade) => {
    setGrade(grade);
    setSelectedGrade(grade);
  }, []);

  const handleStart = useCallback(() => {
    if (!selectedGrade) {
      return;
    }
    setGrade(selectedGrade);
    onStart();
  }, [selectedGrade, onStart]);

  useEffect(() => {
    if (howToPlayOpen) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
    return () => document.body.classList.remove("modal-open");
  }, [howToPlayOpen]);

  return (
    <div className="grade-select-page">
      <div className="grade-select-card">
        <div className="grade-select-logo" aria-hidden="true" />
        <div className="grade-select-kicker">Brain Racers</div>
        {onBack ? (
          <button type="button" className="grade-select-back" onClick={onBack}>
            Back
          </button>
        ) : null}
        <h1 className="grade-select-title">Choose Your Grade</h1>
        <p className="grade-select-subtitle">
          We'll adjust the question difficulty for you!
        </p>
        <div className="grade-select-buttons is-stack">
          {[3, 4, 5, 6, 7].map((g) => (
            <button
              key={g}
              type="button"
              className={`grade-select-btn${selectedGrade === g ? " selected" : ""}`}
              onClick={() => handleSelect(g)}
            >
              Grade {g}
            </button>
          ))}
        </div>
        <button
          type="button"
          className={`grade-select-start${selectedGrade ? " is-ready" : ""}`}
          onClick={handleStart}
        >
          Start Game
        </button>
        <button
          type="button"
          className="grade-select-howto"
          onClick={onHowToPlay}
        >
          How to Play
        </button>
      </div>
      {howToPlayOpen ? (
        <div className="howto-modal-overlay" role="dialog" aria-modal="true">
          <div className="howto-modal">{howToPlayContent}</div>
        </div>
      ) : null}
    </div>
  );
}
