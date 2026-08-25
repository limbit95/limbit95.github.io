import { getProfileInterests, getPublicProfiles, getSignedAvatarUrl } from "../api.js";
import { el, getErrorMessage } from "../ui.js";
import { contentDialog } from "./modal.js";
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
  const menu = el("span", {
    className: "profile-trigger__menu",
    hidden: true,
  }, [
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
  ]);

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
          profile.age_group
            ? el("span", { className: "small subtle", text: profile.age_group, style: { display: "block" } })
            : el("span", { className: "small subtle", text: "나이 정보 비공개", style: { display: "block" } }),
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

if (!window.__profileMenuCloseBound) {
  document.addEventListener("click", closeProfileMenus);
  window.__profileMenuCloseBound = true;
}
