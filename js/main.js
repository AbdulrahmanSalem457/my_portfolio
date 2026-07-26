/* ═══════════════════════════════════════════════════════════
   Abdulrahman Salem — Portfolio
   Vanilla JS. No dependencies.
   ─────────────────────────────────────────────────────────── */
'use strict';

/* ╔═══════════════════════════════════════════════════════════╗
   ║  ✏️  EDIT HERE — YOUR PROJECTS & DEMO VIDEOS               ║
   ║                                                           ║
   ║  Each project = one card in the Work section.              ║
   ║                                                           ║
   ║  video   → put your screen recording in assets/videos/     ║
   ║            e.g. "assets/videos/shop.mp4"                   ║
   ║  youtube → OR use a YouTube id instead: "dQw4w9WgXcQ"      ║
   ║            (the id is the part after ?v= in the URL)       ║
   ║  poster  → thumbnail image, e.g. assets/img/shop.jpg       ║
   ║  cats    → used by the filter buttons:                     ║
   ║            django | ecommerce | api | frontend             ║
   ║  live/code → leave "" to hide that button                  ║
   ╚═══════════════════════════════════════════════════════════╝ */
const PROJECTS = [
  {
    title: 'Multi-Vendor E-Commerce Platform',
    desc:  'A full marketplace where vendors manage their own storefronts. Cart, checkout, Stripe payments, order tracking and an analytics dashboard — all on Django.',
    tags:  ['Django', 'PostgreSQL', 'Stripe', 'Celery', 'Docker'],
    cats:  ['django', 'ecommerce'],
    badge: 'Featured',
    video: 'assets/videos/ecommerce.mp4',
    youtube: '',
    poster: 'assets/img/project-ecommerce.jpg',
    live:  '',
    code:  ''
  },
  {
    title: 'SaaS Analytics Dashboard',
    desc:  'Real-time metrics dashboard with custom chart widgets, team workspaces, role-based permissions and CSV/PDF exports. WebSockets keep everything live.',
    tags:  ['Django', 'Channels', 'Redis', 'JavaScript', 'Chart.js'],
    cats:  ['django', 'frontend'],
    badge: 'Live',
    video: 'assets/videos/dashboard.mp4',
    youtube: '',
    poster: 'assets/img/project-dashboard.jpg',
    live:  '',
    code:  ''
  },
  {
    title: 'Booking & Reservations API',
    desc:  'A REST API powering a mobile booking app — availability logic, conflict handling, JWT auth, notifications, and a fully documented OpenAPI spec.',
    tags:  ['DRF', 'JWT', 'PostgreSQL', 'Swagger', 'pytest'],
    cats:  ['api', 'django'],
    badge: 'API',
    video: 'assets/videos/booking-api.mp4',
    youtube: '',
    poster: 'assets/img/project-booking.jpg',
    live:  '',
    code:  ''
  },
  {
    title: 'Learning Management System',
    desc:  'Courses, lessons, video hosting, quizzes with auto-grading, student progress tracking and certificate generation. Built for a training academy.',
    tags:  ['Django', 'AWS S3', 'Celery', 'Tailwind'],
    cats:  ['django', 'frontend'],
    badge: 'Case study',
    video: 'assets/videos/lms.mp4',
    youtube: '',
    poster: 'assets/img/project-lms.jpg',
    live:  '',
    code:  ''
  },
  {
    title: 'Real-Estate Listings Portal',
    desc:  'Map-based property search with geo filters, saved searches, agent dashboards and an inquiry pipeline. Heavy on query optimisation.',
    tags:  ['Django', 'PostGIS', 'Leaflet', 'JavaScript'],
    cats:  ['django', 'frontend'],
    badge: 'Featured',
    video: 'assets/videos/realestate.mp4',
    youtube: '',
    poster: 'assets/img/project-realestate.jpg',
    live:  '',
    code:  ''
  },
  {
    title: 'Restaurant Ordering System',
    desc:  'QR-code table ordering with a live kitchen display, printable tickets, payment integration and daily sales reporting for the owner.',
    tags:  ['Django', 'WebSockets', 'Paymob', 'CSS'],
    cats:  ['ecommerce', 'frontend'],
    badge: 'Live',
    video: 'assets/videos/restaurant.mp4',
    youtube: '',
    poster: 'assets/img/project-restaurant.jpg',
    live:  '',
    code:  ''
  }
];

