// Global Variables
let currentSlide = 1;
const totalSlides = 8;
let isTransitioning = false;

// DOM Elements
const slides = document.querySelectorAll('.slide');
const nextBtn = document.getElementById('next-btn');
const prevBtn = document.getElementById('prev-btn');
const currentSlideSpan = document.getElementById('current-slide');
const totalSlidesSpan = document.getElementById('total-slides');
const progressFill = document.getElementById('progress-fill');

// Initialize Presentation
document.addEventListener('DOMContentLoaded', function() {
    initializePresentation();
    setupEventListeners();
    updateUI();
});

// Initialize Presentation
function initializePresentation() {
    // Set total slides
    totalSlidesSpan.textContent = totalSlides;
    
    // Ensure first slide is active
    slides.forEach((slide, index) => {
        slide.classList.remove('active', 'prev');
        if (index === 0) {
            slide.classList.add('active');
        }
    });
    
    // Add smooth loading animation
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
}

// Setup Event Listeners
function setupEventListeners() {
    // Navigation buttons
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyPress);
    
    // Touch/swipe gestures for mobile
    setupTouchGestures();
    
    // Window resize handler
    window.addEventListener('resize', handleResize);
}

// Navigate to Next Slide
function nextSlide() {
    if (isTransitioning || currentSlide >= totalSlides) return;
    
    isTransitioning = true;
    const currentSlideElement = slides[currentSlide - 1];
    const nextSlideElement = slides[currentSlide];
    
    // Add transition classes
    currentSlideElement.classList.remove('active');
    currentSlideElement.classList.add('prev');
    nextSlideElement.classList.add('active');
    
    currentSlide++;
    updateUI();
    
    // Add slide transition sound effect (optional)
    playTransitionSound();
    
    setTimeout(() => {
        isTransitioning = false;
        // Clean up previous slide classes
        slides.forEach(slide => slide.classList.remove('prev'));
    }, 300);
}

// Navigate to Previous Slide
function prevSlide() {
    if (isTransitioning || currentSlide <= 1) return;
    
    isTransitioning = true;
    const currentSlideElement = slides[currentSlide - 1];
    const prevSlideElement = slides[currentSlide - 2];
    
    // Add transition classes
    currentSlideElement.classList.remove('active');
    prevSlideElement.classList.remove('prev');
    prevSlideElement.classList.add('active');
    
    currentSlide--;
    updateUI();
    
    // Add slide transition sound effect (optional)
    playTransitionSound();
    
    setTimeout(() => {
        isTransitioning = false;
    }, 300);
}

// Go to Specific Slide
function goToSlide(slideNumber) {
    if (isTransitioning || slideNumber < 1 || slideNumber > totalSlides || slideNumber === currentSlide) {
        return;
    }
    
    isTransitioning = true;
    
    // Remove active class from current slide
    slides[currentSlide - 1].classList.remove('active');
    
    // Add active class to target slide
    slides[slideNumber - 1].classList.add('active');
    
    currentSlide = slideNumber;
    updateUI();
    
    setTimeout(() => {
        isTransitioning = false;
        // Clean up classes
        slides.forEach(slide => slide.classList.remove('prev'));
    }, 300);
}

// Update UI Elements
function updateUI() {
    // Update slide counter
    currentSlideSpan.textContent = currentSlide;
    
    // Update progress bar
    const progressPercentage = (currentSlide / totalSlides) * 100;
    progressFill.style.width = `${progressPercentage}%`;
    
    // Update navigation buttons
    prevBtn.disabled = currentSlide === 1;
    nextBtn.disabled = currentSlide === totalSlides;
    
    // Update page title based on current slide
    updatePageTitle();
    
    // Trigger slide-specific animations
    triggerSlideAnimations();
}

// Update Page Title Based on Current Slide
function updatePageTitle() {
    const slideTitles = [
        'Samo Farzandlari - Bilim kelajakka yo\'l',
        'Samo Farzandlari qanday loyiha?',
        'Sizga qanday yordam beradi?',
        'Nega ishonish kerak?',
        'Jamoam',
        'Ishtirokchilar uchun imkoniyatlar',
        'Savol/Javob',
        'Loyihaga qo\'shilish'
    ];
    
    document.title = `${slideTitles[currentSlide - 1]} | Samo Farzandlari`;
}

