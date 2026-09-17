(() => {
  const PUBLIC_ROUTES = new Set(["/gateway", "/like", "/value"]);
  const root = document.getElementById("brand-gateway-root");
  if (!root) return;

  const scenes = [
    { key: "like", number: "01", english: "LIKE", korean: "같이 닮다", short: "닮아가는 자리", cue: "WORSHIP · WORD · FAITH", lead: "예배와 말씀 안에서 같은 방향을 바라보고, 서로의 삶 곁에서 천천히 닮아갑니다.", href: "#/like", accent: "#b9dcff", soft: "#edf7ff" },
    { key: "value", number: "02", english: "VALUE", korean: "가치를 나누다", short: "마음을 나누는 자리", cue: "STORY · IDEA · ACTION", lead: "우리의 이야기와 생각을 꺼내 놓고, 중요하게 여기는 가치를 함께 세상으로 이어갑니다.", href: "#/value", accent: "#ffb39d", soft: "#fff0ea" },
    { key: "together", number: "03", english: "TOGETHER", korean: "같이 하다", short: "함께 살아가는 자리", cue: "NEWS · GATHER · PLAY", lead: "소식과 모임, 활동을 통해 서로의 오늘을 만나고 공동체의 시간을 함께 만들어갑니다.", href: "#/login", accent: "#cfe98b", soft: "#f2fad9" },
  ];

  const details = {
    like: { english: "LIKE", title: "같이 닮다", lead: "예배와 말씀 안에서 예수님의 마음을 배우고, 청파가 걸어온 신앙의 방향을 오늘의 삶으로 이어갑니다.", items: [["01","청파의 정신","약자의 곁에 서고 평화를 사랑하는 공동체의 방향"],["02","예배","함께 드린 예배와 메시지를 다시 만나는 아카이브"],["03","말씀","묵상과 기록을 일상의 선택으로 이어가는 콘텐츠"]] },
    value: { english: "VALUE", title: "가치를 나누다", lead: "사람의 경험과 생각을 기록하고, 돌봄과 평화를 구체적인 프로젝트와 실천으로 확장합니다.", items: [["01","이야기","목회자와 청년들의 삶과 신앙을 담는 인터뷰"],["02","칼럼","공동체와 세상을 함께 바라보는 질문과 관점"],["03","프로젝트","봉사와 캠페인, 연대로 이어지는 실제 행동"]] },
  };

  const el = (tag, attrs = {}, children = []) => {
    const node = document.createElement(tag);
    Object.entries(attrs).forEach(([key, value]) => {
      if (value == null || value === false) return;
      if (key === "className") node.className = value;
      else if (key === "text") node.textContent = String(value);
      else if (key === "dataset") Object.assign(node.dataset, value);
      else if (key === "style") node.setAttribute("style", value);
      else node.setAttribute(key, value === true ? "" : String(value));
    });
    (Array.isArray(children) ? children : [children]).forEach((child) => {
      if (child == null || child === false) return;
      node.append(child instanceof Node ? child : document.createTextNode(String(child)));
    });
    return node;
  };

  const pathOf = () => {
    const raw = window.location.hash.replace(/^#/, "") || "/gateway";
    return (`/${raw.split("?")[0]}`).replace(/\/+/g, "/").replace(/\/$/, "") || "/";
  };

  const header = () => el("header", { className: "brand-n-header" }, [
    el("a", { className: "brand-n-logo", href: "#/gateway", "aria-label": "청파 같이 첫 화면" }, [
      el("img", { src: "./assets/images/logo.svg", alt: "", width: "30", height: "30" }),
      el("span", { text: "CHEONGPA GACHI" }),
    ]),
    el("div", { className: "brand-n-header__words", "aria-hidden": "true" }, [el("span", { text: "LIKE" }), el("i"), el("span", { text: "VALUE" }), el("i"), el("span", { text: "TOGETHER" })]),
    el("a", { className: "brand-n-enter", href: "#/login" }, [el("span", { text: "COMMUNITY" }), el("b", { text: "↗", "aria-hidden": "true" })]),
  ]);

  function orbitItem(scene) {
    return el("a", {
      className: `brand-n-orbit__item brand-n-orbit__item--${scene.key}`,
      href: scene.href,
      dataset: { scene: scene.key },
      "aria-label": `${scene.english.charAt(0)}${scene.english.slice(1).toLowerCase()} — ${scene.korean}`,
    }, [
      el("span", { className: "brand-n-orbit__number", text: scene.number }),
      el("div", { className: "brand-n-orbit__copy" }, [el("strong", { text: scene.english }), el("em", { text: scene.korean })]),
      el("span", { className: "brand-n-orbit__arrow", text: "↗", "aria-hidden": "true" }),
    ]);
  }

  function applyScene(main, key) {
    const scene = scenes.find((item) => item.key === key) || scenes[0];
    main.dataset.active = scene.key;
    main.style.setProperty("--active-accent", scene.accent);
    main.style.setProperty("--active-soft", scene.soft);
    [["sceneNumber", scene.number],["sceneShort", scene.short],["sceneKorean", scene.korean],["sceneCue", scene.cue],["sceneLead", scene.lead]].forEach(([name, value]) => {
      const node = main.querySelector(`[data-${name.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`)}]`);
      if (node) node.textContent = value;
    });
    const open = main.querySelector("[data-scene-open]");
    if (open) open.href = scene.href;
    main.querySelectorAll("[data-scene]").forEach((node) => node.dataset.active = String(node.dataset.scene === scene.key));
  }

  function bindGateway(main) {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const field = main.querySelector(".brand-n-field");
    const dots = [...main.querySelectorAll(".brand-n-person")];
    main.querySelectorAll("[data-scene]").forEach((node) => {
      const activate = () => applyScene(main, node.dataset.scene);
      node.addEventListener("pointerenter", activate);
      node.addEventListener("focus", activate);
    });
    if (field && !reduced) {
      field.addEventListener("pointermove", (event) => {
        const rect = field.getBoundingClientRect();
        const x = (event.clientX - rect.left) / Math.max(rect.width, 1) - .5;
        const y = (event.clientY - rect.top) / Math.max(rect.height, 1) - .5;
        field.style.setProperty("--mx", x.toFixed(3));
        field.style.setProperty("--my", y.toFixed(3));
        dots.forEach((dot, i) => {
          const amount = 7 + (i % 5) * 2.5;
          const sign = i % 2 ? -1 : 1;
          dot.style.transform = `translate3d(${(x * amount * sign).toFixed(1)}px, ${(y * amount * sign).toFixed(1)}px,0)`;
        });
      });
      field.addEventListener("pointerleave", () => dots.forEach((dot) => dot.style.transform = ""));
    }
    const observer = "IntersectionObserver" in window ? new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.dataset.revealed = "true";
    }), { threshold: .18 }) : null;
    main.querySelectorAll("[data-reveal]").forEach((node) => observer?.observe(node));
    applyScene(main, "like");
  }

  function renderGateway() {
    const people = Array.from({ length: 18 }, (_, i) => el("i", { className: `brand-n-person brand-n-person--${(i % 6) + 1}`, "aria-hidden": "true" }));
    const main = el("main", { id: "brand-main-content", className: "brand-n-shell", tabindex: "-1", dataset: { active: "like" } }, [
      header(),
      el("section", { className: "brand-n-hero", "aria-labelledby": "brand-n-title" }, [
        el("div", { className: "brand-n-hero__intro" }, [
          el("span", { className: "brand-n-kicker", text: "CHEONGPA YOUTH COMMUNITY · SEOUL" }),
          el("h1", { id: "brand-n-title" }, [el("span", { text: "우리는" }), el("strong", { text: "같이" }), el("span", { text: "자랍니다." })]),
          el("p", { text: "닮고, 나누고, 함께하는 세 방향이 한가운데에서 만납니다." }),
        ]),
        el("div", { className: "brand-n-field" }, [
          ...people,
          el("div", { className: "brand-n-orbit", "aria-label": "청파 같이 세 영역" }, [
            el("div", { className: "brand-n-ring brand-n-ring--outer", "aria-hidden": "true" }),
            el("div", { className: "brand-n-ring brand-n-ring--middle", "aria-hidden": "true" }),
            ...scenes.map(orbitItem),
            el("div", { className: "brand-n-center" }, [
              el("span", { className: "brand-n-center__eyebrow", text: "MEET AT THE CENTER" }),
              el("strong", { text: "같이" }),
              el("small", { text: "GACHI" }),
              el("i", { "aria-hidden": "true" }),
            ]),
          ]),
          el("aside", { className: "brand-n-scene" }, [
            el("div", { className: "brand-n-scene__top" }, [el("span", { dataset: { sceneNumber: "" }, text: "01" }), el("span", { dataset: { sceneCue: "" }, text: scenes[0].cue })]),
            el("span", { className: "brand-n-scene__short", dataset: { sceneShort: "" }, text: scenes[0].short }),
            el("h2", { dataset: { sceneKorean: "" }, text: scenes[0].korean }),
            el("p", { dataset: { sceneLead: "" }, text: scenes[0].lead }),
            el("a", { className: "brand-n-scene__open", href: "#/like", dataset: { sceneOpen: "" } }, [el("span", { text: "이 자리 보기" }), el("b", { text: "↗", "aria-hidden": "true" })]),
          ]),
        ]),
      ]),
      el("section", { className: "brand-n-gather", dataset: { reveal: "" }, "aria-labelledby": "brand-n-gather-title" }, [
        el("div", { className: "brand-n-gather__head" }, [el("span", { text: "A COMMUNITY IS MADE IN THE MIDDLE" }), el("h2", { id: "brand-n-gather-title", text: "각자의 자리에서 와서, 하나의 원을 만듭니다." })]),
        el("div", { className: "brand-n-gather__circles" }, [
          el("div", { className: "brand-n-gather__circle brand-n-gather__circle--a" }, [el("small", { text: "01 / LIKE" }), el("strong", { text: "닮고" }), el("p", { text: "예배와 말씀 안에서 같은 방향을 바라봅니다." })]),
          el("div", { className: "brand-n-gather__circle brand-n-gather__circle--b" }, [el("small", { text: "02 / VALUE" }), el("strong", { text: "나누고" }), el("p", { text: "서로의 이야기와 중요하게 여기는 마음을 나눕니다." })]),
          el("div", { className: "brand-n-gather__circle brand-n-gather__circle--c" }, [el("small", { text: "03 / TOGETHER" }), el("strong", { text: "함께" }), el("p", { text: "소식과 모임, 활동으로 오늘을 같이 살아갑니다." })]),
          el("div", { className: "brand-n-gather__heart", "aria-hidden": "true" }, [el("span", { text: "같이" })]),
        ]),
      ]),
      el("section", { className: "brand-n-manifesto", dataset: { reveal: "" } }, [
        el("div", { className: "brand-n-manifesto__stamp" }, [el("span", { text: "CARE" }), el("i"), el("span", { text: "PEACE" })]),
        el("p", [el("span", { text: "약한 이의 곁에 서고," }), el("span", { text: "평화를 사랑하며," }), el("strong", { text: "함께 살아가는 공동체." })]),
        el("a", { href: "#/login", className: "brand-n-manifesto__enter" }, [el("span", { text: "청파 같이 들어가기" }), el("b", { text: "↗", "aria-hidden": "true" })]),
      ]),
      el("footer", { className: "brand-n-footer" }, [el("span", { text: "CHEONGPA GACHI" }), el("span", { text: "LIKE · VALUE · TOGETHER" }), el("span", { text: "© 2026" })]),
    ]);
    root.replaceChildren(main);
    bindGateway(main);
  }

  function renderDetail(type) {
    const content = details[type];
    const scene = scenes.find((item) => item.key === type);
    if (!content || !scene) return renderGateway();
    const main = el("main", { id: "brand-main-content", className: `brand-n-detail brand-n-detail--${type}`, tabindex: "-1", style: `--active-accent:${scene.accent};--active-soft:${scene.soft}` }, [
      header(),
      el("section", { className: "brand-n-detail__hero" }, [
        el("a", { className: "brand-n-detail__back", href: "#/gateway", text: "← 세 방향으로 돌아가기" }),
        el("div", { className: "brand-n-detail__orbital", "aria-hidden": "true" }, [el("div", { className: "brand-n-detail__ring brand-n-detail__ring--a" }), el("div", { className: "brand-n-detail__ring brand-n-detail__ring--b" }), el("span", { text: scene.number })]),
        el("div", { className: "brand-n-detail__copy" }, [el("span", { text: scene.cue }), el("h1", { text: content.english }), el("h2", { text: content.title }), el("p", { text: content.lead })]),
      ]),
      el("section", { className: "brand-n-detail__items", "aria-label": `${content.title} 콘텐츠 구성` }, content.items.map((item) => el("article", { className: "brand-n-detail__item" }, [el("span", { text: item[0] }), el("div", [el("h3", { text: item[1] }), el("p", { text: item[2] })]), el("em", { text: "COMING SOON" })]))),
      el("a", { className: "brand-n-detail__next", href: type === "like" ? "#/value" : "#/login" }, [el("small", { text: "NEXT CIRCLE" }), el("strong", { text: type === "like" ? "VALUE / 가치를 나누다 →" : "TOGETHER / 같이 하다 →" })]),
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
    const path = pathOf();
    if (!PUBLIC_ROUTES.has(path)) return enterCommunity();
    document.documentElement.dataset.brandPublic = "true";
    root.hidden = false;
    if (path === "/like") { document.title = "같이 닮다 | 청파 같이"; renderDetail("like"); }
    else if (path === "/value") { document.title = "가치를 나누다 | 청파 같이"; renderDetail("value"); }
    else { document.title = "청파 같이 | Like · Value · Together"; renderGateway(); }
  }

  window.addEventListener("hashchange", renderRoute);
  document.getElementById("skip-link")?.addEventListener("click", () => {
    if (document.documentElement.dataset.brandPublic === "true") document.getElementById("brand-main-content")?.focus();
  });
  renderRoute();
})();