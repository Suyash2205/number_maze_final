import { useState, useCallback, useEffect } from "react";
import { setOperation, getOperation } from "../data/questionGenerator.js";

const OPTIONS = [
  { id: "mixed", label: "Mixed" },
  { id: "add", label: "Addition" },
  { id: "sub", label: "Subtraction" },
  { id: "mul", label: "Multiplication" },
  { id: "div", label: "Division" },
  { id: "fraction", label: "Fractions" },
];

export default function OperationSelectPage({
  onContinue,
  onHowToPlay,
  howToPlayOpen = false,
  howToPlayContent = null,
}) {
  const [selected, setSelected] = useState(getOperation);

  const handleSelect = useCallback((id) => {
    setOperation(id);
    setSelected(id);
  }, []);

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
        <h1 className="grade-select-title">Choose Operation</h1>
        <p className="grade-select-subtitle">
          Pick one type of problem for this run.
        </p>
        <div className="grade-select-buttons is-stack">
          {OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              className={`grade-select-btn${selected === option.id ? " selected" : ""}`}
              onClick={() => handleSelect(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          key={selected || "op-continue"}
          className={`grade-select-start${selected ? " is-ready" : ""}`}
          onClick={onContinue}
        >
          Continue
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
