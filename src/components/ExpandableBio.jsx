import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { trackEvent } from "../utils/analytics";
import styles from "./ExpandableBio.module.css";

export default function ExpandableBio({ children }) {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);

  const openModal = () => { setOpen(true); trackEvent("bio_expand"); };

  const closeModal = () => {
    setClosing(true);
    setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, 220);
  };

  // Escape key + body scroll lock
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") closeModal(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.textContainer}>
          <div className={styles.content}>{children}</div>
          <div className={styles.fade} aria-hidden="true" />
        </div>
        <button
          className={styles.readMoreBtn}
          onClick={openModal}
          aria-haspopup="dialog"
          aria-label="Read full bio"
        >
          Read More
        </button>
      </div>

      {open &&
        createPortal(
          <div className={`${styles.overlay} ${closing ? styles.overlayOut : ""}`}>
            <div className={styles.backdrop} onClick={closeModal} aria-hidden="true" />
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Full bio"
              className={`${styles.modal} ${closing ? styles.modalOut : ""}`}
            >
              <button
                className={styles.closeBtn}
                onClick={closeModal}
                aria-label="Close"
              >
                ✕
              </button>
              <div className={styles.modalBody}>{children}</div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
