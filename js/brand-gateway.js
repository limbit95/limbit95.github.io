(() => {
  const PUBLIC_ROUTES = new Set(["/gateway", "/like", "/together", "/value"]);
  const root = document.getElementById("brand-gateway-root");
  if (!root) return;

  const chapters = [
    {
      key: "like",
      number: "01",
      english: "LIKE",
      korean: "같이 닮다",
      meta: "WORSHIP · WORD · DIRECTION",
      lead: "예배와 말씀 안에서 같은 방향을 바라보고, 예수님의 마음과 청파의 정신을 삶으로 닮아갑니다.",
      href: "#/like",
      cue: "LOOK THE SAME WAY",
    },
    {
      key: "together",
      number: "02",
      english: "TOGETHER",
      korean: "같이 하다",
      meta: "NEWS · GATHERING · ACTIVITY",
      lead: "소식과 모임, 활동 속에서 서로의 오늘에 자리를 내어주고 공동체의 시간을 함께 만들어갑니다.",
      href: "#/together",
      cue: "MAKE IT TOGETHER",
    },
    {
      key: "value",
      number: "03",
      english: "VALUE",
      korean: "가치를 나누다",
      meta: "STORY · COLUMN · PROJECT",
      lead: "사람의 이야기와 생각을 기록하고, 우리가 중요하게 여기는 가치를 프로젝트와 실천으로 이어갑니다.",
      href: "#/value",
      cue: "SHARE WHAT MATTERS",
    },
  ];

  const details = {
    like: {
      number: "01",
      english: "LIKE",
      korean: "같이 닮다",
      meta: "WORSHIP · WORD · DIRECTION",
      statement: "같은 방향을 바라보며, 삶으로 닮아갑니다.",
      lead: "예배와 말씀 안에서 예수님의 마음을 배우고, 청파가 걸어온 신앙의 방향을 오늘의 삶으로 이어갑니다.",
      items: [
        ["01", "청파의 정신", "약자의 곁에 서고 평화를 사랑하는 공동체의 방향"],
        ["02", "예배", "청파청년부 예배와 메시지를 다시 만나는 아카이브"],
        ["03", "말씀", "묵상과 질문을 일상의 선택으로 이어가는 기록"],
      ],
      next: "#/together",
      nextLabel: "02 / TOGETHER",
    },
    together: {
      number: "02",
      english: "TOGETHER",
      korean: "같이 하다",
      meta: "NEWS · GATHERING · ACTIVITY",
      statement: "같이 살아가고, 같이 만들어갑니다.",
      lead: "청년부의 소식과 모임, 활동을 한곳에서 만나고 서로의 일상에 자연스럽게 참여할 수 있는 공동체의 입구입니다.",
      items: [
        ["01", "청년부 소식", "예배와 일정, 공동체 안에서 지금 필요한 소식을 빠르게 확인"],
        ["02", "모임", "직접 모임을 만들고 참여하며 사람과 사람을 연결하는 공간"],
        ["03", "활동", "함께 놀고 움직이고 경험하며 쌓아가는 청파청년부의 오늘"],
      ],
      next: "#/value",
      nextLabel: "03 / VALUE",
      appLink: true,
    },
    value: {
      number: "03",
      english: "VALUE",
      korean: "가치를 나누다",
      meta: "STORY · COLUMN · PROJECT",
      statement: "같은 가치를 발견하고, 세상과 나눕니다.",
      lead: "목회자와 청년들의 이야기, 칼럼과 프로젝트를 통해 우리가 중요하게 여기는 가치를 기록하고 실천으로 확장합니다.",
      items: [
        ["01", "이야기", "목회자와 청년들의 삶과 신앙을 담는 인터뷰와 기록"],
        ["02", "칼럼", "공동체와 세상을 함께 바라보는 질문과 관점"],
        ["03", "프로젝트", "봉사와 캠페인, 마라톤처럼 가치가 행동이 되는 실천"],
      ],
      next: "#/gateway",
      nextLabel: "00 / GACHI",
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
    return el("header", { className: `brand-aa-header${compact ? " brand-aa-header--compact" : ""}` }, [
      el("a", { className: "brand-aa-brand", href: "#/gateway", "aria-label": "청파 같이 첫 화면" }, [
        el("img", { src: "./assets/images/logo.svg", alt: "", width: "28", height: "28" }),
        el("span", { text: "CHUNGPA GACHI" }),
      ]),
      el("nav", { className: "brand-aa-nav", "aria-label": "청파 같이 세 영역" }, chapters.map((chapter) =>
        el("a", { href: chapter.href, dataset: { nav: chapter.key } }, [
          el("span", { text: chapter.english }),
          el("small", { text: chapter.korean }),
        ])
      )),
      el("a", { className: "brand-aa-community", href: "#/login" }, [
        el("span", { text: "COMMUNITY" }),
        el("b", { text: "↗", "aria-hidden": "true" }),
      ]),
    ]);
  }

  function heroDoor(chapter) {
    return el("a", {
      className: `brand-aa-door brand-aa-door--${chapter.key}`,
      href: chapter.href,
      dataset: { door: chapter.key },
      "aria-label": `${chapter.english} — ${chapter.korean}`,
    }, [
      el("span", { className: "brand-aa-door__glow", "aria-hidden": "true" }),
      el("div", { className: "brand-aa-door__top" }, [
        el("span", { text: chapter.number }),
        el("span", { text: chapter.meta }),
      ]),
      el("div", { className: "brand-aa-door__word", "aria-hidden": "true" }, [
        el("strong", { text: chapter.english }),
        el("span", { text: chapter.cue }),
      ]),
      el("div", { className: "brand-aa-door__copy" }, [
        el("h2", { text: chapter.korean }),
        el("p", { text: chapter.lead }),
        el("span", { className: "brand-aa-door__open" }, [
          el("span", { text: "EXPLORE" }),
          el("b", { text: "↗", "aria-hidden": "true" }),
        ]),
      ]),
    ]);
  }

  function bindGateway(main) {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    main.querySelectorAll("[data-door]").forEach((door) => {
      door.addEventListener("pointermove", (event) => {
        const rect = door.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / Math.max(rect.width, 1)) * 100;
        const y = ((event.clientY - rect.top) / Math.max(rect.height, 1)) * 100;
        door.style.setProperty("--aa-x", `${x.toFixed(1)}%`);
        door.style.setProperty("--aa-y", `${y.toFixed(1)}%`);
      });
      door.addEventListener("pointerleave", () => {
        door.style.removeProperty("--aa-x");
        door.style.removeProperty("--aa-y");
      });
    });

    const manifesto = main.querySelector(".brand-aa-manifesto");
    manifesto?.addEventListener("pointermove", (event) => {
      const rect = manifesto.getBoundingClientRect();
      manifesto.style.setProperty("--aa-manifesto-x", `${(((event.clientX - rect.left) / Math.max(rect.width, 1)) * 100).toFixed(1)}%`);
      manifesto.style.setProperty("--aa-manifesto-y", `${(((event.clientY - rect.top) / Math.max(rect.height, 1)) * 100).toFixed(1)}%`);
    });
  }

  function renderGateway() {
    const main = el("main", { id: "brand-main-content", className: "brand-aa-shell", tabindex: "-1" }, [
      header(),
      el("section", { className: "brand-aa-hero", "aria-labelledby": "brand-aa-title" }, [
        el("div", { className: "brand-aa-hero__intro" }, [
          el("div", {}, [
            el("span", { text: "CHEONGPA YOUTH COMMUNITY · SEOUL" }),
            el("h1", { id: "brand-aa-title" }, [
              "같이 살아가고, 같이 만들어가며,",
              el("br"),
              el("em", { text: "같은 가치를 바라보는 청파청년부." }),
            ]),
          ]),
          el("p", { text: "‘청파 같이’의 세 가지 의미가 곧 사이트의 세 가지 입구가 됩니다." }),
        ]),
        el("div", { className: "brand-aa-deck", "aria-label": "청파 같이 세 가지 의미" }, chapters.map(heroDoor)),
      ]),
      el("section", { className: "brand-aa-manifesto", "aria-labelledby": "brand-aa-manifesto-title" }, [
        el("div", { className: "brand-aa-manifesto__meta" }, [
          el("span", { text: "ONE NAME / THREE MEANINGS" }),
          el("span", { text: "GACHI IS A VERB" }),
        ]),
        el("h2", { id: "brand-aa-manifesto-title" }, [
          el("span", { text: "같이 닮고" }),
          el("span", { text: "같이 살아가고" }),
          el("span", {}, ["가치를 ", el("em", { text: "같이" }), " 나눕니다"]),
        ]),
        el("p", { text: "청파 같이는 소개 페이지보다 공동체의 방향을 보여주는 하나의 움직이는 문장에 가깝습니다." }),
      ]),
      el("section", { className: "brand-aa-directory", "aria-labelledby": "brand-aa-directory-title" }, [
        el("div", { className: "brand-aa-directory__head" }, [
          el("span", { text: "SITE DIRECTORY / 03" }),
          el("h2", { id: "brand-aa-directory-title", text: "무엇을 만나게 될까요?" }),
          el("p", { text: "공식 사이트로 확장될 때의 콘텐츠 구조를 세 가지 의미 안에 그대로 담았습니다." }),
        ]),
        el("div", { className: "brand-aa-directory__rows" }, [
          ["01", "LIKE", "같이 닮다", "청파의 정신 · 예배 · 말씀", "#/like", "like"],
          ["02", "TOGETHER", "같이 하다", "청년부 소식 · 모임 · 활동", "#/together", "together"],
          ["03", "VALUE", "가치를 나누다", "이야기 · 칼럼 · 프로젝트", "#/value", "value"],
        ].map((item) => el("a", { className: `brand-aa-directory__row brand-aa-directory__row--${item[5]}`, href: item[4] }, [
          el("span", { text: item[0] }),
          el("strong", { text: item[1] }),
          el("em", { text: item[2] }),
          el("p", { text: item[3] }),
          el("b", { text: "↗", "aria-hidden": "true" }),
        ]))),
      ]),
      el("section", { className: "brand-aa-domain" }, [
        el("span", { text: "A NAME TO GROW WITH" }),
        el("strong", { text: "chungpagachi.kr" }),
        el("p", { text: "교회와 청청이 사용해 온 ‘chungpa’ 표기를 이어, 하나의 이름으로 기억될 수 있도록." }),
      ]),
      el("footer", { className: "brand-aa-footer" }, [
        el("span", { text: "CHUNGPA GACHI" }),
        el("span", { text: "LIKE · TOGETHER · VALUE" }),
        el("span", { text: "© 2026" }),
      ]),
    ]);
    root.replaceChildren(main);
    bindGateway(main);
  }

  function renderDetail(type) {
    const content = details[type];
    if (!content) return renderGateway();
    const main = el("main", { id: "brand-main-content", className: `brand-aa-detail brand-aa-detail--${type}`, tabindex: "-1" }, [
      header(true),
      el("section", { className: "brand-aa-detail__hero" }, [
        el("div", { className: "brand-aa-detail__rail" }, [
          el("span", { text: content.number }),
          el("a", { href: "#/gateway", text: "← ALL THREE" }),
        ]),
        el("div", { className: "brand-aa-detail__word", "aria-hidden": "true" }, [
          el("strong", { text: content.english }),
          el("span", { text: content.meta }),
        ]),
        el("div", { className: "brand-aa-detail__copy" }, [
          el("span", { text: content.meta }),
          el("h1", { text: content.korean }),
          el("h2", { text: content.statement }),
          el("p", { text: content.lead }),
          content.appLink ? el("a", { className: "brand-aa-detail__app", href: "#/login" }, [
            el("span", { text: "커뮤니티 들어가기" }),
            el("b", { text: "↗", "aria-hidden": "true" }),
          ]) : null,
        ]),
      ]),
      el("section", { className: "brand-aa-detail__contents", "aria-label": `${content.korean} 콘텐츠 구성` }, content.items.map((item) =>
        el("article", { className: "brand-aa-detail__item" }, [
          el("span", { text: item[0] }),
          el("h3", { text: item[1] }),
          el("p", { text: item[2] }),
          el("em", { text: "COMING SOON" }),
        ])
      )),
      el("a", { className: "brand-aa-detail__next", href: content.next }, [
        el("span", { text: "NEXT DIRECTION" }),
        el("strong", { text: `${content.nextLabel} →` }),
      ]),
      el("footer", { className: "brand-aa-footer" }, [
        el("span", { text: "CHUNGPA GACHI" }),
        el("span", { text: "LIKE · TOGETHER · VALUE" }),
        el("span", { text: "© 2026" }),
      ]),
    ]);
    root.replaceChildren(main);
    main.querySelectorAll("[data-nav]").forEach((node) => {
      node.dataset.current = String(node.dataset.nav === type);
    });
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
    } else if (path === "/together") {
      document.title = "같이 하다 | 청파 같이";
      renderDetail("together");
    } else if (path === "/value") {
      document.title = "가치를 나누다 | 청파 같이";
      renderDetail("value");
    } else {
      document.title = "청파 같이 | Like · Together · Value";
      renderGateway();
    }
  }

  root.addEventListener("click", (event) => {
    const anchor = event.target.closest("a[href^='#/']");
    if (!anchor) return;
    const href = anchor.getAttribute("href");
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

  window.addEventListener("popstate", renderRoute);
  window.addEventListener("hashchange", renderRoute);
  document.getElementById("skip-link")?.addEventListener("click", () => {
    if (document.documentElement.dataset.brandPublic === "true") document.getElementById("brand-main-content")?.focus();
  });
  renderRoute();
})();
