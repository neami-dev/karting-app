import type { VisualSeed } from "@/lib/types";
import { cx } from "@/lib/format";

/**
 * CINEMA PLATES
 * -------------
 * The design system calls for full-bleed cinematic photography as the primary
 * depth treatment. Real trackside photography does not exist for this build, so
 * rather than ship stock images pretending to be this circuit, each surface gets
 * a composed SVG plate: asphalt tone, perspective geometry, motion streaks and a
 * single Rosso Corsa accent.
 *
 * TO REPLACE WITH REAL PHOTOGRAPHY: swap the <svg> for next/image inside this
 * component only. Every hero, card and banner on the site routes through here.
 */

interface TrackVisualProps {
  seed: VisualSeed;
  className?: string;
  /** Darkens the plate so display type stays legible on top */
  overlay?: "none" | "soft" | "strong" | "bottom";
  priority?: boolean;
}

/** Per-seed geometry so no two surfaces look identical. */
const SEEDS: Record<
  VisualSeed,
  {
    /** Base asphalt gradient stops */
    from: string;
    to: string;
    /** Horizon height, 0–100 */
    horizon: number;
    /** Vanishing point x, 0–100 */
    vanish: number;
    /** How many kerb segments */
    kerbs: number;
    accent: "kerb" | "line" | "arc" | "burst" | "none";
    streaks: number;
  }
> = {
  "grid-start": { from: "#2e2e2e", to: "#111111", horizon: 38, vanish: 50, kerbs: 10, accent: "kerb", streaks: 2 },
  apex: { from: "#343434", to: "#0e0e0e", horizon: 42, vanish: 68, kerbs: 8, accent: "arc", streaks: 5 },
  "night-track": { from: "#1e2126", to: "#070708", horizon: 34, vanish: 40, kerbs: 12, accent: "line", streaks: 7 },
  podium: { from: "#3a3a3a", to: "#131313", horizon: 52, vanish: 50, kerbs: 6, accent: "burst", streaks: 0 },
  "pit-lane": { from: "#2b2b2b", to: "#0f0f0f", horizon: 40, vanish: 26, kerbs: 9, accent: "line", streaks: 3 },
  helmet: { from: "#333333", to: "#0c0c0c", horizon: 60, vanish: 50, kerbs: 4, accent: "arc", streaks: 1 },
  chicane: { from: "#303030", to: "#101010", horizon: 44, vanish: 34, kerbs: 11, accent: "kerb", streaks: 4 },
  confetti: { from: "#383838", to: "#121212", horizon: 56, vanish: 58, kerbs: 5, accent: "burst", streaks: 0 },
  aerial: { from: "#2a2a2a", to: "#0d0d0d", horizon: 70, vanish: 50, kerbs: 14, accent: "arc", streaks: 2 },
};

