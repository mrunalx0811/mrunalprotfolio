// ---------- Dynamic Typing Effect ----------
const phrases = [
  "responsive web apps.",
  "programs in Java & Python.",
  "clean user interfaces.",
  "software solutions in C."
];
const typedEl = document.getElementById("typed");
let phraseIndex = 0;
let charIndex = 0;
let deleting = false;

function typeEffect() {
  if (!typedEl) return;
  const current = phrases[phraseIndex];
  typedEl.textContent = current.slice(0, charIndex);

  if (!deleting && charIndex < current.length) {
    charIndex++;
    setTimeout(typeEffect, 80);
  } else if (!deleting) {
    deleting = true;
    setTimeout(typeEffect, 1400);
  } else if (charIndex > 0) {
    charIndex--;
    setTimeout(typeEffect, 40);
  } else {
    deleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    setTimeout(typeEffect, 300);
  }
}
typeEffect();

// ---------- Mobile Navigation Menu ----------
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(open));
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// ---------- Dark / Light Mode with Local Storage ----------
const themeBtn = document.querySelector(".theme-toggle");
const root = document.documentElement;

try {
  const savedTheme = localStorage.getItem("portfolio-theme");
  if (savedTheme) {
    root.dataset.theme = savedTheme;
  } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    root.dataset.theme = "dark";
  }
} catch (e) {
  console.warn("Theme storage unavailable", e);
}

if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    const currentTheme = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = currentTheme;
    try {
      localStorage.setItem("portfolio-theme", currentTheme);
    } catch (e) {}
  });
}

// ---------- Reveal on Scroll & Animate Skill Bars ----------
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");

      // Animate any skill bars inside this section
      entry.target.querySelectorAll(".bar-fill").forEach((bar) => {
        const level = bar.getAttribute("data-level");
        if (level) {
          bar.style.width = level + "%";
        }
      });

      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll(".reveal").forEach((el) => {
  revealObserver.observe(el);
});

// ---------- Active Nav Link on Scroll ----------
const sections = document.querySelectorAll("main section[id]");
const menuLinks = document.querySelectorAll(".nav-links a[href^='#']");

window.addEventListener("scroll", () => {
  let activeSection = "";
  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 130;
    if (window.scrollY >= sectionTop) {
      activeSection = section.id;
    }
  });

  menuLinks.forEach((link) => {
    const href = link.getAttribute("href");
    link.classList.toggle("active", href === "#" + activeSection);
  });
});

// ---------- Dynamic Footer Year ----------
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// ---------- Contact Form Submission & Validation ----------
const contactForm = document.getElementById("contact-form");
if (contactForm) {
  const formStatus = contactForm.querySelector(".form-status");

  function setFieldError(fieldName, errorText) {
    const errorEl = contactForm.querySelector(`.error[data-for="${fieldName}"]`);
    if (errorEl) {
      errorEl.textContent = errorText;
    }
  }

  function clearErrors() {
    contactForm.querySelectorAll(".error").forEach((el) => {
      el.textContent = "";
    });
    if (formStatus) {
      formStatus.textContent = "";
      formStatus.className = "form-status";
    }
  }

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    clearErrors();

    const nameInput = contactForm.querySelector("#name");
    const emailInput = contactForm.querySelector("#email");
    const messageInput = contactForm.querySelector("#message");

    const name = nameInput ? nameInput.value.trim() : "";
    const email = emailInput ? emailInput.value.trim() : "";
    const message = messageInput ? messageInput.value.trim() : "";

    let isValid = true;

    if (!name) {
      setFieldError("name", "Please enter your name.");
      isValid = false;
    }

    if (!email) {
      setFieldError("email", "Please enter your email.");
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFieldError("email", "Please enter a valid email address.");
      isValid = false;
    }

    if (!message) {
      setFieldError("message", "Please enter a message.");
      isValid = false;
    }

    if (isValid) {
      if (formStatus) {
        formStatus.textContent = "Thank you, Mrunal received your message! Opening your mail client...";
        formStatus.className = "form-status success";
      }

      // Fallback to mailto link so user can send immediately
      const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
      window.location.href = `mailto:patilmrunal9323@gmail.com?subject=${subject}&body=${body}`;

      contactForm.reset();
    }
  });
}
