import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./PhotoWidget.module.css";

const KB_CLASSES = [styles.kb0, styles.kb1, styles.kb2, styles.kb3];
const FADE_MS = 800;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function PhotoWidget({ images = [], interval = 4000 }) {
  const [deck, setDeck] = useState(() => shuffle(images));
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState(null);
  const paused = useRef(false);
  const touchStartX = useRef(null);
  const kbStartRef = useRef(Date.now());
  const kbElapsedRef = useRef(0);

  // Re-shuffle and reset when the images prop changes (e.g. API load replaces fallback)
  useEffect(() => {
    setDeck(shuffle(images));
    setCurrent(0);
    setPrev(null);
    kbStartRef.current = Date.now();
  }, [images]);

  // Preload all images so they're in cache before advance() fires
  useEffect(() => {
    deck.forEach(({ src }) => {
      const img = new Image();
      img.src = src;
    });
  }, [deck]);

  const advance = useCallback(
    (dir = 1) => {
      kbElapsedRef.current = (Date.now() - kbStartRef.current) / 1000;
      kbStartRef.current = Date.now();

      setCurrent((c) => {
        const next = (c + dir + deck.length) % deck.length;
        setPrev(c);
        setTimeout(() => setPrev(null), FADE_MS + 100);
        return next;
      });
    },
    [deck.length]
  );

  useEffect(() => {
    if (deck.length <= 1) return;
    const id = setInterval(() => {
      if (!paused.current) advance();
    }, interval);
    return () => clearInterval(id);
  }, [advance, deck.length, interval]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 48) advance(delta > 0 ? 1 : -1);
    touchStartX.current = null;
  };

  if (!deck.length) return null;

  return (
    <div
      className={styles.widget}
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      role="img"
      aria-label={deck[current].alt ?? "Photo slideshow"}
    >
      <div className={styles.frame}>
        {prev !== null && (
          <div key={`p${prev}`} className={`${styles.slide} ${styles.below}`}>
            <img
              src={deck[prev].src}
              alt=""
              aria-hidden="true"
              className={`${styles.image} ${KB_CLASSES[prev % KB_CLASSES.length]}`}
              style={{ animationDelay: `-${kbElapsedRef.current}s` }}
              loading="eager"
            />
          </div>
        )}

        <div key={`c${current}`} className={`${styles.slide} ${styles.above}`}>
          <img
            src={deck[current].src}
            alt={deck[current].alt ?? ""}
            className={`${styles.image} ${KB_CLASSES[current % KB_CLASSES.length]}`}
            loading="eager"
          />
        </div>

        <div className={styles.overlay} aria-hidden="true" />

      </div>
    </div>
  );
}
