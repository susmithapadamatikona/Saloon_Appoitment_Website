/* ==========================================================================
   calendar.js — interactive booking calendar
   new Cal(container, {onSelect, minDays, maxMonths, disabledDows, mini})
   Deterministic pseudo-availability per date keeps the demo stable.
   ========================================================================== */
(function (global) {
  'use strict';

  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var DOWS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  function iso(d) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  /* deterministic availability: hash of date string */
  function availability(dateStr) {
    var h = 0;
    for (var i = 0; i < dateStr.length; i++) h = ((h << 5) - h + dateStr.charCodeAt(i)) | 0;
    h = Math.abs(h);
    var r = h % 100;
    if (r < 8) return 'full';      // fully booked
    if (r < 34) return 'busy';     // limited slots
    return 'free';
  }

  function Cal(container, opts) {
    var self = this;
    opts = opts || {};
    this.el = typeof container === 'string' ? document.querySelector(container) : container;
    this.onSelect = opts.onSelect || function () {};
    this.minDays = opts.minDays === undefined ? 0 : opts.minDays;   // 0 = today allowed
    this.maxMonths = opts.maxMonths || 3;
    this.mini = !!opts.mini;
    this.selected = opts.selected ? new Date(opts.selected + 'T00:00:00') : null;

    var today = new Date();
    today.setHours(0, 0, 0, 0);
    this.today = today;
    this.min = new Date(today);
    this.min.setDate(this.min.getDate() + this.minDays);
    this.max = new Date(today.getFullYear(), today.getMonth() + this.maxMonths + 1, 0);

    this.view = this.selected ? new Date(this.selected.getFullYear(), this.selected.getMonth(), 1)
      : new Date(today.getFullYear(), today.getMonth(), 1);

    this.el.classList.add('calendar');
    if (this.mini) this.el.classList.add('calendar--mini');
    this.render();

    this.el.addEventListener('click', function (e) {
      var nav = e.target.closest('[data-cal-nav]');
      if (nav) {
        self.view.setMonth(self.view.getMonth() + (nav.dataset.calNav === 'next' ? 1 : -1));
        self.render();
        return;
      }
      var day = e.target.closest('.cal-day[data-date]');
      if (day && !day.disabled) {
        self.selected = new Date(day.dataset.date + 'T00:00:00');
        self.render();
        self.onSelect(day.dataset.date, self.selected);
      }
      var quick = e.target.closest('[data-cal-quick]');
      if (quick) {
        var d = new Date(self.today);
        d.setDate(d.getDate() + parseInt(quick.dataset.calQuick, 10));
        if (d < self.min) d = new Date(self.min);
        // skip to next open day if the target is fully booked
        var guard = 0;
        while (availability(iso(d)) === 'full' && guard++ < 10) d.setDate(d.getDate() + 1);
        self.selected = d;
        self.view = new Date(d.getFullYear(), d.getMonth(), 1);
        self.render();
        self.onSelect(iso(d), d);
      }
    });
  }

  Cal.prototype.render = function () {
    var v = this.view;
    var y = v.getFullYear(), m = v.getMonth();
    var firstDow = new Date(y, m, 1).getDay();
    var daysInMonth = new Date(y, m + 1, 0).getDate();

    var minMonth = new Date(this.today.getFullYear(), this.today.getMonth(), 1);
    var canPrev = v > minMonth;
    var canNext = new Date(y, m + 1, 1) <= this.max;

    var html =
      (this.mini ? '' :
        '<div class="cal-quick">' +
        '<button type="button" data-cal-quick="0"' + (this.minDays > 0 ? ' disabled' : '') + '>Today</button>' +
        '<button type="button" data-cal-quick="1">Tomorrow</button>' +
        '<button type="button" data-cal-quick="7">Next week</button>' +
        '</div>') +
      '<div class="cal-head">' +
      '<div class="cal-head__title">' + MONTHS[m] + ' <span>' + y + '</span></div>' +
      '<div class="cal-nav">' +
      '<button type="button" data-cal-nav="prev" aria-label="Previous month"' + (canPrev ? '' : ' disabled') + '>' + Icon.get('chevron-left') + '</button>' +
      '<button type="button" data-cal-nav="next" aria-label="Next month"' + (canNext ? '' : ' disabled') + '>' + Icon.get('chevron-right') + '</button>' +
      '</div></div>' +
      '<div class="cal-weekdays" aria-hidden="true">' + DOWS.map(function (d) { return '<span>' + d + '</span>'; }).join('') + '</div>' +
      '<div class="cal-grid" role="grid">';

    for (var e = 0; e < firstDow; e++) html += '<span class="cal-day is-empty" aria-hidden="true"></span>';

    for (var d = 1; d <= daysInMonth; d++) {
      var date = new Date(y, m, d);
      var ds = iso(date);
      var isPast = date < this.min;
      var isBeyond = date > this.max;
      var avail = availability(ds);
      var disabled = isPast || isBeyond || avail === 'full';
      var isToday = date.getTime() === this.today.getTime();
      var isSel = this.selected && date.getTime() === this.selected.getTime();

      var cls = 'cal-day' +
        (isToday ? ' is-today' : '') +
        (isSel ? ' is-selected' : '') +
        (avail === 'busy' && !disabled ? ' is-busy' : '') +
        (avail === 'full' && !isPast ? ' is-full' : '');

      var lbl = date.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' }) +
        (disabled ? ', unavailable' : avail === 'busy' ? ', limited slots' : ', available');

      html += '<button type="button" class="' + cls + '" data-date="' + ds + '"' +
        (disabled ? ' disabled' : '') + ' aria-label="' + lbl + '"' +
        (isSel ? ' aria-pressed="true"' : '') + '>' + d +
        (!isPast && !isBeyond ? '<span class="cal-day__dot" aria-hidden="true"></span>' : '') +
        '</button>';
    }

    html += '</div>' +
      (this.mini ? '' :
        '<div class="cal-legend">' +
        '<span><i style="background:var(--mint)"></i>Available</span>' +
        '<span><i style="background:var(--coral)"></i>Limited slots</span>' +
        '<span><i style="background:#E53935"></i>Fully booked</span>' +
        '<span><i style="background:var(--primary-rose)"></i>Today</span>' +
        '</div>');

    this.el.innerHTML = html;
  };

  Cal.availability = availability;
  Cal.iso = iso;
  global.Cal = Cal;
})(window);
