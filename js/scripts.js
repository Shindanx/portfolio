// ─── Elements ───
const pointer = document.getElementById("cursor-pointer");
const frame = document.getElementById("cursor-frame");
const themeToggle = document.getElementById("themeToggle");

// ─── Dual Cursor Linear Interpolation Engine (Lerp) ───
let mouseX = 0, mouseY = 0;
let frameX = 0, frameY = 0;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  
  // The triangle point stays instantly locked to the real cursor position
  pointer.style.left = mouseX + "px";
  pointer.style.top = mouseY + "px";
});

function animateTrailingFrame() {
  // Smoothly damp the position of the outer box by 15% each animation step
  frameX += (mouseX - frameX) * 0.15;
  frameY += (mouseY - frameY) * 0.15;
  
  frame.style.left = frameX + "px";
  frame.style.top = frameY + "px";
  
  requestAnimationFrame(animateTrailingFrame);
}
// Start tracking loop
animateTrailingFrame();

// Fade operations when cursor exits/enters the viewport window
document.addEventListener("mouseleave", () => {
  pointer.style.opacity = "0";
  frame.style.opacity = "0";
});

document.addEventListener("mouseenter", () => {
  pointer.style.opacity = "1";
  frame.style.opacity = "1";
});

// ─── Scroll Reveal Animation (Fade In) ───
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add("visible");
    });
  },
  { threshold: 0.12 },
);

document.querySelectorAll(".section-row.fade-in").forEach((el) => observer.observe(el));

// ─── Scroll Spy Navigation Highlight ───
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-links a");

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        navLinks.forEach((l) => l.classList.remove("active"));
        const active = document.querySelector(
          `.nav-links a[href="#${e.target.id}"]`,
        );
        if (active) active.classList.add("active");
      }
    });
  },
  { rootMargin: "-40% 0px -55% 0px" },
);

sections.forEach((s) => navObserver.observe(s));

// ─── Dark/Light Theme Switching Logic ───
const savedTheme = localStorage.getItem("theme");
const systemPrefersLight = window.matchMedia(
  "(prefers-color-scheme: light)",
).matches;

if (savedTheme === "light" || (!savedTheme && systemPrefersLight)) {
  document.documentElement.setAttribute("data-theme", "light");
} else {
  document.documentElement.setAttribute("data-theme", "dark");
}

themeToggle.addEventListener("click", () => {
  const currentTheme = document.documentElement.getAttribute("data-theme");

  if (currentTheme === "dark") {
    document.documentElement.setAttribute("data-theme", "light");
    localStorage.setItem("theme", "light");
  } else {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
  }
});