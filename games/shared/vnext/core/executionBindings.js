import { getRegisteredGame } from "../../registry.js";
import { createExecutionScope } from "./executionScope.js";

/** Execution configuration, not a second metadata catalog or a model admission authority. */
export function createExecutionBindings({ lookupGame = getRegisteredGame, resolveModel = () => null } = {}) {
  if (typeof lookupGame !== "function" || typeof resolveModel !== "function") {
    throw new TypeError("Metadata lookup and selected model resolver must be functions.");
  }
  const bindings = new Map();
  function close(binding) {
    if (!binding) return Promise.resolve();
    binding.disposal ??= Promise.allSettled([...binding.scopes].map((scope) => scope.dispose())).then((results) => {
      const errors = results.filter((row) => row.status === "rejected").map((row) => row.reason);
      if (errors.length) throw new AggregateError(errors, "Execution binding cleanup failed.");
    });
    return binding.disposal;
  }
  function register(gameId, configuration, { replace = false } = {}) {
    const metadata = lookupGame(gameId);
    if (!metadata || metadata.id !== gameId) throw new Error(`Unknown registered game: ${gameId}`);
    if (!configuration || Object.keys(configuration).some((key) => !["modelContract", "initialize"].includes(key))) {
      throw new TypeError("Execution configuration accepts only modelContract and initialize; metadata stays in Registry.");
    }
    const { modelContract, initialize } = configuration;
    if (typeof modelContract !== "string" || !/^\S+\/[1-9]\d*$/u.test(modelContract)
      || typeof initialize !== "function") throw new TypeError("Execution requires an explicit model revision and initializer.");
    if (bindings.has(gameId) && !replace) throw new Error(`Duplicate execution binding: ${gameId}`);
    const previous = bindings.get(gameId);
    const binding = { modelContract, initialize, scopes: new Set(), disposal: null };
    bindings.set(gameId, binding);
    // Dispose invalidates synchronously; its eventual failures remain observable to the caller.
    const previousDisposal = close(previous);
    return Object.freeze({ previousDisposal, dispose() {
      if (bindings.get(gameId) === binding) bindings.delete(gameId);
      return close(binding);
    } });
  }

  async function start(gameId) {
    const binding = bindings.get(gameId);
    const metadata = lookupGame(gameId);
    if (!binding || !metadata || metadata.id !== gameId) throw new Error(`No current execution binding: ${gameId}`);
    // The default resolver admits nothing. A host must provide an actually verified selected model.
    const model = resolveModel(binding.modelContract, metadata);
    if (!model || model.contract !== binding.modelContract || typeof model.isApplicable !== "function"
      || model.isApplicable.constructor?.name === "AsyncFunction") {
      throw new Error(`Unsupported selected model: ${binding.modelContract}`);
    }
    if (bindings.get(gameId) !== binding) throw new Error("Execution binding changed during model resolution.");
    const scope = createExecutionScope({ isApplicable: (input) => {
      if (bindings.get(gameId) !== binding || lookupGame(gameId) !== metadata) return false;
      const accepted = model.isApplicable(input);
      return accepted === true && bindings.get(gameId) === binding && lookupGame(gameId) === metadata;
    } });
    binding.scopes.add(scope);
    try {
      const value = await binding.initialize(Object.freeze({ metadata, model, scope }));
      if (!scope.isCurrent() || bindings.get(gameId) !== binding || lookupGame(gameId) !== metadata) {
        throw new Error("Execution changed during initialization.");
      }
      return Object.freeze({ metadata, value, scope, dispose: scope.dispose });
    } catch (error) {
      try { await scope.dispose(); } catch (cleanupError) {
        throw new AggregateError([error, cleanupError], "Execution initialization and cleanup failed.");
      }
      throw error;
    }
  }
  return Object.freeze({ register, start });
}