export function TrackVisual({
  seed,
  className,
  overlay = "soft",
}: TrackVisualProps) {
  const s = SEEDS[seed];
  const uid = `tv-${seed}`;

  const overlayClass =
    overlay === "none"
      ? ""
      : overlay === "bottom"
        ? "bg-gradient-to-t from-canvas via-canvas/55 to-transparent"
        : overlay === "strong"
          ? "bg-canvas/70"
          : "bg-canvas/35";

  return (
    <div className={cx("relative overflow-hidden bg-canvas", className)} aria-hidden="true">
      <svg
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        role="presentation"
      >
        <defs>
          <linearGradient id={`${uid}-sky`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={s.from} />
            <stop offset="100%" stopColor={s.to} />
          </linearGradient>

          <linearGradient id={`${uid}-asphalt`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a1a1a" />
            <stop offset="55%" stopColor="#242424" />
            <stop offset="100%" stopColor="#0b0b0b" />
          </linearGradient>

          <radialGradient id={`${uid}-glow`} cx="50%" cy={`${s.horizon}%`} r="55%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>

          <radialGradient id={`${uid}-vignette`} cx="50%" cy="45%" r="72%">
            <stop offset="55%" stopColor="#000000" stopOpacity="0" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.75" />
          </radialGradient>

          <linearGradient id={`${uid}-streak`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          <filter id={`${uid}-grain`}>
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="7" />
            <feColorMatrix type="saturate" values="0" />
          </filter>

          <clipPath id={`${uid}-clip`}>
            <rect width="1200" height="800" />
          </clipPath>
        </defs>

        <g clipPath={`url(#${uid}-clip)`}>
          {/* Sky / backdrop */}
          <rect width="1200" height="800" fill={`url(#${uid}-sky)`} />
          <rect width="1200" height="800" fill={`url(#${uid}-glow)`} />

          {/* Asphalt plane in perspective */}
          <path
            d={`M0,800 L${s.vanish * 12 - 90},${s.horizon * 8} L${s.vanish * 12 + 90},${s.horizon * 8} L1200,800 Z`}
            fill={`url(#${uid}-asphalt)`}
          />

          {/* Track edge lines */}
          <path
            d={`M0,800 L${s.vanish * 12 - 90},${s.horizon * 8}`}
            stroke="#ffffff"
            strokeOpacity="0.22"
            strokeWidth="3"
            fill="none"
          />
          <path
            d={`M1200,800 L${s.vanish * 12 + 90},${s.horizon * 8}`}
            stroke="#ffffff"
            strokeOpacity="0.22"
            strokeWidth="3"
            fill="none"
          />

          {/* Centre dashes receding to the vanishing point */}
          {Array.from({ length: 9 }).map((_, i) => {
            const t = i / 9;
            const y = s.horizon * 8 + (800 - s.horizon * 8) * Math.pow(t, 1.9);
            const nextT = (i + 0.45) / 9;
            const y2 = s.horizon * 8 + (800 - s.horizon * 8) * Math.pow(nextT, 1.9);
            const w = 2 + 10 * Math.pow(t, 1.9);
            const x = s.vanish * 12 + (600 - s.vanish * 12) * Math.pow(t, 1.9);
            return (
              <rect
                key={i}
                x={x - w / 2}
                y={y}
                width={w}
                height={Math.max(y2 - y, 2)}
                fill="#ffffff"
                opacity={0.1 + 0.28 * t}
              />
            );
          })}

          {/* Kerbing — the one place Rosso Corsa appears in the plate */}
          {s.accent === "kerb" &&
            Array.from({ length: s.kerbs }).map((_, i) => {
              const t = i / s.kerbs;
              const y = s.horizon * 8 + (800 - s.horizon * 8) * Math.pow(t, 1.8);
              const h = 6 + 26 * Math.pow(t, 1.8);
              const x = s.vanish * 12 - 90 - (s.vanish * 12 - 90) * Math.pow(t, 1.8);
              return (
                <rect
                  key={i}
                  x={x}
                  y={y}
                  width={14 + 44 * Math.pow(t, 1.8)}
                  height={h}
                  fill={i % 2 === 0 ? "#da291c" : "#e8e8e8"}
                  opacity={0.35 + 0.5 * t}
                  transform={`skewX(-8)`}
                />
              );
            })}

          {/* Apex arc */}
          {s.accent === "arc" && (
            <>
              <path
                d={`M-40,${s.horizon * 8 + 210} Q ${s.vanish * 12},${s.horizon * 8 - 70} 1240,${s.horizon * 8 + 300}`}
                stroke="#da291c"
                strokeWidth="5"
                fill="none"
                opacity="0.65"
              />
              <path
                d={`M-40,${s.horizon * 8 + 240} Q ${s.vanish * 12},${s.horizon * 8 - 40} 1240,${s.horizon * 8 + 330}`}
                stroke="#ffffff"
                strokeWidth="1.5"
                fill="none"
                opacity="0.18"
              />
            </>
          )}

          {/* Pit / start line */}
          {s.accent === "line" && (
            <>
              <rect
                x="0"
                y={s.horizon * 8 + 150}
                width="1200"
                height="6"
                fill="#da291c"
                opacity="0.7"
              />
              {Array.from({ length: 24 }).map((_, i) => (
                <rect
                  key={i}
                  x={i * 50}
                  y={s.horizon * 8 + 168}
                  width="25"
                  height="14"
                  fill="#ffffff"
                  opacity={i % 2 === 0 ? 0.32 : 0.08}
                />
              ))}
            </>
          )}

          {/* Podium burst */}
          {s.accent === "burst" &&
            Array.from({ length: 16 }).map((_, i) => {
              const angle = (i / 16) * Math.PI * 2;
              const r1 = 90;
              const r2 = 260 + (i % 3) * 70;
              const cxp = s.vanish * 12;
              const cyp = s.horizon * 8 + 60;
              return (
                <line
                  key={i}
                  x1={cxp + Math.cos(angle) * r1}
                  y1={cyp + Math.sin(angle) * r1}
                  x2={cxp + Math.cos(angle) * r2}
                  y2={cyp + Math.sin(angle) * r2}
                  stroke={i % 4 === 0 ? "#da291c" : "#ffffff"}
                  strokeWidth={i % 4 === 0 ? 3 : 1.5}
                  opacity={i % 4 === 0 ? 0.45 : 0.13}
                />
              );
            })}

          {/* Motion streaks — speed without literal blur */}
          {Array.from({ length: s.streaks }).map((_, i) => {
            const y = s.horizon * 8 - 40 + i * 46 + (i % 3) * 12;
            return (
              <rect
                key={i}
                x={-200 + i * 130}
                y={y}
                width={340 + (i % 3) * 160}
                height={2 + (i % 2)}
                fill={`url(#${uid}-streak)`}
                opacity={0.5}
              />
            );
          })}

          {/* Film grain keeps it from reading as flat vector art */}
          <rect
            width="1200"
            height="800"
            filter={`url(#${uid}-grain)`}
            opacity="0.045"
            style={{ mixBlendMode: "overlay" }}
          />

          <rect width="1200" height="800" fill={`url(#${uid}-vignette)`} />
        </g>
      </svg>

      {overlayClass && <div className={cx("absolute inset-0", overlayClass)} />}
    </div>
  );
}
