import LinkButton from "./components/LinkButton";
import links from "./data/links";
import styles from "./App.module.css";

export default function App() {
  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <div className={styles.avatar} aria-hidden="true">
          {/* Replace with an <img> tag for a real avatar */}
          <span>AC</span>
        </div>
        <h1 className={styles.name}>Your Name</h1>
        <p className={styles.bio}>Short bio or tagline goes here.</p>
        <nav className={styles.links} aria-label="Social links">
          {links.map((link) => (
            <LinkButton key={link.id} {...link} />
          ))}
        </nav>
      </div>
    </main>
  );
}
