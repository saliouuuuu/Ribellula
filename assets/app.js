/* Ribellula Yoga · demo Marea Creative · v4
   Si apre la busta e sotto c'è già il sito. Poi cartoline in righe orizzontali e due manifesti col vetro. */
(() => {
'use strict';
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const root = document.documentElement;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
const isMob = () => innerWidth <= 760;
const G = window.gsap;
const ANIM = !!(G && window.ScrollTrigger) && !reduce;
const WA = '393459916715';
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const wa = t => `https://wa.me/${WA}?text=${encodeURIComponent(t)}`;
const pad2 = n => String(n).padStart(2, '0');
const safe = fn => { try { fn(); } catch (err) { console.error(err); } };

if (G && window.ScrollTrigger) {
  G.registerPlugin(ScrollTrigger); if (window.SplitText) G.registerPlugin(SplitText);
  ScrollTrigger.config({ ignoreMobileResize: true });
}
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

/* ---------------- scorrimento morbido ---------------- */
let lenis = null;
if (ANIM && window.Lenis) {
  lenis = new Lenis({ lerp: .1, smoothWheel: true, wheelMultiplier: 1 });
  lenis.on('scroll', ScrollTrigger.update);
  G.ticker.add(t => lenis.raf(t * 1000));
  G.ticker.lagSmoothing(0);
}
let locks = 0;
const lock = () => { locks++; if (lenis) lenis.stop(); };
const unlock = () => { locks = Math.max(0, locks - 1); if (!locks && lenis) lenis.start(); };
const scrollToEl = (t, off = 0) => {
  if (!t) return;
  if (lenis) lenis.scrollTo(t, { offset: off, duration: 1.4 });
  else t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
};

/* ---------------- avvisi ---------------- */
const toastEl = $('#toast'); let tt;
const toast = m => { toastEl.textContent = m; toastEl.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => toastEl.classList.remove('show'), 2800); };

/* la calligrafia si scrive: prima il contorno, poi il riempimento */
const drawPath = (p, dur = 2) => {
  const L = p.getTotalLength();
  G.set(p, { strokeDasharray: L, strokeDashoffset: L, fillOpacity: 0, strokeOpacity: 1 });
  return G.timeline()
    .to(p, { strokeDashoffset: 0, duration: dur, ease: 'power1.inOut' })
    .to(p, { fillOpacity: 1, duration: .9, ease: 'power1.out' }, '-=.55')
    .to(p, { strokeOpacity: 0, duration: .6 }, '-=.4');
};

/* =====================================================
   APERTURA · la busta (ispirazioni 1 e 2)
   Un tocco, un clic o un colpo di rotella: il sigillo si spezza,
   il lembo si apre, la busta scende e sotto c'è il sito.
   ===================================================== */
const env = $('#env');
const heroFade = $$('.hero__k, .hero__foot > *, .hero__date, .hero__tag');
const heroIn = () => G.timeline()
  .to('.hero__t .syl>span', { yPercent: 0, duration: .85, stagger: .07, ease: 'power3.out' }, 0)
  .to(heroFade, { opacity: 1, y: 0, duration: .7, stagger: .05, ease: 'power2.out' }, .12)
  .to('#hd', { opacity: 1, duration: .6, ease: 'power1.out' }, .25);

function armEnvelope() {
  const crack = $('#crack');
  const CRUMB = [[-150, -40, -220], [120, -70, 260], [-90, 130, 180], [170, 60, -160], [-200, 40, 300], [60, 170, -240], [10, -150, 200]];
  const envSub = $('#envSub');
  envSub.innerHTML = [...envSub.textContent].map(c => c === ' ' ? ' ' : `<i>${c}</i>`).join('');
  const cl = crack.getTotalLength ? crack.getTotalLength() : 100;
  G.set(crack, { strokeDasharray: cl, strokeDashoffset: cl });

  // il rametto si appoggia, il sigillo viene premuto, la firma si scrive
  const intro = G.timeline({ delay: .15 });
  intro.fromTo('#sprig', { opacity: 0, rotation: 20, x: -30, y: 24 }, { opacity: 1, rotation: 38, x: 0, y: 0, duration: 1.1, ease: 'power3.out' })
    .fromTo('#sealIn', { scale: 2.3, opacity: 0, rotation: -22 }, { scale: 1, opacity: 1, rotation: 0, duration: .75, ease: 'power3.in' }, .4)
    .to('#sealIn', { scaleX: 1.09, scaleY: .9, duration: .08, ease: 'power1.out' })
    .to('#sealIn', { scaleX: 1, scaleY: 1, duration: .9, ease: 'elastic.out(1,.38)' })
    .fromTo('.drop', { scale: 0 }, { scale: 1, duration: .7, stagger: .12, ease: 'back.out(3)' }, '-=.85')
    .to('.rc', { strokeDashoffset: 0, duration: 1.5, ease: 'power2.inOut' }, '-=.9')
    .to('.spark--b', { opacity: 1, duration: .5 }, '-=.5')
    .add(drawPath($('#heroScript path'), 2.2), '-=1.25')
    .set('#envSub', { opacity: 1 }, '<')
    .fromTo($$('i', envSub), { opacity: 0, y: 6 }, { opacity: 1, y: 0, stagger: .025, duration: .5, ease: 'power2.out' }, '-=1.5')
    .to('#envSmall', { opacity: 1, duration: .7 }, '-=.6')
    .to('#hint', { opacity: 1, duration: .7 }, '-=.4');

  let opened = false, tl = null;
  const inertEls = $$('#hd, main, footer, #waf');
  const finish = () => {
    removeEventListener('wheel', onWheel); removeEventListener('keydown', onKey);
    root.classList.remove('env-on'); env.remove();
    inertEls.forEach(e => { e.inert = false; });
    const cur = $('#cur'); if (cur) cur.classList.remove('is-label');
    unlock(); ScrollTrigger.refresh();
  };
  const open = () => {
    if (opened) { if (tl) tl.timeScale(2.4); return; }
    opened = true;
    intro.progress(1).kill();
    tl = G.timeline();
    tl.to('#hint', { opacity: 0, y: 10, duration: .25 }, 0)
      .to(crack, { strokeDashoffset: 0, duration: .2, ease: 'power1.in' }, 0)
      .to(crack, { opacity: 0, duration: .05 }, .2)
      .to('.seal__l', { xPercent: -30, yPercent: 80, rotation: -30, duration: .75, ease: 'power2.in' }, .2)
      .to('.seal__r', { xPercent: 34, yPercent: 92, rotation: 36, duration: .75, ease: 'power2.in' }, .2)
      .to('.drop', { y: () => innerHeight * .5, opacity: 0, duration: .6, ease: 'power2.in', stagger: .05 }, .16)
      .to('#sprig', { x: -60, y: () => innerHeight * .6, rotation: '+=50', duration: .9, ease: 'power2.in' }, .22)
      .set('.crumb', { opacity: 1 }, .2)
      .fromTo('.crumb', { x: 0, y: 0, rotation: 0 }, { x: i => CRUMB[i][0], y: i => CRUMB[i][1], rotation: i => CRUMB[i][2], duration: .7, ease: 'power2.out' }, .2)
      .to('.crumb', { opacity: 0, duration: .3 }, .6)
      .to('#seal', { opacity: 0, duration: .22 }, .78)
      .set('#env', { backgroundColor: 'transparent' }, .36)
      .to('#flap', { rotationX: -176, duration: .8, ease: 'power2.inOut' }, .34)
      .to('#flapShade', { opacity: 0, duration: .35 }, .34)
      .to('#flapWrap', { opacity: 0, duration: .18 }, 1)
      .to('#pocket', { yPercent: 104, duration: .85, ease: 'power3.in' }, .9)
      .fromTo(['.hero__img', '.hero__blur'], { scale: 1.1 }, { scale: 1, duration: 1.7, ease: 'power2.out' }, .3)
      .add(heroIn(), 1.05)
      .call(finish, null, 1.8);
  };
  const onWheel = e => { if (!opened && Math.abs(e.deltaY) + Math.abs(e.deltaX) > 2) open(); };
  const onKey = e => {
    if (opened) return;
    if (e.target && e.target.closest && e.target.closest('#seal')) return;
    if ([' ', 'Enter', 'ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End'].includes(e.key)) { e.preventDefault(); open(); }
  };
  env.addEventListener('click', open);
  env.addEventListener('touchmove', () => { if (!opened) open(); }, { passive: true });
  addEventListener('wheel', onWheel, { passive: true });
  addEventListener('keydown', onKey);
  env.dataset.cur = 'Apri';

  // la pagina sotto la busta aspetta in posizione
  G.set('.hero__t .syl>span', { yPercent: 110 });
  G.set(heroFade, { opacity: 0, y: 16 });
  G.set('#hd', { opacity: 0 });
  inertEls.forEach(e => { e.inert = true; });
  scrollTo(0, 0);
  lock();
}
if (env && ANIM && root.classList.contains('env-on')) {
  try { armEnvelope(); window.__ribOk = 1; }
  catch (err) {
    console.error(err);
    root.classList.remove('env-on'); env.remove();
    if (G) G.set(['.hero__t .syl>span', '#hd', ...heroFade], { clearProps: 'all' });
    $$('#hd, main, footer, #waf').forEach(e => { e.inert = false; });
    locks = 1; unlock();
  }
} else {
  root.classList.remove('env-on'); if (env) env.remove();
}

/* ---------------- intestazione e contatto rapido ---------------- */
const hd = $('#hd'), hero = $('#top'), waf = $('#waf');
safe(() => {
  let lastY = 0, hh = innerHeight, ticking = false;
  const measure = () => { hh = hero.offsetHeight; };
  measure(); addEventListener('resize', measure);
  const onScroll = () => {
    ticking = false;
    const y = scrollY, menuOpen = document.body.classList.contains('menu-open');
    if (y > lastY + 2 && y > 140 && !menuOpen) hd.classList.add('hide');
    else if (y < lastY - 2 || y < 140) hd.classList.remove('hide');
    hd.classList.toggle('solid', y > 60);
    waf.classList.toggle('show', y > hh * .55);
    lastY = y;
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();
  // dove c'è già WhatsApp (contatti, piè di pagina) il bottone si fa da parte
  if ('IntersectionObserver' in window) {
    const on = new Set();
    const io = new IntersectionObserver(es => { es.forEach(e => e.isIntersecting ? on.add(e.target) : on.delete(e.target)); waf.classList.toggle('hide', on.size > 0); }, { rootMargin: '0px 0px -30% 0px' });
    [$('#contatti'), $('footer')].forEach(e => e && io.observe(e));
  }
});

/* ---------------- menu e link interni ---------------- */
const menu = $('#menu'), menuBtn = $('#menuBtn');
const setMenu = o => {
  document.body.classList.toggle('menu-open', o);
  menuBtn.setAttribute('aria-expanded', String(o)); menu.setAttribute('aria-hidden', String(!o));
  if (o) hd.classList.remove('hide');
  o ? lock() : unlock();
};
const closeMenu = () => { if (document.body.classList.contains('menu-open')) setMenu(false); };
menuBtn.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
$$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
  const id = a.getAttribute('href');
  if (id === '#') { e.preventDefault(); toast('Esempio: qui andrà l\'informativa privacy'); return; }
  const t = $(id); if (!t) return;
  e.preventDefault();
  const wasOpen = document.body.classList.contains('menu-open'); closeMenu();
  setTimeout(() => scrollToEl(t), wasOpen ? 320 : 0);
}));

