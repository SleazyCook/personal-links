import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./ActionBar.module.css";

export default function ActionBar({ buyUrl = "https://drewford.smugmug.com" }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | sending | success | error

  const openModal = () => setModalOpen(true);

  const closeModal = () => {
    setClosing(true);
    setTimeout(() => {
      setModalOpen(false);
      setClosing(false);
      setStatus("idle");
    }, 220);
  };

  useEffect(() => {
    if (!modalOpen) return;
    const onKey = (e) => { if (e.key === "Escape") closeModal(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [modalOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = import.meta.env.VITE_FORMSPREE_ENDPOINT;
    if (!endpoint) return;

    setStatus("sending");
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        body: new FormData(e.target),
        headers: { Accept: "application/json" },
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <>
      <div className={styles.row}>
        <a
          href={buyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.btn}
        >
          Buy Photos
        </a>
        <button type="button" className={styles.btn} onClick={openModal}>
          Email Me
        </button>
      </div>

      {modalOpen &&
        createPortal(
          <div className={`${styles.overlay} ${closing ? styles.overlayOut : ""}`}>
            <div className={styles.backdrop} onClick={closeModal} aria-hidden="true" />
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Contact form"
              className={`${styles.modal} ${closing ? styles.modalOut : ""}`}
            >
              <button className={styles.closeBtn} onClick={closeModal} aria-label="Close">
                ✕
              </button>

              {status === "success" ? (
                <div className={styles.successMsg}>
                  <p>Message sent — I'll get back to you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className={styles.form}>
                  <h2 className={styles.formTitle}>Get in Touch</h2>

                  <label className={styles.label}>
                    Name & how to reach you
                    <input
                      name="contact"
                      required
                      className={styles.input}
                      placeholder="Name, phone, IG handle…"
                    />
                  </label>

                  <label className={styles.label}>
                    Subject
                    <input
                      name="subject"
                      required
                      className={styles.input}
                      placeholder="What's this about?"
                    />
                  </label>

                  <label className={styles.label}>
                    Message
                    <textarea
                      name="message"
                      required
                      rows={4}
                      className={styles.textarea}
                      placeholder="Tell me more…"
                    />
                  </label>

                  {status === "error" && (
                    <p className={styles.errorMsg}>Something went wrong — please try again.</p>
                  )}

                  <button
                    type="submit"
                    className={styles.submitBtn}
                    disabled={status === "sending"}
                  >
                    {status === "sending" ? "Sending…" : "Send Message"}
                  </button>
                </form>
              )}
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
