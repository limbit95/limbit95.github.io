const statusText = document.querySelector("#status-text");

if (statusText) {
  let lastAllowedMessage = statusText.textContent;
  const cardRevealRelayPattern = /\s\d+개 공개!$/;

  const observer = new MutationObserver(() => {
    const currentMessage = statusText.textContent.trim();
    if (cardRevealRelayPattern.test(currentMessage)) {
      statusText.textContent = lastAllowedMessage;
      return;
    }
    lastAllowedMessage = statusText.textContent;
  });

  observer.observe(statusText, { childList: true, characterData: true, subtree: true });
}
