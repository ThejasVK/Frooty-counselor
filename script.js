// ===== DOM Elements =====
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
const backToTop = document.getElementById('back-to-top');
const contactForm = document.getElementById('contact-form');

// ===== Navbar Scroll Effect =====
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add scrolled class when page is scrolled
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Show/hide back to top button
    if (currentScroll > 500) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
    
    lastScroll = currentScroll;
});

// ===== Mobile Navigation =====
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
});

// Close mobile nav when clicking a link
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Close mobile nav when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// ===== Smooth Scroll for Navigation Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== Back to Top Button =====
backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ===== Active Navigation Link on Scroll =====
const sections = document.querySelectorAll('section[id]');

function highlightNavLink() {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);
        
        if (navLink) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLink.classList.add('active');
            } else {
                navLink.classList.remove('active');
            }
        }
    });
}

window.addEventListener('scroll', highlightNavLink);

// ===== Testimonials Slider =====
const testimonialsSlider = document.querySelector('.testimonials-slider');
const testimonialCards = document.querySelectorAll('.testimonial-card');
const dots = document.querySelectorAll('.testimonial-dots .dot');
const prevBtn = document.getElementById('testimonialPrev');
const nextBtn = document.getElementById('testimonialNext');
let currentTestimonial = 0;
let testimonialsPerView = 3;

function updateTestimonialsPerView() {
    if (window.innerWidth <= 768) {
        testimonialsPerView = 1;
    } else if (window.innerWidth <= 1024) {
        testimonialsPerView = 2;
    } else {
        testimonialsPerView = 3;
    }
}

function updateTestimonialSlider() {
    updateTestimonialsPerView();
    const maxIndex = Math.max(0, testimonialCards.length - testimonialsPerView);
    currentTestimonial = Math.min(currentTestimonial, maxIndex);
    
    if (testimonialsSlider) {
        const cardWidth = testimonialCards[0]?.offsetWidth || 0;
        const gap = 30;
        const offset = currentTestimonial * (cardWidth + gap);
        testimonialsSlider.style.transform = `translateX(-${offset}px)`;
    }
    
    // Update dots
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentTestimonial);
    });
}

function nextTestimonial() {
    updateTestimonialsPerView();
    const maxIndex = Math.max(0, testimonialCards.length - testimonialsPerView);
    currentTestimonial = currentTestimonial >= maxIndex ? 0 : currentTestimonial + 1;
    updateTestimonialSlider();
}

function prevTestimonial() {
    updateTestimonialsPerView();
    const maxIndex = Math.max(0, testimonialCards.length - testimonialsPerView);
    currentTestimonial = currentTestimonial <= 0 ? maxIndex : currentTestimonial - 1;
    updateTestimonialSlider();
}

if (nextBtn) nextBtn.addEventListener('click', nextTestimonial);
if (prevBtn) prevBtn.addEventListener('click', prevTestimonial);

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentTestimonial = index;
        updateTestimonialSlider();
    });
});

// Auto-slide for testimonials
let testimonialInterval;

function startTestimonialAutoSlide() {
    testimonialInterval = setInterval(nextTestimonial, 5000);
}

function stopTestimonialAutoSlide() {
    clearInterval(testimonialInterval);
}

// Pause on hover
if (testimonialsSlider) {
    testimonialsSlider.addEventListener('mouseenter', stopTestimonialAutoSlide);
    testimonialsSlider.addEventListener('mouseleave', startTestimonialAutoSlide);
}

// Initialize and handle resize
window.addEventListener('resize', () => {
    updateTestimonialSlider();
});

updateTestimonialSlider();
startTestimonialAutoSlide();

// ===== Contact Form Handling =====
contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);
    
    // Simple validation
    if (!data.name || !data.email || !data.service || !data.message) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showNotification('Please enter a valid email address.', 'error');
        return;
    }
    
    // Simulate form submission
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalContent = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        showNotification('Thank you for your message! Dr. Hebbar will get back to you soon.', 'success');
        this.reset();
        submitBtn.innerHTML = originalContent;
        submitBtn.disabled = false;
    }, 1500);
});

