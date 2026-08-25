import { getAuthState } from "../auth.js";
import { getProfileInterests, getPublicProfiles, getSignedAvatarUrl } from "../api.js";
import { sendDirectMessage } from "../notifications.js";
import { el, getErrorMessage, setBusy } from "../ui.js";
import { closeModal, contentDialog } from "./modal.js";
import { showToast } from "./toast.js";

export function createProfileAvatarTrigger(profile, {
  avatarUrl,
  size = 44,
  alt = "",
} = {}) {
  const wrapper = el("span", { className: "profile-trigger" });
  const button = el("button", {
    className: "profile-trigger__avatar-button",
    type: "button",
    "aria-label": `${profile?.display_name ?? "회원"} 프로필 메뉴 열기`,
    "aria-expanded": "false",
  }, [
    el("img", {
      className: "avatar",
      src: avatarUrl || "./assets/images/default-avatar.svg",
      alt,
      width: String(size),
      height: String(size),
    }),
  ]);
  const menuItems = [
    el("button", {
      className: "button button--secondary profile-trigger__detail-button",
      type: "button",
      text: "프로필 상세 조회",
      onClick: async () => {
        menu.hidden = true;
        button.setAttribute("aria-expanded", "false");
        await openPublicProfile(profile?.id);
      },
    }),
  ];
  const auth = getAuthState();
  if (profile?.id && profile.id !== auth.user?.id) {
    menuItems.push(el("button", {
      className: "button button--ghost profile-trigger__message-button",
      type: "button",
      text: "✉️ 쪽지 보내기",
      onClick: async () => {
        menu.hidden = true;
        button.setAttribute("aria-expanded", "false");
        await openDirectMessageComposer(profile.id, profile.display_name ?? "회원");
      },
    }));
  }
  const menu = el("span", {
    className: "profile-trigger__menu",
    hidden: true,
  }, menuItems);

  button.addEventListener("click", (event) => {
    event.stopPropagation();
    const nextOpen = menu.hidden;
    document.querySelectorAll(".profile-trigger__menu:not([hidden])").forEach((openMenu) => {
      openMenu.hidden = true;
      openMenu.parentElement?.querySelector(".profile-trigger__avatar-button")?.setAttribute("aria-expanded", "false");
    });
    menu.hidden = !nextOpen;
    button.setAttribute("aria-expanded", String(nextOpen));
  });
  menu.addEventListener("click", (event) => event.stopPropagation());

  wrapper.append(button, menu);
  return wrapper;
}

export function closeProfileMenus() {
  document.querySelectorAll(".profile-trigger__menu:not([hidden])").forEach((menu) => {
    menu.hidden = true;
    menu.parentElement?.querySelector(".profile-trigger__avatar-button")?.setAttribute("aria-expanded", "false");
  });
}

async function openDirectMessageComposer(userId, displayName) {
  if (!userId) {
    showToast("쪽지를 받을 회원을 확인할 수 없습니다.", "error");
    return;
  }

  const counter = el("span", { className: "small subtle", text: "0 / 2000" });
  const textarea = el("textarea", {
    name: "message",
    maxlength: "2000",
    required: true,
    placeholder: `${displayName}님에게 보낼 쪽지를 입력해 주세요.`,
    "aria-label": `${displayName}님에게 보낼 쪽지 내용`,
  });
  textarea.addEventListener("input", () => {
    counter.textContent = `${textarea.value.length} / 2000`;
  });

  const form = el("form", { className: "message-compose-form" }, [
    el("div", { className: "message-compose-form__recipient" }, [
      el("span", { className: "small subtle", text: "받는 사람" }),
      el("strong", { text: displayName }),
    ]),
    textarea,
    el("div", { className: "message-compose-form__footer" }, [
      counter,
      el("div", { className: "button-row" }, [
        el("button", {
          className: "button button--ghost",
          type: "button",
          text: "취소",
          onClick: () => closeModal(false),
        }),
        el("button", {
          className: "button",
          type: "submit",
          text: "쪽지 보내기",
        }),
      ]),
    ]),
  ]);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const content = textarea.value.trim();
    if (!content) {
      showToast("쪽지 내용을 입력해 주세요.", "error");
      textarea.focus();
      return;
    }
    setBusy(form, true, "전송 중…");
    try {
      await sendDirectMessage(userId, content);
      showToast(`${displayName}님에게 쪽지를 보냈습니다.`, "success");
      closeModal(true);
    } catch (error) {
      showToast(getErrorMessage(error, "쪽지를 보내지 못했습니다."), "error");
      setBusy(form, false);
    }
  });

  const modalPromise = contentDialog({
    title: "쪽지 보내기",
    content: form,
    showCloseAction: false,
  });
  window.requestAnimationFrame(() => textarea.focus());
  await modalPromise;
}

