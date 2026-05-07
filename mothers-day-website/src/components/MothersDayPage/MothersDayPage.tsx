import { GreetingAnimation } from '../GreetingAnimation/GreetingAnimation';
import { Gallery } from '../Gallery/Gallery';
import { GREETING_TEXT, GREETING_SUBTITLE } from '../../constants/greetingText';
import { GALLERY_IMAGES } from '../../constants/galleryImages';
import styles from './MothersDayPage.module.css';

/**
 * MothersDayPage - Main page component
 * Composes all feature components: Greeting, Gallery, Message Form
 */
export function MothersDayPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Felicidades Mamá</h1>
      </header>

      <main className={styles.main}>
        {/* Phase 3: Greeting Animation */}
        <section className={styles.section}>
          <GreetingAnimation 
            text={GREETING_TEXT}
            subtitle={GREETING_SUBTITLE}
          />
        </section>

        {/* Phase 4: Gallery */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Galería de Fotos</h2>
          <Gallery images={GALLERY_IMAGES} />
        </section>

        {/* Phase 5: Message Form (coming next) */}
        {/* <section className={styles.section}>
          <MessageForm />
        </section> */}
      </main>

      <footer className={styles.footer}>
        <p>Hecho con ❤️ para ti</p>
      </footer>
    </div>
  );
}
