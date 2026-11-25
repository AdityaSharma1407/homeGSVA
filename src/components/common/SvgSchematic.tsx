'use client';

import React from 'react';

export type SchematicProps =
  | {
      kind: 'paint';
      length: number;
      width: number;
      height: number;
      doors: number;
      windows: number;
      unitLabel: string;
    }
  | {
      kind: 'concrete';
      shape: 'slab' | 'footing' | 'column' | 'steps';
      dimA: number;
      dimB: number;
      depthLabel: string;
      unitLabel: string;
    }
  | {
      kind: 'mulch' | 'gravel';
      mode: 'rectangle' | 'circle' | 'area';
      length: number;
      width: number;
      depthLabel: string;
      unitLabel: string;
      fillTone: string;
    }
  | {
      kind: 'tile';
      roomLength: number;
      roomWidth: number;
      tileL: number;
      tileW: number;
      edgeCutText: string;
    }
  | {
      kind: 'fence';
      sections: number;
      railsPerSection: number;
      heightLabel: string;
      burialLabel: string;
    };

export const SvgSchematic: React.FC<SchematicProps> = (props) => {
  return (
    <div className="schematic-card">
      <p className="schematic-title">Live Blueprint Schematic</p>
      <svg
        className="schematic-svg"
        viewBox="0 0 360 190"
        role="img"
        aria-label={`Architectural schematic for ${props.kind} estimate`}
      >
        {/* Subtle drafting grid */}
        <defs>
          <pattern
            id={`grid-${props.kind}`}
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 20 0 L 0 0 0 20"
              fill="none"
              stroke="#EAE6DC"
              strokeWidth="0.7"
            />
          </pattern>
        </defs>
        <rect width="360" height="190" fill={`url(#grid-${props.kind})`} />

        {props.kind === 'paint' && (
          <g>
            {/* Room wall elevation */}
            <rect
              x="40"
              y="32"
              width="280"
              height="116"
              fill="#EAF0F6"
              stroke="#1E3A5F"
              strokeWidth="2"
            />
            {/* Door cutout */}
            {props.doors > 0 && (
              <g>
                <rect
                  x="70"
                  y="74"
                  width="36"
                  height="74"
                  fill="#FFFFFF"
                  stroke="#C84B24"
                  strokeWidth="1.5"
                  strokeDasharray="4 2"
                />
                <text
                  x="88"
                  y="114"
                  textAnchor="middle"
                  fontSize="10"
                  fill="#C84B24"
                  fontFamily="monospace"
                >
                  {props.doors}D
                </text>
              </g>
            )}
            {/* Window cutouts */}
            {props.windows > 0 && (
              <g>
                <rect
                  x="150"
                  y="56"
                  width="54"
                  height="40"
                  fill="#FFFFFF"
                  stroke="#C84B24"
                  strokeWidth="1.5"
                  strokeDasharray="4 2"
                />
                <line
                  x1="177"
                  y1="56"
                  x2="177"
                  y2="96"
                  stroke="#C84B24"
                  strokeWidth="1"
                />
                <text
                  x="235"
                  y="80"
                  fontSize="10"
                  fill="#C84B24"
                  fontFamily="monospace"
                >
                  {props.windows} Win
                </text>
              </g>
            )}
            {/* Dimension labels */}
            <text
              x="180"
              y="170"
              textAnchor="middle"
              fontSize="11"
              fill="#1E3A5F"
              fontFamily="monospace"
            >
              {props.length} × {props.width} {props.unitLabel} · H: {props.height}{' '}
              {props.unitLabel}
            </text>
          </g>
        )}

        {props.kind === 'concrete' && (
          <g>
            {props.shape === 'column' ? (
              <g>
                <ellipse
                  cx="180"
                  cy="45"
                  rx="42"
                  ry="14"
                  fill="#D9E2EC"
                  stroke="#1E3A5F"
                  strokeWidth="2"
                />
                <path
                  d="M138 45 L138 135 A42 14 0 0 0 222 135 L222 45"
                  fill="#EAF0F6"
                  stroke="#1E3A5F"
                  strokeWidth="2"
                />
                <text
                  x="180"
                  y="172"
                  textAnchor="middle"
                  fontSize="11"
                  fill="#1E3A5F"
                  fontFamily="monospace"
                >
                  Column Ø {props.depthLabel} · H: {props.dimB} {props.unitLabel}
                </text>
              </g>
            ) : props.shape === 'steps' ? (
              <g>
                <path
                  d="M60 145 L60 115 L110 115 L110 85 L160 85 L160 55 L210 55 L210 35 L290 35 L290 145 Z"
                  fill="#D9E2EC"
                  stroke="#1E3A5F"
                  strokeWidth="2"
                />
                <text
                  x="180"
                  y="172"
                  textAnchor="middle"
                  fontSize="11"
                  fill="#1E3A5F"
                  fontFamily="monospace"
                >
                  Steps Profile · {props.depthLabel}
                </text>
              </g>
            ) : (
              <g>
                {/* Slab / Footing isometric-like cross section */}
                <polygon
                  points="50,70 110,40 310,40 250,70"
                  fill="#EAF0F6"
                  stroke="#1E3A5F"
                  strokeWidth="2"
                />
                <polygon
                  points="50,70 250,70 250,120 50,120"
                  fill="#D0DCE8"
                  stroke="#1E3A5F"
                  strokeWidth="2"
                />
                <polygon
                  points="250,70 310,40 310,90 250,120"
                  fill="#B8C9DB"
                  stroke="#1E3A5F"
                  strokeWidth="2"
                />
                <text
                  x="180"
                  y="165"
                  textAnchor="middle"
                  fontSize="11"
                  fill="#1E3A5F"
                  fontFamily="monospace"
                >
                  {props.dimA} × {props.dimB} {props.unitLabel} · Thickness:{' '}
                  {props.depthLabel}
                </text>
              </g>
            )}
          </g>
        )}

        {(props.kind === 'mulch' || props.kind === 'gravel') && (
          <g>
            {props.mode === 'circle' ? (
              <circle
                cx="180"
                cy="86"
                r="58"
                fill={props.fillTone}
                stroke="#1E3A5F"
                strokeWidth="2"
              />
            ) : (
              <rect
                x="60"
                y="36"
                width="240"
                height="98"
                rx="6"
                fill={props.fillTone}
                stroke="#1E3A5F"
                strokeWidth="2"
              />
            )}
            <text
              x="180"
              y="90"
              textAnchor="middle"
              fontSize="11"
              fontWeight="700"
              fill="#1A1D20"
              fontFamily="monospace"
            >
              Depth: {props.depthLabel}
            </text>
            <text
              x="180"
              y="168"
              textAnchor="middle"
              fontSize="11"
              fill="#1E3A5F"
              fontFamily="monospace"
            >
              {props.mode === 'rectangle'
                ? `${props.length} × ${props.width} ${props.unitLabel}`
                : props.mode === 'circle'
                  ? `Diameter: ${props.length} ${props.unitLabel}`
                  : `Direct Area Mode`}
            </text>
          </g>
        )}

        {props.kind === 'tile' && (
          <g>
            <rect
              x="60"
              y="26"
              width="240"
              height="120"
              fill="#FFFFFF"
              stroke="#1E3A5F"
              strokeWidth="2"
            />
            {[0, 1, 2, 3, 4, 5].map((col) =>
              [0, 1, 2].map((row) => (
                <rect
                  key={`${col}-${row}`}
                  x={64 + col * 39}
                  y={30 + row * 38}
                  width="36"
                  height="34"
                  fill="#EAF0F6"
                  stroke="#9FB3C8"
                  strokeWidth="1"
                />
              ))
            )}
            <text
              x="180"
              y="170"
              textAnchor="middle"
              fontSize="10.5"
              fill="#1E3A5F"
              fontFamily="monospace"
            >
              Tile {props.tileL}×{props.tileW} · {props.edgeCutText}
            </text>
          </g>
        )}

        {props.kind === 'fence' && (
          <g>
            {/* Ground line */}
            <line
              x1="20"
              y1="115"
              x2="340"
              y2="115"
              stroke="#6E757F"
              strokeWidth="1.5"
              strokeDasharray="5 3"
            />
            {/* 4 posts + 3 bays elevation */}
            {[45, 135, 225, 315].map((x) => (
              <g key={x}>
                {/* Underground concrete footing */}
                <rect
                  x={x - 10}
                  y="115"
                  width="20"
                  height="42"
                  rx="2"
                  fill="#D0DCE8"
                  stroke="#1E3A5F"
                  strokeWidth="1.2"
                />
                {/* Timber post */}
                <rect
                  x={x - 4}
                  y="32"
                  width="8"
                  height="122"
                  fill="#C84B24"
                  stroke="#1A1D20"
                  strokeWidth="1"
                />
              </g>
            ))}
            {/* Horizontal rails */}
            {Array.from({
              length: Math.min(4, Math.max(1, props.railsPerSection)),
            }).map((_, idx) => {
              const y = 44 + idx * 24;
              return (
                <line
                  key={idx}
                  x1="45"
                  y1={y}
                  x2="315"
                  y2={y}
                  stroke="#1E3A5F"
                  strokeWidth="3"
                />
              );
            })}
            <text
              x="180"
              y="178"
              textAnchor="middle"
              fontSize="10.5"
              fill="#1E3A5F"
              fontFamily="monospace"
            >
              {props.sections} sections · Above: {props.heightLabel} · Burial:{' '}
              {props.burialLabel}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};
