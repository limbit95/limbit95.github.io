(() => {
  const PUBLIC_ROUTES = new Set(["/gateway", "/value", "/like", "/together"]);
  const root = document.getElementById("brand-gateway-root");
  if (!root) return;

  const directions = [
    {
      key: "value",
      number: "01",
      english: "VALUE",
      korean: "청파의 가치",
      title: "가치를 나누다",
      meta: "STORY · THOUGHT · PRACTICE",
      statement: "중요하게 여기는 것을 말하고, 삶의 실천으로 이어갑니다.",
      href: "#/value",
      accent: "#9d8376",
    },
    {
      key: "like",
      number: "02",
      english: "LIKE",
      korean: "청파의 같이",
      title: "같이 닮다",
      meta: "WORSHIP · WORD · FORMATION",
      statement: "같은 방향을 바라보고, 예수님의 마음을 삶으로 닮아갑니다.",
      href: "#/like",
      accent: "#7f9180",
    },
    {
      key: "together",
      number: "03",
      english: "TOGETHER",
      korean: "청파와 같이",
      title: "같이 하다",
      meta: "NEWS · GATHERING · ACTIVITY",
      statement: "서로의 오늘에 자리를 내어주며, 공동체의 삶을 함께 만듭니다.",
      href: "#/together",
      accent: "#7d8e97",
    },
  ];

  const details = {
    value: {
      number: "01",
      english: "VALUE",
      title: "가치를 나누다",
      eyebrow: "청파의 가치",
      lead: "목회자와 청년들의 이야기, 질문과 생각, 프로젝트를 통해 우리가 중요하게 여기는 가치를 세상과 나눕니다.",
      accent: "#9d8376",
      items: [
        ["01", "이야기", "목회자와 청년들의 삶과 신앙을 담는 인터뷰와 기록"],
        ["02", "칼럼", "공동체와 세상을 함께 바라보며 질문하고 생각을 나누는 글"],
        ["03", "프로젝트", "봉사와 캠페인처럼 가치가 실제 행동으로 이어지는 실천"],
      ],
      next: "#/like",
      nextLabel: "02 / LIKE",
      nextTitle: "같이 닮다",
    },
    like: {
      number: "02",
      english: "LIKE",
      title: "같이 닮다",
      eyebrow: "청파의 같이",
      lead: "예배와 말씀 안에서 예수님의 마음을 배우고, 청파가 걸어온 신앙의 방향을 오늘의 삶으로 이어갑니다.",
      accent: "#7f9180",
      items: [
        ["01", "청파의 정신", "약한 이의 곁에 서고 평화를 사랑하는 공동체의 방향"],
        ["02", "예배", "함께 드린 예배와 메시지를 다시 만나는 기록"],
        ["03", "말씀", "묵상과 질문을 일상의 선택과 실천으로 이어가는 콘텐츠"],
      ],
      next: "#/together",
      nextLabel: "03 / TOGETHER",
      nextTitle: "같이 하다",
    },
    together: {
      number: "03",
      english: "TOGETHER",
      title: "같이 하다",
      eyebrow: "청파와 같이",
      lead: "청파의 오늘을 서로 나누고, 실제 모임과 활동 안에서 함께 살아가는 공간입니다.",
      accent: "#7d8e97",
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

  const svgEl = (tag, attrs = {}) => {
    const node = document.createElementNS("http://www.w3.org/2000/svg", tag);
    Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, String(value)));
    return node;
  };

  function header(compact = false) {
    return el("header", { className: `brand-ae-header${compact ? " brand-ae-header--compact" : ""}` }, [
      el("a", { className: "brand-ae-logo", href: "#/gateway", "aria-label": "청파 같이 첫 화면" }, [
        el("img", { src: "./assets/images/logo.svg", alt: "", width: "28", height: "28" }),
        el("span", { text: "CHUNGPA GACHI" }),
      ]),
      el("span", { className: "brand-ae-edition", text: "AE / WOVEN PATH", "aria-hidden": "true" }),
      el("nav", { className: "brand-ae-nav", "aria-label": "청파 같이 세 방향" }, directions.map((item) =>
        el("a", { href: item.href }, [el("span", { text: item.number }), el("strong", { text: item.english })])
      )),
    ]);
  }

  function heroWeave() {
    const svg = svgEl("svg", {
      class: "brand-ae-weave",
      viewBox: "0 0 1000 520",
      preserveAspectRatio: "none",
      "aria-hidden": "true",
    });
    const paths = [
      ["value", "M -40 118 C 188 74 286 338 505 258 S 786 94 1040 172"],
      ["like", "M -40 258 C 204 342 294 70 505 188 S 782 392 1040 298"],
      ["together", "M -40 398 C 182 346 326 458 505 320 S 806 222 1040 376"],
    ];
    paths.forEach(([key, d]) => svg.append(svgEl("path", { class: `brand-ae-weave__path brand-ae-weave__path--${key}`, d })));
    [["value", 505, 258], ["like", 505, 188], ["together", 505, 320]].forEach(([key, cx, cy]) => {
      svg.append(svgEl("circle", { class: `brand-ae-weave__point brand-ae-weave__point--${key}`, cx, cy, r: 7 }));
    });
    return svg;
  }

  function pathStop(item, index) {
    return el("article", {
      className: `brand-ae-stop brand-ae-stop--${item.key} ${index % 2 ? "brand-ae-stop--right" : "brand-ae-stop--left"}`,
      dataset: { direction: item.key, active: "false", visible: "false" },
      style: `--ae-accent:${item.accent}`,
    }, [
      el("div", { className: "brand-ae-stop__node", "aria-hidden": "true" }, [el("span", { text: item.number })]),
      el("div", { className: "brand-ae-stop__copy" }, [
        el("span", { className: "brand-ae-stop__eyebrow", text: item.korean }),
        el("div", { className: "brand-ae-stop__title" }, [el("strong", { text: item.english }), el("h2", { text: item.title })]),
        el("p", { text: item.statement }),
        el("div", { className: "brand-ae-stop__meta" }, [el("span", { text: item.meta }), el("a", { href: item.href }, [el("span", { text: "FOLLOW THIS PATH" }), el("b", { text: "↗", "aria-hidden": "true" })])]),
      ]),
      el("div", { className: "brand-ae-stop__echo", "aria-hidden": "true" }, [el("span", { text: item.english.charAt(0) }), el("span", { text: item.english.charAt(item.english.length - 1) })]),
    ]);
  }

  function bindGateway(main) {
    const paths = main.querySelector(".brand-ae-paths");
    const stops = [...main.querySelectorAll("[data-direction]")];
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!paths || !stops.length) return;

    const activate = (key) => {
      const item = directions.find((entry) => entry.key === key) || directions[0];
      main.dataset.activeDirection = item.key;
      main.style.setProperty("--ae-active", item.accent);
      stops.forEach((stop) => { stop.dataset.active = String(stop.dataset.direction === item.key); });
    };

    if ("IntersectionObserver" in window) {
      const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.dataset.visible = "true";
        });
      }, { threshold: .12, rootMargin: "0px 0px -8% 0px" });
      stops.forEach((stop) => revealObserver.observe(stop));
    } else {
      stops.forEach((stop) => { stop.dataset.visible = "true"; });
    }

    let frame = 0;
    const updateScrollState = () => {
      frame = 0;
      const viewport = window.innerHeight || document.documentElement.clientHeight || 1;
      const activationLine = viewport * .52;
      let closestStop = stops[0];
      let closestDistance = Number.POSITIVE_INFINITY;

      stops.forEach((stop) => {
        const node = stop.querySelector(".brand-ae-stop__node") || stop;
        const rect = node.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const distance = Math.abs(center - activationLine);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestStop = stop;
        }
      });
      activate(closestStop.dataset.direction);

      const rect = paths.getBoundingClientRect();
      const start = viewport * .48;
      const distance = Math.max(paths.offsetHeight - viewport * .55, 1);
      const progress = Math.min(1, Math.max(0, (start - rect.top) / distance));
      main.style.setProperty("--ae-progress", progress.toFixed(4));
    };

    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(updateScrollState);
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    updateScrollState();

    if (!reduced) {
      stops.forEach((stop) => {
        stop.addEventListener("focusin", () => activate(stop.dataset.direction));
      });
    }
  }

  function renderGateway() {
    const main = el("main", {
      id: "brand-main-content",
      className: "brand-ae-shell",
      tabindex: "-1",
      dataset: { activeDirection: "value" },
      style: "--ae-progress:0;--ae-active:#9d8376",
    }, [
      header(),
      el("section", { className: "brand-ae-hero", "aria-labelledby": "brand-ae-title" }, [
        el("div", { className: "brand-ae-hero__meta" }, [el("span", { text: "CHUNGPA YOUTH COMMUNITY" }), el("span", { text: "SEOUL · 2026" }), el("span", { text: "VALUE → LIKE → TOGETHER" })]),
        heroWeave(),
        el("div", { className: "brand-ae-hero__word" }, [
          el("span", { text: "GACHI", "aria-hidden": "true" }),
          el("h1", { id: "brand-ae-title", text: "같이" }),
        ]),
        el("div", { className: "brand-ae-hero__copy" }, [
          el("p", { text: "같은 가치를 바라보고, 같이 닮아가며, 같이 살아가는 청파청년부." }),
          el("span", { text: "세 방향은 따로 놓이지 않습니다. 서로를 지나며 하나의 공동체가 됩니다." }),
        ]),
        el("a", { className: "brand-ae-hero__scroll", href: "#brand-ae-paths" }, [el("span", { text: "FOLLOW THE PATH" }), el("b", { text: "↓", "aria-hidden": "true" })]),
      ]),
      el("section", { id: "brand-ae-paths", className: "brand-ae-paths", "aria-labelledby": "brand-ae-path-title" }, [
        el("div", { className: "brand-ae-paths__intro" }, [
          el("span", { text: "THREE DIRECTIONS / ONE PATH" }),
          el("h2", { id: "brand-ae-path-title", text: "가치를 바라보고, 닮아가고, 함께합니다." }),
          el("p", { text: "각 방향은 다음 방향으로 이어지고, 마지막에는 다시 하나의 ‘같이’로 모입니다." }),
        ]),
        el("div", { className: "brand-ae-spine", "aria-hidden": "true" }, [el("span", { className: "brand-ae-spine__track" }), el("span", { className: "brand-ae-spine__progress" })]),
        el("div", { className: "brand-ae-stops" }, directions.map(pathStop)),
      ]),
      el("section", { className: "brand-ae-convergence" }, [
        el("div", { className: "brand-ae-convergence__threads", "aria-hidden": "true" }, [el("i"), el("i"), el("i")]),
        el("span", { className: "brand-ae-convergence__label", text: "ONE COMMUNITY / COMMON GROUND" }),
        el("h2", { text: "같이" }),
        el("p", { text: "약한 이의 곁에 서고, 평화를 사랑하며, 서로의 삶에 자리를 내어줍니다." }),
        el("a", { href: "#/together" }, [el("span", { text: "청파와 같이 들어가기" }), el("b", { text: "↗", "aria-hidden": "true" })]),
      ]),
      el("footer", { className: "brand-ae-footer" }, [
        el("span", { text: "CHUNGPA GACHI" }),
        el("span", { text: "VALUE · LIKE · TOGETHER" }),
        el("span", { text: "© 2026 CHUNGPA YOUTH COMMUNITY" }),
      ]),
    ]);
    root.replaceChildren(main);
    bindGateway(main);
  }

  function detailThreads(content) {
    return el("div", { className: "brand-ae-detail__threads", "aria-hidden": "true", style: `--detail-accent:${content.accent}` }, [el("i"), el("i"), el("i")]);
  }

  function renderDetail(type) {
    const content = details[type];
    if (!content) return renderGateway();
    const main = el("main", {
      id: "brand-main-content",
      className: `brand-ae-detail brand-ae-detail--${type}`,
      tabindex: "-1",
      style: `--detail-accent:${content.accent}`,
    }, [
      header(true),
      el("section", { className: "brand-ae-detail__hero" }, [
        detailThreads(content),
        el("div", { className: "brand-ae-detail__index" }, [el("span", { text: content.number }), el("a", { href: "#/gateway", text: "← ALL PATHS" })]),
        el("div", { className: "brand-ae-detail__title" }, [
          el("span", { text: content.eyebrow }),
          el("strong", { text: content.english }),
          el("h1", { text: content.title }),
        ]),
        el("p", { className: "brand-ae-detail__lead", text: content.lead }),
      ]),
      el("section", { className: "brand-ae-detail__flow", "aria-label": `${content.title} 콘텐츠 구성` }, content.items.map((item) =>
        el("article", { className: "brand-ae-detail__item" }, [
          el("span", { text: item[0] }),
          el("div", {}, [el("h2", { text: item[1] }), el("p", { text: item[2] })]),
          el("em", { text: "COMING SOON" }),
        ])
      )),
      content.community
        ? el("section", { className: "brand-ae-detail__community" }, [
            el("span", { text: "THE PATH CONTINUES IN COMMUNITY" }),
            el("h2", { text: "이제 실제 ‘같이’ 안으로 들어갑니다." }),
            el("p", { text: "모임과 활동, 공동체 기능은 기존 청파 같이 서비스에서 이어집니다." }),
            el("a", { href: "/" }, [el("span", { text: "청파 같이 시작하기" }), el("b", { text: "↗", "aria-hidden": "true" })]),
          ])
        : el("a", { className: "brand-ae-detail__next", href: content.next }, [
            el("span", { text: `NEXT PATH · ${content.nextLabel}` }),
            el("strong", { text: content.nextTitle }),
            el("b", { text: "→", "aria-hidden": "true" }),
          ]),
      el("footer", { className: "brand-ae-footer brand-ae-footer--detail" }, [el("span", { text: "CHUNGPA GACHI" }), el("span", { text: "VALUE → LIKE → TOGETHER" }), el("span", { text: "SEOUL · 2026" })]),
    ]);
    root.replaceChildren(main);
  }

  function setPublicMode(active) {
    const wasPublic = document.documentElement.dataset.brandPublic === "true";
    const theme = document.querySelector('meta[name="theme-color"]');
    if (active) {
      document.documentElement.dataset.brandPublic = "true";
      theme?.setAttribute("content", "#f0ede5");
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
    if (document.documentElement.dataset.brandPublic === "true") document.getElementById("brand-main-content")?.focus();
  });
  renderRoute();
})();