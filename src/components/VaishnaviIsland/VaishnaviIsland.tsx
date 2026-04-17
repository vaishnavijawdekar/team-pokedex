import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameLoop } from './hooks/useGameLoop';
import { usePlayerMovement } from './hooks/usePlayerMovement';
import { useDragPan } from './hooks/useDragPan';
import { drawWorld } from './rendering/drawWorld';
import { drawDecorations } from './rendering/drawDecorations';
import { drawBuildings, BUILDING_CENTERS } from './rendering/drawBuildings';
import type { BuildingHoverState } from './rendering/drawBuildings';
import { drawNPCs } from './rendering/drawNPCs';
import { drawPlayer, preloadAvatar } from './rendering/drawPlayer';
import { IslandDialogue } from './IslandDialogue';
import type { DialogueContent } from './IslandDialogue';
import { BeachSubtitle } from './BeachSubtitle';
import { hitTest } from './utils/hitTest';
import styles from './VaishnaviIsland.module.css';

const WORLD_W = 1600;
const WORLD_H = 1200;
const SPAWN = { x: 800, y: 600 };
const HIT_RADIUS = 60;

interface DialogueState {
  title: string;
  content: DialogueContent;
}

interface VaishnaviIslandProps {
  onClose: () => void;
}

export function VaishnaviIsland({ onClose }: VaishnaviIslandProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const [dialogue, setDialogue] = useState<DialogueState | null>(null);
  const [showHint, setShowHint] = useState(true);
  const [benchSubtitle, setBenchSubtitle] = useState(false);
  const [playerSitting, setPlayerSitting] = useState(false);
  const subtitleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { getState, update } = usePlayerMovement(SPAWN);
  const { getOffset, clampOffset } = useDragPan(canvasRef);

  // Preload avatar
  useEffect(() => {
    preloadAvatar('/avatars/vaishnavi.png');
  }, []);

  // Hide hint after 3s
  useEffect(() => {
    const t = setTimeout(() => setShowHint(false), 3000);
    return () => clearTimeout(t);
  }, []);

  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const offset = getOffset();
    const worldX = e.clientX - offset.x;
    const worldY = e.clientY - offset.y;

    if (hitTest(worldX, worldY, BUILDING_CENTERS.studio.x, BUILDING_CENTERS.studio.y, HIT_RADIUS)) {
      setDialogue({
        title: 'Design Studio',
        content: { type: 'bio', text: 'Resident designer of this island. Moved here for the vibes, stayed for the margins. Iced drink in hand, always.' },
      });
      return;
    }
    if (hitTest(worldX, worldY, BUILDING_CENTERS.library.x, BUILDING_CENTERS.library.y, HIT_RADIUS)) {
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
      return;
    }
    if (hitTest(worldX, worldY, BUILDING_CENTERS.bakery.x, BUILDING_CENTERS.bakery.y, HIT_RADIUS)) {
      setDialogue({
        title: 'Bakery & Café',
        content: {
          type: 'likes',
          likes: ['Figma', 'Typography', 'Well-spaced margins', 'Iced drinks'],
          dislikes: ['Dribbble clones', 'Low-contrast text', 'Missing grids'],
        },
      });
      return;
    }
    if (hitTest(worldX, worldY, BUILDING_CENTERS.postOffice.x, BUILDING_CENTERS.postOffice.y, HIT_RADIUS)) {
      setDialogue({
        title: 'Post Office',
        content: { type: 'connect', linkedin: 'https://www.linkedin.com/in/vaishnavi-jawdekar/' },
      });
      return;
    }
    if (hitTest(worldX, worldY, BUILDING_CENTERS.bench.x, BUILDING_CENTERS.bench.y, HIT_RADIUS)) {
      setPlayerSitting(true);
      setBenchSubtitle(true);
      if (subtitleTimerRef.current) clearTimeout(subtitleTimerRef.current);
      subtitleTimerRef.current = setTimeout(() => {
        setBenchSubtitle(false);
        setPlayerSitting(false);
      }, 4500);
      return;
    }
  }, [getOffset]);

  useGameLoop(useCallback((_dt: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const viewW = canvas.width;
    const viewH = canvas.height;

    const rawOffset = getOffset();
    const clamped = clampOffset(rawOffset, viewW, viewH, WORLD_W, WORLD_H);

    frameRef.current++;
    update(clamped);
    const { pos, isMoving } = getState();

    // Compute hover state
    const hover: BuildingHoverState = {
      studio:     hitTest(pos.x, pos.y, BUILDING_CENTERS.studio.x, BUILDING_CENTERS.studio.y, HIT_RADIUS),
      library:    hitTest(pos.x, pos.y, BUILDING_CENTERS.library.x, BUILDING_CENTERS.library.y, HIT_RADIUS),
      bakery:     hitTest(pos.x, pos.y, BUILDING_CENTERS.bakery.x, BUILDING_CENTERS.bakery.y, HIT_RADIUS),
      postOffice: hitTest(pos.x, pos.y, BUILDING_CENTERS.postOffice.x, BUILDING_CENTERS.postOffice.y, HIT_RADIUS),
    };

    ctx.save();
    ctx.clearRect(0, 0, viewW, viewH);
    ctx.translate(clamped.x, clamped.y);

    drawWorld(ctx);
    drawDecorations(ctx);
    drawBuildings(ctx, hover, playerSitting);
    drawNPCs(ctx);
    drawPlayer(ctx, pos.x, pos.y, isMoving, frameRef.current);

    ctx.restore();
  }, [getOffset, clampOffset, update, getState, playerSitting]));

  // Resize canvas to viewport
  useEffect(() => {
    function resize() {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  return (
    <div className={styles.wrapper}>
      <button className={styles.closeBtn} onClick={onClose}>✕ Close</button>

      <canvas
        ref={canvasRef}
        className={styles.canvas}
        onClick={handleCanvasClick}
      />

      <AnimatePresence>
        {showHint && (
          <motion.p
            className={styles.hint}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            drag to explore →
          </motion.p>
        )}
      </AnimatePresence>

      {dialogue && (
        <IslandDialogue
          title={dialogue.title}
          content={dialogue.content}
          onClose={() => setDialogue(null)}
        />
      )}

      <BeachSubtitle visible={benchSubtitle} />
    </div>
  );
}
