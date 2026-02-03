import { useState, lazy, Suspense } from "react";
import GradeSelectPage from "./components/GradeSelectPage.jsx";

const GameView = lazy(() => import("./components/GameView.jsx"));

export default function App() {
  const [view, setView] = useState("grade-select");
  const [gameKey, setGameKey] = useState(0);

  if (view === "grade-select") {
    return <GradeSelectPage onStart={() => setView("maze")} />;
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
