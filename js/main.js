/* main.js — navigation state, scroll-reveal, and contact form handling */

document.addEventListener("DOMContentLoaded", () => {

  // ---- Footer year / deploy stamp ----
  const now = new Date();
  const yearEl = document.getElementById("year");
  const deployEl = document.getElementById("deployYear");
  if (yearEl) yearEl.textContent = now.getFullYear();
  if (deployEl) deployEl.textContent = now.getFullYear();

  // ---- Scroll-reveal ----
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  // ---- Active nav link on scroll ----
  const sections = document.querySelectorAll("main section[id], header[id]");
  const navLinks = document.querySelectorAll(".nav-link[data-nav]");

  function setActiveLink() {
    let currentId = null;
    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 120 && rect.bottom >= 120) {
        currentId = section.id;
      }
    });
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${currentId}`);
    });
  }
  window.addEventListener("scroll", setActiveLink, { passive: true });
  setActiveLink();

  // Collapse mobile nav after a link is clicked
  const navCollapseEl = document.getElementById("navLinks");
  if (navCollapseEl && window.bootstrap) {
    const bsCollapse = new bootstrap.Collapse(navCollapseEl, { toggle: false });
    navCollapseEl.querySelectorAll("a.nav-link").forEach((link) => {
      link.addEventListener("click", () => bsCollapse.hide());
    });
  }

  // ---- Contact form ----
  const form = document.getElementById("contactForm");
  const statusEl = document.getElementById("formStatus");
  const submitBtn = document.getElementById("contactSubmit");
  const ownerEmail = "hello@example.com"; // <-- replace with your real email

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const data = {
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        subject: form.subject.value.trim(),
        message: form.message.value.trim(),
      };

      submitBtn.disabled = true;
      submitBtn.textContent = "Sending…";
      setStatus("", "");

      try {
        const response = await fetch("php/contact.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        // GitHub Pages (and other static-only hosts) will return an HTML
        // 404 page instead of JSON, since they don't run PHP. Catch that
        // here and fall back to a plain mailto link so the form still works.
        const contentType = response.headers.get("content-type") || "";
        if (!response.ok || !contentType.includes("application/json")) {
          throw new Error("non-json-response");
        }

        const result = await response.json();

        if (result.success) {
          setStatus("Message sent — thank you. I'll reply soon.", "ok");
          form.reset();
        } else {
          setStatus(result.message || "Something went wrong. Please try again.", "err");
        }
      } catch (err) {
        // Static-hosting fallback: open a pre-filled email instead.
        const mailtoLink = buildMailto(data);
        setStatus(
          "This site is running without a PHP server, so I've opened your email app instead.",
          "err"
        );
        window.location.href = mailtoLink;
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Send message";
      }
    });
  }

  function setStatus(message, type) {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.className = "form-status" + (type ? ` ${type}` : "");
  }

  function buildMailto({ name, email, subject, message }) {
    const body = `From: ${name} (${email})%0D%0A%0D%0A${encodeURIComponent(message)}`;
    return `mailto:${ownerEmail}?subject=${encodeURIComponent(subject || "Portfolio contact")}&body=${body}`;
  }
  
});

 document.addEventListener('DOMContentLoaded', function () {
        // Optional: If you need to dynamically change speed later
        var myCarousel = document.querySelector('#workCarousel');
        var carousel = new bootstrap.Carousel(myCarousel, {
            interval: 4000, // Time between slides (ms)
            wrap: true
        });
    });