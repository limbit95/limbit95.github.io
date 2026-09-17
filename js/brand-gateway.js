(() => {
  const PUBLIC_ROUTES = new Set(["/gateway", "/like", "/value"]);
  const root = document.getElementById("brand-gateway-root");
  if (!root) return;

  const scenes = [
    { key: "like", number: "01", title: "LIKE", korean: "같이 닮다", meta: "WORSHIP · WORD · FORMATION", lead: "예배와 말씀 안에서 같은 방향을 바라보고, 삶의 모양을 천천히 닮아갑니다.", href: "#/like" },
    { key: "value", number: "02", title: "VALUE", korean: "가치를 나누다", meta: "STORY · THOUGHT · PRACTICE", lead: "사람의 이야기와 생각을 기록하고, 중요하게 여기는 가치를 오늘의 실천으로 이어갑니다.", href: "#/value" },
    { key: "together", number: "03", title: "TOGETHER", korean: "같이 하다", meta: "COMMUNITY · ACTIVITY · TODAY", lead: "소식과 모임, 활동을 통해 서로의 오늘에 자리를 내어주며 함께 살아갑니다.", href: "#/login" },
  ];

  const details = {
    like: { label: "01 / LIKE", title: "같이 닮다", word: "LIKE", lead: "예배와 말씀 안에서 예수님의 마음을 배우고, 청파가 걸어온 신앙의 방향을 오늘의 삶으로 이어갑니다.", items: [["01", "청파의 정신", "약자의 곁에 서고 평화를 사랑하는 공동체의 방향"], ["02", "예배", "함께 드린 예배와 메시지를 다시 만나는 기록"], ["03", "말씀", "묵상과 질문을 일상의 선택으로 이어가는 콘텐츠"]], next: "#/value", nextLabel: "02 / VALUE" },
    value: { label: "02 / VALUE", title: "가치를 나누다", word: "VALUE", lead: "사람의 경험과 생각을 기록하고, 돌봄과 평화를 구체적인 프로젝트와 실천으로 확장합니다.", items: [["01", "이야기", "목회자와 청년들의 삶과 신앙을 담는 인터뷰"], ["02", "칼럼", "공동체와 세상을 함께 바라보는 질문과 관점"], ["03", "프로젝트", "봉사와 캠페인, 연대로 이어지는 실제 행동"]], next: "#/login", nextLabel: "03 / TOGETHER" },
  };

  const pathFromHash = (hash = window.location.hash) => {
    const raw = hash.replace(/^#/, "") || "/gateway";
    return (`/${raw.split("?")[0]}`).replace(/\/+/g, "/").replace(/\/$/, "") || "/";
  };

  const el = (tag, attrs = {}, children = []) => {
    const node = document.createElement(tag);
    Object.entries(attrs).forEach(([key, value]) => {
      if (value == null || value === false) return;
      if (key === "className") node.className = value;
      else if (key === "text") node.textContent = String(value);
      else if (key === "dataset") Object.assign(node.dataset, value);
      else if (value === true) node.setAttribute(key, "");
      else node.setAttribute(key, String(value));
    });
    (Array.isArray(children) ? children : [children]).forEach((child) => {
      if (child == null || child === false) return;
      node.append(child instanceof Node ? child : document.createTextNode(String(child)));
    });
    return node;
  };

  function header(compact = false) {
    return el("header", { className: `brand-r-header${compact ? " brand-r-header--compact" : ""}` }, [
      el("a", { className: "brand-r-logo", href: "#/gateway", "aria-label": "청파 같이 첫 화면" }, [
        el("img", { src: "./assets/images/logo.svg", alt: "", width: "28", height: "28" }),
        el("span", { text: "CHEONGPA GACHI" }),
      ]),
      el("span", { className: "brand-r-header__edition", text: "APERTURE / 2026", "aria-hidden": "true" }),
      el("a", { className: "brand-r-enter", href: "#/login" }, [el("span", { text: "ENTER TOGETHER" }), el("b", { text: "↗", "aria-hidden": "true" })]),
    ]);
  }

  function renderGateway() {
    const stageCopy = el("div", { className: "brand-r-stage__copy" }, [
      el("span", { className: "brand-r-stage__meta", text: scenes[0].meta }),
      el("h2", { className: "brand-r-stage__word", text: scenes[0].title }),
      el("p", { className: "brand-r-stage__korean", text: scenes[0].korean }),
      el("p", { className: "brand-r-stage__lead", text: scenes[0].lead }),
      el("a", { className: "brand-r-stage__link", href: scenes[0].href, "aria-label": `${scenes[0].korean} 열기` }, [el("span", { text: "OPEN DIRECTION" }), el("b", { text: "→", "aria-hidden": "true" })]),
    ]);
    const main = el("main", { id: "brand-main-content", className: "brand-r-shell", tabindex: "-1" }, [
      header(),
      el("section", { className: "brand-r-hero", "aria-labelledby": "brand-r-title" }, [
        el("div", { className: "brand-r-hero__eyebrow", text: "A COMMUNITY SEEN THROUGH THREE APERTURES" }),
        el("div", { className: "brand-r-hero__title" }, [
          el("h1", { id: "brand-r-title", text: "같이" }),
          el("span", { text: "GACHI", "aria-hidden": "true" }),
        ]),
        el("p", { className: "brand-r-hero__lead", text: "닮고, 나누고, 함께 살아가는 청파청년부의 오늘을 서로 다른 세 개의 창으로 바라봅니다." }),
        el("div", { className: "brand-r-hero__aperture", "aria-hidden": "true" }, [el("span", { text: "OPEN" }), el("i"), el("i"), el("i")]),
        el("div", { className: "brand-r-hero__index", text: "37.55°N · SEOUL · SCROLL TO ENTER", "aria-hidden": "true" }),
      ]),
      el("section", { className: "brand-r-story", "aria-label": "청파 같이 세 방향" }, [
        el("div", { className: "brand-r-stage brand-r-stage--like", dataset: { activeScene: "like" } }, [
          el("div", { className: "brand-r-stage__rail", "aria-hidden": "true" }, scenes.map((scene) => el("span", { dataset: { sceneLabel: scene.key }, text: `${scene.number} ${scene.title}` }))),
          el("div", { className: "brand-r-window" }, [
            el("div", { className: "brand-r-window__grid", "aria-hidden": "true" }),
            el("div", { className: "brand-r-window__number", text: "01", "aria-hidden": "true" }),
            el("div", { className: "brand-r-window__echo", text: "LIKE", "aria-hidden": "true" }),
            stageCopy,
          ]),
          el("div", { className: "brand-r-stage__outside", "aria-hidden": "true" }, [el("span", { text: "LIKE / VALUE / TOGETHER" }), el("strong", { text: "GACHI" })]),
        ]),
        ...scenes.map((scene) => el("article", { className: "brand-r-beat", dataset: { scene: scene.key } }, [el("span", { className: "brand-r-beat__number", text: scene.number }), el("h2", { text: scene.title }), el("p", { text: scene.korean })])),
      ]),
      el("section", { className: "brand-r-closing" }, [
        el("span", { text: "COMMON GROUND / 04" }),
        el("h2", {}, ["약한 이의 곁에 서고, ", el("em", { text: "평화를 사랑하며," }), " 함께 살아갑니다."]),
        el("div", { className: "brand-r-closing__line", "aria-hidden": "true" }),
        el("p", { text: "믿는 것을 말하고, 말한 것을 함께 살아내는 공동체." }),
      ]),
      el("footer", { className: "brand-r-footer" }, [el("span", { text: "CHEONGPA GACHI" }), el("span", { text: "LIKE · VALUE · TOGETHER" }), el("span", { text: "© 2026" })]),
    ]);
    root.replaceChildren(main);
    bindGateway(main);
  }

  function bindGateway(main) {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const stage = main.querySelector(".brand-r-stage");
    const beats = [...main.querySelectorAll(".brand-r-beat")];
    if (!stage || !beats.length) return;
    const word = stage.querySelector(".brand-r-stage__word");
    const korean = stage.querySelector(".brand-r-stage__korean");
    const meta = stage.querySelector(".brand-r-stage__meta");
    const lead = stage.querySelector(".brand-r-stage__lead");
    const link = stage.querySelector(".brand-r-stage__link");
    const number = stage.querySelector(".brand-r-window__number");
    const echo = stage.querySelector(".brand-r-window__echo");
    let currentKey = "like";
    let frame = 0;

    const applyScene = (key) => {
      if (key === currentKey) return;
      const scene = scenes.find((item) => item.key === key);
      if (!scene) return;
      currentKey = key;
      stage.dataset.activeScene = key;
      stage.className = `brand-r-stage brand-r-stage--${key}`;
      word.textContent = scene.title;
      korean.textContent = scene.korean;
      meta.textContent = scene.meta;
      lead.textContent = scene.lead;
      link.href = scene.href;
      link.setAttribute("aria-label", `${scene.korean} 열기`);
      number.textContent = scene.number;
      echo.textContent = scene.title;
      stage.querySelectorAll("[data-scene-label]").forEach((node) => { node.dataset.active = String(node.dataset.sceneLabel === key); });
    };

    const update = () => {
      frame = 0;
      const center = (window.innerHeight || 1) * .52;
      let best = null;
      beats.forEach((beat) => {
        const rect = beat.getBoundingClientRect();
        const distance = Math.abs((rect.top + rect.bottom) / 2 - center);
        if (!best || distance < best.distance) best = { key: beat.dataset.scene, distance };
      });
      if (best) applyScene(best.key);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    update();

    if (!reduced) {
      stage.addEventListener("pointermove", (event) => {
        const rect = stage.getBoundingClientRect();
        stage.style.setProperty("--px", (((event.clientX - rect.left) / Math.max(rect.width, 1) - .5) * 2).toFixed(3));
        stage.style.setProperty("--py", (((event.clientY - rect.top) / Math.max(rect.height, 1) - .5) * 2).toFixed(3));
      });
      stage.addEventListener("pointerleave", () => { stage.style.setProperty("--px", "0"); stage.style.setProperty("--py", "0"); });
    }
  }

  function renderDetail(type) {
    const content = details[type];
    if (!content) return renderGateway();
    const main = el("main", { id: "brand-main-content", className: `brand-r-detail brand-r-detail--${type}`, tabindex: "-1" }, [
      header(true),
      el("section", { className: "brand-r-detail__hero" }, [
        el("span", { className: "brand-r-detail__label", text: content.label }),
        el("div", { className: "brand-r-detail__aperture", "aria-hidden": "true" }, [el("span", { text: content.word })]),
        el("div", { className: "brand-r-detail__copy" }, [el("a", { href: "#/gateway", text: "← ALL THREE" }), el("h1", { text: content.title }), el("p", { text: content.lead })]),
      ]),
      el("section", { className: "brand-r-detail__list" }, content.items.map((item) => el("article", { className: "brand-r-detail__item" }, [el("span", { text: item[0] }), el("h2", { text: item[1] }), el("p", { text: item[2] }), el("em", { text: "COMING SOON" })]))),
      el("a", { className: "brand-r-detail__next", href: content.next }, [el("span", { text: "NEXT APERTURE" }), el("strong", { text: `${content.nextLabel} →` })]),
    ]);
    root.replaceChildren(main);
  }

  function enterCommunity() {
    document.documentElement.removeAttribute("data-brand-public");
    root.hidden = true;
    root.replaceChildren();
    window.dispatchEvent(new CustomEvent("brand:enter-app"));
  }

  function renderRoute() {
    const path = pathFromHash();
    if (!PUBLIC_ROUTES.has(path)) return enterCommunity();
    document.documentElement.dataset.brandPublic = "true";
    root.hidden = false;
    if (path === "/like") { document.title = "같이 닮다 | 청파 같이"; renderDetail("like"); }
    else if (path === "/value") { document.title = "가치를 나누다 | 청파 같이"; renderDetail("value"); }
    else { document.title = "청파 같이 | Like · Value · Together"; renderGateway(); }
  }

  root.addEventListener("click", (event) => {
    const anchor = event.target.closest("a[href^='#/']");
    if (!anchor) return;
    const href = anchor.getAttribute("href");
    const nextPath = pathFromHash(href);
    if (!PUBLIC_ROUTES.has(nextPath)) return;
    event.preventDefault();
    const navigate = () => {
      window.history.pushState(null, "", href);
      renderRoute();
      window.scrollTo({ top: 0, behavior: "instant" });
    };
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduced && typeof document.startViewTransition === "function") document.startViewTransition(navigate);
    else navigate();
  });

  window.addEventListener("hashchange", renderRoute);
  window.addEventListener("popstate", renderRoute);
  document.getElementById("skip-link")?.addEventListener("click", () => {
    if (document.documentElement.dataset.brandPublic === "true") document.getElementById("brand-main-content")?.focus();
  });
  renderRoute();
})();
