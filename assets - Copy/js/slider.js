const CONFIG = {
      autoplayInterval: 3000, // 5 seconds per slide
      animationDuration: 1050 // Match CSS transition duration
    };

    // State Management
    const state = {
      currentIndex: 0,
      isAutoPlaying: true,
      autoplayTimer: null
    };

    // DOM Elements
    const slides = document.querySelectorAll('.slide');
    const autoplayBtn = document.getElementById('autoplayBtn');
    const playIcon = document.getElementById('playIcon');
    const pauseIcon = document.getElementById('pauseIcon');

    /**
     * Activate a specific slide
     * @param {number} index - Index of the slide to activate
     */
    function activateSlide(index) {
      // Remove active state from all slides
      slides.forEach((slide, i) => {
        slide.classList.remove('active');
        
        const arrows = slide.querySelector('.nav-arrows');
        if (arrows) {
          arrows.classList.remove('active-slide-controls');
        }

        // Reset progress bar animation
        const progressBar = slide.querySelector('.progress-bar');
        if (progressBar) {
          progressBar.style.animation = 'none';
        }

        // Activate the selected slide
        if (i === index) {
          slide.classList.add('active');
          
          if (arrows) {
            arrows.classList.add('active-slide-controls');
          }

          // Restart progress bar animation
          if (progressBar) {
            setTimeout(() => {
              progressBar.style.animation = '';
            }, 10);
          }
        }
      });

      state.currentIndex = index;
    }

    /**
     * Navigate to the next slide
     */
    function nextSlide() {
      const nextIndex = (state.currentIndex + 1) % slides.length;
      activateSlide(nextIndex);
    }

    /**
     * Navigate to the previous slide
     */
    function prevSlide() {
      const prevIndex = (state.currentIndex - 1 + slides.length) % slides.length;
      activateSlide(prevIndex);
    }

    /**
     * Start autoplay
     */
    function startAutoplay() {
      if (state.autoplayTimer) {
        clearInterval(state.autoplayTimer);
      }
      
      state.isAutoPlaying = true;
      state.autoplayTimer = setInterval(nextSlide, CONFIG.autoplayInterval);
      
      // Update button icons
      playIcon.style.display = 'none';
      pauseIcon.style.display = 'block';
      autoplayBtn.title = 'Pause autoplay';
    }

    /**
     * Stop autoplay
     */
    function stopAutoplay() {
      if (state.autoplayTimer) {
        clearInterval(state.autoplayTimer);
        state.autoplayTimer = null;
      }
      
      state.isAutoPlaying = false;
      
      // Update button icons
      playIcon.style.display = 'block';
      pauseIcon.style.display = 'none';
      autoplayBtn.title = 'Resume autoplay';
    }

    /**
     * Toggle autoplay on/off
     */
    function toggleAutoplay() {
      if (state.isAutoPlaying) {
        stopAutoplay();
      } else {
        startAutoplay();
      }
    }

    /**
     * Initialize event listeners
     */
    function initEventListeners() {
      // Arrow button listeners
      document.querySelectorAll('.arrow').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          
          // Stop autoplay on manual interaction
          stopAutoplay();
          
          if (btn.classList.contains('arrow-next')) {
            nextSlide();
          } else {
            prevSlide();
          }
        });
      });

      // Slide click listeners
      slides.forEach((slide, i) => {
        slide.addEventListener('click', () => {
          stopAutoplay();
          activateSlide(i);
        });
      });

      // Autoplay control button
      autoplayBtn.addEventListener('click', toggleAutoplay);

      // Pause on hover (optional)
      const sliderContainer = document.querySelector('.slider-container');
      sliderContainer.addEventListener('mouseenter', () => {
        if (state.isAutoPlaying) {
          stopAutoplay();
        }
      });

      sliderContainer.addEventListener('mouseleave', () => {
        if (!state.isAutoPlaying) {
          startAutoplay();
        }
      });
    }

    /**
     * Initialize the slider
     */
    function init() {
      activateSlide(state.currentIndex);
      startAutoplay();
      initEventListeners();
    }

    // Start the slider when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }

    /**
     * Initialize the slider
     */
    function init() {
      activateSlide(state.currentIndex);
      startAutoplay();
      initEventListeners();
    }

    // Start the slider when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }