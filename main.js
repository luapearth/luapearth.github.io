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
  var emailEl = document.querySelector(".emailrow__value");

  function legacyCopy(value) {
    /* Fallback for when the async clipboard API is missing or refused
       (permission denied, insecure context). execCommand still works in a
       user-gesture handler on most browsers. */
    var field = document.createElement("textarea");
    field.value = value;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.top = "-1000px";
    field.style.opacity = "0";
    document.body.appendChild(field);
    var ok = false;
    try {
      field.select();
      ok = document.execCommand("copy");
    } catch (err) {
      ok = false;
    }
    document.body.removeChild(field);
    return ok;
  }

  function selectEmail() {
    if (!emailEl || !window.getSelection || !document.createRange) return;
    var range = document.createRange();
    range.selectNodeContents(emailEl);
    var selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }

  if (copyBtn) {
    var copyLabel = copyBtn.querySelector(".copy__label");
    var resetTimer;

    function flashCopy(text) {
      copyBtn.setAttribute("data-copied", "true");
      if (copyLabel) copyLabel.textContent = text;
      window.clearTimeout(resetTimer);
      resetTimer = window.setTimeout(function () {
        copyBtn.removeAttribute("data-copied");
        if (copyLabel) copyLabel.textContent = "Copy";
      }, 2400);
    }

    copyBtn.addEventListener("click", function () {
      var value = copyBtn.getAttribute("data-copy");

      function onSuccess() {
        flashCopy("Copied");
      }

      function onFailure() {
        if (legacyCopy(value)) {
          onSuccess();
          return;
        }
        /* Both paths refused. Put the cursor on the real text instead of
           claiming the copy worked — the address is visible and selectable. */
        selectEmail();
        flashCopy("Select & copy");
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value).then(onSuccess, onFailure);
      } else {
        onFailure();
      }
    });
  }
})();
