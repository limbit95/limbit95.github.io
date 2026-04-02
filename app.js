const SUPABASE_URL = "https://zxwdculpycqvbcfdoxvu.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_XlcGQYXgXwTBJ5U3qwZKSA_yFhONse1";
const STORAGE_BUCKET = "mission-media";
const LETTERS_PAGE_SIZE = 10;

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

const state = {
  letters: [],
  gallery: [],
  currentUser: null,
  currentLetterPage: 1
};

document.addEventListener("DOMContentLoaded", async () => {
  if (!validateSupabaseConfig()) return;

  bindScrollNavigation();
  bindLetterEvents();
  bindGalleryEvents();
  bindModalCloseEvents();
  bindSectionObserver();
  bindAuthEvents();

  await restoreAuthState();
  await refreshAllData();
  updateAuthUI();
});

/* -----------------------------
 * 공통 유틸
 * ----------------------------- */
function validateSupabaseConfig() {
  if (
    !SUPABASE_URL ||
    !SUPABASE_ANON_KEY ||
    SUPABASE_URL.includes("여기에") ||
    SUPABASE_ANON_KEY.includes("여기에")
  ) {
    alert("app.js 상단의 SUPABASE_URL, SUPABASE_ANON_KEY 값을 먼저 입력해 주세요.");
    return false;
  }
  return true;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "-";

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const mi = String(date.getMinutes()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd} ${hh}:${mi}`;
}

function escapeHtml(str = "") {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeJs(str = "") {
  return String(str)
    .replaceAll("\\", "\\\\")
    .replaceAll("'", "\\'")
    .replaceAll('"', '\\"')
    .replaceAll("\n", "\\n")
    .replaceAll("\r", "");
}

function truncateText(str = "", length = 72) {
  const text = String(str);
  if (text.length <= length) return text;
  return `${text.slice(0, length)}...`;
}

function createObjectPreview(file) {
  if (!file) return "";
  return URL.createObjectURL(file);
}

function canManage(item) {
  return !!state.currentUser && item?.user_id === state.currentUser.id;
}

/* -----------------------------
 * Supabase 데이터
 * ----------------------------- */
async function refreshAllData() {
  await Promise.all([fetchLetters(), fetchGallery()]);
  renderLetters();
  renderGallery();
}

async function restoreAuthState() {
  const { data, error } = await supabaseClient.auth.getSession();
  if (error) {
    console.error(error);
    return;
  }

  state.currentUser = data.session?.user ?? null;
}

async function fetchLetters() {
  const { data, error } = await supabaseClient
    .from("mission_letters")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    alert(`선교 편지 조회 실패: ${error.message}`);
    return;
  }

  state.letters = data ?? [];
}

async function fetchGallery() {
  const { data, error } = await supabaseClient
    .from("mission_gallery")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    alert(`갤러리 조회 실패: ${error.message}`);
    return;
  }

  state.gallery = data ?? [];
}

async function uploadImageToStorage(file, folder) {
  if (!file) {
    return { image_path: "", image_url: "" };
  }

  const safeName = file.name.replace(/[^\w.\-가-힣]/g, "_");
  const filePath = `${folder}/${Date.now()}_${safeName}`;

  const { error: uploadError } = await supabaseClient.storage
    .from(STORAGE_BUCKET)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false
    });

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabaseClient.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(filePath);

  return {
    image_path: filePath,
    image_url: data.publicUrl
  };
}

async function removeImageFromStorage(imagePath) {
  if (!imagePath) return;

  const { error } = await supabaseClient.storage
    .from(STORAGE_BUCKET)
    .remove([imagePath]);

  if (error) {
    console.error("스토리지 파일 삭제 실패:", error);
  }
}

/* -----------------------------
 * 인증
 * ----------------------------- */
function bindAuthEvents() {
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const passwordInput = document.getElementById("adminPassword");

  loginBtn?.addEventListener("click", loginAdmin);
  logoutBtn?.addEventListener("click", logoutAdmin);

  passwordInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      loginAdmin();
    }
  });

  supabaseClient.auth.onAuthStateChange((_event, session) => {
    state.currentUser = session?.user ?? null;
    updateAuthUI();
    renderLetters();
    renderGallery();
  });
}

async function loginAdmin() {
  const email = document.getElementById("adminEmail").value.trim();
  const password = document.getElementById("adminPassword").value.trim();

  if (!email || !password) {
    alert("이메일과 비밀번호를 입력해 주세요.");
    return;
  }

  const { error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    alert(`로그인 실패: ${error.message}`);
    return;
  }

  const { data } = await supabaseClient.auth.getSession();
  state.currentUser = data.session?.user ?? null;
  updateAuthUI();
  alert("로그인되었습니다.");
}

async function logoutAdmin() {
  const { error } = await supabaseClient.auth.signOut();

  if (error) {
    alert(`로그아웃 실패: ${error.message}`);
    return;
  }

  state.currentUser = null;
  updateAuthUI();
}

function updateAuthUI() {
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const authStatus = document.getElementById("authStatus");
  const openLetterModalBtn = document.getElementById("openLetterModalBtn");
  const openGalleryModalBtn = document.getElementById("openGalleryModalBtn");

  const loggedIn = !!state.currentUser;

  loginBtn?.classList.toggle("hidden", loggedIn);
  logoutBtn?.classList.toggle("hidden", !loggedIn);

  if (authStatus) {
    authStatus.textContent = loggedIn
      ? `관리자 로그인: ${state.currentUser.email}`
      : "읽기 전용";
  }

  if (openLetterModalBtn) openLetterModalBtn.disabled = !loggedIn;
  if (openGalleryModalBtn) openGalleryModalBtn.disabled = !loggedIn;
}

/* -----------------------------
 * 스크롤 네비게이션
 * ----------------------------- */
function bindScrollNavigation() {
  const scrollButtons = document.querySelectorAll("[data-scroll]");

  scrollButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const sectionId = button.dataset.scroll;
      scrollToSection(sectionId);
    });
  });
}

function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (!section) return;

  section.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

function bindSectionObserver() {
  const sections = [...document.querySelectorAll(".page-section")];
  const navButtons = document.querySelectorAll(".nav__btn");

  const headerOffset = 140;
  const pageTopThreshold = 40;
  const bottomThreshold = 2;

  function setActive(id) {
    navButtons.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.scroll === id);
    });
  }

  function updateActiveMenu() {
    const scrollY = window.scrollY;
    const viewportHeight = window.innerHeight;
    const fullHeight = document.documentElement.scrollHeight;

    if (scrollY <= pageTopThreshold) {
      setActive("intro");
      return;
    }

    if (scrollY + viewportHeight >= fullHeight - bottomThreshold) {
      setActive("gallery");
      return;
    }

    let currentId = sections[0]?.id || "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      if (scrollY + headerOffset >= sectionTop) {
        currentId = section.id;
      }
    });

    setActive(currentId);
  }

  window.addEventListener("scroll", updateActiveMenu, { passive: true });
  window.addEventListener("resize", updateActiveMenu);

  updateActiveMenu();
}

/* -----------------------------
 * 선교 편지
 * ----------------------------- */
function bindLetterEvents() {
  const openBtn = document.getElementById("openLetterModalBtn");
  const form = document.getElementById("letterForm");
  const searchInput = document.getElementById("letterSearchInput");
  const imageInput = document.getElementById("letterImage");
  const paginationWrap = document.getElementById("lettersPagination");

  openBtn?.addEventListener("click", () => {
    if (!state.currentUser) {
      alert("관리자 로그인 후 등록할 수 있습니다.");
      return;
    }
    openLetterModal();
  });

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    await saveLetter();
  });

  searchInput?.addEventListener("input", () => {
    state.currentLetterPage = 1;
    renderLetters();
  });

  imageInput?.addEventListener("change", (e) => {
    const file = e.target.files?.[0];
    setLetterImagePreview(file ? createObjectPreview(file) : "");
  });

  paginationWrap?.addEventListener("click", (e) => {
    const button = e.target.closest("[data-page]");
    if (!button) return;

    const nextPage = Number(button.dataset.page);
    if (!nextPage || nextPage === state.currentLetterPage) return;

    state.currentLetterPage = nextPage;
    renderLetters();
  });
}

function getFilteredLetters() {
  const keyword = document.getElementById("letterSearchInput")?.value.trim().toLowerCase() || "";

  return [...state.letters].filter((item) => {
    const title = (item.title || "").toLowerCase();
    const content = (item.content || "").toLowerCase();
    return title.includes(keyword) || content.includes(keyword);
  });
}

function renderLetters() {
  const tbody = document.getElementById("lettersTableBody");
  const paginationWrap = document.getElementById("lettersPagination");
  if (!tbody || !paginationWrap) return;

  const filtered = getFilteredLetters();
  const totalPages = Math.max(1, Math.ceil(filtered.length / LETTERS_PAGE_SIZE));

  if (state.currentLetterPage > totalPages) {
    state.currentLetterPage = totalPages;
  }

  const startIndex = (state.currentLetterPage - 1) * LETTERS_PAGE_SIZE;
  const pagedLetters = filtered.slice(startIndex, startIndex + LETTERS_PAGE_SIZE);

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4">
          <div class="empty-box">등록된 선교 편지가 없습니다.</div>
        </td>
      </tr>
    `;
    paginationWrap.innerHTML = "";
    return;
  }

  tbody.innerHTML = pagedLetters
    .map((item, index) => {
      const ownerButtons = canManage(item)
        ? `
          <button type="button" class="small-btn" onclick="editLetter('${item.id}')">수정</button>
          <button type="button" class="small-btn danger" onclick="deleteLetter('${item.id}')">삭제</button>
        `
        : "";

      return `
        <tr>
          <td>${startIndex + index + 1}</td>
          <td>
            <button
              type="button"
              class="board-title-btn"
              onclick="viewLetter('${item.id}')"
            >
              ${escapeHtml(item.title)}
            </button>
            <div class="board-summary">${escapeHtml(truncateText(item.content, 90))}</div>
          </td>
          <td>${formatDate(item.created_at)}</td>
          <td>
            <div class="row-actions row-actions--letters">
              <button type="button" class="small-btn" onclick="viewLetter('${item.id}')">보기</button>
              ${ownerButtons}
            </div>
          </td>
        </tr>
      `;
    })
    .join("");

  renderLettersPagination(totalPages);
}