/* ── Helpers ───────────────────────────────────────────────── */
const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const REDUCED  = matchMedia('(prefers-reduced-motion: reduce)').matches;
const IS_TOUCH = matchMedia('(hover: none)').matches;
const clamp = (v, a, b) => Math.min(Math.max(v, a), b);
const lerp  = (a, b, t) => a + (b - a) * t;
const esc   = s => String(s).replace(/[&<>"']/g, c =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* ── Viewport watcher ──────────────────────────────────────────
   Everything that animates on scroll goes through this.

   It is deliberately NOT built on IntersectionObserver: on some
   engines (throttled or occluded renderers) IO callbacks never
   arrive, and since every revealed element starts at opacity:0
   that would leave the whole page blank. Plain rect maths driven
   by scroll + resize + a short startup poll always runs.

   Callbacks fire once and the entry is dropped, so the list
   shrinks to nothing and the scroll handler costs ~0 after load.
   ─────────────────────────────────────────────────────────── */
const Watch = (() => {
  const list = [];
  let queued = false;

  /* Visible when the element's top has risen above the bottom of the
     viewport (minus `offset`) and its bottom hasn't left the top yet. */
  function isVisible(el, offset) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) return false;   // display:none
    return r.top < innerHeight - offset && r.bottom > 0;
  }

  function check() {
    queued = false;
    for (let i = list.length - 1; i >= 0; i--) {
      const item = list[i];
      if (isVisible(item.el, item.offset)) {
        list.splice(i, 1);
        item.cb(item.el);
      }
    }
  }

  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(check);
  }

  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule);
  addEventListener('load', check);

  /* Startup poll. Calls check() directly rather than going through
     requestAnimationFrame, because rAF is frozen while a tab is
     occluded or backgrounded — and if the first pass never runs,
     every revealed element is left stranded at opacity:0.
     Also covers "the visitor never scrolls" and late web-font reflow. */
  let polls = 0;
  const poll = setInterval(() => {
    check();
    if (++polls > 14 || !list.length) clearInterval(poll);
  }, 300);

  return {
    add(el, cb, offset = 70) {
      if (!el) return;
      list.push({ el, cb, offset });
      schedule();
    }
  };
})();

/* ── 1. Preloader ──────────────────────────────────────────── */
(function preloader() {
  const el    = $('#preloader');
  const fill  = $('#preloaderFill');
  const count = $('#preloaderCount');
  if (!el) return;

  let pct = 0, tick = 0;

  function finish() {
    clearInterval(tick);
    el.classList.add('is-done');
    document.body.classList.add('is-loaded');
    setTimeout(() => el.remove(), 1000);
  }

  tick = setInterval(() => {
    pct = Math.min(100, pct + Math.random() * 13 + 4);
    fill.style.width = pct + '%';
    count.textContent = Math.floor(pct);
    if (pct === 100) { clearInterval(tick); setTimeout(finish, 320); }
  }, REDUCED ? 20 : 105);

  // Safety net — never trap the visitor behind the loader.
  setTimeout(() => { if (document.body.contains(el)) finish(); }, 5000);
})();

/* ── 2. Custom cursor ──────────────────────────────────────── */
(function cursor() {
  if (REDUCED || IS_TOUCH) return;
  const dot  = $('#cursorDot');
  const ring = $('#cursorRing');
  if (!dot || !ring) return;

  let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my, moved = false;

  addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    if (!moved) { moved = true; rx = mx; ry = my; document.body.classList.add('cursor-ready'); }
  }, { passive: true });

  (function loop() {
    rx = lerp(rx, mx, 0.16);
    ry = lerp(ry, my, 0.16);
    dot.style.transform  = `translate(${mx}px, ${my}px)`;
    ring.style.transform = `translate(${rx}px, ${ry}px)`;
    requestAnimationFrame(loop);
  })();

  const HOVERABLE = 'a, button, [data-cursor], input, textarea, .project__media, .filter';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(HOVERABLE)) document.body.classList.add('cursor-hover');
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(HOVERABLE)) document.body.classList.remove('cursor-hover');
  });
  document.addEventListener('mouseleave', () => document.body.classList.remove('cursor-ready'));
})();

