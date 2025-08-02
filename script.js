// Portfolio Website JavaScript
console.log('Script loaded successfully!');

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links with full viewport positioning
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const href = this.getAttribute('href');
            
            // Special handling for About and YouTube sections to show full viewport
            if (href === '#about' || href === '#youtube') {
                const navHeight = document.querySelector('nav').offsetHeight;
                const targetPosition = target.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            } else {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Active navigation link highlighting
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Enhanced scroll-triggered animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            // Add staggered animation delay
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, index * 100);
        }
    });
}, observerOptions);

// Skill bars animation with counter effect
const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const skillBars = entry.target.querySelectorAll('.skill-progress');
            skillBars.forEach((bar, index) => {
                const width = bar.style.width;
                bar.style.width = '0%';
                setTimeout(() => {
                    bar.style.width = width;
                    // Add ripple effect
                    createRippleEffect(bar);
                }, 100 + (index * 200));
            });
        }
    });
}, observerOptions);

// Observe skills section
const skillsSection = document.querySelector('.skills');
if (skillsSection) {
    skillsObserver.observe(skillsSection);
}

// Counter animation for stats
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

// Stats counter animation
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number, .youtube-stat-number');
            statNumbers.forEach(stat => {
                const target = parseInt(stat.textContent.replace('+', ''));
                animateCounter(stat, target);
            });
        }
    });
}, observerOptions);

// Observe stats sections
document.querySelectorAll('.about-stats, .youtube-stats').forEach(section => {
    statsObserver.observe(section);
});

// Ripple effect for interactive elements
function createRippleEffect(element) {
    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    `;
    
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = '50%';
    ripple.style.top = '50%';
    ripple.style.transform = 'translate(-50%, -50%) scale(0)';
    
    element.style.position = 'relative';
    element.appendChild(ripple);
    
    // Remove ripple after animation
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Add ripple effect to buttons
document.querySelectorAll('.btn, .project-card, .tool-item').forEach(element => {
    element.addEventListener('click', function(e) {
        createRippleEffect(this);
    });
});

// Handle project "View Code" button clicks
function initProjectButtons() {
    const projectLinks = document.querySelectorAll('.project-link');
    
    projectLinks.forEach(link => {
        // Check if this is a "View Code" link
        if (link.textContent.includes('View Code')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Find the parent project card
                const projectCard = this.closest('.project-card');
                const projectContent = projectCard.querySelector('.project-content');
                
                // Create or update the internal git message
                let internalGitMessage = projectCard.querySelector('.internal-git-message');
                
                if (!internalGitMessage) {
                    internalGitMessage = document.createElement('div');
                    internalGitMessage.className = 'internal-git-message';
                    internalGitMessage.innerHTML = `
                        <div class="internal-git-content">
                            <i class="fas fa-lock"></i>
                            <span>Code available on company's internal Git repository</span>
                        </div>
                    `;
                    
                    // Add styles
                    internalGitMessage.style.cssText = `
                        background: rgba(99, 102, 241, 0.1);
                        border: 1px solid rgba(99, 102, 241, 0.3);
                        border-radius: 0.5rem;
                        padding: 1rem;
                        margin-top: 1rem;
                        opacity: 0;
                        transform: translateY(-10px);
                        transition: all 0.3s ease;
                    `;
                    
                    projectContent.appendChild(internalGitMessage);
                }
                
                // Animate the message in
                setTimeout(() => {
                    internalGitMessage.style.opacity = '1';
                    internalGitMessage.style.transform = 'translateY(0)';
                }, 100);
                
                // Auto-hide after 4 seconds
                setTimeout(() => {
                    if (internalGitMessage) {
                        internalGitMessage.style.opacity = '0';
                        internalGitMessage.style.transform = 'translateY(-10px)';
                        setTimeout(() => {
                            if (internalGitMessage.parentNode) {
                                internalGitMessage.parentNode.removeChild(internalGitMessage);
                            }
                        }, 300);
                    }
                }, 4000);
            });
        }
    });
}

// Parallax scrolling effect (fixed to prevent overlapping)
function initParallax() {
    const heroElement = document.querySelector('.hero');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        // Only apply parallax to hero section to prevent overlapping
        if (heroElement) {
            const rate = scrolled * -0.2; // Reduced intensity
            heroElement.style.transform = `translateY(${rate}px)`;
        }
    });
}

// Particle animation for hero section
function createParticles() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: var(--primary-color);
            border-radius: 50%;
            opacity: 0.1;
            pointer-events: none;
            animation: float ${5 + Math.random() * 10}s ease-in-out infinite;
        `;
        
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 5 + 's';
        
        hero.appendChild(particle);
    }
}

// YouTube section enhancements
function initYouTubeSection() {
    const youtubeSection = document.querySelector('.youtube-section');
    if (!youtubeSection) return;
    
    // Add hover effect to YouTube icon
    const youtubeIcon = document.querySelector('.youtube-icon-container');
    if (youtubeIcon) {
        youtubeIcon.addEventListener('mouseenter', () => {
            youtubeIcon.style.transform = 'scale(1.1) rotateY(15deg)';
        });
        
        youtubeIcon.addEventListener('mouseleave', () => {
            youtubeIcon.style.transform = 'scale(1) rotateY(0deg)';
        });
    }
    
    // Animate topic tags
    const topicTags = document.querySelectorAll('.topic-tag');
    topicTags.forEach((tag, index) => {
        tag.style.animationDelay = (index * 0.1) + 's';
        tag.addEventListener('mouseenter', () => {
            tag.style.transform = 'translateY(-5px) scale(1.05)';
        });
        tag.addEventListener('mouseleave', () => {
            tag.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Enhance project cards with tilt effect
function initProjectTiltEffect() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const rotateX = (e.clientY - centerY) / 10;
            const rotateY = (centerX - e.clientX) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
        });
    });
}

