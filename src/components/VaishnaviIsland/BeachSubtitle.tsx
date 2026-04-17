import { motion, AnimatePresence } from 'framer-motion';
import styles from './BeachSubtitle.module.css';

interface BeachSubtitleProps {
  visible: boolean;
}

export function BeachSubtitle({ visible }: BeachSubtitleProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          "I would rather be on a beach right now."
        </motion.p>
      )}
    </AnimatePresence>
  );
}
