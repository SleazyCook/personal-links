// import LinkButton from "./components/LinkButton";
import IconRow from "./components/IconRow";
import ExpandableBio from "./components/ExpandableBio";
import ActionBar from "./components/ActionBar";
import PhotoWidget from "./components/PhotoWidget";
import { useSmugMugPhotos } from "./hooks/useSmugMugPhotos";
import { fallbackPhotos } from "./data/fallbackPhotos";
import bioContent from "./content/bioContent";
import links from "./data/links";
import styles from "./styles/App.module.css";

export default function App() {
  const { photos, loading } = useSmugMugPhotos(fallbackPhotos);

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <div className={styles.avatar}>
          <img src="https://i.imgur.com/i5gnF20.jpg" alt="Drew Cook" />
        </div>
        <h1 className={styles.name}>developed by drewford</h1>
        <IconRow links={links} />
        <ExpandableBio>
          {bioContent}
        </ExpandableBio>
        <ActionBar />
        <PhotoWidget images={photos} interval={4500} loading={loading} />
        {/* <nav className={styles.links} aria-label="Social links">
          {links.map((link) => (
            <LinkButton key={link.id} {...link} />
          ))}
        </nav> */}
      </div>
      <footer className={styles.footer}>
        <a href="https://drewford.dev" target="_blank" rel="noopener noreferrer" className={styles.footerLink}>
          © 2026 Developed by Drewford
        </a>
      </footer>
    </main>
  );
}
