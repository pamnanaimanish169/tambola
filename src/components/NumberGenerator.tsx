import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { tambolaCalls } from '../data/tambolaCalls'
import './NumberGenerator.css'

const STORAGE_KEY = 'tambola-generator-state'

interface StoredState {
  calledNumbers: number[]
  currentNumber: number | null
}

function NumberGenerator() {
  // Load initial state from localStorage
  const loadStateFromStorage = (): { calledNumbers: Set<number>, currentNumber: number | null } => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed: StoredState = JSON.parse(stored)
        return {
          calledNumbers: new Set(parsed.calledNumbers || []),
          currentNumber: parsed.currentNumber || null
        }
      }
    } catch (error) {
      console.error('Error loading state from localStorage:', error)
    }
    return {
      calledNumbers: new Set<number>(),
      currentNumber: null
    }
  }

  const initialState = loadStateFromStorage()
  const [calledNumbers, setCalledNumbers] = useState<Set<number>>(initialState.calledNumbers)
  const [currentNumber, setCurrentNumber] = useState<number | null>(initialState.currentNumber)
  const [isGenerating, setIsGenerating] = useState(false)
  const [displayNumber, setDisplayNumber] = useState<number | null>(initialState.currentNumber)

  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
      const stateToStore: StoredState = {
        calledNumbers: Array.from(calledNumbers),
        currentNumber: currentNumber
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToStore))
    } catch (error) {
      console.error('Error saving state to localStorage:', error)
    }
  }, [calledNumbers, currentNumber])

  const availableNumbers = Array.from({ length: 90 }, (_, i) => i + 1).filter(
    num => !calledNumbers.has(num)
  )

  const generateNextNumber = () => {
    if (availableNumbers.length === 0) {
      alert('All numbers have been called!')
      return
    }

    setIsGenerating(true)
    setDisplayNumber(null)

    // Animation effect - show random numbers quickly
    const animationDuration = 1500 // 1.5 seconds
    const interval = 50 // Change number every 50ms
    const iterations = animationDuration / interval
    let currentIteration = 0

    const animationInterval = setInterval(() => {
      const randomAvailable = availableNumbers[
        Math.floor(Math.random() * availableNumbers.length)
      ]
      setDisplayNumber(randomAvailable)
      currentIteration++

      if (currentIteration >= iterations) {
        clearInterval(animationInterval)
        
        // Select final random number
        const finalNumber = availableNumbers[
          Math.floor(Math.random() * availableNumbers.length)
        ]
        
        setCurrentNumber(finalNumber)
        setDisplayNumber(finalNumber)
        setCalledNumbers(prev => new Set([...prev, finalNumber]))
        setIsGenerating(false)
      }
    }, interval)
  }

  const resetGame = () => {
    if (window.confirm('Are you sure you want to reset the game? All called numbers will be cleared.')) {
      setCalledNumbers(new Set())
      setCurrentNumber(null)
      setDisplayNumber(null)
      setIsGenerating(false)
      // Clear localStorage
      try {
        localStorage.removeItem(STORAGE_KEY)
      } catch (error) {
        console.error('Error clearing localStorage:', error)
      }
    }
  }

  const isNumberCalled = (num: number) => calledNumbers.has(num)

  return (
    <div className="number-generator-page">
      <nav className="generator-nav">
        <Link to="/" className="back-button">
          ← Back to Home
        </Link>
      </nav>
      <div className="generator-container">
        <div className="generator-controls">
          <h1 className="generator-title">Tambola Number Generator</h1>
          
          <div className="current-number-display">
            {isGenerating ? (
              <div className="number-animation">
                <div className="spinning-number">{displayNumber || '?'}</div>
                <p className="generating-text">Generating...</p>
              </div>
            ) : currentNumber ? (
              <div className="number-result">
                <div className="big-number">{currentNumber}</div>
                <div className="number-call">{tambolaCalls[currentNumber]}</div>
              </div>
            ) : (
              <div className="number-placeholder">
                <div className="big-number">?</div>
                <p>Click "Call Next" to start</p>
              </div>
            )}
          </div>

          <div className="control-buttons">
            <button 
              className="button button-primary" 
              onClick={generateNextNumber}
              disabled={isGenerating || availableNumbers.length === 0}
            >
              Call Next
            </button>
            <button 
              className="button button-secondary" 
              onClick={resetGame}
              disabled={isGenerating || calledNumbers.size === 0}
            >
              Reset Game
            </button>
          </div>

          <div className="stats">
            <div className="stat-item">
              <span className="stat-label">Called:</span>
              <span className="stat-value">{calledNumbers.size}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Remaining:</span>
              <span className="stat-value">{availableNumbers.length}</span>
            </div>
          </div>
        </div>

        <div className="number-board">
          <h2 className="board-title">Number Board (1-90)</h2>
          <div className="board-grid">
            {Array.from({ length: 90 }, (_, i) => i + 1).map(num => {
              const called = isNumberCalled(num)
              const isCurrent = currentNumber === num
              
              return (
                <div
                  key={num}
                  className={`board-cell ${called ? 'called' : ''} ${isCurrent ? 'current' : ''}`}
                >
                  {num}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default NumberGenerator

