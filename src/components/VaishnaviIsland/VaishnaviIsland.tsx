import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';
import { IslandDialogue } from './IslandDialogue';
import type { DialogueContent } from './IslandDialogue';
import { BeachSubtitle } from './BeachSubtitle';
import styles from './VaishnaviIsland.module.css';

// World = large ocean. Island = landmass floating in the center.
const WORLD_W = 4600;
const WORLD_H = 3800;
const ISLAND_W = 2800;
const ISLAND_H = 2200;
const ISLAND_X = (WORLD_W - ISLAND_W) / 2;  // 900
const ISLAND_Y = (WORLD_H - ISLAND_H) / 2;  // 800
const B = 8;
const VISITOR_INIT = { x: 1430, y: 750 };   // island-relative

interface DialogueState { title: string; content: DialogueContent; }
interface VaishnaviIslandProps { onClose: () => void; }

function getInitialOffset() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  return {
    x: Math.min(0, Math.max(-(WORLD_W - vw), vw / 2 - (ISLAND_X + VISITOR_INIT.x))),
    y: Math.min(0, Math.max(-(WORLD_H - vh), vh / 2 - (ISLAND_Y + VISITOR_INIT.y))),
  };
}

/* ─── Pixel Art Sprites ─── */

function PixelStudio() {
  return (
    <svg width={30*B} height={26*B} style={{ imageRendering: 'pixelated', display: 'block' }}>
      {/* Chimney smoke */}
      <rect x={21*B} y={0}    width={2*B}  height={B}   fill="#CFD8DC" opacity={0.8}/>
      <rect x={20*B} y={B}    width={4*B}  height={B}   fill="#ECEFF1" opacity={0.6}/>
      {/* Chimney */}
      <rect x={21*B} y={B}    width={3*B}  height={5*B} fill="#78909C"/>
      <rect x={20*B} y={B}    width={5*B}  height={B}   fill="#90A4AE"/>
      {/* Peaked roof */}
      <rect x={13*B} y={3*B}  width={4*B}  height={2*B} fill="#E91E63"/>
      <rect x={11*B} y={5*B}  width={8*B}  height={2*B} fill="#E91E63"/>
      <rect x={9*B}  y={7*B}  width={12*B} height={2*B} fill="#E91E63"/>
      <rect x={7*B}  y={9*B}  width={16*B} height={2*B} fill="#E91E63"/>
      <rect x={5*B}  y={11*B} width={20*B} height={2*B} fill="#C2185B"/>
      {/* Roof ridge highlight */}
      <rect x={14*B} y={3*B}  width={2*B}  height={B}   fill="#F06292"/>
      {/* Walls */}
      <rect x={3*B}  y={13*B} width={24*B} height={11*B} fill="#FFF8E7"/>
      <rect x={25*B} y={13*B} width={2*B}  height={11*B} fill="#EDE7C8"/>
      {/* Nameplate */}
      <rect x={9*B}  y={14*B} width={12*B} height={2*B} fill="#CE93D8"/>
      <rect x={10*B} y={14*B} width={10*B} height={B}   fill="#BA68C8"/>
      {/* Left window with curtains */}
      <rect x={4*B}  y={15*B} width={6*B}  height={5*B} fill="#B3E5FC"/>
      <rect x={4*B}  y={15*B} width={6*B}  height={B}   fill="#0288D1"/>
      <rect x={6*B}  y={15*B} width={B}    height={5*B} fill="#0288D1"/>
      <rect x={4*B}  y={17*B} width={6*B}  height={B}   fill="#0288D1"/>
      <rect x={4*B}  y={16*B} width={2*B}  height={B}   fill="#FFE082"/>
      <rect x={7*B}  y={16*B} width={2*B}  height={B}   fill="#FFE082"/>
      {/* Curtains */}
      <rect x={4*B}  y={16*B} width={B}    height={4*B} fill="#F8BBD9"/>
      <rect x={9*B}  y={16*B} width={B}    height={4*B} fill="#F8BBD9"/>
      {/* Right window with curtains */}
      <rect x={20*B} y={15*B} width={6*B}  height={5*B} fill="#B3E5FC"/>
      <rect x={20*B} y={15*B} width={6*B}  height={B}   fill="#0288D1"/>
      <rect x={22*B} y={15*B} width={B}    height={5*B} fill="#0288D1"/>
      <rect x={20*B} y={17*B} width={6*B}  height={B}   fill="#0288D1"/>
      <rect x={20*B} y={16*B} width={2*B}  height={B}   fill="#FFE082"/>
      <rect x={23*B} y={16*B} width={2*B}  height={B}   fill="#FFE082"/>
      <rect x={20*B} y={16*B} width={B}    height={4*B} fill="#F8BBD9"/>
      <rect x={25*B} y={16*B} width={B}    height={4*B} fill="#F8BBD9"/>
      {/* Door */}
      <rect x={12*B} y={18*B} width={6*B}  height={6*B} fill="#7B1FA2"/>
      <rect x={12*B} y={18*B} width={6*B}  height={B}   fill="#9C27B0"/>
      <rect x={16*B} y={20*B} width={B}    height={B}   fill="#CE93D8"/>
      <rect x={13*B} y={17*B} width={4*B}  height={2*B} fill="#AB47BC"/>
      {/* Hanging lantern */}
      <rect x={14*B} y={13*B} width={2*B}  height={B}   fill="#9E9E9E"/>
      <rect x={13*B} y={14*B} width={4*B}  height={3*B} fill="#FFD54F"/>
      <rect x={13*B} y={14*B} width={4*B}  height={B}   fill="#FF8F00"/>
      {/* Flower boxes */}
      <rect x={4*B}  y={20*B} width={6*B}  height={2*B} fill="#5D4037"/>
      <rect x={5*B}  y={19*B} width={B}    height={B}   fill="#66BB6A"/>
      <rect x={7*B}  y={19*B} width={B}    height={B}   fill="#E91E63"/>
      <rect x={9*B}  y={19*B} width={B}    height={B}   fill="#FFD740"/>
      <rect x={20*B} y={20*B} width={6*B}  height={2*B} fill="#5D4037"/>
      <rect x={21*B} y={19*B} width={B}    height={B}   fill="#66BB6A"/>
      <rect x={23*B} y={19*B} width={B}    height={B}   fill="#FF80AB"/>
      <rect x={25*B} y={19*B} width={B}    height={B}   fill="#FFD740"/>
      {/* Step */}
      <rect x={3*B}  y={24*B} width={24*B} height={B}   fill="#BDBDBD"/>
      <rect x={B}    y={25*B} width={28*B} height={B}   fill="#9E9E9E"/>
    </svg>
  );
}