// ===== Notification System =====
function showNotification(message, type = 'success') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#10B981' : '#EF4444'};
        color: white;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 400px;
    `;
    
    // Add animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Close button styling
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 5px;
        margin-left: auto;
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Close functionality
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// ===== Intersection Observer for Animations =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.service-card, .timeline-item, .affiliation-card, .testimonial-card, .info-card').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});

// ===== Stats Counter Animation =====
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start) + '+';
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + '+';
        }
    }
    
    updateCounter();
}

// Observe stats section
const statsSection = document.querySelector('.hero-stats');
if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach(stat => {
                    const text = stat.textContent;
                    if (text.includes('+')) {
                        const number = parseInt(text);
                        if (!isNaN(number)) {
                            animateCounter(stat, number);
                        }
                    }
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statsObserver.observe(statsSection);
}

// ===== Preloader (Optional) =====
window.addEventListener('load', () => {
    const loader = document.querySelector('.loading');
    if (loader) {
        loader.classList.add('hidden');
        setTimeout(() => loader.remove(), 500);
    }
});

// ===== Service Card Hover Effect =====
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = '';
    });
});

// ===== Parallax Effect on Hero (Subtle) =====
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero && scrolled < hero.offsetHeight) {
        const heroImage = document.querySelector('.hero-image');
        if (heroImage) {
            heroImage.style.transform = `translateY(${scrolled * 0.1}px)`;
        }
    }
});

// ===== Box Breathing Exercise =====
const breathCircle = document.getElementById('breathCircle');
const breathInstruction = document.getElementById('breathInstruction');
const breathTimer = document.getElementById('breathTimer');
const startBreathingBtn = document.getElementById('startBreathing');
const stopBreathingBtn = document.getElementById('stopBreathing');
const cycleCountEl = document.getElementById('cycleCount');
const boxBorderLine = document.getElementById('boxBorderLine');
const sideTop = document.getElementById('sideTop');
const sideRight = document.getElementById('sideRight');
const sideBottom = document.getElementById('sideBottom');
const sideLeft = document.getElementById('sideLeft');

let breathingInterval = null;
let timerInterval = null;
let cycleCount = 0;
let isBreathing = false;

// Border perimeter: 4 sides of ~280px each = ~1120px
const borderPerimeter = 1120;
const quarterPerimeter = borderPerimeter / 4; // 280px per side

const breathingPhases = [
    { name: 'Inhale', class: 'inhale', duration: 4000, side: 'top', borderStart: 0, borderEnd: quarterPerimeter },
    { name: 'Hold', class: 'hold-in', duration: 4000, side: 'right', borderStart: quarterPerimeter, borderEnd: quarterPerimeter * 2 },
    { name: 'Exhale', class: 'exhale', duration: 4000, side: 'bottom', borderStart: quarterPerimeter * 2, borderEnd: quarterPerimeter * 3 },
    { name: 'Hold', class: 'hold-out', duration: 4000, side: 'left', borderStart: quarterPerimeter * 3, borderEnd: borderPerimeter }
];

function clearActiveSides() {
    [sideTop, sideRight, sideBottom, sideLeft].forEach(side => {
        if (side) side.classList.remove('active');
    });
}

function setActiveSide(sideName) {
    clearActiveSides();
    const sideElements = { top: sideTop, right: sideRight, bottom: sideBottom, left: sideLeft };
    if (sideElements[sideName]) {
        sideElements[sideName].classList.add('active');
    }
}

function animateBorder(startOffset, endOffset, duration) {
    if (!boxBorderLine) return;
    
    // Set starting position
    boxBorderLine.style.strokeDashoffset = borderPerimeter - startOffset;
    
    // Force reflow to ensure the starting position is applied
    boxBorderLine.getBoundingClientRect();
    
    // Add transition class and animate to end position
    boxBorderLine.classList.add('animating');
    boxBorderLine.style.strokeDashoffset = borderPerimeter - endOffset;
}

function resetBorder() {
    if (!boxBorderLine) return;
    boxBorderLine.classList.remove('animating');
    boxBorderLine.style.strokeDashoffset = borderPerimeter;
}

function startBreathing() {
    if (isBreathing) return;
    isBreathing = true;
    cycleCount = 0;
    if (cycleCountEl) cycleCountEl.textContent = cycleCount;
    
    if (startBreathingBtn) startBreathingBtn.style.display = 'none';
    if (stopBreathingBtn) stopBreathingBtn.style.display = 'inline-flex';
    
    // Reset border
    resetBorder();
    
    let phaseIndex = 0;
    
    function runPhase() {
        if (!isBreathing) return;
        
        const phase = breathingPhases[phaseIndex];
        
        // Update visual
        if (breathCircle) breathCircle.className = 'breath-circle ' + phase.class;
        if (breathInstruction) breathInstruction.textContent = phase.name;
        
        // Set active side
        setActiveSide(phase.side);
        
        // Animate border for this phase
        animateBorder(phase.borderStart, phase.borderEnd, phase.duration);
        
        // Timer countdown
        let timeLeft = phase.duration / 1000;
        if (breathTimer) breathTimer.textContent = timeLeft;
        
        if (timerInterval) clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            timeLeft--;
            if (timeLeft >= 0 && breathTimer) {
                breathTimer.textContent = timeLeft;
            }
        }, 1000);
        
        // Move to next phase
        breathingInterval = setTimeout(() => {
            phaseIndex++;
            if (phaseIndex >= breathingPhases.length) {
                phaseIndex = 0;
                cycleCount++;
                if (cycleCountEl) cycleCountEl.textContent = cycleCount;
                
                // Reset border for new cycle
                if (boxBorderLine) {
                    boxBorderLine.classList.remove('animating');
                    boxBorderLine.style.strokeDashoffset = borderPerimeter;
                    // Force reflow
                    boxBorderLine.getBoundingClientRect();
                }
                
                if (cycleCount >= 4) {
                    stopBreathing();
                    showNotification('Great job! You completed 4 breathing cycles. Feel the calm. 🧘', 'success');
                    return;
                }
            }
            runPhase();
        }, phase.duration);
    }
    
    runPhase();
}

function stopBreathing() {
    isBreathing = false;
    clearTimeout(breathingInterval);
    clearInterval(timerInterval);
    
    if (breathCircle) breathCircle.className = 'breath-circle';
    if (breathInstruction) breathInstruction.textContent = 'Click Start';
    if (breathTimer) breathTimer.textContent = '4';
    
    clearActiveSides();
    resetBorder();
    
    if (startBreathingBtn) startBreathingBtn.style.display = 'inline-flex';
    if (stopBreathingBtn) stopBreathingBtn.style.display = 'none';
}

if (startBreathingBtn) {
    startBreathingBtn.addEventListener('click', startBreathing);
}

if (stopBreathingBtn) {
    stopBreathingBtn.addEventListener('click', stopBreathing);
}

// ===== 5-4-3-2-1 Grounding Exercise =====
const groundingSteps = document.querySelectorAll('.grounding-step');
const groundingMessage = document.getElementById('groundingMessage');

const groundingMessages = {
    1: 'Look around you. Name <strong>5 things you can see</strong> right now. Notice their colors, shapes, and details.',
    2: 'Focus on <strong>4 things you can physically touch</strong>. Feel the texture of your clothes, the surface beneath you.',
    3: 'Listen carefully. What <strong>3 sounds can you hear</strong>? Maybe distant traffic, your own breathing, or a clock ticking.',
    4: 'Take a deep breath. Can you notice <strong>2 things you can smell</strong>? Even subtle scents count.',
    5: 'Finally, focus on <strong>1 thing you can taste</strong>. The lingering taste of your last drink or meal.'
};

let currentGroundingStep = 1;
let completedGroundingSteps = [];

groundingSteps.forEach(step => {
    step.addEventListener('click', () => {
        const stepNum = parseInt(step.dataset.step);
        
        // Update active state
        groundingSteps.forEach(s => s.classList.remove('active'));
        step.classList.add('active');
        
        // Mark previous steps as completed
        groundingSteps.forEach(s => {
            const num = parseInt(s.dataset.step);
            if (num < stepNum) {
                s.classList.add('completed');
            }
        });
        
        // Update message
        if (groundingMessage) {
            groundingMessage.innerHTML = `<p>${groundingMessages[stepNum]}</p>`;
        }
        
        // Check if all steps completed
        if (stepNum === 5 && !completedGroundingSteps.includes(5)) {
            completedGroundingSteps.push(5);
            setTimeout(() => {
                groundingMessage.innerHTML = `
                    <p>🌟 <strong>Wonderful!</strong> You've completed the grounding exercise. 
                    Notice how you feel more present and centered. You can use this technique 
                    anytime you feel overwhelmed or anxious.</p>
                `;
            }, 3000);
        }
        
        currentGroundingStep = stepNum;
    });
});

// ===== Sign Cards Animation =====
document.querySelectorAll('.sign-card').forEach(card => {
    card.addEventListener('click', () => {
        card.style.transform = 'scale(0.98)';
        setTimeout(() => {
            card.style.transform = '';
        }, 150);
    });
});

// ===== Wellness Tip Cards Animation =====
document.querySelectorAll('.wellness-tip-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.querySelector('.tip-icon').style.transform = 'rotateY(180deg) scale(1.1)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.querySelector('.tip-icon').style.transform = '';
    });
});

// ===== Why Card Hover Effects =====
document.querySelectorAll('.why-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        const icon = this.querySelector('.why-icon');
        if (icon) {
            icon.style.transform = 'scale(1.1) rotate(10deg)';
        }
    });
    
    card.addEventListener('mouseleave', function() {
        const icon = this.querySelector('.why-icon');
        if (icon) {
            icon.style.transform = '';
        }
    });
});

// ===== Scroll Animation for New Sections =====
const newSectionElements = document.querySelectorAll('.sign-card, .wellness-tip-card, .why-card');
newSectionElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    observer.observe(el);
});

// ===== Console Message =====
console.log('%c🌿 Welcome to Dr. Hebbar Jyoti Mohan\'s Website', 'color: #6B8E7B; font-size: 16px; font-weight: bold;');
console.log('%cBuilt with care for mental health awareness', 'color: #9CA3AF; font-size: 12px;');