async function openPublicProfile(userId) {
  if (!userId) {
    showToast("프로필 정보를 확인할 수 없습니다.", "error");
    return;
  }
  try {
    const profiles = await getPublicProfiles(userId);
    const profile = profiles?.[0];
    if (!profile) {
      showToast("공개된 프로필 정보를 찾을 수 없습니다.", "error");
      return;
    }

    const [avatar, interestResult] = await Promise.all([
      getSignedAvatarUrl(profile.avatar_path),
      getProfileInterests(userId)
        .then((rows) => ({ rows, available: true }))
        .catch(() => ({ rows: [], available: false })),
    ]);
    const interests = interestResult.rows ?? [];

    const interestContent = interestResult.available
      ? interests.length
        ? el("div", { className: "chip-list profile-modal__interests" }, interests.map((item) => el("span", {
            className: "chip",
            text: `${item.category?.icon ?? "🌿"} ${item.category?.name ?? "활동"}`,
          })))
        : el("p", { className: "subtle", text: "설정한 관심 활동이 없습니다." })
      : el("p", { className: "subtle", text: "관심 활동 공개 정보를 불러올 수 없습니다." });

    const info = el("div", { className: "profile-modal page-stack" }, [
      el("div", { className: "profile-modal__hero" }, [
        el("img", {
          className: "avatar avatar--large profile-modal__avatar",
          src: avatar,
          alt: `${profile.display_name ?? "회원"} 프로필`,
          width: "232",
          height: "232",
        }),
        el("div", {}, [
          el("strong", { className: "profile-modal__name", text: profile.display_name ?? "회원" }),
          el("span", {
            className: "small subtle",
            text: getPublicAgeText(profile),
            style: { display: "block" },
          }),
        ]),
      ]),
      el("div", { className: "profile-modal__section" }, [
        el("strong", { text: "소개" }),
        profile.bio
          ? el("p", { className: "prose", text: profile.bio })
          : el("p", { className: "subtle", text: "등록된 소개가 없습니다." }),
      ]),
      el("div", { className: "profile-modal__section" }, [
        el("strong", { text: "관심 활동" }),
        interestContent,
      ]),
    ]);
    await contentDialog({
      title: "프로필 상세",
      content: info,
      closeText: "닫기",
    });
  } catch (error) {
    showToast(getErrorMessage(error, "프로필을 불러오지 못했습니다."), "error");
  }
}

function getPublicAgeText(profile) {
  if (profile?.age_visibility === "birth_year") {
    return profile.birth_year ? `${profile.birth_year}년생` : "나이 정보 비공개";
  }
  if (profile?.age_visibility === "age_group") {
    return profile.age_group || "나이 정보 비공개";
  }
  if (profile?.age_visibility === "private") {
    return "나이 정보 비공개";
  }

  // 공개 프로필 RPC가 age_visibility 대신 허용된 값만 내려주는 경우도 지원합니다.
  if (profile?.birth_year) return `${profile.birth_year}년생`;
  if (profile?.age_group) return profile.age_group;
  return "나이 정보 비공개";
}

if (!window.__profileMenuCloseBound) {
  document.addEventListener("click", closeProfileMenus);
  window.__profileMenuCloseBound = true;
}
