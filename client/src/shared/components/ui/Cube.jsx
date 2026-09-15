import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { rampVar } from '@/shared/lib/ramp';

const FACES = ['U', 'R', 'F', 'D', 'L', 'B'];

/* Six of the nine stops, spread across the ramp, so the cube reads as the same
   spectrum as everything else on the page. */
const FACE_RAMP = [0, 1, 3, 5, 7, 8];

/* Reading-order facelet indices after a clockwise turn of the face itself. */
const CW = [6, 3, 0, 7, 4, 1, 8, 5, 2];

/* A turn also cycles the four neighbouring strips. Faking a cube with a timed
   colour swap looks wrong because the colours never actually resolve; here a
   scramble is N real turns and the solve is their exact inverse replayed
   backwards, so it always lands on six clean faces. */
const STRIPS = {
  U: [['F', [0, 1, 2]], ['L', [0, 1, 2]], ['B', [0, 1, 2]], ['R', [0, 1, 2]]],
  D: [['F', [6, 7, 8]], ['R', [6, 7, 8]], ['B', [6, 7, 8]], ['L', [6, 7, 8]]],
  R: [['F', [2, 5, 8]], ['U', [2, 5, 8]], ['B', [6, 3, 0]], ['D', [2, 5, 8]]],
  L: [['F', [0, 3, 6]], ['D', [0, 3, 6]], ['B', [8, 5, 2]], ['U', [0, 3, 6]]],
  F: [['U', [6, 7, 8]], ['R', [0, 3, 6]], ['D', [2, 1, 0]], ['L', [8, 5, 2]]],
  B: [['U', [2, 1, 0]], ['L', [0, 3, 6]], ['D', [6, 7, 8]], ['R', [8, 5, 2]]],
};

const SOLVED = Object.freeze(
  FACES.reduce((state, face, index) => {
    state[face] = Array.from({ length: 9 }, () => index);
    return state;
  }, {})
);

function turn(state, face) {
  const next = {};
  FACES.forEach((name) => {
    next[name] = state[name].slice();
  });

  next[face] = CW.map((index) => state[face][index]);

  const cycle = STRIPS[face];
  for (let step = 0; step < 4; step += 1) {
    const [fromFace, fromIndices] = cycle[step];
    const [toFace, toIndices] = cycle[(step + 1) % 4];

    for (let k = 0; k < 3; k += 1) {
      next[toFace][toIndices[k]] = state[fromFace][fromIndices[k]];
    }
  }

  return next;
}

/* The inverse of a quarter turn is the same turn three more times. Deriving it
   this way means scramble and solve can never drift apart. */
const inverse = (state, face) => turn(turn(turn(state, face), face), face);

function scrambleSequence(length) {
  const moves = [];
  let previous = '';

  while (moves.length < length) {
    const face = FACES[Math.floor(Math.random() * FACES.length)];
    if (face === previous) {
      continue;
    }
    previous = face;
    moves.push(face);
  }

  return moves;
}

const FACE_TRANSFORM = {
  F: 'translateZ(HALFpx)',
  B: 'rotateY(180deg) translateZ(HALFpx)',
  R: 'rotateY(90deg) translateZ(HALFpx)',
  L: 'rotateY(-90deg) translateZ(HALFpx)',
  U: 'rotateX(90deg) translateZ(HALFpx)',
  D: 'rotateX(-90deg) translateZ(HALFpx)',
};

/**
 * A real Rubik's cube: six faces of nine stickers that scramble and solve
 * themselves. Used as the page loader and as the logo.
 *
 * A 3D transform or a clip-path on ANY ancestor flattens `preserve-3d` and
 * crops the faces that stand out of the box, so never wrap this in an
 * animating container — the padding around it is deliberate.
 */
const Cube = memo(function Cube({ size = 56, animated = true, className = '' }) {
  const [state, setState] = useState(SOLVED);
  const timerRef = useRef(0);

  const faceTransforms = useMemo(() => {
    const half = size / 2;
    return Object.fromEntries(
      Object.entries(FACE_TRANSFORM).map(([face, value]) => [face, value.replaceAll('HALF', String(half))])
    );
  }, [size]);

  useEffect(() => {
    if (!animated) {
      setState(SOLVED);
      return undefined;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    let cancelled = false;
    let current = SOLVED;

    const run = () => {
      // Always scramble from solved: a sequence cut short by the tab being
      // hidden would otherwise leave the cube resting on a state its inverses
      // never fully undo.
      current = SOLVED;
      setState(SOLVED);

      const moves = scrambleSequence(12);
      const steps = [
        ...moves.map((face) => ({ face, undo: false })),
        ...moves.slice().reverse().map((face) => ({ face, undo: true })),
      ];

      let cursor = 0;

      const advance = () => {
        if (cancelled) {
          return;
        }

        if (cursor >= steps.length) {
          // Rest on the solved cube before scrambling again.
          timerRef.current = window.setTimeout(run, 1400);
          return;
        }

        const { face, undo } = steps[cursor];
        current = undo ? inverse(current, face) : turn(current, face);
        cursor += 1;
        setState(current);

        timerRef.current = window.setTimeout(advance, cursor === moves.length ? 900 : 300);
      };

      advance();
    };

    // A cube turning in a hidden tab is pure battery.
    const onVisibility = () => {
      if (document.hidden) {
        window.clearTimeout(timerRef.current);
      } else if (!cancelled) {
        timerRef.current = window.setTimeout(run, 400);
      }
    };

    run();
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelled = true;
      window.clearTimeout(timerRef.current);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [animated]);

  return (
    <div className={`cube-scene ${className}`} style={{ width: size * 2, height: size * 2 }} aria-hidden="true">
      <div className={animated ? 'cube' : 'cube cube-static'} style={{ width: size, height: size }}>
        {FACES.map((face) => (
          <div
            key={face}
            className="cube-face"
            style={{ width: size, height: size, transform: faceTransforms[face] }}
          >
            {state[face].map((value, index) => (
              <span
                key={index}
                className="cube-sticker"
                style={{ backgroundColor: rampVar(FACE_RAMP[value]) }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
});

export default Cube;
