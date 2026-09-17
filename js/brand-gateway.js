(() => {
  const PUBLIC_ROUTES = new Set(["/gateway", "/like", "/value"]);
  const root = document.getElementById("brand-gateway-root");
  if (!root) return;

  const directions = [
    { key: "like", number: "01", english: "LIKE", korean: "같이 닮다", eyebrow: "WORSHIP · WORD · FORMATION", lead: "예배와 말씀 안에서 같은 방향을 바라보고, 삶의 모양을 천천히 닮아갑니다.", href: "#/like" },
    { key: "value", number: "02", english: "VALUE", korean: "가치를 나누다", eyebrow: "STORY · THOUGHT · PRACTICE", lead: "사람의 이야기와 생각을 기록하고, 중요한 가치를 일상의 실천으로 이어갑니다.", href: "#/value" },
    { key: "together", number: "03", english: "TOGETHER", korean: "같이 하다", eyebrow: "COMMUNITY · ACTIVITY · TODAY", lead: "소식과 모임, 활동을 통해 서로의 오늘에 자리를 내어주며 함께 살아갑니다.", href: "#/login" },
  ];

  const details = {
    like: { number: "01", english: "LIKE", title: "같이 닮다", lead: "예배와 말씀 안에서 예수님의 마음을 배우고, 청파가 걸어온 신앙의 방향을 오늘의 삶으로 이어갑니다.", items: [["01", "청파의 정신", "약자의 곁에 서고 평화를 사랑하는 공동체의 방향"], ["02", "예배", "함께 드린 예배와 메시지를 다시 만나는 기록"], ["03", "말씀", "묵상과 질문을 일상의 선택으로 이어가는 콘텐츠"]], next: "#/value", nextLabel: "VALUE" },
    value: { number: "02", english: "VALUE", title: "가치를 나누다", lead: "사람의 경험과 생각을 기록하고, 돌봄과 평화를 구체적인 프로젝트와 실천으로 확장합니다.", items: [["01", "이야기", "목회자와 청년들의 삶과 신앙을 담는 인터뷰"], ["02", "칼럼", "공동체와 세상을 함께 바라보는 질문과 관점"], ["03", "프로젝트", "봉사와 캠페인, 연대로 이어지는 실제 행동"]], next: "#/login", nextLabel: "TOGETHER" },
  };

  const routePath = () => {
    const raw = window.location.hash.replace(/^#/, "") || "/gateway";
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
    return el("header", { className: `brand-q-header${compact ? " brand-q-header--compact" : ""}` }, [
      el("a", { className: "brand-q-logo", href: "#/gateway", "aria-label": "청파 같이 첫 화면" }, [el("img", { src: "./assets/images/logo.svg", alt: "", width: "26", height: "26" }), el("span", { text: "CHEONGPA GACHI" })]),
      el("nav", { className: "brand-q-nav", "aria-label": "브랜드 방향" }, [el("a", { href: "#/like", text: "LIKE" }), el("a", { href: "#/value", text: "VALUE" }), el("a", { href: "#/login", text: "TOGETHER" })]),
      el("a", { className: "brand-q-enter", href: "#/login" }, [el("span", { text: "ENTER" }), el("span", { text: "↗", "aria-hidden": "true" })]),
    ]);
  }

  function directionSection(direction) {
    return el("section", { className: `brand-q-field brand-q-field--${direction.key}`, dataset: { field: direction.key }, "aria-labelledby": `brand-q-${direction.key}` }, [
      el("div", { className: "brand-q-field__wash", "aria-hidden": "true" }),
      el("div", { className: "brand-q-field__meta" }, [el("span", { text: direction.number }), el("span", { text: direction.eyebrow })]),
      el("div", { className: "brand-q-field__word" }, [el("h2", { id: `brand-q-${direction.key}`, text: direction.english }), el("p", { text: direction.korean })]),
      el("div", { className: "brand-q-field__copy" }, [el("p", { text: direction.lead }), el("a", { href: direction.href, "aria-label": `${direction.korean} 열기` }, [el("span", { text: direction.key === "together" ? "ENTER" : "EXPLORE" }), el("span", { text: "→", "aria-hidden": "true" })])]),
    ]);
  }

  function bindGateway(main) {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fields = [...main.querySelectorAll("[data-field]")];
    const hero = main.querySelector(".brand-q-hero");

    if (hero && !reduced) {
      hero.addEventListener("pointermove", (event) => {
        const rect = hero.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / Math.max(rect.width, 1) - .5).toFixed(3);
        hero.style.setProperty("--qx", x);
      });
      hero.addEventListener("pointerleave", () => hero.style.setProperty("--qx", "0"));
    }

    const observed = [...fields, ...main.querySelectorAll("[data-reveal]")];
    if (!("IntersectionObserver" in window)) {
      observed.forEach((node) => { node.dataset.visible = "true"; if (node.dataset.field) node.dataset.active = "true"; });
      return;
    }

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) entry.target.dataset.visible = "true"; });
    }, { threshold: .16 });
    observed.forEach((node) => revealObserver.observe(node));

    const activeObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { entry.target.dataset.active = String(entry.isIntersecting); });
    }, { rootMargin: "-28% 0px -28% 0px", threshold: .2 });
    fields.forEach((field) => activeObserver.observe(field));

    if (reduced) fields.forEach((field) => { field.dataset.active = "true"; });
  }

  function renderGateway() {
    const main = el("main", { id: "brand-main-content", className: "brand-q-shell", tabindex: "-1" }, [
      header(),
      el("section", { className: "brand-q-hero", "aria-labelledby": "brand-q-title" }, [
        el("div", { className: "brand-q-hero__top" }, [el("span", { text: "CHEONGPA YOUTH COMMUNITY · SEOUL" }), el("span", { text: "LIKE · VALUE · TOGETHER" })]),
        el("div", { className: "brand-q-hero__title" }, [el("h1", { id: "brand-q-title", text: "같이" }), el("div", { text: "GACHI", "aria-hidden": "true" })]),
        el("div", { className: "brand-q-hero__bottom" }, [el("p", { text: "닮고, 나누고, 함께 살아가는 청파청년부의 오늘." }), el("p", { text: "약한 이의 곁에 서고, 평화를 사랑하며, 서로의 삶에 자리를 내어줍니다." })]),
      ]),
      el("div", { className: "brand-q-index", "aria-label": "세 방향 바로가기" }, directions.map((direction) => el("a", { href: `#brand-q-${direction.key}` }, [el("span", { text: direction.number }), el("strong", { text: direction.english }), el("em", { text: direction.korean })]))),
      el("div", { className: "brand-q-fields" }, directions.map(directionSection)),
      el("section", { className: "brand-q-closing", dataset: { reveal: "" } }, [
        el("div", { className: "brand-q-closing__label", text: "COMMON GROUND / 04" }),
        el("div", { className: "brand-q-closing__statement" }, [el("p", { text: "우리가 믿는 방향을" }), el("p", { text: "함께 살아갑니다." })]),
        el("div", { className: "brand-q-closing__foot" }, [el("span", { text: "CARE · PEACE · COMMUNITY" }), el("p", { text: "거창한 말보다 오래 이어지는 삶으로." })]),
      ]),
      el("footer", { className: "brand-q-footer" }, [el("span", { text: "CHEONGPA GACHI" }), el("span", { text: "© 2026" })]),
    ]);
    root.replaceChildren(main);
    bindGateway(main);
  }

  function renderDetail(type) {
    const content = details[type];
    if (!content) return renderGateway();
    const main = el("main", { id: "brand-main-content", className: `brand-q-detail brand-q-detail--${type}`, tabindex: "-1" }, [
      header(true),
      el("section", { className: "brand-q-detail__hero" }, [el("div", { className: "brand-q-detail__number", text: content.number }), el("div", { className: "brand-q-detail__title" }, [el("span", { text: content.english }), el("h1", { text: content.title })]), el("p", { className: "brand-q-detail__lead", text: content.lead })]),
      el("section", { className: "brand-q-detail__list", "aria-label": `${content.title} 콘텐츠 구성` }, content.items.map((item) => el("article", { className: "brand-q-detail__item" }, [el("span", { text: item[0] }), el("h2", { text: item[1] }), el("p", { text: item[2] }), el("em", { text: "COMING SOON" })]))),
      el("a", { className: "brand-q-detail__next", href: content.next }, [el("span", { text: "NEXT DIRECTION" }), el("strong", { text: `${content.nextLabel} →` })]),
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
    const path = routePath();
    if (!PUBLIC_ROUTES.has(path)) return enterCommunity();
    document.documentElement.dataset.brandPublic = "true";
    root.hidden = false;
    if (path === "/like") { document.title = "같이 닮다 | 청파 같이"; renderDetail("like"); }
    else if (path === "/value") { document.title = "가치를 나누다 | 청파 같이"; renderDetail("value"); }
    else { document.title = "청파 같이 | Like · Value · Together"; renderGateway(); }
  }

  window.addEventListener("hashchange", renderRoute);
  document.getElementById("skip-link")?.addEventListener("click", () => {
    if (document.documentElement.dataset.brandPublic === "true") document.getElementById("brand-main-content")?.focus();
  });
  renderRoute();
})();