/* ---------------- hero: profondità leggera mentre scorri ---------------- */
if (ANIM) safe(() => {
  const st = { trigger: '#top', start: 'top top', end: 'bottom top', scrub: true };
  G.to(['.hero__img', '.hero__blur'], { yPercent: 7, ease: 'none', scrollTrigger: st });
  G.to('.hero__in', { yPercent: -6, ease: 'none', scrollTrigger: { ...st } });
});

/* ---------------- titoli e paragrafi che entrano ---------------- */
if (ANIM) safe(() => {
  if (window.SplitText) {
    $$('.split').forEach(el => SplitText.create(el, {
      type: 'lines', mask: 'lines', autoSplit: true,
      onSplit: s => G.from(s.lines, { yPercent: 110, duration: 1.1, stagger: .09, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } })
    }));
  }
  $$('.rv').forEach(el => G.from(el, { y: 30, opacity: 0, duration: 1.05, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } }));
  const drawOn = (sel, trig, dur, start) => {
    const p = $(sel); if (!p) return;
    G.set(p, { fillOpacity: 0, strokeOpacity: 0 });
    ScrollTrigger.create({ trigger: trig, start, once: true, onEnter: () => drawPath(p, dur) });
  };
  drawOn('#sigChiara path', '#chi-sono', 1.9, 'top 72%');
  drawOn('.vt__s path', '#videoteca', 1.6, 'top 70%');
  drawOn('.inv__s path', '#invite', 1.4, 'top 60%');
  drawOn('.letter__h path', '#letter', 1.6, 'top 80%');
  drawOn('#ftScript path', '#ftScript', 2.4, 'top 94%');
});

/* =====================================================
   01 CHI SONO · la figura esce dal cerchio (8) e la spirale aurea (6)
   ===================================================== */
