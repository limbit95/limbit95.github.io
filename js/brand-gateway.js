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

  const header = (compact = false) => create("header", {
    className: `brand-c-header${compact ? " brand-c-header--compact" : ""}`,
  }, [
    create("a", { className: "brand-c-logo", href: "#/gateway", "aria-label": "청파 같이 첫 화면" }, [
      create("img", { src: "./assets/images/logo.svg", alt: "", width: "34", height: "34" }),
      create("span", { text: "CHEONGPA GACHI" }),
    ]),
    create("div", { className: "brand-c-header__meta", "aria-hidden": "true" }, [
      create("span", { text: "LIKE" }),
      create("span", { text: "VALUE" }),
      create("span", { text: "TOGETHER" }),
    ]),
  ]);

  const routeData = [
    {
      number: "01",
      type: "like",
      english: "LIKE",
      korean: "같이 닮다",
      description: "예배와 말씀 안에서 예수님을 닮고, 청파의 신앙과 정신을 이어갑니다.",
      href: "#/like",
      accent: "#496b52",
      tint: "#dce7cf",
    },
    {
      number: "02",
      type: "value",
      english: "VALUE",
      korean: "가치를 나누다",
      description: "사람의 이야기와 생각, 프로젝트를 통해 우리가 믿는 가치를 세상과 나눕니다.",
      href: "#/value",
      accent: "#b95f48",
      tint: "#efd5c9",
    },
    {
      number: "03",
      type: "together",
      english: "TOGETHER",
      korean: "같이 하다",
      description: "소식과 모임, 활동을 연결하며 오늘의 청파청년부를 함께 만들어갑니다.",
      href: "#/login",
      accent: "#3459c7",
      tint: "#d5dcf6",
    },
  ];

  const routeLink = (item) => create("a", {
    className: `brand-c-route brand-c-route--${item.type}`,
    href: item.href,
    dataset: { brandRoute: item.type, accent: item.accent, tint: item.tint },
    "aria-label": `${item.english.charAt(0) + item.english.slice(1).toLowerCase()} — ${item.korean}`,
  }, [
    create("span", { className: "brand-c-route__number", text: item.number }),
    create("span", { className: "brand-c-route__english", text: item.english }),
    create("span", { className: "brand-c-route__korean", text: item.korean }),
    create("span", { className: "brand-c-route__description", text: item.description }),
    create("span", { className: "brand-c-route__arrow", text: "↗", "aria-hidden": "true" }),
  ]);

  function renderGateway() {
    const stageGhost = create("span", { className: "brand-c-stage__ghost", text: "GACHI", "aria-hidden": "true" });
    const stageCaption = create("span", { className: "brand-c-stage__caption", text: "ONE WORD / THREE DIRECTIONS" });

    const shell = create("main", {
      id: "brand-main-content",
      className: "brand-c-shell",
      tabindex: "-1",
      dataset: { active: "default" },
    }, [
      header(),
      create("section", { className: "brand-c-hero", "aria-labelledby": "brand-c-title" }, [
        create("div", { className: "brand-c-stage" }, [
          create("div", { className: "brand-c-stage__meta" }, [
            create("span", { text: "CHEONGPA YOUTH COMMUNITY" }),
            stageCaption,
          ]),
          create("div", { className: "brand-c-stage__word-wrap" }, [
            stageGhost,
            create("h1", { id: "brand-c-title", className: "brand-c-stage__word", "aria-label": "같이" }, [
              create("span", { className: "brand-c-letter brand-c-letter--one", text: "같" }),
              create("span", { className: "brand-c-letter brand-c-letter--two", text: "이" }),
            ]),
          ]),
          create("div", { className: "brand-c-stage__statement" }, [
            create("p", { text: "닮고, 나누고, 함께." }),
            create("span", { text: "‘같이’라는 한 단어 안에 담긴 세 방향을 선택해 보세요." }),
          ]),
        ]),
        create("nav", { className: "brand-c-routes", "aria-label": "청파 같이 세 가지 영역" }, routeData.map(routeLink)),
      ]),
      create("footer", { className: "brand-c-footer" }, [
        create("span", { text: "CHEONGPA GACHI" }),
        create("span", { text: "LIKE · VALUE · TOGETHER" }),
        create("span", { text: "SEOUL · 2026" }),
      ]),
    ]);

    root.replaceChildren(shell);

    const resetStage = () => {
      shell.dataset.active = "default";
      shell.style.removeProperty("--brand-c-accent");
      shell.style.removeProperty("--brand-c-tint");
      stageGhost.textContent = "GACHI";
      stageCaption.textContent = "ONE WORD / THREE DIRECTIONS";
    };

    const activateStage = (route) => {
      const item = routeData.find((candidate) => candidate.type === route.dataset.brandRoute);
      if (!item) return;
      shell.dataset.active = item.type;
      shell.style.setProperty("--brand-c-accent", item.accent);
      shell.style.setProperty("--brand-c-tint", item.tint);
      stageGhost.textContent = item.english;
      stageCaption.textContent = `${item.number} / ${item.english}`;
    };

    shell.querySelectorAll("[data-brand-route]").forEach((route) => {
      route.addEventListener("pointerenter", () => activateStage(route));
      route.addEventListener("focus", () => activateStage(route));
      route.addEventListener("pointerleave", resetStage);
      route.addEventListener("blur", resetStage);
    });

    shell.addEventListener("pointermove", (event) => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const rect = shell.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / Math.max(rect.width, 1) - 0.5) * 2;
      const y = ((event.clientY - rect.top) / Math.max(rect.height, 1) - 0.5) * 2;
      shell.style.setProperty("--brand-c-pointer-x", x.toFixed(3));
      shell.style.setProperty("--brand-c-pointer-y", y.toFixed(3));
    });
  }

  const storyContent = {
    like: {
      number: "01",
      english: "LIKE",
      title: "같이 닮다",
      accent: "#496b52",
      tint: "#dce7cf",
      description: "예배와 말씀 안에서 우리가 누구를 닮아가고 어떤 신앙의 방향을 이어갈지 담는 공간입니다.",
      items: [
        ["01", "청파의 정신", "청파교회와 청년부가 이어가는 믿음의 방향과 정신"],
        ["02", "예배", "청파청년부 예배와 메시지를 다시 만나는 아카이브"],
        ["03", "말씀", "함께 묵상하고 삶으로 이어갈 말씀과 기록"],
      ],
    },
    value: {
      number: "02",
      english: "VALUE",
      title: "가치를 나누다",
      accent: "#b95f48",
      tint: "#efd5c9",
      description: "우리가 중요하게 여기는 가치가 사람의 이야기와 생각, 실천으로 이어지는 공간입니다.",
      items: [
        ["01", "이야기", "목회자와 청년들이 나누는 삶과 신앙의 이야기"],
        ["02", "칼럼", "함께 생각해 보고 싶은 질문과 관점을 담은 글"],
        ["03", "프로젝트", "봉사와 캠페인, 공동체 밖으로 이어지는 청년들의 실천"],
      ],
    },
  };

  function renderStory(type) {
    const content = storyContent[type];
    const shell = create("main", {
      id: "brand-main-content",
      className: `brand-c-detail brand-c-detail--${type}`,
      tabindex: "-1",
      style: `--brand-c-accent:${content.accent};--brand-c-tint:${content.tint}`,
    }, [
      header(true),
      create("section", { className: "brand-c-detail__hero", "aria-labelledby": "brand-c-detail-title" }, [
        create("div", { className: "brand-c-detail__index" }, [
          create("span", { text: content.number }),
          create("span", { text: content.english }),
        ]),
        create("div", { className: "brand-c-detail__headline" }, [
          create("p", { className: "brand-c-detail__english", text: content.english }),
          create("h1", { id: "brand-c-detail-title", text: content.title }),
          create("p", { className: "brand-c-detail__description", text: content.description }),
        ]),
        create("div", { className: "brand-c-detail__mark", "aria-hidden": "true" }, [
          create("span", { text: content.english.charAt(0) }),
          create("span", { text: content.english.charAt(content.english.length - 1) }),
        ]),
      ]),
      create("section", { className: "brand-c-detail__list", "aria-label": `${content.title} 콘텐츠 영역` },
        content.items.map(([number, title, description]) => create("article", { className: "brand-c-detail-row" }, [
          create("span", { className: "brand-c-detail-row__number", text: number }),
          create("h2", { text: title }),
          create("p", { text: description }),
          create("span", { className: "brand-c-detail-row__status", text: "준비 중" }),
        ]))),
      create("footer", { className: "brand-c-detail__actions" }, [
        create("a", { href: "#/gateway", text: "← 세 가지 의미로 돌아가기" }),
        create("a", { className: "brand-c-detail__together", href: "#/login" }, [
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
      themeColor?.setAttribute("content", "#f2efe7");
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
      if (hasRendered) {
        document.getElementById("brand-main-content")?.focus({ preventScroll: true });
      }
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
