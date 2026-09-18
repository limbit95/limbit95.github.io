(() => {
  const PUBLIC_ROUTES = new Set(["/gateway", "/value", "/like", "/together"]);
  const root = document.getElementById("brand-gateway-root");
  if (!root) return;

  const directions = [
    {
      key: "value", number: "01", english: "VALUE", korean: "청파의 가치",
      title: "가치를 나누다", meta: "STORY · THOUGHT · PRACTICE",
      statement: "중요하게 여기는 것을 발견하고, 이야기와 실천으로 세상과 나눕니다.",
      href: "#/value", accent: "#9b8176",
    },
    {
      key: "like", number: "02", english: "LIKE", korean: "청파의 같이",
      title: "같이 닮다", meta: "WORSHIP · WORD · FORMATION",
      statement: "같은 방향을 바라보고, 예배와 말씀 안에서 삶의 모양으로 닮아갑니다.",
      href: "#/like", accent: "#7d8f80",
    },
    {
      key: "together", number: "03", english: "TOGETHER", korean: "청파와 같이",
      title: "같이 하다", meta: "NEWS · GATHERING · ACTIVITY",
      statement: "서로의 오늘에 자리를 내어주며, 공동체의 삶을 함께 만듭니다.",
      href: "#/together", accent: "#7c8d96",
    },
  ];

  const details = {
    value: {
      number: "01", english: "VALUE", title: "가치를 나누다", eyebrow: "청파의 가치", accent: "#9b8176",
      lead: "목회자와 청년들의 이야기, 질문과 생각, 프로젝트를 통해 우리가 중요하게 여기는 가치를 세상과 나눕니다.",
      items: [
        ["01", "이야기", "목회자와 청년들의 삶과 신앙을 담는 인터뷰와 기록"],
        ["02", "칼럼", "공동체와 세상을 함께 바라보며 질문하고 생각을 나누는 글"],
        ["03", "프로젝트", "봉사와 캠페인처럼 가치가 실제 행동으로 이어지는 실천"],
      ],
      next: "#/like", nextLabel: "02 / LIKE", nextTitle: "같이 닮다",
    },
    like: {
      number: "02", english: "LIKE", title: "같이 닮다", eyebrow: "청파의 같이", accent: "#7d8f80",
      lead: "예배와 말씀 안에서 예수님의 마음을 배우고, 청파가 걸어온 신앙의 방향을 오늘의 삶으로 이어갑니다.",
      items: [
        ["01", "청파의 정신", "약한 이의 곁에 서고 평화를 사랑하는 공동체의 방향"],
        ["02", "예배", "함께 드린 예배와 메시지를 다시 만나는 기록"],
        ["03", "말씀", "묵상과 질문을 일상의 선택과 실천으로 이어가는 콘텐츠"],
      ],
      next: "#/together", nextLabel: "03 / TOGETHER", nextTitle: "같이 하다",
    },
    together: {
      number: "03", english: "TOGETHER", title: "같이 하다", eyebrow: "청파와 같이", accent: "#7c8d96",
      lead: "청파의 오늘을 서로 나누고, 실제 모임과 활동 안에서 함께 살아가는 공간입니다.",
      items: [
        ["01", "청년부 소식", "예배와 공동체의 새로운 소식, 공지와 일정을 한곳에서 확인"],
        ["02", "모임", "누구나 함께 제안하고 참여할 수 있는 작은 모임과 만남"],
        ["03", "활동", "문화생활과 야외 활동을 포함한 기존 청파 같이 공동체 기능"],
      ],
      community: true,
    },
  };

  const routePath = (hash = window.location.hash) => {
    const raw = String(hash || "#/gateway").replace(/^#/, "") || "/gateway";
    return (`/${raw.split("?")[0]}`).replace(/\/+/g, "/").replace(/\/$/, "") || "/";
  };

  const el = (tag, attrs = {}, children = []) => {
    const node = document.createElement(tag);
    Object.entries(attrs).forEach(([key, value]) => {
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
    return el("header", { className: `brand-ag-header${compact ? " brand-ag-header--compact" : ""}` }, [
      el("a", { className: "brand-ag-logo", href: "#/gateway", "aria-label": "청파 같이 첫 화면" }, [
        el("span", { className: "brand-ag-logo__mark", "aria-hidden": "true" }, [el("i"), el("i"), el("i")]),
        el("span", { text: "CHUNGPA GACHI" }),
      ]),
      el("span", { className: "brand-ag-edition", text: "AG / LAYERED HORIZON", "aria-hidden": "true" }),
      el("nav", { className: "brand-ag-nav", "aria-label": "청파 같이 세 방향" }, directions.map((item) =>
        el("a", { href: item.href, dataset: { direction: item.key } }, [
          el("span", { text: item.number }), el("strong", { text: item.english }),
        ])
      )),
    ]);
  }

  function heroLines() {
    return el("div", { className: "brand-ag-hero__lines", "aria-hidden": "true" }, directions.map((item, index) =>
      el("div", {
        className: `brand-ag-hero__line brand-ag-hero__line--${item.key}`,
        style: `--ag-line:${item.accent};--ag-line-index:${index}`,
      }, [el("span", { text: item.english }), el("i")])
    ));
  }

  function horizonLayer(item, index) {
    return el("article", {
      className: `brand-ag-layer brand-ag-layer--${item.key}`,
      dataset: { direction: item.key, active: "false", visible: "false" },
      style: `--ag-accent:${item.accent};--ag-index:${index}`,
    }, [
      el("div", { className: "brand-ag-layer__top" }, [
        el("span", { className: "brand-ag-layer__number", text: item.number }),
        el("span", { className: "brand-ag-layer__korean", text: item.korean }),
        el("span", { className: "brand-ag-layer__meta", text: item.meta }),
      ]),
      el("div", { className: "brand-ag-layer__horizon", "aria-hidden": "true" }, [
        el("i"), el("strong", { text: item.english }), el("i"),
      ]),
      el("div", { className: "brand-ag-layer__body" }, [
        el("div", { className: "brand-ag-layer__title" }, [
          el("span", { text: item.english }),
          el("h2", { text: item.title }),
        ]),
        el("div", { className: "brand-ag-layer__copy" }, [
          el("p", { text: item.statement }),
          el("a", { href: item.href }, [
            el("span", { text: "OPEN THIS LAYER" }),
            el("b", { text: "↗", "aria-hidden": "true" }),
          ]),
        ]),
      ]),
      el("span", { className: "brand-ag-layer__edge", text: `0${index + 1} / 03`, "aria-hidden": "true" }),
    ]);
  }

  function activate(main, layers, key) {
    const item = directions.find((entry) => entry.key === key) || directions[0];
    main.dataset.activeDirection = item.key;
    main.style.setProperty("--ag-active", item.accent);
    layers.forEach((layer) => { layer.dataset.active = String(layer.dataset.direction === item.key); });
    main.querySelectorAll(".brand-ag-nav [data-direction]").forEach((link) => {
      link.dataset.active = String(link.dataset.direction === item.key);
    });
  }

  function bindGateway(main) {
    const layers = [...main.querySelectorAll(".brand-ag-layer[data-direction]")];
    if (!layers.length) return;

    if ("IntersectionObserver" in window) {
      const reveal = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.dataset.visible = "true";
        });
      }, { threshold: .1, rootMargin: "0px 0px -8% 0px" });
      layers.forEach((layer) => reveal.observe(layer));
    } else {
      layers.forEach((layer) => { layer.dataset.visible = "true"; });
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const viewport = window.innerHeight || document.documentElement.clientHeight || 1;
      const activationLine = viewport * .5;
      let closest = layers[0];
      let distance = Number.POSITIVE_INFINITY;

      layers.forEach((layer) => {
        const horizon = layer.querySelector(".brand-ag-layer__horizon") || layer;
        const rect = horizon.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const current = Math.abs(center - activationLine);
        if (current < distance) {
          distance = current;
          closest = layer;
        }

        const layerRect = layer.getBoundingClientRect();
        const local = (activationLine - (layerRect.top + layerRect.height / 2)) / Math.max(layerRect.height, 1);
        layer.style.setProperty("--ag-local", Math.max(-1, Math.min(1, local)).toFixed(4));
      });

      activate(main, layers, closest.dataset.direction);
    };

    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    update();

    layers.forEach((layer) => layer.addEventListener("focusin", () => activate(main, layers, layer.dataset.direction)));
  }

  function renderGateway() {
    const main = el("main", {
      id: "brand-main-content",
      className: "brand-ag-shell",
      tabindex: "-1",
      dataset: { activeDirection: "value" },
      style: "--ag-active:#9b8176",
    }, [
      header(),
      el("section", { className: "brand-ag-hero", "aria-labelledby": "brand-ag-title" }, [
        el("div", { className: "brand-ag-hero__meta" }, [
          el("span", { text: "CHUNGPA YOUTH COMMUNITY" }),
          el("span", { text: "VALUE / LIKE / TOGETHER" }),
          el("span", { text: "SEOUL · 2026" }),
        ]),
        heroLines(),
        el("div", { className: "brand-ag-hero__title" }, [
          el("span", { text: "GACHI", "aria-hidden": "true" }),
          el("h1", { id: "brand-ag-title", text: "같이" }),
        ]),
        el("div", { className: "brand-ag-hero__statement" }, [
          el("span", { text: "THREE HORIZONS / ONE LIFE" }),
          el("p", { text: "같은 가치를 바라보고, 같이 닮아가며, 같이 살아가는 청파청년부." }),
          el("small", { text: "세 방향은 층처럼 쌓이고, 우리의 일상에서 하나의 풍경이 됩니다." }),
        ]),
        el("a", { className: "brand-ag-hero__scroll", href: "#brand-ag-layers" }, [
          el("span", { text: "OPEN THE HORIZONS" }), el("b", { text: "↓", "aria-hidden": "true" }),
        ]),
      ]),
      el("section", { id: "brand-ag-layers", className: "brand-ag-layers", "aria-label": "청파 같이 세 방향" },
        directions.map(horizonLayer)
      ),
      el("section", { className: "brand-ag-convergence" }, [
        el("div", { className: "brand-ag-convergence__lines", "aria-hidden": "true" }, [el("i"), el("i"), el("i")]),
        el("span", { className: "brand-ag-convergence__eyebrow", text: "ONE HORIZON / COMMON GROUND" }),
        el("h2", { text: "같이" }),
        el("p", { text: "가치를 발견하고, 그 가치를 닮아가며, 서로의 삶에 자리를 내어줍니다." }),
        el("a", { href: "#/together" }, [
          el("span", { text: "청파와 같이 시작하기" }), el("b", { text: "↗", "aria-hidden": "true" }),
        ]),
      ]),
      el("footer", { className: "brand-ag-footer" }, [
        el("span", { text: "CHUNGPA GACHI" }),
        el("span", { text: "VALUE · LIKE · TOGETHER" }),
        el("span", { text: "© 2026 CHUNGPA YOUTH COMMUNITY" }),
      ]),
    ]);

    root.replaceChildren(main);
    bindGateway(main);
  }

  function renderDetail(type) {
    const content = details[type];
    if (!content) return renderGateway();

    const main = el("main", {
      id: "brand-main-content",
      className: `brand-ag-detail brand-ag-detail--${type}`,
      tabindex: "-1",
      style: `--detail-accent:${content.accent}`,
    }, [
      header(true),
      el("section", { className: "brand-ag-detail__hero" }, [
        el("div", { className: "brand-ag-detail__horizon", "aria-hidden": "true" }, [
          el("i"), el("strong", { text: content.english }), el("i"),
        ]),
        el("div", { className: "brand-ag-detail__index" }, [
          el("span", { text: content.number }),
          el("span", { text: content.eyebrow }),
          el("a", { href: "#/gateway", text: "← ALL HORIZONS" }),
        ]),
        el("div", { className: "brand-ag-detail__title" }, [
          el("strong", { text: content.english }),
          el("h1", { text: content.title }),
        ]),
        el("p", { className: "brand-ag-detail__lead", text: content.lead }),
      ]),
      el("section", { className: "brand-ag-detail__items", "aria-label": `${content.title} 콘텐츠 구성` },
        content.items.map((item) => el("article", { className: "brand-ag-detail__item" }, [
          el("span", { text: item[0] }),
          el("div", {}, [el("h2", { text: item[1] }), el("p", { text: item[2] })]),
          el("em", { text: "COMING SOON" }),
        ]))
      ),
      content.community
        ? el("section", { className: "brand-ag-detail__community" }, [
            el("span", { text: "THE HORIZON CONTINUES IN COMMUNITY" }),
            el("h2", { text: "이제 실제 ‘같이’ 안으로 들어갑니다." }),
            el("p", { text: "모임과 활동, 공동체 기능은 기존 청파 같이 서비스에서 이어집니다." }),
            el("a", { href: "#/login" }, [
              el("span", { text: "청파 같이 시작하기" }), el("b", { text: "↗", "aria-hidden": "true" }),
            ]),
          ])
        : el("a", { className: "brand-ag-detail__next", href: content.next }, [
            el("span", { text: `NEXT HORIZON · ${content.nextLabel}` }),
            el("strong", { text: content.nextTitle }),
            el("b", { text: "→", "aria-hidden": "true" }),
          ]),
      el("footer", { className: "brand-ag-footer brand-ag-footer--detail" }, [
        el("span", { text: "CHUNGPA GACHI" }),
        el("span", { text: "VALUE → LIKE → TOGETHER" }),
        el("span", { text: "SEOUL · 2026" }),
      ]),
    ]);
    root.replaceChildren(main);
  }

  function setPublicMode(active) {
    const wasPublic = document.documentElement.dataset.brandPublic === "true";
    const theme = document.querySelector('meta[name="theme-color"]');
    if (active) {
      document.documentElement.dataset.brandPublic = "true";
      theme?.setAttribute("content", "#efece4");
      root.hidden = false;
      return;
    }
    delete document.documentElement.dataset.brandPublic;
    theme?.setAttribute("content", "#9fcfdf");
    root.hidden = true;
    root.replaceChildren();
    if (wasPublic) window.dispatchEvent(new CustomEvent("brand:enter-app"));
  }

  function renderRoute() {
    const path = routePath();
    const isPublic = PUBLIC_ROUTES.has(path);
    setPublicMode(isPublic);
    if (!isPublic) return;

    if (path === "/value") {
      document.title = "가치를 나누다 | 청파 같이";
      renderDetail("value");
    } else if (path === "/like") {
      document.title = "같이 닮다 | 청파 같이";
      renderDetail("like");
    } else if (path === "/together") {
      document.title = "같이 하다 | 청파 같이";
      renderDetail("together");
    } else {
      document.title = "청파 같이 | Value · Like · Together";
      renderGateway();
    }
  }

  root.addEventListener("click", (event) => {
    const anchor = event.target.closest("a[href^='#/']");
    if (!anchor) return;
    const href = anchor.getAttribute("href");
    const nextPath = routePath(href);
    if (!PUBLIC_ROUTES.has(nextPath)) return;
    event.preventDefault();

    const navigate = () => {
      window.history.pushState(null, "", href);
      renderRoute();
      window.scrollTo({ top: 0, behavior: "instant" });
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduced && typeof document.startViewTransition === "function") document.startViewTransition(navigate);
    else navigate();
  });

  window.addEventListener("hashchange", renderRoute);
  window.addEventListener("popstate", renderRoute);
  document.getElementById("skip-link")?.addEventListener("click", () => {
    if (document.documentElement.dataset.brandPublic === "true") {
      document.getElementById("brand-main-content")?.focus();
    }
  });

  renderRoute();
})();