/* ========================================
   DARK / LIGHT MODE
========================================= */

const themeToggle = document.getElementById("theme-toggle");
const savedTheme = localStorage.getItem("theme");

if (savedTheme) {
  document.documentElement.setAttribute("data-theme", savedTheme);
}

function updateThemeIcon() {
  if (!themeToggle) return;
  const theme = document.documentElement.getAttribute("data-theme");
  themeToggle.textContent = theme === "light" ? "☀" : "◐";
}

updateThemeIcon();

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "light" ? "dark" : "light";

    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);

    updateThemeIcon();
  });
}


/* ========================================
   MOBILE NAVIGATION
========================================= */

const navToggle = document.getElementById("nav-toggle");
const mainNav = document.getElementById("main-nav");

if (navToggle && mainNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");
    navToggle.classList.toggle("open", isOpen);
    navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  mainNav.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("open");
      navToggle.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}


/* ========================================
   FOOTER YEAR
========================================= */

const year = document.getElementById("current-year");
if (year) {
  year.textContent = new Date().getFullYear();
}


/* ========================================
   SCROLL REVEAL
========================================= */

const reveals = document.querySelectorAll(".reveal");

function reveal() {
  const windowHeight = window.innerHeight;

  reveals.forEach((item) => {
    const elementTop = item.getBoundingClientRect().top;
    if (elementTop < windowHeight - 100) {
      item.classList.add("active");
    }
  });
}

window.addEventListener("scroll", reveal);
reveal();


/* ========================================
   PROJECT FILTER (Projects page)
========================================= */

const filterButtons = document.querySelectorAll(".filter-btn");
const projectRows = document.querySelectorAll(".all-project-row");
const projectCount = document.getElementById("project-number");

if (filterButtons.length && projectRows.length) {
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.dataset.filter;
      let visibleCount = 0;

      projectRows.forEach((row) => {
        const match = filter === "all" || row.dataset.category === filter;
        row.classList.toggle("is-hidden", !match);
        if (match) visibleCount++;
      });

      if (projectCount) projectCount.textContent = visibleCount;
    });
  });
}


/* ========================================
   ACTIVE NAV LINK
========================================= */

(function highlightActiveNav() {
  const links = document.querySelectorAll(".nav-link");
  const path = window.location.pathname.split("/").pop() || "index.html";
  const hash = window.location.hash;

  links.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href) return;

    const isProjectsPage = path.startsWith("projects") && href.startsWith("projects");
    const isHomeWithHash = hash && href.endsWith(hash);
    const isHomeDefault = !hash && (path === "index.html" || path === "") && href === "index.html";

    if (isProjectsPage || isHomeWithHash || isHomeDefault) {
      link.classList.add("active");
    }
  });
})();


/* ========================================
   PROJECT IMAGE CAROUSEL (project detail pages)
========================================= */

document.querySelectorAll(".project-carousel").forEach((carousel) => {
  const track = carousel.querySelector(".carousel-track");
  const slides = carousel.querySelectorAll(".carousel-track > figure");
  const prevBtn = carousel.querySelector(".carousel-prev");
  const nextBtn = carousel.querySelector(".carousel-next");
  const dots = carousel.querySelectorAll(".carousel-dot");

  if (slides.length <= 1) return;

  let index = 0;

  function goTo(newIndex) {
    index = (newIndex + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((dot, i) => dot.classList.toggle("active", i === index));
  }

  if (prevBtn) prevBtn.addEventListener("click", () => goTo(index - 1));
  if (nextBtn) nextBtn.addEventListener("click", () => goTo(index + 1));

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => goTo(i));
  });

  carousel.tabIndex = 0;
  carousel.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") goTo(index - 1);
    if (e.key === "ArrowRight") goTo(index + 1);
  });

  // basic touch swipe support
  let touchStartX = null;
  track.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  track.addEventListener("touchend", (e) => {
    if (touchStartX === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) > 40) goTo(delta < 0 ? index + 1 : index - 1);
    touchStartX = null;
  });
});
