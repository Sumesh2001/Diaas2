(function () {
  const viewport = document.getElementById("diaasViewport");
  const track    = document.getElementById("diaasTrack");
  const slides   = Array.from(track.querySelectorAll(".diaas-slide"));
  const dotsWrap = document.getElementById("diasDots");
  const total    = slides.length;
  let current    = 0;
  let timer;

  slides.forEach((_, i) => {
    const d = document.createElement("button");
    d.className = "diaas-dot";
    d.setAttribute("aria-label", `Slide ${i + 1}`);
    d.onclick = () => goTo(i);
    dotsWrap.appendChild(d);
  });
  const dots = Array.from(dotsWrap.querySelectorAll(".diaas-dot"));

  function isMobile() { return window.innerWidth <= 640; }

  function render() {
    const vpW = viewport.offsetWidth;

    let slideW;
    if (isMobile()) {
      // On mobile each slide is 85% of viewport
      slideW = vpW * 0.85;
    } else {
      // Desktop/tablet: exactly 1/3
      slideW = vpW / 3;
    }

    // Centre slide[current]: shift so its centre aligns with viewport centre
    const offset = (current * slideW) - (vpW / 2) + (slideW / 2);
    track.style.transform = `translateX(${-offset}px)`;

    slides.forEach((s, i) => s.classList.toggle("active", i === current));
    dots.forEach((d, i)   => d.classList.toggle("active", i === current));
  }

  function goTo(i) {
    current = ((i % total) + total) % total;
    render();
    restart();
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function restart() {
    clearInterval(timer);
    timer = setInterval(next, 4000);
  }

  document.getElementById("nextBtn").onclick = next;
  document.getElementById("prevBtn").onclick = prev;

  slides.forEach((s, i) => {
    s.onclick = () => { if (i !== current) goTo(i); };
  });

  let touchStartX = 0;
  let touchStartY = 0;
  let dragging    = false;

  viewport.addEventListener("touchstart", e => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    dragging    = false;
  }, { passive: true });

  viewport.addEventListener("touchmove", e => {
    const dx = e.touches[0].clientX - touchStartX;
    const dy = e.touches[0].clientY - touchStartY;
    if (!dragging && Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 8) {
      dragging = true;
    }
    if (dragging) e.preventDefault();
  }, { passive: false });

  viewport.addEventListener("touchend", e => {
    if (!dragging) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) dx < 0 ? next() : prev();
    dragging = false;
  }, { passive: true });

  window.addEventListener("load",   () => { render(); restart(); });
  window.addEventListener("resize", render);
})();