function renderLettersPagination(totalPages) {
  const paginationWrap = document.getElementById("lettersPagination");
  if (!paginationWrap) return;

  if (totalPages <= 1) {
    paginationWrap.innerHTML = "";
    return;
  }

  let buttonsHtml = `
    <button
      type="button"
      class="pagination-btn"
      data-page="${state.currentLetterPage - 1}"
      ${state.currentLetterPage === 1 ? "disabled" : ""}
    >이전</button>
  `;

  for (let page = 1; page <= totalPages; page += 1) {
    buttonsHtml += `
      <button
        type="button"
        class="pagination-btn ${page === state.currentLetterPage ? "active" : ""}"
        data-page="${page}"
      >${page}</button>
    `;
  }

  buttonsHtml += `
    <button
      type="button"
      class="pagination-btn"
      data-page="${state.currentLetterPage + 1}"
      ${state.currentLetterPage === totalPages ? "disabled" : ""}
    >다음</button>
  `;

  paginationWrap.innerHTML = buttonsHtml;
}

function openLetterModal(item = null) {
  const modal = document.getElementById("letterModal");
  const modalTitle = document.getElementById("letterModalTitle");
  const idEl = document.getElementById("letterId");
  const titleEl = document.getElementById("letterTitle");
  const contentEl = document.getElementById("letterContent");
  const imageEl = document.getElementById("letterImage");

  if (!modal || !modalTitle || !idEl || !titleEl || !contentEl || !imageEl) return;

  if (item) {
    modalTitle.textContent = "선교 편지 수정";
    idEl.value = item.id;
    titleEl.value = item.title || "";
    contentEl.value = item.content || "";
    imageEl.value = "";
    setLetterImagePreview(item.image_url || "");
  } else {
    modalTitle.textContent = "선교 편지 등록";
    idEl.value = "";
    titleEl.value = "";
    contentEl.value = "";
    imageEl.value = "";
    setLetterImagePreview("");
  }

  modal.classList.remove("hidden");
}