function PixelLibrary() {
  return (
    <svg width={34*B} height={26*B} style={{ imageRendering: 'pixelated', display: 'block' }}>
      {/* Pediment */}
      <rect x={0}    y={0}    width={34*B} height={2*B} fill="#1565C0"/>
      <rect x={0}    y={0}    width={2*B}  height={5*B} fill="#1565C0"/>
      <rect x={32*B} y={0}    width={2*B}  height={5*B} fill="#1565C0"/>
      <rect x={14*B} y={0}    width={6*B}  height={5*B} fill="#1565C0"/>
      {/* Triangle pediment detail */}
      <rect x={6*B}  y={0}    width={4*B}  height={B}   fill="#1976D2"/>
      <rect x={24*B} y={0}    width={4*B}  height={B}   fill="#1976D2"/>
      <rect x={2*B}  y={2*B}  width={30*B} height={2*B} fill="#1976D2"/>
      <rect x={0}    y={4*B}  width={34*B} height={2*B} fill="#0D47A1"/>
      {/* Frieze / sign bar */}
      <rect x={2*B}  y={6*B}  width={30*B} height={2*B} fill="#37474F"/>
      <rect x={4*B}  y={6*B}  width={6*B}  height={2*B} fill="#546E7A"/>  {/* "LIB" hint */}
      <rect x={14*B} y={6*B}  width={6*B}  height={2*B} fill="#546E7A"/>  {/* "RA" hint */}
      <rect x={24*B} y={6*B}  width={6*B}  height={2*B} fill="#546E7A"/>  {/* "RY" hint */}
      {/* Walls */}
      <rect x={0}    y={8*B}  width={34*B} height={14*B} fill="#E8D5B7"/>
      <rect x={32*B} y={8*B}  width={2*B}  height={14*B} fill="#D4C4A4"/>
      {/* Columns */}
      <rect x={4*B}  y={8*B}  width={2*B}  height={14*B} fill="#F5F5F5"/>
      <rect x={4*B}  y={8*B}  width={2*B}  height={B}    fill="#E0E0E0"/>
      <rect x={14*B} y={8*B}  width={2*B}  height={14*B} fill="#F5F5F5"/>
      <rect x={14*B} y={8*B}  width={2*B}  height={B}    fill="#E0E0E0"/>
      <rect x={18*B} y={8*B}  width={2*B}  height={14*B} fill="#F5F5F5"/>
      <rect x={18*B} y={8*B}  width={2*B}  height={B}    fill="#E0E0E0"/>
      <rect x={28*B} y={8*B}  width={2*B}  height={14*B} fill="#F5F5F5"/>
      <rect x={28*B} y={8*B}  width={2*B}  height={B}    fill="#E0E0E0"/>
      {/* Door (arch) */}
      <rect x={14*B} y={14*B} width={6*B}  height={8*B} fill="#5D4037"/>
      <rect x={15*B} y={12*B} width={4*B}  height={4*B} fill="#5D4037"/>
      <rect x={16*B} y={11*B} width={2*B}  height={2*B} fill="#5D4037"/>
      <rect x={16*B} y={17*B} width={2*B}  height={B}   fill="#8D6E63"/>
      {/* Left window with books visible */}
      <rect x={6*B}  y={9*B}  width={7*B}  height={7*B} fill="#B3E5FC"/>
      <rect x={6*B}  y={9*B}  width={7*B}  height={B}   fill="#1565C0"/>
      <rect x={9*B}  y={9*B}  width={B}    height={7*B} fill="#1565C0"/>
      <rect x={6*B}  y={12*B} width={7*B}  height={B}   fill="#1565C0"/>
      {/* Book spines in left window */}
      <rect x={6*B}  y={10*B} width={B}    height={2*B} fill="#F44336"/>
      <rect x={7*B}  y={10*B} width={B}    height={2*B} fill="#4CAF50"/>
      <rect x={8*B}  y={10*B} width={B}    height={2*B} fill="#2196F3"/>
      <rect x={10*B} y={10*B} width={B}    height={2*B} fill="#FF9800"/>
      <rect x={11*B} y={10*B} width={B}    height={2*B} fill="#9C27B0"/>
      <rect x={12*B} y={10*B} width={B}    height={2*B} fill="#F44336"/>
      {/* Right window with books */}
      <rect x={21*B} y={9*B}  width={7*B}  height={7*B} fill="#B3E5FC"/>
      <rect x={21*B} y={9*B}  width={7*B}  height={B}   fill="#1565C0"/>
      <rect x={25*B} y={9*B}  width={B}    height={7*B} fill="#1565C0"/>
      <rect x={21*B} y={12*B} width={7*B}  height={B}   fill="#1565C0"/>
      <rect x={21*B} y={10*B} width={B}    height={2*B} fill="#E91E63"/>
      <rect x={22*B} y={10*B} width={B}    height={2*B} fill="#009688"/>
      <rect x={23*B} y={10*B} width={B}    height={2*B} fill="#FF5722"/>
      <rect x={26*B} y={10*B} width={B}    height={2*B} fill="#3F51B5"/>
      <rect x={27*B} y={10*B} width={B}    height={2*B} fill="#8BC34A"/>
      {/* Decorative urns at base */}
      <rect x={2*B}  y={20*B} width={2*B}  height={2*B} fill="#8D6E63"/>
      <rect x={B}    y={21*B} width={4*B}  height={B}   fill="#795548"/>
      <rect x={30*B} y={20*B} width={2*B}  height={2*B} fill="#8D6E63"/>
      <rect x={29*B} y={21*B} width={4*B}  height={B}   fill="#795548"/>
      {/* Green plant in urns */}
      <rect x={2*B}  y={18*B} width={2*B}  height={3*B} fill="#388E3C"/>
      <rect x={B}    y={19*B} width={4*B}  height={B}   fill="#4CAF50"/>
      <rect x={30*B} y={18*B} width={2*B}  height={3*B} fill="#388E3C"/>
      <rect x={29*B} y={19*B} width={4*B}  height={B}   fill="#4CAF50"/>
      {/* Steps */}
      <rect x={10*B} y={22*B} width={14*B} height={B}   fill="#BDBDBD"/>
      <rect x={8*B}  y={23*B} width={18*B} height={B}   fill="#D0D0D0"/>
      <rect x={6*B}  y={24*B} width={22*B} height={B}   fill="#BDBDBD"/>
      <rect x={4*B}  y={25*B} width={26*B} height={B}   fill="#9E9E9E"/>
    </svg>
  );
}

function PixelBakery() {
  return (
    <svg width={30*B} height={24*B} style={{ imageRendering: 'pixelated', display: 'block' }}>
      {/* Hanging sign */}
      <rect x={10*B} y={0}    width={B}    height={3*B} fill="#9E9E9E"/>
      <rect x={19*B} y={0}    width={B}    height={3*B} fill="#9E9E9E"/>
      <rect x={9*B}  y={2*B}  width={12*B} height={3*B} fill="#FF8F00"/>
      <rect x={10*B} y={2*B}  width={10*B} height={2*B} fill="#FFA726"/>
      <rect x={11*B} y={2*B}  width={2*B}  height={2*B} fill="#FFF8E7"/>  {/* ☕ hint */}
      {/* Roof */}
      <rect x={0}    y={4*B}  width={30*B} height={2*B} fill="#F57F17"/>
      <rect x={0}    y={6*B}  width={30*B} height={B}   fill="#FF8F00"/>
      {/* Striped awning */}
      {[0,2,4,6,8,10,12,14].map(i => (
        <rect key={i} x={i*2*B} y={7*B} width={2*B} height={3*B} fill="#FFF8E7"/>
      ))}
      <rect x={0}    y={7*B}  width={30*B} height={3*B} fill="none" stroke="#E65100" strokeWidth={0}/>
      <rect x={0}    y={10*B} width={30*B} height={B}   fill="#E65100"/>
      {/* Walls */}
      <rect x={0}    y={11*B} width={30*B} height={11*B} fill="#FFF8E7"/>
      <rect x={28*B} y={11*B} width={2*B}  height={11*B} fill="#EDE7C8"/>
      {/* Display window */}
      <rect x={3*B}  y={12*B} width={14*B} height={8*B} fill="#B3E5FC"/>
      <rect x={3*B}  y={12*B} width={14*B} height={B}   fill="#29B6F6"/>
      <rect x={9*B}  y={12*B} width={B}    height={8*B} fill="#29B6F6"/>
      {/* Pastries in window - left section */}
      <rect x={4*B}  y={17*B} width={4*B}  height={2*B} fill="#FFCCBC"/>
      <rect x={5*B}  y={15*B} width={2*B}  height={B}   fill="#F44336"/>  {/* cherry */}
      <rect x={4*B}  y={16*B} width={4*B}  height={B}   fill="#FFAB91"/>
      {/* Pastries in window - right section */}
      <rect x={10*B} y={16*B} width={4*B}  height={3*B} fill="#FFF176"/>
      <rect x={11*B} y={15*B} width={2*B}  height={B}   fill="#FF9800"/>
      <rect x={10*B} y={13*B} width={3*B}  height={3*B} fill="#D7CCC8"/>  {/* cake slice */}
      <rect x={10*B} y={13*B} width={3*B}  height={B}   fill="#F8BBD9"/>  {/* frosting */}
      <rect x={13*B} y={13*B} width={3*B}  height={3*B} fill="#FFCCBC"/>
      <rect x={13*B} y={13*B} width={3*B}  height={B}   fill="#AED581"/>
      {/* Door */}
      <rect x={20*B} y={14*B} width={6*B}  height={8*B} fill="#795548"/>
      <rect x={20*B} y={14*B} width={6*B}  height={B}   fill="#8D6E63"/>
      <rect x={24*B} y={18*B} width={B}    height={B}   fill="#D7CCC8"/>
      {/* Outdoor table */}
      <rect x={22*B} y={10*B} width={6*B}  height={B}   fill="#A1887F"/>
      <rect x={22*B} y={11*B} width={B}    height={2*B} fill="#8D6E63"/>
      <rect x={27*B} y={11*B} width={B}    height={2*B} fill="#8D6E63"/>
      {/* Step */}
      <rect x={0}    y={22*B} width={30*B} height={B}   fill="#BDBDBD"/>
      <rect x={0}    y={23*B} width={30*B} height={B}   fill="#9E9E9E"/>
    </svg>
  );
}

