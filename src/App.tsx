import { useState, KeyboardEvent } from 'react'
import './styles/main.css'
import './styles/game.css'
import { useGame } from './hooks/useGame'

function App() {
  const [currentGuess, setCurrentGuess] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const { gameState, makeGuess, startGame } = useGame()

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && currentGuess.trim()) {
      const result = makeGuess(currentGuess.trim())
      if (result.error) {
        setErrorMessage(result.error)
        setTimeout(() => setErrorMessage(''), 3000)
      } else {
        setErrorMessage('')
        setCurrentGuess('')
      }
    }
  }

  const getDisplayValue = (field: string) => {
    const correctGuess = gameState.guesses.find(guess => 
      guess.result[field as keyof typeof guess.result] === 'correct'
    );
    return correctGuess ? correctGuess.plane[field as keyof typeof correctGuess.plane] : '-';
  }

  const getCircleClass = (field: string) => {
    const correctGuess = gameState.guesses.find(guess => 
      guess.result[field as keyof typeof guess.result] === 'correct'
    );
    return correctGuess ? 'correct' : '';
  }

  return (
    <div className="container">
      <header className="header">
        <h1>PlaneDL</h1>
        <p className="remaining-guesses">
          Kalan Tahmin: {gameState.remainingGuesses}
        </p>
      </header>

      <main className="game-board">
        <div className="plane-info">
          <div className={`info-circle ${getCircleClass('manufacturer')}`}>
            <span className="info-label">üretici</span>
            <span className="info-value">{getDisplayValue('manufacturer')}</span>
          </div>
          <div className={`info-circle ${getCircleClass('maxRange')}`}>
            <span className="info-label">max range</span>
            <span className="info-value">{getDisplayValue('maxRange')}</span>
          </div>
          <div className={`info-circle ${getCircleClass('engineCount')}`}>
            <span className="info-label">motor sayısı</span>
            <span className="info-value">{getDisplayValue('engineCount')}</span>
          </div>
          <div className={`info-circle ${getCircleClass('productionYear')}`}>
            <span className="info-label">üretim yılı</span>
            <span className="info-value">{getDisplayValue('productionYear')}</span>
          </div>
          <div className={`info-circle ${getCircleClass('totalProduced')}`}>
            <span className="info-label">kaç tane üretildi</span>
            <span className="info-value">{getDisplayValue('totalProduced')}</span>
          </div>
        </div>

        <div className="guess-section">
          <div className="guess-input">
            <input
              type="text"
              value={currentGuess}
              onChange={(e) => setCurrentGuess(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="tahminini yaz..."
              disabled={gameState.gameOver}
            />
          </div>
          
          {errorMessage && (
            <div className="error-message">
              {errorMessage}
            </div>
          )}

          <div className="history-list">
            {gameState.guesses.map((guess, index) => (
              <div key={index} className="guess-item">
                <div className="guess-model">{guess.plane.model}</div>
                <div className="guess-details">
                  <div className={`info-circle ${guess.result.manufacturer === 'correct' ? 'correct' : ''}`}>
                    <span className="info-label">üretici</span>
                    <span className="info-value">{guess.plane.manufacturer}</span>
                  </div>
                  <div className={`info-circle ${guess.result.maxRange === 'correct' ? 'correct' : ''} ${guess.result.maxRange !== 'correct' ? `hint-${guess.result.maxRange}` : ''}`}>
                    <span className="info-label">max range</span>
                    <span className="info-value">{guess.plane.maxRange}</span>
                  </div>
                  <div className={`info-circle ${guess.result.engineCount === 'correct' ? 'correct' : ''} ${guess.result.engineCount !== 'correct' ? `hint-${guess.result.engineCount}` : ''}`}>
                    <span className="info-label">motor sayısı</span>
                    <span className="info-value">{guess.plane.engineCount}</span>
                  </div>
                  <div className={`info-circle ${guess.result.productionYear === 'correct' ? 'correct' : ''} ${guess.result.productionYear !== 'correct' ? `hint-${guess.result.productionYear}` : ''}`}>
                    <span className="info-label">üretim yılı</span>
                    <span className="info-value">{guess.plane.productionYear}</span>
                  </div>
                  <div className={`info-circle ${guess.result.totalProduced === 'correct' ? 'correct' : ''} ${guess.result.totalProduced !== 'correct' ? `hint-${guess.result.totalProduced}` : ''}`}>
                    <span className="info-label">kaç tane üretildi</span>
                    <span className="info-value">{guess.plane.totalProduced}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {gameState.gameOver && (
          <div className="game-over">
            {gameState.won ? (
              <p className="win-message">Tebrikler! Doğru tahmin!</p>
            ) : (
              <p className="lose-message">
                Oyun bitti! Doğru cevap: {gameState.targetPlane?.model}
              </p>
            )}
            <button className="restart-button" onClick={() => startGame()}>
              Yeniden Oyna
            </button>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
