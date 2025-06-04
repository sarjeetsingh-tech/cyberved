document.addEventListener('DOMContentLoaded', function() {
    // Navbar functionality
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
 
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
 
    // Speaker cards animation
    const speakerCards = document.querySelectorAll('.speaker-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
 
    speakerCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.5s ease-out';
        observer.observe(card);
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
 
    // Social links hover effect
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            link.style.transform = 'scale(1.2)';
        });
        
        link.addEventListener('mouseleave', () => {
            link.style.transform = 'scale(1)';
        });
    });
 
    // Expertise tags animation
    const expertiseTags = document.querySelectorAll('.expertise span');
    expertiseTags.forEach(tag => {
        tag.addEventListener('mouseenter', () => {
            tag.style.background = 'var(--primary)';
            tag.style.color = 'white';
        });
        
        tag.addEventListener('mouseleave', () => {
            tag.style.background = 'rgba(255,119,34,0.2)';
            tag.style.color = 'var(--primary)';
        });
    });
 });

 // JavaScript for Speaker Cards
function toggleSpeakerDetails(card) {
    // Check if this card is already expanded
    const isExpanded = card.classList.contains('expanded');
    
    // First, collapse all cards
    const allCards = document.querySelectorAll('.speaker-card');
    allCards.forEach(element => {
        element.classList.remove('expanded');
    });
    
    // If the clicked card wasn't expanded before, expand it
    if (!isExpanded) {
        card.classList.add('expanded');
        
        // Add expanded class after a short delay to enable animation
        setTimeout(() => {
            // Scroll to the card with smooth animation
            card.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }, 50);
    }
}

// Function to handle close button click
function closeExpandedCard(event) {
    // Prevent the click from bubbling up to the card
    event.stopPropagation();
    
    // Find the parent card and remove the expanded class
    const card = event.target.closest('.speaker-card');
    if (card) {
        card.classList.remove('expanded');
    }
}

// Close expanded card when clicking outside
document.addEventListener('click', function(event) {
    if (!event.target.closest('.speaker-card')) {
        const expandedCards = document.querySelectorAll('.speaker-card.expanded');
        expandedCards.forEach(card => {
            card.classList.remove('expanded');
        });
    }
});

// Optional: Add keyboard navigation support
document.addEventListener('keydown', function(event) {
    // ESC key closes expanded cards
    if (event.key === 'Escape') {
        const expandedCards = document.querySelectorAll('.speaker-card.expanded');
        expandedCards.forEach(card => {
            card.classList.remove('expanded');
        });
    }
});

// Initialize with proper grid positioning on page load
document.addEventListener('DOMContentLoaded', function() {
    const speakersGrid = document.querySelector('.speakers-grid');
    
    // Ensure proper layout on window resize
    window.addEventListener('resize', function() {
        const expandedCard = document.querySelector('.speaker-card.expanded');
        if (expandedCard) {
            // Re-trigger expansion to fix positioning
            setTimeout(() => {
                expandedCard.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }, 300);
        }
    });
});