function closeLetterModal() {
  document.getElementById("letterModal")?.classList.add("hidden");
}

async function saveLetter() {
  if (!state.currentUser) {
    alert("관리자 로그인이 필요합니다.");
    return;
  }

  const id = document.getElementById("letterId").value;
  const title = document.getElementById("letterTitle").value.trim();
  const content = document.getElementById("letterContent").value.trim();
  const imageInput = document.getElementById("letterImage");
  const newFile = imageInput.files?.[0];

  if (!title || !content) {
    alert("제목과 내용을 입력해 주세요.");
    return;
  }

  try {
    if (id) {
      const existing = state.letters.find((item) => String(item.id) === String(id));
      if (!existing || !canManage(existing)) {
        alert("수정 권한이 없습니다.");
        return;
      }

      const payload = {
        title,
        content,
        updated_at: new Date().toISOString()
      };

      let oldImagePathToDelete = "";

      if (newFile) {
        const uploaded = await uploadImageToStorage(newFile, "letters");
        payload.image_path = uploaded.image_path;
        payload.image_url = uploaded.image_url;
        oldImagePathToDelete = existing.image_path || "";
      }

      const { error } = await supabaseClient
        .from("mission_letters")
        .update(payload)
        .eq("id", Number(id));

      if (error) throw error;

      if (oldImagePathToDelete) {
        await removeImageFromStorage(oldImagePathToDelete);
      }
    } else {
      let uploaded = { image_path: "", image_url: "" };

      if (newFile) {
        uploaded = await uploadImageToStorage(newFile, "letters");
      }

      const { error } = await supabaseClient
        .from("mission_letters")
        .insert({
          user_id: state.currentUser.id,
          title,
          content,
          image_path: uploaded.image_path,
          image_url: uploaded.image_url
        });

      if (error) throw error;
      state.currentLetterPage = 1;
    }

    closeLetterModal();
    await fetchLetters();
    renderLetters();
  } catch (error) {
    console.error(error);
    alert(error.message || "편지 저장 중 오류가 발생했습니다.");
  }
}

