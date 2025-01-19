// Konstanten für Animation
const ANIMATION_CONFIG = {
    projects: {
        selector: '.projects-text',
        animations: {
            forward: 'moveProjects',
            reverse: 'moveProjectsReverse'
        },
        fadeOutElements: '.fabio-text, .instagram-text, .email-text, .about-text',
        fadeInElements: '.projects-hub-text, .projects-hub-items'
    },
    about: {
        selector: '.about-text',
        animations: {
            forward: 'moveAbout',
            reverse: 'moveAboutReverse'
        },
        fadeOutElements: '.fabio-text, .instagram-text, .email-text, .projects-text',
        fadeInElements: '.about-hub-text, .about-hub-items'
    }
};


// Verbesserte Opacity-Funktion mit Promise
function toggleOpacity(elementsToHide, elementsToShow, delay = 1000) {
    return new Promise(resolve => {
        elementsToHide.forEach(el => {
            el.style.transition = 'opacity 0.3s';
            el.style.opacity = '0';
            el.style.visibility = 'hidden';
        });

        setTimeout(() => {
            elementsToShow.forEach(el => {
                requestAnimationFrame(() => {
                    el.style.transition = 'opacity 2s';
                    el.style.opacity = '1';
                    el.style.visibility = 'visible';
                });
            });
            resolve();
        }, delay);
    });
}

// Verbesserte Animation-Funktion
function toggleAnimation(element, animationName) {
    element.style.animation = 'none';
    element.offsetHeight; // Trigger reflow
    element.style.animation = `${animationName} 1s forwards`;
}

// Verbesserte Setup-Funktion
function setupSection(config) {
    const state = { isReversed: false };
    const trigger = document.querySelector(config.selector);
    
    if (!trigger) return console.warn(`Element ${config.selector} not found`);

    trigger.addEventListener('click', async (event) => {
        event.preventDefault();
        
        const fadeOutElements = document.querySelectorAll(config.fadeOutElements);
        const fadeInElements = document.querySelectorAll(config.fadeInElements);
        
        // Video neu starten wenn es der About-Bereich ist
        if (config.selector === '.about-text') {
            const video = document.getElementById('aboutVideo');
            if (video) {
                video.currentTime = 0; // Setzt Video auf Anfang
                video.play();          // Startet das Video
            }
        }

        toggleAnimation(
            trigger, 
            state.isReversed ? config.animations.reverse : config.animations.forward
        );

        await toggleOpacity(
            state.isReversed ? fadeInElements : fadeOutElements,
            state.isReversed ? fadeOutElements : fadeInElements
        );

        state.isReversed = !state.isReversed;
    });

    return state;
}

// Scroll Handler mit Debounce
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

// Verbesserte Scroll-Logik
const handleScroll = debounce(() => {
    const sections = document.querySelectorAll('.section');
    const scrollPosition = window.scrollY + window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // Prüfe ob Ende der Seite erreicht wurde
    if (Math.abs(scrollPosition - documentHeight) < 10) { // Toleranz hinzugefügt
        setTimeout(() => {
            window.scrollTo({
                top: 0,
                behavior: 'instant'
            });
        }, 0);
    }

    sections.forEach(project => {
        if (scrollPosition > project.offsetTop + 100) {
            project.classList.add('show');
        }
    });
}, 100);

// Touch-Events für Smartphones
document.addEventListener('touchmove', (e) => {
    const scrollPosition = window.scrollY + window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    if (Math.abs(scrollPosition - documentHeight) < 10) {
        setTimeout(() => {
            window.scrollTo({
                top: 0,
                behavior: 'instant'
            });
        }, 0);
    }
}, { passive: true });

// Initialisierung
document.addEventListener('DOMContentLoaded', () => {
    // Setup sections
    const projectsState = setupSection(ANIMATION_CONFIG.projects);
    const aboutState = setupSection(ANIMATION_CONFIG.about);

    // Setup scroll handlers
    window.addEventListener('scroll', handleScroll);

    // Setup wheel event mit Throttle
    let isThrottled = false;
    document.addEventListener('wheel', (e) => {
        if (isThrottled) return;
        isThrottled = true;
        setTimeout(() => isThrottled = false, 600);

        e.preventDefault();
        const sections = document.querySelectorAll('.section');
        const currentSectionIndex = Math.round(window.scrollY / window.innerHeight);
        const nextSectionIndex = Math.max(0, 
            Math.min(
                sections.length - 1,
                currentSectionIndex + (e.deltaY > 0 ? 1 : -1)
            )
        );

        window.scrollTo({
            top: nextSectionIndex * window.innerHeight,
            behavior: 'instant'
        });
    }, { passive: false });
});

document.addEventListener("DOMContentLoaded", () => {
    // Alle Sections auswählen
    const sections = document.querySelectorAll('.section');
    const infoElement = document.querySelector('.projects-title'); // Klasse statt ID
    const dateElement = document.querySelector('.projects-date');  // Klasse statt ID

    // Intersection Observer erstellen
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Ändere den Text basierend auf der sichtbaren Section
                updateInfoText(entry.target);
            }
        });
    }, {
        threshold: 0.5 // 50% der Section muss sichtbar sein
    });

    // Jede Section beobachten
    sections.forEach(section => {
        observer.observe(section);
    });

    // Funktion zur Textaktualisierung
    function updateInfoText(section) {
        if (section.classList.contains('fn5')) {
            infoElement.textContent = "BRAND IDENTITY";
        } else if (section.classList.contains('collage')) {
            infoElement.textContent = "COLLAGE ART";
        } else if (section.classList.contains('vinyl')) {
            infoElement.textContent = "VINYL ART";
        } else if (section.classList.contains('cover')) {
            infoElement.textContent = "COVER ART";
        } else if (section.classList.contains('shift')) {
            infoElement.textContent = "EDITORIAL DESIGN";
        }
        
    }
});








