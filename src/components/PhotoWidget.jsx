import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./PhotoWidget.module.css";

const KB_CLASSES = [styles.kb0, styles.kb1, styles.kb2, styles.kb3];
const FADE_MS = 800;

export default function PhotoWidget({ images = [], interval = 4000 }) {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState(null);
  const paused = useRef(false);
  const touchStartX = useRef(null);

  const advance = useCallback(
    (dir = 1) => {
      setCurrent((c) => {
        const next = (c + dir + images.length) % images.length;
        setPrev(c);
        setTimeout(() => setPrev(null), FADE_MS + 100);
        return next;
      });
    },
    [images.length]
  );

  useEffect(() => {
    if (images.length <= 1) return;
    const id = setInterval(() => {
      if (!paused.current) advance();
    }, interval);
    return () => clearInterval(id);
  }, [advance, images.length, interval]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 48) advance(delta > 0 ? 1 : -1);
    touchStartX.current = null;
  };

  if (!images.length) return null;

  return (
    <div
      className={styles.widget}
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      role="img"
      aria-label={images[current].alt ?? "Photo slideshow"}
    >
      <div className={styles.frame}>
        {/* Leaving image — sits below, no KB restart needed */}
        {prev !== null && (
          <div key={`p${prev}`} className={`${styles.slide} ${styles.below}`}>
            <img
              src={images[prev].src}
              alt=""
              aria-hidden="true"
              className={`${styles.image} ${KB_CLASSES[prev % KB_CLASSES.length]}`}
              loading="lazy"
            />
          </div>
        )}

        {/* Entering image — fades in on top, KB animation restarts via key */}
        <div key={`c${current}`} className={`${styles.slide} ${styles.above}`}>
          <img
            src={images[current].src}
            alt={images[current].alt ?? ""}
            className={`${styles.image} ${KB_CLASSES[current % KB_CLASSES.length]}`}
            loading="lazy"
          />
        </div>

        <div className={styles.overlay} aria-hidden="true" />

        {images.length > 1 && (
          <div className={styles.dots} aria-hidden="true">
            {images.map((_, i) => (
              <span
                key={i}
                className={`${styles.dot} ${i === current ? styles.dotActive : ""}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
