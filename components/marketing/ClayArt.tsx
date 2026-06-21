import type { CSSProperties } from 'react';

interface MascotProps {
  className?: string;
  style?: CSSProperties;
  /** Accessible label. Leave empty (default) for decorative instances. */
  title?: string;
}

/**
 * NubHub mascot — a generated soft 3D clay heart with a kawaii smiling face.
 * One recurring character: logo mark, hero anchor, pricing peek, footer.
 */
export function HeartMascot({ className = '', style, title = '' }: MascotProps) {
  return (
    <img
      src="/clay/mascot.png"
      alt={title}
      aria-hidden={title ? undefined : true}
      draggable={false}
      className={`clay-mascot-img ${className}`}
      style={style}
    />
  );
}

interface SparkleProps {
  className?: string;
  style?: CSSProperties;
}

/** Small clay twinkle for decoration. */
export function ClaySparkle({ className = '', style }: SparkleProps) {
  return (
    <img
      src="/clay/sparkle-clay.png"
      alt=""
      aria-hidden="true"
      draggable={false}
      className={`clay-sparkle-img ${className}`}
      style={style}
    />
  );
}
