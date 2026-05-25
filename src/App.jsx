import LinkButton from "./components/LinkButton";
import ExpandableBio from "./components/ExpandableBio";
import links from "./data/links";
import styles from "./App.module.css";

export default function App() {
  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <div className={styles.avatar}>
          <img src="https://i.imgur.com/i5gnF20.jpg" alt="Drew Cook" />
        </div>
        <h1 className={styles.name}>Developed by Drewford</h1>
        <ExpandableBio>
          Drew Cook is a Houston, TX-based software engineer, photographer, and
          videographer who specializes in capturing the city&apos;s local music,
          hip-hop, and entertainment scene.{" "}
          <br />
          He frequently collaborates with regional artists and event organizers
          like BLD PWR, L.O.U.D Muzik, and reggae artist Kristine Alicia documenting concerts,
          behind-the-scenes studio sessions, and live performances at venues like
          the House of Blues, White Oak Music Hall, and the DeLuxe Theater.{" "}
          <br />
          While Drewford is primarily active behind the camera, his work is
          heavily shared across platforms.
        </ExpandableBio>
        <nav className={styles.links} aria-label="Social links">
          {links.map((link) => (
            <LinkButton key={link.id} {...link} />
          ))}
        </nav>
      </div>
      <footer className={styles.footer}>
        <a href="https://drewford.dev" target="_blank" rel="noopener noreferrer" className={styles.footerLink}>
          Developed by Drewford
        </a>
      </footer>
    </main>
  );
}
