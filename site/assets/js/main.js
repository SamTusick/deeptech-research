/* ============================================================
   FGCU DEEPTECH — GROUND SYSTEMS SCRIPT
   No dependencies. No build step. Progressive enhancement:
   every module bails cleanly if its markup isn't on the page.
   ============================================================ */
(function () {
  'use strict';

  /* ----------------------------------------------------------
     CONFIG — the two values you will actually want to edit.
     LAUNCH_ISO drives the countdown on every page.
     ---------------------------------------------------------- */
  var LAUNCH_ISO = '2026-11-14T13:00:00-05:00'; // AQUILA-1 first flight, target T-0
  var SITE_LAT = '26.4637';
  var SITE_LON = '-81.7748';

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ========================================================
     01 / STARFIELD
     Three parallax depth layers + two slow nebula lobes in
     the brand hues, drifting downward so the page reads as
     ascent. Mouse and scroll both shift the field.
     ======================================================== */
  function starfield() {
    var cv = document.getElementById('starfield');
    if (!cv) return;
    var ctx = cv.getContext('2d', { alpha: true });
    if (!ctx) return;

    var W = 0, H = 0, dpr = 1;
    var stars = [], lobes = [], meteor = null;
    var mx = 0, my = 0, tx = 0, ty = 0, sy = 0, t = 0, raf = null;

    var LAYERS = [
      { n: 0.00022, r: [0.35, 0.75], a: [0.22, 0.45], v: 0.012, p: 0.010 },
      { n: 0.00013, r: [0.55, 1.05], a: [0.35, 0.65], v: 0.024, p: 0.024 },
      { n: 0.00005, r: [0.85, 1.65], a: [0.55, 0.95], v: 0.045, p: 0.048 }
    ];

    function build() {
      var r = cv.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = r.width; H = r.height;
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      stars = [];
      LAYERS.forEach(function (L, li) {
        var count = Math.round(W * H * L.n);
        for (var i = 0; i < count; i++) {
          stars.push({
            x: Math.random() * W,
            y: Math.random() * H,
            r: L.r[0] + Math.random() * (L.r[1] - L.r[0]),
            a: L.a[0] + Math.random() * (L.a[1] - L.a[0]),
            v: L.v, p: L.p, l: li,
            // twinkle phase; only the brightest layer twinkles noticeably
            tw: Math.random() * Math.PI * 2,
            ts: 0.4 + Math.random() * 1.1
          });
        }
      });

      lobes = [
        { x: W * 0.78, y: H * 0.16, r: Math.max(W, H) * 0.52, c: [0, 45, 114],  a: 0.20, dx: 0.0045, dy: 0.0022 },
        { x: W * 0.14, y: H * 0.82, r: Math.max(W, H) * 0.42, c: [0, 119, 73],  a: 0.13, dx: -0.0035, dy: -0.0018 },
        { x: W * 0.46, y: H * 0.52, r: Math.max(W, H) * 0.30, c: [58, 120, 232], a: 0.07, dx: 0.0025, dy: -0.003 }
      ];
    }

    function paintLobes() {
      for (var i = 0; i < lobes.length; i++) {
        var L = lobes[i];
        var x = L.x + Math.sin(t * L.dx) * W * 0.06;
        var y = L.y + Math.cos(t * L.dy) * H * 0.05;
        var g = ctx.createRadialGradient(x, y, 0, x, y, L.r);
        g.addColorStop(0, 'rgba(' + L.c.join(',') + ',' + L.a + ')');
        g.addColorStop(0.55, 'rgba(' + L.c.join(',') + ',' + (L.a * 0.28).toFixed(3) + ')');
        g.addColorStop(1, 'rgba(' + L.c.join(',') + ',0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
      }
    }

    function paintStars() {
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        // drift downward, wrap at the bottom edge
        s.y += s.v;
        if (s.y > H + 2) { s.y = -2; s.x = Math.random() * W; }

        var ox = tx * s.p * 44;
        var oy = ty * s.p * 34 + sy * s.p * 0.55;
        var y = ((s.y + oy) % (H + 4) + (H + 4)) % (H + 4);
        var a = s.a;
        if (s.l === 2) a *= 0.72 + Math.sin(t * 0.02 * s.ts + s.tw) * 0.28;

        ctx.beginPath();
        ctx.arc(s.x + ox, y, s.r, 0, 6.2832);
        ctx.fillStyle = 'rgba(214,228,255,' + a.toFixed(3) + ')';
        ctx.fill();

        // the few largest stars get a soft bloom
        if (s.r > 1.35) {
          ctx.beginPath();
          ctx.arc(s.x + ox, y, s.r * 3.4, 0, 6.2832);
          ctx.fillStyle = 'rgba(143,182,255,' + (a * 0.08).toFixed(3) + ')';
          ctx.fill();
        }
      }
    }

    function paintMeteor() {
      if (!meteor) {
        if (Math.random() < 0.0016) {
          meteor = {
            x: Math.random() * W * 0.7 + W * 0.25,
            y: Math.random() * H * 0.45,
            len: 90 + Math.random() * 130,
            sp: 6 + Math.random() * 5,
            life: 1
          };
        }
        return;
      }
      var m = meteor;
      m.x -= m.sp; m.y += m.sp * 0.42; m.life -= 0.012;
      if (m.life <= 0 || m.x < -m.len) { meteor = null; return; }

      var g = ctx.createLinearGradient(m.x, m.y, m.x + m.len, m.y - m.len * 0.42);
      g.addColorStop(0, 'rgba(226,240,255,' + (0.85 * m.life).toFixed(3) + ')');
      g.addColorStop(1, 'rgba(226,240,255,0)');
      ctx.strokeStyle = g; ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.moveTo(m.x, m.y);
      ctx.lineTo(m.x + m.len, m.y - m.len * 0.42);
      ctx.stroke();
    }

    function frame() {
      t += 1;
      tx += (mx - tx) * 0.045;
      ty += (my - ty) * 0.045;
      ctx.clearRect(0, 0, W, H);
      paintLobes();
      paintStars();
      paintMeteor();
      raf = requestAnimationFrame(frame);
    }

    function still() {
      ctx.clearRect(0, 0, W, H);
      paintLobes();
      paintStars();
    }

    build();
    if (reduced) { still(); }
    else { raf = requestAnimationFrame(frame); }

    var rt;
    window.addEventListener('resize', function () {
      clearTimeout(rt);
      rt = setTimeout(function () { build(); if (reduced) still(); }, 180);
    });

    if (!reduced) {
      window.addEventListener('pointermove', function (e) {
        mx = (e.clientX / window.innerWidth) * 2 - 1;
        my = (e.clientY / window.innerHeight) * 2 - 1;
      }, { passive: true });

      window.addEventListener('scroll', function () {
        sy = window.scrollY * 0.06;
      }, { passive: true });

      // don't burn cycles in a background tab
      document.addEventListener('visibilitychange', function () {
        if (document.hidden) { cancelAnimationFrame(raf); raf = null; }
        else if (!raf) { raf = requestAnimationFrame(frame); }
      });
    }
  }

  /* ========================================================
     02 / COUNTDOWN
     Feeds the hero clock and the compact strip readout.
     ======================================================== */
  function countdown() {
    var box = $('[data-cdown]');
    var strip = $('#strip-t');
    if (!box && !strip) return;

    var target = new Date(LAUNCH_ISO).getTime();
    var segs = box ? {
      d: $('[data-seg="d"]', box), h: $('[data-seg="h"]', box),
      m: $('[data-seg="m"]', box), s: $('[data-seg="s"]', box)
    } : null;
    var state = box ? $('[data-cstate]', box) : null;
    var pad = function (n, w) { return String(Math.max(0, n)).padStart(w || 2, '0'); };

    function tick() {
      var ms = target - Date.now();
      var past = ms < 0;
      if (past) ms = -ms;

      var d = Math.floor(ms / 86400000);
      var h = Math.floor(ms / 3600000) % 24;
      var m = Math.floor(ms / 60000) % 60;
      var s = Math.floor(ms / 1000) % 60;

      if (segs && segs.d) {
        segs.d.textContent = pad(d, 3);
        segs.h.textContent = pad(h);
        segs.m.textContent = pad(m);
        segs.s.textContent = pad(s);
      }
      if (state) {
        state.textContent = past ? 'T-PLUS — FLIGHT COMPLETE' : 'COUNT PROCEEDING';
      }
      if (strip) {
        strip.textContent = (past ? 'T+' : 'T-') + pad(d, 3) + ':' + pad(h) + ':' + pad(m) + ':' + pad(s);
      }
    }
    tick();
    setInterval(tick, 1000);
  }

  /* ========================================================
     03 / HEADER + DRAWER
     ======================================================== */
  function chrome() {
    var hdr = $('.hdr');
    if (hdr) {
      var onScroll = function () {
        hdr.classList.toggle('is-stuck', window.scrollY > 12);
      };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    var burger = $('.burger');
    var drawer = $('.drawer');
    if (!burger || !drawer) return;

    var toggle = function (open) {
      document.body.classList.toggle('menu-open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
      document.body.style.overflow = open ? 'hidden' : '';
    };
    toggle(false);

    burger.addEventListener('click', function () {
      toggle(!document.body.classList.contains('menu-open'));
    });
    $$('a', drawer).forEach(function (a) {
      a.addEventListener('click', function () { toggle(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && document.body.classList.contains('menu-open')) toggle(false);
    });
  }

  /* ========================================================
     04 / REVEAL ON SCROLL
     ======================================================== */
  function reveal() {
    var items = $$('[data-rv]');
    if (!items.length) return;
    if (reduced || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('rv-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('rv-in');
        io.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ========================================================
     05 / SCROLL TELEMETRY RAIL
     Scroll depth read as an altitude gauge.
     ======================================================== */
  function telemetry() {
    var rail = $('.telem');
    if (!rail) return;
    var bar = $('.telem__bar b', rail);
    var val = $('.telem__val', rail);

    var update = function () {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (bar) bar.style.height = (p * 100).toFixed(1) + '%';
      if (val) val.textContent = String(Math.round(p * 100)).padStart(3, '0') + '%';
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
  }

  /* ========================================================
     06 / DIVISION CONSOLE
     Rows drive a single detail pane. Without JS every pane
     stays in the document, stacked and readable.
     ======================================================== */
  function divisions() {
    var list = $('.divs__list');
    var panel = $('.divs__panel');
    if (!list || !panel) return;

    var rows = $$('.divs__row', list);
    var panes = $$('[data-pane]', panel);
    if (!rows.length || !panes.length) return;

    var show = function (key) {
      panes.forEach(function (p) {
        var on = p.getAttribute('data-pane') === key;
        p.hidden = !on;
        if (on && !reduced) {
          p.classList.remove('divs__fade');
          void p.offsetWidth;   // restart the transition
          p.classList.add('divs__fade');
        }
      });
      rows.forEach(function (r) {
        var on = r.getAttribute('data-div') === key;
        r.classList.toggle('is-on', on);
        r.setAttribute('aria-selected', on ? 'true' : 'false');
      });
    };

    rows.forEach(function (r) {
      var key = r.getAttribute('data-div');
      r.addEventListener('mouseenter', function () { show(key); });
      r.addEventListener('focus', function () { show(key); });
      r.addEventListener('click', function () { show(key); });
    });

    show(rows[0].getAttribute('data-div'));
  }

  /* ========================================================
     07 / DECODE HEADLINE
     One pass, on load only. Glyphs settle left to right.
     ======================================================== */
  function decode() {
    var els = $$('[data-decode]');
    if (!els.length || reduced) return;
    var GLYPH = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/\\<>#*+=-';

    els.forEach(function (el, idx) {
      var final = el.textContent;
      var chars = final.split('');
      var frame = 0;
      var settleAt = chars.map(function (_, i) { return 5 + i * 1.5 + Math.random() * 8; });

      var run = function () {
        var out = '', done = 0;
        for (var i = 0; i < chars.length; i++) {
          if (chars[i] === ' ') { out += ' '; done++; continue; }
          if (frame >= settleAt[i]) { out += chars[i]; done++; }
          else { out += GLYPH[Math.floor(Math.random() * GLYPH.length)]; }
        }
        el.textContent = out;
        frame++;
        if (done < chars.length) requestAnimationFrame(run);
        else el.textContent = final;
      };
      setTimeout(run, 140 + idx * 110);
    });
  }

  /* ========================================================
     08 / TRAJECTORY DRAW
     Flight profile that inks itself in as you scroll past it.
     ======================================================== */
  function trajectory() {
    var wraps = $$('.traj');
    if (!wraps.length) return;

    wraps.forEach(function (w) {
      var path = $('.path', w);
      if (!path) return;
      var len = path.getTotalLength();
      path.style.setProperty('--len', len);

      if (reduced) { path.style.strokeDashoffset = 0; return; }

      var marks = $$('.mk', w);

      var update = function () {
        var r = w.getBoundingClientRect();
        var vh = window.innerHeight;
        // 0 when the panel's top hits 85% of the viewport, 1 when it clears 35%
        var p = (vh * 0.85 - r.top) / Math.max(1, r.height * 0.75);
        p = Math.min(1, Math.max(0, p));
        path.style.strokeDashoffset = len * (1 - p);
        marks.forEach(function (m, i) {
          m.style.opacity = p > (i + 0.55) / (marks.length + 0.4) ? 1 : 0.12;
        });
      };
      update();
      window.addEventListener('scroll', update, { passive: true });
      window.addEventListener('resize', update);
    });
  }

  /* ========================================================
     09 / COORDINATE READOUT
     ======================================================== */
  function coords() {
    var el = $('#strip-pos');
    if (!el) return;
    el.textContent = SITE_LAT + '°N ' + Math.abs(SITE_LON) + '°W';
  }

  /* ---- boot ---------------------------------------------- */
  function boot() {
    starfield(); countdown(); chrome(); reveal();
    telemetry(); divisions(); decode(); trajectory(); coords();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else { boot(); }
})();
