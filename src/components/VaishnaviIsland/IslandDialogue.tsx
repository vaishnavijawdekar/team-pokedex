import { motion, AnimatePresence } from 'framer-motion';
import styles from './IslandDialogue.module.css';

export type DialogueContent =
  | { type: 'bio'; text: string }
  | { type: 'stats'; items: { label: string; value: number }[] }
  | { type: 'likes'; likes: string[]; dislikes: string[] }
  | { type: 'connect'; linkedin: string };

interface IslandDialogueProps {
  title: string;
  content: DialogueContent;
  onClose: () => void;
}

export function IslandDialogue({ title, content, onClose }: IslandDialogueProps) {
  return (
    <AnimatePresence>
      <motion.div
        className={styles.overlay}
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className={styles.box}
          onClick={e => e.stopPropagation()}
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        >
          <div className={styles.header}>
            <span className={styles.title}>{title}</span>
            <button className={styles.close} onClick={onClose}>✕</button>
          </div>

          <div className={styles.body}>
            {content.type === 'bio' && (
              <p className={styles.bio}>{content.text}</p>
            )}

            {content.type === 'stats' && (
              <ul className={styles.statList}>
                {content.items.map(s => (
                  <li key={s.label} className={styles.statItem}>
                    <span className={styles.statLabel}>{s.label}</span>
                    <div className={styles.barTrack}>
                      <motion.div
                        className={styles.barFill}
                        initial={{ width: 0 }}
                        animate={{ width: `${s.value}%` }}
                        transition={{ delay: 0.1, duration: 0.6, ease: 'easeOut' }}
                      />
                    </div>
                    <span className={styles.statValue}>{s.value}</span>
                  </li>
                ))}
              </ul>
            )}

            {content.type === 'likes' && (
              <div className={styles.likesWrap}>
                <div>
                  <p className={styles.sectionLabel}>Likes</p>
                  <ul className={styles.tagList}>
                    {content.likes.map(l => <li key={l} className={styles.likeTag}>{l}</li>)}
                  </ul>
                </div>
                <div>
                  <p className={styles.sectionLabel}>Dislikes</p>
                  <ul className={styles.tagList}>
                    {content.dislikes.map(d => <li key={d} className={styles.dislikeTag}>{d}</li>)}
                  </ul>
                </div>
              </div>
            )}

            {content.type === 'connect' && (
              <div className={styles.connectWrap}>
                <a
                  href={content.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.connectBtn}
                >
                  LinkedIn →
                </a>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
