import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import GameShell from "./GameShell.jsx";
import TopBar from "./TopBar.jsx";
import MazeViewport from "./MazeViewport.jsx";
const RECORD_STORAGE_KEY = "number-path-runner-best-time";
const HIGH_SCORE_STORAGE_KEY = "number-path-runner-high-score";

const SCORE_CONFIG = {
  maxTimeScore: 100,
  timePenaltyFactor: 0.5,
  correctAnswerPoints: 10,
  deadEndTimePenaltySeconds: 5,
  perfectBonus: 25,
};
const MAX_TIME_SECONDS = 180;

const formatTime = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

const loadRecord = () => {
  try {
    const stored = localStorage.getItem(RECORD_STORAGE_KEY);
    return stored != null ? parseInt(stored, 10) : null;
  } catch {
    return null;
  }
};

const loadHighScore = () => {
  try {
    const stored = localStorage.getItem(HIGH_SCORE_STORAGE_KEY);
    return stored != null ? parseInt(stored, 10) : 0;
  } catch {
    return 0;
  }
};

export default function GameView({ onBackToHome, onPlayAgain }) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [recordSeconds, setRecordSeconds] = useState(loadRecord);
  const [finishTime, setFinishTime] = useState(null);
  const [finishIsNewRecord, setFinishIsNewRecord] = useState(false);
  const [score, setScore] = useState(0);
  const [finalScore, setFinalScore] = useState(null);
  const [finalCoinCount, setFinalCoinCount] = useState(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [highScore, setHighScore] = useState(loadHighScore);
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const elapsedRef = useRef(0);
  const scoreRef = useRef(0);
  const correctRef = useRef(0);
  const wrongRef = useRef(0);
  elapsedRef.current = elapsedSeconds;
  scoreRef.current = score;
  correctRef.current = correctAnswers;
  wrongRef.current = wrongAnswers;

  useEffect(() => {
    if (!isTimerRunning) return undefined;
    const timer = setInterval(
      () => setElapsedSeconds((p) => Math.min(p + 1, MAX_TIME_SECONDS)),
      1000
    );
    return () => clearInterval(timer);
  }, [isTimerRunning]);

  useEffect(() => {
    if (elapsedSeconds >= MAX_TIME_SECONDS && !isTimeUp) {
      setIsTimerRunning(false);
      setIsTimeUp(true);
    }
  }, [elapsedSeconds, isTimeUp]);

  const handleAnswer = (isCorrect) => {
    if (isCorrect) {
      setScore((s) => s + SCORE_CONFIG.correctAnswerPoints);
      setCorrectAnswers((c) => c + 1);
      setCurrentStreak((s) => {
        const next = s + 1;
        setBestStreak((b) => Math.max(b, next));
        return next;
      });
    } else {
      setWrongAnswers((w) => w + 1);
      setCurrentStreak(0);
    }
  };

  const handleDeadEnd = () => {
    setElapsedSeconds((t) =>
      Math.min(t + SCORE_CONFIG.deadEndTimePenaltySeconds, MAX_TIME_SECONDS)
    );
  };

  const handleReachExit = () => {
    const finishedAt = elapsedRef.current;
    setIsTimerRunning(false);
    setFinishTime(finishedAt);
    const timeScore = Math.max(
      0,
      SCORE_CONFIG.maxTimeScore - finishedAt * SCORE_CONFIG.timePenaltyFactor
    );
    const perfectRunBonus =
      wrongRef.current === 0 ? SCORE_CONFIG.perfectBonus : 0;
    const computedFinal = Math.max(
      0,
      scoreRef.current + timeScore + perfectRunBonus
    );
    setScore(computedFinal);
    setFinalScore(computedFinal);
    setFinalCoinCount(correctRef.current);
    const questionsAnswered = correctRef.current + wrongRef.current;
    const accuracy = questionsAnswered
      ? Math.round((correctRef.current / questionsAnswered) * 100)
      : 0;
    const prevHighScore = loadHighScore();
    const newHighScore = computedFinal > prevHighScore;
    if (newHighScore) {
      setHighScore(computedFinal);
      setIsNewHighScore(true);
      try {
        localStorage.setItem(HIGH_SCORE_STORAGE_KEY, String(computedFinal));
      } catch {
        /* ignore */
      }
    } else {
      setHighScore(prevHighScore);
    }
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { x: 0.5, y: 0.5 },
      colors: ["#e8c547", "#ffd700", "#ffec8b", "#fffacd", "#daa520"],
    });
    const currentBest = recordSeconds != null ? recordSeconds : loadRecord();
    const isNewRecord = currentBest == null || finishedAt < currentBest;
    setFinishIsNewRecord(isNewRecord);
    if (isNewRecord) {
      setRecordSeconds(finishedAt);
      try {
        localStorage.setItem(RECORD_STORAGE_KEY, String(finishedAt));
      } catch {
        /* ignore */
      }
    }
  };

  const gameOverStats =
    finalScore != null
      ? {
          highScore: highScore,
          finalScore,
          questionsAnswered: correctAnswers + wrongAnswers,
          accuracy:
            correctAnswers + wrongAnswers > 0
              ? Math.round(
                  (correctAnswers / (correctAnswers + wrongAnswers)) * 100
                )
              : 0,
          bestStreak,
          isNewHighScore,
        }
      : null;

  const timeDisplay = formatTime(Math.max(0, MAX_TIME_SECONDS - elapsedSeconds));
  const recordDisplay = recordSeconds != null ? formatTime(recordSeconds) : null;

  const handleRequestExit = () => setShowExitConfirm(true);
  const handleCancelExit = () => setShowExitConfirm(false);
  const handleConfirmExit = () => {
    setShowExitConfirm(false);
    onBackToHome();
  };

  return (
    <GameShell
      topBar={
        <TopBar
          timeDisplay={timeDisplay}
          recordDisplay={recordDisplay}
          score={finalScore != null ? finalScore : score}
          onBack={handleRequestExit}
        />
      }
      mainContent={
        <MazeViewport
          onReachExit={handleReachExit}
          onAnswer={handleAnswer}
          onDeadEnd={handleDeadEnd}
          isTimeUp={isTimeUp}
          elapsedSeconds={elapsedSeconds}
          timeDisplay={timeDisplay}
          finishTimeFormatted={finishTime != null ? formatTime(finishTime) : null}
          finishIsNewRecord={finishIsNewRecord}
          finishScore={finalScore}
          currentScore={score}
          finishCoinCount={finalCoinCount}
          gameOverStats={gameOverStats}
          onPlayAgain={onPlayAgain}
          onBackToHome={onBackToHome}
        />
      }
      overlay={
        showExitConfirm ? (
          <div className="exit-confirm-overlay" role="dialog" aria-modal="true">
            <div className="exit-confirm-card">
              <h2 className="exit-confirm-title">Leave Game?</h2>
              <p className="exit-confirm-subtitle">
                Your progress in this round will be lost.
              </p>
              <div className="exit-confirm-actions">
                <button
                  type="button"
                  className="exit-confirm-primary"
                  onClick={handleConfirmExit}
                >
                  Yes, Leave
                </button>
                <button
                  type="button"
                  className="exit-confirm-outline"
                  onClick={handleCancelExit}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : null
      }
    />
  );
}
