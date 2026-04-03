// script.js - Enhanced JavaScript for Ruby Li personal website with improved code quality
// Fixes code quality issues identified in Task 7 review

// Constants for maintainability and readability
const BREAKPOINT = 1024; // Mobile breakpoint in pixels (matches CSS media query)
const DEBOUNCE_TIME = 250; // Debounce time in milliseconds for resize events
const SCROLL_OFFSET = 20; // Offset for smooth scrolling in pixels

// DOM ready handler
document.addEventListener('DOMContentLoaded', function() {
    // Cache DOM references
    const sidebar = document.querySelector('.sidebar');
    const content = document.querySelector('.content');
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');

    // Check if essential elements exist
    if (!sidebar || !content) {
        console.error('Essential DOM elements not found');
        return;
    }

    // Disable CSS smooth scrolling to avoid conflict with JavaScript implementation
    document.documentElement.style.scrollBehavior = 'auto';

    // Smooth scrolling for anchor links with accessibility considerations
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Skip if it's just "#" or external link
            if (href === '#' || href.startsWith('#!')) return;

            e.preventDefault();

            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                // Check for prefers-reduced-motion preference
                const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

                window.scrollTo({
                    top: targetElement.offsetTop - SCROLL_OFFSET,
                    behavior: prefersReducedMotion ? 'auto' : 'smooth'
                });
            }
        });
    });

    // Active section highlighting
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.sidebar-nav a');

    const updateActiveNav = () => {
        let currentSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (window.scrollY >= sectionTop - 100 &&
                window.scrollY < sectionTop + sectionHeight - 100) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    };

    // Update on scroll
    window.addEventListener('scroll', updateActiveNav);

    // Initial update
    updateActiveNav();

    // Mobile menu functionality
    let mobileMenuToggle = null;
    let resizeTimeout = null;

    // Create mobile menu toggle button
    const createMobileToggle = () => {
        if (mobileMenuToggle) return mobileMenuToggle;

        const toggleButton = document.createElement('button');
        toggleButton.className = 'mobile-menu-toggle';
        toggleButton.innerHTML = '<i class="fas fa-bars"></i> Menu';
        toggleButton.setAttribute('aria-label', 'Toggle navigation menu');
        toggleButton.setAttribute('aria-expanded', 'false');
        toggleButton.setAttribute('aria-controls', 'sidebar');

        // Add keyboard navigation
        toggleButton.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });

        // Toggle sidebar visibility with accessibility
        toggleButton.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            const newExpandedState = !isExpanded;

            this.setAttribute('aria-expanded', newExpandedState.toString());

            if (newExpandedState) {
                sidebar.classList.remove('mobile-hidden');
                this.innerHTML = '<i class="fas fa-times"></i> Close Menu';
                // Focus management for accessibility
                sidebar.setAttribute('tabindex', '-1');
                sidebar.focus();
            } else {
                sidebar.classList.add('mobile-hidden');
                this.innerHTML = '<i class="fas fa-bars"></i> Menu';
                this.focus();
            }
        });

        mobileMenuToggle = toggleButton;
        return toggleButton;
    };

    // Initialize mobile menu based on viewport
    const initMobileMenu = () => {
        const isMobileView = window.innerWidth <= BREAKPOINT;

        if (isMobileView) {
            // Ensure mobile toggle exists
            let toggleButton = document.querySelector('.mobile-menu-toggle');
            if (!toggleButton) {
                toggleButton = createMobileToggle();
                sidebar.parentNode.insertBefore(toggleButton, sidebar);
            }

            // Hide sidebar initially on mobile
            sidebar.classList.add('mobile-hidden');
            toggleButton.setAttribute('aria-expanded', 'false');
        } else {
            // Remove mobile toggle if exists
            const toggleButton = document.querySelector('.mobile-menu-toggle');
            if (toggleButton) {
                toggleButton.remove();
                mobileMenuToggle = null;
            }

            // Ensure sidebar is visible on desktop
            sidebar.classList.remove('mobile-hidden');
        }
    };

    // Initialize on load
    initMobileMenu();

    // Update mobile menu on window resize with debouncing
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(initMobileMenu, DEBOUNCE_TIME);
    }, { passive: true });

    // Development mode check for console logging
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('Ruby Li personal website JavaScript loaded successfully with enhanced features');
    }
});