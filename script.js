const themeStorageKey = "wisteria-theme";
const validThemes = new Set(["default", "dark", "light"]);

function applyTheme(theme) {
    const selectedTheme = validThemes.has(theme) ? theme : "default";
    if (selectedTheme === "default") {
        delete document.documentElement.dataset.theme;
    } else {
        document.documentElement.dataset.theme = selectedTheme;
    }
    return selectedTheme;
}

try {
    applyTheme(localStorage.getItem(themeStorageKey) || "default");
} catch (error) {
    applyTheme("default");
}

function setupReveals() {
    const revealElements = document.querySelectorAll(".reveal");
    if (!revealElements.length) return;

    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        revealElements.forEach((element) => element.classList.add("active"));
        return;
    }

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("active");
            revealObserver.unobserve(entry.target);
        });
    }, { rootMargin: "0px 0px -9%", threshold: .08 });

    revealElements.forEach((element) => revealObserver.observe(element));
}

// Navbar scroll effect
function handleNavbar() {
    const nav = document.getElementById("navbar");
    if (window.scrollY > 50) {
        nav.classList.add("scrolled");
    } else {
        nav.classList.remove("scrolled");
    }
}

// Initialize animations and events
document.addEventListener("DOMContentLoaded", () => {
    const navbar = document.getElementById("navbar");
    if (navbar) {
        const navLinks = navbar.querySelector(".nav-links");
        if (navLinks) {
            const menuButton = document.createElement("button");
            menuButton.type = "button";
            menuButton.className = "menuButton";
            menuButton.setAttribute("aria-label", "Open navigation");
            menuButton.setAttribute("aria-expanded", "false");
            menuButton.innerHTML = "<span></span><span></span><span></span>";
            menuButton.addEventListener("click", () => {
                const isOpen = navbar.classList.toggle("menuOpen");
                menuButton.setAttribute("aria-expanded", String(isOpen));
                menuButton.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
            });
            navLinks.addEventListener("click", (event) => {
                if (event.target.closest("a")) {
                    navbar.classList.remove("menuOpen");
                    menuButton.setAttribute("aria-expanded", "false");
                    menuButton.setAttribute("aria-label", "Open navigation");
                }
            });
            navbar.insertBefore(menuButton, navLinks);
        }

        const themeControl = document.createElement("label");
        themeControl.className = "theme-control";
        themeControl.innerHTML = '<span class="sr-only">Theme</span><select aria-label="Theme"><option value="default">Default</option><option value="dark">Dark</option><option value="light">Light</option></select>';
        const themeSelect = themeControl.querySelector("select");
        themeSelect.value = document.documentElement.dataset.theme || "default";
        themeSelect.addEventListener("change", () => {
            const selectedTheme = applyTheme(themeSelect.value);
            try {
                localStorage.setItem(themeStorageKey, selectedTheme);
            } catch (error) {
                // The selected theme remains active for this page when storage is unavailable.
            }
        });
        navbar.append(themeControl);
    } else {
        const themeControl = document.createElement("label");
        themeControl.className = "theme-control theme-floating";
        themeControl.innerHTML = '<span class="sr-only">Theme</span><select aria-label="Theme"><option value="default">Default</option><option value="dark">Dark</option><option value="light">Light</option></select>';
        const themeSelect = themeControl.querySelector("select");
        themeSelect.value = document.documentElement.dataset.theme || "default";
        themeSelect.addEventListener("change", () => {
            const selectedTheme = applyTheme(themeSelect.value);
            try {
                localStorage.setItem(themeStorageKey, selectedTheme);
            } catch (error) {
                // The selected theme remains active for this page when storage is unavailable.
            }
        });
        document.body.append(themeControl);
    }

    const cookieNotice = document.getElementById("cookie-notice");
    if (cookieNotice) {
        const noticeKey = "wisteria_cookie_notice_dismissed";
        if (localStorage.getItem(noticeKey) !== "true") {
            cookieNotice.hidden = false;
        }
        cookieNotice.querySelector("[data-cookie-dismiss]")?.addEventListener("click", () => {
            localStorage.setItem(noticeKey, "true");
            cookieNotice.hidden = true;
        });
    }

    window.addEventListener("scroll", handleNavbar);
    
    // Initial calls
    setupReveals();
    handleNavbar();
    
    // Add active class to current nav link
    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    const navLinks = document.querySelectorAll(".nav-links a");
    navLinks.forEach(link => {
        if (link.getAttribute("href") === currentPath) {
            link.classList.add("active");
        }
    });

    const detailTitle = document.getElementById("rank-detail-title");
    const detailCopy = document.getElementById("rank-detail-copy");
    document.querySelectorAll(".rank-node").forEach((node) => {
        node.addEventListener("click", () => {
            document.querySelectorAll(".rank-node.selected").forEach((selected) => selected.classList.remove("selected"));
            node.classList.add("selected");
            if (detailTitle) detailTitle.textContent = node.dataset.rank;
            if (detailCopy) detailCopy.textContent = node.dataset.detail;
            const rankDetail = document.querySelector(".rank-detail");
            if (rankDetail) {
                rankDetail.classList.remove("rankUpdated");
                window.requestAnimationFrame(() => rankDetail.classList.add("rankUpdated"));
            }
        });
    });
});
