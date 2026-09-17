(() => {
  const PUBLIC_ROUTES = new Set(["/gateway", "/like", "/value"]);
  const root = document.getElementById("brand-gateway-root");
  if (!root) return;

  const scenes = [
    { key: "like", no: "01", en: "LIKE", ko: "같이 닮다", meta: "WORSHIP · WORD · FORMATION", text: "예배와 말씀 안에서 같은 방향을 바라보고, 삶의 모양을 천천히 닮아갑니다.", href: "#/like" },
    { key: "value", no: "02", en: "VALUE", ko: "가치를 나누다", meta: "STORY · THOUGHT · PRACTICE", text: "사람의 이야기와 생각을 기록하고, 중요하게 여기는 가치를 일상의 실천으로 확장합니다.", href: "#/value" },
    { key: "together", no: "03", en: "TOGETHER", ko: "같이 하다", meta: "COMMUNITY · ACTIVITY · TODAY", text: "소식과 모임, 활동을 통해 서로의 오늘에 자리를 내어주며 함께 살아갑니다.", href: "#/login" },
  ];

  const details = {
    like: { label: "01 / LIKE", title: "같이 닮다", word: "LIKE", lead: "예배와 말씀 안에서 예수님의 마음을 배우고, 청파가 걸어온 신앙의 방향을 오늘의 삶으로 이어갑니다.", items: [["01", "청파의 정신", "약자의 곁에 서고 평화를 사랑하는 공동체의 방향"], ["02", "예배", "함께 드린 예배와 메시지를 다시 만나는 기록"], ["03", "말씀", "묵상과 질문을 일상의 선택으로 이어가는 콘텐츠"]], next: "#/value", nextLabel: "02 / VALUE" },
    value: { label: "02 / VALUE", title: "가치를 나누다", word: "VALUE", lead: "사람의 경험과 생각을 기록하고, 돌봄과 평화를 구체적인 프로젝트와 실천으로 확장합니다.", items: [["01", "이야기", "목회자와 청년들의 삶과 신앙을 담는 인터뷰"], ["02", "칼럼", "공동체와 세상을 함께 바라보는 질문과 관점"], ["03", "프로젝트", "봉사와 캠페인, 연대로 이어지는 실제 행동"]], next: "#/login", nextLabel: "03 / TOGETHER" },
  };

  const routePath = () => {
    const raw = window.location.hash.replace(/^#/, "") || "/gateway";
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
    return el("header", { className: `brand-s-header${compact ? " brand-s-header--compact" : ""}` }, [
      el("a", { className: "brand-s-logo", href: "#/gateway", "aria-label": "청파 같이 첫 화면" }, [
        el("img", { src: "./assets/images/logo.svg", alt: "", width: "26", height: "26" }),
        el("span", { text: "CHEONGPA GACHI" }),
      ]),
      el("div", { className: "brand-s-header__center", text: "LIKE · VALUE · TOGETHER" }),
      el("a", { className: "brand-s-enter", href: "#/login", text: "ENTER ↗" }),
    ]);
  }

  function sceneRail(scene) {
    return el("div", { className: `brand-s-scene brand-s-scene--${scene.key}`, dataset: { scene: scene.key } }, [
      el("span", { className: "brand-s-scene__no", text: scene.no }),
      el("strong", { text: scene.en }),
      el("span", { text: scene.ko }),
    ]);
  }

  function plane(scene, index) {
    return el("article", { className: `brand-s-plane brand-s-plane--${scene.key}`, dataset: { plane: scene.key, index } }, [
      el("div", { className: "brand-s-plane__meta", text: `${scene.no} / ${scene.meta}` }),
      el("div", { className: "brand-s-plane__word", text: scene.en, "aria-hidden": "true" }),
      el("div", { className: "brand-s-plane__copy" }, [
        el("h2", { text: scene.ko }),
        el("p", { text: scene.text }),
        el("a", { href: scene.href, "aria-label": `${scene.ko} 열기` }, [
          el("span", { text: scene.key === "together" ? "ENTER" : "EXPLORE" }),
          el("b", { text: "↗", "aria-hidden": "true" }),
        ]),
      ]),
    ]);
  }

  function bindGateway(main) {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const theatre = main.querySelector(".brand-s-theatre");
    const stage = main.querySelector(".brand-s-stage");
    const rails = [...main.querySelectorAll("[data-scene]")];
    const planes = [...main.querySelectorAll("[data-plane]")];
    if (!theatre || !stage || planes.length !== 3) return;

    let frame = 0;
    const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
    const update = () => {
      frame = 0;
      const rect = theatre.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const travel = Math.max(1, theatre.offsetHeight - vh);
      const progress = clamp(-rect.top / travel, 0, 1);
      const sceneFloat = progress * 2;
      const activeIndex = clamp(Math.round(sceneFloat), 0, 2);
      stage.dataset.active = scenes[activeIndex].key;
      rails.forEach((rail, i) => rail.dataset.active = String(i === activeIndex));

      if (reduced) return;
      planes.forEach((node, i) => {
        const local = sceneFloat - i;
        const distance = Math.abs(local);
        const focus = clamp(1 - distance, 0, 1);
        const direction = local < 0 ? 1 : -1;
        const x = (i - 1) * 18 + direction * distance * 9;
        const y = (i - 1) * 4 + distance * 5;
        const rotate = (i - 1) * 1.7 + direction * distance * 1.4;
        const scale = .78 + focus * .22;
        node.style.setProperty("--tx", `${x.toFixed(2)}vw`);
        node.style.setProperty("--ty", `${y.toFixed(2)}vh`);
        node.style.setProperty("--rot", `${rotate.toFixed(2)}deg`);
        node.style.setProperty("--scale", scale.toFixed(3));
        node.style.setProperty("--focus", focus.toFixed(3));
        node.style.zIndex = String(10 + Math.round(focus * 10));
      });
    };
    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    update();

    if (!reduced) {
      stage.addEventListener("pointermove", (event) => {
        const rect = stage.getBoundingClientRect();
        const x = (event.clientX - rect.left) / Math.max(rect.width, 1) - .5;
        const y = (event.clientY - rect.top) / Math.max(rect.height, 1) - .5;
        stage.style.setProperty("--mx", x.toFixed(3));
        stage.style.setProperty("--my", y.toFixed(3));
      });
      stage.addEventListener("pointerleave", () => {
        stage.style.setProperty("--mx", "0");
        stage.style.setProperty("--my", "0");
      });
    }

    const reveal = main.querySelector("[data-reveal]");
    if (!reveal) return;
    if (!("IntersectionObserver" in window) || reduced) {
      reveal.dataset.visible = "true";
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) reveal.dataset.visible = "true";
    }, { threshold: .2 });
    observer.observe(reveal);
  }

  function renderGateway() {
    const main = el("main", { id: "brand-main-content", className: "brand-s-shell", tabindex: "-1" }, [
      header(),
      el("section", { className: "brand-s-hero", "aria-labelledby": "brand-s-title" }, [
        el("div", { className: "brand-s-hero__eyebrow", text: "CHEONGPA YOUTH COMMUNITY · SEOUL" }),
        el("h1", { id: "brand-s-title", text: "같이" }),
        el("div", { className: "brand-s-hero__ghost", text: "GACHI", "aria-hidden": "true" }),
        el("p", { className: "brand-s-hero__lead", text: "서로 다른 자리에서 와서, 같은 방향을 바라보고, 함께 살아갑니다." }),
        el("div", { className: "brand-s-hero__line", "aria-hidden": "true" }),
        el("span", { className: "brand-s-hero__scroll", text: "SCROLL TO REARRANGE" }),
      ]),
      el("section", { className: "brand-s-theatre", "aria-label": "청파 같이 세 방향" }, [
        el("div", { className: "brand-s-stage", dataset: { active: "like" } }, [
          el("div", { className: "brand-s-stage__rail" }, scenes.map(sceneRail)),
          el("div", { className: "brand-s-stage__planes" }, scenes.map(plane)),
          el("div", { className: "brand-s-stage__caption" }, [
            el("span", { text: "THREE DIRECTIONS" }),
            el("span", { text: "ONE COMMUNITY" }),
          ]),
        ]),
      ]),
      el("section", { className: "brand-s-manifesto", dataset: { reveal: "" } }, [
        el("span", { text: "COMMON GROUND / 04" }),
        el("div", { className: "brand-s-manifesto__copy" }, [
          el("p", { text: "약한 이의 곁에 서고," }),
          el("p", { text: "평화를 사랑하며," }),
          el("p", { text: "함께 살아갑니다." }),
        ]),
        el("p", { className: "brand-s-manifesto__note", text: "믿는 것을 말하고, 말한 것을 함께 살아내는 공동체." }),
      ]),
      el("footer", { className: "brand-s-footer" }, [
        el("span", { text: "CHEONGPA GACHI" }),
        el("span", { text: "LIKE · VALUE · TOGETHER" }),
        el("span", { text: "© 2026" }),
      ]),
    ]);
    root.replaceChildren(main);
    bindGateway(main);
  }

  function renderDetail(type) {
    const content = details[type];
    if (!content) return renderGateway();
    const main = el("main", { id: "brand-main-content", className: `brand-s-detail brand-s-detail--${type}`, tabindex: "-1" }, [
      header(true),
      el("section", { className: "brand-s-detail__hero" }, [
        el("span", { className: "brand-s-detail__label", text: content.label }),
        el("div", { className: "brand-s-detail__plane" }, [
          el("div", { className: "brand-s-detail__word", text: content.word, "aria-hidden": "true" }),
          el("div", { className: "brand-s-detail__copy" }, [
            el("a", { href: "#/gateway", text: "← ALL THREE" }),
            el("h1", { text: content.title }),
            el("p", { text: content.lead }),
          ]),
        ]),
      ]),
      el("section", { className: "brand-s-detail__list" }, content.items.map((item) => el("article", { className: "brand-s-detail__item" }, [
        el("span", { text: item[0] }), el("h2", { text: item[1] }), el("p", { text: item[2] }), el("em", { text: "COMING SOON" }),
      ]))),
      el("a", { className: "brand-s-detail__next", href: content.next }, [el("span", { text: "NEXT DIRECTION" }), el("strong", { text: `${content.nextLabel} →` })]),
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

  addEventListener("hashchange", renderRoute);
  document.getElementById("skip-link")?.addEventListener("click", () => {
    if (document.documentElement.dataset.brandPublic === "true") document.getElementById("brand-main-content")?.focus();
  });
  renderRoute();
})();