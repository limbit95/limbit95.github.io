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
      short: "마음을 닮다",
      description: "예배와 말씀 안에서 예수님의 마음을 배우고, 약한 이의 목소리를 먼저 듣는 청파의 신앙을 닮아갑니다.",
      href: "#/like",
      accent: "#58745f",
      tint: "#dce8d5",
    },
    {
      number: "02",
      type: "value",
      english: "VALUE",
      korean: "가치를 나누다",
      short: "가치를 건네다",
      description: "평화를 사랑하고 서로의 존엄을 지키는 마음을 이야기와 생각, 봉사와 실천으로 세상에 건넵니다.",
      href: "#/value",
      accent: "#b96d55",
      tint: "#f0d4c2",
    },
    {
      number: "03",
      type: "together",
      english: "TOGETHER",
      korean: "같이 하다",
      short: "삶으로 잇다",
      description: "소식과 모임, 활동을 연결하며 우리가 믿는 가치를 오늘의 관계와 공동체 안에서 함께 살아냅니다.",
      href: "#/login",
      accent: "#4f7890",
      tint: "#dceaf3",
    },
  ];

  function header(compact = false) {
    return create("header", { className: `brand-f-header${compact ? " brand-f-header--compact" : ""}` }, [
      create("a", { className: "brand-f-brand", href: "#/gateway", "aria-label": "청파 같이 첫 화면" }, [
        create("img", { src: "./assets/images/logo.svg", alt: "", width: "34", height: "34" }),
        create("span", { text: "CHEONGPA GACHI" }),
      ]),
      create("p", { className: "brand-f-header__spirit", text: "HELP THE WEAK · LOVE PEACE" }),
      create("a", { className: "brand-f-header__enter", href: "#/login" }, [
        create("span", { text: "Together" }),
        create("span", { text: "↗", "aria-hidden": "true" }),
      ]),
    ]);
  }

  function routeRow(item) {
    return create("a", {
      className: `brand-f-route brand-f-route--${item.type}`,
      href: item.href,
      dataset: { brandRoute: item.type },
      "aria-label": `${item.english.charAt(0) + item.english.slice(1).toLowerCase()} — ${item.korean}`,
    }, [
      create("span", { className: "brand-f-route__number", text: item.number }),
      create("span", { className: "brand-f-route__title" }, [
        create("strong", { text: item.english }),
        create("em", { text: item.korean }),
      ]),
      create("span", { className: "brand-f-route__description", text: item.description }),
      create("span", { className: "brand-f-route__short", text: item.short }),
      create("span", { className: "brand-f-route__arrow", text: "↗", "aria-hidden": "true" }),
    ]);
  }

  function renderGateway() {
    const ghost = create("span", { className: "brand-f-poster__ghost", text: "GACHI", "aria-hidden": "true" });
    const mode = create("span", { className: "brand-f-poster__mode", text: "ONE WORD · THREE DIRECTIONS" });
    const pulse = create("strong", { className: "brand-f-poster__pulse", text: "함께 살아가는 마음" });

    const shell = create("main", {
      id: "brand-main-content",
      className: "brand-f-shell",
      tabindex: "-1",
      dataset: { active: "default" },
    }, [
      header(),
      create("section", { className: "brand-f-hero", "aria-labelledby": "brand-f-title" }, [
        create("div", { className: "brand-f-copy" }, [
          create("p", { className: "brand-f-eyebrow", text: "CHEONGPA YOUTH COMMUNITY · OUR SPIRIT" }),
          create("h1", { id: "brand-f-title", "aria-label": "같이, 더 약한 곁으로. 더 평화로운 쪽으로." }, [
            create("span", { className: "brand-f-title__gachi", text: "같이," }),
            create("span", { text: "더 약한 곁으로." }),
            create("span", { text: "더 평화로운 쪽으로." }),
          ]),
          create("p", { className: "brand-f-copy__lead", text: "약자를 돕고 평화를 사랑하는 마음. 우리는 그 마음을 닮고, 나누고, 함께 살아갑니다." }),
          create("div", { className: "brand-f-principles", "aria-label": "청파의 정신" }, [
            create("span", { text: "CARE · 약자의 곁" }),
            create("span", { text: "PEACE · 평화의 선택" }),
          ]),
        ]),
        create("div", { className: "brand-f-poster", "aria-hidden": "true" }, [
          create("span", { className: "brand-f-poster__shape brand-f-poster__shape--sage" }),
          create("span", { className: "brand-f-poster__shape brand-f-poster__shape--sky" }),
          create("span", { className: "brand-f-poster__shape brand-f-poster__shape--sun" }),
          ghost,
          create("div", { className: "brand-f-poster__word" }, [
            create("span", { text: "같" }),
            create("span", { text: "이" }),
          ]),
          create("span", { className: "brand-f-poster__orbit brand-f-poster__orbit--one" }),
          create("span", { className: "brand-f-poster__orbit brand-f-poster__orbit--two" }),
          create("div", { className: "brand-f-poster__caption" }, [mode, pulse]),
        ]),
      ]),
      create("section", { className: "brand-f-index", "aria-labelledby": "brand-f-index-title" }, [
        create("div", { className: "brand-f-index__head" }, [
          create("p", { text: "LIKE · VALUE · TOGETHER" }),
          create("h2", { id: "brand-f-index-title", text: "세 가지 ‘같이’" }),
          create("span", { text: "신앙에서 가치로, 가치에서 함께 살아가는 삶으로." }),
        ]),
        create("nav", { className: "brand-f-routes", "aria-label": "청파 같이 세 가지 영역" }, routes.map(routeRow)),
      ]),
      create("section", { className: "brand-f-manifesto", "aria-label": "청파 같이 브랜드 선언" }, [
        create("span", { className: "brand-f-manifesto__label", text: "OUR SPIRIT / 2026" }),
        create("p", {}, [
          "힘이 더 센 쪽보다 ",
          create("strong", { text: "약한 이의 곁" }),
          "을 바라보고, 갈등을 키우기보다 ",
          create("strong", { text: "평화를 선택" }),
          "합니다.",
        ]),
        create("span", { className: "brand-f-manifesto__english", text: "CHOOSE CARE · CHOOSE PEACE · LIVE TOGETHER" }),
      ]),
      create("footer", { className: "brand-f-footer" }, [
        create("span", { text: "CHEONGPA GACHI" }),
        create("span", { text: "LIKE · VALUE · TOGETHER" }),
        create("span", { text: "SEOUL · 2026" }),
      ]),
    ]);

    root.replaceChildren(shell);

    const reset = () => {
      shell.dataset.active = "default";
      shell.style.removeProperty("--f-accent");
      shell.style.removeProperty("--f-tint");
      ghost.textContent = "GACHI";
      mode.textContent = "ONE WORD · THREE DIRECTIONS";
      pulse.textContent = "함께 살아가는 마음";
    };

    const activate = (route) => {
      const item = routes.find((candidate) => candidate.type === route.dataset.brandRoute);
      if (!item) return;
      shell.dataset.active = item.type;
      shell.style.setProperty("--f-accent", item.accent);
      shell.style.setProperty("--f-tint", item.tint);
      ghost.textContent = item.english;
      mode.textContent = `${item.number} · ${item.english}`;
      pulse.textContent = item.short;
    };

    shell.querySelectorAll("[data-brand-route]").forEach((route) => {
      route.addEventListener("pointerenter", () => activate(route));
      route.addEventListener("focus", () => activate(route));
      route.addEventListener("pointerleave", reset);
      route.addEventListener("blur", reset);
    });

    const poster = shell.querySelector(".brand-f-poster");
    poster?.addEventListener("pointermove", (event) => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const rect = poster.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / Math.max(rect.width, 1) - 0.5) * 2;
      const y = ((event.clientY - rect.top) / Math.max(rect.height, 1) - 0.5) * 2;
      poster.style.setProperty("--f-pointer-x", x.toFixed(3));
      poster.style.setProperty("--f-pointer-y", y.toFixed(3));
    });
    poster?.addEventListener("pointerleave", () => {
      poster.style.setProperty("--f-pointer-x", "0");
      poster.style.setProperty("--f-pointer-y", "0");
    });
  }

  const storyContent = {
    like: {
      number: "01",
      english: "LIKE",
      title: "같이 닮다",
      lead: "예수님의 마음을 배우고, 청파가 이어온 신앙의 방향을 함께 닮아갑니다.",
      spirit: "더 약한 이의 목소리를 먼저 듣는 것 또한 우리가 닮아가고 싶은 마음입니다.",
      items: [
        ["01.1", "청파의 정신", "약자의 곁에 서고 평화를 사랑하는 청파의 신앙과 공동체 정신"],
        ["01.2", "예배", "함께 드리는 예배와 메시지를 다시 만나는 기록"],
        ["01.3", "말씀", "묵상한 말씀을 삶의 방향과 선택으로 이어가는 나눔"],
      ],
    },
    value: {
      number: "02",
      english: "VALUE",
      title: "가치를 나누다",
      lead: "평화를 사랑하고 서로의 존엄을 지키는 마음을 이야기와 생각, 행동으로 나눕니다.",
      spirit: "가치는 문장으로 끝나지 않고 누군가의 곁에 서는 구체적인 선택이 됩니다.",
      items: [
        ["02.1", "이야기", "목회자와 청년들이 나누는 삶, 신앙, 돌봄과 평화의 이야기"],
        ["02.2", "칼럼", "사회와 공동체를 바라보며 함께 생각할 질문과 관점"],
        ["02.3", "프로젝트", "봉사와 캠페인, 연대와 평화를 행동으로 이어가는 프로젝트"],
      ],
    },
  };

  function renderStory(type) {
    const content = storyContent[type];
    const nextHref = type === "like" ? "#/value" : "#/login";
    const nextText = type === "like" ? "Value로 이어가기" : "Together 들어가기";
    const shell = create("main", {
      id: "brand-main-content",
      className: `brand-f-detail brand-f-detail--${type}`,
      tabindex: "-1",
    }, [
      header(true),
      create("section", { className: "brand-f-detail__hero", "aria-labelledby": "brand-f-detail-title" }, [
        create("span", { className: "brand-f-detail__number", text: content.number }),
        create("div", { className: "brand-f-detail__copy" }, [
          create("p", { className: "brand-f-detail__eyebrow", text: `CHEONGPA GACHI · ${content.english}` }),
          create("h1", { id: "brand-f-detail-title", text: content.title }),
          create("strong", { className: "brand-f-detail__english", text: content.english }),
          create("p", { className: "brand-f-detail__lead", text: content.lead }),
        ]),
        create("aside", { className: "brand-f-detail__spirit" }, [
          create("small", { text: "OUR SPIRIT" }),
          create("p", { text: content.spirit }),
        ]),
      ]),
      create("section", { className: "brand-f-detail__list", "aria-label": `${content.title} 콘텐츠 영역` },
        content.items.map(([number, title, description]) => create("article", { className: "brand-f-detail-row" }, [
          create("span", { text: number }),
          create("h2", { text: title }),
          create("p", { text: description }),
          create("em", { text: "준비 중" }),
        ]))),
      create("footer", { className: "brand-f-detail__actions" }, [
        create("a", { href: "#/gateway", text: "← 세 가지 의미로 돌아가기" }),
        create("a", { className: "brand-f-detail__next", href: nextHref }, [
          create("span", { text: nextText }),
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
      themeColor?.setAttribute("content", "#f7f3e8");
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
