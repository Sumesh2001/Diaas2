// Testimonial Layout Enhancement Script
document.addEventListener('DOMContentLoaded', function() {
  const testimonialSlides = document.querySelectorAll('.testimonial-slide');
  
  // Group testimonials in pairs
  const testimonials = [];
  testimonialSlides.forEach(slide => {
    const mobileView = slide.querySelector('.md\\:hidden');
    const desktopView = slide.querySelector('.hidden.md\\:grid');
    
    if (!mobileView || !desktopView) return;
    
    // Extract info from desktop view
    const name = desktopView.querySelector('h3')?.textContent || '';
    const title = desktopView.querySelectorAll('p')[0]?.textContent || '';
    const testimonial = desktopView.querySelector('.italic')?.textContent.trim().replace(/^"|"$/g, '') || '';
    const imgElement = desktopView.querySelector('img');
    const imgSrc = imgElement?.src || imgElement?.getAttribute('src') || '';
    
    testimonials.push({ name, title, testimonial, imgSrc });
  });
  
  // Clear existing slides and create new paired layout
  const container = document.querySelector('.testimonial-track');
  if (container && testimonials.length > 0) {
    container.innerHTML = '';
    
    // Create slides with 2 testimonials each
    for (let i = 0; i < testimonials.length; i += 2) {
      const testimonial1 = testimonials[i];
      const testimonial2 = testimonials[i + 1];
      
      const slideDiv = document.createElement('div');
      slideDiv.className = 'testimonial-slide min-w-full px-4';
      
      slideDiv.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <!-- Testimonial Card 1 -->
          <div class="testimonial-clean bg-white rounded-3xl overflow-hidden shadow-lg relative">
            <!-- Top light section -->
            <div class="bg-gradient-to-b from-white via-gray-50 to-white px-8 pt-8 pb-6 relative">
              <!-- Opening quote top-left -->
              <div class="absolute top-6 left-6 text-5xl text-orange-400 font-serif leading-none opacity-60">❝</div>
              
              <!-- Circular photo -->
              <div class="relative z-10 flex justify-center pt-8 pb-4">
                <div class="w-40 h-40 rounded-full overflow-hidden border-[5px] border-white shadow-2xl bg-white">
                  <img src="${testimonial1.imgSrc}" alt="${testimonial1.name}" class="w-full h-full object-cover">
                </div>
              </div>
              
              <!-- Name -->
              <h3 class="text-xl font-bold text-gray-900 mb-3 text-center relative z-10">${testimonial1.name}</h3>
            </div>
            
            <!-- Bottom orange section -->
            <div class="bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 px-8 py-8 relative min-h-[240px] flex flex-col justify-between">
              <!-- Opening quote -->
              <div class="absolute top-6 left-6 text-3xl text-white font-serif leading-none opacity-40">❝</div>
              
              <!-- Testimonial text -->
              <p class="text-white text-sm leading-relaxed pt-6 relative z-10">
                ${testimonial1.testimonial}
              </p>
              
              <!-- Decorative border bottom-right -->
              <div class="absolute bottom-6 right-6 w-36 h-36 border-[5px] border-orange-300 rounded-[45px] opacity-30"></div>
              
              <!-- Closing quote -->
              <div class="absolute bottom-6 right-6 text-5xl text-white font-serif leading-none opacity-40 z-10">❞</div>
            </div>
          </div>
          
          ${testimonial2 ? `
          <!-- Testimonial Card 2 -->
          <div class="testimonial-clean bg-white rounded-3xl overflow-hidden shadow-lg relative">
            <!-- Top light section -->
            <div class="bg-gradient-to-b from-white via-gray-50 to-white px-8 pt-8 pb-6 relative">
              <!-- Opening quote top-left -->
              <div class="absolute top-6 left-6 text-5xl text-orange-400 font-serif leading-none opacity-60">❝</div>
              
              <!-- Circular photo -->
              <div class="relative z-10 flex justify-center pt-8 pb-4">
                <div class="w-40 h-40 rounded-full overflow-hidden border-[5px] border-white shadow-2xl bg-white">
                  <img src="${testimonial2.imgSrc}" alt="${testimonial2.name}" class="w-full h-full object-cover">
                </div>
              </div>
              
              <!-- Name -->
              <h3 class="text-xl font-bold text-gray-900 mb-3 text-center relative z-10">${testimonial2.name}</h3>
            </div>
            
            <!-- Bottom orange section -->
            <div class="bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 px-8 py-8 relative min-h-[240px] flex flex-col justify-between">
              <!-- Opening quote -->
              <div class="absolute top-6 left-6 text-3xl text-white font-serif leading-none opacity-40">❝</div>
              
              <!-- Testimonial text -->
              <p class="text-white text-sm leading-relaxed pt-6 relative z-10">
                ${testimonial2.testimonial}
              </p>
              
              <!-- Decorative border bottom-right -->
              <div class="absolute bottom-6 right-6 w-36 h-36 border-[5px] border-orange-300 rounded-[45px] opacity-30"></div>
              
              <!-- Closing quote -->
              <div class="absolute bottom-6 right-6 text-5xl text-white font-serif leading-none opacity-40 z-10">❞</div>
            </div>
          </div>
          ` : ''}
        </div>
      `;
      
      container.appendChild(slideDiv);
    }
  }
});