if (ANIM) safe(() => {
  G.timeline({ scrollTrigger: { trigger: '#aboutFig', start: 'top 90%', end: 'center 45%', scrub: 1 } })
    .fromTo('#sun', { scale: .45 }, { scale: 1, ease: 'none' }, 0)
    .fromTo('#aboutCut', { yPercent: 16 }, { yPercent: 0, ease: 'none' }, 0)
    .fromTo('.sun__ring', { rotation: -40, scale: .7, opacity: 0 }, { rotation: 0, scale: 1, opacity: 1, ease: 'none' }, 0);
});
safe(() => {
  const svg = $('#phi'); if (!svg) return;
  let r = [0, 0, 618, 1000]; const sides = ['b', 'r', 't', 'l']; let out = '';
  for (let i = 0; i < 9; i++) {
    const [x, y, w, h] = r; const side = sides[i % 4]; let q, a;
    if (side === 'b') { const s = w; q = [x, y + h - s, s, s]; r = [x, y, w, h - s]; a = [q[0], q[1] + s, q[0] + s, q[1], s]; }
    if (side === 'r') { const s = h; q = [x + w - s, y, s, s]; r = [x, y, w - s, h]; a = [q[0] + s, q[1] + s, q[0], q[1], s]; }
    if (side === 't') { const s = w; q = [x, y, s, s]; r = [x, y + s, w, h - s]; a = [q[0] + s, q[1], q[0], q[1] + s, s]; }
    if (side === 'l') { const s = h; q = [x, y, s, s]; r = [x + s, y, w - s, h]; a = [q[0], q[1], q[0] + s, q[1] + s, s]; }
    out += `<rect class="pq" x="${q[0].toFixed(1)}" y="${q[1].toFixed(1)}" width="${q[2].toFixed(1)}" height="${q[3].toFixed(1)}"/>`;
    out += `<path class="pa" d="M${a[0].toFixed(1)} ${a[1].toFixed(1)}A${a[4].toFixed(1)} ${a[4].toFixed(1)} 0 0 0 ${a[2].toFixed(1)} ${a[3].toFixed(1)}"/>`;
  }
  svg.innerHTML = out;
  if (!ANIM) return;
  $$('rect,path', svg).forEach(e => { const L = e.getTotalLength(); G.set(e, { strokeDasharray: L, strokeDashoffset: L }); });
  G.timeline({ scrollTrigger: { trigger: '#maniFig', start: 'top 80%', end: 'bottom 50%', scrub: 1 } })
    .to($$('.pq', svg), { strokeDashoffset: 0, stagger: .12, duration: 1, ease: 'none' }, 0)
    .to($$('.pa', svg), { strokeDashoffset: 0, stagger: .14, duration: .9, ease: 'none' }, .3);
  G.fromTo('#maniImg', { yPercent: -5, scale: 1.14 }, { yPercent: 5, scale: 1.04, ease: 'none', scrollTrigger: { trigger: '#maniFig', start: 'top bottom', end: 'bottom top', scrub: true } });
  $$('.mk path').forEach((p, i) => {
    const L = p.getTotalLength(); G.set(p, { strokeDasharray: L, strokeDashoffset: L });
    G.to(p, { strokeDashoffset: 0, duration: .9, delay: i * .35, ease: 'power2.inOut', scrollTrigger: { trigger: '#maniP', start: 'top 82%', once: true } });
  });
  G.from('.appr__q', { y: 24, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.appr__q', start: 'top 92%', once: true } });
});

/* =====================================================
   02 WORKSHOP · manifesto col vetro (4) e invito nella busta (3)
   ===================================================== */
if (ANIM) safe(() => {
  const wF = () => isMob() ? 68 : 46;
  const st = { trigger: '#band', start: 'top 65%', end: 'bottom 75%', scrub: 1, invalidateOnRefresh: true };
  // il vetro si stringe verso sinistra: sposto il vetro e al contrario il suo contenuto, così le scritte restano ferme
  G.fromTo('#bandGlass', { xPercent: 0 }, { xPercent: () => -(100 - wF()), ease: 'none', scrollTrigger: st });
  G.fromTo('#bandIn', { xPercent: 0 }, { xPercent: () => 100 - wF(), ease: 'none', scrollTrigger: { ...st } });
  G.fromTo(['#bandImg', '#bandBlur'], { scale: 1.18 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '#band', start: 'top bottom', end: 'bottom top', scrub: true } });
  G.from('.band__big span', { yPercent: 40, opacity: 0, stagger: .08, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: '#band', start: 'top 72%', once: true } });
  G.from('.band__date', { y: 30, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '#band', start: 'top 55%', once: true } });
  G.fromTo('#invCard', { yPercent: 0 }, { yPercent: -82, ease: 'none', scrollTrigger: { trigger: '#invite', start: 'top 95%', end: 'top 32%', scrub: 1 } });
  G.from('.ws__info > *', { y: 30, opacity: 0, duration: .9, stagger: .07, ease: 'power3.out', scrollTrigger: { trigger: '.ws__info', start: 'top 82%', once: true } });
});
safe(function countdown() {
  const target = new Date('2026-11-22T09:00:00+01:00'), endT = new Date('2026-11-22T16:00:00+01:00'), early = new Date('2026-11-03T23:59:59+01:00');
  const now0 = new Date();
  if (now0 <= early) $('#wsPrice').innerHTML = '90 € early bird fino al 3 novembre, poi 100 €';
  const box = $('#cd');
  if (now0 > endT) {
    box.className = 'cd--done'; box.textContent = 'Workshop concluso. Scrivimi per sapere quando torna.';
    $('.ws__info .eyebrow').innerHTML = 'Ultimo workshop'; $('#wsBook').firstChild.textContent = 'Avvisami per il prossimo ';
    return;
  }
  const units = { d: $('[data-u="d"]', box), h: $('[data-u="h"]', box), m: $('[data-u="m"]', box), s: $('[data-u="s"]', box) };
  const setD = (el, str) => {
    if (el.dataset.v === str) return; el.dataset.v = str;
    if (el.children.length !== str.length) { el.innerHTML = [...str].map(d => `<span class="dg"><span>${d}</span></span>`).join(''); return; }
    [...str].forEach((d, i) => {
      const bx = el.children[i], cur = bx.lastElementChild; if (cur.textContent === d) return;
      const nn = document.createElement('span'); nn.textContent = d; bx.appendChild(nn);
      if (ANIM) { G.fromTo(nn, { yPercent: 100 }, { yPercent: 0, duration: .55, ease: 'expo.out' }); G.to(cur, { yPercent: -100, duration: .55, ease: 'expo.out', onComplete: () => cur.remove() }); }
      else cur.remove();
    });
  };
  const tick = () => {
    let s = Math.max(0, Math.floor((target - new Date()) / 1000));
    const d = Math.floor(s / 86400); s -= d * 86400; const h = Math.floor(s / 3600); s -= h * 3600; const m = Math.floor(s / 60); s -= m * 60;
    setD(units.d, pad2(d)); setD(units.h, pad2(h)); setD(units.m, pad2(m)); setD(units.s, pad2(s));
  };
  tick(); setInterval(tick, 1000);
});
// fisarmoniche (workshop e domande)
const accordion = (wrap, itemSel, btnSel) => {
  if (!wrap) return;
  wrap.addEventListener('click', e => {
    const b = e.target.closest(btnSel); if (!b) return; const it = b.closest(itemSel); const o = !it.classList.contains('open');
    $$(itemSel + '.open', wrap).forEach(x => { if (x !== it) { x.classList.remove('open'); $(btnSel, x).setAttribute('aria-expanded', 'false'); } });
    it.classList.toggle('open', o); b.setAttribute('aria-expanded', String(o));
  });
};
accordion($('#wsAcc'), '.acc__i', '.acc__b');
accordion($('#faqList'), '.qa', '.qa__b');

/* =====================================================
   CARTOLINE (ispirazione 7) e righe orizzontali
   ===================================================== */
const LOCK = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/></svg>';
const PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4l14 8-14 8z"/></svg>';
const STAR = '<svg class="yc__star" viewBox="0 0 20 20" aria-hidden="true"><use href="#starShape"/></svg>';
const curve = i => { const a = 58 + (i * 13) % 34, b = 8 + (i * 17) % 40, c = 92 - (i * 7) % 30, d = 24 + (i * 11) % 50; return `M-6 ${a} C 38 ${b}, 92 ${c}, 168 ${d}`; };
const LINE = (i, d) => `<svg class="yc__line" viewBox="0 0 160 100" preserveAspectRatio="none" aria-hidden="true"><path d="${d || curve(i)}"/></svg>`;
const CLS_LINE = ['M-6 44 C 40 22, 96 52, 168 30', 'M-6 30 C 46 52, 104 18, 168 40', 'M-6 38 C 36 54, 110 22, 168 46'];
const setLens = scope => $$('.yc__line path', scope).forEach(p => { const y = p.closest('.yc'); if (y) y.style.setProperty('--len', Math.ceil(p.getTotalLength())); });