// Add fade-in animation to elements
function initFadeInAnimations() {
    const animatedElements = document.querySelectorAll(
        '.project-card, .timeline-item, .stat, .youtube-stat, .skill-item, .tool-item, .cert-item'
    );
    
    animatedElements.forEach(element => {
        element.classList.add('fade-in-on-scroll');
        fadeInObserver.observe(element);
    });
}

// Contact form handling with enhanced UI
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');
        
        // Simple validation
        if (!name || !email || !subject || !message) {
            showNotification('Please fill in all fields.', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }
        
        // Simulate form submission with loading animation
        const submitButton = this.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitButton.disabled = true;
        
        // Add form loading state
        this.classList.add('form-loading');
        
        // Simulate API call delay
        setTimeout(() => {
            showNotification('Thank you for your message! I\'ll get back to you soon.', 'success');
            this.reset();
            this.classList.remove('form-loading');
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
            
            // Add success animation to form
            this.classList.add('form-success');
            setTimeout(() => {
                this.classList.remove('form-success');
            }, 2000);
        }, 2000);
    });
}

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Enhanced notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.75rem;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        opacity: 0;
        transform: translateX(100%) scale(0.8);
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        max-width: 400px;
        backdrop-filter: blur(10px);
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0) scale(1)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        removeNotification(notification);
    }, 5000);
    
    // Close button functionality
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => {
        removeNotification(notification);
    });
}

function removeNotification(notification) {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(100%) scale(0.8)';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 400);
}

// Theme toggle functionality
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    
    if (!themeToggle) {
        console.error('Theme toggle button not found!');
        return;
    }
    
    const themeIcon = themeToggle.querySelector('i');
    const themeText = themeToggle.querySelector('span');
    
    if (!themeIcon || !themeText) {
        console.error('Theme toggle icon or text not found!');
        return;
    }
    
    // Check for saved theme preference or default to 'dark'
    const currentTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    // Update button text and icon
    updateThemeButton(currentTheme, themeIcon, themeText);
    
    // Theme toggle event listener with animation
    themeToggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const newTheme = current === 'dark' ? 'light' : 'dark';
        
        // Add transition class for smooth theme change
        document.body.classList.add('theme-transition');
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeButton(newTheme, themeIcon, themeText);
        
        // Remove transition class after animation
        setTimeout(() => {
            document.body.classList.remove('theme-transition');
        }, 300);
        
        console.log('Theme switched to:', newTheme);
    });
    
    console.log('Theme toggle initialized. Current theme:', currentTheme);
}

function updateThemeButton(theme, icon, text) {
    if (theme === 'dark') {
        icon.className = 'fas fa-sun';
        text.textContent = 'Light';
    } else {
        icon.className = 'fas fa-moon';
        text.textContent = 'Dark';
    }
}

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize all enhancements
function initEnhancements() {
    createParticles();
    initParallax();
    initYouTubeSection();
    initProjectTiltEffect();
    initFadeInAnimations();
    initProjectButtons();
}

// Page load optimization
document.addEventListener('DOMContentLoaded', () => {
    // Remove loading state
    document.body.classList.remove('loading');
    
    // Initialize theme toggle
    initTheme();
    
    // Initialize all enhancements
    initEnhancements();
    
    // Initialize all components
    console.log('Enhanced portfolio website loaded successfully!');
});

// Add CSS for new animations
const additionalCSS = `
@keyframes ripple {
    to {
        transform: translate(-50%, -50%) scale(4);
        opacity: 0;
    }
}

.theme-transition * {
    transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease !important;
}

.form-loading {
    opacity: 0.7;
    pointer-events: none;
}

.form-success {
    animation: formSuccess 0.5s ease;
}

@keyframes formSuccess {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.02); }
}

.notification-content {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.notification-close {
    background: none;
    border: none;
    color: white;
    font-size: 1.25rem;
    cursor: pointer;
    padding: 0;
    margin-left: auto;
}

.particle {
    will-change: transform;
}

.internal-git-content {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: var(--primary-color);
    font-weight: 500;
    font-size: 0.875rem;
}

.internal-git-content i {
    font-size: 1rem;
}

[data-theme="dark"] .internal-git-message {
    background: rgba(139, 92, 246, 0.1) !important;
    border-color: rgba(139, 92, 246, 0.3) !important;
}

[data-theme="dark"] .internal-git-content {
    color: var(--primary-color) !important;
}
`;

// Inject additional CSS
const style = document.createElement('style');
style.textContent = additionalCSS;
document.head.appendChild(style);

// Error handling
window.addEventListener('error', (e) => {
    console.error('An error occurred:', e.error);
});

// Unhandled promise rejection handling
window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    e.preventDefault();
});
