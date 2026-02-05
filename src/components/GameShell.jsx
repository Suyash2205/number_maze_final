export default function GameShell({ topBar, mainContent, overlay }) {
  return (
    <div className="game-shell">
      <header className="game-topbar">{topBar}</header>
      <main className="game-stage">
        <div className="maze-shell">{mainContent}</div>
      </main>
      {overlay}
    </div>
  );
}