function editLetter(id) {
  const item = state.letters.find((v) => String(v.id) === String(id));
  if (!item) return;

  if (!canManage(item)) {
    alert("수정 권한이 없습니다.");
    return;
  }

  openLetterModal(item);
}

async function deleteLetter(id) {
  if (!state.currentUser) {
    alert("관리자 로그인이 필요합니다.");
    return;
  }

  const target = state.letters.find((v) => String(v.id) === String(id));
  if (!target) return;

  if (!canManage(target)) {
    alert("삭제 권한이 없습니다.");
    return;
  }

  const ok = confirm(`"${target.title}" 편지를 삭제할까요?`);
  if (!ok) return;

  try {
    const { error } = await supabaseClient
      .from("mission_letters")
      .delete()
      .eq("id", Number(id));

    if (error) throw error;

    if (target.image_path) {
      await removeImageFromStorage(target.image_path);
    }

    await fetchLetters();
    renderLetters();
  } catch (error) {
    console.error(error);
    alert(error.message || "편지 삭제 중 오류가 발생했습니다.");
  }
}

function viewLetter(id) {
  const item = state.letters.find((v) => String(v.id) === String(id));
  if (!item) return;

  const html = `
    <div style="display:flex; flex-direction:column; gap:14px;">
      <div>
        <p style="margin:0 0 6px; font-size:12px; color:#8c6748; font-weight:700; letter-spacing:0.14em;">MISSION LETTER</p>
        <h3 style="margin:0;">${escapeHtml(item.title)}</h3>
        <p style="margin:8px 0 0; color:#7a6657;">${formatDate(item.created_at)}</p>
      </div>
      ${
        item.image_url
          ? `<img src="${item.image_url}" alt="${escapeHtml(item.title)}" style="width:100%; max-height:320px; object-fit:cover; border-radius:16px;" />`
          : ""
      }
      <div style="line-height:1.8; color:#3f3126; white-space:pre-wrap;">${escapeHtml(item.content)}</div>
      <div style="display:flex; justify-content:flex-end;">
        <button class="ghost-btn" onclick="closeLetterViewer()">닫기</button>
      </div>
    </div>
  `;

  openCustomViewer(html);
}

function setLetterImagePreview(src) {
  const wrap = document.getElementById("letterImagePreviewWrap");
  const img = document.getElementById("letterImagePreview");

  if (!wrap || !img) return;

  if (src) {
    img.src = src;
    wrap.classList.remove("hidden");
  } else {
    img.src = "";
    wrap.classList.add("hidden");
  }
}

/* -----------------------------
 * 갤러리
 * ----------------------------- */
