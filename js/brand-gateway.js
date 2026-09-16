(() => {
  const PUBLIC_ROUTES = new Set(["/gateway", "/like", "/value"]);
  const root = document.getElementById("brand-gateway-root");
  if (!root) return;

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
      else if (value === true) node.setAttribute(key, "");
      else node.setAttribute(key, String(value));
    });
    (Array.isArray(children) ? children : [children]).forEach((child) => {
      if (child == null || child === false) return;
      node.append(child instanceof Node ? child : document.createTextNode(String(child)));
    });
    return node;
  };

  const directions = [
    {
      number: "01",
      type: "like",
      english: "LIKE",
      korean: "같이 닮다",
      short: "닮다",
      kicker: "WORSHIP · WORD",
      description: "예배와 말씀 안에서 같은 방향을 닮아갑니다.",
      href: "#/like",
    },
    {
      number: "02",
      type: "value",
      english: "VALUE",
      korean: "가치를 나누다",
      short: "나누다",
      kicker: "STORY · PROJECT",
      description: "사람과 세상을 향한 가치를 이야기하고 실천합니다.",
      href: "#/value",
    },
    {
      number: "03",
      type: "together",
      english: "TOGETHER",
      korean: "같이 하다",
      short: "함께",
      kicker: "COMMUNITY · ACTIVITY",
      description: "소식과 모임, 활동으로 공동체의 오늘을 만듭니다.",
      href: "#/login",
    },
  ];

  const storyContent = {
    like: {
      number: "01",
      english: "LIKE",
      title: "같이 닮다",
      lead: "예배와 말씀 안에서 예수님의 마음을 배우고, 청파가 걸어온 신앙의 방향을 오늘의 삶으로 이어갑니다.",
      quote: "닮아감은 결국 누군가의 곁에 서는 방식이 됩니다.",
      items: [
        ["01.1", "청파의 정신", "약자의 곁에 서고 평화를 사랑하는 청파의 신앙과 공동체 정신"],
        ["01.2", "예배", "청파청년부 예배와 메시지를 다시 만나는 아카이브"],
        ["01.3", "말씀", "함께 묵상하고 삶으로 이어갈 말씀과 기록"],
      ],
    },
    value: {
      number: "02",
      english: "VALUE",
      title: "가치를 나누다",
      lead: "우리가 중요하게 여기는 마음을 사람의 이야기와 생각, 프로젝트로 확장해 세상과 나눕니다.",
      quote: "가치는 말보다 곁에 서는 구체적인 선택에서 선명해집니다.",
      items: [
        ["02.1", "이야기", "목회자와 청년들의 삶, 신앙, 돌봄과 평화의 이야기"],
        ["02.2", "칼럼", "사회와 공동체를 함께 바라보는 질문과 관점"],
        ["02.3", "프로젝트", "봉사와 캠페인, 연대와 평화로 이어지는 실천"],
      ],
    },
  };

  function header(compact = false) {
    return create("header", { className: `brand-i-header${compact ? " brand-i-header--compact" : ""}` }, [
      create("a", { className: "brand-i-logo", href: "#/gateway", "aria-label": "청파 같이 첫 화면" }, [
        create("img", { src: "./assets/images/logo.svg", alt: "", width: "30", height: "30" }),
        create("span", { text: "CHEONGPA GACHI" }),
      ]),
      create("div", { className: "brand-i-header__status", "aria-hidden": "true" }, [
        create("i"),
        create("span", { text: "SEOUL · 2026 / OPEN INDEX" }),
      ]),
      create("a", { className: "brand-i-community", href: "#/login" }, [
        create("span", { text: "TOGETHER" }),
        create("b", { text: "↗", "aria-hidden": "true" }),
      ]),
    ]);
  }

  function wordMark(word, className) {
    return create("span", { className, "aria-hidden": "true" }, word.split("").map((letter, index) =>
      create("i", { text: letter, style: `--letter-index:${index}` })
    ));
  }

  function routeCard(item) {
    return create("a", {
      className: `brand-i-card brand-i-card--${item.type}`,
      href: item.href,
      dataset: { routeCard: item.type },
      "aria-label": `${item.english.charAt(0)}${item.english.slice(1).toLowerCase()} — ${item.korean}`,
    }, [
      create("div", { className: "brand-i-card__top" }, [
        create("span", { text: item.number }),
        create("span", { text: item.kicker }),
      ]),
      create("div", { className: "brand-i-card__body" }, [
        create("strong", { text: item.english }),
        create("h2", { text: item.korean }),
        create("p", { text: item.description }),
      ]),
      create("div", { className: "brand-i-card__art", "aria-hidden": "true" }, [
        create("span", { className: "brand-i-card__shape brand-i-card__shape--a" }),
        create("span", { className: "brand-i-card__shape brand-i-card__shape--b" }),
        create("span", { className: "brand-i-card__shape brand-i-card__shape--c" }),
        create("em", { text: item.short }),
      ]),
      create("div", { className: "brand-i-card__foot" }, [
        create("span", { text: "OPEN" }),
        create("span", { text: "↗", "aria-hidden": "true" }),
      ]),
    ]);
  }

  function bindGatewayMotion(shell) {
    const board = shell.querySelector(".brand-i-board");
    const cards = [...shell.querySelectorAll("[data-route-card]")];
    const hero = shell.querySelector(".brand-i-hero");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    cards.forEach((card, index) => {
      const activate = () => {
        board?.style.setProperty("--active-card", String(index));
        board?.setAttribute("data-active", card.dataset.routeCard);
        cards.forEach((candidate) => candidate.dataset.active = String(candidate === card));
      };
      card.addEventListener("pointerenter", activate);
      card.addEventListener("focus", activate);
      card.addEventListener("pointermove", (event) => {
        if (reduceMotion) return;
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / Math.max(rect.width, 1);
        const y = (event.clientY - rect.top) / Math.max(rect.height, 1);
        card.style.setProperty("--mx", `${(x * 100).toFixed(2)}%`);
        card.style.setProperty("--my", `${(y * 100).toFixed(2)}%`);
        card.style.setProperty("--rx", `${((.5 - y) * 3).toFixed(2)}deg`);
        card.style.setProperty("--ry", `${((x - .5) * 4).toFixed(2)}deg`);
      });
      card.addEventListener("pointerleave", () => {
        card.style.setProperty("--rx", "0deg");
        card.style.setProperty("--ry", "0deg");
      });
    });

    if (!reduceMotion && hero) {
      hero.addEventListener("pointermove", (event) => {
        const rect = hero.getBoundingClientRect();
        const x = (event.clientX - rect.left) / Math.max(rect.width, 1) - .5;
        const y = (event.clientY - rect.top) / Math.max(rect.height, 1) - .5;
        hero.style.setProperty("--hero-x", x.toFixed(3));
        hero.style.setProperty("--hero-y", y.toFixed(3));
      });
      hero.addEventListener("pointerleave", () => {
        hero.style.setProperty("--hero-x", "0");
        hero.style.setProperty("--hero-y", "0");
      });
    }

    const reveal = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.dataset.revealed = "true";
      });
    }, { threshold: .12 });
    shell.querySelectorAll("[data-reveal]").forEach((node) => reveal.observe(node));
  }

  function renderGateway() {
    const tickerItems = ["HELP THE WEAK", "LOVE PEACE", "LIKE", "VALUE", "TOGETHER", "CHEONGPA GACHI"];
    const shell = create("main", { id: "brand-main-content", className: "brand-i-shell", tabindex: "-1" }, [
      header(),
      create("section", { className: "brand-i-hero", "aria-labelledby": "brand-i-title" }, [
        create("div", { className: "brand-i-hero__left" }, [
          create("span", { className: "brand-i-eyebrow", text: "CHEONGPA YOUTH COMMUNITY / INDEX 001" }),
          create("h1", { id: "brand-i-title", className: "brand-i-title", "aria-label": "청파 같이" }, [
            wordMark("같이", "brand-i-title__ko"),
            create("span", { className: "brand-i-title__en", text: "GACHI" }),
          ]),
          create("p", { className: "brand-i-hero__lead", text: "닮고, 나누고, 함께하는 청파의 세 가지 ‘같이’를 움직이는 인덱스로 만나보세요." }),
        ]),
        create("div", { className: "brand-i-hero__right", "aria-hidden": "true" }, [
          create("div", { className: "brand-i-stack brand-i-stack--one" }, [create("small", { text: "01" }), create("strong", { text: "닮고" })]),
          create("div", { className: "brand-i-stack brand-i-stack--two" }, [create("small", { text: "02" }), create("strong", { text: "나누고" })]),
          create("div", { className: "brand-i-stack brand-i-stack--three" }, [create("small", { text: "03" }), create("strong", { text: "함께" })]),
          create("div", { className: "brand-i-hero__seal" }, [create("span", { text: "CARE" }), create("i", { text: "＋" }), create("span", { text: "PEACE" })]),
        ]),
        create("span", { className: "brand-i-hero__hint", text: "MOVE YOUR POINTER ↓" }),
      ]),
      create("div", { className: "brand-i-ticker", "aria-label": "청파 같이 핵심 키워드" }, [
        create("div", { className: "brand-i-ticker__track" },
          [...tickerItems, ...tickerItems].map((item, index) => create("span", { text: item }, [
            index % 2 ? null : create("i", { "aria-hidden": "true" }),
          ]))
        ),
      ]),
      create("section", { className: "brand-i-index", "aria-labelledby": "brand-i-index-title", dataset: { reveal: "" } }, [
        create("div", { className: "brand-i-index__intro" }, [
          create("span", { text: "THE LIVING INDEX" }),
          create("h2", { id: "brand-i-index-title", text: "세 방향을 직접 움직여 보세요." }),
          create("p", { text: "마우스를 올리면 선택한 영역이 넓어지고, 정보와 그래픽이 함께 반응합니다." }),
        ]),
        create("div", { className: "brand-i-board", dataset: { active: "like" } }, directions.map(routeCard)),
      ]),
      create("section", { className: "brand-i-manifesto", dataset: { reveal: "" } }, [
        create("div", { className: "brand-i-manifesto__label" }, [
          create("span", { text: "OUR COMMON DIRECTION" }),
          create("span", { text: "CHEONGPA / SEOUL" }),
        ]),
        create("div", { className: "brand-i-manifesto__copy" }, [
          create("p", { text: "약한 이의 곁에 서고," }),
          create("p", { text: "평화를 사랑하며," }),
          create("p", { text: "함께 살아가는 공동체." }),
        ]),
        create("div", { className: "brand-i-manifesto__rail", "aria-hidden": "true" }, [
          create("span", { text: "CARE · PEACE · COMMUNITY · CARE · PEACE · COMMUNITY · CARE · PEACE · COMMUNITY" }),
        ]),
      ]),
      create("section", { className: "brand-i-directory", "aria-label": "청파 같이 바로가기", dataset: { reveal: "" } },
        directions.map((item) => create("a", { href: item.href, className: `brand-i-directory__row brand-i-directory__row--${item.type}` }, [
          create("span", { text: item.number }),
          create("strong", { text: item.english }),
          create("em", { text: item.korean }),
          create("i", { text: "↗", "aria-hidden": "true" }),
        ]))
      ),
      create("footer", { className: "brand-i-footer" }, [
        create("span", { text: "CHEONGPA GACHI" }),
        create("span", { text: "LIKE · VALUE · TOGETHER" }),
        create("span", { text: "© 2026" }),
      ]),
    ]);
    root.replaceChildren(shell);
    bindGatewayMotion(shell);
  }

  function renderStory(type) {
    const content = storyContent[type];
    const nextHref = type === "like" ? "#/value" : "#/login";
    const nextLabel = type === "like" ? "VALUE" : "TOGETHER";
    root.replaceChildren(create("main", { id: "brand-main-content", className: `brand-i-detail brand-i-detail--${type}`, tabindex: "-1" }, [
      header(true),
      create("section", { className: "brand-i-detail__hero", "aria-labelledby": "brand-i-detail-title" }, [
        create("aside", { className: "brand-i-detail__index" }, [
          create("strong", { text: content.number }),
          create("span", { text: "INDEX / CHEONGPA GACHI" }),
        ]),
        create("div", { className: "brand-i-detail__copy" }, [
          create("span", { text: content.english }),
          create("h1", { id: "brand-i-detail-title", text: content.title }),
          create("p", { text: content.lead }),
        ]),
        create("blockquote", { className: "brand-i-detail__quote" }, [
          create("span", { text: "COMMON DIRECTION" }),
          create("p", { text: content.quote }),
        ]),
      ]),
      create("section", { className: "brand-i-detail__grid", "aria-label": `${content.title} 콘텐츠 영역` },
        content.items.map(([number, title, description], index) => create("article", { className: "brand-i-detail__card", style: `--detail-index:${index}` }, [
          create("div", { className: "brand-i-detail__card-top" }, [create("span", { text: number }), create("em", { text: "COMING SOON" })]),
          create("h2", { text: title }),
          create("p", { text: description }),
          create("i", { "aria-hidden": "true" }),
        ]))
      ),
      create("footer", { className: "brand-i-detail__footer" }, [
        create("a", { href: "#/gateway", text: "← GATEWAY" }),
        create("a", { href: nextHref }, [create("span", { text: `NEXT · ${nextLabel}` }), create("b", { text: "↗", "aria-hidden": "true" })]),
      ]),
    ]));
  }

  function setPublicMode(active) {
    const wasPublic = document.documentElement.dataset.brandPublic === "true";
    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (active) {
      document.documentElement.dataset.brandPublic = "true";
      themeColor?.setAttribute("content", "#f5f1e7");
      root.hidden = false;
      return;
    }
    delete document.documentElement.dataset.brandPublic;
    themeColor?.setAttribute("content", "#9fcfdf");
    root.hidden = true;
    root.replaceChildren();
    if (wasPublic) window.dispatchEvent(new Event("brand:enter-app"));
  }

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
    window.requestAnimationFrame(() => document.getElementById("brand-main-content")?.focus({ preventScroll: true }));
  }

  window.addEventListener("hashchange", render);
  render();
})();