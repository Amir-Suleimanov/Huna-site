const home = document.querySelector('.home');
const menuToggle = document.querySelector('.menu-toggle');
const menuOverlay = document.querySelector('.mobile-menu-overlay');
const menuClose = document.querySelector('.mobile-menu-close');

if (home && menuToggle && menuOverlay && menuClose) {
    const openMenu = () => {
        home.classList.add('menu-open');
        menuOverlay.hidden = false;
        menuToggle.setAttribute('aria-expanded', 'true');
    };

    const closeMenu = () => {
        home.classList.remove('menu-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        window.setTimeout(() => {
            if (!home.classList.contains('menu-open')) {
                menuOverlay.hidden = true;
            }
        }, 250);
    };

    menuToggle.setAttribute('aria-expanded', 'false');

    menuToggle.addEventListener('click', () => {
        if (home.classList.contains('menu-open')) {
            closeMenu();
            return;
        }

        openMenu();
    });

    menuClose.addEventListener('click', closeMenu);

    menuOverlay.addEventListener('click', (event) => {
        if (event.target === menuOverlay) {
            closeMenu();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && home.classList.contains('menu-open')) {
            closeMenu();
        }
    });
}
