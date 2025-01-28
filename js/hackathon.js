document.addEventListener('DOMContentLoaded', () => {
    // Element References
    const slider = document.querySelector('.slider');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const navLinks = document.querySelectorAll('.nav-link');
    const header = document.querySelector('.header');
    const fabButton = document.querySelector('.fab-button');
    const scheduleTabBtns = document.querySelectorAll('.tab-btn');

    // Variables
    let currentSlide = 0;
    let slideInterval;
    let isTransitioning = false;
    let lastScrollY = window.scrollY;

    // Utility Functions
    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        }
    }

    // Slider Functions
    function updateSlidePosition(instant = false) {
        if (instant) {
            slider.style.transition = 'none';
        } else {
            slider.style.transition = 'transform 0.5s ease-in-out';
        }
        slider.style.transform = `translateX(-${currentSlide * 100}%)`;

        if (instant) {
            slider.offsetHeight; // Force reflow
            slider.style.transition = '';
        }
    }

    function nextSlide() {
        if (isTransitioning) return;
        isTransitioning = true;
        currentSlide = (currentSlide + 1) % slides.length;
        updateSlidePosition();
        resetAutoplay();
        setTimeout(() => isTransitioning = false, 500);
    }

    function prevSlide() {
        if (isTransitioning) return;
        isTransitioning = true;
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateSlidePosition();
        resetAutoplay();
        setTimeout(() => isTransitioning = false, 500);
    }

    // Initialize and handle autoplay
    function startAutoplay() {
        slideInterval = setInterval(nextSlide, 5000);
    }

    function resetAutoplay() {
        clearInterval(slideInterval);
        startAutoplay();
    }

    // Schedule Tabs
    function initializeTabs() {
        scheduleTabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                scheduleTabBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                btn.classList.add('active');
                
                // Hide all schedules and show the selected one
                const day = btn.getAttribute('data-day');
                const schedules = document.querySelectorAll('.day-schedule');
                schedules.forEach(schedule => {
                    schedule.classList.remove('active');
                    if (schedule.id === `day${day}-schedule`) {
                        schedule.classList.add('active');
                    }
                });
            });
        });
    }

    // Scroll Effects
    const handleScroll = throttle(() => {
        const currentScrollY = window.scrollY;

        // Header shadow effect
        if (currentScrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Show/hide FAB button
        if (currentScrollY > 500) {
            fabButton.classList.add('visible');
        } else {
            fabButton.classList.remove('visible');
        }

        // Parallax effects for sections
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const speed = section.dataset.parallax || 0.2;
                const yOffset = (window.innerHeight - rect.top) * speed;
                section.style.backgroundPositionY = `${yOffset}px`;
            }
        });

        lastScrollY = currentScrollY;
    }, 100);

    // Intersection Observer for Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    function initializeAnimations() {
        const animatedElements = document.querySelectorAll(
            '.overview-card, .objective-card, .framework-card, ' +
            '.evaluation-card, .award-card, .guideline-card, ' +
            '.timeline-phase, .contact-card'
        );
        
        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }

    // Smooth Scrolling
    function initializeSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const headerOffset = 80;
                    const elementPosition = target.offsetTop;
                    const offsetPosition = elementPosition - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Back to Top Button
    function handleBackToTop() {
        fabButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Timeline Navigation
    function initializeTimeline() {
        const timelinePhases = document.querySelectorAll('.timeline-phase');
        timelinePhases.forEach(phase => {
            phase.addEventListener('mouseenter', () => {
                phase.classList.add('active');
            });
            phase.addEventListener('mouseleave', () => {
                phase.classList.remove('active');
            });
        });
    }

    // Event Listeners
    prevBtn?.addEventListener('click', prevSlide);
    nextBtn?.addEventListener('click', nextSlide);

    slider?.addEventListener('mouseenter', () => clearInterval(slideInterval));
    slider?.addEventListener('mouseleave', startAutoplay);

    // Handle touch events for slider
    let touchStartX = 0;
    let touchEndX = 0;

    slider?.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        clearInterval(slideInterval);
    }, { passive: true });

    slider?.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startAutoplay();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        const difference = touchStartX - touchEndX;

        if (Math.abs(difference) > swipeThreshold) {
            if (difference > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }

    // Window event listeners
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', debounce(() => {
        updateSlidePosition(true);
    }, 250));

    // Initialize everything
    function initialize() {
        if (slider && slides.length) {
            updateSlidePosition(true);
            startAutoplay();
        }
        initializeTabs();
        initializeAnimations();
        initializeSmoothScroll();
        initializeTimeline();
        handleBackToTop();
    }

    initialize();
});