function PixelPostOffice() {
  return (
    <svg width={30*B} height={24*B} style={{ imageRendering: 'pixelated', display: 'block' }}>
      {/* Roof */}
      <rect x={0}    y={0}    width={30*B} height={2*B} fill="#0277BD"/>
      <rect x={0}    y={2*B}  width={30*B} height={2*B} fill="#01579B"/>
      {/* Flag pole */}
      <rect x={25*B} y={0}    width={B}    height={8*B} fill="#9E9E9E"/>
      <rect x={26*B} y={0}    width={4*B}  height={3*B} fill="#F44336"/>
      <rect x={26*B} y={3*B}  width={4*B}  height={2*B} fill="#FFEB3B"/>
      <rect x={26*B} y={5*B}  width={4*B}  height={B}   fill="#1565C0"/>
      {/* Walls */}
      <rect x={0}    y={4*B}  width={30*B} height={16*B} fill="#E3F2FD"/>
      <rect x={28*B} y={4*B}  width={2*B}  height={16*B} fill="#CFE8F7"/>
      {/* Building sign */}
      <rect x={8*B}  y={5*B}  width={14*B} height={2*B} fill="#0277BD"/>
      <rect x={9*B}  y={5*B}  width={12*B} height={B}   fill="#0288D1"/>
      {/* Left window */}
      <rect x={2*B}  y={8*B}  width={8*B}  height={7*B} fill="#B3E5FC"/>
      <rect x={2*B}  y={8*B}  width={8*B}  height={B}   fill="#0277BD"/>
      <rect x={6*B}  y={8*B}  width={B}    height={7*B} fill="#0277BD"/>
      <rect x={2*B}  y={11*B} width={8*B}  height={B}   fill="#0277BD"/>
      <rect x={2*B}  y={9*B}  width={3*B}  height={2*B} fill="#FFE082"/>
      <rect x={7*B}  y={9*B}  width={2*B}  height={2*B} fill="#FFE082"/>
      <rect x={2*B}  y={12*B} width={3*B}  height={2*B} fill="#B3E5FC"/>
      <rect x={6*B}  y={12*B} width={3*B}  height={2*B} fill="#B3E5FC"/>
      {/* Right window */}
      <rect x={20*B} y={8*B}  width={7*B}  height={7*B} fill="#B3E5FC"/>
      <rect x={20*B} y={8*B}  width={7*B}  height={B}   fill="#0277BD"/>
      <rect x={24*B} y={8*B}  width={B}    height={7*B} fill="#0277BD"/>
      <rect x={20*B} y={11*B} width={7*B}  height={B}   fill="#0277BD"/>
      <rect x={20*B} y={9*B}  width={3*B}  height={2*B} fill="#FFE082"/>
      <rect x={25*B} y={9*B}  width={2*B}  height={2*B} fill="#FFE082"/>
      <rect x={20*B} y={12*B} width={3*B}  height={2*B} fill="#B3E5FC"/>
      <rect x={24*B} y={12*B} width={3*B}  height={2*B} fill="#B3E5FC"/>
      {/* Door (arch) */}
      <rect x={12*B} y={13*B} width={6*B}  height={7*B} fill="#0277BD"/>
      <rect x={13*B} y={11*B} width={4*B}  height={4*B} fill="#0277BD"/>
      <rect x={14*B} y={10*B} width={2*B}  height={2*B} fill="#0288D1"/>
      <rect x={16*B} y={16*B} width={B}    height={B}   fill="#B3E5FC"/>
      {/* Mailbag on door */}
      <rect x={13*B} y={14*B} width={4*B}  height={3*B} fill="#795548"/>
      <rect x={13*B} y={14*B} width={4*B}  height={B}   fill="#8D6E63"/>
      <rect x={14*B} y={13*B} width={2*B}  height={2*B} fill="#5D4037"/>
      {/* Mailbox outside */}
      <rect x={B}    y={17*B} width={3*B}  height={3*B} fill="#1565C0"/>
      <rect x={B}    y={17*B} width={3*B}  height={B}   fill="#1976D2"/>
      <rect x={0}    y={20*B} width={5*B}  height={B}   fill="#9E9E9E"/>
      <rect x={2*B}  y={19*B} width={B}    height={2*B} fill="#9E9E9E"/>
      {/* Mail slot */}
      <rect x={B+4}  y={18*B} width={16}   height={3}   fill="#0D47A1"/>
      {/* Step */}
      <rect x={0}    y={20*B} width={30*B} height={B}   fill="#BDBDBD"/>
      <rect x={0}    y={21*B} width={30*B} height={B}   fill="#9E9E9E"/>
      <rect x={0}    y={22*B} width={30*B} height={B}   fill="#BDBDBD"/>
      <rect x={0}    y={23*B} width={30*B} height={B}   fill="#9E9E9E"/>
    </svg>
  );
}

function PixelCharacter({ waving }: { waving: boolean }) {
  const u = 10;
  return (
    <svg width={10*u} height={16*u} style={{ imageRendering: 'pixelated', display: 'block' }}>
      {/* Long hair - back */}
      <rect x={0}     y={u}    width={2*u}  height={9*u}  fill="#1A0800"/>
      <rect x={7*u}   y={u}    width={2*u}  height={7*u}  fill="#1A0800"/>
      {/* Hair top + highlight */}
      <rect x={u}     y={0}    width={7*u}  height={u}    fill="#1A0800"/>
      <rect x={u}     y={0}    width={7*u}  height={3}    fill="#3D1A00"/>
      {/* Face */}
      <rect x={2*u}   y={u}    width={5*u}  height={4*u}  fill="#F5C5A3"/>
      {/* Ear areas */}
      <rect x={u+5}   y={2*u}  width={5}    height={u}    fill="#F5C5A3"/>
      <rect x={7*u}   y={2*u}  width={5}    height={u}    fill="#F5C5A3"/>
      {/* Eyes */}
      <rect x={3*u}   y={2*u}  width={u}    height={u}    fill="#1A0800"/>
      <rect x={5*u}   y={2*u}  width={u}    height={u}    fill="#1A0800"/>
      {/* Smile */}
      <rect x={3*u+2} y={3*u+4} width={4}   height={2}    fill="#C27A5A"/>
      <rect x={5*u}   y={3*u+4} width={4}   height={2}    fill="#C27A5A"/>
      <rect x={3*u+4} y={3*u+5} width={u-2} height={2}    fill="#D4896A"/>
      {/* Hair front framing */}
      <rect x={2*u}   y={u}    width={u}    height={u}    fill="#1A0800"/>
      <rect x={6*u}   y={u}    width={u}    height={u}    fill="#1A0800"/>
      {/* Neck */}
      <rect x={3*u}   y={5*u}  width={3*u}  height={u}    fill="#F5C5A3"/>
      {/* Body - white kurta */}
      <rect x={2*u}   y={6*u}  width={5*u}  height={4*u}  fill="#FAF0E6"/>
      {/* Kurta neckline */}
      <rect x={4*u}   y={6*u}  width={u}    height={u}    fill="#F0E6D6"/>
      {/* Red embroidery center line */}
      <rect x={4*u-1} y={6*u}  width={2}    height={4*u}  fill="#E53935"/>
      {/* Embroidery flower patterns */}
      <rect x={3*u}   y={7*u}  width={4}    height={4}    fill="#E53935"/>
      <rect x={6*u-2} y={7*u}  width={4}    height={4}    fill="#E53935"/>
      <rect x={3*u}   y={8*u+4} width={4}   height={4}    fill="#FFD700"/>
      <rect x={6*u-2} y={8*u+4} width={4}   height={4}    fill="#FFD700"/>
      {/* Left sleeve */}
      <rect x={u}     y={6*u}  width={u}    height={3*u}  fill="#FAF0E6"/>
      <rect x={0}     y={8*u}  width={u}    height={u}    fill="#F5C5A3"/>
      {/* Right arm */}
      {waving ? (
        <>
          <rect x={7*u}   y={4*u}  width={u}    height={3*u}  fill="#FAF0E6"/>
          <rect x={8*u}   y={3*u}  width={u}    height={2*u}  fill="#F5C5A3"/>
        </>
      ) : (
        <>
          <rect x={7*u}   y={6*u}  width={u}    height={3*u}  fill="#FAF0E6"/>
          <rect x={8*u}   y={8*u}  width={u}    height={u}    fill="#F5C5A3"/>
          {/* Iced green tea */}
          <rect x={8*u}   y={5*u}  width={u}    height={4*u}  fill="#80CBC4"/>
          <rect x={8*u}   y={5*u}  width={u}    height={3}    fill="#FFFFFF"/>
          <rect x={8*u+3} y={4*u}  width={3}    height={6}    fill="#795548"/>
        </>
      )}
      {/* Kurta lower */}
      <rect x={2*u}   y={10*u} width={5*u}  height={u}    fill="#FAF0E6"/>
      {/* Jeans */}
      <rect x={2*u}   y={11*u} width={5*u}  height={u}    fill="#5C85D6"/>
      <rect x={2*u}   y={12*u} width={2*u}  height={3*u}  fill="#5C85D6"/>
      <rect x={5*u}   y={12*u} width={2*u}  height={3*u}  fill="#5C85D6"/>
      <rect x={2*u}   y={12*u} width={u}    height={3*u}  fill="#7FA8E6"/>
      <rect x={5*u}   y={12*u} width={u}    height={3*u}  fill="#7FA8E6"/>
      {/* Pink crocs */}
      <rect x={u}     y={15*u} width={3*u}  height={u}    fill="#F48FB1"/>
      <rect x={5*u}   y={15*u} width={3*u}  height={u}    fill="#F48FB1"/>
      <rect x={u}     y={15*u} width={3*u}  height={4}    fill="#F8BBD9"/>
      <rect x={5*u}   y={15*u} width={3*u}  height={4}    fill="#F8BBD9"/>
    </svg>
  );
}

function PixelTree({ dark = false }: { dark?: boolean }) {
  const g1 = dark ? '#2E7D32' : '#43A047';
  const g2 = dark ? '#388E3C' : '#66BB6A';
  const g3 = dark ? '#1B5E20' : '#33691E';
  return (
    <svg width={14*B} height={17*B} style={{ imageRendering: 'pixelated', display: 'block' }}>
      <rect x={5*B}  y={13*B} width={4*B}  height={4*B} fill="#5D4037"/>
      <rect x={6*B}  y={13*B} width={2*B}  height={4*B} fill="#795548"/>
      <rect x={2*B}  y={9*B}  width={10*B} height={5*B} fill={g3}/>
      <rect x={B}    y={10*B} width={12*B} height={3*B} fill={g3}/>
      <rect x={3*B}  y={5*B}  width={8*B}  height={5*B} fill={g1}/>
      <rect x={2*B}  y={7*B}  width={10*B} height={3*B} fill={g1}/>
      <rect x={4*B}  y={2*B}  width={6*B}  height={4*B} fill={g2}/>
      <rect x={5*B}  y={B}    width={4*B}  height={2*B} fill={g2}/>
      <rect x={6*B}  y={0}    width={2*B}  height={B}   fill={g2}/>
      <rect x={5*B}  y={2*B}  width={2*B}  height={2*B} fill="#AED581"/>
    </svg>
  );
}

