  const track = document.getElementById('industriesTrack');
  const prevBtn = document.getElementById('prevIndustry');
  const nextBtn = document.getElementById('nextIndustry');
  const cards = document.querySelectorAll('.industry-card');
  const gap = 24; // 1.5rem, match CSS gap

  let index = 0;
  const totalCards = cards.length;

  function getVisibleCards() {
    if (!cards.length) return 1;
    const visibleWidth = track.offsetWidth; // width of the scrollable viewport
    const cardWidth = cards[0].offsetWidth + gap;
    const count = Math.floor((visibleWidth + gap) / cardWidth);
    return Math.max(1, Math.min(count, totalCards));
  }

  function updateCarousel() {
    const visibleCards = getVisibleCards();
    const cardWidth = cards[0].offsetWidth + gap;
    const maxIndex = Math.max(0, totalCards - visibleCards);
    if (index > maxIndex) index = maxIndex;
    const moveX = index * cardWidth * -1;
    track.style.transform = `translateX(${moveX}px)`;
  }

  nextBtn.addEventListener('click', () => {
    const visibleCards = getVisibleCards();
    const maxIndex = Math.max(0, totalCards - visibleCards);
    if (index < maxIndex) index++;
    else index = 0; // loop
    updateCarousel();
  });

  prevBtn.addEventListener('click', () => {
    const visibleCards = getVisibleCards();
    const maxIndex = Math.max(0, totalCards - visibleCards);
    if (index > 0) index--;
    else index = maxIndex;
    updateCarousel();
  });

  // Responsive recalculation
  window.addEventListener('resize', updateCarousel);
  updateCarousel(); // initial position

