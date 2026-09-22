/* ==========================================================================
   John Paul Del Mundo — portfolio
   Small, dependency-free progressive enhancement. Every feature here is an
   upgrade on behaviour the plain HTML already provides.
   ========================================================================== */
(function () {
  "use strict";

  /* --- current year in the footer ------------------------------------- */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  /* --- mobile navigation ---------------------------------------------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");

  function setNav(open) {
    if (!nav || !toggle) return;
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      setNav(!nav.classList.contains("is-open"));
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) setNav(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key !== "Escape") return;
      if (!nav.classList.contains("is-open")) return;
      setNav(false);
      toggle.focus();
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 760) setNav(false);
    });
  }

  /* --- scroll reveal --------------------------------------------------- */
  var reveals = document.querySelectorAll(".reveal");
  var reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function showAll() {
    Array.prototype.forEach.call(reveals, function (el) {
      el.classList.add("is-visible");
    });
  }

  if (!reveals.length) {
    /* nothing to do */
  } else if (reduceMotion || !("IntersectionObserver" in window)) {
    showAll();
  } else {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
    );
    Array.prototype.forEach.call(reveals, function (el) {
      revealObserver.observe(el);
    });
  }

  /* --- highlight the nav link for the section in view ------------------ */
  var navLinks = Array.prototype.slice.call(
    document.querySelectorAll(".nav__link")
  );
  var sections = navLinks
    .map(function (link) {
      var id = link.getAttribute("href");
      return id && id.charAt(0) === "#" ? document.querySelector(id) : null;
    })
    .filter(Boolean);

  function clearCurrent() {
    navLinks.forEach(function (link) {
      link.removeAttribute("aria-current");
    });
  }

  if (sections.length && "IntersectionObserver" in window) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          clearCurrent();
          var link = navLinks.filter(function (l) {
            return l.getAttribute("href") === "#" + entry.target.id;
          })[0];
          if (link) link.setAttribute("aria-current", "true");
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach(function (section) {
      spy.observe(section);
    });
  }

  /* --- copy the email address ----------------------------------------- */
  var copyBtn = document.querySelector("[data-copy]");

  if (copyBtn && navigator.clipboard) {
    copyBtn.addEventListener("click", function () {
      var value = copyBtn.getAttribute("data-copy");
      navigator.clipboard.writeText(value).then(
        function () {
          var label = copyBtn.querySelector(".copy__label");
          copyBtn.setAttribute("data-copied", "true");
          if (label) label.textContent = "Copied";
          window.setTimeout(function () {
            copyBtn.removeAttribute("data-copied");
            if (label) label.textContent = "Copy";
          }, 2000);
        },
        function () {
          /* Clipboard blocked (insecure context, permissions). The address
             is already on screen as selectable text, so fail quietly. */
        }
      );
    });
  } else if (copyBtn) {
    /* No async clipboard: the <code> element is selectable, so drop the
       button rather than leaving a control that does nothing. */
    copyBtn.remove();
  }
})();
