/* ==========================================================================
   animation.js — parallax, tilt, marquee builder, SVG chart drawing
   ========================================================================== */
(function (global) {
  'use strict';

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* -------------------------------------------------------- parallax */
  function initParallax() {
    if (reduced) return;
    var els = document.querySelectorAll('[data-parallax]');
    if (!els.length) return;
    var ticking = false;
    function update() {
      var vh = window.innerHeight;
      els.forEach(function (el) {
        var speed = parseFloat(el.dataset.parallax) || 0.2;
        var r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        var progress = (r.top + r.height / 2 - vh / 2) / vh;
        el.style.transform = 'translateY(' + (progress * speed * -100) + 'px)';
      });
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }

  /* --------------------------------------------------------- 3D tilt */
  function initTilt() {
    if (reduced || !window.matchMedia('(hover: hover)').matches) return;
    document.querySelectorAll('[data-tilt]').forEach(function (el) {
      var strength = parseFloat(el.dataset.tilt) || 6;
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = 'perspective(900px) rotateY(' + (x * strength) + 'deg) rotateX(' + (-y * strength) + 'deg) translateY(-4px)';
      });
      el.addEventListener('mouseleave', function () {
        el.style.transform = '';
      });
    });
  }

  /* ------------------------------------------------------ marquee dup */
  function initMarquee() {
    document.querySelectorAll('.ribbon__track').forEach(function (track) {
      if (track.dataset.duped) return;
      track.dataset.duped = '1';
      track.innerHTML += track.innerHTML; /* seamless loop */
    });
  }

  /* =================================================== chart builders */

  /** Animated bar chart. items: [{label, value, tip?}] */
  function barChart(host, items, opts) {
    host = typeof host === 'string' ? document.querySelector(host) : host;
    if (!host) return;
    opts = opts || {};
    var max = Math.max.apply(null, items.map(function (i) { return i.value; })) || 1;
    host.innerHTML = '<div class="bars">' + items.map(function (i, idx) {
      return '<div class="bar-col">' +
        '<div class="bar' + (opts.alt && idx % 2 ? ' bar--lav' : '') + '" data-h="' + Math.round((i.value / max) * 100) + '" role="img" aria-label="' + i.label + ': ' + (i.tip || i.value) + '">' +
        '<span class="bar__tip">' + (i.tip || i.value) + '</span></div>' +
        '<span>' + i.label + '</span></div>';
    }).join('') + '</div>';

    var bars = host.querySelectorAll('.bar');
    function grow() {
      bars.forEach(function (b, i) {
        setTimeout(function () { b.style.height = b.dataset.h + '%'; }, i * 70);
      });
    }
    if ('IntersectionObserver' in window) {
      var obs = new IntersectionObserver(function (en) {
        if (en[0].isIntersecting) { grow(); obs.disconnect(); }
      }, { threshold: 0.3 });
      obs.observe(host);
    } else grow();
  }

  /** SVG line/area chart. series: [{name, color, values[]}], labels[] */
  function lineChart(host, labels, series, opts) {
    host = typeof host === 'string' ? document.querySelector(host) : host;
    if (!host) return;
    opts = opts || {};
    var W = 620, H = 240, PAD = 34;
    var all = [];
    series.forEach(function (s) { all = all.concat(s.values); });
    var max = Math.max.apply(null, all) * 1.15 || 1;

    function pt(i, v) {
      var x = PAD + (i / (labels.length - 1)) * (W - PAD * 2);
      var y = H - PAD - (v / max) * (H - PAD * 2);
      return [Math.round(x * 10) / 10, Math.round(y * 10) / 10];
    }

    var grid = '';
    for (var g = 0; g <= 4; g++) {
      var gy = PAD + (g / 4) * (H - PAD * 2);
      grid += '<line class="grid-line" x1="' + PAD + '" y1="' + gy + '" x2="' + (W - PAD) + '" y2="' + gy + '"/>';
      grid += '<text class="axis-label" x="' + (PAD - 8) + '" y="' + (gy + 3) + '" text-anchor="end">' +
        (opts.fmt ? opts.fmt(max * (1 - g / 4)) : Math.round(max * (1 - g / 4))) + '</text>';
    }
    var xLabels = labels.map(function (l, i) {
      if (labels.length > 8 && i % 2) return '';
      var p = pt(i, 0);
      return '<text class="axis-label" x="' + p[0] + '" y="' + (H - 10) + '" text-anchor="middle">' + l + '</text>';
    }).join('');

    var paths = series.map(function (s) {
      var d = s.values.map(function (v, i) {
        var p = pt(i, v);
        return (i ? 'L' : 'M') + p[0] + ' ' + p[1];
      }).join(' ');
      var lastP = pt(s.values.length - 1, s.values[s.values.length - 1]);
      var firstP = pt(0, s.values[0]);
      var area = d + ' L' + lastP[0] + ' ' + (H - PAD) + ' L' + firstP[0] + ' ' + (H - PAD) + ' Z';
      var dots = s.values.map(function (v, i) {
        var p = pt(i, v);
        return '<circle class="dot" cx="' + p[0] + '" cy="' + p[1] + '" r="3.4" fill="' + s.color + '"><title>' + labels[i] + ': ' + (opts.fmt ? opts.fmt(v) : v) + '</title></circle>';
      }).join('');
      return '<path class="area-path" d="' + area + '" fill="' + s.color + '"/>' +
        '<path class="line-path" d="' + d + '" stroke="' + s.color + '"/>' + dots;
    }).join('');

    host.innerHTML = '<svg class="line-chart" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + (opts.label || 'Trend chart') + '">' +
      grid + xLabels + paths + '</svg>' +
      (series.length > 1 ? '<div class="chart-legend">' + series.map(function (s) {
        return '<span><i style="background:' + s.color + '"></i>' + s.name + '</span>';
      }).join('') + '</div>' : '');
  }

  /** Donut chart. items: [{label, value, color}] */
  function donutChart(host, items, opts) {
    host = typeof host === 'string' ? document.querySelector(host) : host;
    if (!host) return;
    opts = opts || {};
    var total = items.reduce(function (a, b) { return a + b.value; }, 0) || 1;
    var R = 60, C = 2 * Math.PI * R;
    var offset = 0;
    var circles = items.map(function (i) {
      var frac = i.value / total;
      var seg = '<circle cx="80" cy="80" r="' + R + '" stroke="' + i.color + '" stroke-dasharray="' +
        (frac * C - 3) + ' ' + (C - frac * C + 3) + '" stroke-dashoffset="' + (-offset * C) + '">' +
        '<title>' + i.label + ': ' + Math.round(frac * 100) + '%</title></circle>';
      offset += frac;
      return seg;
    }).join('');

    host.innerHTML = '<div class="donut-wrap"><div class="donut">' +
      '<svg viewBox="0 0 160 160" role="img" aria-label="' + (opts.label || 'Breakdown chart') + '">' + circles + '</svg>' +
      '<div class="donut__center"><div><b>' + (opts.center || total) + '</b><span>' + (opts.centerLabel || 'Total') + '</span></div></div></div>' +
      '<ul class="donut-legend">' + items.map(function (i) {
        return '<li><i style="background:' + i.color + '"></i>' + i.label + '<b>' + Math.round((i.value / total) * 100) + '%</b></li>';
      }).join('') + '</ul></div>';
  }

  /** Tiny sparkline for stat cards */
  function sparkline(host, values, color) {
    host = typeof host === 'string' ? document.querySelector(host) : host;
    if (!host) return;
    var W = 140, H = 34;
    var max = Math.max.apply(null, values) || 1;
    var min = Math.min.apply(null, values);
    var range = (max - min) || 1;
    var d = values.map(function (v, i) {
      var x = (i / (values.length - 1)) * W;
      var y = H - 3 - ((v - min) / range) * (H - 8);
      return (i ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1);
    }).join(' ');
    host.innerHTML = '<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" height="' + H + '" aria-hidden="true">' +
      '<path d="' + d + ' L' + W + ' ' + H + ' L0 ' + H + ' Z" fill="' + color + '" opacity=".12"/>' +
      '<path d="' + d + '" fill="none" stroke="' + color + '" stroke-width="2" stroke-linecap="round"/></svg>';
  }

  document.addEventListener('DOMContentLoaded', function () {
    initParallax();
    initTilt();
    initMarquee();
  });

  global.Anim = {
    barChart: barChart,
    lineChart: lineChart,
    donutChart: donutChart,
    sparkline: sparkline
  };
})(window);