function makeRow(row, ctl) {
  const api = { update() {}, reset() {} };
  if (!row) return api;
  const prev = ctl && $('.rp', ctl), next = ctl && $('.rn', ctl), bar = ctl && $('.rbar i', ctl), num = ctl && $('.rnum', ctl);
  const items = () => [...row.children].filter(c => !c.classList.contains('gone'));
  const scrollable = () => row.scrollWidth > row.clientWidth + 4;
  const nearest = (it, x) => {
    if (!it.length) return 0; const base = it[0].offsetLeft; let b = 0, bd = Infinity;
    it.forEach((c, i) => { const d = Math.abs(c.offsetLeft - base - x); if (d < bd) { bd = d; b = i; } });
    return b;
  };
  let raf = 0;
  const update = () => {
    raf = 0;
    const it = items(), n = it.length, sl = row.scrollLeft, cw = row.clientWidth, sw = row.scrollWidth, max = sw - cw;
    const can = sw > cw + 4, atS = sl <= 2, atE = sl >= max - 2;
    const idx = atE && n ? n - 1 : nearest(it, sl);
    // l'alone di ogni cartolina scivola un poco mentre la riga scorre
    const W = innerWidth, orbs = [];
    it.forEach(c => { const o = c._orb || (c._orb = $('.yc__orb', c)); if (!o) return; const r = c.getBoundingClientRect(); if (r.right > -40 && r.left < W + 40) orbs.push([o, ((r.left + r.width / 2) / W - .5) * -16]); });
    if (prev) prev.disabled = !can || atS;
    if (next) next.disabled = !can || atE;
    if (bar) bar.style.transform = `scaleX(${Math.min(1, (sl + cw) / Math.max(1, sw)).toFixed(4)})`;
    if (num) { const t = `${pad2(n ? idx + 1 : 0)} / ${pad2(n)}`; if (num.textContent !== t) num.textContent = t; }
    orbs.forEach(([o, v]) => o.style.setProperty('--px', v.toFixed(2)));
  };
  api.update = () => { if (!raf) raf = requestAnimationFrame(update); };
  api.reset = () => { row.scrollLeft = 0; api.update(); };
  const go = dir => {
    const it = items(); if (!it.length) return;
    const base = it[0].offsetLeft, step = it.length > 1 ? it[1].offsetLeft - base : row.clientWidth;
    const per = Math.max(1, Math.floor((row.clientWidth - base) / step));
    const by = per >= 3 ? per - 1 : 1;
    const ni = Math.max(0, Math.min(it.length - 1, nearest(it, row.scrollLeft) + dir * by));
    row.scrollTo({ left: Math.min(row.scrollWidth - row.clientWidth, it[ni].offsetLeft - base), behavior: reduce ? 'auto' : 'smooth' });
  };
  if (prev) prev.addEventListener('click', () => go(-1));
  if (next) next.addEventListener('click', () => go(1));
  row.addEventListener('scroll', api.update, { passive: true });
  addEventListener('resize', api.update);
  row.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
  });
  // la rotella orizzontale (trackpad) scorre la riga, quella verticale la pagina
  row.addEventListener('wheel', e => { if (scrollable() && (Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey)) e.stopPropagation(); }, { passive: true });
  // trascinamento col mouse
  let down = false, moved = false, sx = 0, sl0 = 0, lastX = 0, lastT = 0, vel = 0, pid = 0, dragged = 0;
  row.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse' || e.button !== 0 || !scrollable()) return;
    down = true; moved = false; sx = lastX = e.clientX; sl0 = row.scrollLeft; lastT = performance.now(); vel = 0; pid = e.pointerId;
  });
  row.addEventListener('pointermove', e => {
    if (!down) return;
    const dx = e.clientX - sx;
    if (!moved) {
      if (Math.abs(dx) < 6) return;
      moved = true; row.classList.add('drag'); try { row.setPointerCapture(pid); } catch (_) { /* niente */ }
    }
    const now = performance.now(); vel = (e.clientX - lastX) / Math.max(1, now - lastT); lastX = e.clientX; lastT = now;
    row.scrollLeft = sl0 - dx;
  });
  const up = () => {
    if (!down) return; down = false;
    if (!moved) return;
    dragged = performance.now();
    const it = items(); const base = it.length ? it[0].offsetLeft : 0;
    const i = nearest(it, row.scrollLeft - vel * 220);
    const target = Math.max(0, Math.min(row.scrollWidth - row.clientWidth, it[i] ? it[i].offsetLeft - base : 0));
    let done = false; const rel = () => { if (done) return; done = true; row.classList.remove('drag'); };
    if ('onscrollend' in window) row.addEventListener('scrollend', rel, { once: true });
    setTimeout(rel, 700);
    row.scrollTo({ left: target, behavior: 'smooth' });
  };
  row.addEventListener('pointerup', up); row.addEventListener('pointercancel', up); row.addEventListener('lostpointercapture', up);
  row.addEventListener('click', e => { if (dragged && performance.now() - dragged < 450) { e.preventDefault(); e.stopPropagation(); } }, true);
  row.addEventListener('dragstart', e => e.preventDefault());
  requestAnimationFrame(update);
  return api;
}

/* =====================================================
   03 LEZIONI · tre cartoline, la prossima evidenziata
   ===================================================== */
const CLASSES = [
  { d: 1, name: 'Ashtanga', from: '20:15', to: '21:45', orb: '#CF9A7D', desc: 'Una sequenza dinamica guidata dal respiro: forza, concentrazione, continuità.' },
  { d: 3, name: 'Yoga 360', from: '18:00', to: '19:30', orb: '#B48C71', desc: 'Una pratica completa, a 360 gradi: movimento, respiro e ascolto.' },
  { d: 4, name: 'Aerial yoga', from: null, to: null, orb: '#DDB096', desc: 'Con l\'amaca sospesa la schiena si alleggerisce e le inversioni diventano più accessibili.' }
];
const DAYN = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
let clsCtl = null;
safe(() => {
  const nextInfo = (() => {
    const now = new Date();
    for (let k = 0; k < 8; k++) {
      const day = new Date(now); day.setDate(now.getDate() + k);
      for (const c of CLASSES) {
        if (c.d !== day.getDay() || !c.from) continue;
        const [h, m] = c.from.split(':').map(Number); const t = new Date(day); t.setHours(h, m, 0, 0);
        if (t > now) return { c, t, k };
      }
    }
    return null;
  })();
  if (nextInfo) {
    const { c, t, k } = nextInfo;
    const rel = k === 0 ? 'oggi' : k === 1 ? 'domani' : `tra ${k} giorni`;
    $('#nextClass span').textContent = `Prossima: ${c.name}, ${DAYN[t.getDay()].toLowerCase()} alle ${c.from} (${rel})`;
  } else $('#nextClass').hidden = true;
  const row = $('#clsRow');
  row.innerHTML = CLASSES.map((c, i) => {
    const isNext = !!nextInfo && nextInfo.c === c, day = DAYN[c.d];
    const msg = `Ciao Chiara, vorrei venire a ${c.name} di ${day.toLowerCase()}${c.from ? ' alle ' + c.from : ''}.`;
    return `<a class="yc yc--col yc--cls${isNext ? ' is-next' : ''}" href="${wa(msg)}" target="_blank" rel="noopener" data-cur="Prenota" style="--orb:${c.orb}">`
      + `<i class="yc__orb"></i>${LINE(i, CLS_LINE[i % 3])}`
      + `<span class="yc__top"><span>${day}</span><span>${c.from ? `${c.from} – ${c.to}` : 'Orario da confermare'}</span></span>`
      + `<span><b class="yc__t">${esc(c.name)}</b><span class="yc__d">${esc(c.desc)}</span></span>${STAR}`
      + `<span class="yc__bot"><span class="yc__brand">${isNext ? '<i class="dot"></i>Prossima lezione' : 'Ribellula'}</span><span class="yc__chip">Prenota →</span></span></a>`;
  }).join('');
  setLens(row);
  clsCtl = makeRow(row, $('#clsCtl'));
  if (ANIM) G.from(row.children, { y: 50, opacity: 0, duration: 1, stagger: .1, ease: 'expo.out', scrollTrigger: { trigger: row, start: 'top 86%', once: true } });
});

/* =====================================================
   04 VIDEOTECA · catalogo in riga, filtri e ricerca
   ===================================================== */
