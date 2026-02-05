import { useState, useCallback } from "react";
import { setGrade } from "../data/questionGenerator.js";

export default function GradeSelectPage({ onStart }) {
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

  return (
    <div className="grade-select-page">
      <div className="grade-select-card">
        <div className="grade-select-logo" aria-hidden="true" />
        <div className="grade-select-kicker">Brain Racers</div>
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
      </div>
    </div>
  );
}
