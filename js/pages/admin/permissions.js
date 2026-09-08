import {
  listAdministrators,
  setAdministratorPermissions,
} from "../../api/admin.js";
import { showToast } from "../../components/toast.js";
import { ASSIGNABLE_ADMIN_PERMISSIONS, ROLE } from "../../permissions.js";
import { el, getErrorMessage, setBusy } from "../../ui.js";

export async function renderPermissions() {
  const administrators = await listAdministrators();
  const selectable = administrators.filter((administrator) => administrator.role === ROLE.ADMIN);
  const wrapper = el("div", { className: "page-stack" }, [
    el("div", { className: "notice-box", text: "최고 관리자는 모든 영역을 사용합니다. 권한 관리와 시스템 관리는 일반 관리자에게 위임할 수 없습니다." }),
  ]);

  if (!selectable.length) {
    wrapper.append(el("div", { className: "state-box" }, el("p", { text: "권한을 설정할 일반 관리자가 없습니다." })));
    return wrapper;
  }

  const selected = el("select", { "aria-label": "관리자 선택" }, selectable.map((administrator) => el("option", {
    value: administrator.id,
    text: administrator.display_name,
  })));
  const permissions = el("div", { className: "form-grid form-grid--2" });
  const form = el("form", { className: "card page-stack" }, [
    el("div", { className: "field" }, [el("label", { text: "관리자" }), selected]),
    permissions,
    el("div", { className: "form-actions" }, el("button", { className: "button", type: "submit", text: "저장" })),
  ]);

  const renderChecks = () => {
    const administrator = selectable.find((item) => item.id === selected.value);
    const granted = new Set(administrator?.permissions ?? []);
    permissions.replaceChildren(...ASSIGNABLE_ADMIN_PERMISSIONS.map(({ key, label }) => el("label", { className: "checkbox-row" }, [
      el("input", { type: "checkbox", name: "permission", value: key, checked: granted.has(key) }),
      el("span", { text: label }),
    ])));
  };
  selected.addEventListener("change", renderChecks);
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const values = [...form.querySelectorAll("input[name='permission']:checked")].map((input) => input.value);
    setBusy(form, true, "저장 중…");
    try {
      await setAdministratorPermissions(selected.value, values);
      const administrator = selectable.find((item) => item.id === selected.value);
      if (administrator) administrator.permissions = values;
      showToast("관리자 권한을 저장했습니다.", "success");
    } catch (error) {
      showToast(getErrorMessage(error, "권한을 저장하지 못했습니다."), "error");
    } finally {
      setBusy(form, false);
    }
  });
  renderChecks();
  wrapper.append(form);
  return wrapper;
}
