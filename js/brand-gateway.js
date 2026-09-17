(() => {
  const PUBLIC_ROUTES = new Set(["/gateway", "/like", "/value"]);
  const root = document.getElementById("brand-gateway-root");
  if (!root) return;

  const pathOf = () => {
    const raw = window.location.hash.replace(/^#/, "") || "/gateway";
    return `/${raw.split("?")[0]}`.replace(/\/+/, "/").replace(/\/$/, "") || "/";
  };

  const el = (tag, attrs = {}, children = []) => {
    const node = document.createElement(tag);
    Object.entries(attrs).forEach(([key, value]) => {
      if (value == null || value === false) return;
      if (key === "className") node.className = value;
      else if (key === "text") node.textContent = String(value);
      else if (key === "dataset") Object.assign(node.dataset, value);
      else node.setAttribute(key, String(value));
    });
    (Array.isArray(children) ? children : [children]).forEach((child) => {
      if (child == null || child === false) return;
      node.append(child instanceof Node ? child : document.createTextNode(String(child)));
    });
    return node;
  };

  const sections = [
    { no: "01", key: "like", en: "LIKE", ko: "같이 닮다", sub: "WORSHIP · WORD", href: "#/like", note: "예배와 말씀 안에서 같은 방향을 닮아갑니다." },
    { no: "02", key: "value", en: "VALUE", ko: "가치를 나누다", sub: "STORY · PROJECT", href: "#/value", note: "이야기와 생각, 실천으로 가치를 나눕니다." },
    { no: "03", key: "together", en: "TOGETHER", ko: "같이 하다", sub: "COMMUNITY · ACTIVITY", href: "#/login", note: "소식과 모임, 활동으로 오늘을 함께 만듭니다." },
  ];

  const detail = {
    like: {
      title: "같이 닮다", en: "LIKE", lead: "예배와 말씀 안에서 예수님의 마음을 배우고 청파의 신앙을 오늘의 삶으로 이어갑니다.",
      items: [["01", "청파의 정신", "약한 이의 곁에 서고 평화를 사랑하는 마음"], ["02", "예배", "청파청년부 예배와 메시지"], ["03", "말씀", "함께 묵상하고 삶으로 이어갈 기록"]],
    },
    value: {
      title: "가치를 나누다", en: "VALUE", lead: "우리가 중요하게 여기는 마음을 이야기와 생각, 프로젝트로 세상과 나눕니다.",
      items: [["01", "이야기", "목회자와 청년들의 삶과 신앙"], ["02", "칼럼", "사회와 공동체를 바라보는 관점"], ["03", "프로젝트", "봉사와 연대, 평화로 이어지는 실천"]],
    },
  };

  function header() {
    return el("header", { className: "brand-j-header" }, [
      el("a", { className: "brand-j-logo", href: "#/gateway", "aria-label": "청파 같이 첫 화면" }, [
        el("img", { src: "./assets/images/logo.svg", alt: "", width: "30", height: "30" }),
        el("span", { text: "CHEONGPA GACHI" }),
      ]),
      el("span", { className: "brand-j-header__meta", text: "PUBLIC BOARD · SEOUL · 2026" }),
      el("a", { className: "brand-j-enter", href: "#/login", text: "TOGETHER ↗" }),
    ]);
  }

  function notice(item, index) {
    return el("a", {
      className: `brand-j-notice brand-j-notice--${item.key}`,
      href: item.href,
      dataset: { notice: item.key },
      style: `--i:${index}`,
    }, [
      el("div", { className: "brand-j-notice__bar" }, [el("span", { text: item.no }), el("span", { text: item.sub })]),
      el("strong", { className: "brand-j-notice__en", text: item.en }),
      el("h2", { text: item.ko }),
      el("p", { text: item.note }),
      el("span", { className: "brand-j-notice__stamp", text: "OPEN ↗" }),
    ]);
  }

  function bindBoard(shell) {
    const board = shell.querySelector(".brand-j-board");
    const cards = [...shell.querySelectorAll("[data-notice]")];
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    cards.forEach((card) => {
      const activate = () => board?.setAttribute("data-active", card.dataset.notice || "");
      card.addEventListener("pointerenter", activate);
      card.addEventListener("focus", activate);
      card.addEventListener("pointermove", (event) => {
        if (reduce) return;
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / Math.max(rect.width, 1) - .5;
        const y = (event.clientY - rect.top) / Math.max(rect.height, 1) - .5;
        card.style.setProperty("--rx", `${(-y * 3).toFixed(2)}deg`);
        card.style.setProperty("--ry", `${(x * 4).toFixed(2)}deg`);
        card.style.setProperty("--mx", `${((x + .5) * 100).toFixed(1)}%`);
        card.style.setProperty("--my", `${((y + .5) * 100).toFixed(1)}%`);
      });
      card.addEventListener("pointerleave", () => {
        card.style.setProperty("--rx", "0deg");
        card.style.setProperty("--ry", "0deg");
      });
    });

    if (!reduce) {
      const marquee = shell.querySelector(".brand-j-marquee__track");
      let lastY = window.scrollY;
      window.addEventListener("scroll", () => {
        const delta = Math.max(-18, Math.min(18, window.scrollY - lastY));
        marquee?.style.setProperty("--skew", `${delta * .08}deg`);
        lastY = window.scrollY;
      }, { passive: true });
    }
  }

  function renderGateway() {
    const shell = el("main", { id: "brand-main-content", className: "brand-j-shell", tabindex: "-1" }, [
      header(),
      el("section", { className: "brand-j-hero", "aria-labelledby": "brand-j-title" }, [
        el("div", { className: "brand-j-hero__grid" }, [
          el("div", { className: "brand-j-hero__index" }, [
            el("span", { text: "NOTICE No. 001" }),
            el("span", { text: "CHEONGPA YOUTH COMMUNITY" }),
          ]),
          el("h1", { id: "brand-j-title", className: "brand-j-title" }, [
            el("span", { text: "같이" }), el("i", { text: "/" }), el("span", { text: "GACHI" }),
          ]),
          el("p", { className: "brand-j-hero__copy", text: "닮고, 나누고, 함께. 서로 다른 세 방향이 하나의 청파를 만듭니다." }),
          el("div", { className: "brand-j-seal", "aria-hidden": "true" }, [el("b", { text: "CARE" }), el("i", { text: "+" }), el("b", { text: "PEACE" })]),
        ]),
        el("div", { className: "brand-j-hero__strip", "aria-hidden": "true" }, [
          el("span", { text: "HELP THE WEAK" }), el("span", { text: "LOVE PEACE" }), el("span", { text: "LIVE TOGETHER" }),
        ]),
      ]),
      el("section", { className: "brand-j-board", "aria-label": "청파 같이 세 방향" }, [
        el("div", { className: "brand-j-board__backdrop", "aria-hidden": "true" }, [
          el("span", { className: "brand-j-board__word", text: "PUBLIC" }),
          el("span", { className: "brand-j-board__rule" }),
          el("span", { className: "brand-j-board__code", text: "CP / 37.55N / 126.96E" }),
        ]),
        ...sections.map(notice),
      ]),
      el("div", { className: "brand-j-marquee", "aria-hidden": "true" }, [
        el("div", { className: "brand-j-marquee__track", text: "LIKE · VALUE · TOGETHER · CARE · PEACE · CHEONGPA GACHI · LIKE · VALUE · TOGETHER · CARE · PEACE · CHEONGPA GACHI ·" }),
      ]),
      el("section", { className: "brand-j-manifesto" }, [
        el("span", { className: "brand-j-manifesto__no", text: "04 / COMMON DIRECTION" }),
        el("div", { className: "brand-j-manifesto__lines" }, [
          el("p", { text: "약한 이의" }),
          el("p", { text: "곁에 서고," }),
          el("p", { text: "평화를" }),
          el("p", { text: "사랑합니다." }),
        ]),
        el("div", { className: "brand-j-manifesto__note" }, [
          el("span", { text: "OUR COMMON DIRECTION" }),
          el("p", { text: "믿는 것을 말하고, 말한 것을 함께 살아내는 청파청년부." }),
        ]),
      ]),
      el("section", { className: "brand-j-directory", "aria-label": "빠른 이동" }, sections.map((item) =>
        el("a", { className: `brand-j-directory__row brand-j-directory__row--${item.key}`, href: item.href }, [
          el("span", { text: item.no }), el("strong", { text: item.en }), el("em", { text: item.ko }), el("i", { text: "↗" }),
        ])
      )),
      el("footer", { className: "brand-j-footer" }, [el("span", { text: "CHEONGPA GACHI" }), el("span", { text: "PUBLIC BOARD / 2026" }), el("span", { text: "LIKE · VALUE · TOGETHER" })]),
    ]);
    root.replaceChildren(shell);
    bindBoard(shell);
  }

  function renderDetail(type) {
    const data = detail[type];
    if (!data) return renderGateway();
    const shell = el("main", { id: "brand-main-content", className: `brand-j-shell brand-j-detail brand-j-detail--${type}`, tabindex: "-1" }, [
      header(),
      el("section", { className: "brand-j-detail__hero" }, [
        el("a", { className: "brand-j-back", href: "#/gateway", text: "← PUBLIC BOARD" }),
        el("span", { className: "brand-j-detail__en", text: data.en }),
        el("h1", { text: data.title }),
        el("p", { text: data.lead }),
      ]),
      el("section", { className: "brand-j-detail__list" }, data.items.map(([no, title, copy]) =>
        el("article", { className: "brand-j-detail__item" }, [el("span", { text: no }), el("h2", { text: title }), el("p", { text: copy }), el("i", { text: "↗" })])
      )),
      el("footer", { className: "brand-j-footer" }, [el("span", { text: "CHEONGPA GACHI" }), el("span", { text: data.en }), el("span", { text: "© 2026" })]),
    ]);
    root.replaceChildren(shell);
  }

  function render() {
    const path = pathOf();
    const isPublic = PUBLIC_ROUTES.has(path);
    document.documentElement.toggleAttribute("data-brand-public", isPublic);
    root.hidden = !isPublic;
    if (!isPublic) {
      root.replaceChildren();
      window.dispatchEvent(new CustomEvent("brand:enter-app"));
      return;
    }
    if (path === "/like") renderDetail("like");
    else if (path === "/value") renderDetail("value");
    else renderGateway();
    window.requestAnimationFrame(() => root.querySelector("main")?.focus({ preventScroll: true }));
  }

  window.addEventListener("hashchange", render);
  render();
})();