function PixelPalmTree() {
  return (
    <svg width={18*B} height={22*B} style={{ imageRendering: 'pixelated', display: 'block' }}>
      {/* Trunk - curved */}
      <rect x={8*B}  y={16*B} width={2*B}  height={6*B} fill="#795548"/>
      <rect x={8*B}  y={12*B} width={2*B}  height={5*B} fill="#8D6E63"/>
      <rect x={9*B}  y={8*B}  width={2*B}  height={5*B} fill="#8D6E63"/>
      <rect x={9*B}  y={5*B}  width={2*B}  height={4*B} fill="#795548"/>
      {/* Trunk texture */}
      <rect x={8*B}  y={14*B} width={B}    height={2}   fill="#6D4C41"/>
      <rect x={8*B}  y={10*B} width={B}    height={2}   fill="#6D4C41"/>
      {/* Coconuts */}
      <rect x={7*B}  y={6*B}  width={2*B}  height={2*B} fill="#5D4037"/>
      <rect x={11*B} y={5*B}  width={2*B}  height={2*B} fill="#5D4037"/>
      <rect x={7*B}  y={6*B}  width={B}    height={B}   fill="#795548"/>
      <rect x={11*B} y={5*B}  width={B}    height={B}   fill="#795548"/>
      {/* Left fronds */}
      <rect x={4*B}  y={3*B}  width={6*B}  height={B}   fill="#2E7D32"/>
      <rect x={2*B}  y={4*B}  width={6*B}  height={B}   fill="#388E3C"/>
      <rect x={0}    y={5*B}  width={5*B}  height={B}   fill="#43A047"/>
      <rect x={2*B}  y={6*B}  width={4*B}  height={B}   fill="#2E7D32"/>
      {/* Right fronds */}
      <rect x={10*B} y={3*B}  width={6*B}  height={B}   fill="#2E7D32"/>
      <rect x={12*B} y={4*B}  width={6*B}  height={B}   fill="#388E3C"/>
      <rect x={13*B} y={5*B}  width={5*B}  height={B}   fill="#43A047"/>
      <rect x={12*B} y={6*B}  width={4*B}  height={B}   fill="#2E7D32"/>
      {/* Top frond */}
      <rect x={7*B}  y={B}    width={4*B}  height={B}   fill="#43A047"/>
      <rect x={6*B}  y={2*B}  width={6*B}  height={B}   fill="#388E3C"/>
      {/* Highlights */}
      <rect x={5*B}  y={3*B}  width={2*B}  height={4}   fill="#66BB6A"/>
      <rect x={11*B} y={3*B}  width={2*B}  height={4}   fill="#66BB6A"/>
    </svg>
  );
}

function PixelBush() {
  return (
    <svg width={10*B} height={6*B} style={{ imageRendering: 'pixelated', display: 'block' }}>
      <rect x={B}    y={2*B}  width={8*B} height={4*B} fill="#558B2F"/>
      <rect x={0}    y={3*B}  width={10*B} height={3*B} fill="#558B2F"/>
      <rect x={2*B}  y={B}    width={6*B}  height={4*B} fill="#7CB342"/>
      <rect x={B}    y={2*B}  width={2*B}  height={B}   fill="#AED581"/>
      <rect x={5*B}  y={2*B}  width={2*B}  height={B}   fill="#AED581"/>
    </svg>
  );
}

function PixelFlowerBush() {
  return (
    <svg width={12*B} height={9*B} style={{ imageRendering: 'pixelated', display: 'block' }}>
      <rect x={B}    y={4*B}  width={10*B} height={5*B} fill="#33691E"/>
      <rect x={0}    y={5*B}  width={12*B} height={4*B} fill="#33691E"/>
      <rect x={2*B}  y={2*B}  width={8*B}  height={5*B} fill="#558B2F"/>
      <rect x={B}    y={3*B}  width={10*B} height={3*B} fill="#558B2F"/>
      {/* Pink flowers */}
      <rect x={2*B}  y={B}    width={2*B}  height={2*B} fill="#F48FB1"/>
      <rect x={3*B}  y={0}    width={B}    height={B}   fill="#FFD740"/>
      <rect x={6*B}  y={B}    width={2*B}  height={2*B} fill="#F48FB1"/>
      <rect x={7*B}  y={0}    width={B}    height={B}   fill="#FFD740"/>
      <rect x={9*B}  y={2*B}  width={2*B}  height={2*B} fill="#FF80AB"/>
      <rect x={10*B} y={B}    width={B}    height={B}   fill="#FFD740"/>
      <rect x={3*B}  y={3*B}  width={B}    height={B}   fill="#8BC34A"/>
      <rect x={7*B}  y={3*B}  width={B}    height={B}   fill="#8BC34A"/>
    </svg>
  );
}

function PixelFlower() {
  return (
    <svg width={8*B} height={6*B} style={{ imageRendering: 'pixelated', display: 'block' }}>
      <rect x={3*B}  y={3*B}  width={2*B}  height={3*B} fill="#388E3C"/>
      <rect x={2*B}  y={B}    width={2*B}  height={2*B} fill="#FF80AB"/>
      <rect x={4*B}  y={B}    width={2*B}  height={2*B} fill="#FF80AB"/>
      <rect x={B}    y={2*B}  width={2*B}  height={2*B} fill="#FF80AB"/>
      <rect x={5*B}  y={2*B}  width={2*B}  height={2*B} fill="#FF80AB"/>
      <rect x={3*B}  y={B}    width={2*B}  height={2*B} fill="#FFD740"/>
    </svg>
  );
}

function PixelSunflower() {
  return (
    <svg width={8*B} height={13*B} style={{ imageRendering: 'pixelated', display: 'block' }}>
      <rect x={3*B}  y={5*B}  width={2*B}  height={8*B} fill="#558B2F"/>
      <rect x={2*B}  y={8*B}  width={2*B}  height={B}   fill="#7CB342"/>
      <rect x={4*B}  y={6*B}  width={2*B}  height={B}   fill="#7CB342"/>
      {/* Petals */}
      <rect x={3*B}  y={0}    width={2*B}  height={2*B} fill="#FFD740"/>
      <rect x={3*B}  y={3*B}  width={2*B}  height={2*B} fill="#FFD740"/>
      <rect x={0}    y={B}    width={2*B}  height={2*B} fill="#FFD740"/>
      <rect x={6*B}  y={B}    width={2*B}  height={2*B} fill="#FFD740"/>
      <rect x={B}    y={0}    width={2*B}  height={2*B} fill="#FFCC02"/>
      <rect x={5*B}  y={0}    width={2*B}  height={2*B} fill="#FFCC02"/>
      <rect x={B}    y={3*B}  width={2*B}  height={2*B} fill="#FFCC02"/>
      <rect x={5*B}  y={3*B}  width={2*B}  height={2*B} fill="#FFCC02"/>
      {/* Center */}
      <rect x={2*B}  y={B}    width={4*B}  height={3*B} fill="#5D4037"/>
      <rect x={2*B}  y={B}    width={2*B}  height={B}   fill="#795548"/>
      <rect x={3*B}  y={B}    width={B}    height={B}   fill="#8D6E63"/>
    </svg>
  );
}

function PixelBlueFlower() {
  return (
    <svg width={6*B} height={8*B} style={{ imageRendering: 'pixelated', display: 'block' }}>
      <rect x={2*B}  y={3*B}  width={2*B}  height={5*B} fill="#388E3C"/>
      <rect x={3*B}  y={0}    width={B}    height={3*B} fill="#4FC3F7"/>
      <rect x={3*B}  y={2*B}  width={B}    height={3*B} fill="#4FC3F7"/>
      <rect x={0}    y={B}    width={3*B}  height={2*B} fill="#4FC3F7"/>
      <rect x={3*B}  y={B}    width={3*B}  height={2*B} fill="#4FC3F7"/>
      <rect x={2*B}  y={B}    width={2*B}  height={2*B} fill="#E3F2FD"/>
      <rect x={2*B+2} y={B+2} width={4}    height={4}   fill="#FFF176"/>
    </svg>
  );
}

function PixelRedFlower() {
  return (
    <svg width={6*B} height={9*B} style={{ imageRendering: 'pixelated', display: 'block' }}>
      <rect x={2*B}  y={4*B}  width={2*B}  height={5*B} fill="#388E3C"/>
      <rect x={B}    y={7*B}  width={2*B}  height={B}   fill="#558B2F"/>
      <rect x={B}    y={B}    width={4*B}  height={3*B} fill="#F44336"/>
      <rect x={2*B}  y={0}    width={2*B}  height={B}   fill="#EF5350"/>
      <rect x={0}    y={2*B}  width={B}    height={2*B} fill="#EF5350"/>
      <rect x={5*B}  y={2*B}  width={B}    height={2*B} fill="#EF5350"/>
      <rect x={2*B}  y={3*B}  width={2*B}  height={B}   fill="#1A0800"/>
      <rect x={2*B}  y={B}    width={B}    height={B}   fill="#FF8A80"/>
    </svg>
  );
}

function PixelTulip() {
  return (
    <svg width={5*B} height={11*B} style={{ imageRendering: 'pixelated', display: 'block' }}>
      <rect x={2*B}  y={5*B}  width={B}    height={6*B} fill="#558B2F"/>
      <rect x={B}    y={7*B}  width={2*B}  height={B}   fill="#7CB342"/>
      <rect x={B}    y={3*B}  width={3*B}  height={3*B} fill="#CE93D8"/>
      <rect x={0}    y={4*B}  width={B}    height={2*B} fill="#BA68C8"/>
      <rect x={4*B}  y={4*B}  width={B}    height={2*B} fill="#BA68C8"/>
      <rect x={B}    y={2*B}  width={3*B}  height={2*B} fill="#AB47BC"/>
      <rect x={2*B}  y={B}    width={B}    height={2*B} fill="#9C27B0"/>
      <rect x={2*B}  y={3*B}  width={B}    height={2*B} fill="#E1BEE7"/>
    </svg>
  );
}

