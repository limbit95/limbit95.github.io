(() => {
  const PUBLIC_ROUTES = new Set(["/gateway", "/like", "/value"]);
  const root = document.getElementById("brand-gateway-root");
  if (!root) return;

  const chapters = [
    { key: "like", number: "01", english: "LIKE", korean: "같이 닮다", eyebrow: "WORSHIP · WORD · FORMATION", statement: "같은 방향을 바라보고, 삶으로 닮아갑니다.", href: "#/like", tone: "blue" },
    { key: "value", number: "02", english: "VALUE", korean: "가치를 나누다", eyebrow: "STORY · THOUGHT · PRACTICE", statement: "중요하게 여기는 것을 말하고, 세상과 나눕니다.", href: "#/value", tone: "clay" },
    { key: "together", number: "03", english: "TOGETHER", korean: "같이 하다", eyebrow: "NEWS · GATHER · ACTIVITY", statement: "함께 모이고 움직이며, 공동체의 오늘을 만듭니다.", href: "#/login", tone: "sage" },
  ];

  const details = {
    like: { number: "01", english: "LIKE", title: "같이 닮다", lead: "예배와 말씀 안에서 예수님의 마음을 배우고, 청파가 걸어온 신앙의 방향을 오늘의 삶으로 이어갑니다.", items: [["01", "청파의 정신", "약자의 곁에 서고 평화를 사랑하는 공동체의 방향"], ["02", "예배", "함께 드린 예배와 메시지를 다시 만나는 기록"], ["03", "말씀", "묵상과 기록을 일상의 선택으로 이어가는 콘텐츠"]] },
    value: { number: "02", english: "VALUE", title: "가치를 나누다", lead: "사람의 경험과 생각을 기록하고, 돌봄과 평화를 구체적인 프로젝트와 실천으로 확장합니다.", items: [["01", "이야기", "목회자와 청년들의 삶과 신앙을 담는 인터뷰"], ["02", "칼럼", "공동체와 세상을 함께 바라보는 질문과 관점"], ["03", "프로젝트", "봉사와 캠페인, 연대로 이어지는 실제 행동"]] },
  };

  const routePath = () => {
    const raw = window.location.hash.replace(/^#/, "") || "/gateway";
    return (`/${raw.split("?")[0]}`).replace(/\/+/g, "/").replace(/\/$/, "") || "/";
  };

  const create = (tag, options = {}, children = []) => {
    const node = document.createElement(tag);
    Object.entries(options).forEach(([key, value]) => {
      if (value == null || value === false) return;
      if (key === "className") node.className = value;
      else if (key === "text") node.textContent = String(value);
      else if (key === "dataset") Object.assign(node.dataset, value);
      else if (key === "style") node.setAttribute("style", String(value));
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
    return create("header", { className: `brand-o-header${compact ? " brand-o-header--compact" : ""}` }, [
      create("a", { className: "brand-o-brand", href: "#/gateway", "aria-label": "청파 같이 첫 화면" }, [create("img", { src: "./assets/images/logo.svg", alt: "", width: "28", height: "28" }), create("span", { text: "CHEONGPA GACHI" })]),
      create("div", { className: "brand-o-header__meta", "aria-hidden": "true" }, [create("span", { text: "CHEONGPA YOUTH COMMUNITY" }), create("span", { text: "SEOUL · 2026" })]),
      create("nav", { className: "brand-o-header__nav", "aria-label": "청파 같이 영역" }, [create("a", { href: "#/like", text: "LIKE" }), create("a", { href: "#/value", text: "VALUE" }), create("a", { href: "#/login", text: "TOGETHER ↗" })]),
    ]);
  }

  function bindChapterMotion(scope) {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rows = [...scope.querySelectorAll(".brand-o-chapter")];
    rows.forEach((row) => {
      const setActive = () => rows.forEach((item) => item.dataset.active = String(item === row));
      row.addEventListener("pointerenter", setActive);
      row.addEventListener("focusin", setActive);
      if (!reduced) row.addEventListener("pointermove", (event) => {
        const rect = row.getBoundingClientRect();
        row.style.setProperty("--mx", ((event.clientX - rect.left) / Math.max(rect.width, 1)).toFixed(3));
        row.style.setProperty("--my", ((event.clientY - rect.top) / Math.max(rect.height, 1)).toFixed(3));
      });
    });
    scope.addEventListener("pointerleave", () => rows.forEach((item) => item.dataset.active = "false"));
  }

  function bindReveal(scope) {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !("IntersectionObserver" in window)) {
      scope.querySelectorAll("[data-reveal]").forEach((node) => node.dataset.visible = "true");
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.dataset.visible = "true";
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .18 });
    scope.querySelectorAll("[data-reveal]").forEach((node) => observer.observe(node));
  }

  function renderGateway() {
    const chapterRows = chapters.map((chapter) => create("a", {
      className: `brand-o-chapter brand-o-chapter--${chapter.tone}`,
      href: chapter.href,
      dataset: { active: "false" },
      "aria-label": `${chapter.english.charAt(0)}${chapter.english.slice(1).toLowerCase()} — ${chapter.korean}`,
    }, [
      create("div", { className: "brand-o-chapter__wash", "aria-hidden": "true" }),
      create("span", { className: "brand-o-chapter__number", text: chapter.number }),
      create("div", { className: "brand-o-chapter__title" }, [create("span", { text: chapter.eyebrow }), create("strong", { text: chapter.english }), create("em", { text: chapter.korean })]),
      create("p", { className: "brand-o-chapter__statement", text: chapter.statement }),
      create("span", { className: "brand-o-chapter__arrow", text: "↗", "aria-hidden": "true" }),
      create("span", { className: "brand-o-chapter__ghost", text: chapter.english, "aria-hidden": "true" }),
    ]));

    const main = create("main", { id: "brand-main-content", className: "brand-o-shell", tabindex: "-1" }, [
      header(),
      create("section", { className: "brand-o-hero", "aria-labelledby": "brand-o-title" }, [
        create("div", { className: "brand-o-hero__edition" }, [create("span", { text: "01 — BRAND HOME" }), create("span", { text: "LIKE / VALUE / TOGETHER" })]),
        create("div", { className: "brand-o-hero__grid" }, [
          create("div", { className: "brand-o-hero__title" }, [create("span", { className: "brand-o-hero__eng", text: "GACHI", "aria-hidden": "true" }), create("h1", { id: "brand-o-title", text: "같이" })]),
          create("div", { className: "brand-o-hero__copy" }, [create("p", { text: "닮고, 나누고, 함께 살아가는 청파청년부." }), create("p", { text: "약한 이의 곁에 서고 평화를 사랑하는 마음을, 오늘의 삶과 공동체 안에서 이어갑니다." })]),
        ]),
        create("div", { className: "brand-o-hero__foot" }, [create("span", { text: "EST. CHEONGPA" }), create("span", { text: "SCROLL TO READ ↓" })]),
      ]),
      create("section", { className: "brand-o-index", "aria-labelledby": "brand-o-index-title" }, [
        create("div", { className: "brand-o-index__head" }, [create("span", { text: "INDEX / 03 DIRECTIONS" }), create("h2", { id: "brand-o-index-title", text: "세 가지 방향, 하나의 같이." }), create("p", { text: "각 챕터에 커서를 올리면 내용이 펼쳐집니다." })]),
        ...chapterRows,
      ]),
      create("section", { className: "brand-o-statement", dataset: { reveal: "", visible: "false" } }, [
        create("div", { className: "brand-o-statement__label", text: "OUR COMMON DIRECTION" }),
        create("div", { className: "brand-o-statement__lines" }, [create("p", {}, [create("span", { text: "약한 이의 곁에 서고," })]), create("p", {}, [create("span", { text: "평화를 사랑하며," })]), create("p", {}, [create("span", { text: "함께 살아갑니다." })])]),
        create("div", { className: "brand-o-statement__note" }, [create("span", { text: "CARE / PEACE / COMMUNITY" }), create("p", { text: "믿는 것을 말하고, 말한 것을 함께 살아내는 공동체." })]),
      ]),
      create("section", { className: "brand-o-directory", "aria-label": "청파 같이 영역 바로가기" }, chapters.map((chapter) => create("a", { href: chapter.href, className: `brand-o-directory__row brand-o-directory__row--${chapter.tone}` }, [create("span", { text: chapter.number }), create("strong", { text: chapter.english }), create("em", { text: chapter.korean }), create("i", { text: "OPEN ↗" })]))),
      create("footer", { className: "brand-o-footer" }, [create("span", { text: "CHEONGPA GACHI" }), create("span", { text: "SEOUL · 2026" }), create("span", { text: "LIKE · VALUE · TOGETHER" })]),
    ]);

    root.replaceChildren(main);
    bindChapterMotion(main.querySelector(".brand-o-index"));
    bindReveal(main);
  }

  function renderDetail(type) {
    const content = details[type];
    if (!content) return renderGateway();
    const tone = type === "like" ? "blue" : "clay";
    const nextHref = type === "like" ? "#/value" : "#/login";
    const nextText = type === "like" ? "VALUE" : "TOGETHER";
    const main = create("main", { id: "brand-main-content", className: `brand-o-detail brand-o-detail--${tone}`, tabindex: "-1" }, [
      header(true),
      create("section", { className: "brand-o-detail__hero" }, [
        create("div", { className: "brand-o-detail__index" }, [create("span", { text: content.number }), create("a", { href: "#/gateway", text: "← INDEX" })]),
        create("div", { className: "brand-o-detail__title" }, [create("span", { text: "CHEONGPA GACHI / PUBLIC CHAPTER" }), create("h1", { text: content.english }), create("h2", { text: content.title })]),
        create("p", { className: "brand-o-detail__lead", text: content.lead }),
      ]),
      create("section", { className: "brand-o-detail__contents", "aria-label": `${content.title} 콘텐츠 구성` }, content.items.map((item) => create("article", { className: "brand-o-detail__item" }, [create("span", { text: item[0] }), create("h3", { text: item[1] }), create("p", { text: item[2] }), create("em", { text: "COMING SOON" })]))),
      create("a", { className: "brand-o-detail__next", href: nextHref }, [create("span", { text: "NEXT CHAPTER" }), create("strong", { text: `${nextText} →` })]),
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
    if (path === "/like") {
      document.title = "같이 닮다 | 청파 같이";
      renderDetail("like");
    } else if (path === "/value") {
      document.title = "가치를 나누다 | 청파 같이";
      renderDetail("value");
    } else {
      document.title = "청파 같이 | Like · Value · Together";
      renderGateway();
    }
  }

  window.addEventListener("hashchange", renderRoute);
  document.getElementById("skip-link")?.addEventListener("click", () => {
    if (document.documentElement.dataset.brandPublic === "true") document.getElementById("brand-main-content")?.focus();
  });
  renderRoute();
})();
