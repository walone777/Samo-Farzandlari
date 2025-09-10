// Global Variables
let currentSlide = 1;
const totalSlides = 9;
let isTransitioning = false;

// DOM Elements
const slides = document.querySelectorAll('.slide');
const nextBtn = document.getElementById('next-btn');
const prevBtn = document.getElementById('prev-btn');
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
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
    
    // Initialize Telegram Question Form
    initializeTelegramForm();
    
    // Initialize Theme
    initializeTheme();
    
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
    
    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);
    
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
        'Mundaraja',
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
    // Check if user is typing in an input field
    const activeElement = document.activeElement;
    const isInputFocused = activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA');
    
    // Don't handle keyboard navigation if user is typing in form fields
    if (isInputFocused) {
        return;
    }
    
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
        case 't':
        case 'T':
            event.preventDefault();
            toggleTheme();
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
                animateTOCElements(activeSlide);
                break;
            case 'slide-3':
                animateServiceCards(activeSlide);
                break;
            case 'slide-4':
                animateBenefitsList(activeSlide);
                break;
            case 'slide-5':
                animateCEOSection(activeSlide);
                break;
            case 'slide-6':
                animateTeamMembers(activeSlide);
                break;
            case 'slide-7':
                animateOpportunityCards(activeSlide);
                break;
            case 'slide-8':
                animateQASection(activeSlide);
                break;
            case 'slide-9':
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

function animateTOCElements(slide) {
    const title = slide.querySelector('.slide-title');
    const tocItems = slide.querySelectorAll('.toc-item');
    
    if (title) {
        title.style.opacity = '0';
        title.style.transform = 'translateY(30px)';
        title.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        
        setTimeout(() => {
            title.style.opacity = '1';
            title.style.transform = 'translateY(0)';
        }, 200);
    }
    
    tocItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px) scale(0.9)';
            item.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0) scale(1)';
            }, 50);
        }, 400 + (index * 100));
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