function PixelSeashell() {
  return (
    <svg width={5*B} height={4*B} style={{ imageRendering: 'pixelated', display: 'block' }}>
      <rect x={B}    y={B}    width={3*B}  height={2*B} fill="#EFEBE9"/>
      <rect x={0}    y={2*B}  width={5*B}  height={B}   fill="#D7CCC8"/>
      <rect x={B}    y={3*B}  width={3*B}  height={B}   fill="#BCAAA4"/>
      <rect x={2*B}  y={0}    width={B}    height={B}   fill="#EFEBE9"/>
      <rect x={B}    y={B}    width={3}    height={2*B} fill="#BCAAA4"/>
      <rect x={2*B}  y={B}    width={3}    height={2*B} fill="#BCAAA4"/>
      <rect x={3*B}  y={B}    width={3}    height={2*B} fill="#BCAAA4"/>
    </svg>
  );
}

function PixelStarfish() {
  return (
    <svg width={7*B} height={7*B} style={{ imageRendering: 'pixelated', display: 'block' }}>
      <rect x={2*B}  y={2*B}  width={3*B}  height={3*B} fill="#FF8A65"/>
      <rect x={3*B}  y={0}    width={B}    height={3*B} fill="#FF7043"/>
      <rect x={3*B}  y={4*B}  width={B}    height={3*B} fill="#FF7043"/>
      <rect x={0}    y={3*B}  width={3*B}  height={B}   fill="#FF7043"/>
      <rect x={4*B}  y={3*B}  width={3*B}  height={B}   fill="#FF7043"/>
      <rect x={B}    y={B}    width={B}    height={B}   fill="#FF8A65"/>
      <rect x={5*B}  y={B}    width={B}    height={B}   fill="#FF8A65"/>
      <rect x={B}    y={5*B}  width={B}    height={B}   fill="#FF8A65"/>
      <rect x={5*B}  y={5*B}  width={B}    height={B}   fill="#FF8A65"/>
      <rect x={3*B}  y={2*B}  width={B}    height={B}   fill="#FFAB91"/>
    </svg>
  );
}

function PixelCrab() {
  return (
    <svg width={9*B} height={5*B} style={{ imageRendering: 'pixelated', display: 'block' }}>
      <rect x={2*B}  y={B}    width={5*B}  height={3*B} fill="#E53935"/>
      <rect x={3*B}  y={0}    width={3*B}  height={B}   fill="#EF5350"/>
      <rect x={3*B}  y={B}    width={B}    height={B}   fill="#FFFFFF"/>
      <rect x={5*B}  y={B}    width={B}    height={B}   fill="#FFFFFF"/>
      <rect x={3*B+2} y={B+2} width={3}    height={3}   fill="#1A0800"/>
      <rect x={5*B+2} y={B+2} width={3}    height={3}   fill="#1A0800"/>
      {/* Claws */}
      <rect x={0}    y={B}    width={2*B}  height={B}   fill="#E53935"/>
      <rect x={0}    y={0}    width={B}    height={B}   fill="#EF5350"/>
      <rect x={7*B}  y={B}    width={2*B}  height={B}   fill="#E53935"/>
      <rect x={8*B}  y={0}    width={B}    height={B}   fill="#EF5350"/>
      {/* Legs */}
      <rect x={2*B}  y={3*B}  width={B}    height={2*B} fill="#EF5350"/>
      <rect x={3*B}  y={3*B}  width={B}    height={2*B} fill="#EF5350"/>
      <rect x={5*B}  y={3*B}  width={B}    height={2*B} fill="#EF5350"/>
      <rect x={6*B}  y={3*B}  width={B}    height={2*B} fill="#EF5350"/>
    </svg>
  );
}

function PixelVisitor({ running }: { running: boolean }) {
  const u = 10;
  const legSwing = running ? 3 : 0;
  return (
    <svg width={8*u} height={14*u} style={{ imageRendering: 'pixelated', display: 'block' }}>
      {/* Hair */}
      <rect x={u}     y={0}    width={6*u}  height={u}    fill="#8B4513"/>
      <rect x={0}     y={u}    width={u}    height={5*u}  fill="#8B4513"/>
      <rect x={7*u}   y={u}    width={u}    height={4*u}  fill="#8B4513"/>
      {/* Face */}
      <rect x={2*u}   y={u}    width={4*u}  height={3*u}  fill="#FDDBB4"/>
      {/* Eyes */}
      <rect x={3*u}   y={u+6}  width={u}    height={u}    fill="#2C1810"/>
      <rect x={5*u}   y={u+6}  width={u}    height={u}    fill="#2C1810"/>
      {/* Mouth */}
      <rect x={3*u+2} y={3*u}  width={u+4}  height={3}    fill="#CC8866"/>
      {/* Neck */}
      <rect x={3*u}   y={4*u}  width={2*u}  height={u}    fill="#FDDBB4"/>
      {/* T-shirt — teal */}
      <rect x={2*u}   y={5*u}  width={4*u}  height={3*u}  fill="#00897B"/>
      <rect x={u}     y={5*u}  width={u}    height={2*u}  fill="#00897B"/>
      <rect x={6*u}   y={5*u}  width={u}    height={2*u}  fill="#00897B"/>
      {/* Left hand */}
      <rect x={0}     y={6*u}  width={u}    height={u}    fill="#FDDBB4"/>
      {/* Right hand */}
      <rect x={7*u}   y={6*u}  width={u}    height={u}    fill="#FDDBB4"/>
      {/* Shorts — navy */}
      <rect x={2*u}   y={8*u}  width={4*u}  height={2*u}  fill="#283593"/>
      {/* Legs — animated when running */}
      <rect x={2*u}   y={10*u} width={2*u}  height={3*u}  fill="#FDDBB4"
            style={{ transform: running ? `translateY(${-legSwing}px)` : 'none' }}/>
      <rect x={4*u}   y={10*u} width={2*u}  height={3*u}  fill="#FDDBB4"
            style={{ transform: running ? `translateY(${legSwing}px)` : 'none' }}/>
      {/* Shoes — white */}
      <rect x={u}     y={13*u} width={3*u}  height={u}    fill="#E0E0E0"/>
      <rect x={4*u}   y={13*u} width={3*u}  height={u}    fill="#E0E0E0"/>
    </svg>
  );
}

function PixelCafeChair() {
  return (
    <svg width={6*B} height={9*B} style={{ imageRendering: 'pixelated', display: 'block' }}>
      {/* Back */}
      <rect x={B}    y={0}    width={4*B}  height={5*B}  fill="#A1887F"/>
      <rect x={B}    y={0}    width={4*B}  height={B}    fill="#BCAAA4"/>
      <rect x={B}    y={2*B}  width={4*B}  height={B}    fill="#BCAAA4"/>
      {/* Seat */}
      <rect x={0}    y={5*B}  width={6*B}  height={2*B}  fill="#795548"/>
      <rect x={0}    y={5*B}  width={6*B}  height={4}    fill="#8D6E63"/>
      {/* Legs */}
      <rect x={B}    y={7*B}  width={B}    height={2*B}  fill="#5D4037"/>
      <rect x={4*B}  y={7*B}  width={B}    height={2*B}  fill="#5D4037"/>
    </svg>
  );
}

function PixelCafePerson({ shirtColor, talkRight }: { shirtColor: string; talkRight: boolean }) {
  const u = 7;
  return (
    <svg width={6*u} height={10*u} style={{ imageRendering: 'pixelated', display: 'block' }}>
      {/* Hair */}
      <rect x={u}     y={0}    width={4*u}  height={u}    fill="#5D4037"/>
      {/* Face */}
      <rect x={u}     y={u}    width={4*u}  height={3*u}  fill="#FDDBB4"/>
      {/* Eye */}
      <rect x={2*u}   y={u+4}  width={u}    height={u}    fill="#2C1810"/>
      <rect x={4*u}   y={u+4}  width={u}    height={u}    fill="#2C1810"/>
      {/* Neck */}
      <rect x={2*u}   y={4*u}  width={2*u}  height={u}    fill="#FDDBB4"/>
      {/* Body */}
      <rect x={u}     y={5*u}  width={4*u}  height={3*u}  fill={shirtColor}/>
      {/* Arms — one reaches toward table */}
      {talkRight ? (
        <rect x={5*u}   y={5*u}  width={2*u}  height={u}    fill={shirtColor}/>
      ) : (
        <rect x={0}     y={5*u}  width={2*u}  height={u}    fill={shirtColor}/>
      )}
      {/* Cup in hand */}
      {talkRight ? (
        <rect x={6*u}   y={5*u}  width={u}    height={2*u}  fill="#FFFFFF"/>
      ) : (
        <rect x={0}     y={5*u}  width={u}    height={2*u}  fill="#EFEBE9"/>
      )}
      {/* Legs */}
      <rect x={u}     y={8*u}  width={2*u}  height={2*u}  fill="#37474F"/>
      <rect x={3*u}   y={8*u}  width={2*u}  height={2*u}  fill="#37474F"/>
    </svg>
  );
}

