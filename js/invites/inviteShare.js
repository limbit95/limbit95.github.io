const QR_SCRIPT_URL = "https://cdn.jsdelivr.net/npm/qrcode@1.5.1/build/qrcode.min.js";
let qrLibraryPromise = null;

export function buildInviteUrl(token) {
  const url = new URL("/invite.html", window.location.origin);
  url.searchParams.set("token", token);
  return url.href;
}

async function loadQrLibrary() {
  if (window.QRCode?.toCanvas) return window.QRCode;
  if (!qrLibraryPromise) {
    qrLibraryPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src="${QR_SCRIPT_URL}"]`);
      const script = existing ?? document.createElement("script");
      const done = () => window.QRCode?.toCanvas
        ? resolve(window.QRCode)
        : reject(new Error("QR 라이브러리를 불러오지 못했습니다."));
      script.addEventListener("load", done, { once: true });
      script.addEventListener("error", () => reject(new Error("QR 라이브러리를 불러오지 못했습니다.")), { once: true });
      if (!existing) {
        script.src = QR_SCRIPT_URL;
        script.async = true;
        script.dataset.communityQr = "true";
        document.head.append(script);
      }
    });
  }
  return qrLibraryPromise;
}

export async function renderInviteQr(container, url, { size = 220 } = {}) {
  const QRCode = await loadQrLibrary();
  container.replaceChildren();
  const canvas = document.createElement("canvas");
  await QRCode.toCanvas(canvas, url, { width: size, margin: 1, errorCorrectionLevel: "M" });
  canvas.setAttribute("aria-label", "초대 링크 QR 코드");
  container.append(canvas);
  return canvas;
}

export async function copyInviteUrl(url) {
  await navigator.clipboard.writeText(url);
}

export async function shareInvite({ title, text, url }) {
  if (!navigator.share) return false;
  await navigator.share({ title, text, url });
  return true;
}

export function createInviteShareDialog({ token, title = "초대하기", description = "링크나 QR 코드로 바로 초대할 수 있어요." }) {
  const url = buildInviteUrl(token);
  const dialog = document.createElement("dialog");
  dialog.className = "invite-share-dialog";
  dialog.innerHTML = `
    <form method="dialog" class="invite-share-card">
      <div class="invite-share-header">
        <div><p class="invite-share-eyebrow">INVITE</p><h2 data-invite-title></h2></div>
        <button class="invite-share-close" value="close" aria-label="닫기">×</button>
      </div>
      <p class="invite-share-description"></p>
      <div class="invite-share-qr" data-invite-qr role="img" aria-label="초대 QR 코드"></div>
      <label class="invite-share-label">초대 링크<input class="invite-share-input" type="text" readonly></label>
      <p class="invite-share-message" aria-live="polite"></p>
      <div class="invite-share-actions">
        <button type="button" data-copy-invite>링크 복사</button>
        <button type="button" data-share-invite>공유</button>
      </div>
    </form>`;
  dialog.querySelector("[data-invite-title]").textContent = title;
  dialog.querySelector(".invite-share-description").textContent = description;
  dialog.querySelector(".invite-share-input").value = url;
  const message = dialog.querySelector(".invite-share-message");
  dialog.querySelector("[data-copy-invite]").addEventListener("click", async () => {
    try {
      await copyInviteUrl(url);
      message.textContent = "초대 링크를 복사했습니다.";
    } catch {
      message.textContent = "링크를 길게 눌러 복사해 주세요.";
    }
  });
  const shareButton = dialog.querySelector("[data-share-invite]");
  if (!navigator.share) shareButton.hidden = true;
  shareButton.addEventListener("click", async () => {
    try {
      await shareInvite({ title, text: description, url });
    } catch (error) {
      if (error?.name !== "AbortError") message.textContent = "공유 창을 열지 못했습니다.";
    }
  });

  return {
    dialog,
    url,
    async open() {
      if (!dialog.isConnected) document.body.append(dialog);
      dialog.showModal();
      try {
        await renderInviteQr(dialog.querySelector("[data-invite-qr]"), url);
      } catch {
        message.textContent = "QR 코드를 만들지 못했습니다. 링크 복사를 이용해 주세요.";
      }
    },
    close() {
      dialog.close();
    },
    destroy() {
      dialog.remove();
    },
  };
}
