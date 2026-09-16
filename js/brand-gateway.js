(() => {
  const PUBLIC_ROUTES = new Set(["/gateway", "/like", "/value"]);
  const root = document.getElementById("brand-gateway-root");
  if (!root) return;

  const chapters = [
    {
      index: "01",
      type: "like",
      english: "LIKE",
      title: "같이 닮다",
      kicker: "WORSHIP · SPIRIT",
      lead: "예배와 말씀 안에서 같은 방향을 바라보고, 우리가 닮아가고 싶은 믿음의 모습을 함께 배웁니다.",
      href: "#/like",
      cta: "Like 더 알아보기",
      note: "청파의 정신 · 예배 · 말씀",
    },
    {
      index: "02",
      type: "value",
      english: "VALUE",
      title: "가치를 나누다",
      kicker: "STORY · PROJECT",
      lead: "한 사람의 이야기에서 공동체의 질문으로. 우리가 중요하게 여기는 가치가 글과 실천으로 이어집니다.",
      href: "#/value",
      cta: "Value 더 알아보기",
      note: "이야기 · 칼럼 · 프로젝트",
    },
    {
      index: "03",
      type: "together",
      english: "TOGETHER",
      title: "같이 하다",
      kicker: "COMMUNITY · ACTIVITY",
      lead: "소식과 모임, 활동과 광고를 한곳에서 나누며 오늘의 청파청년부를 실제로 함께 만들어갑니다.",
      href: "#/login",
      cta: "Together 들어가기",
      note: "소식 · 모임 · 활동",
    },
  ];

  const storyContent = {
    like: {
      index: "01",
      english: "LIKE",
      title: "같이 닮다",
      kicker: "WORSHIP · SPIRIT",
      lead: "같은 모습을 복제하는 것이 아니라 같은 방향을 바라보는 일. 청파의 예배와 말씀, 공동체의 정신을 통해 우리가 닮아갈 모습을 발견합니다.",
      items: [
        ["01", "청파의 정신", "청파교회와 청년부가 이어가는 믿음의 방향과 공동체의 태도"],
        ["02", "예배", "청파청년부 예배와 메시지를 다시 만나고 이어가는 아카이브"],
        ["03", "말씀", "함께 묵상하고 일상에서 살아내기 위한 말씀과 기록"],
      ],
    },
    value: {
      index: "02",
      english: "VALUE",
      title: "가치를 나누다",
      kicker: "STORY · PROJECT",
      lead: "가치는 설명보다 이야기와 실천 속에서 선명해집니다. 청파의 사람들이 살아낸 생각과 질문, 프로젝트를 한곳에 기록합니다.",
      items: [
        ["01", "이야기", "목회자와 청년이 나누는 삶과 신앙의 목소리"],
        ["02", "칼럼", "함께 오래 생각해 보고 싶은 질문과 관점을 담은 글"],
        ["03", "프로젝트", "봉사와 캠페인처럼 공동체 밖으로 이어지는 청년들의 실천"],
      ],
    },
  };

  const routePath = () => {
    const raw = window.location.hash.replace(/^#/, "") || "/gateway";
    return `/${raw.split("?")[0]}`.replace(/\/+/g, "/").replace(/\/$/, "") || "/";
  };

  const create = (tag, options = {}, children = []) => {
    const node = document.createElement(tag);
    Object.entries(options).forEach(([key, value]) => {
      if (value == null || value === false) return;
      if (key === "className") node.className = value;
      else if (key === "text") node.textContent = String(value);
      else if (key === "dataset") Object.assign(node.dataset, value);
      else if (key === "style") Object.assign(node.style, value);
      else if (value === true) node.setAttribute(key, "");
      else node.setAttribute(key, String(value));
    });
    const list = Array.isArray(children) ? children : [children];
    list.forEach((child) => {
      if (child == null || child === false) return;
      node.append(child instanceof Node ? child : document.createTextNode(String(child)));
    });
    return node;
  };

  const wordmark = () => create("a", {
    className: "brand-b__wordmark",
    href: "#/gateway",
    "aria-label": "청파 같이 첫 화면",
  }, [
    create("img", { src: "./assets/images/logo.svg", alt: "", width: "34", height: "34" }),
    create("span", { text: "청파 같이" }),
  ]);

  const chapterSymbol = (type) => create("div", {
    className: `brand-b-symbol brand-b-symbol--${type}`,
    "aria-hidden": "true",
  }, [
    create("span", { className: "brand-b-symbol__shape brand-b-symbol__shape--one" }),
    create("span", { className: "brand-b-symbol__shape brand-b-symbol__shape--two" }),
    create("span", { className: "brand-b-symbol__shape brand-b-symbol__shape--three" }),
    create("span", { className: "brand-b-symbol__core" }),
  ]);

  const header = () => create("header", { className: "brand-b__header" }, [
    wordmark(),
    create("p", { className: "brand-b__header-note", text: "LIKE · VALUE · TOGETHER" }),
    create("a", { className: "brand-b__header-enter", href: "#/login", text: "Together →" }),
  ]);

  const progressNav = () => create("nav", {
    className: "brand-b-progress",
    "aria-label": "세 가지 의미 바로가기",
  }, chapters.map((chapter) => create("button", {
    className: "brand-b-progress__item",
    type: "button",
    dataset: { brandTarget: chapter.type },
    "aria-label": `${chapter.index} ${chapter.title}로 이동`,
  }, [
    create("span", { className: "brand-b-progress__number", text: chapter.index }),
    create("span", { className: "brand-b-progress__line", "aria-hidden": "true" }),
    create("span", { className: "brand-b-progress__name", text: chapter.english }),
  ])));

  const chapterScene = (chapter) => create("section", {
    className: `brand-b-chapter brand-b-chapter--${chapter.type}`,
    id: `brand-${chapter.type}`,
    dataset: { brandChapter: chapter.type },
    "aria-labelledby": `brand-${chapter.type}-title`,
  }, [
    create("div", { className: "brand-b-chapter__sticky" }, [
      create("div", { className: "brand-b-chapter__ghost", text: chapter.english, "aria-hidden": "true" }),
      create("div", { className: "brand-b-chapter__grid" }, [
        create("div", { className: "brand-b-chapter__copy" }, [
          create("div", { className: "brand-b-chapter__meta" }, [
            create("span", { text: chapter.index }),
            create("span", { text: chapter.kicker }),
          ]),
          create("p", { className: "brand-b-chapter__english", text: chapter.english }),
          create("h2", { id: `brand-${chapter.type}-title`, text: chapter.title }),
          create("p", { className: "brand-b-chapter__lead", text: chapter.lead }),
          create("p", { className: "brand-b-chapter__note", text: chapter.note }),
          create("a", {
            className: "brand-b-chapter__cta",
            href: chapter.href,
            "aria-label": `${chapter.english[0]}${chapter.english.slice(1).toLowerCase()} — ${chapter.title}`,
          }, [
            create("span", { text: chapter.cta }),
            create("span", { text: "↗", "aria-hidden": "true" }),
          ]),
        ]),
        create("div", { className: "brand-b-chapter__visual" }, [
          create("div", { className: "brand-b-chapter__visual-frame" }, [
            chapterSymbol(chapter.type),
            create("span", { className: "brand-b-chapter__orbit brand-b-chapter__orbit--top", text: chapter.kicker }),
            create("span", { className: "brand-b-chapter__orbit brand-b-chapter__orbit--bottom", text: "CHEONGPA GACHI" }),
          ]),
        ]),
      ]),
    ]),
  ]);

  const choiceCard = (chapter) => create("a", {
    className: `brand-b-choice brand-b-choice--${chapter.type}`,
    href: chapter.href,
  }, [
    create("span", { className: "brand-b-choice__index", text: chapter.index }),
    create("div", {}, [
      create("strong", { text: chapter.english[0] + chapter.english.slice(1).toLowerCase() }),
      create("span", { text: chapter.title }),
    ]),
    create("span", { className: "brand-b-choice__arrow", text: "↗", "aria-hidden": "true" }),
  ]);

  function renderGateway() {
    const main = create("main", {
      id: "brand-main-content",
      className: "brand-b",
      tabindex: "-1",
    }, [
      header(),
      create("section", { className: "brand-b-hero", "aria-labelledby": "brand-b-title" }, [
        create("div", { className: "brand-b-hero__eyebrow" }, [
          create("span", { text: "CHEONGPA YOUTH COMMUNITY" }),
          create("span", { text: "THREE WAYS OF GACHI" }),
        ]),
        create("div", { className: "brand-b-hero__layout" }, [
          create("div", { className: "brand-b-hero__headline" }, [
            create("h1", { id: "brand-b-title" }, [
              create("span", { text: "같이라는 말에는" }),
              create("span", { text: "세 가지 방향이" }),
              create("span", { text: "있습니다." }),
            ]),
          ]),
          create("div", { className: "brand-b-hero__aside" }, [
            create("p", { text: "닮아가고, 나누고, 함께하는 것." }),
            create("p", { text: "세 장면을 천천히 내려가며 청파 같이의 의미를 만나보세요." }),
          ]),
        ]),
        create("div", { className: "brand-b-hero__summary", "aria-label": "세 가지 의미" },
          chapters.map((chapter) => create("button", {
            className: `brand-b-hero__summary-item brand-b-hero__summary-item--${chapter.type}`,
            type: "button",
            dataset: { brandTarget: chapter.type },
          }, [
            create("span", { text: chapter.index }),
            create("strong", { text: chapter.english[0] + chapter.english.slice(1).toLowerCase() }),
            create("small", { text: chapter.title }),
          ]))),
        create("button", {
          className: "brand-b-hero__scroll",
          type: "button",
          dataset: { brandTarget: "like" },
          "aria-label": "첫 번째 의미로 스크롤",
        }, [
          create("span", { text: "SCROLL TO EXPLORE" }),
          create("span", { className: "brand-b-hero__scroll-mark", "aria-hidden": "true" }),
        ]),
      ]),
      progressNav(),
      create("div", { className: "brand-b-scenes" }, chapters.map(chapterScene)),
      create("section", { className: "brand-b-closing", "aria-labelledby": "brand-b-closing-title" }, [
        create("p", { className: "brand-b-closing__eyebrow", text: "ONE COMMUNITY · THREE DIRECTIONS" }),
        create("h2", { id: "brand-b-closing-title" }, [
          create("span", { text: "세 가지의 같이," }),
          create("span", { text: "하나의 청파." }),
        ]),
        create("p", { className: "brand-b-closing__lead", text: "지금 필요한 장면에서 시작해도 괜찮습니다. 결국 세 방향은 하나의 공동체로 이어집니다." }),
        create("div", { className: "brand-b-closing__choices" }, chapters.map(choiceCard)),
        create("footer", { className: "brand-b-closing__footer" }, [
          create("span", { text: "CHEONGPA GACHI" }),
          create("span", { text: "LIKE · VALUE · TOGETHER" }),
        ]),
      ]),
    ]);
    root.replaceChildren(main);
    setupGatewayMotion(main);
  }

  function renderStory(type) {
    const content = storyContent[type];
    const related = type === "like" ? chapters[1] : chapters[2];
    const main = create("main", {
      id: "brand-main-content",
      className: `brand-b-story brand-b-story--${type}`,
      tabindex: "-1",
    }, [
      header(),
      create("section", { className: "brand-b-story__hero", "aria-labelledby": "brand-b-story-title" }, [
        create("div", { className: "brand-b-story__intro" }, [
          create("span", { className: "brand-b-story__index", text: content.index }),
          create("p", { className: "brand-b-story__kicker", text: content.kicker }),
          create("p", { className: "brand-b-story__english", text: content.english }),
          create("h1", { id: "brand-b-story-title", text: content.title }),
          create("p", { className: "brand-b-story__lead", text: content.lead }),
        ]),
        create("div", { className: "brand-b-story__symbol" }, chapterSymbol(type)),
      ]),
      create("section", { className: "brand-b-story__list", "aria-label": `${content.title} 콘텐츠 영역` },
        content.items.map(([index, title, description]) => create("article", { className: "brand-b-story-row" }, [
          create("span", { className: "brand-b-story-row__index", text: index }),
          create("h2", { text: title }),
          create("p", { text: description }),
          create("span", { className: "brand-b-story-row__status", text: "준비 중" }),
        ]))),
      create("section", { className: "brand-b-story__next" }, [
        create("a", { href: "#/gateway", className: "brand-b-story__back", text: "← 세 가지 의미로 돌아가기" }),
        create("a", { href: related.href, className: "brand-b-story__next-link" }, [
          create("span", { text: `다음 장면 · ${related.english[0] + related.english.slice(1).toLowerCase()}` }),
          create("strong", { text: related.title }),
          create("span", { text: "↗", "aria-hidden": "true" }),
        ]),
      ]),
    ]);
    root.replaceChildren(main);
    window.requestAnimationFrame(() => main.classList.add("is-ready"));
  }

  let cleanupMotion = () => {};

  function setupGatewayMotion(main) {
    cleanupMotion();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const chapterElements = [...main.querySelectorAll("[data-brand-chapter]")];
    const targetButtons = [...main.querySelectorAll("[data-brand-target]")];
    const progressItems = [...main.querySelectorAll(".brand-b-progress__item")];

    const activate = (type) => {
      document.documentElement.dataset.brandTheme = type;
      progressItems.forEach((item) => {
        const active = item.dataset.brandTarget === type;
        item.classList.toggle("is-active", active);
        if (active) item.setAttribute("aria-current", "step");
        else item.removeAttribute("aria-current");
      });
    };

    const observers = [];
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) activate(visible.target.dataset.brandChapter);
      }, { threshold: [0.3, 0.5, 0.7], rootMargin: "-18% 0px -32%" });
      chapterElements.forEach((element) => observer.observe(element));
      observers.push(observer);
    }

    const onTargetClick = (event) => {
      const type = event.currentTarget.dataset.brandTarget;
      document.getElementById(`brand-${type}`)?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
    };
    targetButtons.forEach((button) => button.addEventListener("click", onTargetClick));

    let ticking = false;
    const updateScroll = () => {
      ticking = false;
      if (reducedMotion) return;
      const viewport = window.innerHeight || 1;
      chapterElements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const travel = rect.height - viewport;
        const progress = travel > 0 ? Math.min(1, Math.max(0, -rect.top / travel)) : 0;
        element.style.setProperty("--chapter-progress", progress.toFixed(4));
      });
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateScroll);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    updateScroll();

    const onPointerMove = (event) => {
      if (reducedMotion) return;
      const x = ((event.clientX / window.innerWidth) - 0.5) * 2;
      const y = ((event.clientY / window.innerHeight) - 0.5) * 2;
      main.style.setProperty("--pointer-x", x.toFixed(3));
      main.style.setProperty("--pointer-y", y.toFixed(3));
    };
    main.addEventListener("pointermove", onPointerMove, { passive: true });

    window.requestAnimationFrame(() => main.classList.add("is-ready"));

    cleanupMotion = () => {
      observers.forEach((observer) => observer.disconnect());
      targetButtons.forEach((button) => button.removeEventListener("click", onTargetClick));
      window.removeEventListener("scroll", onScroll);
      main.removeEventListener("pointermove", onPointerMove);
    };
  }

  function setPublicMode(active) {
    const wasPublic = document.documentElement.dataset.brandPublic === "true";
    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (active) {
      document.documentElement.dataset.brandPublic = "true";
      themeColor?.setAttribute("content", "#f4f1e8");
      root.hidden = false;
      return;
    }

    cleanupMotion();
    delete document.documentElement.dataset.brandPublic;
    delete document.documentElement.dataset.brandTheme;
    themeColor?.setAttribute("content", "#9fcfdf");
    root.hidden = true;
    root.replaceChildren();
    if (wasPublic) window.dispatchEvent(new Event("brand:enter-app"));
  }

  let hasRendered = false;

  function render() {
    const path = routePath();
    const isPublic = PUBLIC_ROUTES.has(path);
    setPublicMode(isPublic);
    if (!isPublic) return;

    if (path === "/like") {
      document.title = "Like · 같이 닮다 | 청파 같이";
      renderStory("like");
    } else if (path === "/value") {
      document.title = "Value · 가치를 나누다 | 청파 같이";
      renderStory("value");
    } else {
      document.title = "청파 같이 | Like · Value · Together";
      renderGateway();
    }

    window.requestAnimationFrame(() => {
      if (hasRendered) document.getElementById("brand-main-content")?.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: "auto" });
      hasRendered = true;
    });
  }

  document.getElementById("skip-link")?.addEventListener("click", (event) => {
    if (!PUBLIC_ROUTES.has(routePath())) return;
    event.stopImmediatePropagation();
    document.getElementById("brand-main-content")?.focus();
  });

  window.addEventListener("hashchange", (event) => {
    if (PUBLIC_ROUTES.has(routePath())) {
      event.stopImmediatePropagation();
      render();
      return;
    }
    window.setTimeout(render, 0);
  });

  render();
})();
