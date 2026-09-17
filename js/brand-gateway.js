(() => {
  const PUBLIC_ROUTES = new Set(["/gateway", "/value", "/like", "/together"]);
  const root = document.getElementById("brand-gateway-root");
  if (!root) return;

  const directions = [
    {
      key: "value",
      number: "01",
      english: "VALUE",
      korean: "가치를 나누다",
      eyebrow: "STORY · THOUGHT · PRACTICE",
      summary: "우리가 중요하게 여기는 것을 발견하고, 이야기와 실천으로 세상과 나눕니다.",
      meta: "이야기 · 칼럼 · 프로젝트",
      accent: "#a87865",
      href: "#/value",
    },
    {
      key: "like",
      number: "02",
      english: "LIKE",
      korean: "같이 닮다",
      eyebrow: "WORSHIP · WORD · FORMATION",
      summary: "그 가치를 예배와 말씀 안에서 배우고, 삶의 모양으로 천천히 닮아갑니다.",
      meta: "청파의 정신 · 예배 · 말씀",
      accent: "#607b73",
      href: "#/like",
    },
    {
      key: "together",
      number: "03",
      english: "TOGETHER",
      korean: "같이 하다",
      eyebrow: "NEWS · GATHER · ACTIVITY",
      summary: "서로의 오늘에 자리를 내어주며 모이고 움직이고, 실제 공동체의 삶을 함께 만듭니다.",
      meta: "청년부 소식 · 모임 · 활동",
      accent: "#65758a",
      href: "#/together",
    },
  ];

  const details = {
    value: {
      number: "01",
      english: "VALUE",
      title: "가치를 나누다",
      lead: "목회자와 청년들의 이야기, 질문과 생각, 프로젝트를 통해 우리가 중요하게 여기는 가치를 세상과 나눕니다.",
      accent: "#a87865",
      items: [
        ["01", "이야기", "목회자와 청년들의 삶과 신앙을 담는 인터뷰와 기록"],
        ["02", "칼럼", "공동체와 세상을 함께 바라보며 질문하고 생각을 나누는 공간"],
        ["03", "프로젝트", "봉사와 캠페인처럼 가치가 실제 행동으로 이어지는 기록"],
      ],
      next: "#/like",
      nextLabel: "02 / LIKE",
    },
    like: {
      number: "02",
      english: "LIKE",
      title: "같이 닮다",
      lead: "예배와 말씀 안에서 예수님의 마음을 배우고, 청파가 걸어온 신앙의 방향을 오늘의 삶으로 이어갑니다.",
      accent: "#607b73",
      items: [
        ["01", "청파의 정신", "약자의 곁에 서고 평화를 사랑하는 공동체의 방향"],
        ["02", "예배", "청파청년부가 함께 드린 예배와 메시지를 다시 만나는 아카이브"],
        ["03", "말씀", "묵상과 질문을 일상의 선택과 실천으로 이어가는 기록"],
      ],
      next: "#/together",
      nextLabel: "03 / TOGETHER",
    },
    together: {
      number: "03",
      english: "TOGETHER",
      title: "같이 하다",
      lead: "청파의 오늘을 서로 나누고, 실제 모임과 활동 안에서 함께 살아가는 공간입니다.",
      accent: "#65758a",
      items: [
        ["01", "청년부 소식", "예배와 공동체의 새로운 소식, 공지와 일정을 한곳에서 확인"],
        ["02", "모임", "누구나 함께 제안하고 참여할 수 있는 작은 모임과 만남"],
        ["03", "활동", "기존 청파 같이의 문화·야외 활동과 공동체 기능"],
      ],
      next: "#/login",
      nextLabel: "COMMUNITY ↗",
      community: true,
    },
  };

  const routePath = (hash = window.location.hash) => {
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
    return el("header", { className: `brand-ac-header${compact ? " brand-ac-header--compact" : ""}` }, [
      el("a", { className: "brand-ac-logo", href: "#/gateway", "aria-label": "청파 같이 첫 화면" }, [
        el("img", { src: "./assets/images/logo.svg", alt: "", width: "26", height: "26" }),
        el("span", { text: "CHUNGPA GACHI" }),
      ]),
      el("div", { className: "brand-ac-header__meta", "aria-hidden": "true" }, [
        el("span", { text: "EDITORIAL INDEX / 03" }),
        el("span", { text: "SEOUL · 2026" }),
      ]),
      el("a", { className: "brand-ac-enter", href: "#/login" }, [el("span", { text: "COMMUNITY" }), el("b", { text: "↗", "aria-hidden": "true" })]),
    ]);
  }

  function gatewayIndexRow(item) {
    return el("a", {
      className: `brand-ac-index__row brand-ac-index__row--${item.key}`,
      href: `#brand-ac-${item.key}`,
      dataset: { indexDirection: item.key, active: "false" },
      style: `--accent:${item.accent}`,
    }, [
      el("span", { className: "brand-ac-index__number", text: item.number }),
      el("div", { className: "brand-ac-index__label" }, [el("strong", { text: item.english }), el("small", { text: item.korean })]),
      el("i", { text: "↓", "aria-hidden": "true" }),
    ]);
  }

  function gatewayChapter(item) {
    return el("article", {
      id: `brand-ac-${item.key}`,
      className: `brand-ac-chapter brand-ac-chapter--${item.key}`,
      dataset: { chapter: item.key, visible: "false", active: "false" },
      style: `--accent:${item.accent}`,
    }, [
      el("div", { className: "brand-ac-chapter__rule", "aria-hidden": "true" }),
      el("div", { className: "brand-ac-chapter__top" }, [
        el("span", { text: `${item.number} / ${item.english}` }),
        el("span", { text: item.eyebrow }),
      ]),
      el("div", { className: "brand-ac-chapter__title" }, [
        el("span", { className: "brand-ac-chapter__ghost", text: item.english, "aria-hidden": "true" }),
        el("h2", { text: item.english }),
        el("h3", { text: item.korean }),
      ]),
      el("div", { className: "brand-ac-chapter__body" }, [
        el("p", { text: item.summary }),
        el("span", { className: "brand-ac-chapter__meta", text: item.meta }),
        el("a", { href: item.href, "aria-label": `${item.korean} 자세히 보기` }, [el("span", { text: "OPEN CHAPTER" }), el("b", { text: "→", "aria-hidden": "true" })]),
      ]),
    ]);
  }

  function bindGateway(main) {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const chapters = [...main.querySelectorAll("[data-chapter]")];
    const indexRows = [...main.querySelectorAll("[data-index-direction]")];
    if (!chapters.length) return;

    const setActive = (key) => {
      main.dataset.activeDirection = key;
      chapters.forEach((node) => { node.dataset.active = String(node.dataset.chapter === key); });
      indexRows.forEach((node) => { node.dataset.active = String(node.dataset.indexDirection === key); });
    };

    if (!("IntersectionObserver" in window)) {
      chapters.forEach((node) => { node.dataset.visible = "true"; });
      setActive(directions[0].key);
    } else {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.dataset.visible = "true";
          if (entry.intersectionRatio >= .48) setActive(entry.target.dataset.chapter);
        });
      }, { threshold: [.16, .48, .72], rootMargin: "-8% 0px -8% 0px" });
      chapters.forEach((node) => observer.observe(node));
      setActive(directions[0].key);
    }

    if (!reduced) {
      chapters.forEach((chapter) => {
        chapter.addEventListener("pointermove", (event) => {
          const rect = chapter.getBoundingClientRect();
          const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / Math.max(rect.width, 1)));
          chapter.style.setProperty("--beam", `${(x * 100).toFixed(1)}%`);
        });
        chapter.addEventListener("pointerleave", () => chapter.style.removeProperty("--beam"));
      });

      const hero = main.querySelector(".brand-ac-hero");
      hero?.addEventListener("pointermove", (event) => {
        const rect = hero.getBoundingClientRect();
        hero.style.setProperty("--mx", ((((event.clientX - rect.left) / Math.max(rect.width, 1)) - .5) * 2).toFixed(3));
        hero.style.setProperty("--my", ((((event.clientY - rect.top) / Math.max(rect.height, 1)) - .5) * 2).toFixed(3));
      });
      hero?.addEventListener("pointerleave", () => {
        hero.style.setProperty("--mx", "0");
        hero.style.setProperty("--my", "0");
      });
    }
  }

  function renderGateway() {
    const main = el("main", { id: "brand-main-content", className: "brand-ac-shell", tabindex: "-1", dataset: { activeDirection: "value" } }, [
      header(),
      el("section", { className: "brand-ac-hero", "aria-labelledby": "brand-ac-title" }, [
        el("div", { className: "brand-ac-hero__rail", "aria-hidden": "true" }, [el("span", { text: "AC / O × P" }), el("span", { text: "CHUNGPA" })]),
        el("div", { className: "brand-ac-hero__intro" }, [
          el("span", { text: "A COMMUNITY IN THREE CHAPTERS" }),
          el("p", { text: "같은 가치를 바라보고, 같이 닮아가며, 같이 살아가는 청파청년부." }),
        ]),
        el("div", { className: "brand-ac-hero__word" }, [
          el("span", { text: "GACHI", "aria-hidden": "true" }),
          el("h1", { id: "brand-ac-title", text: "같이" }),
        ]),
        el("aside", { className: "brand-ac-hero__manifesto" }, [
          el("span", { text: "THE STORY" }),
          el("ol", {}, [
            el("li", {}, [el("b", { text: "01" }), el("strong", { text: "청파의 가치" }), el("small", { text: "VALUE" })]),
            el("li", {}, [el("b", { text: "02" }), el("strong", { text: "청파의 같이" }), el("small", { text: "LIKE" })]),
            el("li", {}, [el("b", { text: "03" }), el("strong", { text: "청파와 같이" }), el("small", { text: "TOGETHER" })]),
          ]),
        ]),
        el("div", { className: "brand-ac-hero__foot" }, [el("span", { text: "INDEX MEETS CHAPTERS" }), el("a", { href: "#brand-ac-reading", text: "READ ↓" })]),
      ]),
      el("section", { id: "brand-ac-reading", className: "brand-ac-reading", "aria-label": "청파 같이 세 가지 방향" }, [
        el("aside", { className: "brand-ac-index" }, [
          el("div", { className: "brand-ac-index__head" }, [
            el("span", { text: "INDEX / 03 DIRECTIONS" }),
            el("h2", { text: "세 가지 방향, 하나의 같이." }),
            el("p", { text: "목차를 따라 읽거나, 장면을 넘기듯 천천히 내려가 보세요." }),
          ]),
          el("nav", { "aria-label": "세 가지 방향 목차" }, directions.map(gatewayIndexRow)),
        ]),
        el("div", { className: "brand-ac-passages" }, directions.map(gatewayChapter)),
      ]),
      el("section", { className: "brand-ac-common" }, [
        el("span", { text: "COMMON GROUND / 04" }),
        el("div", { className: "brand-ac-common__copy" }, [
          el("p", { text: "가치를 발견하고," }),
          el("p", { text: "그 가치를 닮아가며," }),
          el("p", { text: "마침내 함께 살아갑니다." }),
        ]),
        el("a", { href: "#/together" }, [el("span", { text: "청파와 같이 시작하기" }), el("b", { text: "↗", "aria-hidden": "true" })]),
      ]),
      el("footer", { className: "brand-ac-footer" }, [
        el("span", { text: "CHUNGPA GACHI" }),
        el("span", { text: "VALUE · LIKE · TOGETHER" }),
        el("span", { text: "chungpagachi.kr" }),
      ]),
    ]);
    root.replaceChildren(main);
    bindGateway(main);
  }

  function renderDetail(type) {
    const content = details[type];
    if (!content) return renderGateway();
    const main = el("main", { id: "brand-main-content", className: `brand-ac-detail brand-ac-detail--${type}`, tabindex: "-1", style: `--accent:${content.accent}` }, [
      header(true),
      el("section", { className: "brand-ac-detail__hero" }, [
        el("div", { className: "brand-ac-detail__rail" }, [el("span", { text: `${content.number} / ${content.english}` }), el("a", { href: "#/gateway", text: "← INDEX" })]),
        el("div", { className: "brand-ac-detail__word", text: content.english, "aria-hidden": "true" }),
        el("div", { className: "brand-ac-detail__title" }, [
          el("span", { text: "CHUNGPA GACHI / PUBLIC CHAPTER" }),
          el("h1", { text: content.english }),
          el("h2", { text: content.title }),
        ]),
        el("p", { className: "brand-ac-detail__lead", text: content.lead }),
      ]),
      el("section", { className: "brand-ac-detail__contents", "aria-label": `${content.title} 콘텐츠 구성` }, content.items.map((item) =>
        el("article", { className: "brand-ac-detail__item" }, [
          el("span", { text: item[0] }),
          el("h3", { text: item[1] }),
          el("p", { text: item[2] }),
          el("em", { text: "COMING SOON" }),
        ])
      )),
      content.community ? el("section", { className: "brand-ac-detail__community" }, [
        el("span", { text: "THE LAST CHAPTER BECOMES PARTICIPATION" }),
        el("h2", { text: "읽는 ‘같이’에서, 실제 ‘같이’로." }),
        el("p", { text: "모임을 만들고 참여하며 청파의 오늘을 함께 살아가는 기존 커뮤니티로 이어집니다." }),
        el("a", { href: "#/login" }, [el("span", { text: "커뮤니티 들어가기" }), el("b", { text: "↗", "aria-hidden": "true" })]),
      ]) : null,
      el("a", { className: "brand-ac-detail__next", href: content.next }, [el("span", { text: "NEXT CHAPTER" }), el("strong", { text: content.nextLabel })]),
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
    if (path === "/value") {
      document.title = "가치를 나누다 | 청파 같이";
      renderDetail("value");
    } else if (path === "/like") {
      document.title = "같이 닮다 | 청파 같이";
      renderDetail("like");
    } else if (path === "/together") {
      document.title = "같이 하다 | 청파 같이";
      renderDetail("together");
    } else {
      document.title = "청파 같이 | Value · Like · Together";
      renderGateway();
    }
  }

  root.addEventListener("click", (event) => {
    const anchor = event.target.closest("a[href]");
    if (!anchor) return;
    const href = anchor.getAttribute("href");

    if (href?.startsWith("#brand-ac-")) {
      const target = document.querySelector(href);
      if (!target) return;
      event.preventDefault();
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
      return;
    }

    if (!href?.startsWith("#/")) return;
    const nextPath = routePath(href);
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
  document.getElementById("skip-link")?.addEventListener("click", () => {
    if (document.documentElement.dataset.brandPublic === "true") document.getElementById("brand-main-content")?.focus();
  });
  renderRoute();
})();
