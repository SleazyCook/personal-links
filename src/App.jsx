// import LinkButton from "./components/LinkButton";
import IconRow from "./components/IconRow";
import ExpandableBio from "./components/ExpandableBio";
import PhotoWidget from "./components/PhotoWidget";
import { useSmugMugPhotos } from "./hooks/useSmugMugPhotos";
import bioContent from "./content/bioContent";
import links from "./data/links";
import styles from "./styles/App.module.css";

const fallbackPhotos = [
  {
    src: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop",
    alt: "Concert crowd with stage lights",
  },
  {
    src: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&auto=format&fit=crop",
    alt: "Live music performance",
  },
  {
    src: "https://images.unsplash.com/photo-1540039155733-5bb30b4e7b7d?w=800&auto=format&fit=crop",
    alt: "Festival stage at night",
  },
  {
    src: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&auto=format&fit=crop",
    alt: "Artist on stage",
  },
];

export default function App() {
  const { photos } = useSmugMugPhotos(fallbackPhotos);

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <div className={styles.avatar}>
          <img src="https://i.imgur.com/i5gnF20.jpg" alt="Drew Cook" />
        </div>
        <h1 className={styles.name}>Developed by Drewford</h1>
        <IconRow links={links} />
        <ExpandableBio>
          {bioContent}
        </ExpandableBio>
        <PhotoWidget images={photos} interval={4500} />
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
