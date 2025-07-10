document.addEventListener('DOMContentLoaded', () => {
    const slider = document.querySelector('.slider');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    let currentSlide = 0;
    const slideCount = slides.length;
    let slideInterval;

    function updateSlidePosition() {
        slider.style.transform = `translateX(-${currentSlide * 100}%)`;
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slideCount;
        updateSlidePosition();
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slideCount) % slideCount;
        updateSlidePosition();
    }

    function startAutoplay() {
        if (slideInterval) clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 3000);
    }

    function resetAutoplay() {
        clearInterval(slideInterval);
        startAutoplay();
    }

    // Event listeners
    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoplay();
    });

    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoplay();
    });

    // Initialize slider
    updateSlidePosition();
    startAutoplay();

    // Pause on hover
    slider.addEventListener('mouseenter', () => clearInterval(slideInterval));
    slider.addEventListener('mouseleave', startAutoplay);

    // Popup Notice for Event Postponement
    // Create popup elements
    const popupOverlay = document.createElement('div');
    popupOverlay.className = 'popup-overlay';
    
    const popupContainer = document.createElement('div');
    popupContainer.className = 'popup-container';
    
    const popupContent = document.createElement('div');
    popupContent.className = 'popup-content';
    
    // Add popup content
    popupContent.innerHTML = `
       <div class="popup-header">
            <h2>⚠️ Important Notice: Events Rescheduled ⚠️</h2>
            <button class="popup-close">&times;</button>
        </div>
        <div class="popup-body">
            <p>Dear Participants,</p>
            <p>Greetings from UPSIFS, Lucknow!</p>
            <p>We're excited to announce the <strong>new dates</strong> for our upcoming events in August 2025:</p>
            
            <p><strong>🚀 Hackathon:</strong> August 12-14, 2025</p>
            <p><strong>🎯 Summit:</strong> August 18-20, 2025</p>
            <p><strong>📝 Call for Papers:</strong> August 13, 2025</p>
            
            <p>Stay connected for further updates!</p>
            <p>Thank you.</p>
            
        </div>
    `;
    
    // Assemble popup
    popupContainer.appendChild(popupContent);
    popupOverlay.appendChild(popupContainer);
    document.body.appendChild(popupOverlay);
    
    // Show popup after a short delay
    setTimeout(() => {
        popupOverlay.classList.add('active');
    }, 800);
    
    // Store popup state in session storage
    const hasSeenPopup = sessionStorage.getItem('hasSeenPostponementPopup');
    
    if (!hasSeenPopup) {
        // First time visitor in this session
        popupOverlay.classList.add('active');
        // Mark that they've seen it
        sessionStorage.setItem('hasSeenPostponementPopup', 'true');
    }
    
    // Close popup when clicking the close button
    const closeButton = popupContent.querySelector('.popup-close');
    closeButton.addEventListener('click', () => {
        popupOverlay.classList.remove('active');
        setTimeout(() => {
            popupOverlay.style.display = 'none';
        }, 400);
    });
    
    // Close popup when clicking outside
    popupOverlay.addEventListener('click', (e) => {
        if (e.target === popupOverlay) {
            popupOverlay.classList.remove('active');
            setTimeout(() => {
                popupOverlay.style.display = 'none';
            }, 400);
        }
    });
});

function toggleMenu() {
    document.querySelector('.hamburger').classList.toggle('active');
    document.querySelector('.nav-menu').classList.toggle('active');
    
    const spans = document.querySelectorAll('.hamburger span');
    if (document.querySelector('.nav-menu').classList.contains('active')) {
        spans[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
}