import { useState, lazy, Suspense } from "react";
import GradeSelectPage from "./components/GradeSelectPage.jsx";
import HowToPlayPage from "./components/HowToPlayPage.jsx";

const GameView = lazy(() => import("./components/GameView.jsx"));
const HOW_TO_PLAY_KEY = "number-path-runner-howto-seen";

export default function App() {
  const [view, setView] = useState(() => {
    try {
      const seen = localStorage.getItem(HOW_TO_PLAY_KEY);
      return "grade-select";
    } catch {
      return "grade-select";
    }
  });
  const [showHowTo, setShowHowTo] = useState(() => {
    try {
      const seen = localStorage.getItem(HOW_TO_PLAY_KEY);
      return !seen;
    } catch {
      return true;
    }
  });
  const [gameKey, setGameKey] = useState(0);

  const handleCloseHowTo = () => {
    try {
      localStorage.setItem(HOW_TO_PLAY_KEY, "true");
    } catch {
      /* ignore */
    }
    setShowHowTo(false);
  };

  if (view === "grade-select") {
    return (
      <GradeSelectPage
        onStart={() => setView("maze")}
        onHowToPlay={() => setShowHowTo(true)}
        howToPlayOpen={showHowTo}
        howToPlayContent={
          <HowToPlayPage onContinue={handleCloseHowTo} isModal />
        }
      />
    );
  }

  return (
    <Suspense fallback={<div className="grade-select-page">Loading…</div>}>
      <GameView
        key={gameKey}
        onBackToHome={() => setView("grade-select")}
        onPlayAgain={() => setGameKey((k) => k + 1)}
      />
    </Suspense>
  );
}