function PixelCafeTable() {
  return (
    <svg width={12*B} height={6*B} style={{ imageRendering: 'pixelated', display: 'block' }}>
      {/* Tabletop */}
      <rect x={0}    y={0}    width={12*B}  height={2*B}  fill="#BCAAA4"/>
      <rect x={0}    y={0}    width={12*B}  height={4}    fill="#D7CCC8"/>
      {/* 2 coffee mugs */}
      <rect x={2*B}  y={B-4}  width={B+4}  height={B+4}  fill="#EFEBE9"/>
      <rect x={2*B}  y={B-4}  width={B+4}  height={4}    fill="#FFFFFF"/>
      <rect x={8*B}  y={B-4}  width={B+4}  height={B+4}  fill="#EFEBE9"/>
      <rect x={8*B}  y={B-4}  width={B+4}  height={4}    fill="#FFFFFF"/>
      {/* Table leg */}
      <rect x={5*B}  y={2*B}  width={2*B}  height={4*B}  fill="#8D6E63"/>
      <rect x={2*B}  y={5*B}  width={8*B}  height={B}    fill="#795548"/>
    </svg>
  );
}

function PixelFountain() {
  return (
    <svg width={18*B} height={14*B} style={{ imageRendering: 'pixelated', display: 'block' }}>
      <rect x={8*B}  y={0}    width={2*B}  height={3*B} fill="#B3E5FC"/>
      <rect x={7*B}  y={B}    width={4*B}  height={2*B} fill="#E3F2FD"/>
      <rect x={6*B}  y={3*B}  width={6*B}  height={B}   fill="#90CAF9"/>
      <rect x={5*B}  y={4*B}  width={8*B}  height={B}   fill="#B3E5FC"/>
      <rect x={7*B}  y={5*B}  width={4*B}  height={3*B} fill="#BDBDBD"/>
      <rect x={8*B}  y={5*B}  width={2*B}  height={3*B} fill="#E0E0E0"/>
      <rect x={2*B}  y={8*B}  width={14*B} height={4*B} fill="#29B6F6"/>
      <rect x={B}    y={9*B}  width={16*B} height={3*B} fill="#29B6F6"/>
      <rect x={2*B}  y={8*B}  width={14*B} height={B}   fill="#B3E5FC"/>
      <rect x={0}    y={10*B} width={18*B} height={3*B} fill="#9E9E9E"/>
      <rect x={0}    y={10*B} width={18*B} height={B}   fill="#BDBDBD"/>
      <rect x={3*B}  y={10*B} width={2*B}  height={B}   fill="#81D4FA"/>
      <rect x={8*B}  y={11*B} width={3*B}  height={B}   fill="#81D4FA"/>
      <rect x={13*B} y={10*B} width={2*B}  height={B}   fill="#81D4FA"/>
    </svg>
  );
}

function PixelBench() {
  return (
    <svg width={20*B} height={10*B} style={{ imageRendering: 'pixelated', display: 'block' }}>
      <rect x={B}    y={0}    width={18*B} height={3*B} fill="#795548"/>
      <rect x={B}    y={0}    width={18*B} height={B}   fill="#8D6E63"/>
      <rect x={B}    y={4*B}  width={18*B} height={3*B} fill="#795548"/>
      <rect x={B}    y={4*B}  width={18*B} height={B}   fill="#8D6E63"/>
      <rect x={2*B}  y={7*B}  width={2*B}  height={3*B} fill="#5D4037"/>
      <rect x={16*B} y={7*B}  width={2*B}  height={3*B} fill="#5D4037"/>
      <rect x={2*B}  y={3*B}  width={B}    height={2*B} fill="#6D4C41"/>
      <rect x={17*B} y={3*B}  width={B}    height={2*B} fill="#6D4C41"/>
    </svg>
  );
}

/* ─── Main Component ─── */

const TREE_POSITIONS: [number, number, boolean?][] = [
  [730, 430, false], [1160, 430, false], [700, 580, true],  [1140, 580, true],
  [840, 700, false], [1020, 700, false],
  [1790, 210, true],  [2250, 210, false], [1800, 450, false], [2220, 460, true],
  [120, 1030, false], [520, 1020, true],  [130, 1260, false], [500, 1270, true],
  [1940, 870, true],  [2360, 870, false], [1960, 1120, false], [2350, 1120, true],
  // top edge (inside beach)
  [200, 140], [420, 130], [680, 150], [950, 130], [1200, 140], [1460, 130], [1700, 150], [2000, 130], [2300, 140], [2550, 150],
  // bottom edge
  [180, 1950], [420, 1980], [700, 2020], [1000, 2040], [1300, 2020], [1600, 2010], [1900, 1970], [2200, 1950], [2500, 1940],
  // left edge
  [150, 380], [160, 680], [145, 980], [155, 1300], [150, 1600],
  // right edge
  [2620, 320], [2640, 620], [2630, 920], [2640, 1220], [2620, 1520],
  // central
  [1380, 580], [1520, 780], [1200, 1020], [1600, 1050], [1050, 1320], [1700, 1350], [1300, 1600], [1500, 1650],
];

const BUSH_POSITIONS: [number, number][] = [
  [1360, 900], [1460, 900], [1360, 1150], [1460, 1150],
  [880, 670], [1060, 670], [1900, 420], [2180, 420],
  [230, 1250], [460, 1250], [2050, 1100], [2350, 1100],
  [650, 350], [1100, 280], [1750, 600], [2450, 800],
  [500, 1550], [900, 1700], [1800, 1600], [2100, 1500],
];

// Flowers spread evenly across the island, avoiding building footprints:
// Studio ~900-1140,500-720 | Library ~1950-2220,280-560 | Bakery ~260-510,1100-1300 | PostOffice ~2100-2370,950-1170
const FLOWER_POSITIONS: [number, number][] = [
  // top-left quadrant
  [350, 320], [580, 280], [750, 350], [500, 500], [650, 650],
  // top-right quadrant (avoiding library)
  [1550, 300], [1700, 450], [2350, 320], [2500, 480],
  // bottom-left (avoiding bakery)
  [350, 1400], [550, 1550], [700, 1700], [200, 1600],
  // bottom-right (avoiding post office)
  [1600, 1300], [1800, 1500], [2000, 1650], [2400, 1350],
  // central
  [1200, 600], [1600, 750], [1100, 900], [1700, 1000],
];

const SUNFLOWER_POSITIONS: [number, number][] = [
  [280, 440], [620, 380], [820, 250], [1050, 800],
  [1550, 520], [2450, 360], [2550, 700],
  [450, 1450], [600, 1650], [160, 1400],
  [1900, 1400], [2200, 1600], [2550, 1200],
  [1300, 750], [1650, 950],
];

const BLUE_FLOWER_POSITIONS: [number, number][] = [
  [420, 260], [700, 420], [550, 600],
  [1600, 380], [1850, 200], [2400, 550],
  [320, 1480], [680, 1780], [200, 1750],
  [1750, 1450], [2050, 1750], [2500, 1500],
  [1150, 700], [1750, 850],
];

const RED_FLOWER_POSITIONS: [number, number][] = [
  [300, 380], [480, 450], [750, 500], [880, 750],
  [1700, 300], [2300, 420], [2600, 600],
  [380, 1550], [520, 1720], [150, 1550],
  [1850, 1600], [2150, 1400], [2450, 1700],
  [1200, 850], [1600, 1100],
];

const TULIP_POSITIONS: [number, number][] = [
  [260, 340], [550, 340], [820, 460], [680, 730],
  [1500, 250], [1800, 380], [2480, 440],
  [420, 1500], [620, 1620], [250, 1680],
  [1950, 1500], [2250, 1700], [2550, 1350],
  [1300, 650], [1700, 1150],
];

const FLOWER_BUSH_POSITIONS: [number, number][] = [
  // near buildings
  [870, 640], [1070, 640], [1900, 400], [2200, 400],
  [240, 1230], [470, 1230], [2060, 1080], [2360, 1080],
  // path edges
  [1340, 880], [1480, 880], [1340, 1170], [1480, 1170],
  // scattered
  [680, 360], [1120, 260], [1770, 580], [2430, 820],
];

// Beach items: scattered on sandy beach (outer ~60-120px from world edge)
const PALM_POSITIONS: [number, number][] = [
  // top beach
  [60, 60], [380, 50], [720, 60], [1150, 45], [1650, 55], [2100, 60], [2550, 60],
  // bottom beach
  [100, 2080], [500, 2090], [1000, 2100], [1500, 2095], [2000, 2085], [2550, 2075],
  // left beach
  [30, 320], [40, 720], [25, 1150], [40, 1580],
  // right beach
  [2700, 350], [2710, 750], [2700, 1200], [2705, 1620],
];

interface BeachItem { x: number; y: number; type: 'shell' | 'crab' | 'starfish'; }

const BEACH_ITEMS: BeachItem[] = [
  // top strip
  { x: 160, y: 55, type: 'shell' }, { x: 550, y: 40, type: 'starfish' },
  { x: 900, y: 60, type: 'shell' }, { x: 1350, y: 45, type: 'crab' },
  { x: 1850, y: 55, type: 'shell' }, { x: 2300, y: 48, type: 'starfish' },
  // bottom strip
  { x: 300, y: 2120, type: 'shell' }, { x: 750, y: 2110, type: 'crab' },
  { x: 1200, y: 2130, type: 'starfish' }, { x: 1800, y: 2115, type: 'shell' },
  { x: 2400, y: 2120, type: 'crab' },
  // left strip
  { x: 50, y: 500, type: 'shell' }, { x: 60, y: 900, type: 'starfish' }, { x: 45, y: 1350, type: 'crab' },
  // right strip
  { x: 2720, y: 550, type: 'shell' }, { x: 2730, y: 1000, type: 'starfish' }, { x: 2715, y: 1450, type: 'shell' },
];

