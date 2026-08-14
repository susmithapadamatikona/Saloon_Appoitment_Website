/* ==========================================================================
   search.js — global search overlay + inline search helpers
   Searches services, stylists, salons and blog posts from DATA.
   ========================================================================== */
(function (global) {
  'use strict';

  function norm(s) { return String(s || '').toLowerCase(); }

  function searchAll(q) {
    q = norm(q).trim();
    if (q.length < 2) return null;

    function match() {
      for (var i = 0; i < arguments.length; i++) {
        if (norm(arguments[i]).indexOf(q) > -1) return true;
      }
      return false;
    }

    return {
      services: DATA.SERVICES.filter(function (s) {
        return match(s.name, s.short, s.cat, (s.tags || []).join(' '));
      }).slice(0, 5),
      stylists: DATA.STYLISTS.filter(function (s) {
        return match(s.name, s.role, s.specialties.join(' '));
      }).slice(0, 4),
      salons: DATA.SALONS.filter(function (s) {
        return match(s.name, s.city, s.area, s.address);
      }).slice(0, 4),
      posts: DATA.POSTS.filter(function (p) {
        return match(p.title, p.cat, p.excerpt, (p.tags || []).join(' '));
      }).slice(0, 3)
    };
  }

  function renderResults(box, r, q) {
    if (!r) {
      box.classList.remove('is-visible');
      box.innerHTML = '';
      return;
    }
    var total = r.services.length + r.stylists.length + r.salons.length + r.posts.length;
    var html = '';
    if (!total) {
      html = '<div class="search-empty">No results for “<b>' + q + '</b>”.<br>Try “hair”, “facial”, “bridal” or a stylist\'s name.</div>';
    } else {
      if (r.services.length) {
        html += '<div class="search-results__group-title">Services</div>' + r.services.map(function (s) {
          return '<a class="search-result" href="service-details.html?s=' + s.slug + '">' +
            '<img class="search-result__thumb" src="' + Img.get(s.slug, s.kind, 96, 96) + '" alt="" loading="lazy">' +
            '<div><div class="search-result__title">' + s.name + '</div>' +
            '<div class="search-result__meta">' + DATA.category(s.cat).name + ' · ' + DATA.duration(s.duration) + ' · ★ ' + s.rating + '</div></div>' +
            '<span class="search-result__price">' + DATA.money(s.price) + '</span></a>';
        }).join('');
      }
      if (r.stylists.length) {
        html += '<div class="search-results__group-title">Stylists</div>' + r.stylists.map(function (s) {
          return '<a class="search-result" href="stylist-details.html?s=' + s.slug + '">' +
            '<img class="search-result__thumb" src="' + Img.get(s.slug, 'person', 96, 96) + '" alt="" loading="lazy" style="border-radius:50%">' +
            '<div><div class="search-result__title">' + s.name + '</div>' +
            '<div class="search-result__meta">' + s.role + ' · ★ ' + s.rating + '</div></div></a>';
        }).join('');
      }
      if (r.salons.length) {
        html += '<div class="search-results__group-title">Salons</div>' + r.salons.map(function (s) {
          return '<a class="search-result" href="salon-details.html?s=' + s.slug + '">' +
            '<img class="search-result__thumb" src="' + Img.get(s.slug, 'salon', 96, 96) + '" alt="" loading="lazy">' +
            '<div><div class="search-result__title">' + s.name + '</div>' +
            '<div class="search-result__meta">' + s.area + ', ' + s.city + ' · ★ ' + s.rating + '</div></div></a>';
        }).join('');
      }
      if (r.posts.length) {
        html += '<div class="search-results__group-title">From the blog</div>' + r.posts.map(function (p) {
          return '<a class="search-result" href="blog-details.html?p=' + p.slug + '">' +
            '<img class="search-result__thumb" src="' + Img.get(p.slug, 'blog', 96, 96) + '" alt="" loading="lazy">' +
            '<div><div class="search-result__title">' + p.title + '</div>' +
            '<div class="search-result__meta">' + p.cat + ' · ' + p.read + ' min read</div></div></a>';
        }).join('');
      }
    }
    box.innerHTML = html;
    box.classList.add('is-visible');
  }

  function debounce(fn, ms) {
    var t;
    return function () {
      var args = arguments, ctx = this;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(ctx, args); }, ms);
    };
  }

  var Search = {
    all: searchAll,
    bindGlobal: function (input, resultsBox) {
      input.addEventListener('input', debounce(function () {
        renderResults(resultsBox, searchAll(input.value), input.value.trim());
      }, 160));
    },
    debounce: debounce
  };

  global.Search = Search;
})(window);
