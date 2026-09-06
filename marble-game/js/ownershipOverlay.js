import * as THREE from "three";
import {
  CLASSIC_CAMERA_PROFILE,
  createOrthographicBounds,
  createSquareRingLayout,
} from "./renderer/threeClassicPrototype.js";

const OWNER_ACCENTS = Object.freeze(["#61b8ff", "#ff8c9f", "#ffd55a", "#8bd48a"]);

function ownerSeatFromTile(tile) {
  const seat = Number(tile?.dataset?.ownerSeat);
  return Number.isInteger(seat) && seat >= 0 && seat < OWNER_ACCENTS.length ? seat : null;
}

function createProjectionCamera(width, height) {
  const bounds = createOrthographicBounds(width, height);
  const camera = new THREE.OrthographicCamera(
    bounds.left,
    bounds.right,
    bounds.top,
    bounds.bottom,
    0.1,
    100,
  );
  camera.position.set(...CLASSIC_CAMERA_PROFILE.position);
  camera.lookAt(...CLASSIC_CAMERA_PROFILE.target);
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld(true);
  return camera;
}

function projectOwnershipPoint(entry, camera) {
  const localOffset = new THREE.Vector3(0, 0, -(entry.tileDepth * 0.38));
  localOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), entry.rotationY);
  const world = new THREE.Vector3(
    entry.x + localOffset.x,
    entry.y + 0.62,
    entry.z + localOffset.z,
  );
  world.project(camera);
  return Object.freeze({
    left: ((world.x + 1) / 2) * 100,
    top: ((1 - world.y) / 2) * 100,
  });
}

export function createOwnershipOverlay({ stageElement, stateBoardElement } = {}) {
  if (!stageElement || !stateBoardElement) return null;

  const overlay = document.createElement("div");
  overlay.className = "ownership-overlay";
  overlay.setAttribute("aria-hidden", "true");

  let renderFrame = null;
  let disposed = false;

  function ensureOverlay() {
    if (disposed || overlay.parentElement === stageElement) return;
    stageElement.append(overlay);
  }

  function renderOwnership() {
    renderFrame = null;
    if (disposed) return;
    ensureOverlay();

    const tiles = [...stateBoardElement.querySelectorAll(".board-tile")];
    const width = Math.max(1, stageElement.clientWidth);
    const height = Math.max(1, stageElement.clientHeight);
    if (!tiles.length || width <= 1 || height <= 1) {
      overlay.replaceChildren();
      return;
    }

    const layout = createSquareRingLayout(tiles.map((_, index) => ({ id: `overlay-${index}` })));
    const camera = createProjectionCamera(width, height);
    const badges = [];

    tiles.forEach((tile, index) => {
      const seat = ownerSeatFromTile(tile);
      if (seat === null) return;
      const entry = layout[index];
      if (!entry) return;
      const position = projectOwnershipPoint(entry, camera);
      const badge = document.createElement("span");
      badge.className = "ownership-badge";
      badge.textContent = `P${seat + 1}`;
      badge.style.left = `${position.left}%`;
      badge.style.top = `${position.top}%`;
      badge.style.setProperty("--owner-accent", OWNER_ACCENTS[seat]);
      const title = tile.querySelector(".board-tile__title")?.textContent?.trim();
      badge.title = title ? `${title} · P${seat + 1} 소유` : `P${seat + 1} 소유`;
      badges.push(badge);
    });

    overlay.replaceChildren(...badges);
  }

  function scheduleRender() {
    if (disposed || renderFrame !== null) return;
    renderFrame = requestAnimationFrame(renderOwnership);
  }

  const boardObserver = new MutationObserver(scheduleRender);
  boardObserver.observe(stateBoardElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["data-owner-seat"],
  });

  const stageObserver = new MutationObserver(() => {
    ensureOverlay();
    scheduleRender();
  });
  stageObserver.observe(stageElement, { childList: true });

  const resizeObserver = typeof ResizeObserver !== "undefined" ? new ResizeObserver(scheduleRender) : null;
  resizeObserver?.observe(stageElement);
  window.addEventListener("resize", scheduleRender);

  ensureOverlay();
  scheduleRender();

  return Object.freeze({
    render: scheduleRender,
    dispose() {
      disposed = true;
      if (renderFrame !== null) cancelAnimationFrame(renderFrame);
      boardObserver.disconnect();
      stageObserver.disconnect();
      resizeObserver?.disconnect();
      window.removeEventListener("resize", scheduleRender);
      overlay.remove();
    },
  });
}

const stageElement = document.querySelector("[data-three-stage]");
const stateBoardElement = document.querySelector("[data-classic-board]");
if (stageElement && stateBoardElement) {
  createOwnershipOverlay({ stageElement, stateBoardElement });
}
