(() => {
  const PUBLIC_ROUTES = new Set(["/gateway", "/value", "/like"]);
  const root = document.getElementById("brand-gateway-root");
  if (!root) return;

  const chapters = [
    {
      key: "value",
      number: "01",
      english: "VALUE",
      korean: "가치를 나누다",
      eyebrow: "STORY · THOUGHT · PRACTICE",
      lead: "중요하게 여기는 것을 말하고, 세상과 나눕니다.",
      href: "#/value",
    },
    {
      key: "like",
      number: "02",
      english: "LIKE",
      korean: "같이 닮다",
      eyebrow: "WORSHIP · WORD · FORMATION",
      lead: "같은 방향을 바라보고, 삶으로 닮아갑니다.",
      href: "#/like",
    },
    {
      key: "together",
      number: "03",
      english: "TOGETHER",
      korean: "같이 하다",
      eyebrow: "NEWS · GATHER · ACTIVITY",
      lead: "함께 모이고 움직이며, 공동체의 오늘을 만듭니다.",
      href: "#/login",
    },
  ];

  const details = {
    value: {
      label: "01 / VALUE",
      title: "가치를 나누다",
      english: "VALUE",
      lead: "사람의 경험과 생각을 기록하고, 돌봄과 평화를 구체적인 프로젝트와 실천으로 확장합니다.",
      items: [
        ["01", "이야기", "목회자와 청년들의 삶과 신앙을 담는 인터뷰"],
        ["02", "칼럼", "공동체와 세상을 함께 바라보는 질문과 관점"],
        ["03", "프로젝트", "봉사와 캠페인, 연대로 이어지는 실제 행동"],
      ],
      next: "#/like",
      nextLabel: "02 / LIKE",
    },
    like: {
      label: "02 / LIKE",
      title: "같이 닮다",
      english: "LIKE",
      lead: "예배와 말씀 안에서 예수님의 마음을 배우고, 청파가 걸어온 신앙의 방향을 오늘의 삶으로 이어갑니다.",
      items: [
        ["01", "청파의 정신", "약자의 곁에 서고 평화를 사랑하는 공동체의 방향"],
        ["02", "예배", "함께 드린 예배와 메시지를 다시 만나는 기록"],
        ["03", "말씀", "묵상과 기록을 일상의 선택으로 이어가는 콘텐츠"],
      ],
      next: "#/login",
      nextLabel: "03 / TOGETHER",
    },
  };

  const routePath = (hash = window.location.hash) => {
    const raw = hash.replace(/^#/, "") || "/gateway";
    return (`/${raw.split("?")[0]}`).replace(/\/+/g, "/").replace(/\/$/, "") || "/";
  };

  const el = (tag, attrs = {}, children = []) => {
    const node = document.createElement(tag);
    Object.entries(attrs).forEach(([key, value]) => {
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

  function header(compact = false) {
    return el("header", { className: `brand-p-header${compact ? " brand-p-header--compact" : ""}` }, [
      el("a", { className: "brand-p-logo", href: "#/gateway", "aria-label": "청파 같이 첫 화면" }, [
        el("img", { src: "./assets/images/logo.svg", alt: "", width: "28", height: "28" }),
        el("span", { text: "CHEONGPA GACHI" }),
      ]),
      el("div", { className: "brand-p-header__meta", "aria-hidden": "true" }, [
        el("span", { text: "CHEONGPA YOUTH COMMUNITY" }),
        el("span", { text: "SEOUL · 2026" }),
      ]),
      el("a", { className: "brand-p-enter", href: "#/login" }, [
        el("span", { text: "TOGETHER" }),
        el("b", { text: "↗", "aria-hidden": "true" }),
      ]),
    ]);
  }

  function chapter(scene) {
    return el("article", {
      className: `brand-p-chapter brand-p-chapter--${scene.key}`,
      id: `brand-p-${scene.key}`,
      dataset: { chapter: scene.key, active: "false", visible: "false" },
    }, [
      el("div", { className: "brand-p-chapter__rule", "aria-hidden": "true" }),
      el("div", { className: "brand-p-chapter__number", text: scene.number }),
      el("div", { className: "brand-p-chapter__title" }, [
        el("span", { text: scene.eyebrow }),
        el("h2", { text: scene.english }),
        el("h3", { text: scene.korean }),
      ]),
      el("div", { className: "brand-p-chapter__body" }, [
        el("p", { text: scene.lead }),
        el("a", { href: scene.href, "aria-label": `${scene.korean} 열기` }, [
          el("span", { text: scene.key === "together" ? "ENTER" : "EXPLORE" }),
          el("b", { text: "→", "aria-hidden": "true" }),
        ]),
      ]),
      el("div", { className: "brand-p-chapter__ghost", text: scene.english, "aria-hidden": "true" }),
    ]);
  }

  function bindGateway(main) {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hero = main.querySelector(".brand-p-hero");
    if (hero && !reduced) {
      hero.addEventListener("pointermove", (event) => {
        const rect = hero.getBoundingClientRect();
        const x = (event.clientX - rect.left) / Math.max(rect.width, 1) - .5;
        const y = (event.clientY - rect.top) / Math.max(rect.height, 1) - .5;
        hero.style.setProperty("--mx", x.toFixed(3));
        hero.style.setProperty("--my", y.toFixed(3));
      });
      hero.addEventListener("pointerleave", () => {
        hero.style.setProperty("--mx", "0");
        hero.style.setProperty("--my", "0");
      });
    }

    const chapterNodes = [...main.querySelectorAll("[data-chapter]")];
    chapterNodes.forEach((node) => {
      if (reduced) return;
      node.addEventListener("pointermove", (event) => {
        const rect = node.getBoundingClientRect();
        const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / Math.max(rect.width, 1)));
        node.style.setProperty("--beam", `${(x * 100).toFixed(1)}%`);
      });
      node.addEventListener("pointerleave", () => node.style.removeProperty("--beam"));
    });

    let activeFrame = 0;
    const updateActiveChapter = () => {
      activeFrame = 0;
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 1;
      let best = null;
      chapterNodes.forEach((node) => {
        const rect = node.getBoundingClientRect();
        const visibleHeight = Math.max(0, Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0));
        const visibleRatio = visibleHeight / Math.max(1, Math.min(rect.height, viewportHeight));
        const centerDistance = Math.abs((rect.top + rect.bottom) / 2 - viewportHeight / 2);
        if (visibleRatio < .4) return;
        if (!best || visibleRatio > best.visibleRatio + .02 || (Math.abs(visibleRatio - best.visibleRatio) <= .02 && centerDistance < best.centerDistance)) {
          best = { node, visibleRatio, centerDistance };
        }
      });
      chapterNodes.forEach((node) => { node.dataset.active = String(node === best?.node); });
    };
    const scheduleActiveChapter = () => {
      if (activeFrame) return;
      activeFrame = window.requestAnimationFrame(updateActiveChapter);
    };
    window.addEventListener("scroll", scheduleActiveChapter, { passive: true });
    window.addEventListener("resize", scheduleActiveChapter);
    scheduleActiveChapter();

    const observed = [...main.querySelectorAll("[data-reveal], [data-chapter]")];
    if (!("IntersectionObserver" in window) || reduced) {
      observed.forEach((node) => { node.dataset.visible = "true"; });
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.dataset.visible = "true";
      });
    }, { threshold: .18 });
    observed.forEach((node) => observer.observe(node));
  }

  function renderGateway() {
    const main = el("main", { id: "brand-main-content", className: "brand-p-shell", tabindex: "-1" }, [
      header(),
      el("section", { className: "brand-p-hero", "aria-labelledby": "brand-p-title" }, [
        el("div", { className: "brand-p-hero__rail", "aria-hidden": "true" }, [
          el("span", { text: "AD / P LAYOUT × O COPY" }),
          el("span", { text: "37.55°N" }),
        ]),
        el("div", { className: "brand-p-hero__intro" }, [
          el("span", { text: "A COMMUNITY IN THREE DIRECTIONS" }),
          el("p", { text: "닮고, 나누고, 함께 살아가는 청파청년부." }),
        ]),
        el("div", { className: "brand-p-hero__title" }, [
          el("h1", { id: "brand-p-title", text: "같이" }),
          el("div", { text: "GACHI", "aria-hidden": "true" }),
        ]),
        el("div", { className: "brand-p-hero__manifesto" }, [
          el("span", { text: "OUR COMMON DIRECTION" }),
          el("p", { text: "약한 이의 곁에 서고 평화를 사랑하는 마음을, 오늘의 삶과 공동체 안에서 이어갑니다." }),
        ]),
        el("div", { className: "brand-p-hero__axis", "aria-hidden": "true" }),
      ]),
      el("section", { className: "brand-p-passages", "aria-label": "청파 같이 세 방향" }, chapters.map(chapter)),
      el("section", { className: "brand-p-statement", dataset: { reveal: "", visible: "false" } }, [
        el("div", { className: "brand-p-statement__index", text: "04 / OUR COMMON DIRECTION" }),
        el("div", { className: "brand-p-statement__copy" }, [
          el("p", { text: "약한 이의 곁에 서고," }),
          el("p", { text: "평화를 사랑하며," }),
          el("p", { text: "함께 살아갑니다." }),
        ]),
        el("div", { className: "brand-p-statement__note" }, [
          el("span", { text: "CARE / PEACE / COMMUNITY" }),
          el("p", { text: "믿는 것을 말하고, 말한 것을 함께 살아내는 공동체." }),
        ]),
      ]),
      el("footer", { className: "brand-p-footer" }, [
        el("span", { text: "CHEONGPA GACHI" }),
        el("span", { text: "VALUE · LIKE · TOGETHER" }),
        el("span", { text: "© 2026" }),
      ]),
    ]);
    root.replaceChildren(main);
    bindGateway(main);
  }

  function renderDetail(type) {
    const content = details[type];
    if (!content) return renderGateway();
    const main = el("main", { id: "brand-main-content", className: `brand-p-detail brand-p-detail--${type}`, tabindex: "-1" }, [
      header(true),
      el("section", { className: "brand-p-detail__hero" }, [
        el("div", { className: "brand-p-detail__label", text: content.label }),
        el("div", { className: "brand-p-detail__word", text: content.english, "aria-hidden": "true" }),
        el("div", { className: "brand-p-detail__copy" }, [
          el("a", { href: "#/gateway", text: "← ALL THREE" }),
          el("h1", { text: content.title }),
          el("p", { text: content.lead }),
        ]),
      ]),
      el("section", { className: "brand-p-detail__list", "aria-label": `${content.title} 콘텐츠 구성` }, content.items.map((item) =>
        el("article", { className: "brand-p-detail__item" }, [
          el("span", { text: item[0] }),
          el("h2", { text: item[1] }),
          el("p", { text: item[2] }),
          el("em", { text: "COMING SOON" }),
        ])
      )),
      el("a", { className: "brand-p-detail__next", href: content.next, "aria-label": `NEXT CHAPTER ${content.nextLabel}` }, [
        el("span", { text: "NEXT CHAPTER" }),
        el("strong", { text: `${content.nextLabel} →` }),
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
    if (!PUBLIC_ROUTES.has(path)) return enterCommunity();
    document.documentElement.dataset.brandPublic = "true";
    root.hidden = false;
    if (path === "/value") {
      document.title = "가치를 나누다 | 청파 같이";
      renderDetail("value");
    } else if (path === "/like") {
      document.title = "같이 닮다 | 청파 같이";
      renderDetail("like");
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
  document.getElementById("skip-link")?.addEventListener("click", () => {
    if (document.documentElement.dataset.brandPublic === "true") document.getElementById("brand-main-content")?.focus();
  });
  renderRoute();
})();