const CATS = {
  all: { label: 'Tutte' },
  pratica: { label: 'Pratica', orb: '#CF9A7D' },
  inarcamenti: { label: 'Inarcamenti', orb: '#A9654C' },
  inversioni: { label: 'Inversioni', orb: '#B48C71' },
  somatics: { label: 'Somatics', orb: '#C2C6B4' },
  respiro: { label: 'Respiro', orb: '#DDB096' },
  teoria: { label: 'Teoria', orb: '#935B3F' }
};
const VIDEOS = [
  { c: 'inarcamenti', title: 'Inarcamenti senza pinza lombare', t: ['Inarcamenti', 'senza pinza'], min: 45, lvl: 'Intermedio', pack: false },
  { c: 'pratica', title: 'Ashtanga guidato', t: ['Ashtanga', 'guidato'], min: 75, lvl: 'Tutti i livelli', pack: true },
  { c: 'respiro', title: 'Respiro e ritmo', t: ['Respiro', 'e ritmo'], min: 20, lvl: 'Tutti i livelli', pack: false },
  { c: 'inversioni', title: 'Preparare le inversioni', t: ['Inversioni', 'primi passi'], min: 40, lvl: 'Intermedio', pack: true },
  { c: 'somatics', title: 'Somatics per la schiena', t: ['Somatics', 'schiena'], min: 35, lvl: 'Tutti i livelli', pack: false },
  { c: 'teoria', title: 'Quando il cervello dice no', t: ['Il cervello', 'dice no'], min: 60, lvl: 'Tutti i livelli', pack: true },
  { c: 'pratica', title: 'Yoga 360', t: ['Yoga', '360'], min: 60, lvl: 'Tutti i livelli', pack: true },
  { c: 'inversioni', title: 'Arm balance: il corvo', t: ['Arm', 'balance'], min: 30, lvl: 'Intermedio', pack: false },
  { c: 'inarcamenti', title: 'Aprire il petto', t: ['Aprire', 'il petto'], min: 30, lvl: 'Tutti i livelli', pack: true },
  { c: 'teoria', title: 'Gusto, sensi ed emozioni', t: ['Gusto', 'e sensi'], min: 25, lvl: 'Tutti i livelli', pack: false },
  { c: 'somatics', title: 'Movimento libero', t: ['Movimento', 'libero'], min: 30, lvl: 'Tutti i livelli', pack: false },
  { c: 'pratica', title: 'Pratica breve del mattino', t: ['Pratica', 'breve'], min: 15, lvl: 'Tutti i livelli', pack: true }
];
const DESC = {
  pratica: 'Una lezione completa da seguire a casa, con il ritmo del respiro come guida.',
  inarcamenti: 'Preparazioni, attivazioni e appoggi per aprire il petto senza caricare la zona lombare.',
  inversioni: 'Le basi per andare a testa in giù con calma: appoggi, forza e paura che si scioglie.',
  somatics: 'Movimenti lenti e consapevoli per ascoltare il corpo e lasciare andare la tensione.',
  respiro: 'Una pratica breve sul respiro, per cambiare ritmo quando la giornata corre troppo.',
  teoria: 'Un incontro tra filosofia dello yoga, neuroscienze e ayurveda, da ascoltare con calma.'
};
const vCard = (v, i) => {
  const C = CATS[v.c];
  return `<span class="yc yc--v" style="--orb:${C.orb}"><i class="yc__orb"></i>${LINE(i)}`
    + `<span class="yc__top"><span>${v.min} min</span><span>${C.label}</span></span>`
    + `<b class="yc__t">${esc(v.t[0])}<br>${esc(v.t[1])}</b>${STAR}`
    + `<span class="yc__brand">Ribellula</span><span class="yc__chip">${LOCK}${v.pack ? 'Pacchetto' : 'Abbonamento'}</span>`
    + `<span class="yc__play">${PLAY}</span></span>`;
};
const vRow = $('#vRow'), vCtlEl = $('#vCtl');
let vCtl = makeRow(null);
safe(() => {
  const tabs = $('#tabs'), ind = $('#tabsInd'), search = $('#vtSearch');
  vRow.innerHTML = VIDEOS.map((v, i) => `<article class="vc" data-i="${i}" data-c="${v.c}"><button class="vc__btn" type="button" data-cur="Guarda" aria-label="Anteprima: ${esc(v.title)}">${vCard(v, i)}<span class="vc__m"><span><b>${esc(v.title)}</b><small>${esc(v.lvl)}</small></span></span></button></article>`).join('');
  setLens(vRow);
  vCtl = makeRow(vRow, vCtlEl);
  const counts = { all: VIDEOS.length }; VIDEOS.forEach(v => { counts[v.c] = (counts[v.c] || 0) + 1; });
  Object.keys(CATS).forEach((k, i) => {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'tab'; b.dataset.f = k;
    b.setAttribute('role', 'tab'); b.setAttribute('aria-selected', String(!i));
    b.innerHTML = `${CATS[k].label}<sup>${counts[k] || 0}</sup>`; tabs.appendChild(b);
  });
  let vf = 'all', vq = '';
  const moveInd = (anim = true) => {
    const b = $(`.tab[data-f="${vf}"]`, tabs); if (!b) return; const p = { x: b.offsetLeft, width: b.offsetWidth };
    if (ANIM && anim) G.to(ind, { ...p, duration: .6, ease: 'expo.out' });
    else if (G) G.set(ind, p);
    else { ind.style.width = p.width + 'px'; ind.style.transform = `translateX(${p.x}px)`; }
  };
  const applyV = () => {
    const cards = $$('.vc', vRow); let n = 0;
    cards.forEach(c => {
      const v = VIDEOS[+c.dataset.i];
      const m = (vf === 'all' || v.c === vf) && (!vq || `${v.title} ${CATS[v.c].label} ${v.lvl}`.toLowerCase().includes(vq));
      c.classList.toggle('gone', !m); if (m) n++;
    });
    $('#vtEmpty').hidden = n > 0; vRow.hidden = !n; vCtlEl.hidden = !n;
    vCtl.reset();
    if (ANIM && n) G.fromTo(cards.filter(c => !c.classList.contains('gone')).slice(0, 4), { x: 60, opacity: 0 }, { x: 0, opacity: 1, duration: .8, stagger: .06, ease: 'expo.out', clearProps: 'transform,opacity' });
  };
  tabs.addEventListener('click', e => {
    const b = e.target.closest('.tab'); if (!b || b.dataset.f === vf) return; vf = b.dataset.f;
    $$('.tab', tabs).forEach(t => t.setAttribute('aria-selected', String(t === b))); moveInd(); applyV();
  });
  let sq; search.addEventListener('input', () => { clearTimeout(sq); sq = setTimeout(() => { vq = search.value.trim().toLowerCase(); applyV(); }, 160); });
  requestAnimationFrame(() => moveInd(false));
  addEventListener('resize', () => moveInd(false));
  if (document.fonts) document.fonts.ready.then(() => moveInd(false));
  const feat = $('#feat');
  const openFeat = () => openPlayer(VIDEOS[5], 5, $('.feat__media', feat), 'assets/img/feat.webp');
  feat.addEventListener('click', openFeat);
  feat.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openFeat(); } });
  vRow.addEventListener('click', e => { const b = e.target.closest('.vc__btn'); if (!b) return; const i = +b.closest('.vc').dataset.i; openPlayer(VIDEOS[i], i, $('.yc', b)); });
  if (ANIM) {
    G.from('.vt__t', { y: 40, opacity: 0, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: '.vt__t', start: 'top 88%', once: true } });
    // telefono: si raddrizza mentre scorri; numeri che contano; lezione in evidenza che si apre
    G.fromTo('#phone', { y: 90, rotation: 8 }, { y: -20, rotation: -4, ease: 'none', scrollTrigger: { trigger: '#phone', start: 'top bottom', end: 'bottom top', scrub: true } });
    G.from('#phone .ph-prog i', { scaleX: 0, duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: '#phone', start: 'top 70%', once: true } });
    G.from('#phone .ph-list li', { x: 30, opacity: 0, duration: .7, stagger: .12, ease: 'power3.out', scrollTrigger: { trigger: '#phone', start: 'top 70%', once: true } });
    G.from('.phone__seal', { scale: 2.2, opacity: 0, rotation: -40, duration: .8, delay: .5, ease: 'back.out(2)', scrollTrigger: { trigger: '#phone', start: 'top 72%', once: true } });
    $$('.vt__stats b').forEach(b => { const n = +b.dataset.n, o = { v: 0 }; G.to(o, { v: n, duration: 1.4, ease: 'power2.out', onUpdate: () => { b.textContent = Math.round(o.v); }, scrollTrigger: { trigger: '.vt__stats', start: 'top 88%', once: true } }); });
    G.fromTo('#feat .feat__media', { clipPath: 'inset(0% 0% 0% 100%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'expo.inOut', scrollTrigger: { trigger: '#feat', start: 'top 80%', once: true } });
    G.from('#feat .feat__in > *', { y: 34, opacity: 0, duration: 1, stagger: .08, delay: .35, ease: 'power3.out', scrollTrigger: { trigger: '#feat', start: 'top 80%', once: true } });
    G.set('#feat .feat__cred div', { '--ld': 0 });
    ScrollTrigger.create({ trigger: '#feat', start: 'top 70%', once: true, onEnter: () => $$('#feat .feat__cred div').forEach((d, i) => setTimeout(() => d.style.setProperty('--ld', 1), 700 + i * 140)) });
    G.from('#feat .feat__seal', { scale: 2.3, opacity: 0, rotation: -50, duration: .8, delay: 1.1, ease: 'back.out(2)', scrollTrigger: { trigger: '#feat', start: 'top 80%', once: true } });
    G.from('.vt__bar', { y: 24, opacity: 0, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: '.vt__bar', start: 'top 90%', once: true } });
    G.from($$('.vc', vRow).slice(0, 5), { x: 90, opacity: 0, duration: 1.1, stagger: .08, ease: 'expo.out', clearProps: 'transform,opacity', scrollTrigger: { trigger: vRow, start: 'top 86%', once: true } });
    G.from('.plan', { y: 70, opacity: 0, duration: 1.1, stagger: .12, ease: 'expo.out', scrollTrigger: { trigger: '.plans', start: 'top 80%', once: true } });
    G.from('.plan__seal', { scale: 2.1, opacity: 0, rotation: -30, duration: .8, delay: .55, ease: 'back.out(1.8)', scrollTrigger: { trigger: '.plans', start: 'top 80%', once: true } });
    G.from('.vt__area', { y: 40, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.vt__area', start: 'top 90%', once: true } });
  }
  // come funziona: i passi si accendono uno dopo l'altro
  const how = $$('#how li');
  if (ANIM) ScrollTrigger.create({ trigger: '#how', start: 'top 82%', once: true, onEnter: () => how.forEach((li, i) => setTimeout(() => li.classList.add('on'), 220 * i)) });
  else how.forEach(li => li.classList.add('on'));
});
// il segno a mano si disegna quando la cartolina entra nel riquadro (anche nelle righe orizzontali)
safe(() => {
  if (!('IntersectionObserver' in window)) { $$('.yc').forEach(c => c.classList.add('drawn')); return; }
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('drawn'); io.unobserve(e.target); } }), { threshold: .45 });
  $$('.yc').forEach(c => io.observe(c));
});

