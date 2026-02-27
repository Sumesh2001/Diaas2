// Testimonial Slider — 2 cards per view on desktop, 1 on mobile
(function () {
  function initTestimonialSlider() {
    var track = document.getElementById('testimonial-track');
    if (!track) return;

    var slides = Array.from(track.querySelectorAll('.testimonial-slide'));
    var total = slides.length;
    var dotsEl = document.getElementById('testimonial-dots');
    var counterEl = document.getElementById('testimonial-counter');
    var current = 0;
    var autoTimer;

    // How many slides are visible at once (responsive)
    function perView() {
      return window.innerWidth >= 768 ? 2 : 1;
    }

    // Total number of "pages"
    function pageCount() {
      return Math.ceil(total / perView());
    }

    // Build / rebuild dots based on page count
    function buildDots() {
      if (!dotsEl) return;
      dotsEl.innerHTML = '';
      var pages = pageCount();
      for (var i = 0; i < pages; i++) {
        (function(idx) {
          var d = document.createElement('button');
          d.className = 'testimonial-dot' + (idx === 0 ? ' active' : '');
          d.setAttribute('aria-label', 'Go to page ' + (idx + 1));
          d.addEventListener('click', function () { goPage(idx); });
          dotsEl.appendChild(d);
        })(i);
      }
    }

    function getDots() {
      return dotsEl ? Array.from(dotsEl.querySelectorAll('.testimonial-dot')) : [];
    }

    // current = slide index (not page index)
    function update() {
      track.style.transform = 'translateX(-' + (current * (100 / perView())) + '%)';
      var page = Math.floor(current / perView());
      getDots().forEach(function (d, i) {
        d.classList.toggle('active', i === page);
      });
      if (counterEl) {
        counterEl.textContent = (page + 1) + ' / ' + pageCount();
      }
    }

    function goPage(pageIdx) {
      var pv = perView();
      var maxPage = pageCount() - 1;
      pageIdx = Math.max(0, Math.min(pageIdx, maxPage));
      current = pageIdx * pv;
      update();
      resetAuto();
    }

    function nextPage() {
      var page = Math.floor(current / perView());
      goPage((page + 1) % pageCount());
    }

    function prevPage() {
      var page = Math.floor(current / perView());
      goPage((page - 1 + pageCount()) % pageCount());
    }

    function resetAuto() {
      clearInterval(autoTimer);
      autoTimer = setInterval(nextPage, 10000);
    }

    // Rebuild on resize (in case perView changes)
    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        buildDots();
        // Clamp current to valid range
        var pv = perView();
        var maxPage = pageCount() - 1;
        var page = Math.min(Math.floor(current / pv), maxPage);
        current = page * pv;
        update();
      }, 150);
    });

    var prevBtn = document.getElementById('testimonial-prev');
    var nextBtn = document.getElementById('testimonial-next');
    if (prevBtn) prevBtn.addEventListener('click', prevPage);
    if (nextBtn) nextBtn.addEventListener('click', nextPage);

    // Swipe support
    var startX = 0;
    track.addEventListener('touchstart', function (e) {
      startX = e.touches[0].clientX;
    }, { passive: true });
    track.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) {
        dx < 0 ? nextPage() : prevPage();
      }
    });

    buildDots();
    update();
    resetAuto();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTestimonialSlider);
  } else {
    initTestimonialSlider();
  }
})();