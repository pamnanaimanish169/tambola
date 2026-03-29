import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { Link } from "react-router-dom";
import { tambolaCalls } from "../data/tambolaCalls";
import "./TambolaCaller.css";

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffleNumbers1to90(): number[] {
  const items = Array.from({ length: 90 }, (_, i) => i + 1);
  for (let i = items.length - 1; i > 0; i--) {
    const j = randomInt(0, i);
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

type CallerState = {
  deck: number[];
  nextIndex: number;
  history: number[];
  current: number | null;
  lastAnnouncement: string;
};

const initialCallerState = (): CallerState => ({
  deck: shuffleNumbers1to90(),
  nextIndex: 0,
  history: [],
  current: null,
  lastAnnouncement: "",
});

type CallerAction =
  | { type: "CALL_NEXT"; number: number; announcement: string }
  | { type: "RESET_DECK"; deck: number[] };

function callerReducer(state: CallerState, action: CallerAction): CallerState {
  switch (action.type) {
    case "CALL_NEXT": {
      return {
        ...state,
        nextIndex: state.nextIndex + 1,
        history: [...state.history, action.number],
        current: action.number,
        lastAnnouncement: action.announcement,
      };
    }
    case "RESET_DECK":
      return {
        deck: action.deck,
        nextIndex: 0,
        history: [],
        current: null,
        lastAnnouncement: "",
      };
    default:
      return state;
  }
}

function buildAnnouncement(num: number): string {
  const phrase = tambolaCalls[num];
  if (phrase && phrase.trim()) {
    return /[.!?]$/.test(phrase) ? phrase : `${phrase}.`;
  }
  return `Number ${num} called.`;
}

const AUTO_INTERVALS = [3, 5, 8, 10] as const;

export default function TambolaCaller() {
  const [state, dispatch] = useReducer(callerReducer, undefined, initialCallerState);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voicesReady, setVoicesReady] = useState(
    () =>
      typeof window === "undefined" ||
      typeof window.speechSynthesis === "undefined",
  );
  const [userVoiceURI, setUserVoiceURI] = useState("");
  const [speechSupported] = useState(
    () =>
      typeof window !== "undefined" &&
      typeof window.speechSynthesis !== "undefined",
  );

  const resolvedVoiceURI = useMemo(() => {
    if (userVoiceURI) {
      return userVoiceURI;
    }
    const preferred =
      voices.find(
        (v) =>
          v.lang.toLowerCase().startsWith("en-in") ||
          v.lang.toLowerCase().startsWith("hi-in"),
      ) ||
      voices.find((v) => v.default) ||
      voices[0];
    return preferred?.voiceURI ?? "";
  }, [voices, userVoiceURI]);
  const [autoIntervalSec, setAutoIntervalSec] =
    useState<(typeof AUTO_INTERVALS)[number]>(5);
  const [autoActive, setAutoActive] = useState(false);
  const autoTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const wasAutoActiveRef = useRef(false);

  const speakText = useCallback(
    (text: string) => {
      if (!speechSupported || !text) {
        return;
      }
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        const selectedVoice = voices.find(
          (voice) => voice.voiceURI === resolvedVoiceURI,
        );
        if (selectedVoice) {
          utterance.voice = selectedVoice;
          utterance.lang = selectedVoice.lang;
        } else {
          utterance.lang = "en-IN";
        }
        utterance.rate = 0.92;
        utterance.pitch = 1;
        window.speechSynthesis.speak(utterance);
      } catch {
        /* fail gracefully */
      }
    },
    [speechSupported, resolvedVoiceURI, voices],
  );

  useEffect(() => {
    if (!speechSupported) {
      return;
    }

    const loadVoices = () => {
      try {
        const list = window.speechSynthesis.getVoices();
        queueMicrotask(() => {
          setVoices(list);
          setVoicesReady(true);
        });
      } catch {
        queueMicrotask(() => {
          setVoicesReady(true);
        });
      }
    };

    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    const t = window.setTimeout(loadVoices, 500);

    return () => {
      window.clearTimeout(t);
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
    };
  }, [speechSupported]);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const callNextNumber = useCallback(() => {
    if (state.nextIndex >= 90) {
      return false;
    }
    const num = state.deck[state.nextIndex];
    const announcement = buildAnnouncement(num);
    dispatch({ type: "CALL_NEXT", number: num, announcement });
    speakText(announcement);
    return true;
  }, [state.nextIndex, state.deck, speakText]);

  const callNextNumberRef = useRef(callNextNumber);

  useEffect(() => {
    callNextNumberRef.current = callNextNumber;
  }, [callNextNumber]);

  useEffect(() => {
    if (!autoActive) {
      wasAutoActiveRef.current = false;
      if (autoTimerRef.current) {
        clearInterval(autoTimerRef.current);
        autoTimerRef.current = null;
      }
      return;
    }

    const justStarted = !wasAutoActiveRef.current;
    wasAutoActiveRef.current = true;

    const tick = () => {
      const ok = callNextNumberRef.current();
      if (!ok) {
        setAutoActive(false);
      }
    };

    if (justStarted) {
      tick();
    }

    if (autoTimerRef.current) {
      clearInterval(autoTimerRef.current);
    }
    autoTimerRef.current = setInterval(tick, autoIntervalSec * 1000);

    return () => {
      if (autoTimerRef.current) {
        clearInterval(autoTimerRef.current);
        autoTimerRef.current = null;
      }
    };
  }, [autoActive, autoIntervalSec]);

  const handleReset = () => {
    setAutoActive(false);
    if (autoTimerRef.current) {
      clearInterval(autoTimerRef.current);
      autoTimerRef.current = null;
    }
    if (speechSupported) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        /* ignore */
      }
    }
    const freshDeck = shuffleNumbers1to90();
    dispatch({ type: "RESET_DECK", deck: freshDeck });
  };

  const handleReplay = () => {
    if (!state.lastAnnouncement) {
      return;
    }
    speakText(state.lastAnnouncement);
  };

  const toggleAuto = () => {
    if (state.nextIndex >= 90) {
      return;
    }
    setAutoActive((prev) => !prev);
  };

  const calledCount = state.nextIndex;
  const remainingCount = 90 - state.nextIndex;
  const canCallMore = state.nextIndex < 90;
  const calledSet = new Set(state.history);

  return (
    <div className="tambola-caller">
      <div className="caller-voice-bar">
        <div className="caller-voice-row">
          <label className="caller-label" htmlFor="caller-voice">
            Voice / language
          </label>
          <select
            id="caller-voice"
            className="caller-select game-input"
            value={resolvedVoiceURI}
            onChange={(e) => setUserVoiceURI(e.target.value)}
            disabled={!voicesReady || !voices.length}
            aria-busy={!voicesReady}
          >
            {!voicesReady ? (
              <option value="">Loading voices…</option>
            ) : !voices.length ? (
              <option value="">No voices available</option>
            ) : (
              voices.map((v) => (
                <option key={v.voiceURI} value={v.voiceURI}>
                  {v.name} ({v.lang})
                </option>
              ))
            )}
          </select>
        </div>

        {!speechSupported ? (
          <p className="caller-hint caller-hint--warn" role="status">
            Speech synthesis is not available in this browser. The game still
            works; enable a compatible browser for voice calls.
          </p>
        ) : null}
      </div>

      <div className="caller-shell">
        <div className="caller-panel caller-panel--controls">
          <h2 className="caller-tool-title">Tambola Caller (1–90)</h2>
          <p className="caller-lead">
            Each round uses a shuffled order—no repeats until you reset. Use
            auto-call for remote games or tap the buttons below.
          </p>

          <div
            className="caller-current"
            aria-live="polite"
            aria-atomic="true"
          >
            {state.current !== null ? (
              <>
                <div className="caller-big-number">{state.current}</div>
                {tambolaCalls[state.current] ? (
                  <p className="caller-phrase">{tambolaCalls[state.current]}</p>
                ) : (
                  <p className="caller-phrase caller-phrase--fallback">
                    Number {state.current} called.
                  </p>
                )}
              </>
            ) : (
              <div className="caller-placeholder">
                <span className="caller-big-number caller-big-number--muted">
                  —
                </span>
                <p className="caller-placeholder-text">
                  Tap &quot;Call Next Number&quot; to start this round.
                </p>
              </div>
            )}
          </div>

          <div className="caller-stats">
            <div className="caller-stat">
              <span className="caller-stat-label">Called</span>
              <span className="caller-stat-value">{calledCount}</span>
            </div>
            <div className="caller-stat">
              <span className="caller-stat-label">Remaining</span>
              <span className="caller-stat-value">{remainingCount}</span>
            </div>
          </div>

          <div className="caller-actions">
            <button
              type="button"
              className="button"
              onClick={() => {
                callNextNumber();
              }}
              disabled={!canCallMore || autoActive}
            >
              Call Next Number
            </button>
            <button
              type="button"
              className="button button-accent"
              onClick={handleReplay}
              disabled={!state.lastAnnouncement || autoActive}
            >
              Replay last call
            </button>
            <button type="button" className="button" onClick={handleReset}>
              Reset game
            </button>
          </div>

          <div className="caller-auto">
            <span className="caller-label">Auto-call every</span>
            <div className="caller-intervals">
              {AUTO_INTERVALS.map((sec) => (
                <button
                  key={sec}
                  type="button"
                  className={`caller-interval-btn ${autoIntervalSec === sec ? "is-selected" : ""}`}
                  onClick={() => setAutoIntervalSec(sec)}
                  disabled={autoActive}
                >
                  {sec}s
                </button>
              ))}
            </div>
            <button
              type="button"
              className={`button caller-auto-toggle ${autoActive ? "is-pausing" : ""}`}
              onClick={toggleAuto}
              disabled={!canCallMore}
            >
              {autoActive ? "Pause auto-call" : "Start auto-call"}
            </button>
          </div>
        </div>

        <div className="caller-panel caller-panel--board">
          <h3 className="caller-board-title">Board (1–90)</h3>
          <div className="caller-board-grid" role="grid" aria-label="Numbers 1 to 90">
            {Array.from({ length: 90 }, (_, i) => i + 1).map((num) => {
              const isCalled = calledSet.has(num);
              const isCurrent = state.current === num;
              return (
                <div
                  key={num}
                  role="gridcell"
                  className={`caller-cell ${isCalled ? "is-called" : ""} ${isCurrent ? "is-current" : ""}`}
                >
                  {num}
                </div>
              );
            })}
          </div>

          <div className="caller-history-block">
            <h4 className="caller-history-title">Call history (order)</h4>
            <div className="caller-history-chips" aria-live="polite">
              {state.history.length === 0 ? (
                <span className="caller-history-empty">No numbers yet.</span>
              ) : (
                state.history.map((n, idx) => (
                  <span key={`${n}-${idx}`} className="caller-chip">
                    {n}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="caller-cross">
        <p>Need printable tickets?</p>
        <Link
          to="/tambola-tickets-generator"
          className="button button-accent"
        >
          Tambola tickets generator
        </Link>
        <Link to="/" className="caller-link-home">
          ← Tambola number generator
        </Link>
      </div>
    </div>
  );
}
