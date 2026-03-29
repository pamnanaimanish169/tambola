import { Link } from "react-router-dom";
import { useState, useEffect, useCallback, useMemo } from "react";

import "./NumberGenerator.css";
import { tambolaCalls } from "../data/tambolaCalls";

const STORAGE_KEY = "tambola-generator-state";

interface StoredState {
  calledNumbers: number[];
  currentNumber: number | null;
}

interface NumberGeneratorProps {
  embedded?: boolean;
}

const DIGIT_WORDS: Record<string, string> = {
  "0": "Zero",
  "1": "One",
  "2": "Two",
  "3": "Three",
  "4": "Four",
  "5": "Five",
  "6": "Six",
  "7": "Seven",
  "8": "Eight",
  "9": "Nine",
};

function NumberGenerator({ embedded = false }: NumberGeneratorProps) {
  // Load initial state from localStorage
  const loadStateFromStorage = (): {
    calledNumbers: Set<number>;
    currentNumber: number | null;
  } => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: StoredState = JSON.parse(stored);
        return {
          calledNumbers: new Set(parsed.calledNumbers || []),
          currentNumber: parsed.currentNumber || null,
        };
      }
    } catch (error) {
      console.error("Error loading state from localStorage:", error);
    }
    return {
      calledNumbers: new Set<number>(),
      currentNumber: null,
    };
  };

  const initialState = loadStateFromStorage();
  const [calledNumbers, setCalledNumbers] = useState<Set<number>>(
    initialState.calledNumbers,
  );
  const [currentNumber, setCurrentNumber] = useState<number | null>(
    initialState.currentNumber,
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [displayNumber, setDisplayNumber] = useState<number | null>(
    initialState.currentNumber,
  );
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState("");

  /** Homepage embed: only the first five voices from the browser list. */
  const sampleVoices = useMemo(() => voices.slice(0, 5), [voices]);
  const voicesForSelect = embedded ? sampleVoices : voices;

  const getSpokenText = useCallback((num: number) => {
    const digitByDigit = num
      .toString()
      .split("")
      .map((digit) => DIGIT_WORDS[digit] || digit)
      .join(" ");

    const rhyme = tambolaCalls[num];
    const rhymeWithPunctuation = /[.!?]$/.test(rhyme) ? rhyme : `${rhyme}.`;

    return `${digitByDigit}. ${rhymeWithPunctuation}`;
  }, []);

  const speakNumberCall = useCallback(
    (num: number) => {
      if (typeof window === "undefined" || !window.speechSynthesis) {
        return;
      }

      const utterance = new SpeechSynthesisUtterance(getSpokenText(num));
      const selectedVoice = voices.find(
        (voice) => voice.voiceURI === selectedVoiceURI,
      );

      if (selectedVoice) {
        utterance.voice = selectedVoice;
        utterance.lang = selectedVoice.lang;
      } else {
        utterance.lang = "en-IN";
      }

      utterance.rate = 0.9;
      utterance.pitch = 1;

      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    },
    [getSpokenText, selectedVoiceURI, voices],
  );

  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
      const stateToStore: StoredState = {
        calledNumbers: Array.from(calledNumbers),
        currentNumber: currentNumber,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToStore));
    } catch (error) {
      console.error("Error saving state to localStorage:", error);
    }
  }, [calledNumbers, currentNumber]);

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      return;
    }

    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);

    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
    };
  }, []);

  useEffect(() => {
    if (!voices.length || selectedVoiceURI) {
      return;
    }

    const pool = embedded ? sampleVoices : voices;
    if (!pool.length) {
      return;
    }

    const preferredVoice =
      pool.find(
        (voice) =>
          voice.lang.toLowerCase().startsWith("en-in") ||
          voice.lang.toLowerCase().startsWith("hi-in"),
      ) ||
      pool.find((voice) => voice.default) ||
      pool[0];

    if (preferredVoice) {
      setSelectedVoiceURI(preferredVoice.voiceURI);
    }
  }, [voices, selectedVoiceURI, embedded, sampleVoices]);

  useEffect(() => {
    if (!embedded || !sampleVoices.length) {
      return;
    }
    if (sampleVoices.some((v) => v.voiceURI === selectedVoiceURI)) {
      return;
    }
    const preferredVoice =
      sampleVoices.find(
        (voice) =>
          voice.lang.toLowerCase().startsWith("en-in") ||
          voice.lang.toLowerCase().startsWith("hi-in"),
      ) ||
      sampleVoices.find((voice) => voice.default) ||
      sampleVoices[0];
    if (preferredVoice) {
      setSelectedVoiceURI(preferredVoice.voiceURI);
    }
  }, [embedded, sampleVoices, selectedVoiceURI]);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const availableNumbers = Array.from({ length: 90 }, (_, i) => i + 1).filter(
    (num) => !calledNumbers.has(num),
  );

  const generateNextNumber = () => {
    if (availableNumbers.length === 0) {
      alert("All numbers have been called!");
      return;
    }

    setIsGenerating(true);
    setDisplayNumber(null);

    // Animation effect - show random numbers quickly
    const animationDuration = 1500; // 1.5 seconds
    const interval = 50; // Change number every 50ms
    const iterations = animationDuration / interval;
    let currentIteration = 0;

    const animationInterval = setInterval(() => {
      const randomAvailable =
        availableNumbers[Math.floor(Math.random() * availableNumbers.length)];
      setDisplayNumber(randomAvailable);
      currentIteration++;

      if (currentIteration >= iterations) {
        clearInterval(animationInterval);

        // Select final random number
        const finalNumber =
          availableNumbers[Math.floor(Math.random() * availableNumbers.length)];

        setCurrentNumber(finalNumber);
        setDisplayNumber(finalNumber);
        setCalledNumbers((prev) => new Set([...prev, finalNumber]));
        speakNumberCall(finalNumber);
        setIsGenerating(false);
      }
    }, interval);
  };

  const resetGame = () => {
    if (
      window.confirm(
        "Are you sure you want to reset the game? All called numbers will be cleared.",
      )
    ) {
      setCalledNumbers(new Set());
      setCurrentNumber(null);
      setDisplayNumber(null);
      setIsGenerating(false);
      // Clear localStorage
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (error) {
        console.error("Error clearing localStorage:", error);
      }
    }
  };

  const isNumberCalled = (num: number) => calledNumbers.has(num);

  return (
    <div className="number-generator-section">
      {!embedded && (
        <nav className="generator-nav">
          <Link to="/" className="back-button">
            ← Back to Home
          </Link>
        </nav>
      )}
      <div className="generator-container">
        <div className="generator-controls">
          <div className="voice-selector">
            <label htmlFor="voice-select">Voice</label>
            <select
              id="voice-select"
              value={selectedVoiceURI}
              onChange={(event) => setSelectedVoiceURI(event.target.value)}
              disabled={!voicesForSelect.length}
            >
              {voicesForSelect.length === 0 ? (
                <option value="">No voices found</option>
              ) : (
                voicesForSelect.map((voice) => (
                  <option key={voice.voiceURI} value={voice.voiceURI}>
                    {voice.name} ({voice.lang})
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="current-number-display">
            {isGenerating ? (
              <div className="number-animation">
                <div className="spinning-number">{displayNumber || "?"}</div>
                <p className="generating-text">Generating...</p>
              </div>
            ) : currentNumber ? (
              <div className="number-result">
                <div className="big-number">{currentNumber}</div>
                <div className="number-call">{tambolaCalls[currentNumber]}</div>
                <button
                  className="audio-play-button"
                  onClick={() => speakNumberCall(currentNumber)}
                  type="button"
                >
                  ▶ Play Audio
                </button>
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
        </div>

        <div>
          <div className="number-board">
            <h2 className="board-title">Number Board (1-90)</h2>
            <div className="board-grid">
              {Array.from({ length: 90 }, (_, i) => i + 1).map((num) => {
                const called = isNumberCalled(num);
                const isCurrent = currentNumber === num;

                return (
                  <div
                    key={num}
                    className={`board-cell ${called ? "called" : ""} ${isCurrent ? "current" : ""}`}
                  >
                    {num}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="generator-bottom-row">
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

            <div className="tool-cross-link">
              <p>Need tickets or a full voice caller?</p>
              <Link
                to="/tambola-tickets-generator"
                className="button button-accent"
              >
                Generate Tambola Tickets
              </Link>
              <Link
                to="/online-tambola-caller"
                className="button button-secondary-link"
              >
                Online tambola caller (1–90)
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NumberGenerator;
