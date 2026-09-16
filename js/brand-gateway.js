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

  const routes = [
    {
      number: "01",
      type: "like",
      english: "LIKE",
      korean: "같이 닮다",
      description: "예수님의 마음과 청파의 신앙을 닮아가며, 예배와 말씀 안에서 같은 방향을 배웁니다.",
      href: "#/like",
      tags: ["예배", "말씀", "청파의 정신"],
    },
    {
      number: "02",
      type: "value",
      english: "VALUE",
      korean: "가치를 나누다",
      description: "약한 이의 곁에 서고 평화를 사랑하는 가치를 이야기와 생각, 실천으로 나눕니다.",
      href: "#/value",
      tags: ["이야기", "칼럼", "프로젝트"],
    },
    {
      number: "03",
      type: "together",
      english: "TOGETHER",
      korean: "같이 하다",
      description: "우리가 믿는 가치를 소식과 모임, 활동 속에서 실제 관계와 공동체의 오늘로 이어갑니다.",
      href: "#/login",
      tags: ["소식", "모임", "활동"],
    },
  ];

  function header() {
    return create("header", { className: "brand-e-header" }, [
      create("a", { className: "brand-e-brand", href: "#/gateway", "aria-label": "청파 같이 첫 화면" }, [
        create("img", { src: "./assets/images/logo.svg", alt: "", width: "34", height: "34" }),
        create("span", { text: "CHEONGPA GACHI" }),
      ]),
      create("p", { className: "brand-e-header__spirit" }, [
        create("b", { text: "HELP THE WEAK" }),
        " · LOVE PEACE",
      ]),
      create("a", { className: "brand-e-header__enter", href: "#/login" }, [
        create("span", { text: "Together" }),
        create("span", { text: "↗", "aria-hidden": "true" }),
      ]),
    ]);
  }

  function routeCard(item) {
    return create("a", {
      className: `brand-e-card brand-e-card--${item.type}`,
      href: item.href,
      dataset: { brandRoute: item.type },
      "aria-label": `${item.english.charAt(0) + item.english.slice(1).toLowerCase()} — ${item.korean}`,
    }, [
      create("span", { className: "brand-e-card__top" }, [
        create("span", { text: item.number }),
        create("span", { className: "brand-e-card__mark", text: "g" }),
      ]),
      create("span", { className: "brand-e-card__shape", "aria-hidden": "true" }),
      create("span", { className: "brand-e-card__arrow", text: "↗", "aria-hidden": "true" }),
      create("span", { className: "brand-e-card__body" }, [
        create("span", { className: "brand-e-card__english", text: item.english }),
        create("h3", { text: item.korean }),
        create("span", { className: "brand-e-card__description", text: item.description }),
        create("span", { className: "brand-e-card__tags" }, item.tags.map((tag) =>
          create("span", { className: "brand-e-card__tag", text: tag })
        )),
      ]),
    ]);
  }

  function renderGateway() {
    const shell = create("main", {
      id: "brand-main-content",
      className: "brand-e-shell",
      tabindex: "-1",
      dataset: { active: "default" },
    }, [
      header(),
      create("section", { className: "brand-e-hero", "aria-labelledby": "brand-e-title" }, [
        create("div", { className: "brand-e-hero__copy" }, [
          create("p", { className: "brand-e-eyebrow", text: "CHEONGPA YOUTH COMMUNITY · OUR SPIRIT" }),
          create("h1", { id: "brand-e-title" }, [
            create("span", { text: "더 약한 곁으로," }),
            create("span", { text: "더 평화로운 쪽으로." }),
          ]),
          create("p", {
            className: "brand-e-hero__lead",
            text: "우리는 약한 이의 곁에 서고, 평화를 사랑하는 마음을 함께 배우고 실천합니다. 그 마음은 닮고, 나누고, 함께하는 세 가지 ‘같이’로 이어집니다.",
          }),
          create("div", { className: "brand-e-hero__principles", "aria-label": "청파 같이 핵심 가치" }, [
            create("span", { className: "brand-e-principle", text: "CARE · 약자의 곁" }),
            create("span", { className: "brand-e-principle brand-e-principle--peace", text: "PEACE · 평화를 사랑함" }),
            create("span", { className: "brand-e-principle brand-e-principle--community", text: "GACHI · 함께 살아감" }),
          ]),
        ]),
        create("div", { className: "brand-e-art", "aria-hidden": "true" }, [
          create("span", { className: "brand-e-art__field" }),
          create("span", { className: "brand-e-art__sun" }),
          create("span", { className: "brand-e-art__peace", text: "Peace" }),
          create("span", { className: "brand-e-art__leaf brand-e-art__leaf--one" }),
          create("span", { className: "brand-e-art__leaf brand-e-art__leaf--two" }),
          create("span", { className: "brand-e-art__leaf brand-e-art__leaf--three" }),
          create("span", { className: "brand-e-art__care" }, [
            create("small", { text: "CHEONGPA SPIRIT" }),
            create("strong", { text: "약자를 돕고, 평화를 사랑하다" }),
          ]),
          create("span", { className: "brand-e-art__caption", text: "힘이 약한 사람의 목소리를 먼저 듣고, 갈등보다 평화를 선택하는 공동체를 꿈꿉니다." }),
        ]),
      ]),
      create("section", { className: "brand-e-choices", "aria-labelledby": "brand-e-choices-title" }, [
        create("div", { className: "brand-e-choices__inner" }, [
          create("div", { className: "brand-e-section-head" }, [
            create("div", {}, [
              create("p", { className: "brand-e-section-head__eyebrow", text: "LIKE · VALUE · TOGETHER" }),
              create("h2", { id: "brand-e-choices-title", text: "세 가지 ‘같이’로 이어지는 마음" }),
            ]),
            create("p", { className: "brand-e-section-head__copy", text: "믿음을 닮고, 우리가 소중히 여기는 가치를 나누고, 그것을 실제 공동체의 삶으로 함께 이어갑니다." }),
          ]),
          create("div", { className: "brand-e-thread", "aria-hidden": "true" }),
          create("nav", { className: "brand-e-card-grid", "aria-label": "청파 같이 세 가지 영역" }, routes.map(routeCard)),
        ]),
      ]),
      create("section", { className: "brand-e-manifesto", "aria-label": "청파의 정신" }, [
        create("div", { className: "brand-e-manifesto__inner" }, [
          create("span", { className: "brand-e-manifesto__flower", "aria-hidden": "true" }, [create("i"), create("i"), create("i")]),
          create("div", { className: "brand-e-manifesto__copy" }, [
            create("small", { text: "OUR SPIRIT" }),
            create("strong", { text: "약한 이의 곁에 서고, 평화를 사랑하는 공동체" }),
          ]),
          create("span", { className: "brand-e-manifesto__english", text: "Choose care. Choose peace. Live together." }),
        ]),
      ]),
      create("footer", { className: "brand-e-footer" }, [
        create("span", { text: "CHEONGPA GACHI" }),
        create("span", { text: "LIKE · VALUE · TOGETHER / 2026" }),
      ]),
    ]);

    root.replaceChildren(shell);

    const cards = [...shell.querySelectorAll("[data-brand-route]")];
    const reset = () => { shell.dataset.active = "default"; };
    cards.forEach((card) => {
      const activate = () => { shell.dataset.active = card.dataset.brandRoute; };
      card.addEventListener("pointerenter", activate);
      card.addEventListener("focus", activate);
      card.addEventListener("pointerleave", reset);
      card.addEventListener("blur", reset);
    });

    const art = shell.querySelector(".brand-e-art");
    art?.addEventListener("pointermove", (event) => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const rect = art.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / Math.max(rect.width, 1) - 0.5) * 2;
      const y = ((event.clientY - rect.top) / Math.max(rect.height, 1) - 0.5) * 2;
      art.style.setProperty("--e-pointer-x", x.toFixed(3));
      art.style.setProperty("--e-pointer-y", y.toFixed(3));
    });
    art?.addEventListener("pointerleave", () => {
      art.style.setProperty("--e-pointer-x", "0");
      art.style.setProperty("--e-pointer-y", "0");
    });
  }

  const storyContent = {
    like: {
      number: "01",
      english: "LIKE",
      title: "같이 닮다",
      description: "예배와 말씀 안에서 예수님의 마음을 배우고, 청파가 이어온 신앙의 방향을 함께 닮아가는 공간입니다.",
      note: "닮아감은 더 약한 이의 목소리를 듣고, 평화를 선택하는 삶으로 이어집니다.",
      items: [
        ["01.1", "청파의 정신", "약자의 곁에 서고 평화를 사랑하는 청파의 신앙과 공동체 정신"],
        ["01.2", "예배", "청파청년부가 함께 드리는 예배와 메시지를 다시 만나는 기록"],
        ["01.3", "말씀", "함께 묵상하고 삶의 방향으로 이어갈 말씀과 나눔"],
      ],
    },
    value: {
      number: "02",
      english: "VALUE",
      title: "가치를 나누다",
      description: "약한 이의 곁에 서고 평화를 사랑하는 마음을 사람의 이야기와 생각, 공동체의 실천으로 세상과 나누는 공간입니다.",
      note: "우리가 믿는 가치는 말에 머물지 않고 누군가의 곁에 서는 구체적인 선택이 됩니다.",
      items: [
        ["02.1", "이야기", "목회자와 청년들이 나누는 삶, 신앙, 돌봄과 평화의 이야기"],
        ["02.2", "칼럼", "사회와 공동체를 바라보며 함께 생각해 볼 질문과 관점"],
        ["02.3", "프로젝트", "봉사와 캠페인, 연대와 평화를 실제 행동으로 이어가는 프로젝트"],
      ],
    },
  };

  function renderStory(type) {
    const content = storyContent[type];
    const nextHref = type === "like" ? "#/value" : "#/login";
    const nextText = type === "like" ? "Value로 이어가기" : "Together 들어가기";
    const shell = create("main", {
      id: "brand-main-content",
      className: `brand-e-detail brand-e-detail--${type}`,
      tabindex: "-1",
    }, [
      header(),
      create("section", { className: "brand-e-detail__hero", "aria-labelledby": "brand-e-detail-title" }, [
        create("span", { className: "brand-e-detail__number", text: content.number }),
        create("div", {}, [
          create("p", { className: "brand-e-detail__eyebrow", text: "CHEONGPA GACHI · EDITORIAL ROOM" }),
          create("h1", { id: "brand-e-detail-title", text: content.title }),
          create("span", { className: "brand-e-detail__english", text: content.english }),
          create("p", { className: "brand-e-detail__description", text: content.description }),
        ]),
        create("aside", { className: "brand-e-detail__note" }, [
          create("small", { text: "OUR SPIRIT" }),
          create("p", { text: content.note }),
        ]),
      ]),
      create("section", { className: "brand-e-detail__list", "aria-label": `${content.title} 콘텐츠` },
        content.items.map(([number, title, description]) => create("article", { className: "brand-e-detail-item" }, [
          create("span", { className: "brand-e-detail-item__number", text: number }),
          create("h2", { text: title }),
          create("p", { text: description }),
          create("span", { className: "brand-e-detail-item__status", text: "준비 중" }),
        ]))),
      create("nav", { className: "brand-e-detail__actions", "aria-label": "브랜드 영역 이동" }, [
        create("a", { className: "brand-e-detail__back", href: "#/gateway", text: "← 세 가지 같이 보기" }),
        create("a", { className: "brand-e-detail__next", href: nextHref }, [
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
      themeColor?.setAttribute("content", "#fbf7eb");
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
