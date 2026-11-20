/* ==========================================================
   Maria Ferreira Nail Designer — interações
   ========================================================== */

// >>> Para trocar o número do WhatsApp, edite só esta linha (DDI + DDD + número, sem espaços)
const WHATSAPP = "5561998378967";

(() => {
  "use strict";
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Preloader ---------- */
  const preloader = $("#preloader");
  const hidePreloader = () => preloader && preloader.classList.add("is-done");
  window.addEventListener("load", () => setTimeout(hidePreloader, 1300));
  document.addEventListener("DOMContentLoaded", () => setTimeout(hidePreloader, 2200));
  setTimeout(hidePreloader, 3500); // segurança

  /* ---------- Ano ---------- */
  $("#year").textContent = new Date().getFullYear();

  /* ---------- Menu ---------- */
  const nav = $("#nav");
  const toggle = $("#navToggle");
  const links = $("#navLinks");
  const progress = $("#progress");
  const toTop = $("#toTop");

  const closeMenu = () => {
    links.classList.remove("is-open");
    toggle.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  };
  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("is-open");
    toggle.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  });
  $$("a", links).forEach((a) => a.addEventListener("click", closeMenu));

  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle("is-scrolled", y > 40);
    toTop.classList.toggle("is-show", y > 700);
    const h = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  /* ---------- Revelar ao rolar ---------- */
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-in");
          const el = e.target;
          setTimeout(() => (el.style.transitionDelay = "0s"), 1600);
          io.unobserve(el);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  $$(".reveal").forEach((el) => io.observe(el));

  /* ---------- Contadores ---------- */
  const countIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = +el.dataset.count;
      const plus = el.dataset.plus === "true";
      const fmt = (n) => n.toLocaleString("pt-BR") + (plus ? "+" : "");
      if (reduceMotion) { el.textContent = fmt(target); countIO.unobserve(el); return; }
      const start = performance.now();
      const dur = 1800;
      const tick = (t) => {
        const p = Math.min((t - start) / dur, 1);
        el.textContent = fmt(Math.round(target * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      countIO.unobserve(el);
    });
  }, { threshold: 0.6 });
  $$("[data-count]").forEach((el) => countIO.observe(el));

  /* ---------- Imagens ausentes: mostra moldura elegante ---------- */
  $$("img[data-fallback]").forEach((img) => {
    const holder = img.parentElement;
    holder.dataset.label = img.dataset.fallback;
    const empty = () => holder.classList.add("is-empty");
    if (img.complete && img.naturalWidth === 0) empty();
    img.addEventListener("error", empty);
  });

  /* ---------- Efeito 3D / brilho nos cards ---------- */
  if (!reduceMotion && window.matchMedia("(hover: hover)").matches) {
    $$(".tilt").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const x = e.clientX - r.left, y = e.clientY - r.top;
        card.style.setProperty("--mx", x + "px");
        card.style.setProperty("--my", y + "px");
        const rx = ((y / r.height) - 0.5) * -7;
        const ry = ((x / r.width) - 0.5) * 7;
        card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
      });
      card.addEventListener("mouseleave", () => (card.style.transform = ""));
    });
  }

  /* ---------- Ripple nos botões ---------- */
  $$(".btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const r = btn.getBoundingClientRect();
      const size = Math.max(r.width, r.height);
      const s = document.createElement("span");
      s.className = "ripple";
      s.style.width = s.style.height = size + "px";
      s.style.left = e.clientX - r.left - size / 2 + "px";
      s.style.top = e.clientY - r.top - size / 2 + "px";
      btn.appendChild(s);
      setTimeout(() => s.remove(), 700);
    });
  });

  /* ---------- Brilhos dourados no hero ---------- */
  const canvas = $("#sparkles");
  if (canvas && !reduceMotion) {
    const ctx = canvas.getContext("2d");
    let W, H, dots;
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.width = r.width * dpr;
      H = canvas.height = r.height * dpr;
      const count = Math.round((r.width * r.height) / 22000);
      dots = Array.from({ length: count }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        s: (Math.random() * 2.2 + 0.8) * dpr,
        v: (Math.random() * 0.25 + 0.08) * dpr,
        p: Math.random() * Math.PI * 2,
      }));
    };
    const star = (x, y, s, a) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.globalAlpha = a;
      ctx.fillStyle = "#d9b565";
      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        ctx.rotate(Math.PI / 2);
        ctx.lineTo(0, -s * 3);
        ctx.lineTo(s * 0.55, -s * 0.55);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };
    let running = true;
    const draw = (t) => {
      if (running) {
        ctx.clearRect(0, 0, W, H);
        dots.forEach((d) => {
          d.y -= d.v;
          if (d.y < -20) { d.y = H + 20; d.x = Math.random() * W; }
          star(d.x, d.y, d.s, 0.25 + 0.55 * Math.abs(Math.sin(t / 900 + d.p)));
        });
      }
      requestAnimationFrame(draw);
    };
    new IntersectionObserver(([e]) => (running = e.isIntersecting)).observe(canvas);
    window.addEventListener("resize", resize);
    resize();
    requestAnimationFrame(draw);
  }

  /* ---------- Carrossel estilo feed do Instagram ---------- */
  const track = $("#igTrack");
  if (track) {
    const posts = $$(".ig__post", track);
    const prev = $("#igPrev"), next = $("#igNext"), dotsBox = $("#igDots");

    // fundo desfocado = a própria foto (assim ela aparece inteira, sem corte)
    $$(".ig__media").forEach((m) => {
      const img = $("img", m);
      if (img) m.style.setProperty("--bg", `url("${img.src}")`); // caminho completo (url() em variável CSS é relativo ao css/)
    });

    const dots = posts.map((_, i) => {
      const d = document.createElement("button");
      d.type = "button"; d.className = "ig__dot"; d.setAttribute("aria-label", "Foto " + (i + 1));
      d.addEventListener("click", () => userGo(i));
      dotsBox.appendChild(d);
      return d;
    });

    let current = 0;
    const centerOf = (el) => el.offsetLeft + el.offsetWidth / 2;
    const go = (i) => {
      i = Math.max(0, Math.min(posts.length - 1, i));
      track.scrollTo({ left: centerOf(posts[i]) - track.clientWidth / 2, behavior: "smooth" });
    };
    const update = () => {
      const mid = track.scrollLeft + track.clientWidth / 2;
      let best = 0, bd = Infinity;
      posts.forEach((p, i) => { const d = Math.abs(centerOf(p) - mid); if (d < bd) { bd = d; best = i; } });
      current = best;
      posts.forEach((p, i) => p.classList.toggle("is-active", i === best));
      dots.forEach((d, i) => d.classList.toggle("is-active", i === best));
      prev.disabled = best === 0;
      next.disabled = best === posts.length - 1;
    };
    let ticking = false;
    track.addEventListener("scroll", () => {
      if (ticking) return; ticking = true;
      requestAnimationFrame(() => { update(); ticking = false; });
    }, { passive: true });
    window.addEventListener("resize", update);
    let lastUser = 0;
    const userGo = (i) => { lastUser = Date.now(); go(i); };
    prev.addEventListener("click", () => userGo(current - 1));
    next.addEventListener("click", () => userGo(current + 1));
    track.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") { e.preventDefault(); userGo(current + 1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); userGo(current - 1); }
    });
    update();

    // arrastar com o mouse (no celular é só deslizar com o dedo)
    let down = false, startX = 0, startLeft = 0;
    track.addEventListener("pointerdown", (e) => {
      if (e.pointerType !== "mouse" || e.target.closest("a, button")) return;
      down = true; startX = e.clientX; startLeft = track.scrollLeft;
    });
    window.addEventListener("pointermove", (e) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4) track.classList.add("is-drag");
      track.scrollLeft = startLeft - dx;
    });
    window.addEventListener("pointerup", () => {
      if (!down) return;
      down = false;
      if (track.classList.contains("is-drag")) {
        track.classList.remove("is-drag");
        userGo(current);
      }
    });

    // curtir (botão ou duplo clique/toque na foto)
    const like = (post, force) => {
      const btn = $(".ig__like", post);
      const on = force === true ? true : !btn.classList.contains("is-liked");
      btn.classList.remove("is-liked"); void btn.offsetWidth;
      btn.classList.toggle("is-liked", on);
    };
    posts.forEach((post) => {
      $(".ig__like", post).addEventListener("click", () => like(post));
      $(".ig__media", post).addEventListener("dblclick", () => {
        like(post, true);
        const b = document.createElement("span");
        b.className = "ig__burst";
        b.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 20.5s-7.5-4.6-9.2-9.4C1.7 7.9 3.6 4.8 6.8 4.8c2 0 3.5 1.1 5.200 3 1.700-1.900 3.200-3 5.200-3 3.200 0 5.100 3.100 4 6.300-1.700 4.800-9.200 9.400-9.200 9.400z"/></svg>';
        $(".ig__media", post).appendChild(b);
        setTimeout(() => b.remove(), 950);
      });
    });

    // passa sozinho a cada alguns segundos (pausa ao tocar/passar o mouse)
    if (!reduceMotion) {
      let paused = false, visible = false;
      track.addEventListener("mouseenter", () => (paused = true));
      track.addEventListener("mouseleave", () => (paused = false));
      track.addEventListener("touchstart", () => { paused = true; lastUser = Date.now(); }, { passive: true });
      track.addEventListener("touchend", () => setTimeout(() => (paused = false), 6000), { passive: true });
      new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0.4 }).observe(track);
      setInterval(() => {
        if (paused || !visible || document.hidden || Date.now() - lastUser < 7000) return;
        go(current >= posts.length - 1 ? 0 : current + 1);
      }, 4500);
    }
  }

  /* ---------- Agendamento via WhatsApp ---------- */
  const form = $("#bookingForm");
  const preview = $("#preview");
  const err = $("#formError");
  const dateInput = $("#data");

  // data mínima = hoje
  const today = new Date();
  dateInput.min = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split("T")[0];

  const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fmtDate = (v) => {
    if (!v) return "";
    const [y, m, d] = v.split("-");
    const date = new Date(+y, +m - 1, +d);
    const dia = date.toLocaleDateString("pt-BR", { weekday: "long" });
    return `${d}/${m}/${y} (${dia})`;
  };

  const values = () => ({
    nome: $("#nome").value.trim(),
    servico: $("#servico").value,
    data: $("#data").value,
    periodo: $("#periodo").value,
    obs: $("#obs").value.trim(),
  });

  const buildText = (v) => {
    const lines = ["Olá, Maria! 💅 Gostaria de agendar um horário."];
    lines.push("");
    lines.push(`*Nome:* ${v.nome || "—"}`);
    lines.push(`*Serviço:* ${v.servico || "—"}`);
    lines.push(`*Data:* ${v.data ? fmtDate(v.data) : "—"}`);
    lines.push(`*Período:* ${v.periodo || "A combinar"}`);
    if (v.obs) lines.push(`*Observações:* ${v.obs}`);
    lines.push("");
    lines.push("Aguardo seu retorno. Obrigada! ✨");
    return lines.join("\n");
  };

  const renderPreview = () => {
    const html = esc(buildText(values())).replace(/\*([^*]+)\*/g, "<b>$1</b>");
    preview.innerHTML = html;
  };
  renderPreview();
  ["input", "change"].forEach((ev) => form.addEventListener(ev, renderPreview));

  // botões "Agendar" dos cards já escolhem o serviço
  $$("[data-service]").forEach((a) =>
    a.addEventListener("click", () => {
      const sel = $("#servico");
      const opt = [...sel.options].find((o) => o.text === a.dataset.service);
      if (opt) { sel.value = opt.value || opt.text; renderPreview(); }
    })
  );

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const v = values();
    $$(".field", form).forEach((f) => f.classList.remove("has-error"));
    const missing = [];
    if (!v.nome) missing.push("nome");
    if (!v.servico) missing.push("servico");
    if (!v.data) missing.push("data");
    if (missing.length) {
      missing.forEach((id) => $("#" + id).closest(".field").classList.add("has-error"));
      err.textContent = "Preencha seu nome, o serviço e a data desejada para continuar.";
      $("#" + missing[0]).focus();
      return;
    }
    err.textContent = "";
    const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(buildText(v))}`;
    window.open(url, "_blank", "noopener");
  });
})();
