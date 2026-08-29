export function setHiddenIfChanged(element, hidden) {
  if (!element) return false;

  const nextHidden = Boolean(hidden);
  if (element.hidden === nextHidden) return false;

  element.hidden = nextHidden;
  return true;
}
