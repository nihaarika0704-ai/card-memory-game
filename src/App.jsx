import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [timer, setTimer] = useState(0);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [gameWon, setGameWon] = useState(false);
  const [shuffledCards, setShuffledCards] = useState([]);
  const [difficulty, setDifficulty] = useState("easy");

  const [bestTime, setBestTime] = useState(
    localStorage.getItem("bestTime") || null
  );

  const easyCards = [
    "🐶","🐶","🐱","🐱","🐭","🐭","🐹","🐹",
    "🐰","🐰","🦊","🦊","🐻","🐻","🐼","🐼"
  ];

  const mediumCards = [
    "🐶","🐶","🐱","🐱","🐭","🐭","🐹","🐹",
    "🐰","🐰","🦊","🦊","🐻","🐻","🐼","🐼",
    "🐨","🐨","🐯","🐯"
  ];

  const hardCards = [
    "🐶","🐶","🐱","🐱","🐭","🐭","🐹","🐹",
    "🐰","🐰","🦊","🦊","🐻","🐻","🐼","🐼",
    "🐨","🐨","🐯","🐯","🦁","🦁","🐮","🐮",
    "🐷","🐷","🐸","🐸","🐵","🐵","🐔","🐔",
    "🐧","🐧","🐙","🐙"
  ];

  const selectedCards =
    difficulty === "easy"
      ? easyCards
      : difficulty === "medium"
      ? mediumCards
      : hardCards;

  const cards = selectedCards.map((emoji, index) => ({
    id: index + 1,
    emoji,
  }));

  const shuffleCards = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setShuffledCards(shuffled);
  };

  const startGame = () => {
    setTimer(0);
    setFlippedCards([]);
    setMatchedCards([]);
    setGameWon(false);

    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setShuffledCards(shuffled);

    setGameStarted(true);
  };

  const restartGame = () => {
    startGame();
  };

  useEffect(() => {
    if (gameStarted) {
      startGame();
    }
  }, [difficulty]);

  useEffect(() => {
    let interval;

    if (gameStarted && !gameWon) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [gameStarted, gameWon]);

  useEffect(() => {
    if (flippedCards.length === 2) {
      const firstCard = shuffledCards.find(
        (card) => card.id === flippedCards[0]
      );

      const secondCard = shuffledCards.find(
        (card) => card.id === flippedCards[1]
      );

      if (firstCard && secondCard) {
        if (firstCard.emoji === secondCard.emoji) {
          setMatchedCards((prev) => [
            ...prev,
            firstCard.id,
            secondCard.id,
          ]);

          setFlippedCards([]);
        } else {
          setTimeout(() => {
            setFlippedCards([]);
          }, 1000);
        }
      }
    }
  }, [flippedCards, shuffledCards]);

  useEffect(() => {
    if (
      gameStarted &&
      matchedCards.length > 0 &&
      matchedCards.length === cards.length
    ) {
      setGameWon(true);

      const currentBest = localStorage.getItem("bestTime");

      if (!currentBest || timer < Number(currentBest)) {
        localStorage.setItem("bestTime", timer);
        setBestTime(timer);
      }
    }
  }, [matchedCards, gameStarted, timer, cards.length]);

  const handleCardClick = (id) => {
    if (flippedCards.includes(id)) return;
    if (matchedCards.includes(id)) return;
    if (flippedCards.length === 2) return;

    setFlippedCards((prev) => [...prev, id]);
  };

  return (
    <div className="app">
      <h1 className="title">🧠 Card Memory Game</h1>

      <div className="difficulty-container">
        <button
          className={`difficulty-btn ${
            difficulty === "easy" ? "active" : ""
          }`}
          onClick={() => setDifficulty("easy")}
        >
          😊 Easy
        </button>

        <button
          className={`difficulty-btn ${
            difficulty === "medium" ? "active" : ""
          }`}
          onClick={() => setDifficulty("medium")}
        >
          😎 Medium
        </button>

        <button
          className={`difficulty-btn ${
            difficulty === "hard" ? "active" : ""
          }`}
          onClick={() => setDifficulty("hard")}
        >
          🔥 Hard
        </button>
      </div>

      <div className="stats-row">
        <div className="timer">⏱ Time: {timer}s</div>
        <div className="timer">
          🏆 Best Time: {bestTime || "--"}s
        </div>
      </div>

      {gameStarted && (
        <button className="restart-btn" onClick={restartGame}>
          🔄 Restart Game
        </button>
      )}

      {!gameStarted ? (
        <button className="start-btn" onClick={startGame}>
          🚀 Start Game
        </button>
      ) : (
        <>
          {gameWon ? (
            <div className="win-box">
              <h2>🎉 Congratulations!</h2>
              <h3>You finished in {timer} seconds</h3>

              <button
                className="restart-btn"
                onClick={restartGame}
              >
                🎮 Play Again
              </button>
            </div>
          ) : (
            <h2>Find All Matching Pairs</h2>
          )}

          <div
            className="grid"
            style={{
              gridTemplateColumns:
                difficulty === "easy"
                  ? "repeat(4, 75px)"
                  : difficulty === "medium"
                  ? "repeat(5, 75px)"
                  : "repeat(6, 75px)",
            }}
          >
            {shuffledCards.map((card) => {
              if (matchedCards.includes(card.id)) {
                return (
                  <div
                    key={card.id}
                    style={{
                      width: "75px",
                      height: "75px",
                    }}
                  />
                );
              }

              return (
                <button
                  key={card.id}
                  className="card"
                  onClick={() => handleCardClick(card.id)}
                >
                  {flippedCards.includes(card.id)
                    ? card.emoji
                    : "❓"}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default App;