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
    { number: "01", type: "like", english: "LIKE", korean: "같이 닮다", line: "WORSHIP · WORD · DIRECTION", description: "예배와 말씀 안에서 같은 방향을 바라봅니다.", href: "#/like" },
    { number: "02", type: "value", english: "VALUE", korean: "가치를 나누다", line: "STORY · THOUGHT · PROJECT", description: "사람의 이야기와 생각을 세상과 나눕니다.", href: "#/value" },
    { number: "03", type: "together", english: "TOGETHER", korean: "같이 하다", line: "NEWS · GATHERING · ACTIVITY", description: "소식과 모임, 활동으로 오늘을 함께 만듭니다.", href: "#/login" },
  ];

  const storyContent = {
    like: {
      number: "01", english: "LIKE", title: "같이 닮다",
      lead: "예배와 말씀 안에서 우리가 누구를 닮아가고 어떤 방향으로 걸어갈지 쌓아가는 공간입니다.",
      items: [["01.1", "청파의 정신", "청파교회와 청년부가 이어가는 믿음의 방향과 정신"], ["01.2", "예배", "청파청년부 예배와 메시지를 다시 만나는 아카이브"], ["01.3", "말씀", "함께 묵상하고 삶으로 이어갈 말씀과 기록"]],
    },
    value: {
      number: "02", english: "VALUE", title: "가치를 나누다",
      lead: "우리가 중요하게 여기는 가치가 사람의 이야기와 생각, 실천으로 이어지는 공간입니다.",
      items: [["02.1", "이야기", "목회자와 청년들의 삶과 신앙 이야기"], ["02.2", "칼럼", "함께 생각하고 나누고 싶은 질문과 관점"], ["02.3", "프로젝트", "봉사와 캠페인, 실천으로 이어지는 프로젝트"]],
    },
  };

  function header(compact = false) {
    return create("header", { className: `brand-h-header${compact ? " brand-h-header--compact" : ""}` }, [
      create("a", { className: "brand-h-logo", href: "#/gateway", "aria-label": "청파 같이 첫 화면" }, [
        create("img", { src: "./assets/images/logo.svg", alt: "", width: "30", height: "30" }),
        create("span", { text: "CHEONGPA GACHI" }),
      ]),
      create("div", { className: "brand-h-header__center", "aria-hidden": "true" }, [create("span", { text: "LIKE" }), create("i", { text: "·" }), create("span", { text: "VALUE" }), create("i", { text: "·" }), create("span", { text: "TOGETHER" })]),
      create("a", { className: "brand-h-enter", href: "#/login" }, [create("span", { text: "COMMUNITY" }), create("span", { text: "↗", "aria-hidden": "true" })]),
    ]);
  }

  function sceneVisual(item) {
    return create("div", { className: `brand-h-scene__visual brand-h-scene__visual--${item.type}` }, [
      create("span", { className: "brand-h-scene__label", text: item.line }),
      create("div", { className: "brand-h-scene__orbit", "aria-hidden": "true" }, [
        create("span", { className: "brand-h-orbit brand-h-orbit--one" }), create("span", { className: "brand-h-orbit brand-h-orbit--two" }), create("span", { className: "brand-h-orbit brand-h-orbit--three" }), create("strong", { text: item.number }),
      ]),
      create("span", { className: "brand-h-scene__micro", text: "SCROLL / EXPLORE / ENTER" }),
    ]);
  }

  function scene(item) {
    return create("article", { className: `brand-h-scene brand-h-scene--${item.type}`, dataset: { scene: item.type }, "aria-label": `${item.english} — ${item.korean}` }, [
      create("div", { className: "brand-h-scene__copy" }, [
        create("span", { className: "brand-h-scene__number", text: item.number }),
        create("div", { className: "brand-h-scene__words" }, [create("strong", { text: item.english }), create("h2", { text: item.korean })]),
        create("p", { text: item.description }),
        create("a", { className: "brand-h-scene__link", href: item.href }, [create("span", { text: "ENTER" }), create("span", { text: "↗", "aria-hidden": "true" })]),
      ]),
      sceneVisual(item),
    ]);
  }

  function routeDock() {
    return create("nav", { className: "brand-h-dock", "aria-label": "청파 같이 세 가지 영역" }, directions.map((item) => create("a", {
      href: item.href, className: `brand-h-dock__item brand-h-dock__item--${item.type}`,
      "aria-label": `${item.english.charAt(0)}${item.english.slice(1).toLowerCase()} — ${item.korean}`,
    }, [create("span", { text: item.number }), create("strong", { text: item.english }), create("em", { text: item.korean })])));
  }

  function setSceneActive(shell, type) {
    shell.dataset.activeScene = type;
    shell.querySelectorAll("[data-progress]").forEach((button) => { button.dataset.active = String(button.dataset.progress === type); });
  }

  function bindGatewayMotion(shell) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const stage = shell.querySelector(".brand-h-theatre");
    const hero = shell.querySelector(".brand-h-hero");
    let ticking = false;
    const updateScroll = () => {
      ticking = false;
      if (!stage) return;
      const rect = stage.getBoundingClientRect();
      const total = Math.max(stage.offsetHeight - window.innerHeight, 1);
      const progress = Math.min(1, Math.max(0, -rect.top / total));
      stage.style.setProperty("--h-progress", progress.toFixed(4));
      const index = Math.min(directions.length - 1, Math.max(0, Math.floor(progress * directions.length)));
      setSceneActive(shell, directions[index].type);
    };
    window.addEventListener("scroll", () => { if (!ticking) { ticking = true; window.requestAnimationFrame(updateScroll); } }, { passive: true });
    updateScroll();

    hero?.addEventListener("pointermove", (event) => {
      const rect = hero.getBoundingClientRect();
      hero.style.setProperty("--h-x", (((event.clientX - rect.left) / Math.max(rect.width, 1) - .5) * 2).toFixed(3));
      hero.style.setProperty("--h-y", (((event.clientY - rect.top) / Math.max(rect.height, 1) - .5) * 2).toFixed(3));
    });
    hero?.addEventListener("pointerleave", () => { hero.style.setProperty("--h-x", "0"); hero.style.setProperty("--h-y", "0"); });

    shell.querySelectorAll("[data-progress]").forEach((button) => button.addEventListener("click", () => {
      const sceneIndex = directions.findIndex((item) => item.type === button.dataset.progress);
      if (sceneIndex < 0 || !stage) return;
      const scrollable = Math.max(stage.offsetHeight - window.innerHeight, 1);
      window.scrollTo({ top: stage.offsetTop + scrollable * ((sceneIndex + .12) / directions.length), behavior: "smooth" });
    }));

    shell.querySelectorAll(".brand-h-scene__visual").forEach((visual) => visual.addEventListener("pointermove", (event) => {
      const rect = visual.getBoundingClientRect();
      visual.style.setProperty("--local-x", `${event.clientX - rect.left}px`);
      visual.style.setProperty("--local-y", `${event.clientY - rect.top}px`);
    }));
  }

  function renderGateway() {
    const shell = create("main", { id: "brand-main-content", className: "brand-h-shell", tabindex: "-1", dataset: { activeScene: "like" } }, [
      header(),
      create("section", { className: "brand-h-hero", "aria-labelledby": "brand-h-title" }, [
        create("div", { className: "brand-h-hero__meta" }, [create("span", { text: "CHEONGPA YOUTH COMMUNITY" }), create("span", { text: "SEOUL · 2026" }), create("span", { text: "SCROLL TO MOVE" })]),
        create("h1", { id: "brand-h-title", className: "brand-h-title", "aria-label": "청파 같이" }, [
          create("span", { className: "brand-h-title__line brand-h-title__line--one" }, [create("i", { text: "같" }), create("i", { text: "이" })]),
          create("span", { className: "brand-h-title__line brand-h-title__line--two", text: "MOVES" }),
        ]),
        create("p", { className: "brand-h-hero__caption", text: "스크롤할수록 세 가지 ‘같이’가 움직이며 연결됩니다." }),
        create("div", { className: "brand-h-hero__shapes", "aria-hidden": "true" }, [create("span", { className: "brand-h-hero__shape brand-h-hero__shape--a" }), create("span", { className: "brand-h-hero__shape brand-h-hero__shape--b" }), create("span", { className: "brand-h-hero__shape brand-h-hero__shape--c" }), create("span", { className: "brand-h-hero__arrow", text: "↓" })]),
      ]),
      routeDock(),
      create("section", { className: "brand-h-theatre", "aria-label": "세 가지 같이 스크롤 탐색" }, [
        create("div", { className: "brand-h-theatre__sticky" }, [
          create("div", { className: "brand-h-theatre__intro" }, [create("span", { text: "THREE DIRECTIONS" }), create("strong", { text: "한 화면, 세 번의 전환." })]),
          create("div", { className: "brand-h-scenes" }, directions.map(scene)),
          create("div", { className: "brand-h-progress", "aria-label": "장면 이동" }, directions.map((item) => create("button", { type: "button", dataset: { progress: item.type, active: String(item.type === "like") }, "aria-label": `${item.number} ${item.english} 장면으로 이동` }, [create("span", { text: item.number }), create("i")]))),
        ]),
      ]),
      create("section", { className: "brand-h-outro" }, [
        create("p", { text: "LIKE · VALUE · TOGETHER" }), create("h2", { text: "어떤 ‘같이’에서 시작할까요?" }),
        create("div", { className: "brand-h-outro__links" }, directions.map((item) => create("a", { href: item.href }, [create("span", { text: item.number }), create("strong", { text: item.english }), create("em", { text: "↗", "aria-hidden": "true" })]))),
      ]),
      create("footer", { className: "brand-h-footer" }, [create("span", { text: "CHEONGPA GACHI" }), create("span", { text: "LIKE / VALUE / TOGETHER" }), create("span", { text: "© 2026" })]),
    ]);
    root.replaceChildren(shell);
    bindGatewayMotion(shell);
  }

  function renderStory(type) {
    const content = storyContent[type];
    const nextHref = type === "like" ? "#/value" : "#/login";
    const nextLabel = type === "like" ? "VALUE" : "TOGETHER";
    root.replaceChildren(create("main", { id: "brand-main-content", className: `brand-h-detail brand-h-detail--${type}`, tabindex: "-1" }, [
      header(true),
      create("section", { className: "brand-h-detail__hero", "aria-labelledby": "brand-h-detail-title" }, [
        create("div", { className: "brand-h-detail__rail" }, [create("span", { text: content.number }), create("span", { text: "CHEONGPA GACHI" })]),
        create("div", { className: "brand-h-detail__copy" }, [create("strong", { text: content.english }), create("h1", { id: "brand-h-detail-title", text: content.title }), create("p", { text: content.lead })]),
        create("div", { className: "brand-h-detail__visual", "aria-hidden": "true" }, [create("span", { className: "brand-h-detail__disc" }), create("span", { className: "brand-h-detail__line" }), create("span", { className: "brand-h-detail__index", text: content.number })]),
      ]),
      create("section", { className: "brand-h-detail__list", "aria-label": `${content.title} 콘텐츠 영역` }, content.items.map(([number, title, description]) => create("article", { className: "brand-h-detail__item" }, [create("span", { text: number }), create("h2", { text: title }), create("p", { text: description }), create("em", { text: "COMING SOON" })]))),
      create("footer", { className: "brand-h-detail__footer" }, [create("a", { href: "#/gateway", text: "← GATEWAY" }), create("a", { href: nextHref }, [create("span", { text: `NEXT · ${nextLabel}` }), create("span", { text: "↗", "aria-hidden": "true" })])]),
    ]));
  }

  function setPublicMode(active) {
    const wasPublic = document.documentElement.dataset.brandPublic === "true";
    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (active) {
      document.documentElement.dataset.brandPublic = "true";
      themeColor?.setAttribute("content", "#f7f4eb");
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
    if (path === "/like") { document.title = "Like · 같이 닮다 | 청파 같이"; renderStory("like"); }
    else if (path === "/value") { document.title = "Value · 가치를 나누다 | 청파 같이"; renderStory("value"); }
    else { document.title = "청파 같이 | Like · Value · Together"; renderGateway(); }
    window.requestAnimationFrame(() => document.getElementById("brand-main-content")?.focus({ preventScroll: true }));
  }

  window.addEventListener("hashchange", render);
  render();
})();