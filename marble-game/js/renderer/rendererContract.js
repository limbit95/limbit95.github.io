const REQUIRED_METHODS = ["mount", "renderState", "playEvent", "dispose"];

export function createRendererContract(renderer) {
  if (!renderer || typeof renderer !== "object") {
    throw new TypeError("Renderer must be an object.");
  }

  REQUIRED_METHODS.forEach((methodName) => {
    if (typeof renderer[methodName] !== "function") {
      throw new TypeError(`Renderer is missing required method: ${methodName}`);
    }
  });

  return Object.freeze({
    mount: renderer.mount.bind(renderer),
    renderState: renderer.renderState.bind(renderer),
    playEvent: renderer.playEvent.bind(renderer),
    dispose: renderer.dispose.bind(renderer),
  });
}
