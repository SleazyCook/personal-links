import LinkButton from "./components/LinkButton";
import ExpandableBio from "./components/ExpandableBio";
import bioContent from "./content/bioContent";
import links from "./data/links";
import styles from "./styles/App.module.css";

export default function App() {
  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <div className={styles.avatar}>
          <img src="https://i.imgur.com/i5gnF20.jpg" alt="Drew Cook" />
        </div>
        <h1 className={styles.name}>Developed by Drewford</h1>
        <ExpandableBio>
          {bioContent}
        </ExpandableBio>
        <nav className={styles.links} aria-label="Social links">
          {links.map((link) => (
            <LinkButton key={link.id} {...link} />
          ))}
        </nav>
      </div>
      <footer className={styles.footer}>
        <a href="https://drewford.dev" target="_blank" rel="noopener noreferrer" className={styles.footerLink}>
          © 2026 Developed by Drewford
        </a>
      </footer>
    </main>
  );
}