// Handle Keyboard Navigation
function handleKeyPress(event) {
    switch(event.key) {
        case 'ArrowRight':
        case ' ':
        case 'Enter':
            event.preventDefault();
            nextSlide();
            break;
        case 'ArrowLeft':
        case 'Backspace':
            event.preventDefault();
            prevSlide();
            break;
        case 'Home':
            event.preventDefault();
            goToSlide(1);
            break;
        case 'End':
            event.preventDefault();
            goToSlide(totalSlides);
            break;
        case 'Escape':
            event.preventDefault();
            toggleFullscreen();
            break;
    }
    
    // Number keys for direct navigation
    const num = parseInt(event.key);
    if (num >= 1 && num <= totalSlides) {
        event.preventDefault();
        goToSlide(num);
    }
}

// Setup Touch Gestures for Mobile
function setupTouchGestures() {
    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;
    const minSwipeDistance = 50;
    
    document.addEventListener('touchstart', function(event) {
        startX = event.touches[0].clientX;
        startY = event.touches[0].clientY;
    }, { passive: true });
    
    document.addEventListener('touchend', function(event) {
        endX = event.changedTouches[0].clientX;
        endY = event.changedTouches[0].clientY;
        
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        
        // Check if it's a horizontal swipe and not vertical
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
            if (deltaX > 0) {
                // Swipe right - go to previous slide
                prevSlide();
            } else {
                // Swipe left - go to next slide
                nextSlide();
            }
        }
    }, { passive: true });
}

// Trigger Slide-Specific Animations
function triggerSlideAnimations() {
    const activeSlide = slides[currentSlide - 1];
    const slideId = activeSlide.id;
    
    // Remove existing animation classes
    activeSlide.querySelectorAll('.animate-in').forEach(el => {
        el.classList.remove('animate-in');
    });
    
    // Add animation classes based on slide
    setTimeout(() => {
        switch(slideId) {
            case 'slide-1':
                animateHeroElements(activeSlide);
                break;
            case 'slide-2':
                animateServiceCards(activeSlide);
                break;
            case 'slide-3':
                animateBenefitsList(activeSlide);
                break;
            case 'slide-4':
                animateCEOSection(activeSlide);
                break;
            case 'slide-5':
                animateTeamMembers(activeSlide);
                break;
            case 'slide-6':
                animateOpportunityCards(activeSlide);
                break;
            case 'slide-7':
                animateQASection(activeSlide);
                break;
            case 'slide-8':
                animateJoinSection(activeSlide);
                break;
        }
    }, 100);
}

// Animation Functions for Different Slides
function animateHeroElements(slide) {
    const elements = [
        slide.querySelector('.logo-icon'),
        slide.querySelector('.main-title'),
        slide.querySelector('.main-subtitle'),
        slide.querySelector('.cta-button')
    ];
    
    elements.forEach((el, index) => {
        if (el) {
            setTimeout(() => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                
                setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, 50);
            }, index * 200);
        }
    });
}

function animateServiceCards(slide) {
    const cards = slide.querySelectorAll('.service-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px) scale(0.9)';
            card.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0) scale(1)';
            }, 50);
        }, index * 100);
    });
}

function animateBenefitsList(slide) {
    const benefits = slide.querySelectorAll('.benefit-item');
    benefits.forEach((benefit, index) => {
        setTimeout(() => {
            benefit.style.opacity = '0';
            benefit.style.transform = 'translateX(-30px)';
            benefit.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            
            setTimeout(() => {
                benefit.style.opacity = '1';
                benefit.style.transform = 'translateX(0)';
            }, 50);
        }, index * 150);
    });
}

function animateCEOSection(slide) {
    const profile = slide.querySelector('.ceo-profile');
    const achievements = slide.querySelector('.achievements');
    
    if (profile) {
        profile.style.opacity = '0';
        profile.style.transform = 'translateX(-50px)';
        profile.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        
        setTimeout(() => {
            profile.style.opacity = '1';
            profile.style.transform = 'translateX(0)';
        }, 200);
    }
    
    if (achievements) {
        achievements.style.opacity = '0';
        achievements.style.transform = 'translateX(50px)';
        achievements.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        
        setTimeout(() => {
            achievements.style.opacity = '1';
            achievements.style.transform = 'translateX(0)';
        }, 400);
    }
}

function animateTeamMembers(slide) {
    const members = slide.querySelectorAll('.team-member');
    members.forEach((member, index) => {
        setTimeout(() => {
            member.style.opacity = '0';
            member.style.transform = 'translateY(50px) rotate(5deg)';
            member.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            
            setTimeout(() => {
                member.style.opacity = '1';
                member.style.transform = 'translateY(0) rotate(0deg)';
            }, 50);
        }, index * 300);
    });
}

