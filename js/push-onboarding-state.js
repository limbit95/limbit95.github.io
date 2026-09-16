const INSTALL_MODES = new Set(["prompt", "ios-guide", "android-guide"]);

export function resolvePushOnboardingAction({
  source,
  pushOptIn = false,
  appInstallMode = "unsupported",
  pushCapability = {},
  pushEnabled = false,
  promptSeen = false,
} = {}) {
  if (promptSeen) return "none";

  const installAvailable = INSTALL_MODES.has(appInstallMode);
  const pushAvailable = Boolean(
    !pushEnabled
      && pushCapability.supported
      && !pushCapability.requiresIosInstall
      && !["denied", "unsupported"].includes(pushCapability.permission),
  );

  if (source === "first-activity") {
    if (installAvailable) return "install";
    if (pushAvailable) return "push";
    return "none";
  }

  if (source === "approved-entry") {
    if (!pushOptIn) return "none";
    if (installAvailable) return "install";
    if (appInstallMode === "installed" && pushAvailable) return "push";
  }

  return "none";
}