/* ---------------- finestre: anteprima, acquisto, area riservata ---------------- */
const player = $('#player'), plMedia = $('#plMedia'), sheet = $('#sheet'), area = $('#area');
let plTimer = null, plFrom = null;
const fmt = s => `0:${pad2(s)}`;
function openPlayer(v, i, fromEl, photo) {
  plFrom = fromEl;
  $('#plCat').textContent = CATS[v.c].label; $('#plTitle').textContent = v.title; $('#plDesc').textContent = DESC[v.c] + ' Anteprima di esempio.';
  $('#plMin').textContent = v.min + ' minuti'; $('#plLvl').textContent = v.lvl;
  plMedia.innerHTML = (photo ? `<img class="pl__photo" src="${photo}" alt=""><span class="yc__play">${PLAY}</span>` : vCard(v, i))
    + `<div class="pl__bar"><span id="plT">0:00</span><div class="pl__track"><i id="plTrack"></i></div><span>0:30</span></div>`
    + `<div class="pl__lock"><div><p class="eyebrow" style="color:rgba(246,227,207,.62);margin-bottom:12px">Fine dell'anteprima</p><h4>Ti è piaciuta? Continua la lezione.</h4><p>Con l'abbonamento vedi tutta la videoteca, con il pacchetto paghi una volta sola.</p><div class="row"><button class="btn btn--salmon" type="button" data-plan="Abbonamento mensile">Abbonamento</button><button class="btn btn--line" type="button" data-plan="Pacchetto lezioni">Pacchetto</button></div></div></div>`;
  setLens(plMedia); const ycp = $('.yc', plMedia); if (ycp) ycp.classList.add('drawn');
  player.classList.remove('playing', 'locked');
  player.showModal(); lock();
  if (ANIM && fromEl) {
    const a = fromEl.getBoundingClientRect(), b = player.getBoundingClientRect();
    G.fromTo(player, { clipPath: `inset(${a.top - b.top}px ${b.right - a.right}px ${b.bottom - a.bottom}px ${a.left - b.left}px round 20px)` }, { clipPath: 'inset(0px 0px 0px 0px round 24px)', duration: .85, ease: 'expo.inOut', clearProps: 'clipPath' });
    G.from('.pl__info > *', { y: 24, opacity: 0, duration: .6, stagger: .08, delay: .45, ease: 'power3.out' });
  }
}
const closePlayer = then => {
  clearInterval(plTimer);
  const fin = () => { player.close(); unlock(); if (then) then(); };
  if (ANIM && plFrom && player.open && !then) {
    const a = plFrom.getBoundingClientRect(), b = player.getBoundingClientRect();
    if (a.bottom > 0 && a.top < innerHeight && a.width > 0) {
      G.to(player, { clipPath: `inset(${a.top - b.top}px ${b.right - a.right}px ${b.bottom - a.bottom}px ${a.left - b.left}px round 20px)`, duration: .6, ease: 'expo.inOut', onComplete: () => { G.set(player, { clearProps: 'clipPath' }); fin(); } });
      return;
    }
  }
  fin();
};
plMedia.addEventListener('click', e => {
  if (e.target.closest('[data-plan]')) return;
  if (player.classList.contains('playing') || player.classList.contains('locked')) return;
  player.classList.add('playing');
  const t0 = Date.now(), D = 7000;
  const yc = $('.yc, .pl__photo', plMedia); if (ANIM && yc) G.to(yc, { scale: 1.06, duration: 7, ease: 'none' });
  const pb = $('.yc__play', plMedia); if (pb) pb.style.opacity = 0;
  plTimer = setInterval(() => {
    const k = Math.min(1, (Date.now() - t0) / D); $('#plTrack').style.width = (k * 100) + '%'; $('#plT').textContent = fmt(Math.round(k * 30));
    if (k >= 1) { clearInterval(plTimer); player.classList.add('locked'); }
  }, 100);
});
player.addEventListener('cancel', e => { e.preventDefault(); closePlayer(); });
player.addEventListener('click', e => { if (e.target === player || e.target.closest('[data-close]')) closePlayer(); });

let chosenPlan = 'Abbonamento mensile';
const openSheet = plan => {
  chosenPlan = plan; $('#sheetTitle').textContent = plan; sheet.classList.remove('ok');
  $('#payBtn').disabled = false; $('#payBtn').firstChild.textContent = 'Paga e accedi ';
  if (!sheet.open) { sheet.showModal(); lock(); requestAnimationFrame(() => requestAnimationFrame(() => sheet.classList.add('in'))); }
};
const closeSheet = instant => { sheet.classList.remove('in'); const f = () => { if (sheet.open) { sheet.close(); unlock(); } }; instant ? f() : setTimeout(f, 650); };
sheet.addEventListener('cancel', e => { e.preventDefault(); closeSheet(); });
sheet.addEventListener('click', e => { if (e.target === sheet || e.target.closest('[data-close]')) closeSheet(); });
document.addEventListener('click', e => {
  const b = e.target.closest('[data-plan]'); if (!b) return;
  if (player.open) { closePlayer(() => openSheet(b.dataset.plan)); return; }
  openSheet(b.dataset.plan);
});
$('#payForm').addEventListener('submit', e => {
  e.preventDefault(); const m = $('#payMail');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m.value.trim())) { m.focus(); m.style.borderColor = '#A33F2A'; toast('Scrivi un\'email valida, per esempio nome@email.it'); return; }
  m.style.borderColor = ''; const btn = $('#payBtn'); btn.disabled = true; btn.firstChild.textContent = 'Un attimo… ';
  setTimeout(() => {
    sheet.classList.add('ok');
    if (ANIM) G.fromTo('#doneSeal', { scale: 2.2, opacity: 0, rotation: -24 }, { scale: 1, opacity: 1, rotation: 0, duration: .9, ease: 'back.out(1.6)' });
  }, 1100);
});

