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
    const list = Array.isArray(children) ? children : [children];
    list.forEach((child) => {
      if (child == null || child === false) return;
      node.append(child instanceof Node ? child : document.createTextNode(String(child)));
    });
    return node;
  };

  const routeData = [
    {
      number: "01",
      type: "like",
      english: "LIKE",
      korean: "같이 닮다",
      description: "예배와 말씀 안에서 예수님을 닮고, 청파의 신앙과 정신을 이어갑니다.",
      href: "#/like",
      accent: "#b8df9f",
      tint: "#1f3425",
      depth: 0.65,
    },
    {
      number: "02",
      type: "value",
      english: "VALUE",
      korean: "가치를 나누다",
      description: "사람의 이야기와 생각, 프로젝트를 통해 우리가 믿는 가치를 세상과 나눕니다.",
      href: "#/value",
      accent: "#ff9f76",
      tint: "#45241d",
      depth: 0.9,
    },
    {
      number: "03",
      type: "together",
      english: "TOGETHER",
      korean: "같이 하다",
      description: "소식과 모임, 활동을 연결하며 오늘의 청파청년부를 함께 만들어갑니다.",
      href: "#/login",
      accent: "#91b8ff",
      tint: "#1d2a4d",
      depth: 1.15,
    },
  ];

  const header = () => create("header", { className: "brand-d-header" }, [
    create("a", { className: "brand-d-brand", href: "#/gateway", "aria-label": "청파 같이 첫 화면" }, [
      create("img", { src: "./assets/images/logo.svg", alt: "", width: "34", height: "34" }),
      create("span", { text: "CHEONGPA GACHI" }),
    ]),
    create("div", { className: "brand-d-header__meta", "aria-hidden": "true" }, [
      create("span", { text: "YOUTH COMMUNITY" }),
      create("span", { text: "SEOUL / 2026" }),
    ]),
  ]);

  const glyph = (type) => {
    if (type === "like") {
      return create("span", { className: "brand-d-glyph brand-d-glyph--like", "aria-hidden": "true" }, [
        create("i"), create("i"), create("i"),
      ]);
    }
    if (type === "value") {
      return create("span", { className: "brand-d-glyph brand-d-glyph--value", "aria-hidden": "true" }, [
        create("i"), create("i"),
      ]);
    }
    return create("span", { className: "brand-d-glyph brand-d-glyph--together", "aria-hidden": "true" }, [
      create("i"), create("i"), create("i"), create("b"), create("b"),
    ]);
  };

  const portal = (item) => create("a", {
    className: `brand-d-portal brand-d-portal--${item.type}`,
    href: item.href,
    dataset: { brandRoute: item.type, depth: item.depth },
    "aria-label": `${item.english.charAt(0) + item.english.slice(1).toLowerCase()} — ${item.korean}`,
  }, [
    create("span", { className: "brand-d-portal__top" }, [
      create("span", { className: "brand-d-portal__number", text: item.number }),
      create("span", { className: "brand-d-portal__status", text: "OPEN" }),
    ]),
    glyph(item.type),
    create("span", { className: "brand-d-portal__copy" }, [
      create("strong", { text: item.english }),
      create("span", { className: "brand-d-portal__korean", text: item.korean }),
      create("span", { className: "brand-d-portal__description", text: item.description }),
    ]),
    create("span", { className: "brand-d-portal__arrow", text: "↗", "aria-hidden": "true" }),
  ]);

  function renderGateway() {
    const statusTitle = create("strong", { className: "brand-d-status__title", text: "GACHI" });
    const statusCopy = create("span", { className: "brand-d-status__copy", text: "ONE COMMUNITY / THREE DIRECTIONS" });

    const shell = create("main", {
      id: "brand-main-content",
      className: "brand-d-shell",
      tabindex: "-1",
      dataset: { active: "default" },
    }, [
      header(),
      create("section", { className: "brand-d-canvas", "aria-labelledby": "brand-d-title" }, [
        create("div", { className: "brand-d-grid", "aria-hidden": "true" }),
        create("div", { className: "brand-d-coordinate brand-d-coordinate--x", "aria-hidden": "true", text: "X / 37° 34'" }),
        create("div", { className: "brand-d-coordinate brand-d-coordinate--y", "aria-hidden": "true", text: "Y / 126° 58'" }),
        create("div", { className: "brand-d-intro" }, [
          create("p", { className: "brand-d-intro__eyebrow", text: "CHEONGPA YOUTH COMMUNITY" }),
          create("h1", { id: "brand-d-title" }, [
            create("span", { text: "하나의 공동체," }),
            create("span", { text: "세 개의 방향." }),
          ]),
          create("p", { className: "brand-d-intro__copy", text: "닮고, 나누고, 함께 살아가는 청파청년부의 세 가지 ‘같이’를 탐색해 보세요." }),
        ]),
        create("div", { className: "brand-d-network", "aria-hidden": "true" }, [
          create("span", { className: "brand-d-network__line brand-d-network__line--one" }),
          create("span", { className: "brand-d-network__line brand-d-network__line--two" }),
          create("span", { className: "brand-d-network__line brand-d-network__line--three" }),
          create("span", { className: "brand-d-network__node brand-d-network__node--one" }),
          create("span", { className: "brand-d-network__node brand-d-network__node--two" }),
          create("span", { className: "brand-d-network__node brand-d-network__node--three" }),
        ]),
        create("nav", { className: "brand-d-portals", "aria-label": "청파 같이 세 가지 영역" }, routeData.map(portal)),
        create("aside", { className: "brand-d-status", "aria-live": "polite" }, [
          create("span", { className: "brand-d-status__label", text: "CURRENT SIGNAL" }),
          statusTitle,
          statusCopy,
        ]),
        create("div", { className: "brand-d-hint", "aria-hidden": "true" }, [
          create("span", { text: "MOVE" }),
          create("i"),
          create("span", { text: "FOCUS" }),
          create("i"),
          create("span", { text: "ENTER" }),
        ]),
      ]),
      create("footer", { className: "brand-d-footer" }, [
        create("span", { text: "LIKE / VALUE / TOGETHER" }),
        create("span", { text: "CHOOSE A DIRECTION" }),
      ]),
    ]);

    root.replaceChildren(shell);

    const reset = () => {
      shell.dataset.active = "default";
      shell.style.removeProperty("--brand-d-accent");
      shell.style.removeProperty("--brand-d-tint");
      statusTitle.textContent = "GACHI";
      statusCopy.textContent = "ONE COMMUNITY / THREE DIRECTIONS";
    };

    const activate = (route) => {
      const item = routeData.find((candidate) => candidate.type === route.dataset.brandRoute);
      if (!item) return;
      shell.dataset.active = item.type;
      shell.style.setProperty("--brand-d-accent", item.accent);
      shell.style.setProperty("--brand-d-tint", item.tint);
      statusTitle.textContent = item.english;
      statusCopy.textContent = `${item.number} / ${item.korean}`;
    };

    const routes = [...shell.querySelectorAll("[data-brand-route]")];
    routes.forEach((route) => {
      route.addEventListener("pointerenter", () => activate(route));
      route.addEventListener("focus", () => activate(route));
      route.addEventListener("pointerleave", reset);
      route.addEventListener("blur", reset);
    });

    shell.addEventListener("pointermove", (event) => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      if (window.matchMedia("(max-width: 820px)").matches) return;
      const rect = shell.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / Math.max(rect.width, 1) - 0.5) * 2;
      const y = ((event.clientY - rect.top) / Math.max(rect.height, 1) - 0.5) * 2;
      shell.style.setProperty("--brand-d-light-x", `${((x + 1) / 2 * 100).toFixed(1)}%`);
      shell.style.setProperty("--brand-d-light-y", `${((y + 1) / 2 * 100).toFixed(1)}%`);
      routes.forEach((route) => {
        const depth = Number(route.dataset.depth || 1);
        route.style.setProperty("--brand-d-shift-x", `${(x * depth * 9).toFixed(2)}px`);
        route.style.setProperty("--brand-d-shift-y", `${(y * depth * 7).toFixed(2)}px`);
      });
    });

    shell.addEventListener("pointerleave", () => {
      routes.forEach((route) => {
        route.style.setProperty("--brand-d-shift-x", "0px");
        route.style.setProperty("--brand-d-shift-y", "0px");
      });
    });
  }

  const storyContent = {
    like: {
      number: "01",
      english: "LIKE",
      title: "같이 닮다",
      accent: "#b8df9f",
      description: "예배와 말씀 안에서 우리가 누구를 닮아가고 어떤 신앙의 방향을 이어갈지 담는 공간입니다.",
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
      accent: "#ff9f76",
      description: "우리가 중요하게 여기는 가치가 사람의 이야기와 생각, 실천으로 이어지는 공간입니다.",
      items: [
        ["02.1", "이야기", "목회자와 청년들이 나누는 삶과 신앙의 이야기"],
        ["02.2", "칼럼", "함께 생각해 보고 싶은 질문과 관점을 담은 글"],
        ["02.3", "프로젝트", "봉사와 캠페인, 공동체 밖으로 이어지는 청년들의 실천"],
      ],
    },
  };

  function renderStory(type) {
    const content = storyContent[type];
    const shell = create("main", {
      id: "brand-main-content",
      className: `brand-d-detail brand-d-detail--${type}`,
      tabindex: "-1",
      style: `--brand-d-accent:${content.accent}`,
    }, [
      header(),
      create("section", { className: "brand-d-detail__stage", "aria-labelledby": "brand-d-detail-title" }, [
        create("div", { className: "brand-d-detail__grid", "aria-hidden": "true" }),
        create("div", { className: "brand-d-detail__index" }, [
          create("span", { text: content.number }),
          create("span", { text: content.english }),
        ]),
        create("div", { className: "brand-d-detail__headline" }, [
          create("p", { text: `ROOM ${content.number}` }),
          create("h1", { id: "brand-d-detail-title", text: content.title }),
          create("span", { className: "brand-d-detail__english", text: content.english }),
          create("p", { className: "brand-d-detail__description", text: content.description }),
        ]),
        create("div", { className: "brand-d-detail__nodes" },
          content.items.map(([number, title, description], index) => create("article", {
            className: `brand-d-detail-node brand-d-detail-node--${index + 1}`,
          }, [
            create("span", { className: "brand-d-detail-node__number", text: number }),
            create("span", { className: "brand-d-detail-node__signal", "aria-hidden": "true" }),
            create("h2", { text: title }),
            create("p", { text: description }),
            create("span", { className: "brand-d-detail-node__status", text: "COMING SOON" }),
          ]))),
      ]),
      create("footer", { className: "brand-d-detail__actions" }, [
        create("a", { href: "#/gateway", text: "← 전체 캔버스로" }),
        create("a", { className: "brand-d-detail__together", href: "#/login" }, [
          create("span", { text: "Together 들어가기" }),
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
      themeColor?.setAttribute("content", "#0f1117");
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
