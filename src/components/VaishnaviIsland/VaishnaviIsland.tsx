import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { IslandDialogue } from './IslandDialogue';
import type { DialogueContent } from './IslandDialogue';
import { BeachSubtitle } from './BeachSubtitle';
import styles from './VaishnaviIsland.module.css';

const WORLD_W = 5000;
const WORLD_H = 3800;

interface DialogueState {
  title: string;
  content: DialogueContent;
}

interface VaishnaviIslandProps {
  onClose: () => void;
}

// Studio is at world (2000, 1200), character just in front at (2200, 1580)
// Initial viewport centers on that area
function getInitialOffset() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const focusX = 2100;
  const focusY = 1400;
  const x = Math.min(0, Math.max(-(WORLD_W - vw), vw / 2 - focusX));
  const y = Math.min(0, Math.max(-(WORLD_H - vh), vh / 2 - focusY));
  return { x, y };
}

export function VaishnaviIsland({ onClose }: VaishnaviIslandProps) {
  const [isWaving, setIsWaving] = useState(false);
  const [dialogue, setDialogue] = useState<DialogueState | null>(null);
  const [benchSubtitle, setBenchSubtitle] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const [constraints, setConstraints] = useState({ left: -(WORLD_W - window.innerWidth), right: 0, top: -(WORLD_H - window.innerHeight), bottom: 0 });
  const [initialOffset] = useState(getInitialOffset);
  const waveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const subtitleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setShowHint(false), 3500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    function updateConstraints() {
      setConstraints({
        left: -(WORLD_W - window.innerWidth),
        right: 0,
        top: -(WORLD_H - window.innerHeight),
        bottom: 0,
      });
    }
    window.addEventListener('resize', updateConstraints);
    return () => window.removeEventListener('resize', updateConstraints);
  }, []);

  const handleCharacterClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (isWaving) return;
    setIsWaving(true);
    if (waveTimerRef.current) clearTimeout(waveTimerRef.current);
    waveTimerRef.current = setTimeout(() => setIsWaving(false), 3000);
  }, [isWaving]);

  const handleStudioClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setDialogue({
      title: 'Design Studio',
      content: { type: 'bio', text: 'Resident designer of this island. Moved here for the vibes, stayed for the margins. Iced drink in hand, always.' },
    });
  }, []);

  const handleLibraryClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setDialogue({
      title: 'The Library',
      content: {
        type: 'stats',
        items: [
          { label: 'Font Snobbery', value: 95 },
          { label: 'Iced Drink Dependency', value: 90 },
          { label: 'Pixel Perfectness', value: 100 },
          { label: 'Pinterest Scroll Resistance', value: 15 },
        ],
      },
    });
  }, []);

  const handleBakeryClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setDialogue({
      title: 'Bakery & Café',
      content: {
        type: 'likes',
        likes: ['Figma', 'Typography', 'Well-spaced margins', 'Iced drinks'],
        dislikes: ['Dribbble clones', 'Low-contrast text', 'Missing grids'],
      },
    });
  }, []);

  const handlePostOfficeClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setDialogue({
      title: 'Post Office',
      content: { type: 'connect', linkedin: 'https://www.linkedin.com/in/vaishnavi-jawdekar/' },
    });
  }, []);

  const handleBenchClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setBenchSubtitle(true);
    if (subtitleTimerRef.current) clearTimeout(subtitleTimerRef.current);
    subtitleTimerRef.current = setTimeout(() => setBenchSubtitle(false), 4500);
  }, []);

  return createPortal(
    <div className={styles.wrapper}>
      <button className={styles.closeBtn} onClick={onClose}>✕ Close</button>

      <AnimatePresence>
        {showHint && (
          <motion.p
            className={styles.hint}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            drag to explore →
          </motion.p>
        )}
      </AnimatePresence>

      <motion.div
        className={styles.world}
        drag
        dragConstraints={constraints}
        dragElastic={0.04}
        dragTransition={{ bounceStiffness: 250, bounceDamping: 45 }}
        initial={initialOffset}
        style={{ width: WORLD_W, height: WORLD_H }}
      >
        {/* Ground layers */}
        <div className={styles.ground} />

        {/* Paths */}
        <div className={styles.pathV} />
        <div className={styles.pathH} />
        <div className={styles.pathBranchLibrary} />
        <div className={styles.pathBranchBakery} />

        {/* Grass patches */}
        <div className={styles.grassPatch1} />
        <div className={styles.grassPatch2} />
        <div className={styles.grassPatch3} />

        {/* Beach/top area */}
        <div className={styles.beach} />
        <div className={styles.sun} />

        {/* Fountain */}
        <motion.img
          src="/assets/deco-fountain.png"
          className={styles.fountain}
          alt="Fountain"
          draggable={false}
          whileHover={{ scale: 1.04 }}
        />

        {/* Bench */}
        <motion.img
          src="/assets/deco-bench.png"
          className={styles.bench}
          alt="Beach bench"
          draggable={false}
          whileHover={{ scale: 1.06, cursor: 'pointer' }}
          onClick={handleBenchClick}
        />

        {/* Library */}
        <motion.img
          src="/assets/building-library.png"
          className={styles.library}
          alt="The Library"
          draggable={false}
          whileHover={{ y: -8, transition: { duration: 0.2 } }}
          onClick={handleLibraryClick}
          style={{ cursor: 'pointer' }}
        />

        {/* Bakery */}
        <motion.img
          src="/assets/building-bakery.png"
          className={styles.bakery}
          alt="Bakery & Café"
          draggable={false}
          whileHover={{ y: -8, transition: { duration: 0.2 } }}
          onClick={handleBakeryClick}
          style={{ cursor: 'pointer' }}
        />

        {/* Post Office */}
        <motion.img
          src="/assets/building-postoffice.png"
          className={styles.postOffice}
          alt="Post Office"
          draggable={false}
          whileHover={{ y: -8, transition: { duration: 0.2 } }}
          onClick={handlePostOfficeClick}
          style={{ cursor: 'pointer' }}
        />

        {/* Design Studio */}
        <motion.img
          src="/assets/building-studio.png"
          className={styles.studio}
          alt="Design Studio"
          draggable={false}
          whileHover={{ y: -8, transition: { duration: 0.2 } }}
          onClick={handleStudioClick}
          style={{ cursor: 'pointer' }}
        />

        {/* Character — stationary in front of studio */}
        <motion.img
          src={isWaving ? '/assets/character-waving.png' : '/assets/character-normal.png'}
          className={styles.character}
          alt="Vaishnavi"
          draggable={false}
          onClick={handleCharacterClick}
          style={{ cursor: 'pointer' }}
          animate={isWaving ? { y: [0, -12, 0, -8, 0] } : { y: [0, -4, 0] }}
          transition={isWaving
            ? { duration: 0.6, ease: 'easeInOut' }
            : { duration: 3, repeat: Infinity, ease: 'easeInOut' }
          }
          whileHover={{ scale: 1.05 }}
        />

        {/* Click label above character */}
        <AnimatePresence>
          {!isWaving && (
            <motion.div
              className={styles.characterLabel}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              click me!
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {dialogue && (
        <IslandDialogue
          title={dialogue.title}
          content={dialogue.content}
          onClose={() => setDialogue(null)}
        />
      )}

      <BeachSubtitle visible={benchSubtitle} />
    </div>,
    document.body
  );
}