function bindGalleryEvents() {
  const openBtn = document.getElementById("openGalleryModalBtn");
  const form = document.getElementById("galleryForm");
  const searchInput = document.getElementById("gallerySearchInput");
  const imageInput = document.getElementById("galleryImage");

  openBtn?.addEventListener("click", () => {
    if (!state.currentUser) {
      alert("관리자 로그인 후 등록할 수 있습니다.");
      return;
    }
    openGalleryModal();
  });

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    await saveGallery();
  });

  searchInput?.addEventListener("input", renderGallery);

  imageInput?.addEventListener("change", (e) => {
    const file = e.target.files?.[0];
    setGalleryImagePreview(file ? createObjectPreview(file) : "");
  });
}

function renderGallery() {
  const grid = document.getElementById("galleryGrid");
  if (!grid) return;

  const keyword = document.getElementById("gallerySearchInput")?.value.trim().toLowerCase() || "";

  const filtered = [...state.gallery].filter((item) => {
    const title = (item.title || "").toLowerCase();
    const desc = (item.description || "").toLowerCase();
    return title.includes(keyword) || desc.includes(keyword);
  });

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="card empty-box">등록된 갤러리 사진이 없습니다.</div>`;
    return;
  }

  grid.innerHTML = filtered
    .map((item) => {
      const ownerButtons = canManage(item)
        ? `
          <button type="button" class="small-btn" onclick="editGallery('${item.id}')">수정</button>
          <button type="button" class="small-btn danger" onclick="deleteGallery('${item.id}')">삭제</button>
        `
        : "";

      return `
        <article class="gallery-card">
          <div
            class="gallery-card__image-wrap"
            onclick="openViewer('${escapeJs(item.image_url)}', '${escapeJs(item.title)}', '${escapeJs(item.description || "")}')"
          >
            <img class="gallery-card__image" src="${item.image_url}" alt="${escapeHtml(item.title)}" />
          </div>
          <div class="gallery-card__body">
            <h3 class="gallery-card__title">${escapeHtml(item.title)}</h3>
            <p class="gallery-card__desc">${escapeHtml(truncateText(item.description || "", 80))}</p>
            <div class="gallery-card__meta">
              <span class="meta-date">${formatDate(item.created_at)}</span>
              <div class="row-actions">
                ${ownerButtons}
              </div>
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

function openGalleryModal(item = null) {
  const modal = document.getElementById("galleryModal");
  const modalTitle = document.getElementById("galleryModalTitle");
  const idEl = document.getElementById("galleryId");
  const titleEl = document.getElementById("galleryTitle");
  const descEl = document.getElementById("galleryDescription");
  const imageEl = document.getElementById("galleryImage");

  if (!modal || !modalTitle || !idEl || !titleEl || !descEl || !imageEl) return;

  if (item) {
    modalTitle.textContent = "갤러리 수정";
    idEl.value = item.id;
    titleEl.value = item.title || "";
    descEl.value = item.description || "";
    imageEl.value = "";
    setGalleryImagePreview(item.image_url || "");
  } else {
    modalTitle.textContent = "갤러리 등록";
    idEl.value = "";
    titleEl.value = "";
    descEl.value = "";
    imageEl.value = "";
    setGalleryImagePreview("");
  }

  modal.classList.remove("hidden");
}

function closeGalleryModal() {
  document.getElementById("galleryModal")?.classList.add("hidden");
}

async function saveGallery() {
  if (!state.currentUser) {
    alert("관리자 로그인이 필요합니다.");
    return;
  }

  const id = document.getElementById("galleryId").value;
  const title = document.getElementById("galleryTitle").value.trim();
  const description = document.getElementById("galleryDescription").value.trim();
  const imageInput = document.getElementById("galleryImage");
  const newFile = imageInput.files?.[0];

  if (!title) {
    alert("제목을 입력해 주세요.");
    return;
  }

  try {
    if (id) {
      const existing = state.gallery.find((item) => String(item.id) === String(id));
      if (!existing || !canManage(existing)) {
        alert("수정 권한이 없습니다.");
        return;
      }

      const payload = {
        title,
        description,
        updated_at: new Date().toISOString()
      };

      let oldImagePathToDelete = "";

      if (newFile) {
        const uploaded = await uploadImageToStorage(newFile, "gallery");
        payload.image_path = uploaded.image_path;
        payload.image_url = uploaded.image_url;
        oldImagePathToDelete = existing.image_path || "";
      }

      const { error } = await supabaseClient
        .from("mission_gallery")
        .update(payload)
        .eq("id", Number(id));

      if (error) throw error;

      if (oldImagePathToDelete) {
        await removeImageFromStorage(oldImagePathToDelete);
      }
    } else {
      if (!newFile) {
        alert("갤러리 이미지를 첨부해 주세요.");
        return;
      }

      const uploaded = await uploadImageToStorage(newFile, "gallery");

      const { error } = await supabaseClient
        .from("mission_gallery")
        .insert({
          user_id: state.currentUser.id,
          title,
          description,
          image_path: uploaded.image_path,
          image_url: uploaded.image_url
        });

      if (error) throw error;
    }

    closeGalleryModal();
    await fetchGallery();
    renderGallery();
  } catch (error) {
    console.error(error);
    alert(error.message || "갤러리 저장 중 오류가 발생했습니다.");
  }
}

function editGallery(id) {
  const item = state.gallery.find((v) => String(v.id) === String(id));
  if (!item) return;

  if (!canManage(item)) {
    alert("수정 권한이 없습니다.");
    return;
  }

  openGalleryModal(item);
}

async function deleteGallery(id) {
  if (!state.currentUser) {
    alert("관리자 로그인이 필요합니다.");
    return;
  }

  const target = state.gallery.find((v) => String(v.id) === String(id));
  if (!target) return;

  if (!canManage(target)) {
    alert("삭제 권한이 없습니다.");
    return;
  }

  const ok = confirm(`"${target.title}" 사진을 삭제할까요?`);
  if (!ok) return;

  try {
    const { error } = await supabaseClient
      .from("mission_gallery")
      .delete()
      .eq("id", Number(id));

    if (error) throw error;

    if (target.image_path) {
      await removeImageFromStorage(target.image_path);
    }

    await fetchGallery();
    renderGallery();
  } catch (error) {
    console.error(error);
    alert(error.message || "갤러리 삭제 중 오류가 발생했습니다.");
  }
}

function setGalleryImagePreview(src) {
  const wrap = document.getElementById("galleryImagePreviewWrap");
  const img = document.getElementById("galleryImagePreview");

  if (!wrap || !img) return;

  if (src) {
    img.src = src;
    wrap.classList.remove("hidden");
  } else {
    img.src = "";
    wrap.classList.add("hidden");
  }
}

/* -----------------------------
 * 모달 / 뷰어
 * ----------------------------- */
function bindModalCloseEvents() {
  document.querySelectorAll("[data-close]").forEach((el) => {
    el.addEventListener("click", () => {
      const target = el.dataset.close;
      if (target === "letter") closeLetterModal();
      if (target === "gallery") closeGalleryModal();
      if (target === "viewer") closeViewer();
      if (target === "custom") closeCustomViewer();
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeLetterModal();
      closeGalleryModal();
      closeViewer();
      closeCustomViewer();
    }
  });
}

function openViewer(image, title, description) {
  const modal = document.getElementById("viewerModal");
  document.getElementById("viewerImage").src = image;
  document.getElementById("viewerTitle").textContent = title;
  document.getElementById("viewerDescription").textContent = description || "";
  modal.classList.remove("hidden");
}

function closeViewer() {
  document.getElementById("viewerModal")?.classList.add("hidden");
}

function openCustomViewer(innerHtml) {
  let modal = document.getElementById("customViewerModal");

  if (!modal) {
    modal = document.createElement("div");
    modal.id = "customViewerModal";
    modal.className = "modal";
    modal.innerHTML = `
      <div class="modal__backdrop" data-close="custom"></div>
      <div class="modal__content" id="customViewerBody"></div>
    `;
    document.body.appendChild(modal);

    modal
      .querySelector("[data-close='custom']")
      .addEventListener("click", closeCustomViewer);
  }

  modal.classList.remove("hidden");
  document.getElementById("customViewerBody").innerHTML = innerHtml;
}

function closeCustomViewer() {
  const modal = document.getElementById("customViewerModal");
  if (!modal) return;
  modal.classList.add("hidden");
}

function closeLetterViewer() {
  closeCustomViewer();
}
