
  const track = document.getElementById('industriesTrack');
  const prevBtns = [document.getElementById('prevIndustry'), document.getElementById('prevIndustryMobile')];
  const nextBtns = [document.getElementById('nextIndustry'), document.getElementById('nextIndustryMobile')];
  const cards = document.querySelectorAll('.industry-card');

  let index = 0;
  const visibleCards = 3;
  const totalCards = cards.length;

  function updateCarousel() {
    const cardWidth = cards[0].offsetWidth + 24; // include gap
    const moveX = index * cardWidth * -1;
    track.style.transform = `translateX(${moveX}px)`;
  }

  nextBtns.forEach(btn =>
    btn.addEventListener('click', () => {
      if (index < totalCards - visibleCards) index++;
      else index = 0; // loop
      updateCarousel();
    })
  );

  prevBtns.forEach(btn =>
    btn.addEventListener('click', () => {
      if (index > 0) index--;
      else index = totalCards - visibleCards;
      updateCarousel();
    })
  );

  // Responsive recalculation
  window.addEventListener('resize', updateCarousel);

