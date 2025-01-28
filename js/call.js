document.addEventListener('DOMContentLoaded', () => {
    // Navigation handling
    const header = document.querySelector('.header');
    const navBtn = document.querySelector('.nav-btn');
    let lastScrollY = window.scrollY;
    let isNavVisible = true;

    // Scroll handler for navigation
    function handleScroll() {
        const currentScrollY = window.scrollY;

        // Show/hide navigation based on scroll direction
        if (currentScrollY > lastScrollY && isNavVisible && currentScrollY > 100) {
            header.style.transform = 'translateY(-100%)';
            isNavVisible = false;
        } else if (currentScrollY < lastScrollY && !isNavVisible) {
            header.style.transform = 'translateY(0)';
            isNavVisible = true;
        }

        // Add background to header when scrolled
        if (currentScrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScrollY = currentScrollY;
    }

    // Throttle scroll event
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(() => {
                handleScroll();
                scrollTimeout = null;
            }, 100);
        }
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
    };

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for fade-in
    const fadeElements = document.querySelectorAll(
        '.theme-card, .requirement-box, .timeline-event, .award-card, .footer-section'
    );
    fadeElements.forEach(element => {
        element.classList.add('fade-in');
        fadeObserver.observe(element);
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Theme cards interaction
    const themeCards = document.querySelectorAll('.theme-card');
    themeCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--x', `${x}px`);
            card.style.setProperty('--y', `${y}px`);
        });
    });

    // Timeline animation
    const timelineEvents = document.querySelectorAll('.timeline-event');
    let isTimelineAnimated = false;

    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !isTimelineAnimated) {
                animateTimeline();
                isTimelineAnimated = true;
                timelineObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    function animateTimeline() {
        timelineEvents.forEach((event, index) => {
            setTimeout(() => {
                event.classList.add('visible');
            }, index * 200);
        });
    }

    const timelineSection = document.querySelector('.timeline');
    if (timelineSection) {
        timelineObserver.observe(timelineSection);
    }

    // Award cards hover effect
    const awardCards = document.querySelectorAll('.award-card');
    awardCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            awardCards.forEach(otherCard => {
                if (otherCard !== card) {
                    otherCard.style.transform = 'scale(0.95)';
                    otherCard.style.opacity = '0.7';
                }
            });
        });

        card.addEventListener('mouseleave', () => {
            awardCards.forEach(otherCard => {
                otherCard.style.transform = '';
                otherCard.style.opacity = '';
            });
        });
    });

    // Floating Action Button
    const fab = document.querySelector('.fab-button');
    if (fab) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                fab.classList.add('visible');
            } else {
                fab.classList.remove('visible');
            }
        });

        fab.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Loading animation
    function showLoading() {
        const overlay = document.createElement('div');
        overlay.className = 'loading-overlay';
        overlay.innerHTML = '<div class="loader"></div>';
        document.body.appendChild(overlay);
    }

    function hideLoading() {
        const overlay = document.querySelector('.loading-overlay');
        if (overlay) {
            overlay.classList.add('fade-out');
            setTimeout(() => overlay.remove(), 500);
        }
    }

    // Form submission handling
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            showLoading();

            try {
                // Simulate form submission
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Show success message
                showNotification('Form submitted successfully!', 'success');
                form.reset();
            } catch (error) {
                showNotification('An error occurred. Please try again.', 'error');
            } finally {
                hideLoading();
            }
        });
    });

    // Notification system
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        document.body.appendChild(notification);
        
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Initialize any custom interactive elements
    initializeInteractiveElements();
});

// Initialize interactive elements
function initializeInteractiveElements() {
    // Add hover effect to interactive elements
    document.querySelectorAll('.interactive-hover').forEach(element => {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            element.style.setProperty('--mouse-x', `${x}px`);
            element.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // Add smooth reveal to statistics
    const stats = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumber(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => statsObserver.observe(stat));
}

// Animate numbers
function animateNumber(element) {
    const final = parseInt(element.textContent);
    const duration = 2000;
    const start = Date.now();

    const update = () => {
        const now = Date.now();
        const progress = Math.min((now - start) / duration, 1);
        const value = Math.floor(progress * final);
        
        element.textContent = value.toLocaleString();

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    };

    update();
}