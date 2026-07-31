import { getAuthState, refreshAuthContext } from "../auth.js";
import {
  getProfileInterests,
  getSignedAvatarUrl,
  listCategories,
  listMyParticipations,
  replaceProfileInterests,
  updateProfile,
  uploadAvatar,
} from "../api.js";
import { createActivityCard } from "../components/activityCard.js";
import { showToast } from "../components/toast.js";
import {
  AGE_VISIBILITY_LABEL,
  ALLOWED_AVATAR_TYPES,
  MAX_AVATAR_BYTES,
  PARTICIPATION_STATUS_LABEL,
  PROFILE_STATUS_LABEL,
} from "../constants.js";
import {
  el,
  formatDate,
  getErrorMessage,
  pageContainer,
  seoulDateString,
  setBusy,
} from "../ui.js";
import { clearFieldErrors, setFieldError, validateBirthYear, valueInRange } from "../validators.js";

export async function renderMyPage() {
  const auth = getAuthState();
  const [avatar, interests, participations, categories] = await Promise.all([
    getSignedAvatarUrl(auth.profile.avatar_path),
    getProfileInterests(auth.user.id),
    listMyParticipations(auth.user.id),
    listCategories(),
  ]);
  const categoryMap = new Map(categories.map((category) => [Number(category.id), category]));
  const today = seoulDateString();
  const upcoming = participations.filter((item) => item.event?.event_date >= today && ["scheduled", "closed"].includes(item.event?.status));
  const upcomingIds = new Set(upcoming.map((item) => item.event?.id));
  const completed = participations.filter((item) => !upcomingIds.has(item.event?.id));
  const root = pageContainer(
    el("section", { className: "card profile-hero" }, [
      el("img", { className: "avatar avatar--large", src: avatar, alt: `${auth.profile.display_name} 프로필`, width: "104", height: "104" }),
      el("div", {}, [
        el("h1", { className: "page-title", text: auth.profile.display_name }),
        el("p", { className: "subtle", text: auth.user.email ?? "" }),
      ]),
      el("div", { className: "chip-list" }, [
        el("span", { className: "status-badge", text: `✓ ${PROFILE_STATUS_LABEL[auth.profile.status]}` }),
        auth.isAdmin ? el("span", { className: "status-badge status-badge--warning", text: "🛠️ 관리자" }) : null,
        ...[...auth.managerCategoryIds].map((categoryId) => {
          const category = categoryMap.get(Number(categoryId));
          return el("span", { className: "status-badge", text: `🌿 ${category?.name ?? "활동"} 담당` });
        }),
      ]),
      auth.profile.bio ? el("p", { className: "prose", text: auth.profile.bio }) : el("p", { className: "subtle", text: "프로필 소개를 작성해 보세요." }),
      el("a", { className: "button button--secondary", href: "#/mypage/edit", text: "✏️ 프로필 수정" }),
    ]),
    el("section", { className: "stat-grid", "aria-label": "내 활동 요약" }, [
      stat("예정 활동", upcoming.filter((item) => item.status === "joined").length),
      stat("대기 활동", upcoming.filter((item) => item.status === "waitlisted").length),
      stat("지난 활동", completed.length),
      stat("관심 분야", interests.length),
    ]),
    el("section", { className: "card page-stack" }, [
      el("h2", { className: "section-title", text: "관심 활동" }),
      interests.length
        ? el("div", { className: "chip-list" }, interests.map((item) => el("span", {
            className: "chip",
            text: `${item.category?.icon ?? "🌿"} ${item.category?.name ?? "활동"}`,
          })))
        : el("p", { className: "subtle", text: "선택한 관심 활동이 없습니다." }),
    ]),
  );
  const participationSection = el("section", { className: "page-stack" }, [
    el("div", { className: "page-header" }, [
      el("h2", { className: "section-title", text: "내 참여 활동" }),
      el("a", { className: "button button--ghost", href: "#/activities", text: "활동 찾기" }),
    ]),
  ]);
  if (!upcoming.length) {
    participationSection.append(el("div", { className: "card" }, [
      el("p", { className: "subtle", text: "예정된 참여 활동이 없습니다." }),
    ]));
  } else {
    const grid = el("div", { className: "activity-grid" });
    upcoming.forEach((item) => {
      grid.append(createActivityCard(item.event, { userId: auth.user.id, compact: true }));
    });
    participationSection.append(grid);
  }
  const history = el("section", { className: "card page-stack" }, [
    el("h2", { className: "section-title", text: "지난 활동" }),
  ]);
  if (!completed.length) {
    history.append(el("p", { className: "subtle", text: "지난 활동 기록이 없습니다." }));
  } else {
    completed.slice(0, 10).forEach((item) => {
      history.append(el("a", { className: "post-row", href: `#/activities/${item.event.id}` }, [
        el("strong", { text: item.event.title }),
        el("span", { className: "small subtle", text: `${formatDate(item.event.event_date)} · ${PARTICIPATION_STATUS_LABEL[item.status]}` }),
      ]));
    });
  }
  root.append(participationSection, history);
  return root;
}

