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
      accent: "#a9ddff",
      accentSoft: "#e8f7ff",
      contrast: "#27566d",
    },
    {
      key: "value",
      number: "02",
      english: "VALUE",
      korean: "가치를 나누다",
      cue: "STORY · IDEA · ACTION",
      lead: "사람의 이야기와 생각을 발견하고, 우리가 중요하게 여기는 가치를 세상과 나눕니다.",
      href: "#/value",
      accent: "#ff947e",
      accentSoft: "#fff0e9",
      contrast: "#7a3123",
    },
    {
      key: "together",
      number: "03",
      english: "TOGETHER",
      korean: "같이 하다",
      cue: "NEWS · GATHER · PLAY",
      lead: "소식과 모임, 활동을 통해 청파의 오늘을 함께 만들어갑니다.",
      href: "#/login",
      accent: "#d8ef6c",
      accentSoft: "#f5ffd9",
      contrast: "#465315",
    },
  ];

  const detailContent = {
    like: {
      number: "01",
      english: "LIKE",
      title: "같이 닮다",
      lead: "예배와 말씀 안에서 예수님의 마음을 배우고, 청파가 걸어온 신앙의 방향을 오늘의 삶으로 이어갑니다.",
      items: [
        ["01", "청파의 정신", "약자의 곁에 서고 평화를 사랑하는 공동체의 방향"],
        ["02", "예배", "함께 드린 예배와 메시지를 다시 만나는 아카이브"],
        ["03", "말씀", "묵상과 기록을 일상의 선택으로 이어가는 콘텐츠"],
      ],
    },
    value: {
      number: "02",
      english: "VALUE",
      title: "가치를 나누다",
      lead: "사람의 경험과 생각을 기록하고, 돌봄과 평화를 구체적인 프로젝트와 실천으로 확장합니다.",
      items: [
        ["01", "이야기", "목회자와 청년들의 삶과 신앙을 담는 인터뷰"],
        ["02", "칼럼", "공동체와 세상을 함께 바라보는 질문과 관점"],
        ["03", "프로젝트", "봉사와 캠페인, 연대로 이어지는 실제 행동"],
      ],
    },
  };

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
    return create("header", { className: `brand-l-header${compact ? " brand-l-header--compact" : ""}` }, [
      create("a", { className: "brand-l-logo", href: "#/gateway", "aria-label": "청파 같이 첫 화면" }, [
        create("img", { src: "./assets/images/logo.svg", alt: "", width: "30", height: "30" }),
        create("span", { text: "CHEONGPA GACHI" }),
      ]),
      create("div", { className: "brand-l-header__meta", "aria-hidden": "true" }, [
        create("span", { text: "FOLD / MOVE / OPEN" }),
        create("i"),
        create("span", { text: "SEOUL · 2026" }),
      ]),
      create("a", { className: "brand-l-enter", href: "#/login" }, [
        create("span", { text: "TOGETHER" }),
        create("b", { text: "↗", "aria-hidden": "true" }),
      ]),
    ]);
  }

  function ribbonStrip(index) {
    return create("div", {
      className: "brand-l-ribbon__strip",
      dataset: { strip: String(index) },
      style: `--i:${index}`,
      "aria-hidden": "true",
    }, [
      create("div", { className: "brand-l-ribbon__paper" }, [
        create("strong", { className: "brand-l-ribbon__word", dataset: { ribbonWord: "" } }),
        create("span", { className: "brand-l-ribbon__ghost", dataset: { ribbonGhost: "" } }),
        create("i", { className: "brand-l-ribbon__crease" }),
      ]),
    ]);
  }

  function sceneSelector() {
    return create("nav", { className: "brand-l-selector", "aria-label": "청파 같이 세 영역" }, scenes.map((scene) =>
      create("button", {
        type: "button",
        className: `brand-l-selector__item brand-l-selector__item--${scene.key}`,
        dataset: { scene: scene.key },
        "aria-label": `${scene.english.charAt(0)}${scene.english.slice(1).toLowerCase()} — ${scene.korean}`,
      }, [
        create("span", { text: scene.number }),
        create("strong", { text: scene.english }),
        create("em", { text: scene.korean }),
      ])
    ));
  }

  function applyScene(scope, sceneKey, animate = true) {
    const scene = scenes.find((item) => item.key === sceneKey) || scenes[0];
    if (scope.dataset.active === scene.key && scope.dataset.ready === "true") return;
    scope.dataset.active = scene.key;
    scope.style.setProperty("--scene-accent", scene.accent);
    scope.style.setProperty("--scene-soft", scene.accentSoft);
    scope.style.setProperty("--scene-contrast", scene.contrast);

    const updateCopy = () => {
      scope.querySelectorAll("[data-ribbon-word]").forEach((node) => { node.textContent = scene.english; });
      scope.querySelectorAll("[data-ribbon-ghost]").forEach((node) => { node.textContent = scene.korean; });
      scope.querySelector("[data-scene-number]").textContent = scene.number;
      scope.querySelector("[data-scene-korean]").textContent = scene.korean;
      scope.querySelector("[data-scene-cue]").textContent = scene.cue;
      scope.querySelector("[data-scene-lead]").textContent = scene.lead;
      const open = scope.querySelector("[data-scene-open]");
      open.href = scene.href;
      open.querySelector("span").textContent = `${scene.number} / OPEN`;
      open.setAttribute("aria-label", `${scene.korean} 열기`);
    };

    if (animate) {
      scope.dataset.switching = "true";
      window.setTimeout(updateCopy, 180);
      window.setTimeout(() => { delete scope.dataset.switching; }, 760);
    } else {
      updateCopy();
    }

    scope.querySelectorAll("[data-scene]").forEach((node) => {
      node.dataset.active = String(node.dataset.scene === scene.key);
    });
    scope.dataset.ready = "true";
  }

  function adjacentScene(scope, direction) {
    const current = Math.max(0, scenes.findIndex((scene) => scene.key === scope.dataset.active));
    const next = (current + direction + scenes.length) % scenes.length;
    applyScene(scope, scenes[next].key);
  }

  function bindGateway(scope) {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const stage = scope.querySelector(".brand-l-ribbon");
    const strips = [...scope.querySelectorAll("[data-strip]")];
    const selector = [...scope.querySelectorAll("[data-scene]")];

    selector.forEach((item) => {
      item.addEventListener("pointerenter", () => applyScene(scope, item.dataset.scene));
      item.addEventListener("focus", () => applyScene(scope, item.dataset.scene));
      item.addEventListener("click", () => applyScene(scope, item.dataset.scene));
    });

    if (!reduced && stage) {
      stage.addEventListener("pointermove", (event) => {
        const rect = stage.getBoundingClientRect();
        const nx = (event.clientX - rect.left) / Math.max(rect.width, 1);
        const ny = (event.clientY - rect.top) / Math.max(rect.height, 1);
        strips.forEach((strip, index) => {
          const center = (index + .5) / strips.length;
          const distance = Math.abs(nx - center);
          const influence = Math.max(0, 1 - distance * 3.15);
          const direction = index % 2 === 0 ? -1 : 1;
          strip.style.setProperty("--lift", `${((ny - .5) * -34 * influence).toFixed(2)}px`);
          strip.style.setProperty("--tilt", `${(direction * influence * 3.8).toFixed(2)}deg`);
          strip.style.setProperty("--stretch", (1 + influence * .045).toFixed(3));
        });
        stage.style.setProperty("--pointer-x", nx.toFixed(3));
        stage.style.setProperty("--pointer-y", ny.toFixed(3));
      });
      stage.addEventListener("pointerleave", () => {
        strips.forEach((strip) => {
          strip.style.setProperty("--lift", "0px");
          strip.style.setProperty("--tilt", "0deg");
          strip.style.setProperty("--stretch", "1");
        });
      });
    }

    let pointerStartX = null;
    let pointerId = null;
    stage?.addEventListener("pointerdown", (event) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      pointerStartX = event.clientX;
      pointerId = event.pointerId;
      stage.setPointerCapture?.(event.pointerId);
      stage.dataset.dragging = "true";
    });
    stage?.addEventListener("pointerup", (event) => {
      if (pointerStartX == null || pointerId !== event.pointerId) return;
      const delta = event.clientX - pointerStartX;
      if (Math.abs(delta) > 58) adjacentScene(scope, delta < 0 ? 1 : -1);
      pointerStartX = null;
      pointerId = null;
      delete stage.dataset.dragging;
    });
    stage?.addEventListener("pointercancel", () => {
      pointerStartX = null;
      pointerId = null;
      delete stage.dataset.dragging;
    });
    stage?.addEventListener("wheel", (event) => {
      if (Math.abs(event.deltaX) < Math.abs(event.deltaY) || Math.abs(event.deltaX) < 24) return;
      event.preventDefault();
      if (stage.dataset.wheelLock === "true") return;
      stage.dataset.wheelLock = "true";
      adjacentScene(scope, event.deltaX > 0 ? 1 : -1);
      window.setTimeout(() => { delete stage.dataset.wheelLock; }, 520);
    }, { passive: false });

    applyScene(scope, "like", false);
  }

  function renderGateway() {
    const main = create("main", { id: "brand-main-content", className: "brand-l-shell", tabindex: "-1", dataset: { active: "like" } }, [
      header(),
      create("section", { className: "brand-l-hero", "aria-labelledby": "brand-l-title" }, [
        create("h1", { id: "brand-l-title", className: "brand-l-sr", text: "청파 같이" }),
        create("div", { className: "brand-l-hero__topline", "aria-hidden": "true" }, [
          create("span", { text: "ONE WORD / THREE DIRECTIONS" }),
          create("span", { text: "DRAG SIDEWAYS TO SWITCH" }),
        ]),
        create("div", { className: "brand-l-ribbon", "aria-label": "움직이는 청파 같이 리본" },
          Array.from({ length: 7 }, (_, index) => ribbonStrip(index))
        ),
        create("div", { className: "brand-l-scene-copy" }, [
          create("span", { className: "brand-l-scene-copy__number", dataset: { sceneNumber: "" } }),
          create("div", { className: "brand-l-scene-copy__body" }, [
            create("small", { dataset: { sceneCue: "" } }),
            create("h2", { dataset: { sceneKorean: "" } }),
            create("p", { dataset: { sceneLead: "" } }),
          ]),
          create("a", { className: "brand-l-open", href: "#/like", dataset: { sceneOpen: "" } }, [
            create("span", { text: "01 / OPEN" }),
            create("b", { text: "↗", "aria-hidden": "true" }),
          ]),
        ]),
        sceneSelector(),
      ]),
      create("section", { className: "brand-l-accordion", "aria-labelledby": "brand-l-accordion-title" }, [
        create("div", { className: "brand-l-accordion__intro" }, [
          create("span", { text: "FOLD THE THREE DIRECTIONS" }),
          create("h2", { id: "brand-l-accordion-title", text: "세 방향을 펼치면 하나의 같이가 됩니다." }),
          create("p", { text: "각 영역에 마우스를 올려 보세요. 접혀 있던 정보가 한 장씩 열립니다." }),
        ]),
        create("div", { className: "brand-l-folds" }, scenes.map((scene) =>
          create("a", { className: `brand-l-fold brand-l-fold--${scene.key}`, href: scene.href }, [
            create("span", { text: scene.number }),
            create("strong", { text: scene.english }),
            create("em", { text: scene.korean }),
            create("p", { text: scene.lead }),
            create("b", { text: "↗", "aria-hidden": "true" }),
          ])
        )),
      ]),
      create("section", { className: "brand-l-seam", "aria-label": "청파 같이 방향" }, [
        create("div", { className: "brand-l-seam__rail", "aria-hidden": "true" }, [
          create("span", { text: "HELP THE WEAK · LOVE PEACE · LIVE TOGETHER · HELP THE WEAK · LOVE PEACE · LIVE TOGETHER · " }),
        ]),
        create("div", { className: "brand-l-seam__copy" }, [
          create("small", { text: "CHEONGPA / COMMON DIRECTION" }),
          create("p", { text: "우리는 서로를 닮아가고," }),
          create("p", { text: "중요한 가치를 나누며," }),
          create("p", { text: "같이 살아갑니다." }),
        ]),
      ]),
      create("footer", { className: "brand-l-footer" }, [
        create("span", { text: "CHEONGPA GACHI" }),
        create("span", { text: "LIKE · VALUE · TOGETHER" }),
        create("span", { text: "© 2026" }),
      ]),
    ]);
    root.replaceChildren(main);
    bindGateway(main);
  }

  function renderDetail(type) {
    const content = detailContent[type];
    if (!content) return renderGateway();
    const scene = scenes.find((item) => item.key === type);
    const main = create("main", {
      id: "brand-main-content",
      className: `brand-l-detail brand-l-detail--${type}`,
      tabindex: "-1",
      style: `--scene-accent:${scene.accent};--scene-soft:${scene.accentSoft};--scene-contrast:${scene.contrast}`,
    }, [
      header(true),
      create("section", { className: "brand-l-detail__hero" }, [
        create("div", { className: "brand-l-detail__slices", "aria-hidden": "true" },
          Array.from({ length: 5 }, (_, index) => create("span", { style: `--i:${index}` }))
        ),
        create("div", { className: "brand-l-detail__index" }, [
          create("span", { text: content.number }),
          create("a", { href: "#/gateway", text: "← GATEWAY" }),
        ]),
        create("div", { className: "brand-l-detail__copy" }, [
          create("small", { text: "CHEONGPA GACHI / OPEN FOLD" }),
          create("h1", { text: content.english }),
          create("h2", { text: content.title }),
          create("p", { text: content.lead }),
        ]),
      ]),
      create("section", { className: "brand-l-detail__items", "aria-label": `${content.title} 콘텐츠 구성` }, content.items.map((item) =>
        create("article", { className: "brand-l-detail__item" }, [
          create("span", { text: item[0] }),
          create("h3", { text: item[1] }),
          create("p", { text: item[2] }),
          create("em", { text: "COMING SOON" }),
        ])
      )),
      create("a", { className: "brand-l-detail__next", href: type === "like" ? "#/value" : "#/login" }, [
        create("small", { text: "NEXT FOLD" }),
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