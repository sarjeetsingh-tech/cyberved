document.addEventListener('DOMContentLoaded', function() {
    // Navbar functionality
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
 
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
 
    // Organizer card animations
    const orgCards = document.querySelectorAll('.organizer-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
 
    orgCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.5s ease-out';
        observer.observe(card);
    });
 
    // Stats counter animation - FIXED VERSION
    const stats = document.querySelectorAll('.stat-number');
    
    // Set direct values for each stat counter based on the organization
    const statsValues = {
        // UPSIFS stats
        "2000+": 2000,
        "50+": 50,
        "15+": 15,
        // Cybervidyapeeth stats
        "5000+": 5000,
        "100+": 100,
        "25+": 25
    };

    function animateCounter(element, endValue) {
        let startValue = 0;
        const duration = 2000;
        const startTime = performance.now();
        const hasPlus = element.textContent.includes('+');
        
        function updateCounter(timestamp) {
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const currentValue = Math.floor(startValue + progress * (endValue - startValue));
            
            element.textContent = hasPlus ? currentValue + '+' : currentValue;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        }
        
        requestAnimationFrame(updateCounter);
    }
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const originalText = entry.target.textContent;
                const endValue = statsValues[originalText] || parseInt(originalText) || 0;
                animateCounter(entry.target, endValue);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    stats.forEach(stat => {
        statsObserver.observe(stat);
    });
 
    // Navbar scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > lastScroll) {
            navbar.style.top = '-80px';
        } else {
            navbar.style.top = '0';
        }
        lastScroll = currentScroll;
    });
 
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
 
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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
 });