import { useEffect, useRef } from "react";
import styles from "./AvatarModal.module.css";

export default function AvatarModal({ src, alt, onClose }) {
  const overlayRef = useRef(null);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") triggerClose(); };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, []);

  function triggerClose() {
    const overlay = overlayRef.current;
    if (!overlay) return;
    overlay.dataset.closing = "true";
    overlay.addEventListener("animationend", onClose, { once: true });
  }

  function handleOverlayClick(e) {
    if (e.target === overlayRef.current) triggerClose();
  }

  return (
    <div
      ref={overlayRef}
      className={styles.overlay}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label="Avatar preview"
    >
      <div className={styles.imageWrap}>
        <img src={src} alt={alt} className={styles.image} />
      </div>
    </div>
  );
}
