(function () {
  "use strict";

  const hpFill = document.getElementById("hp-fill");
  const hpLabel = document.getElementById("hp-label");
  const themeToggle = document.querySelector(".theme-toggle");
  const themeColor = document.querySelector('meta[name="theme-color"]');

  const setTheme = (theme) => {
    const nextTheme = theme === "dark" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", nextTheme);
    if (themeToggle) {
      themeToggle.setAttribute("aria-pressed", String(nextTheme === "dark"));
      themeToggle.setAttribute("title", nextTheme === "dark" ? "Light mode" : "Dark mode");
    }
    if (themeColor) {
      themeColor.setAttribute("content", nextTheme === "dark" ? "#202833" : "#eee7d7");
    }
  };

  const getTheme = () => document.documentElement.getAttribute("data-theme") || "light";

  if (themeToggle) {
    setTheme(getTheme());
    themeToggle.addEventListener("click", () => {
      const nextTheme = getTheme() === "dark" ? "light" : "dark";
      try {
        localStorage.setItem("sao-theme", nextTheme);
      } catch (error) {
        // Ignore private-mode storage failures; the visible theme can still change.
      }
      setTheme(nextTheme);
    });
  }

  if (hpFill) {
    const updateHP = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const pct = maxScroll > 0 ? Math.min((window.scrollY / maxScroll) * 100, 100) : 0;
      const remaining = Math.max(0, Math.round(100 - pct));
      hpFill.style.width = remaining + "%";
      hpFill.classList.toggle("warning", remaining <= 60 && remaining > 25);
      hpFill.classList.toggle("danger", remaining <= 25);
      if (hpLabel) {
        hpLabel.textContent = "HP " + remaining;
      }
    };

    window.addEventListener("scroll", updateHP, { passive: true });
    updateHP();
  }

  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );

    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("visible"));
  }

  const menuBtn = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".site-nav");
  if (menuBtn && nav) {
    menuBtn.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", String(isOpen));
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
      });
    });

    document.addEventListener("click", (event) => {
      if (!nav.contains(event.target) && !menuBtn.contains(event.target)) {
        nav.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
      }
    });
  }

  const commandItems = document.querySelectorAll(".command-item");
  commandItems.forEach((item) => {
    item.addEventListener("mouseenter", () => {
      commandItems.forEach((entry) => entry.classList.remove("is-hovered"));
      item.classList.add("is-hovered");
    });

    item.addEventListener("mouseleave", () => item.classList.remove("is-hovered"));
  });
})();