// All collectible flower positions indexed by type+index for game state
type FlowerType = 'pink' | 'sun' | 'blue' | 'red' | 'tulip';
type FlowerKey = `${FlowerType}-${number}`;
type CollectedFlower = { type: FlowerType; emoji: string };

const FLOWER_EMOJI: Record<FlowerType, string> = {
  pink: '🌸', sun: '🌻', blue: '💐', red: '🌹', tulip: '🌷',
};

const POST_OFFICE_WORLD = { x: 2100, y: 950, w: 240, h: 190 };
const COLLECT_RADIUS = 70;
const POST_DELIVER_RADIUS = 120;

const buildingLabel: React.CSSProperties = {
  position: 'absolute',
  top: -24,
  left: '50%',
  transform: 'translateX(-50%)',
  whiteSpace: 'nowrap',
  fontFamily: "'Courier New', monospace",
  fontSize: '11px',
  fontWeight: 'bold',
  color: '#fff',
  textShadow: '1px 1px 0 #000, -1px 1px 0 #000, 1px -1px 0 #000, -1px -1px 0 #000',
  letterSpacing: '1.5px',
  pointerEvents: 'none',
  background: 'rgba(0,0,0,0.5)',
  padding: '2px 8px',
  borderRadius: '4px',
};

export function VaishnaviIsland({ onClose }: VaishnaviIslandProps) {
  const [isWaving, setIsWaving] = useState(false);
  const [dialogue, setDialogue] = useState<DialogueState | null>(null);
  const [benchSubtitle, setBenchSubtitle] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const [constraints, setConstraints] = useState({
    left: -(WORLD_W - window.innerWidth), right: 0,
    top: -(WORLD_H - window.innerHeight), bottom: 0,
  });
  const [initialOffset] = useState(getInitialOffset);
  const waveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const subtitleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Game state
  const [collectedFlowers, setCollectedFlowers] = useState<CollectedFlower[]>([]);
  const [collectedKeys, setCollectedKeys] = useState<Set<FlowerKey>>(new Set());
  const [nearFlowers, setNearFlowers] = useState<Set<FlowerKey>>(new Set());
  const [activeCrabs, setActiveCrabs] = useState<Set<number>>(new Set());
  const [nearPostOffice, setNearPostOffice] = useState(false);
  const [showDelivered, setShowDelivered] = useState(false);

  // Visitor movement
  const worldX = useMotionValue(initialOffset.x);
  const worldY = useMotionValue(initialOffset.y);
  const [visitorPos, setVisitorPos] = useState(VISITOR_INIT);
  const [isRunning, setIsRunning] = useState(false);
  const [facingRight, setFacingRight] = useState(true);
  const runTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const visitorRef = useRef(VISITOR_INIT);
  const keysRef = useRef(new Set<string>());
  const collectedKeysRef = useRef<Set<FlowerKey>>(new Set());
  const isDraggingRef = useRef(false);
  const rafRef = useRef<number>();

  // Keep collectedKeysRef in sync for RAF closure
  useEffect(() => { collectedKeysRef.current = collectedKeys; }, [collectedKeys]);

  // All flower positions flat list for proximity checks
  const allFlowers = useMemo(() => {
    const list: { key: FlowerKey; x: number; y: number; type: FlowerType }[] = [];
    FLOWER_POSITIONS.forEach(([x, y], i) => list.push({ key: `pink-${i}`, x, y, type: 'pink' }));
    SUNFLOWER_POSITIONS.forEach(([x, y], i) => list.push({ key: `sun-${i}`, x, y, type: 'sun' }));
    BLUE_FLOWER_POSITIONS.forEach(([x, y], i) => list.push({ key: `blue-${i}`, x, y, type: 'blue' }));
    RED_FLOWER_POSITIONS.forEach(([x, y], i) => list.push({ key: `red-${i}`, x, y, type: 'red' }));
    TULIP_POSITIONS.forEach(([x, y], i) => list.push({ key: `tulip-${i}`, x, y, type: 'tulip' }));
    return list;
  }, []);

  const updateProximity = useCallback((wx: number, wy: number) => {
    const near = new Set<FlowerKey>();
    const r2 = COLLECT_RADIUS * COLLECT_RADIUS;
    for (const f of allFlowers) {
      if (collectedKeysRef.current.has(f.key)) continue;
      const dx = f.x - wx, dy = f.y - wy;
      if (dx*dx + dy*dy < r2) near.add(f.key);
    }
    setNearFlowers(near);
    const pox = POST_OFFICE_WORLD.x + POST_OFFICE_WORLD.w / 2;
    const poy = POST_OFFICE_WORLD.y + POST_OFFICE_WORLD.h / 2;
    const pdx = pox - wx, pdy = poy - wy;
    setNearPostOffice(pdx*pdx + pdy*pdy < POST_DELIVER_RADIUS * POST_DELIVER_RADIUS);
  }, [allFlowers]);

  useEffect(() => {
    const t = setTimeout(() => setShowHint(false), 3500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    function update() {
      setConstraints({
        left: -(WORLD_W - window.innerWidth), right: 0,
        top: -(WORLD_H - window.innerHeight), bottom: 0,
      });
    }
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Keyboard movement RAF loop (Stardew Valley style)
  useEffect(() => {
    const SPEED = 5;
    function tick() {
      if (!isDraggingRef.current) {
        const keys = keysRef.current;
        let dx = 0, dy = 0;
        if (keys.has('ArrowLeft') || keys.has('a')) dx -= SPEED;
        if (keys.has('ArrowRight') || keys.has('d')) dx += SPEED;
        if (keys.has('ArrowUp') || keys.has('w')) dy -= SPEED;
        if (keys.has('ArrowDown') || keys.has('s')) dy += SPEED;

        if (dx !== 0 || dy !== 0) {
          const vw = window.innerWidth, vh = window.innerHeight;
          const cur = visitorRef.current;
          const nx = Math.max(30, Math.min(WORLD_W - 30, cur.x + dx));
          const ny = Math.max(30, Math.min(WORLD_H - 30, cur.y + dy));
          visitorRef.current = { x: nx, y: ny };

          const ox = Math.min(0, Math.max(-(WORLD_W - vw), vw / 2 - (nx + ISLAND_X)));
          const oy = Math.min(0, Math.max(-(WORLD_H - vh), vh / 2 - (ny + ISLAND_Y)));
          worldX.set(ox);
          worldY.set(oy);

          setVisitorPos({ x: nx, y: ny });
          setIsRunning(true);
          if (runTimerRef.current) clearTimeout(runTimerRef.current);
          runTimerRef.current = setTimeout(() => setIsRunning(false), 150);
          updateProximity(nx, ny);

          if (dx > 0) setFacingRight(true);
          else if (dx < 0) setFacingRight(false);
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    }

    function onKeyDown(e: KeyboardEvent) {
      keysRef.current.add(e.key);
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) e.preventDefault();
    }
    function onKeyUp(e: KeyboardEvent) { keysRef.current.delete(e.key); }

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [worldX, worldY, updateProximity]);

  // Track drag and update visitor position to viewport center in world coords
  const handleDrag = useCallback(() => {
    const ox = worldX.get();
    const oy = worldY.get();
    // Convert world-offset to island-relative visitor position
    const wx = -ox + window.innerWidth / 2 - ISLAND_X;
    const wy = -oy + window.innerHeight / 2 - ISLAND_Y;
    visitorRef.current = { x: wx, y: wy };
    setVisitorPos({ x: wx, y: wy });
    setIsRunning(true);
    if (runTimerRef.current) clearTimeout(runTimerRef.current);
    runTimerRef.current = setTimeout(() => setIsRunning(false), 300);
    updateProximity(wx, wy);
  }, [worldX, worldY, updateProximity]);

  const handleDragEnd = useCallback(() => {
    isDraggingRef.current = false;
    const ox = worldX.get();
    const oy = worldY.get();
    const wx = -ox + window.innerWidth / 2 - ISLAND_X;
    const wy = -oy + window.innerHeight / 2 - ISLAND_Y;
    visitorRef.current = { x: wx, y: wy };
    setVisitorPos({ x: wx, y: wy });
  }, [worldX, worldY]);

  const handleCharacterClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (isWaving) return;
    setIsWaving(true);
    if (waveTimerRef.current) clearTimeout(waveTimerRef.current);
    waveTimerRef.current = setTimeout(() => setIsWaving(false), 3000);
  }, [isWaving]);

  const handleFlowerClick = useCallback((key: FlowerKey, type: FlowerType, e: React.MouseEvent) => {
    e.stopPropagation();
    if (collectedKeys.has(key)) return;
    if (!nearFlowers.has(key)) return;
    if (collectedFlowers.length >= 5) return;
    setCollectedKeys(prev => new Set([...prev, key]));
    setCollectedFlowers(prev => [...prev, { type, emoji: FLOWER_EMOJI[type] }]);
  }, [collectedKeys, nearFlowers, collectedFlowers]);

  const handleCrabClick = useCallback((i: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveCrabs(prev => new Set([...prev, i]));
    setTimeout(() => setActiveCrabs(prev => { const n = new Set(prev); n.delete(i); return n; }), 1600);
  }, []);

  const handleDelivery = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDelivered(true);
    setDialogue({ title: 'Post Office', content: { type: 'connect', linkedin: 'https://www.linkedin.com/in/vaishnavi-jawdekar/' } });
    setCollectedFlowers([]);
    setCollectedKeys(new Set());
    setTimeout(() => setShowDelivered(false), 500);
  }, []);

  const handleStudioClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setDialogue({ title: 'Design Studio', content: { type: 'bio', text: 'Resident designer of this island. Moved here for the vibes, stayed for the margins. Iced drink in hand, always.' } });
  }, []);

  const handleLibraryClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setDialogue({ title: 'The Library', content: { type: 'stats', items: [
      { label: 'Font Snobbery', value: 95 },
      { label: 'Iced Drink Dependency', value: 90 },
      { label: 'Pixel Perfectness', value: 100 },
      { label: 'Pinterest Scroll Resistance', value: 15 },
    ]}});
  }, []);

  const handleBakeryClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setDialogue({ title: 'Bakery & Café', content: { type: 'likes',
      likes: ['Figma', 'Typography', 'Well-spaced margins', 'Iced drinks'],
      dislikes: ['Dribbble clones', 'Low-contrast text', 'Missing grids'],
    }});
  }, []);

  const handlePostOfficeClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (nearPostOffice && collectedFlowers.length > 0) return; // delivery prompt handles it
    setDialogue({ title: 'Post Office', content: { type: 'connect', linkedin: 'https://www.linkedin.com/in/vaishnavi-jawdekar/' } });
  }, [nearPostOffice, collectedFlowers]);

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
          <motion.p className={styles.hint}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}>
            WASD / arrows to move · collect flowers · bring them to the post office
          </motion.p>
        )}
      </AnimatePresence>

      {/* Bouquet side panel */}
      <div className={styles.bouquetPanel}>
        <span className={styles.bouquetPanelIcon}>🌸</span>
        <span className={styles.bouquetPanelCount}>{collectedFlowers.length}/5</span>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className={`${styles.bouquetSlot} ${collectedFlowers[i] ? styles.bouquetSlotFilled : ''}`}>
            {collectedFlowers[i]?.emoji ?? ''}
          </div>
        ))}
      </div>

      <motion.div
        className={styles.world}
        drag
        dragConstraints={constraints}
        dragElastic={0.04}
        dragTransition={{ bounceStiffness: 250, bounceDamping: 45 }}
        initial={initialOffset}
        style={{ width: WORLD_W, height: WORLD_H, x: worldX, y: worldY }}
        onDragStart={() => { isDraggingRef.current = true; }}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
      >
        {/* Island landmass — floats in the ocean */}
        <div className={styles.island}>

        {/* Beach sand layer */}
        <div className={styles.beachTop} />
        <div className={styles.beachBottom} />
        <div className={styles.beachLeft} />
        <div className={styles.beachRight} />

        {/* Grass ground */}
        <div className={styles.ground} />
        <div className={styles.pathV} />
        <div className={styles.pathH} />

        {/* Beach items */}
        {PALM_POSITIONS.map(([x, y], i) => (
          <div key={`palm-${i}`} className={styles.decoration} style={{ left: x, top: y }}>
            <PixelPalmTree />
          </div>
        ))}
        {BEACH_ITEMS.map((item, i) => (
          <div
            key={`beach-${i}`}
            className={`${styles.decoration} ${item.type === 'crab' ? (activeCrabs.has(i) ? styles.crabActive : '') : ''}`}
            style={{
              left: item.x + (activeCrabs.has(i) ? 40 : 0),
              top: item.y,
              cursor: item.type === 'crab' ? 'pointer' : 'default',
              pointerEvents: item.type === 'crab' ? 'auto' : 'none',
              transition: activeCrabs.has(i) ? 'left 1.5s steps(4, end)' : 'left 0.1s',
            }}
            onClick={item.type === 'crab' ? (e) => handleCrabClick(i, e) : undefined}
          >
            {item.type === 'shell' && <PixelSeashell />}
            {item.type === 'starfish' && <PixelStarfish />}
            {item.type === 'crab' && <PixelCrab />}
          </div>
        ))}

        {/* Trees */}
        {TREE_POSITIONS.map(([x, y, dark], i) => (
          <div key={`tr-${i}`} className={styles.decoration} style={{ left: x, top: y }}>
            <PixelTree dark={dark} />
          </div>
        ))}

        {/* Bushes */}
        {BUSH_POSITIONS.map(([x, y], i) => (
          <div key={`bs-${i}`} className={styles.decoration} style={{ left: x, top: y }}>
            <PixelBush />
          </div>
        ))}

        {/* Flower bushes */}
        {FLOWER_BUSH_POSITIONS.map(([x, y], i) => (
          <div key={`fb-${i}`} className={styles.decoration} style={{ left: x, top: y }}>
            <PixelFlowerBush />
          </div>
        ))}

        {/* Collectible flowers — glow when near, clickable */}
        {allFlowers.map((f) => {
          if (collectedKeys.has(f.key)) return null;
          const isNear = nearFlowers.has(f.key);
          const FlowerComponent = f.type === 'pink' ? PixelFlower
            : f.type === 'sun' ? PixelSunflower
            : f.type === 'blue' ? PixelBlueFlower
            : f.type === 'red' ? PixelRedFlower
            : PixelTulip;
          return (
            <div
              key={f.key}
              className={`${styles.decoration} ${isNear ? styles.flowerNear : ''}`}
              style={{ left: f.x, top: f.y }}
              onClick={isNear ? (e) => handleFlowerClick(f.key, f.type, e) : undefined}
            >
              <FlowerComponent />
            </div>
          );
        })}

        {/* Fountain */}
        <div className={styles.decoration} style={{ left: 1310, top: 1040 }}>
          <PixelFountain />
        </div>

        {/* Bench */}
        <motion.div className={styles.clickable} style={{ left: 1280, top: 360, position: 'absolute' }}
          whileHover={{ scale: 1.08, cursor: 'pointer' }} onClick={handleBenchClick}>
          <PixelBench />
        </motion.div>

        {/* Library */}
        <motion.div className={styles.clickable} style={{ left: 1950, top: 360, position: 'absolute' }}
          whileHover={{ y: -6, transition: { duration: 0.15 }, cursor: 'pointer' }} onClick={handleLibraryClick}>
          <div style={buildingLabel}>LIBRARY</div>
          <PixelLibrary />
        </motion.div>

        {/* Bakery + outdoor café scene */}
        <motion.div className={styles.clickable} style={{ left: 350, top: 1100, position: 'absolute' }}
          whileHover={{ y: -6, transition: { duration: 0.15 }, cursor: 'pointer' }} onClick={handleBakeryClick}>
          <div style={buildingLabel}>BAKERY</div>
          <PixelBakery />
        </motion.div>
        {/* Outdoor café table & two characters */}
        <div className={styles.decoration} style={{ left: 650, top: 1170 }}>
          <PixelCafeTable />
        </div>
        <div className={styles.decoration} style={{ left: 620, top: 1110 }}>
          <PixelCafePerson shirtColor="#F06292" talkRight={true} />
        </div>
        <div className={styles.decoration} style={{ left: 700, top: 1110 }}>
          <PixelCafePerson shirtColor="#29B6F6" talkRight={false} />
        </div>

        {/* Post Office + delivery prompt */}
        <motion.div className={styles.clickable} style={{ left: 2100, top: 950, position: 'absolute' }}
          whileHover={{ y: -6, transition: { duration: 0.15 }, cursor: 'pointer' }} onClick={handlePostOfficeClick}>
          <div style={buildingLabel}>POST OFFICE</div>
          <PixelPostOffice />
          {nearPostOffice && collectedFlowers.length > 0 && !showDelivered && (
            <div
              className={styles.deliveryPrompt}
              style={{ position: 'absolute', top: -44, left: '50%', transform: 'translateX(-50%)' }}
              onClick={handleDelivery}
            >
              🌸 Deliver your bouquet?
            </div>
          )}
        </motion.div>

        {/* Design Studio */}
        <motion.div className={styles.clickable} style={{ left: 900, top: 500, position: 'absolute' }}
          whileHover={{ y: -6, transition: { duration: 0.15 }, cursor: 'pointer' }} onClick={handleStudioClick}>
          <div style={buildingLabel}>DESIGN STUDIO</div>
          <PixelStudio />
        </motion.div>

        {/* Vaishnavi character */}
        <motion.div
          className={styles.character}
          onClick={handleCharacterClick}
          style={{ cursor: 'pointer' }}
          animate={isWaving ? { y: [0, -10, 0, -6, 0] } : { y: [0, -4, 0] }}
          transition={isWaving
            ? { duration: 0.6, ease: 'easeInOut' }
            : { duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          whileHover={{ scale: 1.06 }}
        >
          <PixelCharacter waving={isWaving} />
        </motion.div>

        {/* Visitor character — WASD/arrow keys or drag to move */}
        <div
          className={styles.visitor}
          style={{
            left: visitorPos.x - 40,
            top: visitorPos.y - 70,
            transform: facingRight ? 'scaleX(1)' : 'scaleX(-1)',
          }}
        >
          <PixelVisitor running={isRunning} />
        </div>

        </div>{/* end .island */}
      </motion.div>

      {dialogue && (
        <IslandDialogue title={dialogue.title} content={dialogue.content} onClose={() => setDialogue(null)} />
      )}
      <BeachSubtitle visible={benchSubtitle} />
    </div>,
    document.body
  );
}
