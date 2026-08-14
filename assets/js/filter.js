/* ==========================================================================
   filter.js — generic list controller: filter + sort + paginate
   new ListController({
     items, pageSize, render(item)->html, host, pagerHost, countHost,
     filters: {key: fn(item, value)->bool}, sorters: {key: fn(a,b)}
   })
   ========================================================================== */
(function (global) {
  'use strict';

  function ListController(cfg) {
    this.items = cfg.items.slice();
    this.pageSize = cfg.pageSize || 9;
    this.renderItem = cfg.render;
    this.host = typeof cfg.host === 'string' ? document.querySelector(cfg.host) : cfg.host;
    this.pagerHost = typeof cfg.pagerHost === 'string' ? document.querySelector(cfg.pagerHost) : cfg.pagerHost;
    this.countHost = typeof cfg.countHost === 'string' ? document.querySelector(cfg.countHost) : cfg.countHost;
    this.filters = cfg.filters || {};
    this.sorters = cfg.sorters || {};
    this.state = { page: 1, sort: cfg.defaultSort || null, values: {} };
    this.emptyHtml = cfg.emptyHtml ||
      '<div class="empty-state" style="grid-column:1/-1"><span class="icon-box icon-box--lg">' + Icon.get('search') + '</span>' +
      '<h3>Nothing matches those filters</h3><p>Try widening your search or clearing a filter or two.</p>' +
      '<button type="button" class="btn btn--soft" data-lc-reset>Clear all filters</button></div>';
    var self = this;
    if (this.host) {
      this.host.addEventListener('click', function (e) {
        if (e.target.closest('[data-lc-reset]')) self.reset();
      });
    }
    this.render();
  }

  ListController.prototype.set = function (key, value) {
    if (value === null || value === undefined || value === '' || value === 'all') delete this.state.values[key];
    else this.state.values[key] = value;
    this.state.page = 1;
    this.render();
  };

  ListController.prototype.sort = function (key) {
    this.state.sort = key;
    this.state.page = 1;
    this.render();
  };

  ListController.prototype.reset = function () {
    this.state.values = {};
    this.state.page = 1;
    document.querySelectorAll('[data-lc-bound]').forEach(function (el) {
      if (el.type === 'checkbox' || el.type === 'radio') el.checked = el.defaultChecked;
      else el.value = el.defaultValue !== undefined ? el.defaultValue : '';
    });
    this.render();
    if (global.Toast) Toast.info('Filters cleared.');
  };

  ListController.prototype.filtered = function () {
    var self = this;
    var out = this.items.filter(function (item) {
      return Object.keys(self.state.values).every(function (key) {
        var fn = self.filters[key];
        return fn ? fn(item, self.state.values[key]) : true;
      });
    });
    if (this.state.sort && this.sorters[this.state.sort]) {
      out.sort(this.sorters[this.state.sort]);
    }
    return out;
  };

  ListController.prototype.render = function () {
    var list = this.filtered();
    var pages = Math.max(1, Math.ceil(list.length / this.pageSize));
    if (this.state.page > pages) this.state.page = pages;
    var start = (this.state.page - 1) * this.pageSize;
    var slice = list.slice(start, start + this.pageSize);

    if (this.host) {
      this.host.innerHTML = slice.length
        ? slice.map(this.renderItem).join('')
        : this.emptyHtml;
      /* newly injected content needs enhancement */
      Icon.hydrate(this.host);
      Img.hydrate(this.host);
      this.host.querySelectorAll('[data-reveal]').forEach(function (el) { el.classList.add('is-revealed'); });
      if (global.Wishlist) Wishlist.refresh(this.host);
    }

    if (this.countHost) {
      this.countHost.innerHTML = list.length
        ? 'Showing <b>' + (start + 1) + '–' + Math.min(start + this.pageSize, list.length) + '</b> of <b>' + list.length + '</b> results'
        : 'No results found';
    }

    this.renderPager(pages);
  };

  ListController.prototype.renderPager = function (pages) {
    if (!this.pagerHost) return;
    var self = this;
    var cur = this.state.page;
    if (pages <= 1) { this.pagerHost.innerHTML = ''; return; }

    var nums = [];
    for (var i = 1; i <= pages; i++) {
      if (i === 1 || i === pages || Math.abs(i - cur) <= 1) nums.push(i);
      else if (nums[nums.length - 1] !== '…') nums.push('…');
    }

    this.pagerHost.innerHTML =
      '<button type="button" class="page-btn" data-lc-page="prev" aria-label="Previous page"' + (cur === 1 ? ' disabled' : '') + '>' + Icon.get('chevron-left') + '</button>' +
      nums.map(function (n) {
        if (n === '…') return '<span class="page-dots">…</span>';
        return '<button type="button" class="page-btn' + (n === cur ? ' is-active' : '') + '" data-lc-page="' + n + '"' +
          (n === cur ? ' aria-current="page"' : '') + '>' + n + '</button>';
      }).join('') +
      '<button type="button" class="page-btn" data-lc-page="next" aria-label="Next page"' + (cur === pages ? ' disabled' : '') + '>' + Icon.get('chevron-right') + '</button>';

    this.pagerHost.querySelectorAll('[data-lc-page]').forEach(function (b) {
      b.addEventListener('click', function () {
        var p = b.dataset.lcPage;
        if (p === 'prev') self.state.page--;
        else if (p === 'next') self.state.page++;
        else self.state.page = parseInt(p, 10);
        self.render();
        if (self.host) {
          var top = self.host.getBoundingClientRect().top + window.scrollY - 130;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }
      });
    });
  };

  global.ListController = ListController;
})(window);