// area riservata: come la vede chi si iscrive e come la vede Chiara
const MINE = [
  { t: 'Inarcamenti senza pinza lombare', w: 'Abbonamento', s: 'Pubblicata · 45 min' },
  { t: 'Ashtanga guidato', w: 'Abbonamento e pacchetto', s: 'Pubblicata · 75 min · registrazione Zoom' },
  { t: 'Yoga 360', w: 'Pacchetto', s: 'Pubblicata · 60 min · registrazione Zoom' },
  { t: 'Respiro e ritmo', w: 'Abbonamento', s: 'Pubblicata · 20 min' }
];
const mineRender = () => { $('#mine').innerHTML = MINE.map(m => `<li><span>${esc(m.t)}</span><span class="badge2${m.n ? ' new' : ''}">${m.n ? 'Nuova · ' : ''}${esc(m.w)}</span><small>${esc(m.s)}</small></li>`).join(''); };
const setView = v => {
  $$('.area__tabs button').forEach(b => b.setAttribute('aria-selected', String(b.dataset.view === v)));
  $$('.area__view').forEach(s => { s.hidden = s.dataset.view !== v; });
  area.scrollTop = 0;
  if (ANIM) G.from($$(`.area__view[data-view="${v}"] .box`), { y: 30, opacity: 0, duration: .7, stagger: .07, ease: 'power3.out' });
};
const openArea = (view = 'me') => {
  if (sheet.open) closeSheet(true);
  closeMenu();
  $('#areaPlan').textContent = chosenPlan;
  const em = $('#payMail').value.trim(); $('#areaInit').textContent = em ? em[0].toUpperCase() : 'T';
  $('#invDate').textContent = 'Fattura del ' + new Date().toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });
  $('#areaCont').innerHTML = [[0, 64], [1, 22]].map(([i, p]) => `<div>${vCard(VIDEOS[i], i)}<div class="bar"><i style="width:${p}%"></i></div><p>${esc(VIDEOS[i].title)}</p><small>Ti mancano ${Math.round(VIDEOS[i].min * (100 - p) / 100)} minuti</small></div>`).join('');
  setLens($('#areaCont')); $$('#areaCont .yc').forEach(c => c.classList.add('drawn'));
  mineRender();
  if (!area.open) { area.showModal(); lock(); requestAnimationFrame(() => requestAnimationFrame(() => area.classList.add('in'))); }
  setView(view);
  if (ANIM && view === 'me') G.from('#areaCont .bar i', { width: 0, duration: 1.4, delay: .4, ease: 'expo.out', stagger: .15 });
};
const closeArea = () => { area.classList.remove('in'); setTimeout(() => { if (area.open) { area.close(); unlock(); } }, 500); };
document.addEventListener('click', e => { const b = e.target.closest('[data-area]'); if (b) { e.preventDefault(); openArea(b.dataset.area || 'me'); } });
$$('.area__tabs button').forEach(b => b.addEventListener('click', () => setView(b.dataset.view)));
area.addEventListener('cancel', e => { e.preventDefault(); closeArea(); });
area.addEventListener('click', e => { if (e.target.closest('[data-close]')) closeArea(); });
$('#invBtn').addEventListener('click', () => toast('Esempio: qui si scarica la fattura in PDF'));
// Chiara carica i video da sola (simulato)
safe(function upload() {
  const dz = $('#dropZ'), form = $('#upForm'), bar = $('#upBar'), pct = $('#upPct'), pub = $('#upPublish');
  const picker = document.createElement('input'); picker.type = 'file'; picker.accept = 'video/*'; picker.id = 'upFile'; picker.hidden = true; dz.after(picker);
  let timer = null;
  const start = name => {
    $('#upName').textContent = name || 'registrazione-zoom.mp4';
    dz.hidden = true; form.classList.add('on'); pub.disabled = true; bar.style.width = '0%'; pct.textContent = '0%';
    const t0 = Date.now(), D = 2400; clearInterval(timer);
    timer = setInterval(() => { const k = Math.min(1, (Date.now() - t0) / D); bar.style.width = (k * 100) + '%'; pct.textContent = Math.round(k * 100) + '%'; if (k >= 1) { clearInterval(timer); pct.textContent = 'Caricato'; pub.disabled = false; } }, 60);
  };
  dz.addEventListener('click', () => picker.click());
  picker.addEventListener('change', () => { if (picker.files && picker.files[0]) start(picker.files[0].name); });
  dz.addEventListener('dragover', e => { e.preventDefault(); dz.classList.add('over'); });
  dz.addEventListener('dragleave', () => dz.classList.remove('over'));
  dz.addEventListener('drop', e => { e.preventDefault(); dz.classList.remove('over'); const f = e.dataTransfer && e.dataTransfer.files[0]; start(f ? f.name : ''); });
  pub.addEventListener('click', () => {
    const t = $('#upTitle').value.trim() || 'Nuova lezione'; const w = $('input[name="where"]:checked').value;
    MINE.unshift({ t, w, s: 'Pubblicata adesso · visibile subito a chi ha accesso', n: 1 }); mineRender();
    if (ANIM) G.from('#mine li:first-child', { y: -16, opacity: 0, duration: .7, ease: 'power3.out' });
    toast(`Pubblicata: ${t}`);
    form.classList.remove('on'); dz.hidden = false; picker.value = '';
  });
});

/* =====================================================
   APPUNTI · cartoline con il timbro e petali che cadono
   ===================================================== */
