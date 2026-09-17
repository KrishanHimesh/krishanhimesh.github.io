import React, { useEffect, useRef, useState } from 'react';
import './NetworkBackground.css';

// Sparse, faint "0/1" columns drifting down over a faint grid — a quiet
// nod to binary/network data rather than a busy Matrix-style rain.
const CHARS = '01';
const COLUMN_GAP_PX = 130; // roughly one column per this many px of width
const ROWS_PER_COLUMN = 14;

function makeColumnText() {
  let text = '';
  for (let i = 0; i < ROWS_PER_COLUMN; i++) {
    text += CHARS[Math.floor(Math.random() * CHARS.length)] + '\n';
  }
  return text;
}

function makeColumns(width) {
  const count = Math.max(6, Math.min(22, Math.floor(width / COLUMN_GAP_PX)));
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    leftPct: ((i + 0.5) / count) * 100 + (Math.random() * 4 - 2),
    duration: 14 + Math.random() * 12, // seconds
    delay: -(Math.random() * 20), // negative delay so they start mid-fall, staggered
    text: makeColumnText(),
  }));
}

export default function NetworkBackground() {
  const [columns, setColumns] = useState(() => makeColumns(window.innerWidth));
  const resizeTimeout = useRef(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return; // keep the static grid only, skip regenerating/animating columns

    function handleResize() {
      clearTimeout(resizeTimeout.current);
      resizeTimeout.current = setTimeout(() => {
        setColumns(makeColumns(window.innerWidth));
      }, 250);
    }

    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(resizeTimeout.current);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="network-bg" aria-hidden="true">
      <div className="network-grid" />
      <div className="glyph-layer">
        {columns.map(col => (
          <span
            key={col.id}
            className="glyph-col"
            style={{
              left: `${col.leftPct}%`,
              animationDuration: `${col.duration}s`,
              animationDelay: `${col.delay}s`,
            }}
          >
            {col.text}
          </span>
        ))}
      </div>
    </div>
  );
}