/* ── 3. Navbar ─────────────────────────────────────────────── */
(function navbar() {
  const nav    = $('#nav');
  const links  = $('#navLinks');
  const burger = $('#navBurger');
  const pill   = $('#navPill');
  const items  = $$('.nav__link');
  if (!nav) return;

  let lastY = 0;

  /* sliding pill behind the active / hovered link */
  function movePill(target) {
    if (!target || innerWidth <= 900) { pill.classList.remove('is-on'); return; }
    pill.style.width = target.offsetWidth + 'px';
    pill.style.transform = `translateX(${target.offsetLeft}px)`;
    pill.classList.add('is-on');
  }
  items.forEach(a => a.addEventListener('mouseenter', () => movePill(a)));
  links.addEventListener('mouseleave', () => movePill($('.nav__link.is-active')));

  /* scroll-spy — plain maths, so it works even before the first paint */
  const sections = $$('section[id]');
  let activeId = '';

  function spy() {
    const probe = scrollY + innerHeight * 0.35;
    let current = sections[0];
    for (const s of sections) {
      if (s.getBoundingClientRect().top + scrollY <= probe) current = s;
    }
    // Near the very bottom the last section wins, even if it's short.
    if (scrollY + innerHeight >= document.documentElement.scrollHeight - 4) {
      current = sections[sections.length - 1];
    }
    if (!current || current.id === activeId) return;
    activeId = current.id;
    items.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + activeId));
    movePill($('.nav__link.is-active'));
  }

  function onScroll() {
    const y = scrollY;
    nav.classList.toggle('is-stuck', y > 30);
    if (!links.classList.contains('is-open')) {
      nav.classList.toggle('is-hidden', y > lastY && y > 400);
    }
    lastY = y;
    spy();
  }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', () => { spy(); movePill($('.nav__link.is-active')); });
  onScroll();
  setTimeout(() => movePill($('.nav__link.is-active')), 700);

  /* mobile menu */
  burger.addEventListener('click', () => {
    const open = links.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('is-locked', open);
  });
  items.forEach(a => a.addEventListener('click', () => {
    links.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('is-locked');
  }));
})();

/* ── 4. Scroll progress + back to top ──────────────────────── */
(function scrollUI() {
  const bar   = $('#scrollProgress');
  const toTop = $('#toTop');
  const ring  = $('#toTopProgress');
  const LEN   = 126;
  if (!bar || !toTop) return;

  function update() {
    const max = document.documentElement.scrollHeight - innerHeight;
    const p   = max > 0 ? clamp(scrollY / max, 0, 1) : 0;
    bar.style.width = (p * 100) + '%';
    ring.style.strokeDashoffset = String(LEN - LEN * p);
    toTop.classList.toggle('is-on', scrollY > 600);
  }
  addEventListener('scroll', update, { passive: true });
  addEventListener('resize', update);
  update();

  toTop.addEventListener('click', () =>
    scrollTo({ top: 0, behavior: REDUCED ? 'auto' : 'smooth' }));
})();

/* ── 5. Reveal on scroll ───────────────────────────────────── */
function initReveal(root = document) {
  const items = $$('.reveal:not(.is-in)', root);
  if (!items.length) return;

  if (REDUCED) { items.forEach(el => el.classList.add('is-in')); return; }

  items.forEach(el => Watch.add(el, target => {
    target.style.setProperty('--rd', (target.dataset.revealDelay || 0) + 'ms');
    target.classList.add('is-in');
  }));
}
initReveal();