safe(() => {
  const row = $('#nRow');
  makeRow(row, $('#nCtl'));
  if (fine) row.dataset.cur = 'Trascina';
  if (!ANIM) return;
  G.from($$('.note', row), { x: 90, opacity: 0, duration: 1.1, stagger: .08, ease: 'expo.out', clearProps: 'transform,opacity', scrollTrigger: { trigger: row, start: 'top 86%', once: true } });
  const seals = $$('.note__seal', row); G.set(seals, { opacity: 0 });
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return; io.unobserve(e.target);
    const s = $('.note__seal', e.target), r = parseFloat(getComputedStyle(e.target).getPropertyValue('--sr')) || 10;
    G.fromTo(s, { scale: 2.4, opacity: 0, rotation: r - 40 }, { scale: 1, opacity: 1, rotation: r, duration: .75, delay: .25, ease: 'back.out(2.2)' });
  }), { threshold: .6 });
  $$('.note', row).forEach(n => io.observe(n));
  G.fromTo('#branchWrap', { y: -30 }, { y: 70, ease: 'none', scrollTrigger: { trigger: '#appunti', start: 'top bottom', end: 'bottom top', scrub: true } });
  // petali: cadono mentre la sezione passa sullo schermo
  const box = $('#petals'); let seed = 11; const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  const n = isMob() ? 8 : 14, P = [];
  for (let i = 0; i < n; i++) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    el.setAttribute('viewBox', '0 0 20 24'); el.setAttribute('class', 'petal'); el.innerHTML = '<use href="#petalShape"/>';
    el.style.setProperty('--w', (15 + rnd() * 14).toFixed(1) + 'px'); box.appendChild(el);
    P.push({ el, x0: .55 + rnd() * .42, y0: .02 + rnd() * .2, dx: .3 + rnd() * .45, dy: .7 + rnd() * .3, amp: 18 + rnd() * 46, ph: rnd() * 6.28, rot: (rnd() > .5 ? 1 : -1) * (200 + rnd() * 320), r0: rnd() * 360, p0: (i / n) * .72 + rnd() * .05, span: .26 + rnd() * .12, fl: 2 + rnd() * 3, vis: false });
  }
  let W = 0, H = 0; const measure = () => { W = box.clientWidth; H = box.clientHeight; };
  measure(); ScrollTrigger.addEventListener('refresh', measure);
  const upd = p => P.forEach(o => {
    const t = (p - o.p0) / o.span;
    if (t <= 0 || t >= 1) { if (o.vis) { o.el.style.opacity = 0; o.vis = false; } return; }
    o.vis = true;
    const x = (o.x0 - o.dx * t) * W + Math.sin(t * Math.PI * 2 + o.ph) * o.amp, y = (o.y0 + o.dy * t) * H;
    const sy = .45 + .55 * Math.abs(Math.cos(t * Math.PI * o.fl + o.ph));
    o.el.style.opacity = (Math.min(1, t / .1, (1 - t) / .14) * .95).toFixed(3);
    o.el.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) rotate(${(o.r0 + o.rot * t).toFixed(1)}deg) scaleY(${sy.toFixed(3)})`;
  });
  ScrollTrigger.create({ trigger: '#appunti', start: 'top 80%', end: 'bottom 20%', onUpdate: s => upd(s.progress) });
});

/* ---------------- decorazioni: i cerchi si disegnano, i rametti si posano ---------------- */
if (ANIM) safe(() => {
  $$('.deco-ring').forEach((r, i) => {
    const c = $('circle', r); G.set(c, { strokeDashoffset: 100, strokeDasharray: r.classList.contains('r2') ? '1.2 1.6' : 100 });
    if (r.classList.contains('r2')) { G.set(c, { strokeDashoffset: 0 }); G.fromTo(r, { rotation: -60, opacity: 0 }, { rotation: 20, opacity: 1, ease: 'none', scrollTrigger: { trigger: r.closest('section'), start: 'top 85%', end: 'bottom 20%', scrub: 1 } }); return; }
    G.fromTo(c, { strokeDashoffset: 100 }, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: r.closest('section'), start: 'top 80%', end: 'top 10%', scrub: 1 } });
    G.fromTo(r, { rotation: -30 }, { rotation: 30, ease: 'none', scrollTrigger: { trigger: r.closest('section'), start: 'top bottom', end: 'bottom top', scrub: true } });
  });
  G.from('.deco--faq .deco-sprig', { rotation: -50, x: 60, y: -40, opacity: 0, duration: 1.4, ease: 'back.out(1.4)', scrollTrigger: { trigger: '#faq', start: 'top 55%', once: true } });
  G.from('.vt__seal', { scale: 2.2, opacity: 0, rotation: -60, duration: .8, ease: 'back.out(2)', scrollTrigger: { trigger: '.vt__area', start: 'top 85%', once: true } });
  G.from('.vt__sprig', { rotation: -40, y: -30, opacity: 0, duration: 1.2, delay: .2, ease: 'back.out(1.4)', scrollTrigger: { trigger: '.vt__area', start: 'top 85%', once: true } });
});

/* ---------------- domande e fiori ---------------- */
$('#faqBtn').addEventListener('click', () => {
  const m = $('#faqMore'), b = $('#faqBtn'); const o = !m.classList.contains('open');
  m.classList.toggle('open', o); b.classList.toggle('is-open', o); b.setAttribute('aria-expanded', String(o));
  $('span', b).textContent = o ? 'Meno domande' : 'Altre domande';
  if (o && ANIM) G.from($$('.qa', m), { y: 24, opacity: 0, duration: .7, stagger: .08, ease: 'power3.out', delay: .1 });
});
if (ANIM) safe(() => {
  G.from('#faqList > .qa', { y: 26, opacity: 0, duration: .8, stagger: .07, ease: 'power3.out', scrollTrigger: { trigger: '#faqList', start: 'top 85%', once: true } });
  G.fromTo('#orchid', { rotation: -14, y: 40 }, { rotation: 10, y: -30, ease: 'none', scrollTrigger: { trigger: '#faq', start: 'top bottom', end: 'bottom top', scrub: true } });
  G.from('#orchid img', { scale: .55, opacity: 0, rotation: -50, duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: '#faq', start: 'top 72%', once: true } });
  G.from('#corsage', { y: -90, x: 50, rotation: 60, scale: 1.3, opacity: 0, duration: 1.3, ease: 'back.out(1.3)', scrollTrigger: { trigger: '.letter-wrap', start: 'top 80%', once: true } });
  G.from('.clist li', { y: 24, opacity: 0, duration: .8, stagger: .08, ease: 'power3.out', scrollTrigger: { trigger: '.clist', start: 'top 88%', once: true } });
  G.from('#letter', { y: 60, rotationX: -10, transformPerspective: 1200, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.letter-wrap', start: 'top 85%', once: true } });
});

/* =====================================================
   05 CONTATTI · la lettera che diventa un messaggio WhatsApp
   ===================================================== */
const letterText = () => {
  const msg = $('#lMsg').value.trim(), name = $('#lName').value.trim();
  const ints = $$('.chip input:checked').map(i => i.value);
  if (!msg && !ints.length) return null;
  return `Cara Chiara,\n${msg || 'vorrei avere qualche informazione.'}` + (ints.length ? `\n\nMi interessa: ${ints.join(', ')}.` : '') + (name ? `\n\n${name}` : '');
};
const syncLetter = () => { $('#letterSend').href = wa(letterText() || 'Ciao Chiara, vorrei qualche informazione.'); };
['input', 'change'].forEach(ev => $('#letter').addEventListener(ev, syncLetter)); syncLetter();
$('#letter').addEventListener('submit', e => { e.preventDefault(); $('#letterSend').focus(); });
$('#letterSend').addEventListener('click', e => {
  if (!letterText()) { e.preventDefault(); $('#lMsg').focus(); toast('Scrivi due righe o scegli cosa ti interessa'); return; }
  if (!ANIM) { toast('Si apre WhatsApp con la tua lettera'); return; }
  G.to('#corsage', { y: -18, rotation: '+=10', duration: .3, yoyo: true, repeat: 1, ease: 'power2.out' });
  G.timeline()
    .to('#letter', { rotationX: 14, scaleY: .62, y: 30, duration: .55, ease: 'power3.in' })
    .fromTo('#letterSeal', { opacity: 0, scale: 2.2, rotation: -30 }, { opacity: 1, scale: 1, rotation: 0, duration: .6, ease: 'back.out(1.8)' })
    .to('#sent', { opacity: 1, duration: .5 }, '-=.2')
    .to('#letterSeal', { opacity: 0, duration: .4 }, '+=1.6')
    .to('#letter', { rotationX: 0, scaleY: 1, y: 0, duration: .8, ease: 'expo.out' })
    .to('#sent', { opacity: 0, duration: .4 }, '+=1.2');
});

/* ---------------- cursore ---------------- */
const cur = $('#cur'), curLabel = $('#curLabel');
function bindCursor(scope) {
  if (!fine || !G) return;
  $$('[data-cur]', scope).forEach(el => {
    if (el._cur) return; el._cur = 1;
    el.addEventListener('pointerenter', () => { curLabel.textContent = el.dataset.cur; cur.classList.add('is-label'); });
    el.addEventListener('pointerleave', () => {
      const p = el.parentElement && el.parentElement.closest('[data-cur]');
      if (p) curLabel.textContent = p.dataset.cur; else cur.classList.remove('is-label');
    });
  });
}
if (fine && G) safe(() => {
  const ring = $('.cur__ring', cur), dot = $('.cur__dot', cur);
  const rx = G.quickTo(ring, 'x', { duration: .55, ease: 'power3.out' }), ry = G.quickTo(ring, 'y', { duration: .55, ease: 'power3.out' });
  const dx = G.quickTo(dot, 'x', { duration: .12 }), dy = G.quickTo(dot, 'y', { duration: .12 });
  let shown = false;
  addEventListener('pointermove', e => { if (!shown) { shown = true; G.to(cur, { opacity: 1, duration: .4 }); } rx(e.clientX); ry(e.clientY); dx(e.clientX); dy(e.clientY); });
  document.addEventListener('pointerleave', () => G.to(cur, { opacity: 0, duration: .3 }));
  document.addEventListener('pointerenter', () => G.to(cur, { opacity: 1, duration: .3 }));
  bindCursor(document);
  // pulsanti magnetici
  $$('.btn--salmon, .btn--ink').forEach(b => {
    b.addEventListener('pointermove', e => { const r = b.getBoundingClientRect(); G.to(b, { x: (e.clientX - r.left - r.width / 2) * .22, y: (e.clientY - r.top - r.height / 2) * .3, duration: .5, ease: 'power3.out' }); });
    b.addEventListener('pointerleave', () => G.to(b, { x: 0, y: 0, duration: .8, ease: 'elastic.out(1,.4)' }));
  });
});

/* ---------------- ricalcolo quando cambia l'altezza della pagina ---------------- */
if (G && window.ScrollTrigger) safe(() => {
  // aprire domande o fisarmoniche allunga la pagina: ricalcolo i punti di partenza delle animazioni più in basso
  let lastH = 0, rt = null;
  const ro = new ResizeObserver(() => {
    const h = document.documentElement.scrollHeight; if (Math.abs(h - lastH) < 2) return; lastH = h;
    clearTimeout(rt); rt = setTimeout(() => ScrollTrigger.refresh(), 260);
  });
  $$('main > section:not(.hero)').forEach(s => ro.observe(s));
  if (document.fonts) document.fonts.ready.then(() => { ScrollTrigger.refresh(); if (clsCtl) clsCtl.update(); vCtl.update(); });
  addEventListener('load', () => ScrollTrigger.refresh());
});
})();
