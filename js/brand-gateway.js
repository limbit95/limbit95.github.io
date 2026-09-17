(() => {
  const PUBLIC_ROUTES = new Set(["/gateway", "/like", "/value"]);
  const root = document.getElementById("brand-gateway-root");
  if (!root) return;

  const scenes = [
    {
      key: "like",
      number: "01",
      english: "LIKE",
      korean: "같이 닮다",
      cue: "WORSHIP · WORD · FAITH",
      lead: "예배와 말씀 안에서 같은 방향을 바라보고, 삶으로 천천히 닮아갑니다.",
      href: "#/like",
      accent: "#9fdcff",
      tint: "#eaf7ff",
      glyph: "○",
    },
    {
      key: "value",
      number: "02",
      english: "VALUE",
      korean: "가치를 나누다",
      cue: "STORY · IDEA · ACTION",
      lead: "사람의 이야기와 생각을 발견하고, 우리가 중요하게 여기는 가치를 세상과 나눕니다.",
      href: "#/value",
      accent: "#ff9a7d",
      tint: "#fff0e9",
      glyph: "△",
    },
    {
      key: "together",
      number: "03",
      english: "TOGETHER",
      korean: "같이 하다",
      cue: "NEWS · GATHER · PLAY",
      lead: "소식과 모임, 활동을 통해 청파의 오늘을 함께 만들어갑니다.",
      href: "#/login",
      accent: "#d7ef68",
      tint: "#f4ffd2",
      glyph: "✳",
    },
  ];

  const detailContent = {
    like: {
      number: "01",
      english: "LIKE",
      title: "같이 닮다",
      lead: "예배와 말씀 안에서 예수님의 마음을 배우고, 청파가 걸어온 신앙의 방향을 오늘의 삶으로 이어갑니다.",
      items: [
        ["A", "청파의 정신", "약자의 곁에 서고 평화를 사랑하는 공동체의 방향"],
        ["B", "예배", "함께 드린 예배와 메시지를 다시 만나는 아카이브"],
        ["C", "말씀", "묵상과 기록을 일상의 선택으로 이어가는 콘텐츠"],
      ],
    },
    value: {
      number: "02",
      english: "VALUE",
      title: "가치를 나누다",
      lead: "사람의 경험과 생각을 기록하고, 돌봄과 평화를 구체적인 프로젝트와 실천으로 확장합니다.",
      items: [
        ["A", "이야기", "목회자와 청년들의 삶과 신앙을 담는 인터뷰"],
        ["B", "칼럼", "공동체와 세상을 함께 바라보는 질문과 관점"],
        ["C", "프로젝트", "봉사와 캠페인, 연대로 이어지는 실제 행동"],
      ],
    },
  };

  const layouts = [
    [
      { left: 6, top: 8, rot: -4 },
      { left: 47, top: 27, rot: 3 },
      { left: 19, top: 53, rot: -1 },
    ],
    [
      { left: 44, top: 7, rot: 2 },
      { left: 5, top: 31, rot: -3 },
      { left: 48, top: 54, rot: 4 },
    ],
    [
      { left: 8, top: 39, rot: 2 },
      { left: 52, top: 8, rot: -4 },
      { left: 36, top: 58, rot: 1 },
    ],
  ];

  const routePath = () => {
    const raw = window.location.hash.replace(/^#/, "") || "/gateway";
    return (`/${raw.split("?")[0]}`).replace(/\/+/g, "/").replace(/\/$/, "") || "/";
  };

  const create = (tag, options = {}, children = []) => {
    const node = document.createElement(tag);
    Object.entries(options).forEach(([key, value]) => {
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
    return create("header", { className: `brand-m-header${compact ? " brand-m-header--compact" : ""}` }, [
      create("a", { className: "brand-m-logo", href: "#/gateway", "aria-label": "청파 같이 첫 화면" }, [
        create("img", { src: "./assets/images/logo.svg", alt: "", width: "30", height: "30" }),
        create("span", { text: "CHEONGPA GACHI" }),
      ]),
      create("div", { className: "brand-m-header__meta", "aria-hidden": "true" }, [
        create("span", { text: "OPEN CANVAS" }),
        create("span", { text: "SEOUL · 2026" }),
      ]),
      create("a", { className: "brand-m-enter", href: "#/login" }, [
        create("span", { text: "TOGETHER" }),
        create("b", { text: "↗", "aria-hidden": "true" }),
      ]),
    ]);
  }

  function windowCard(scene, index) {
    return create("a", {
      className: `brand-m-window brand-m-window--${scene.key}`,
      href: scene.href,
      dataset: { window: scene.key, index: String(index) },
      style: `--accent:${scene.accent};--tint:${scene.tint};`,
      "aria-label": `${scene.english.charAt(0)}${scene.english.slice(1).toLowerCase()} — ${scene.korean}`,
    }, [
      create("div", { className: "brand-m-window__surface" }, [
        create("div", { className: "brand-m-window__bar", "aria-hidden": "true" }, [
          create("span"), create("span"), create("span"),
          create("small", { text: `WINDOW ${scene.number}` }),
        ]),
        create("div", { className: "brand-m-window__body" }, [
          create("div", { className: "brand-m-window__glyph", text: scene.glyph, "aria-hidden": "true" }),
          create("div", { className: "brand-m-window__copy" }, [
            create("span", { text: scene.cue }),
            create("strong", { text: scene.english }),
            create("h2", { text: scene.korean }),
            create("p", { text: scene.lead }),
          ]),
          create("div", { className: "brand-m-window__open" }, [
            create("span", { text: "OPEN" }),
            create("b", { text: "↗", "aria-hidden": "true" }),
          ]),
        ]),
      ]),
    ]);
  }

  function applyLayout(playground, layoutIndex, instant = false) {
    const layout = layouts[layoutIndex % layouts.length];
    playground.dataset.layout = String(layoutIndex % layouts.length);
    playground.querySelectorAll("[data-window]").forEach((node, index) => {
      const position = layout[index];
      node.style.setProperty("--left", `${position.left}%`);
      node.style.setProperty("--top", `${position.top}%`);
      node.style.setProperty("--rot", `${position.rot}deg`);
      node.style.setProperty("--drag-x", "0px");
      node.style.setProperty("--drag-y", "0px");
      if (instant) node.dataset.instant = "true";
      else delete node.dataset.instant;
    });
    if (instant) requestAnimationFrame(() => {
      playground.querySelectorAll("[data-window]").forEach((node) => delete node.dataset.instant);
    });
  }

  function bindPlayground(scope) {
    const playground = scope.querySelector(".brand-m-playground");
    if (!playground) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let layoutIndex = 0;
    let z = 10;
    let suppressClick = false;

    applyLayout(playground, layoutIndex, true);

    playground.querySelectorAll("[data-window]").forEach((node) => {
      let startX = 0;
      let startY = 0;
      let originX = 0;
      let originY = 0;
      let moved = false;

      node.addEventListener("pointerdown", (event) => {
        if (event.pointerType === "touch" || window.innerWidth < 760) return;
        const currentX = Number.parseFloat(node.dataset.dragX || "0");
        const currentY = Number.parseFloat(node.dataset.dragY || "0");
        startX = event.clientX;
        startY = event.clientY;
        originX = currentX;
        originY = currentY;
        moved = false;
        node.dataset.dragging = "true";
        node.style.zIndex = String(++z);
        node.setPointerCapture?.(event.pointerId);
      });

      node.addEventListener("pointermove", (event) => {
        if (node.dataset.dragging !== "true") return;
        const dx = originX + event.clientX - startX;
        const dy = originY + event.clientY - startY;
        if (Math.abs(dx - originX) + Math.abs(dy - originY) > 5) moved = true;
        node.dataset.dragX = String(dx);
        node.dataset.dragY = String(dy);
        node.style.setProperty("--drag-x", `${dx.toFixed(1)}px`);
        node.style.setProperty("--drag-y", `${dy.toFixed(1)}px`);
      });

      const endDrag = (event) => {
        if (node.dataset.dragging !== "true") return;
        delete node.dataset.dragging;
        node.releasePointerCapture?.(event.pointerId);
        if (moved) {
          suppressClick = true;
          window.setTimeout(() => { suppressClick = false; }, 0);
        }
      };
      node.addEventListener("pointerup", endDrag);
      node.addEventListener("pointercancel", endDrag);
      node.addEventListener("click", (event) => {
        if (suppressClick) event.preventDefault();
      });
      node.addEventListener("focus", () => { node.style.zIndex = String(++z); });
      node.addEventListener("pointerenter", () => { node.style.zIndex = String(++z); });
    });

    scope.querySelector("[data-shuffle]")?.addEventListener("click", () => {
      layoutIndex = (layoutIndex + 1) % layouts.length;
      applyLayout(playground, layoutIndex);
      playground.dataset.shuffling = "true";
      window.setTimeout(() => delete playground.dataset.shuffling, reduced ? 0 : 720);
    });

    scope.querySelector("[data-reset]")?.addEventListener("click", () => {
      layoutIndex = 0;
      playground.querySelectorAll("[data-window]").forEach((node) => {
        node.dataset.dragX = "0";
        node.dataset.dragY = "0";
      });
      applyLayout(playground, layoutIndex);
    });

    if (!reduced) {
      playground.addEventListener("pointermove", (event) => {
        const rect = playground.getBoundingClientRect();
        const x = (event.clientX - rect.left) / Math.max(rect.width, 1) - .5;
        const y = (event.clientY - rect.top) / Math.max(rect.height, 1) - .5;
        playground.style.setProperty("--mx", x.toFixed(3));
        playground.style.setProperty("--my", y.toFixed(3));
      });
      playground.addEventListener("pointerleave", () => {
        playground.style.setProperty("--mx", "0");
        playground.style.setProperty("--my", "0");
      });
    }
  }

  function bindStatement(scope) {
    if (!("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("is-visible");
      });
    }, { threshold: .35 });
    scope.querySelectorAll(".brand-m-statement__line").forEach((line) => observer.observe(line));
  }

  function renderGateway() {
    const main = create("main", { id: "brand-main-content", className: "brand-m-shell", tabindex: "-1" }, [
      header(),
      create("section", { className: "brand-m-hero", "aria-labelledby": "brand-m-title" }, [
        create("div", { className: "brand-m-hero__intro" }, [
          create("span", { text: "DRAG WINDOWS / SHUFFLE THE VIEW" }),
          create("h1", { id: "brand-m-title", text: "하나의 같이, 세 개의 창." }),
          create("p", { text: "정해진 순서 없이 열어보고, 움직이고, 겹쳐보세요. 청파 같이는 세 방향이 함께 있을 때 완성됩니다." }),
        ]),
        create("div", { className: "brand-m-playground", dataset: { layout: "0" } }, [
          create("div", { className: "brand-m-playground__grid", "aria-hidden": "true" }),
          create("div", { className: "brand-m-playground__ghost", "aria-hidden": "true" }, [
            create("span", { text: "GACHI" }),
            create("b", { text: "같이" }),
          ]),
          ...scenes.map(windowCard),
          create("div", { className: "brand-m-controls" }, [
            create("button", { type: "button", dataset: { shuffle: "" } }, [
              create("span", { text: "SHUFFLE" }), create("b", { text: "↻", "aria-hidden": "true" }),
            ]),
            create("button", { type: "button", dataset: { reset: "" } }, [
              create("span", { text: "RESET" }), create("b", { text: "×", "aria-hidden": "true" }),
            ]),
          ]),
          create("span", { className: "brand-m-playground__hint", text: "DRAG A WINDOW · CLICK TO OPEN" }),
        ]),
      ]),
      create("section", { className: "brand-m-statement", "aria-label": "청파 같이 방향" }, [
        create("div", { className: "brand-m-statement__eyebrow" }, [
          create("span", { text: "THE SHARED DIRECTION" }),
          create("span", { text: "01—03" }),
        ]),
        create("div", { className: "brand-m-statement__line brand-m-statement__line--one" }, [
          create("small", { text: "WE" }), create("strong", { text: "닮고" }), create("em", { text: "BECOME" }),
        ]),
        create("div", { className: "brand-m-statement__line brand-m-statement__line--two" }, [
          create("small", { text: "WE" }), create("strong", { text: "나누고" }), create("em", { text: "SHARE" }),
        ]),
        create("div", { className: "brand-m-statement__line brand-m-statement__line--three" }, [
          create("small", { text: "WE" }), create("strong", { text: "함께합니다" }), create("em", { text: "TOGETHER" }),
        ]),
      ]),
      create("section", { className: "brand-m-principles", "aria-label": "청파의 방향" }, [
        create("div", { className: "brand-m-principles__word", text: "CARE" }),
        create("p", { text: "더 약한 이의 곁으로." }),
        create("div", { className: "brand-m-principles__divider", "aria-hidden": "true" }),
        create("div", { className: "brand-m-principles__word", text: "PEACE" }),
        create("p", { text: "더 평화로운 쪽으로." }),
      ]),
      create("section", { className: "brand-m-directory", "aria-label": "청파 같이 세 영역 바로가기" }, scenes.map((scene) =>
        create("a", { className: `brand-m-directory__row brand-m-directory__row--${scene.key}`, href: scene.href }, [
          create("span", { text: scene.number }),
          create("strong", { text: scene.english }),
          create("em", { text: scene.korean }),
          create("b", { text: "↗", "aria-hidden": "true" }),
        ])
      )),
      create("footer", { className: "brand-m-footer" }, [
        create("span", { text: "CHEONGPA GACHI" }),
        create("span", { text: "LIKE · VALUE · TOGETHER" }),
        create("span", { text: "SEOUL / 2026" }),
      ]),
    ]);

    root.replaceChildren(main);
    bindPlayground(main);
    bindStatement(main);
  }

  function renderDetail(type) {
    const content = detailContent[type];
    if (!content) return renderGateway();
    const scene = scenes.find((item) => item.key === type);
    const main = create("main", { id: "brand-main-content", className: `brand-m-detail brand-m-detail--${type}`, tabindex: "-1", style: `--accent:${scene.accent};--tint:${scene.tint};` }, [
      header(true),
      create("section", { className: "brand-m-detail__canvas" }, [
        create("div", { className: "brand-m-detail__ghost", text: content.english, "aria-hidden": "true" }),
        create("a", { className: "brand-m-detail__back", href: "#/gateway", text: "← ALL WINDOWS" }),
        create("article", { className: "brand-m-detail__window" }, [
          create("div", { className: "brand-m-window__bar", "aria-hidden": "true" }, [create("span"), create("span"), create("span"), create("small", { text: `WINDOW ${content.number}` })]),
          create("div", { className: "brand-m-detail__window-body" }, [
            create("span", { text: scene.cue }),
            create("h1", { text: content.english }),
            create("h2", { text: content.title }),
            create("p", { text: content.lead }),
          ]),
        ]),
      ]),
      create("section", { className: "brand-m-detail__list", "aria-label": `${content.title} 콘텐츠 구성` }, content.items.map((item) =>
        create("article", { className: "brand-m-detail__item" }, [
          create("span", { text: item[0] }),
          create("h3", { text: item[1] }),
          create("p", { text: item[2] }),
          create("em", { text: "COMING SOON" }),
        ])
      )),
      create("a", { className: "brand-m-detail__next", href: type === "like" ? "#/value" : "#/login" }, [
        create("small", { text: "NEXT WINDOW" }),
        create("strong", { text: type === "like" ? "VALUE →" : "TOGETHER →" }),
      ]),
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
    if (!PUBLIC_ROUTES.has(path)) {
      enterCommunity();
      return;
    }
    document.documentElement.dataset.brandPublic = "true";
    root.hidden = false;
    if (path === "/like") {
      document.title = "같이 닮다 | 청파 같이";
      renderDetail("like");
    } else if (path === "/value") {
      document.title = "가치를 나누다 | 청파 같이";
      renderDetail("value");
    } else {
      document.title = "청파 같이 | Like · Value · Together";
      renderGateway();
    }
  }

  window.addEventListener("hashchange", renderRoute);
  document.getElementById("skip-link")?.addEventListener("click", () => {
    if (document.documentElement.dataset.brandPublic === "true") {
      document.getElementById("brand-main-content")?.focus();
    }
  });

  renderRoute();
})();