/* ── 6. Animated counters ──────────────────────────────────── */
(function counters() {
  $$('.counter').forEach(el => Watch.add(el, () => {
    const target = +el.dataset.count || 0;
    const suffix = el.dataset.suffix || '';
    if (REDUCED) { el.textContent = target + suffix; return; }

    const dur = 1700, t0 = performance.now();
    (function step(now) {
      const p = clamp((now - t0) / dur, 0, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix;  // easeOutCubic
      if (p < 1) requestAnimationFrame(step);
    })(t0);
  }, 110));
})();

/* ── 7. Skill bars ─────────────────────────────────────────── */
(function skillBars() {
  $$('.bar').forEach(bar => Watch.add(bar, () => {
    const fill = $('b', bar);
    if (fill) setTimeout(() => { fill.style.width = (bar.dataset.level || 0) + '%'; }, 180);
  }, 90));
})();

/* ── 8. Timeline draw ──────────────────────────────────────── */
(function timeline() {
  const wrap = $('#timeline');
  const fill = $('#timelineFill');
  if (!wrap || !fill) return;

  const items = $$('.tl-item', wrap);

  function draw() {
    const r = wrap.getBoundingClientRect();
    const p = clamp((innerHeight * 0.82 - r.top) / (r.height || 1), 0, 1);
    fill.style.height = (p * 100) + '%';

    // Light up each dot as it passes the reading line.
    const line = innerHeight * 0.72;
    items.forEach(it => {
      const ir = it.getBoundingClientRect();
      it.classList.toggle('is-in', ir.top < line && ir.bottom > 0);
    });
  }
  addEventListener('scroll', draw, { passive: true });
  addEventListener('resize', draw);
  addEventListener('load', draw);
  draw();
})();

/* ── 9. Magnetic buttons ───────────────────────────────────── */
(function magnetic() {
  if (REDUCED || IS_TOUCH) return;
  $$('.magnetic').forEach(el => {
    const STRENGTH = 0.28;
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * STRENGTH;
      const y = (e.clientY - r.top - r.height / 2) * STRENGTH;
      el.style.transform = `translate(${x}px, ${y - 2}px)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });
})();

/* ── 10. 3D tilt ───────────────────────────────────────────── */
function initTilt(root = document) {
  if (REDUCED || IS_TOUCH) return;
  $$('[data-tilt]', root).forEach(el => {
    if (el.dataset.tiltReady) return;
    el.dataset.tiltReady = '1';
    const MAX = 7;
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width  - 0.5;
      const py = (e.clientY - r.top)  / r.height - 0.5;
      el.style.transform =
        `perspective(1000px) rotateX(${-py * MAX}deg) rotateY(${px * MAX}deg) translateZ(6px)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });
}
initTilt();

/* ── 11. Parallax ──────────────────────────────────────────── */
(function parallax() {
  if (REDUCED) return;
  const items = $$('[data-parallax]');
  if (!items.length) return;

  let ticking = false;
  function run() {
    ticking = false;
    const y = scrollY;
    items.forEach(el => { el.style.translate = `0 ${y * parseFloat(el.dataset.parallax)}px`; });
  }
  addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(run); }
  }, { passive: true });
})();

/* ── 12. Scramble text ─────────────────────────────────────── */
(function scramble() {
  const el = $('#scramble');
  if (!el || REDUCED) return;

  const words = (el.dataset.words || '').split('|').filter(Boolean);
  if (words.length < 2) return;

  const CHARS = '!<>-_\\/[]{}—=+*^?#$%&';
  let index = 0, frame = 0, queue = [], raf = 0;

  function setText(next) {
    const current = el.textContent;
    const len = Math.max(current.length, next.length);
    queue = [];
    for (let i = 0; i < len; i++) {
      const start = Math.floor(Math.random() * 22);
      queue.push({
        from: current[i] || '',
        to:   next[i] || '',
        start,
        end:  start + Math.floor(Math.random() * 22) + 10,
        char: ''
      });
    }
    cancelAnimationFrame(raf);
    frame = 0;
    tick();
  }

  function tick() {
    let out = '', done = 0;
    for (const q of queue) {
      if (frame >= q.end) { done++; out += esc(q.to); }
      else if (frame >= q.start) {
        if (!q.char || Math.random() < 0.28) q.char = CHARS[Math.floor(Math.random() * CHARS.length)];
        out += `<span style="opacity:.55">${esc(q.char)}</span>`;
      } else out += esc(q.from);
    }
    el.innerHTML = out;
    if (done === queue.length) { setTimeout(next, 2100); return; }
    frame++;
    raf = requestAnimationFrame(tick);
  }

  function next() {
    index = (index + 1) % words.length;
    setText(words[index]);
  }
  setTimeout(next, 2400);
})();

/* ── 13. Typed code window ─────────────────────────────────── */
(function typedCode() {
  const out = $('#typedCode');
  if (!out) return;

  const SEGMENTS = [
    ['# The developer behind this site\n', 'c-com'],
    ['from', 'c-kw'], [' django.db ', ''], ['import', 'c-kw'], [' models\n\n', ''],
    ['class', 'c-kw'], [' ', ''], ['Developer', 'c-cls'], ['(models.Model):\n', ''],
    ['    name      = models.CharField(max_length=', ''], ['64', 'c-num'], [')\n', ''],
    ['    role      = models.CharField(max_length=', ''], ['64', 'c-num'], [')\n', ''],
    ['    stack     = models.JSONField(default=list)\n', ''],
    ['    available = models.BooleanField(default=', ''], ['True', 'c-num'], [')\n\n', ''],
    ['    def', 'c-kw'], [' ', ''], ['__str__', 'c-fn'], ['(self):\n', ''],
    ['        return', 'c-kw'], [' ', ''], ['f"{self.name} — {self.role}"', 'c-str'], ['\n', '']
  ];

  const full = () => SEGMENTS
    .map(([t, c]) => c ? `<span class="${c}">${esc(t)}</span>` : esc(t)).join('');

  if (REDUCED) { out.innerHTML = full(); return; }

  let seg = 0, ch = 0, html = '';
  const SPEED = 17;

  function type() {
    if (seg >= SEGMENTS.length) {
      setTimeout(() => { seg = 0; ch = 0; html = ''; out.innerHTML = ''; type(); }, 6000);
      return;
    }
    const [text, cls] = SEGMENTS[seg];
    ch++;
    const partial = esc(text.slice(0, ch));
    out.innerHTML = html + (cls ? `<span class="${cls}">${partial}</span>` : partial);

    const justTyped = text[ch - 1];
    if (ch >= text.length) {
      html += cls ? `<span class="${cls}">${esc(text)}</span>` : esc(text);
      seg++; ch = 0;
    }
    setTimeout(type, justTyped === '\n' ? SPEED * 7 : SPEED);
  }

  Watch.add(out.closest('.code-card') || out, type, 120);
})();

