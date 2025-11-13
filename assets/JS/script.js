// Vertical Slider Functionality
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const tabs = document.querySelectorAll('.tab-item');
const totalSlides = slides.length;

// Initialize
function init() {
    showSlide(0);
    setupEventListeners();
    startAutoSlide();
}

// Show specific slide
function showSlide(index, direction = 'next') {
    // Remove all classes from current slide
    slides[currentSlide].classList.remove('active', 'slide-up', 'slide-down');
    
    // Set exit animation for current slide
    if (direction === 'next') {
        slides[currentSlide].classList.add('slide-up');
    } else {
        slides[currentSlide].classList.add('slide-down');
    }
    
    // Update current slide index
    currentSlide = index;
    
    // Reset all slides except the new one
    slides.forEach((slide, i) => {
        if (i !== currentSlide) {
            slide.classList.remove('active', 'slide-up', 'slide-down');
            if (direction === 'next') {
                slide.style.transform = 'translateY(100%)';
            } else {
                slide.style.transform = 'translateY(-100%)';
            }
        }
    });
    
    // Show new slide
    setTimeout(() => {
        slides[currentSlide].classList.add('active');
    }, 50);
    
    // Update tabs
    updateTabs(currentSlide);
}

// Update tab styling
function updateTabs(index) {
    tabs.forEach((tab, i) => {
        if (i === index) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
}

// Next slide
function nextSlide() {
    const nextIndex = (currentSlide + 1) % totalSlides;
    showSlide(nextIndex, 'next');
    resetAutoSlide();
}

// Previous slide
function prevSlide() {
    const prevIndex = (currentSlide - 1 + totalSlides) % totalSlides;
    showSlide(prevIndex, 'prev');
    resetAutoSlide();
}

// Auto slide functionality
let autoSlideInterval;

function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
        nextSlide();
    }, 5000); // Change slide every 5 seconds
}

function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
}

// Setup event listeners
function setupEventListeners() {
    // Navigation buttons
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
    }
    
    // Tab clicks
    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            const direction = index > currentSlide ? 'next' : 'prev';
            showSlide(index, direction);
            resetAutoSlide();
        });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
            nextSlide();
        }
    });
    
    // Mouse wheel navigation
    let isScrolling = false;
    
    document.addEventListener('wheel', (e) => {
        if (isScrolling) return;
        
        isScrolling = true;
        
        if (e.deltaY > 0) {
            nextSlide();
        } else {
            prevSlide();
        }
        
        setTimeout(() => {
            isScrolling = false;
        }, 1000);
    });
    
    // Touch swipe for mobile
    let touchStartY = 0;
    let touchEndY = 0;
    
    document.addEventListener('touchstart', (e) => {
        touchStartY = e.changedTouches[0].screenY;
    });
    
    document.addEventListener('touchend', (e) => {
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartY - touchEndY;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }
}

// Smooth scroll behavior for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Mobile menu toggle (if needed)
const menuButton = document.querySelector('[data-menu-button]');
const mobileMenu = document.querySelector('[data-mobile-menu]');

if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
}

// Pause auto-slide when tab is not visible
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        clearInterval(autoSlideInterval);
    } else {
        startAutoSlide();
    }
});

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Add smooth transitions for page elements
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

// Preload images for better performance
function preloadImages() {
    const images = [
        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600',
        'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1600',
        'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1600',
        'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1600'
    ];
    
    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

preloadImages();