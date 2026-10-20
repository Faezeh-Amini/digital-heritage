
let revealObserver;
let scrollHandler;
let mediaQuery;
let heroImage;

export function initializeFoodPage() {
    disposeFoodPage();

    mediaQuery = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );

    const revealElements = document.querySelectorAll(".food-reveal");

    if ("IntersectionObserver" in window) {
        revealObserver = new IntersectionObserver(
            entries => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        revealObserver.unobserve(entry.target);
                    }
                }
            },
            {
                threshold: 0.08,
                rootMargin: "0px 0px -35px 0px"
            }
        );

        revealElements.forEach(element => revealObserver.observe(element));
    } else {
        revealElements.forEach(element =>
            element.classList.add("is-visible")
        );
    }

    heroImage = document.querySelector(".food-hero-image");

    if (heroImage && !mediaQuery.matches) {
        let ticking = false;

        scrollHandler = () => {
            if (ticking) return;

            ticking = true;

            window.requestAnimationFrame(() => {
                if (!heroImage || mediaQuery.matches) {
                    ticking = false;
                    return;
                }

                const hero = heroImage.closest(".food-hero");

                if (hero) {
                    const rect = hero.getBoundingClientRect();

                    if (rect.bottom > 0 && rect.top < window.innerHeight) {
                        const offset = Math.max(
                            -35,
                            Math.min(35, -rect.top * 0.08)
                        );

                        heroImage.style.setProperty(
                            "--food-parallax-y",
                            `${offset}px`
                        );
                    }
                }

                ticking = false;
            });
        };

        window.addEventListener("scroll", scrollHandler, {
            passive: true
        });

        scrollHandler();
    }
}

export function disposeFoodPage() {
    if (revealObserver) {
        revealObserver.disconnect();
        revealObserver = undefined;
    }

    if (scrollHandler) {
        window.removeEventListener("scroll", scrollHandler);
        scrollHandler = undefined;
    }

    if (heroImage) {
        heroImage.style.removeProperty("--food-parallax-y");
        heroImage = undefined;
    }

    mediaQuery = undefined;
}
