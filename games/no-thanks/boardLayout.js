export function orderBoardPlayers(players, currentUserId) {
  const ordered = [...players].sort((left, right) => left.seat - right.seat);
  if (ordered.length === 0) return [];

  const viewerId = String(currentUserId ?? "");
  const viewerIndex = ordered.findIndex((player) => String(player.id) === viewerId);
  const startIndex = viewerIndex >= 0 ? viewerIndex : 0;

  return [
    ...ordered.slice(startIndex),
    ...ordered.slice(0, startIndex),
  ];
}

export function getBoardSeatCoordinates(index, total) {
  const count = Math.max(Number(total) || 0, 1);
  const safeIndex = Math.max(0, Math.min(Number(index) || 0, count - 1));
  const angle = (Math.PI / 2) + ((Math.PI * 2 * safeIndex) / count);
  const centerX = 50;
  const radiusX = 40;
  const radiusY = 39;

  return Object.freeze({
    left: centerX + (Math.cos(angle) * radiusX),
    top: 50 + (Math.sin(angle) * radiusY),
  });
}

export function getNoThanksCardTone(value) {
  const numeric = Number(value);
  if (!Number.isInteger(numeric) || numeric <= 10) return "blue";
  if (numeric <= 18) return "teal";
  if (numeric <= 26) return "yellow";
  return "pink";
}

export function getNoThanksHandOverlap(cardCount) {
  const count = Math.max(0, Math.floor(Number(cardCount) || 0));
  if (count <= 4) return 0;
  if (count === 5) return -6;
  if (count === 6) return -10;
  if (count === 7) return -14;
  if (count === 8) return -18;
  if (count === 9) return -22;
  if (count === 10) return -26;
  if (count === 11) return -30;
  if (count === 12) return -34;
  if (count === 13) return -38;
  if (count === 14) return -42;
  if (count === 15) return -46;
  if (count === 16) return -50;
  if (count === 17) return -54;
  if (count === 18) return -58;
  if (count === 19) return -62;
  if (count === 20) return -66;
  if (count === 21) return -70;
  if (count === 22) return -72;
  if (count === 23) return -73;
  return -74;
}

function getNoThanksHandRunMarginForOverlap(overlap) {
  return Math.min(16, overlap + 28);
}

export function getNoThanksHandRunMargin(cardCount) {
  return getNoThanksHandRunMarginForOverlap(getNoThanksHandOverlap(cardCount));
}

export function getNoThanksHandMargins(cardCount, {
  availableWidth,
  cardWidth,
  runStartCount = 0,
} = {}) {
  const count = Math.max(0, Math.floor(Number(cardCount) || 0));
  if (count <= 1) {
    return Object.freeze({ overlap: 0, runMargin: 0 });
  }

  const fallbackOverlap = getNoThanksHandOverlap(count);
  const fallbackRunMargin = getNoThanksHandRunMargin(count);
  const width = Number(availableWidth);
  const card = Number(cardWidth);
  if (!Number.isFinite(width) || width <= 0 || !Number.isFinite(card) || card <= 0) {
    return Object.freeze({
      overlap: fallbackOverlap,
      runMargin: fallbackRunMargin,
    });
  }

  const transitions = count - 1;
  const runStarts = Math.max(
    0,
    Math.min(transitions, Math.floor(Number(runStartCount) || 0)),
  );
  const regularTransitions = transitions - runStarts;
  const minimumVisibleStep = Math.min(card, 14);
  const minimumOverlap = Math.max(-74, minimumVisibleStep - card);

  const totalWidthFor = (overlap) => {
    const runMargin = getNoThanksHandRunMarginForOverlap(overlap);
    return (count * card)
      + (regularTransitions * overlap)
      + (runStarts * runMargin);
  };

  let overlap = 0;
  while (overlap > minimumOverlap && totalWidthFor(overlap) > width) {
    overlap = Math.max(minimumOverlap, overlap - 5);
  }

  return Object.freeze({
    overlap,
    runMargin: getNoThanksHandRunMarginForOverlap(overlap),
  });
}


export function getNoThanksResultHandOverlap(cardCount) {
  const count = Math.max(0, Number(cardCount) || 0);
  if (count <= 5) return -2;
  if (count <= 9) return -7;
  if (count <= 12) return -14;
  if (count <= 15) return -20;
  if (count <= 18) return -26;
  if (count <= 21) return -32;
  return -36;
}

export function getNoThanksResultHandMargins(cardCount, {
  availableWidth,
  cardWidth,
  runStartCount = 0,
} = {}) {
  const count = Math.max(0, Math.floor(Number(cardCount) || 0));
  const baseOverlap = getNoThanksResultHandOverlap(count);
  const baseRunMargin = count <= 9
    ? 10
    : (count <= 12 ? 4 : Math.min(-4, baseOverlap + 8));

  if (count <= 1) {
    return Object.freeze({ overlap: 0, runMargin: 0 });
  }

  const width = Number(availableWidth);
  const card = Number(cardWidth);
  if (!Number.isFinite(width) || width <= 0 || !Number.isFinite(card) || card <= 0) {
    return Object.freeze({ overlap: baseOverlap, runMargin: baseRunMargin });
  }

  const transitions = count - 1;
  const runStarts = Math.max(
    0,
    Math.min(transitions, Math.floor(Number(runStartCount) || 0)),
  );
  const regularTransitions = transitions - runStarts;
  const baseTotalWidth = (count * card)
    + (regularTransitions * baseOverlap)
    + (runStarts * baseRunMargin);

  if (baseTotalWidth <= width) {
    return Object.freeze({ overlap: baseOverlap, runMargin: baseRunMargin });
  }

  const transitionSpace = Math.max(0, width - card);
  const baseRegularStep = Math.max(0, card + baseOverlap);
  const baseRunStep = Math.max(0, card + baseRunMargin);
  const desiredRunBonus = Math.max(0, baseRunStep - baseRegularStep);
  const averageStep = transitionSpace / transitions;
  const minimumVisibleStep = Math.min(6, Math.max(0, averageStep));

  let regularStep = runStarts > 0
    ? (transitionSpace - (runStarts * desiredRunBonus)) / transitions
    : averageStep;
  if (!Number.isFinite(regularStep)) regularStep = 0;

  regularStep = Math.min(baseRegularStep, Math.max(minimumVisibleStep, regularStep));
  const remainingForRunBonus = Math.max(
    0,
    transitionSpace - (regularStep * transitions),
  );
  const runBonus = runStarts > 0
    ? Math.min(desiredRunBonus, remainingForRunBonus / runStarts)
    : 0;
  const runStep = Math.min(baseRunStep, regularStep + runBonus);

  return Object.freeze({
    overlap: regularStep - card,
    runMargin: runStep - card,
  });
}


export function getNoThanksVisibleChipCount(count, {
  compact = false,
} = {}) {
  const numeric = Number(count);
  if (!Number.isFinite(numeric) || numeric <= 0) return 0;
  return Math.min(Math.floor(numeric), compact ? 7 : 16);
}


export function getNoThanksDeckVisualCount(remaining) {
  const count = Math.max(0, Math.floor(Number(remaining) || 0));
  if (count <= 1) return count;
  if (count <= 3) return 2;
  if (count <= 7) return 3;
  if (count <= 11) return 4;
  if (count <= 15) return 5;
  if (count <= 19) return 6;
  return 7;
}
