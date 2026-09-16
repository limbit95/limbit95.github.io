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

  const routes = [
    {
      number: "01",
      type: "like",
      english: "LIKE",
      korean: "같이 닮다",
      description: "예배와 말씀, 청파가 이어가는 신앙의 방향.",
      href: "#/like",
    },
    {
      number: "02",
      type: "value",
      english: "VALUE",
      korean: "가치를 나누다",
      description: "사람의 이야기와 생각, 프로젝트로 나누는 가치.",
      href: "#/value",
    },
    {
      number: "03",
      type: "together",
      english: "TOGETHER",
      korean: "같이 하다",
      description: "소식과 모임, 활동으로 이어지는 오늘의 공동체.",
      href: "#/login",
    },
  ];

  const storyContent = {
    like: {
      number: "01",
      english: "LIKE",
      title: "같이 닮다",
      lead: "예배와 말씀 안에서 우리가 누구를 닮아가고 어떤 신앙의 방향을 이어갈지 담는 공간입니다.",
      items: [
        ["01.1", "청파의 정신", "청파교회와 청년부가 이어가는 믿음의 방향과 정신"],
        ["01.2", "예배", "청파청년부 예배와 메시지를 다시 만나는 아카이브"],
        ["01.3", "말씀", "함께 묵상하고 삶으로 이어갈 말씀과 기록"],
      ],
    },
    value: {
      number: "02",
      english: "VALUE",
      title: "가치를 나누다",
      lead: "우리가 중요하게 여기는 가치가 사람의 이야기와 생각, 실천으로 이어지는 공간입니다.",
      items: [
        ["02.1", "이야기", "목회자와 청년들의 삶과 신앙 이야기"],
        ["02.2", "칼럼", "함께 생각하고 나누고 싶은 질문과 관점"],
        ["02.3", "프로젝트", "봉사와 캠페인, 실천으로 이어지는 프로젝트"],
      ],
    },
  };

  function header(compact = false) {
    return create("header", { className: `brand-g-header${compact ? " brand-g-header--compact" : ""}` }, [
      create("a", { className: "brand-g-logo", href: "#/gateway", "aria-label": "청파 같이 첫 화면" }, [
        create("img", { src: "./assets/images/logo.svg", alt: "", width: "30", height: "30" }),
        create("span", { text: "CHEONGPA GACHI" }),
      ]),
      create("div", { className: "brand-g-header__meta", "aria-hidden": "true" }, [
        create("span", { text: "YOUTH COMMUNITY" }),
        create("span", { text: "SEOUL · 2026" }),
      ]),
      create("nav", { className: "brand-g-header__nav", "aria-label": "브랜드 영역 바로가기" }, [
        create("a", { href: "#/like", text: "LIKE" }),
        create("a", { href: "#/value", text: "VALUE" }),
        create("a", { href: "#/login", text: "TOGETHER" }),
      ]),
    ]);
  }

  function routeVisual(type) {
    return create("div", { className: `brand-g-card__visual brand-g-card__visual--${type}`, "aria-hidden": "true" }, [
      create("span", { className: "brand-g-shape brand-g-shape--a" }),
      create("span", { className: "brand-g-shape brand-g-shape--b" }),
      create("span", { className: "brand-g-shape brand-g-shape--c" }),
      create("span", { className: "brand-g-shape brand-g-shape--d" }),
    ]);
  }

  function routeCard(item) {
    return create("a", {
      className: `brand-g-card brand-g-card--${item.type}`,
      href: item.href,
      dataset: { routeCard: item.type },
      "aria-label": `${item.english.charAt(0)}${item.english.slice(1).toLowerCase()} — ${item.korean}`,
    }, [
      create("div", { className: "brand-g-card__top" }, [
        create("span", { className: "brand-g-card__number", text: item.number }),
        create("span", { className: "brand-g-card__arrow", text: "↗", "aria-hidden": "true" }),
      ]),
      routeVisual(item.type),
      create("div", { className: "brand-g-card__copy" }, [
        create("strong", { text: item.english }),
        create("h2", { text: item.korean }),
        create("p", { text: item.description }),
      ]),
    ]);
  }

  function renderGateway() {
    const masthead = create("div", { className: "brand-g-masthead", "aria-hidden": "true" }, [
      create("span", { className: "brand-g-masthead__line brand-g-masthead__line--one", text: "CHEONGPA" }),
      create("span", { className: "brand-g-masthead__line brand-g-masthead__line--two", text: "GACHI" }),
    ]);

    const shell = create("main", {
      id: "brand-main-content",
      className: "brand-g-shell",
      tabindex: "-1",
    }, [
      header(),
      create("section", { className: "brand-g-hero", "aria-labelledby": "brand-g-title" }, [
        create("div", { className: "brand-g-hero__meta" }, [
          create("span", { text: "VOL. 01" }),
          create("span", { text: "LIKE / VALUE / TOGETHER" }),
          create("span", { text: "CHEONGPA YOUTH COMMUNITY" }),
        ]),
        create("h1", { id: "brand-g-title", className: "brand-g-sr-only", text: "청파 같이" }),
        masthead,
        create("div", { className: "brand-g-collage", "aria-hidden": "true" }, [
          create("span", { className: "brand-g-paper brand-g-paper--yellow" }),
          create("span", { className: "brand-g-paper brand-g-paper--blue" }),
          create("span", { className: "brand-g-paper brand-g-paper--coral" }),
          create("span", { className: "brand-g-paper brand-g-paper--mint" }),
          create("span", { className: "brand-g-stamp", text: "같이" }),
          create("span", { className: "brand-g-sticker", text: "THREE DIRECTIONS ↗" }),
        ]),
        create("p", { className: "brand-g-hero__caption", text: "하나의 이름 안에 서로 다른 세 개의 방향." }),
      ]),
      create("div", { className: "brand-g-ticker", "aria-hidden": "true" }, [
        create("div", { className: "brand-g-ticker__track" }, [
          create("span", { text: "LIKE · VALUE · TOGETHER · CHEONGPA GACHI · " }),
          create("span", { text: "LIKE · VALUE · TOGETHER · CHEONGPA GACHI · " }),
        ]),
      ]),
      create("section", { className: "brand-g-index", "aria-labelledby": "brand-g-index-title" }, [
        create("div", { className: "brand-g-index__intro" }, [
          create("p", { className: "brand-g-kicker", text: "CHOOSE A DIRECTION" }),
          create("h2", { id: "brand-g-index-title", text: "세 가지 같이" }),
          create("p", { text: "읽는 순서보다 먼저 눈에 들어오는 색과 형태로 세 영역을 구분했습니다." }),
        ]),
        create("nav", { className: "brand-g-grid", "aria-label": "청파 같이 세 가지 영역" }, routes.map(routeCard)),
      ]),
      create("section", { className: "brand-g-statement", "aria-label": "청파 같이 브랜드 구성" }, [
        create("p", { text: "LIKE" }),
        create("span", { text: "→" }),
        create("p", { text: "VALUE" }),
        create("span", { text: "→" }),
        create("p", { text: "TOGETHER" }),
      ]),
      create("footer", { className: "brand-g-footer" }, [
        create("span", { text: "CHEONGPA GACHI" }),
        create("span", { text: "YOUTH COMMUNITY · SEOUL" }),
        create("span", { text: "2026" }),
      ]),
    ]);

    root.replaceChildren(shell);

    const hero = shell.querySelector(".brand-g-hero");
    hero?.addEventListener("pointermove", (event) => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const rect = hero.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / Math.max(rect.width, 1) - 0.5) * 2;
      const y = ((event.clientY - rect.top) / Math.max(rect.height, 1) - 0.5) * 2;
      hero.style.setProperty("--g-x", x.toFixed(3));
      hero.style.setProperty("--g-y", y.toFixed(3));
    });
    hero?.addEventListener("pointerleave", () => {
      hero.style.setProperty("--g-x", "0");
      hero.style.setProperty("--g-y", "0");
    });

    shell.querySelectorAll("[data-route-card]").forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--card-x", `${event.clientX - rect.left}px`);
        card.style.setProperty("--card-y", `${event.clientY - rect.top}px`);
      });
    });
  }

  function renderStory(type) {
    const content = storyContent[type];
    const nextHref = type === "like" ? "#/value" : "#/login";
    const nextLabel = type === "like" ? "VALUE" : "TOGETHER";

    const shell = create("main", {
      id: "brand-main-content",
      className: `brand-g-detail brand-g-detail--${type}`,
      tabindex: "-1",
    }, [
      header(true),
      create("section", { className: "brand-g-detail__hero", "aria-labelledby": "brand-g-detail-title" }, [
        create("div", { className: "brand-g-detail__index" }, [
          create("span", { text: content.number }),
          create("span", { text: "CHEONGPA GACHI" }),
        ]),
        create("div", { className: "brand-g-detail__title-wrap" }, [
          create("strong", { className: "brand-g-detail__english", text: content.english }),
          create("h1", { id: "brand-g-detail-title", text: content.title }),
          create("p", { text: content.lead }),
        ]),
        create("div", { className: "brand-g-detail__art", "aria-hidden": "true" }, [
          create("span", { className: "brand-g-detail__disc" }),
          create("span", { className: "brand-g-detail__bar" }),
          create("span", { className: "brand-g-detail__mark", text: content.number }),
        ]),
      ]),
      create("section", { className: "brand-g-detail__grid", "aria-label": `${content.title} 콘텐츠 영역` },
        content.items.map(([number, title, description]) => create("article", { className: "brand-g-detail__item" }, [
          create("span", { text: number }),
          create("h2", { text: title }),
          create("p", { text: description }),
          create("em", { text: "COMING SOON" }),
        ]))),
      create("footer", { className: "brand-g-detail__footer" }, [
        create("a", { href: "#/gateway", text: "← GATEWAY" }),
        create("a", { className: "brand-g-detail__next", href: nextHref }, [
          create("span", { text: `NEXT · ${nextLabel}` }),
          create("span", { text: "↗", "aria-hidden": "true" }),
        ]),
      ]),
    ]);

    root.replaceChildren(shell);
  }

  function setPublicMode(active) {
    const wasPublic = document.documentElement.dataset.brandPublic === "true";
    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (active) {
      document.documentElement.dataset.brandPublic = "true";
      themeColor?.setAttribute("content", "#fff9ee");
      root.hidden = false;
      return;
    }
    delete document.documentElement.dataset.brandPublic;
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
