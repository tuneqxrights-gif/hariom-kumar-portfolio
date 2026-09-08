"use strict";

/* =================================
   1. Element References
================================= */

const header = document.getElementById("header");
const menuToggle = document.getElementById("menuToggle");
const navLinksContainer = document.getElementById("navLinks");
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("main section[id]");
const revealElements = document.querySelectorAll(".reveal");
const tiltCards = document.querySelectorAll(".tilt-card");
const mouseGlow = document.querySelector(".mouse-glow");
const typingText = document.getElementById("typingText");

/* =================================
   2. Header Scroll Effect
================================= */

function updateHeader() {
    if (!header) return;

    header.classList.toggle("scrolled", window.scrollY > 30);
}

updateHeader();

window.addEventListener("scroll", updateHeader, {
    passive: true
});

/* =================================
   3. Mobile Navigation
================================= */

function closeMobileMenu() {
    if (!menuToggle || !navLinksContainer) return;

    menuToggle.classList.remove("active");
    navLinksContainer.classList.remove("open");
    document.body.classList.remove("menu-open");

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
}

function openMobileMenu() {
    if (!menuToggle || !navLinksContainer) return;

    menuToggle.classList.add("active");
    navLinksContainer.classList.add("open");
    document.body.classList.add("menu-open");

    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Close navigation menu");
}

if (menuToggle && navLinksContainer) {
    menuToggle.addEventListener("click", () => {
        const menuIsOpen = navLinksContainer.classList.contains("open");

        if (menuIsOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });
}

navLinks.forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeMobileMenu();
    }
});

window.addEventListener("resize", () => {
    if (window.innerWidth > 820) {
        closeMobileMenu();
    }
});

/* =================================
   4. Active Navigation Link
================================= */

function updateActiveNavigation() {
    const scrollPosition = window.scrollY + 160;
    let currentSection = "home";

    sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;

        if (
            scrollPosition >= sectionTop &&
            scrollPosition < sectionBottom
        ) {
            currentSection = section.id;
        }
    });

    navLinks.forEach((link) => {
        const target = link.getAttribute("href");

        link.classList.toggle(
            "active",
            target === `#${currentSection}`
        );
    });
}

updateActiveNavigation();

window.addEventListener("scroll", updateActiveNavigation, {
    passive: true
});

/* =================================
   5. Scroll Reveal Animation
================================= */

const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

if ("IntersectionObserver" in window && !reducedMotion) {
    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -45px 0px"
        }
    );

    revealElements.forEach((element) => {
        revealObserver.observe(element);
    });
} else {
    revealElements.forEach((element) => {
        element.classList.add("visible");
    });
}

/* =================================
   6. Typing Text Animation
================================= */

const typingWords = [
    "Web Developer",
    "App Developer",
    "Frontend Learner",
    "Problem Solver"
];

let wordIndex = 0;
let characterIndex = 0;
let isDeleting = false;
let typingTimer;

function runTypingAnimation() {
    if (!typingText || reducedMotion) return;

    const currentWord = typingWords[wordIndex];

    if (isDeleting) {
        characterIndex -= 1;
    } else {
        characterIndex += 1;
    }

    typingText.textContent = currentWord.slice(0, characterIndex);

    let delay = isDeleting ? 45 : 90;

    if (!isDeleting && characterIndex === currentWord.length) {
        isDeleting = true;
        delay = 1500;
    } else if (isDeleting && characterIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % typingWords.length;
        delay = 350;
    }

    typingTimer = window.setTimeout(runTypingAnimation, delay);
}

if (typingText) {
    if (reducedMotion) {
        typingText.textContent = typingWords[0];
    } else {
        typingText.textContent = "";
        runTypingAnimation();
    }
}

/* =================================
   7. Mouse-Follow Background Glow
================================= */

if (mouseGlow && !reducedMotion) {
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;

    document.addEventListener(
        "pointermove",
        (event) => {
            targetX = event.clientX;
            targetY = event.clientY;
        },
        { passive: true }
    );

    function animateMouseGlow() {
        currentX += (targetX - currentX) * 0.09;
        currentY += (targetY - currentY) * 0.09;

        mouseGlow.style.transform =
            `translate(${currentX - 215}px, ${currentY - 215}px)`;

        window.requestAnimationFrame(animateMouseGlow);
    }

    animateMouseGlow();
}

/* =================================
   8. Interactive 3D Card Tilt
================================= */

const supportsHover = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
).matches;

if (supportsHover && !reducedMotion) {
    tiltCards.forEach((card) => {
        card.addEventListener("pointermove", (event) => {
            const bounds = card.getBoundingClientRect();

            const pointerX = event.clientX - bounds.left;
            const pointerY = event.clientY - bounds.top;

            const centerX = bounds.width / 2;
            const centerY = bounds.height / 2;

            const rotateY =
                ((pointerX - centerX) / centerX) * 5;

            const rotateX =
                ((centerY - pointerY) / centerY) * 5;

            card.style.transform = `
                perspective(1000px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                translateY(-4px)
            `;
        });

        card.addEventListener("pointerleave", () => {
            card.style.transform = `
                perspective(1000px)
                rotateX(0deg)
                rotateY(0deg)
                translateY(0)
            `;
        });
    });
}

/* =================================
   9. Smooth Internal Navigation
================================= */

const internalLinks = document.querySelectorAll('a[href^="#"]');

internalLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
        const destination = link.getAttribute("href");

        if (!destination || destination === "#") {
            event.preventDefault();
            return;
        }

        const targetElement = document.querySelector(destination);

        if (!targetElement) return;

        event.preventDefault();

        targetElement.scrollIntoView({
            behavior: reducedMotion ? "auto" : "smooth",
            block: "start"
        });

        if (history.pushState) {
            history.pushState(null, "", destination);
        }
    });
});

/* =================================
   10. External Link Protection
================================= */

const externalLinks = document.querySelectorAll(
    'a[target="_blank"]'
);

externalLinks.forEach((link) => {
    const relValues = new Set(
        (link.getAttribute("rel") || "")
            .split(/\s+/)
            .filter(Boolean)
    );

    relValues.add("noopener");
    relValues.add("noreferrer");

    link.setAttribute("rel", [...relValues].join(" "));
});

/* =================================
   11. Image Error Fallback
================================= */

const profileImage = document.querySelector(".profile-image");

if (profileImage) {
    profileImage.addEventListener("error", () => {
        const imageWrapper = profileImage.parentElement;

        profileImage.style.display = "none";

        if (imageWrapper) {
            imageWrapper.style.display = "grid";
            imageWrapper.style.placeItems = "center";
            imageWrapper.style.color = "#62adff";
            imageWrapper.style.fontFamily =
                '"Space Grotesk", sans-serif';
            imageWrapper.style.fontSize = "1rem";
            imageWrapper.style.fontWeight = "700";
            imageWrapper.textContent =
                "Add images/devil.png";
        }
    });
}

/* =================================
   12. Initial Page Setup
================================= */

window.addEventListener("load", () => {
    updateHeader();
    updateActiveNavigation();

    document.body.classList.add("page-loaded");
});

/* Stop the typing timer when leaving the page. */

window.addEventListener("beforeunload", () => {
    if (typingTimer) {
        window.clearTimeout(typingTimer);
    }
});