function animateOpportunityCards(slide) {
    const cards = slide.querySelectorAll('.opportunity-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.8) rotate(-5deg)';
            card.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'scale(1) rotate(0deg)';
            }, 50);
        }, index * 120);
    });
}

function animateQASection(slide) {
    const elements = [
        slide.querySelector('.qa-icon'),
        slide.querySelector('.slide-title'),
        slide.querySelector('.qa-subtitle'),
        slide.querySelector('.qr-placeholder'),
        slide.querySelector('.cta-button')
    ];
    
    elements.forEach((el, index) => {
        if (el) {
            setTimeout(() => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                el.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                
                setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, 50);
            }, index * 150);
        }
    });
}

function animateJoinSection(slide) {
    const elements = [
        slide.querySelector('.slide-title'),
        slide.querySelector('.contact-item'),
        slide.querySelector('.cta-text'),
        slide.querySelector('.cta-button'),
        slide.querySelector('.thank-you')
    ];
    
    elements.forEach((el, index) => {
        if (el) {
            setTimeout(() => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(40px)';
                el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                
                setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, 50);
            }, index * 200);
        }
    });
}

// Play Transition Sound (Optional)
function playTransitionSound() {
    // Create a subtle transition sound
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
}

// Handle Window Resize
function handleResize() {
    // Recalculate slide dimensions if needed
    // This ensures the presentation looks good on different screen sizes
    updateUI();
}

// Toggle Fullscreen Mode
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log(`Error attempting to enable fullscreen: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
}

// Auto-advance slides (Optional - can be enabled for demo mode)
function startAutoAdvance(intervalSeconds = 10) {
    const interval = setInterval(() => {
        if (currentSlide < totalSlides) {
            nextSlide();
        } else {
            clearInterval(interval);
        }
    }, intervalSeconds * 1000);
    
    return interval;
}

// Add Click Handlers for Interactive Elements
document.addEventListener('click', function(event) {
    // Handle CTA button clicks
    if (event.target.classList.contains('cta-button')) {
        handleCTAClick(event.target);
    }
    
    // Handle service card clicks
    if (event.target.closest('.service-card')) {
        handleServiceCardClick(event.target.closest('.service-card'));
    }
    
    // Handle team member clicks
    if (event.target.closest('.team-member')) {
        handleTeamMemberClick(event.target.closest('.team-member'));
    }
});

// Handle CTA Button Clicks
function handleCTAClick(button) {
    const buttonText = button.textContent.trim();
    
    // Add click animation
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 150);
    
    // Handle different CTA actions
    switch(buttonText) {
        case 'Boshlanish':
            nextSlide();
            break;
        case 'Savol berish':
            // Could open a modal or redirect to a form
            showNotification('Savol berish funksiyasi tez orada ishga tushadi!');
            break;
        case 'Hoziroq qo\'shilish':
            // Could redirect to Telegram or a signup form
            window.open('https://t.me/Obloberdiyev_2oo8', '_blank');
            break;
    }
}

// Handle Service Card Clicks
function handleServiceCardClick(card) {
    // Add click animation
    card.style.transform = 'scale(0.98)';
    setTimeout(() => {
        card.style.transform = 'scale(1)';
    }, 200);
    
    const serviceName = card.querySelector('h3').textContent;
    showNotification(`${serviceName} haqida batafsil ma'lumot tez orada!`);
}

// Handle Team Member Clicks
function handleTeamMemberClick(member) {
    // Add click animation
    member.style.transform = 'scale(0.98)';
    setTimeout(() => {
        member.style.transform = 'scale(1)';
    }, 200);
    
    const memberName = member.querySelector('h3').textContent;
    showNotification(`${memberName} bilan bog'lanish tez orada mumkin bo'ladi!`);
}

// Show Notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <i class="fas fa-info-circle"></i>
        <span>${message}</span>
    `;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #4A90E2 0%, #7B68EE 100%);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 8px 30px rgba(0,0,0,0.15);
        z-index: 2000;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-family: 'Poppins', sans-serif;
        font-weight: 500;
        transform: translateX(100%);
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Export functions for external use (if needed)
window.presentationControls = {
    nextSlide,
    prevSlide,
    goToSlide,
    getCurrentSlide: () => currentSlide,
    getTotalSlides: () => totalSlides,
    startAutoAdvance,
    toggleFullscreen
};