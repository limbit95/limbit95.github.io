(() => {
  const PUBLIC_ROUTES = new Set(["/gateway", "/like", "/together", "/value"]);
  const root = document.getElementById("brand-gateway-root");
  if (!root) return;

  const directions = [
    {
      key: "like",
      number: "01",
      english: "LIKE",
      korean: "같이 닮다",
      summary: "예배와 말씀 안에서 같은 방향을 바라보고, 삶으로 천천히 닮아갑니다.",
      meta: "청파의 정신 · 예배 · 말씀",
      href: "#/like",
      accent: "#8e988a",
    },
    {
      key: "together",
      number: "02",
      english: "TOGETHER",
      korean: "같이 하다",
      summary: "소식과 모임, 활동을 통해 서로의 오늘에 자리를 내어주며 함께 살아갑니다.",
      meta: "청년부 소식 · 모임 · 활동",
      href: "#/together",
      accent: "#89979d",
    },
    {
      key: "value",
      number: "03",
      english: "VALUE",
      korean: "가치를 나누다",
      summary: "사람의 이야기와 생각을 기록하고, 중요하게 여기는 가치를 삶의 실천으로 이어갑니다.",
      meta: "이야기 · 칼럼 · 프로젝트",
      href: "#/value",
      accent: "#9b867b",
    },
  ];

  const details = {
    like: {
      number: "01",
      english: "LIKE",
      title: "같이 닮다",
      lead: "예배와 말씀 안에서 예수님의 마음을 배우고, 청파가 걸어온 신앙의 방향을 오늘의 삶으로 이어갑니다.",
      accent: "#8e988a",
      items: [
        ["01", "청파의 정신", "약자의 곁에 서고 평화를 사랑하는 공동체의 방향을 소개합니다."],
        ["02", "예배", "청파청년부가 함께 드린 예배와 메시지를 다시 만나는 아카이브입니다."],
        ["03", "말씀", "묵상과 질문을 일상의 선택과 실천으로 이어가는 기록입니다."],
      ],
      next: "#/together",
      nextLabel: "TOGETHER",
    },
    together: {
      number: "02",
      english: "TOGETHER",
      title: "같이 하다",
      lead: "청파의 오늘을 서로 나누고, 실제 모임과 활동 안에서 함께 살아가는 공간입니다.",
      accent: "#89979d",
      items: [
        ["01", "청년부 소식", "예배와 공동체의 새로운 소식, 공지와 일정을 한곳에서 확인합니다."],
        ["02", "모임", "누구나 함께 제안하고 참여할 수 있는 작은 모임과 만남을 연결합니다."],
        ["03", "활동", "기존 청파 같이의 문화·야외 활동과 공동체 기능으로 이어집니다."],
      ],
      next: "#/value",
      nextLabel: "VALUE",
      community: true,
    },
    value: {
      number: "03",
      english: "VALUE",
      title: "가치를 나누다",
      lead: "목회자와 청년들의 이야기, 질문과 생각, 프로젝트를 통해 우리가 중요하게 여기는 가치를 세상과 나눕니다.",
      accent: "#9b867b",
      items: [
        ["01", "이야기", "목회자와 청년들의 삶과 신앙을 담는 인터뷰와 기록입니다."],
        ["02", "칼럼", "공동체와 세상을 함께 바라보며 질문하고 생각을 나누는 공간입니다."],
        ["03", "프로젝트", "봉사, 마라톤, 캠페인처럼 가치가 실제 행동으로 이어지는 기록입니다."],
      ],
      next: "#/like",
      nextLabel: "LIKE",
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
    return el("header", { className: `brand-ab-header${compact ? " brand-ab-header--compact" : ""}` }, [
      el("a", { className: "brand-ab-logo", href: "#/gateway", "aria-label": "청파 같이 첫 화면" }, [
        el("img", { src: "./assets/images/logo.svg", alt: "", width: "26", height: "26" }),
        el("span", { text: "CHEONGPA GACHI" }),
      ]),
      el("nav", { className: "brand-ab-nav", "aria-label": "청파 같이 세 가지 의미" }, directions.map((item) =>
        el("a", { href: item.href }, [el("span", { text: item.english }), el("small", { text: item.korean })])
      )),
      el("a", { className: "brand-ab-community", href: "#/login" }, [el("span", { text: "COMMUNITY" }), el("b", { text: "↗", "aria-hidden": "true" })]),
    ]);
  }

  function directionNote(item) {
    return el("article", {
      className: `brand-ab-note brand-ab-note--${item.key}`,
      dataset: { direction: item.key, visible: "false" },
      style: `--note-accent:${item.accent}`,
    }, [
      el("div", { className: "brand-ab-note__top" }, [el("span", { text: item.number }), el("span", { text: item.meta })]),
      el("div", { className: "brand-ab-note__title" }, [el("strong", { text: item.english }), el("h3", { text: item.korean })]),
      el("p", { text: item.summary }),
      el("a", { href: item.href, "aria-label": `${item.korean} 자세히 보기` }, [el("span", { text: "READ THIS MEANING" }), el("b", { text: "↗", "aria-hidden": "true" })]),
    ]);
  }

  function bindGateway(main) {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const stage = main.querySelector(".brand-ab-dictionary__sticky");
    const notes = [...main.querySelectorAll("[data-direction]")];
    if (!stage || !notes.length) return;

    const label = stage.querySelector("[data-active-label]");
    const index = stage.querySelector("[data-active-index]");
    const setActive = (key) => {
      const item = directions.find((entry) => entry.key === key) || directions[0];
      stage.dataset.active = item.key;
      stage.style.setProperty("--active-accent", item.accent);
      if (label) label.textContent = item.korean;
      if (index) index.textContent = item.number;
      notes.forEach((note) => { note.dataset.active = String(note.dataset.direction === item.key); });
    };

    if (!("IntersectionObserver" in window)) {
      notes.forEach((note) => { note.dataset.visible = "true"; });
      setActive("like");
    } else {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.dataset.visible = "true";
            if (entry.intersectionRatio > .48) setActive(entry.target.dataset.direction);
          }
        });
      }, { threshold: [.15, .48, .72] });
      notes.forEach((note) => observer.observe(note));
      setActive("like");
    }

    if (!reduced) {
      const hero = main.querySelector(".brand-ab-hero");
      hero?.addEventListener("pointermove", (event) => {
        const rect = hero.getBoundingClientRect();
        hero.style.setProperty("--mx", (((event.clientX - rect.left) / Math.max(rect.width, 1) - .5) * 2).toFixed(3));
        hero.style.setProperty("--my", (((event.clientY - rect.top) / Math.max(rect.height, 1) - .5) * 2).toFixed(3));
      });
      hero?.addEventListener("pointerleave", () => {
        hero.style.setProperty("--mx", "0");
        hero.style.setProperty("--my", "0");
      });
    }
  }

  function renderGateway() {
    const main = el("main", { id: "brand-main-content", className: "brand-ab-shell", tabindex: "-1" }, [
      header(),
      el("section", { className: "brand-ab-hero", "aria-labelledby": "brand-ab-title" }, [
        el("div", { className: "brand-ab-hero__edition" }, [el("span", { text: "AB / QUIET EDITORIAL" }), el("span", { text: "SEOUL · 2026" })]),
        el("div", { className: "brand-ab-hero__word" }, [
          el("span", { className: "brand-ab-hero__roman", text: "GACHI", "aria-hidden": "true" }),
          el("h1", { id: "brand-ab-title", text: "같이" }),
          el("small", { text: "[같이]  함께 · 닮음 · 같은 가치" }),
        ]),
        el("div", { className: "brand-ab-hero__copy" }, [
          el("p", { text: "같이 살아가고, 같이 만들어가며, 같은 가치를 바라보는 청파청년부." }),
          el("span", { text: "한 단어 안에 담긴 세 가지 방향을 천천히 읽어보세요." }),
        ]),
        el("div", { className: "brand-ab-hero__mark", "aria-hidden": "true" }, [el("i"), el("i"), el("i"), el("span", { text: "03" })]),
        el("a", { className: "brand-ab-scroll", href: "#brand-ab-dictionary" }, [el("span", { text: "READ THE THREE MEANINGS" }), el("b", { text: "↓", "aria-hidden": "true" })]),
      ]),
      el("section", { id: "brand-ab-dictionary", className: "brand-ab-dictionary", "aria-labelledby": "brand-ab-dictionary-title" }, [
        el("div", { className: "brand-ab-dictionary__sticky", dataset: { active: "like" }, style: "--active-accent:#8e988a" }, [
          el("span", { className: "brand-ab-dictionary__eyebrow", text: "A WORD WITH THREE DIRECTIONS" }),
          el("div", { className: "brand-ab-dictionary__headword" }, [
            el("span", { className: "brand-ab-dictionary__index", text: "01", dataset: { activeIndex: "" } }),
            el("h2", { id: "brand-ab-dictionary-title", text: "같이" }),
            el("p", { text: "청파 같이에서 ‘같이’는 단지 함께 있다는 뜻만이 아닙니다." }),
          ]),
          el("div", { className: "brand-ab-dictionary__active" }, [el("span", { text: "NOW READING" }), el("strong", { text: "같이 닮다", dataset: { activeLabel: "" } })]),
        ]),
        el("div", { className: "brand-ab-notes" }, directions.map(directionNote)),
      ]),
      el("section", { className: "brand-ab-manifesto" }, [
        el("span", { text: "ONE COMMUNITY / THREE DIRECTIONS" }),
        el("div", { className: "brand-ab-manifesto__lines" }, [
          el("p", {}, [el("em", { text: "닮고," }), " 서로의 삶을 바라봅니다."]),
          el("p", {}, [el("em", { text: "함께하고," }), " 오늘을 같이 만듭니다."]),
          el("p", {}, [el("em", { text: "나누며," }), " 우리가 믿는 가치를 살아냅니다."]),
        ]),
        el("a", { href: "#/together" }, [el("span", { text: "청파의 오늘로 들어가기" }), el("b", { text: "↗", "aria-hidden": "true" })]),
      ]),
      el("footer", { className: "brand-ab-footer" }, [
        el("div", {}, [el("strong", { text: "CHUNGPA GACHI" }), el("span", { text: "LIKE · TOGETHER · VALUE" })]),
        el("p", { text: "chungpagachi.kr" }),
        el("span", { text: "© 2026 CHEONGPA YOUTH COMMUNITY" }),
      ]),
    ]);
    root.replaceChildren(main);
    bindGateway(main);
  }

  function renderDetail(type) {
    const content = details[type];
    if (!content) return renderGateway();
    const main = el("main", { id: "brand-main-content", className: `brand-ab-detail brand-ab-detail--${type}`, tabindex: "-1", style: `--detail-accent:${content.accent}` }, [
      header(true),
      el("section", { className: "brand-ab-detail__hero" }, [
        el("div", { className: "brand-ab-detail__meta" }, [el("span", { text: `${content.number} / ${content.english}` }), el("a", { href: "#/gateway", text: "← ALL MEANINGS" })]),
        el("div", { className: "brand-ab-detail__title" }, [el("span", { text: content.english }), el("h1", { text: content.title })]),
        el("p", { className: "brand-ab-detail__lead", text: content.lead }),
      ]),
      el("section", { className: "brand-ab-detail__list", "aria-label": `${content.title} 콘텐츠 구성` }, content.items.map((item) =>
        el("article", { className: "brand-ab-detail__item" }, [
          el("span", { text: item[0] }),
          el("h2", { text: item[1] }),
          el("p", { text: item[2] }),
          el("em", { text: "COMING SOON" }),
        ])
      )),
      content.community ? el("section", { className: "brand-ab-detail__community" }, [
        el("span", { text: "FROM PUBLIC STORY TO COMMUNITY" }),
        el("h2", { text: "이제 실제 ‘같이’로 들어가 볼까요?" }),
        el("p", { text: "모임을 만들고 참여하며, 청파의 오늘을 함께 살아가는 기존 커뮤니티 기능으로 이어집니다." }),
        el("a", { href: "#/login" }, [el("span", { text: "커뮤니티 들어가기" }), el("b", { text: "↗", "aria-hidden": "true" })]),
      ]) : null,
      el("a", { className: "brand-ab-detail__next", href: content.next }, [el("span", { text: "NEXT MEANING" }), el("strong", { text: `${content.nextLabel} →` })]),
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
    else if (path === "/together") { document.title = "같이 하다 | 청파 같이"; renderDetail("together"); }
    else if (path === "/value") { document.title = "가치를 나누다 | 청파 같이"; renderDetail("value"); }
    else { document.title = "청파 같이 | Like · Together · Value"; renderGateway(); }
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

  window.addEventListener("hashchange", renderRoute);
  document.getElementById("skip-link")?.addEventListener("click", () => {
    if (document.documentElement.dataset.brandPublic === "true") document.getElementById("brand-main-content")?.focus();
  });
  renderRoute();
})();