/* ── 14. Render projects ───────────────────────────────────── */
(function renderProjects() {
  const grid = $('#projects');
  if (!grid) return;

  const arrow = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M9 7h8v8"/></svg>`;
  const play  = `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M8 5.5v13l11-6.5-11-6.5Z"/></svg>`;

  grid.innerHTML = PROJECTS.map((p, i) => {
    const hasVideo = Boolean(p.video || p.youtube);
    const badgeCls = /live/i.test(p.badge || '') ? ' project__badge--live' : '';

    const links = [
      p.live ? `<a href="${esc(p.live)}" target="_blank" rel="noopener" class="project__link project__link--primary">Live site ${arrow}</a>` : '',
      p.code ? `<a href="${esc(p.code)}" target="_blank" rel="noopener" class="project__link">Source code</a>` : '',
      hasVideo ? `<button type="button" class="project__link" data-play="${i}">Watch demo</button>` : ''
    ].filter(Boolean).join('');

    return `
    <article class="project reveal" data-cats="${esc(p.cats.join(' '))}" data-reveal-delay="${(i % 2) * 90}">
      ${p.badge ? `<span class="project__badge${badgeCls}">${esc(p.badge)}</span>` : ''}
      <div class="project__media" data-play="${i}" role="button" tabindex="0"
           aria-label="Play demo video for ${esc(p.title)}">
        <div class="project__ph">
          <b>${esc(p.title)}</b>
          <small>${esc(p.poster || 'add a poster image')}</small>
        </div>
        ${/* alt="" on purpose: the title is in the <h3> and the wrapper carries an
              aria-label, so alt text here would only be announced twice — and an
              empty alt renders nothing if the poster file isn't there yet. */''}
        ${p.poster ? `<img src="${esc(p.poster)}" alt="" loading="lazy" />` : ''}
        <div class="project__overlay"><span class="project__play">${play}</span></div>
      </div>
      <div class="project__body">
        <h3><span>${esc(p.title)}</span> ${arrow}</h3>
        <p>${esc(p.desc)}</p>
        <div class="project__tags">${p.tags.map(t => `<span>${esc(t)}</span>`).join('')}</div>
        ${links ? `<div class="project__links">${links}</div>` : ''}
      </div>
    </article>`;
  }).join('');

  /* The poster image is stacked over the placeholder. Drop it if the file
     isn't there yet so the placeholder (with the expected path) shows through. */
  $$('.project__media img', grid).forEach(img => {
    img.addEventListener('error', () => img.remove());
    if (img.complete && img.naturalWidth === 0) img.remove();
  });

  initReveal(grid);
  initTilt(grid);
})();

/* ── 15. Project filters ───────────────────────────────────── */
(function filters() {
  const bar  = $('#filters');
  const grid = $('#projects');
  if (!bar || !grid) return;

  bar.addEventListener('click', e => {
    const btn = e.target.closest('.filter');
    if (!btn) return;

    $$('.filter', bar).forEach(b => b.classList.toggle('is-active', b === btn));
    const want = btn.dataset.filter;

    $$('.project', grid).forEach(card => {
      const show = want === 'all' || card.dataset.cats.split(' ').includes(want);
      if (show) {
        card.classList.remove('is-gone');
        void card.offsetWidth;          // flush layout so the fade-in actually transitions
        card.classList.remove('is-hiding');
      } else {
        card.classList.add('is-hiding');
        setTimeout(() => {
          if (card.classList.contains('is-hiding')) card.classList.add('is-gone');
        }, 380);
      }
    });
  });
})();