export async function renderProfileEdit() {
  const auth = getAuthState();
  const [categories, interests, currentAvatar] = await Promise.all([
    listCategories({ activeOnly: true }),
    getProfileInterests(auth.user.id),
    getSignedAvatarUrl(auth.profile.avatar_path),
  ]);
  const selectedInterests = new Set(interests.map((item) => Number(item.category_id)));
  const form = el("form", { className: "card form-grid form-grid--2", novalidate: true });
  const preview = el("img", {
    className: "image-preview",
    src: currentAvatar,
    alt: "현재 프로필 이미지",
    width: "120",
    height: "120",
  });
  const fileInput = el("input", {
    id: "profile-avatar",
    name: "avatar",
    type: "file",
    accept: "image/jpeg,image/png,image/webp",
  });
  fileInput.addEventListener("change", () => {
    const file = fileInput.files?.[0];
    if (!file) return;
    if (!ALLOWED_AVATAR_TYPES.includes(file.type) || file.size > MAX_AVATAR_BYTES) {
      fileInput.value = "";
      showToast("JPG, PNG, WEBP 파일을 3MB 이하로 선택해 주세요.", "error");
      return;
    }
    preview.src = URL.createObjectURL(file);
  });
  form.append(
    el("div", { className: "field field--full", style: { justifyItems: "start" } }, [
      el("label", { for: "profile-avatar", text: "프로필 이미지" }),
      preview,
      fileInput,
      el("p", { className: "field-help", text: "JPG, PNG, WEBP · 최대 3MB" }),
    ]),
    inputField("display_name", "표시 이름", "text", auth.profile.display_name, { maxlength: "50", required: true }),
    inputField("birth_year", "출생연도", "number", auth.profile.birth_year ?? "", { min: "1900", max: "2100" }),
    el("div", { className: "field" }, [
      el("label", { for: "profile-age_visibility", text: "나이 공개 범위" }),
      el("select", { id: "profile-age_visibility", name: "age_visibility" }, Object.entries(AGE_VISIBILITY_LABEL).map(([value, label]) => el("option", {
        value,
        text: label,
        selected: auth.profile.age_visibility === value,
      }))),
    ]),
    el("div", { className: "field field--full" }, [
      el("label", { for: "profile-bio", text: "소개" }),
      el("textarea", { id: "profile-bio", name: "bio", maxlength: "500", text: auth.profile.bio ?? "", placeholder: "좋아하는 활동이나 간단한 소개를 적어 주세요." }),
      el("p", { className: "field-error", dataset: { errorFor: "bio" }, "aria-live": "polite" }),
    ]),
    el("fieldset", { className: "field field--full" }, [
      el("legend", { className: "field-label", text: "관심 활동" }),
      el("div", { className: "chip-list" }, categories.map((category) => el("label", { className: "checkbox chip" }, [
        el("input", {
          type: "checkbox",
          name: "interests",
          value: category.id,
          checked: selectedInterests.has(Number(category.id)),
        }),
        el("span", { text: `${category.icon} ${category.name}` }),
      ]))),
    ]),
    el("div", { className: "notice-box field--full", text: "회원 권한과 이용 상태는 프로필에서 변경할 수 없으며 관리자 절차로만 처리됩니다." }),
    el("div", { className: "form-actions field--full" }, [
      el("a", { className: "button button--ghost", href: "#/mypage", text: "취소" }),
      el("button", { className: "button button--coral", type: "submit", text: "프로필 저장" }),
    ]),
  );
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearFieldErrors(form);
    let valid = true;
    if (!valueInRange(form.display_name.value, 1, 50)) {
      setFieldError(form, "display_name", "표시 이름은 1~50자로 입력해 주세요.");
      valid = false;
    }
    if (!validateBirthYear(form.birth_year.value)) {
      setFieldError(form, "birth_year", "올바른 출생연도를 입력해 주세요.");
      valid = false;
    }
    if (form.bio.value.length > 500) {
      setFieldError(form, "bio", "소개는 500자 이하로 입력해 주세요.");
      valid = false;
    }
    const file = fileInput.files?.[0];
    if (file && (!ALLOWED_AVATAR_TYPES.includes(file.type) || file.size > MAX_AVATAR_BYTES)) {
      showToast("프로필 이미지 형식과 크기를 확인해 주세요.", "error");
      valid = false;
    }
    if (!valid) return;
    setBusy(form, true, "저장 중…");
    try {
      await updateProfile(auth.user.id, {
        display_name: form.display_name.value.trim(),
        birth_year: form.birth_year.value ? Number(form.birth_year.value) : null,
        age_visibility: form.age_visibility.value,
        bio: form.bio.value.trim(),
      });
      const categoryIds = [...form.querySelectorAll('[name="interests"]:checked')].map((input) => Number(input.value));
      await replaceProfileInterests(auth.user.id, categoryIds);
      if (file) await uploadAvatar(auth.user.id, file, auth.profile.avatar_path);
      await refreshAuthContext();
      showToast("프로필을 저장했습니다.", "success");
      window.location.hash = "#/mypage";
    } catch (error) {
      showToast(getErrorMessage(error, "프로필 저장에 실패했습니다."), "error");
    } finally {
      setBusy(form, false);
    }
  });
  return pageContainer(
    el("div", { className: "page-header" }, [
      el("div", {}, [
        el("p", { className: "eyebrow", text: "MY PROFILE" }),
        el("h1", { className: "page-title", text: "프로필 수정" }),
      ]),
    ]),
    form,
  );
}

function stat(label, value) {
  return el("div", { className: "stat-card" }, [
    el("strong", { text: value }),
    el("span", { className: "small subtle", text: label }),
  ]);
}

function inputField(name, label, type, value, attributes = {}) {
  return el("div", { className: "field" }, [
    el("label", { for: `profile-${name}`, text: label }),
    el("input", { id: `profile-${name}`, name, type, value, ...attributes }),
    el("p", { className: "field-error", dataset: { errorFor: name }, "aria-live": "polite" }),
  ]);
}