// Theme Management
function initializeTheme() {
    // Check for saved theme or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    
    // Show notification
    const message = newTheme === 'dark' ? 'Tungi rejim yoqildi 🌙' : 'Kunduzgi rejim yoqildi ☀️';
    showNotification(message);
    
    // Add click animation
    themeToggle.style.transform = 'scale(0.9)';
    setTimeout(() => {
        themeToggle.style.transform = 'scale(1)';
    }, 150);
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update icon
    if (theme === 'dark') {
        themeIcon.className = 'fas fa-sun';
        themeToggle.title = 'Kunduzgi rejim';
    } else {
        themeIcon.className = 'fas fa-moon';
        themeToggle.title = 'Tungi rejim';
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
    
    // Handle Telegram contact clicks
    if (event.target.closest('.contact-item')) {
        handleTelegramClick(event.target.closest('.contact-item'));
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
            // Redirect to Samo_Farzandlar Telegram channel
            window.open('https://t.me/Samo_Farzandlar', '_blank');
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

// Handle Telegram Contact Clicks
function handleTelegramClick(contactItem) {
    // Add click animation
    contactItem.style.transform = 'scale(0.98)';
    setTimeout(() => {
        contactItem.style.transform = 'scale(1)';
    }, 200);
    
    const telegramHandle = contactItem.querySelector('h3').textContent;
    const telegramUrl = `https://t.me/${telegramHandle.replace('@', '')}`;
    
    // Open Telegram link
    window.open(telegramUrl, '_blank');
    showNotification(`${telegramHandle} sahifasi yangi oynada ochilmoqda...`);
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
    
    // Get current theme
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${isDark ? 'linear-gradient(135deg, #5BA3F5 0%, #8B7BF7 100%)' : 'linear-gradient(135deg, #4A90E2 0%, #7B68EE 100%)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: ${isDark ? '0 8px 30px rgba(91, 163, 245, 0.3)' : '0 8px 30px rgba(0,0,0,0.15)'};
        z-index: 2000;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-family: 'Poppins', sans-serif;
        font-weight: 500;
        transform: translateX(100%);
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        max-width: 300px;
        border: ${isDark ? '1px solid rgba(91, 163, 245, 0.3)' : 'none'};
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

// Telegram Question Form Functionality
function initializeTelegramForm() {
    const BOT_TOKEN = "8364953237:AAEpf1pav8VmdUfv1_wGQg6DU03P0Umcj-Q";
    const ADMIN_CHAT_ID = "6781131482"; // Admin chat for receiving questions
    const USER_CHAT_ID = "6781131482"; // User chat for sending answers
    
    console.log('Telegram form initialization started...');
    
    // Global function for sending answers (can be called from console)
    window.sendAnswer = function(answer) {
        fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: USER_CHAT_ID,
                text: "✅ Taklifingizga javob: " + answer
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.ok) {
                console.log('Answer sent successfully to user:', answer);
            } else {
                console.error('Failed to send answer:', data);
            }
        })
        .catch(error => {
            console.error('Error sending answer:', error);
        });
    };
    
    const questionForm = document.getElementById('questionForm');
    if (!questionForm) {
        console.error('Question form not found!');
        return;
    }
    
    console.log('Question form found:', questionForm);
    
    questionForm.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Form submitted!');
        
        const questionInput = document.getElementById('question');
        const submitBtn = questionForm.querySelector('.submit-btn');
        
        if (!questionInput) {
            console.error('Question input not found!');
            return;
        }
        
        if (!submitBtn) {
            console.error('Submit button not found!');
            return;
        }
        
        const question = questionInput.value.trim();
        console.log('Suggestion text:', question);
        
        if (!question) {
            showFormMessage('Iltimos, taklifingizni yozing!', 'error');
            return;
        }
        
        // Disable form during submission
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Yuborilmoqda...';
        
        console.log('Sending to Telegram...');
        
        // Alternative method for CORS issues
        const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
        const messageData = {
            chat_id: ADMIN_CHAT_ID,
            text: `💡 Yangi taklif: ${question}`
        };
        
        // Send to Telegram with proper CORS handling
        fetch(telegramUrl, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            mode: 'cors',
            body: JSON.stringify(messageData)
        })
        .then(response => {
            console.log('Response status:', response.status);
            return response.json();
        })
        .then(data => {
            console.log('Telegram API response:', data);
            if (data.ok) {
                showFormMessage('Taklif muvaffaqiyatli yuborildi! ✅', 'success');
                questionInput.value = '';
            } else {
                console.error('Telegram API Error:', data);
                showFormMessage(`Xatolik: ${data.description || 'Noma\'lum xatolik'}`, 'error');
            }
        })
        .catch(error => {
            console.error('Network Error:', error);
            
            // Alternative method using proxy or different approach
            if (error.message.includes('CORS') || error.message.includes('fetch')) {
                // Show success message even if there's CORS issue
                // The message might still go through
                showFormMessage('Taklif yuborildi (CORS cheklov tufayli tasdiqlash imkonsiz) ✉️', 'success');
                questionInput.value = '';
            } else {
                showFormMessage('Tarmoq xatosi. Internetni tekshiring va qayta urinib ko\'ring.', 'error');
            }
        })
        .finally(() => {
            // Re-enable form
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Yuborish';
        });
    });
}

// Show Form Message
function showFormMessage(message, type) {
    // Remove existing message
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type}`;
    messageDiv.textContent = message;
    
    // Insert after form
    const formContainer = document.querySelector('.question-form-container');
    if (formContainer) {
        formContainer.appendChild(messageDiv);
        
        // Show with animation
        setTimeout(() => {
            messageDiv.classList.add('show');
        }, 100);
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.classList.remove('show');
                setTimeout(() => {
                    if (messageDiv.parentNode) {
                        messageDiv.remove();
                    }
                }, 300);
            }
        }, 5000);
    }
}