/* ── 16. Video modal ───────────────────────────────────────── */
(function videoModal() {
  const modal = $('#videoModal');
  const frame = $('#modalFrame');
  const title = $('#modalTitle');
  const desc  = $('#modalDesc');
  if (!modal) return;

  let lastFocus = null;

  const emptyState = path => `
    <div class="modal__empty">
      <b>No video here yet</b>
      <code>${esc(path)}</code>
      <small>Drop your screen recording at that exact path and this player picks it up
      automatically. MP4 (H.264) plays everywhere.</small>
    </div>`;

  function open(i) {
    const p = PROJECTS[i];
    if (!p) return;

    lastFocus = document.activeElement;
    title.textContent = p.title;
    desc.textContent  = p.desc;

    if (p.youtube) {
      frame.innerHTML =
        `<iframe src="https://www.youtube.com/embed/${encodeURIComponent(p.youtube)}?autoplay=1&rel=0"
                 title="${esc(p.title)} demo"
                 allow="accelerometer; autoplay; encrypted-media; picture-in-picture"
                 allowfullscreen></iframe>`;
    } else if (p.video) {
      frame.innerHTML =
        `<video src="${esc(p.video)}" controls autoplay playsinline></video>`;
      $('video', frame).addEventListener('error', () => { frame.innerHTML = emptyState(p.video); });
    } else {
      frame.innerHTML = emptyState('assets/videos/your-demo.mp4');
    }

    modal.hidden = false;
    document.body.classList.add('is-locked');
    void modal.offsetWidth;             // flush so the panel animates in rather than popping
    modal.classList.add('is-open');
    $('.modal__close', modal).focus();
  }

  function close() {
    modal.classList.remove('is-open');
    document.body.classList.remove('is-locked');
    setTimeout(() => {
      modal.hidden = true;
      frame.innerHTML = '';                 // stops playback and unloads the iframe
      if (lastFocus) lastFocus.focus();
    }, 380);
  }

  document.addEventListener('click', e => {
    const trigger = e.target.closest('[data-play]');
    if (trigger) { e.preventDefault(); open(+trigger.dataset.play); return; }
    if (e.target.closest('[data-close]')) close();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !modal.hidden) { close(); return; }
    const media = e.target.closest?.('.project__media[data-play]');
    if (media && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      open(+media.dataset.play);
    }
  });

  /* Keep tab focus inside the dialog while it's open. */
  modal.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const focusable = $$('button, [href], iframe, video, input', modal)
      .filter(n => n.offsetParent !== null);
    if (!focusable.length) return;
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
})();

/* ── 17. Contact form → mailto ─────────────────────────────── */
(function contactForm() {
  const form = $('#contactForm');
  const note = $('#formNote');
  if (!form) return;

  const EMAIL = 'abodysalem383@gmail.com';   // ✏️ EDIT: your email

  form.addEventListener('submit', e => {
    e.preventDefault();

    let ok = true;
    [$('#cfName'), $('#cfEmail'), $('#cfMessage')].forEach(input => {
      const valid = input.type === 'email'
        ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())
        : input.value.trim().length > 1;
      input.parentElement.classList.toggle('has-error', !valid);
      if (!valid) ok = false;
    });

    if (!ok) {
      note.textContent = 'Please fill in your name, a valid email, and a message.';
      note.className = 'form-note is-err';
      return;
    }

    const name    = $('#cfName').value.trim();
    const email   = $('#cfEmail').value.trim();
    const subject = $('#cfSubject').value.trim() || `New project enquiry from ${name}`;
    const body    = `${$('#cfMessage').value.trim()}\n\n—\n${name}\n${email}`;

    location.href =
      `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    note.textContent = 'Opening your email app… if nothing happens, message me on WhatsApp instead.';
    note.className = 'form-note is-ok';
  });

  form.addEventListener('input', e => e.target.parentElement.classList.remove('has-error'));
})();

/* ── 18. Misc ──────────────────────────────────────────────── */
(function misc() {
  const y = $('#year');
  if (y) y.textContent = new Date().getFullYear();

  /* Anchor scrolling that accounts for the fixed navbar. */
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const target = document.getElementById(id.slice(1));
      if (!target) return;
      e.preventDefault();
      scrollTo({
        top: target.getBoundingClientRect().top + scrollY - (innerWidth > 900 ? 80 : 72),
        behavior: REDUCED ? 'auto' : 'smooth'
      });
      history.replaceState(null, '', id);
    });
  });
})();
