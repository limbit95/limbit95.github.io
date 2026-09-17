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
      lens: "BECOME",
      accent: "#a9ddff",
      accentSoft: "#e9f7ff",
    },
    {
      key: "value",
      number: "02",
      english: "VALUE",
      korean: "가치를 나누다",
      cue: "STORY · IDEA · ACTION",
      lead: "사람의 이야기와 생각을 발견하고, 우리가 중요하게 여기는 가치를 세상과 나눕니다.",
      href: "#/value",
      lens: "SHARE",
      accent: "#ff9e87",
      accentSoft: "#fff0e9",
    },
    {
      key: "together",
      number: "03",
      english: "TOGETHER",
      korean: "같이 하다",
      cue: "NEWS · GATHER · PLAY",
      lead: "소식과 모임, 활동을 통해 청파의 오늘을 함께 만들어갑니다.",
      href: "#/login",
      lens: "MEET",
      accent: "#c9ef74",
      accentSoft: "#f1ffd3",
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
    return create("header", { className: `brand-k-header${compact ? " brand-k-header--compact" : ""}` }, [
      create("a", { className: "brand-k-logo", href: "#/gateway", "aria-label": "청파 같이 첫 화면" }, [
        create("img", { src: "./assets/images/logo.svg", alt: "", width: "30", height: "30" }),
        create("span", { text: "CHEONGPA GACHI" }),
      ]),
      create("div", { className: "brand-k-header__meta", "aria-hidden": "true" }, [
        create("span", { text: "YOUTH COMMUNITY" }),
        create("i"),
        create("span", { text: "SEOUL · 2026" }),
      ]),
      create("a", { className: "brand-k-enter brand-k-magnetic", href: "#/login" }, [
        create("span", { text: "ENTER TOGETHER" }),
        create("b", { text: "↗", "aria-hidden": "true" }),
      ]),
    ]);
  }

  function sceneNav() {
    return create("nav", { className: "brand-k-nav", "aria-label": "청파 같이 세 영역" }, scenes.map((scene) =>
      create("a", {
        className: `brand-k-nav__item brand-k-nav__item--${scene.key}`,
        href: scene.href,
        dataset: { scene: scene.key },
        "aria-label": `${scene.english.charAt(0)}${scene.english.slice(1).toLowerCase()} — ${scene.korean}`,
      }, [
        create("span", { className: "brand-k-nav__number", text: scene.number }),
        create("strong", { text: scene.english }),
        create("em", { text: scene.korean }),
        create("i", { "aria-hidden": "true" }),
      ])
    ));
  }

  function stageLayer(className, revealed = false) {
    return create("div", { className, "aria-hidden": revealed ? "true" : null }, [
      create("span", { className: "brand-k-stage__cue", dataset: { sceneCue: "" } }),
      create("div", { className: "brand-k-stage__word", dataset: { sceneEnglish: "" } }),
      create("div", { className: "brand-k-stage__korean", dataset: { sceneKorean: "" } }),
      create("p", { className: "brand-k-stage__lead", dataset: { sceneLead: "" } }),
    ]);
  }

  function applyScene(stage, sceneKey) {
    const scene = scenes.find((item) => item.key === sceneKey) || scenes[0];
    stage.dataset.active = scene.key;
    stage.style.setProperty("--scene-accent", scene.accent);
    stage.style.setProperty("--scene-soft", scene.accentSoft);
    stage.querySelectorAll("[data-scene-english]").forEach((node) => { node.textContent = scene.english; });
    stage.querySelectorAll("[data-scene-korean]").forEach((node) => { node.textContent = scene.korean; });
    stage.querySelectorAll("[data-scene-cue]").forEach((node) => { node.textContent = scene.cue; });
    stage.querySelectorAll("[data-scene-lead]").forEach((node) => { node.textContent = scene.lead; });
    const lensWord = stage.querySelector("[data-lens-word]");
    if (lensWord) lensWord.textContent = scene.lens;
    const open = stage.querySelector("[data-scene-open]");
    if (open) {
      open.href = scene.href;
      open.setAttribute("aria-label", `${scene.korean} 열기`);
      open.querySelector("span").textContent = `${scene.number} / OPEN`;
    }
    stage.querySelectorAll("[data-scene]").forEach((node) => {
      node.dataset.active = String(node.dataset.scene === scene.key);
    });
  }

  function bindMagnetic(scope) {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    scope.querySelectorAll(".brand-k-magnetic").forEach((node) => {
      node.addEventListener("pointermove", (event) => {
        const rect = node.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        node.style.setProperty("--mag-x", `${(x * .12).toFixed(1)}px`);
        node.style.setProperty("--mag-y", `${(y * .12).toFixed(1)}px`);
      });
      node.addEventListener("pointerleave", () => {
        node.style.setProperty("--mag-x", "0px");
        node.style.setProperty("--mag-y", "0px");
      });
    });
  }

  function bindGateway(stage) {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canvas = stage.querySelector(".brand-k-canvas");
    const cursor = stage.querySelector(".brand-k-cursor");
    const navItems = [...stage.querySelectorAll("[data-scene]")];

    navItems.forEach((item) => {
      const preview = () => applyScene(stage, item.dataset.scene);
      item.addEventListener("pointerenter", preview);
      item.addEventListener("focus", preview);
    });

    if (canvas && !reduced) {
      canvas.addEventListener("pointermove", (event) => {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        canvas.style.setProperty("--lens-x", `${x.toFixed(1)}px`);
        canvas.style.setProperty("--lens-y", `${y.toFixed(1)}px`);
        canvas.style.setProperty("--parallax-x", ((x / Math.max(rect.width, 1) - .5) * 1).toFixed(3));
        canvas.style.setProperty("--parallax-y", ((y / Math.max(rect.height, 1) - .5) * 1).toFixed(3));
        if (cursor) {
          cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
          cursor.dataset.visible = "true";
        }
      });
      canvas.addEventListener("pointerleave", () => {
        if (cursor) cursor.dataset.visible = "false";
      });
    }

    const constellation = stage.querySelector(".brand-k-constellation");
    if (constellation && !reduced) {
      constellation.addEventListener("pointermove", (event) => {
        const rect = constellation.getBoundingClientRect();
        const x = event.clientX / Math.max(rect.width, 1) - .5;
        const y = (event.clientY - rect.top) / Math.max(rect.height, 1) - .5;
        constellation.style.setProperty("--cx", x.toFixed(3));
        constellation.style.setProperty("--cy", y.toFixed(3));
      });
      constellation.addEventListener("pointerleave", () => {
        constellation.style.setProperty("--cx", "0");
        constellation.style.setProperty("--cy", "0");
      });
    }

    bindMagnetic(stage);
    applyScene(stage, "like");
  }

  function renderGateway() {
    const main = create("main", { id: "brand-main-content", className: "brand-k-shell", tabindex: "-1" }, [
      header(),
      create("section", { className: "brand-k-stage", dataset: { active: "like" }, "aria-labelledby": "brand-k-title" }, [
        create("h1", { id: "brand-k-title", className: "brand-k-sr", text: "청파 같이" }),
        sceneNav(),
        create("div", { className: "brand-k-canvas" }, [
          create("div", { className: "brand-k-grid", "aria-hidden": "true" }),
          create("div", { className: "brand-k-stage__meta" }, [
            create("span", { text: "THREE WAYS OF GACHI" }),
            create("span", { text: "MOVE TO REVEAL" }),
          ]),
          stageLayer("brand-k-layer brand-k-layer--base"),
          stageLayer("brand-k-layer brand-k-layer--reveal", true),
          create("a", { className: "brand-k-open brand-k-magnetic", href: "#/like", dataset: { sceneOpen: "" } }, [
            create("span", { text: "01 / OPEN" }),
            create("b", { text: "↗", "aria-hidden": "true" }),
          ]),
          create("div", { className: "brand-k-lens-label", "aria-hidden": "true" }, [
            create("small", { text: "INSIDE THE LENS" }),
            create("strong", { text: "BECOME", dataset: { lensWord: "" } }),
          ]),
          create("div", { className: "brand-k-cursor", "aria-hidden": "true" }, [
            create("span", { text: "LOOK" }),
          ]),
        ]),
      ]),
      create("section", { className: "brand-k-constellation", "aria-labelledby": "brand-k-map-title" }, [
        create("div", { className: "brand-k-constellation__intro" }, [
          create("span", { text: "ONE COMMUNITY / THREE SIGNALS" }),
          create("h2", { id: "brand-k-map-title", text: "서로 다른 방향이 하나의 같이를 만듭니다." }),
          create("p", { text: "세 영역은 분리된 메뉴가 아니라 서로 영향을 주고받는 하나의 흐름입니다." }),
        ]),
        create("div", { className: "brand-k-map", "aria-label": "Like, Value, Together 연결 구조" }, [
          create("div", { className: "brand-k-map__line brand-k-map__line--a", "aria-hidden": "true" }),
          create("div", { className: "brand-k-map__line brand-k-map__line--b", "aria-hidden": "true" }),
          create("div", { className: "brand-k-map__line brand-k-map__line--c", "aria-hidden": "true" }),
          ...scenes.map((scene) => create("a", { className: `brand-k-node brand-k-node--${scene.key} brand-k-magnetic`, href: scene.href }, [
            create("small", { text: scene.number }),
            create("strong", { text: scene.english }),
            create("span", { text: scene.korean }),
          ])),
          create("div", { className: "brand-k-map__center", "aria-hidden": "true" }, [
            create("span", { text: "같이" }),
            create("small", { text: "GACHI" }),
          ]),
        ]),
      ]),
      create("section", { className: "brand-k-bands", "aria-label": "청파 같이 가치" }, [
        create("div", { className: "brand-k-band brand-k-band--sky" }, [create("span", { text: "닮고" }), create("strong", { text: "LIKE WHAT GIVES LIFE" })]),
        create("div", { className: "brand-k-band brand-k-band--coral" }, [create("span", { text: "나누고" }), create("strong", { text: "SHARE WHAT MATTERS" })]),
        create("div", { className: "brand-k-band brand-k-band--lime" }, [create("span", { text: "함께" }), create("strong", { text: "MAKE ROOM FOR EACH OTHER" })]),
      ]),
      create("footer", { className: "brand-k-footer" }, [
        create("span", { text: "CHEONGPA GACHI" }),
        create("span", { text: "LIKE · VALUE · TOGETHER" }),
        create("span", { text: "© 2026" }),
      ]),
    ]);

    root.replaceChildren(main);
    bindGateway(main.querySelector(".brand-k-stage"));
    bindMagnetic(main);
  }

  function renderDetail(type) {
    const content = detailContent[type];
    if (!content) return renderGateway();
    const scene = scenes.find((item) => item.key === type);
    const main = create("main", { id: "brand-main-content", className: `brand-k-detail brand-k-detail--${type}`, tabindex: "-1", style: `--scene-accent:${scene.accent};--scene-soft:${scene.accentSoft}` }, [
      header(true),
      create("section", { className: "brand-k-detail__hero" }, [
        create("div", { className: "brand-k-detail__rail" }, [
          create("span", { text: content.number }),
          create("a", { href: "#/gateway", text: "← ALL THREE" }),
        ]),
        create("div", { className: "brand-k-detail__title" }, [
          create("span", { text: "CHEONGPA GACHI / PUBLIC AREA" }),
          create("h1", { text: content.english }),
          create("h2", { text: content.title }),
          create("p", { text: content.lead }),
        ]),
        create("div", { className: "brand-k-detail__orb", "aria-hidden": "true" }, [
          create("span", { text: type === "like" ? "BECOME" : "SHARE" }),
          create("i"),
          create("b", { text: content.number }),
        ]),
      ]),
      create("section", { className: "brand-k-detail__list", "aria-label": `${content.title} 콘텐츠 구성` }, content.items.map((item) =>
        create("article", { className: "brand-k-detail__item" }, [
          create("span", { text: item[0] }),
          create("h3", { text: item[1] }),
          create("p", { text: item[2] }),
          create("em", { text: "COMING SOON" }),
        ])
      )),
      create("a", { className: "brand-k-detail__next brand-k-magnetic", href: type === "like" ? "#/value" : "#/login" }, [
        create("small", { text: "NEXT DIRECTION" }),
        create("strong", { text: type === "like" ? "VALUE →" : "TOGETHER →" }),
      ]),
    ]);
    root.replaceChildren(main);
    bindMagnetic(main);
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
