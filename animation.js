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
        
        if (config.selector === '.projects-text') {
            playAllVideos();
        } else if (config.selector === '.about-text') {
            const video = document.getElementById('aboutVideo');
            if (video) {
                video.currentTime = 0;
                video.play().catch(error => {
                    console.log("Auto-play prevented");
                });
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

// Setup scroll handlers
window.addEventListener('scroll', handleScroll);

// Funktion zum Erkennen von mobilen Geräten
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Vereinfachte Scroll-Funktion
function scrollToSection(direction) {
    const sections = document.querySelectorAll('.section');
    const currentIndex = Math.round(window.scrollY / window.innerHeight);
    const nextIndex = Math.max(0, Math.min(
        sections.length - 1,
        currentIndex + direction
    ));

    window.scrollTo({
        top: nextIndex * window.innerHeight,
        behavior: isMobileDevice() ? 'instant' : 'instant'
    });
}

// Desktop Wheel Event
let isThrottled = false;
document.addEventListener('wheel', (e) => {
    if (isThrottled) return;
    isThrottled = true;
    
    e.preventDefault();
    scrollToSection(e.deltaY > 0 ? 1 : -1);
    
    setTimeout(() => isThrottled = false, 600);
}, { passive: false });

// Mobile Touch Events
if (isMobileDevice()) {
    let touchStartY = 0;
    
    document.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
        const touchEndY = e.changedTouches[0].clientY;
        const swipeDistance = touchStartY - touchEndY;
        
        if (Math.abs(swipeDistance) > 50) {
            scrollToSection(swipeDistance > 0 ? 1 : -1);
        }
    }, { passive: true });
}

// Initialisierung
document.addEventListener('DOMContentLoaded', () => {
    playAllVideos();
    const projectsState = setupSection(ANIMATION_CONFIG.projects);
    const aboutState = setupSection(ANIMATION_CONFIG.about);
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

function playAllVideos() {
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
        // Sicherstellen, dass das Video geladen ist
        if (video.readyState >= 2) {
            video.currentTime = 0;
            const playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log("Auto-play prevented");
                });
            }
        } else {
            // Wenn Video noch nicht geladen, warten und dann abspielen
            video.addEventListener('loadeddata', () => {
                video.currentTime = 0;
                const playPromise = video.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        console.log("Auto-play prevented");
                    });
                }
            });
        }
    });
}








