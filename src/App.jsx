// import LinkButton from "./components/LinkButton";
import { useState } from "react";
import { trackEvent } from "./utils/analytics";
import IconRow from "./components/IconRow";
import ExpandableBio from "./components/ExpandableBio";
import ActionBar from "./components/ActionBar";
import PhotoWidget from "./components/PhotoWidget";
import AvatarModal from "./components/AvatarModal";
import { useSmugMugPhotos } from "./hooks/useSmugMugPhotos";
import { fallbackPhotos } from "./data/fallbackPhotos";
import bioContent from "./content/bioContent";
import links from "./data/links";
import styles from "./styles/App.module.css";

const AVATAR_SRC = "https://i.imgur.com/i5gnF20.jpg";

export default function App() {
  const { photos, loading } = useSmugMugPhotos(fallbackPhotos);
  const [avatarOpen, setAvatarOpen] = useState(false);

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <div
          className={styles.avatar}
          onClick={() => { setAvatarOpen(true); trackEvent("avatar_open"); }}
          style={{ cursor: "pointer" }}
        >
          <img src={AVATAR_SRC} alt="Drew Cook" />
        </div>
        {avatarOpen && (
          <AvatarModal
            src={AVATAR_SRC}
            alt="Drew Cook"
            onClose={() => setAvatarOpen(false)}
          />
        )}
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
