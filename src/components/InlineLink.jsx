import styles from "./InlineLink.module.css";

export default function InlineLink({ href, children }) {
  return (
    <a
      className={styles.inlineLink}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}