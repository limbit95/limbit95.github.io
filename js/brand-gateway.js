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

  const symbol = (type) => create("span", {
    className: `brand-symbol brand-symbol--${type}`,
    "aria-hidden": "true",
  }, [create("i"), create("i"), create("i")]);

  const gatewayHeader = (compact = false) => create("header", {
    className: `brand-gateway__header${compact ? " brand-gateway__header--compact" : ""}`,
  }, [
    create("a", { className: "brand-gateway__brand", href: "#/gateway", "aria-label": "청파 같이 첫 화면" }, [
      create("img", { src: "./assets/images/logo.svg", alt: "", width: "38", height: "38" }),
      create("span", { text: "청파 같이" }),
    ]),
    create("div", { className: "brand-gateway__meta" }, [
      create("span", { text: "LIKE" }),
      create("span", { text: "VALUE" }),
      create("span", { text: "TOGETHER" }),
    ]),
  ]);

  const portal = ({ index, type, title, korean, description, eyebrow, href, cta }) => create("a", {
    className: `brand-portal brand-portal--${type}`,
    href,
    dataset: { brandPortal: type },
    "aria-label": `${title} — ${korean}`,
  }, [
    create("div", { className: "brand-portal__topline" }, [
      create("span", { className: "brand-portal__index", text: index }),
      create("span", { className: "brand-portal__eyebrow", text: eyebrow }),
    ]),
    create("div", { className: "brand-portal__symbol" }, symbol(type)),
    create("div", { className: "brand-portal__body" }, [
      create("p", { className: "brand-portal__english", text: title }),
      create("h2", { className: "brand-portal__title", text: korean }),
      create("p", { className: "brand-portal__description", text: description }),
      create("span", { className: "brand-portal__cta" }, [
        create("span", { text: cta }),
        create("span", { className: "brand-portal__arrow", text: "↗", "aria-hidden": "true" }),
      ]),
    ]),
  ]);

  function renderGateway() {
    const shell = create("main", {
      id: "brand-main-content",
      className: "brand-gateway-shell",
      tabindex: "-1",
    }, [
      gatewayHeader(),
      create("section", { className: "brand-gateway__intro", "aria-labelledby": "brand-gateway-title" }, [
        create("div", { className: "brand-gateway__intro-label" }, [
          create("span", { text: "CHEONGPA YOUTH COMMUNITY" }),
          create("span", { text: "LIKE · VALUE · TOGETHER" }),
        ]),
        create("div", { className: "brand-gateway__intro-copy" }, [
          create("h1", { id: "brand-gateway-title", className: "brand-gateway__title" }, [
            create("span", { text: "같이 닮고," }),
            create("span", { text: "가치를 나누며," }),
            create("span", { text: "함께 살아갑니다." }),
          ]),
          create("p", {
            className: "brand-gateway__lead",
            text: "‘같이’라는 한 단어 안에 담긴 세 가지 의미를 따라 청파청년부의 예배와 이야기, 공동체를 만나보세요.",
          }),
        ]),
      ]),
      create("section", { className: "brand-portals", "aria-label": "청파 같이 세 가지 영역" }, [
        portal({
          index: "01",
          type: "like",
          title: "Like",
          korean: "같이 닮다",
          eyebrow: "WORSHIP · SPIRIT",
          description: "예배와 말씀 안에서 신앙의 방향을 함께 배우고 닮아가며, 청파교회의 정신을 이어갑니다.",
          href: "#/like",
          cta: "Like 알아보기",
        }),
        portal({
          index: "02",
          type: "value",
          title: "Value",
          korean: "가치를 나누다",
          eyebrow: "STORY · PROJECT",
          description: "목회자와 청년의 이야기, 칼럼과 프로젝트를 통해 우리가 믿고 살아가는 가치를 나눕니다.",
          href: "#/value",
          cta: "Value 알아보기",
        }),
        portal({
          index: "03",
          type: "together",
          title: "Together",
          korean: "같이 하다",
          eyebrow: "COMMUNITY · ACTIVITY",
          description: "소식과 광고, 모임과 활동을 한곳에서 나누며 오늘의 청파청년부를 함께 만들어갑니다.",
          href: "#/login",
          cta: "Together 들어가기",
        }),
      ]),
      create("footer", { className: "brand-gateway__footer" }, [
        create("span", { text: "CHEONGPA GACHI" }),
        create("span", { text: "세 가지 의미 중 하나를 선택해 보세요" }),
      ]),
    ]);

    root.replaceChildren(shell);
  }

  const storyContent = {
    like: {
      index: "01",
      english: "Like",
      title: "같이 닮다",
      kicker: "WORSHIP · SPIRIT",
      description: "우리가 누구를 닮아가고 어떤 정신을 이어갈지 담는 공간입니다. 예배와 말씀, 청파교회의 정신을 가까이에서 만나며 같은 방향을 바라봅니다.",
      items: [
        ["01", "청파의 정신", "청파교회와 청년부가 이어가는 믿음의 방향과 정신"],
        ["02", "예배", "청파청년부 예배와 메시지를 다시 만나는 아카이브"],
        ["03", "말씀", "함께 묵상하고 삶으로 이어갈 말씀과 기록"],
      ],
    },
    value: {
      index: "02",
      english: "Value",
      title: "가치를 나누다",
      kicker: "STORY · PROJECT",
      description: "우리가 중요하게 여기는 가치가 이야기와 실천으로 이어지는 공간입니다. 목회자와 청년의 목소리, 칼럼과 프로젝트를 통해 공동체의 생각을 쌓아갑니다.",
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
      className: `brand-story brand-story--${type}`,
      tabindex: "-1",
    }, [
      gatewayHeader(true),
      create("section", { className: "brand-story__hero", "aria-labelledby": "brand-story-title" }, [
        create("div", { className: "brand-story__marker" }, [
          create("span", { text: content.index }),
          create("span", { text: content.kicker }),
        ]),
        create("div", { className: "brand-story__headline" }, [
          create("p", { className: "brand-story__english", text: content.english }),
          create("h1", { id: "brand-story-title", text: content.title }),
          create("p", { className: "brand-story__description", text: content.description }),
        ]),
        create("div", { className: "brand-story__visual", "aria-hidden": "true" }, symbol(type)),
      ]),
      create("section", { className: "brand-story__grid", "aria-label": `${content.title} 콘텐츠 영역` },
        content.items.map(([number, title, description]) => create("article", { className: "brand-story-card" }, [
          create("span", { className: "brand-story-card__number", text: number }),
          create("div", {}, [
            create("h2", { text: title }),
            create("p", { text: description }),
          ]),
          create("span", { className: "brand-story-card__status", text: "준비 중" }),
        ]))),
      create("footer", { className: "brand-story__actions" }, [
        create("a", { className: "brand-story__back", href: "#/gateway", text: "← 세 가지 의미로 돌아가기" }),
        create("a", { className: "brand-story__together", href: "#/login" }, [
          create("span", { text: "지금 Together 만나기" }),
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
      themeColor?.setAttribute("content", "#f3f1ea");
      root.hidden = false;
      return;
    }

    delete document.documentElement.dataset.brandPublic;
    themeColor?.setAttribute("content", "#9fcfdf");
    root.hidden = true;
    root.replaceChildren();
    if (wasPublic) {
      window.dispatchEvent(new Event("brand:enter-app"));
    }
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

  root.addEventListener("pointermove", (event) => {
    const shell = root.querySelector(".brand-gateway-shell, .brand-story");
    if (!shell) return;
    const rect = shell.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    shell.style.setProperty("--brand-pointer-x", `${Math.max(0, Math.min(100, x))}%`);
    shell.style.setProperty("--brand-pointer-y", `${Math.max(0, Math.min(100, y))}%`);
  });

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
