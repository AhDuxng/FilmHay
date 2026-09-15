/**
 * The one shared ramp.
 *
 * Nothing on the site picks its own accent colour: everything that carries
 * colour indexes into these nine stops, in order, so a page reads as a single
 * spectrum rather than as parts that happened to be coloured separately.
 *
 * There is no separate text ramp here — on the #1e1e1e canvas every vivid stop
 * already clears 4.5:1, so tokens.css aliases --ramp-text-* straight to these.
 */

export const RAMP_LENGTH = 9;

const wrap = (index) => ((Math.round(index) % RAMP_LENGTH) + RAMP_LENGTH) % RAMP_LENGTH;

/** One stop of the ramp, as a CSS var reference. */
export const rampVar = (index) => `var(--ramp-${wrap(index)})`;
