/* Formula Fitness™ India — shared site scripts */
(function () {
  "use strict";

  /* ----- Mobile nav toggle ----- */
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("nav-menu");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  /* ----- Mobile dropdowns (tap to open) ----- */
  document.querySelectorAll(".nav-links .has-dropdown > a").forEach(function (link) {
    link.addEventListener("click", function (e) {
      if (window.matchMedia("(max-width: 860px)").matches) {
        e.preventDefault();
        link.parentElement.classList.toggle("open");
      }
    });
  });

  /* ----- Highlight current page in nav ----- */
  var path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a, .dropdown a").forEach(function (a) {
    var href = a.getAttribute("href") || "";
    if (href === path) {
      a.classList.add("active");
      var parent = a.closest(".has-dropdown");
      if (parent) {
        var top = parent.querySelector(":scope > a");
        if (top) top.classList.add("active");
      }
    }
  });

  /* ----- Scroll progress bar ----- */
  var progress = document.querySelector(".scroll-progress");
  var toTop = document.querySelector(".to-top");
  var header = document.querySelector(".site-header");
  var ticking = false;
  function onScroll() {
    var st = window.scrollY || document.documentElement.scrollTop;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = (max > 0 ? (st / max) * 100 : 0) + "%";
    if (toTop) toTop.classList.toggle("show", st > 500);
    if (header) header.classList.toggle("scrolled", st > 10);
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });
  onScroll();

  /* ----- Back to top ----- */
  if (toTop) {
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ----- Scroll reveal animations (with stagger) ----- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ----- Animated counters ----- */
  function animateCounter(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var decimals = (el.getAttribute("data-count").split(".")[1] || "").length;
    var dur = 1600;
    var start = null;
    function tick(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(decimals);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  var counters = document.querySelectorAll("[data-count]");
  if (counters.length && "IntersectionObserver" in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          animateCounter(en.target);
          cio.unobserve(en.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* ----- 3D tilt on cards ----- */
  if (window.matchMedia("(hover: hover)").matches) {
    document.querySelectorAll(".tilt").forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform =
          "perspective(800px) rotateX(" + (-y * 8).toFixed(2) + "deg) rotateY(" + (x * 8).toFixed(2) + "deg) translateY(-4px)";
      });
      card.addEventListener("mouseleave", function () {
        card.style.transform = "";
      });
    });
  }

  /* ----- BMI calculator ----- */
  var hIn = document.getElementById("bmi-h");
  var wIn = document.getElementById("bmi-w");
  var goBtn = document.getElementById("bmi-go");
  if (hIn && wIn && goBtn) {
    var val = document.getElementById("bmi-val");
    var verdict = document.getElementById("bmi-verdict");
    goBtn.addEventListener("click", function () {
      var h = parseFloat(hIn.value) / 100;
      var w = parseFloat(wIn.value);
      if (!h || !w || h <= 0 || w <= 0) {
        verdict.textContent = "Please enter a valid height and weight.";
        verdict.style.color = "var(--clr-accent)";
        val.textContent = "--";
        return;
      }
      var bmi = w / (h * h);
      var cur = 0;
      val.textContent = "0";
      var dur = 900, start = null;
      function tick(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        val.textContent = (bmi * (1 - Math.pow(1 - p, 3))).toFixed(1);
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      var msg, color;
      if (bmi < 18.5)      { msg = "Underweight — let's build strength together 💪"; color = "var(--clr-gold)"; }
      else if (bmi < 25)   { msg = "Healthy range — keep crushing it 🔥";            color = "#22c55e"; }
      else if (bmi < 30)   { msg = "Overweight — we've got a plan for you 📋";       color = "var(--clr-gold)"; }
      else                 { msg = "Obese — your transformation starts today 🚀";     color = "var(--clr-accent)"; }
      verdict.textContent = msg;
      verdict.style.color = color;
    });
  }

  /* ----- Demo form handler (no backend) ----- */
  document.querySelectorAll("form[data-demo]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var status = form.querySelector(".form-status");
      if (status) {
        var refInput = form.querySelector('input[name="referral_code"]');
        var hasCode = refInput && refInput.value.trim() !== "";
        status.textContent = hasCode
          ? "✓ Thank you! Your enquiry has been recorded WITH your referral code 🎉 We'll verify it and personally confirm your exact discount shortly. (Demo form — connect a backend or service to receive submissions.)"
          : "✓ Thank you! Your inquiry has been recorded. We will contact you shortly. (Demo form — connect a backend or service to receive submissions.)";
        status.classList.add("show");
      }
      form.reset();
    });
  });

  /* ----- Results lightbox (before/after photos) ----- */
  var lbTriggers = Array.prototype.slice.call(
    document.querySelectorAll("[data-lightbox]")
  );
  if (lbTriggers.length) {
    var lb = document.createElement("div");
    lb.className = "lightbox";
    lb.setAttribute("role", "dialog");
    lb.setAttribute("aria-modal", "true");
    lb.setAttribute("aria-label", "Photo viewer");
    lb.innerHTML =
      '<button type="button" class="lightbox-close" aria-label="Close">×</button>' +
      '<button type="button" class="lightbox-nav lb-prev" aria-label="Previous photo">‹</button>' +
      '<button type="button" class="lightbox-nav lb-next" aria-label="Next photo">›</button>' +
      '<img src="" alt="">' +
      '<p class="lightbox-caption"></p>';
    document.body.appendChild(lb);

    var lbImg = lb.querySelector("img");
    var lbCap = lb.querySelector(".lightbox-caption");
    var lbIndex = 0;
    var lbLastFocus = null;

    function lbShow(i) {
      lbIndex = (i + lbTriggers.length) % lbTriggers.length;
      var t = lbTriggers[lbIndex];
      var img = t.querySelector("img");
      lbImg.src = t.getAttribute("href") || (img ? img.src : "");
      lbImg.alt = img ? img.alt : "";
      lbCap.textContent = t.getAttribute("data-caption") || "";
    }
    function lbOpen(i) {
      lbLastFocus = document.activeElement;
      lbShow(i);
      lb.classList.add("open");
      document.body.style.overflow = "hidden";
      lb.querySelector(".lightbox-close").focus();
    }
    function lbClose() {
      lb.classList.remove("open");
      document.body.style.overflow = "";
      if (lbLastFocus) lbLastFocus.focus();
    }

    lbTriggers.forEach(function (t, i) {
      t.addEventListener("click", function () { lbOpen(i); });
    });
    lb.querySelector(".lightbox-close").addEventListener("click", lbClose);
    lb.querySelector(".lb-prev").addEventListener("click", function () { lbShow(lbIndex - 1); });
    lb.querySelector(".lb-next").addEventListener("click", function () { lbShow(lbIndex + 1); });
    lb.addEventListener("click", function (e) {
      if (e.target === lb || e.target === lbImg) lbClose();
    });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") lbClose();
      if (e.key === "ArrowLeft") lbShow(lbIndex - 1);
      if (e.key === "ArrowRight") lbShow(lbIndex + 1);
    });
  }

  /* ----- Client story modal ----- */
  var storyCards = document.querySelectorAll("[data-story]");
  var storyModal = document.getElementById("story-modal");
  if (storyCards.length && storyModal) {
    var stPanel = storyModal.querySelector(".story-panel");
    var stPhoto = storyModal.querySelector(".story-photo");
    var stTitle = document.getElementById("story-modal-title");
    var stMeta = storyModal.querySelector(".story-modal-meta");
    var stText = storyModal.querySelector(".story-text");
    var stLastFocus = null;
    var stHideTimer = null;

    function stOpen(card) {
      var id = card.getAttribute("data-story");
      var tpl = document.querySelector('[data-story-template="' + id + '"]');
      var metaEl = card.querySelector(".t-meta");
      var imgEl = card.querySelector(".r-thumb img");
      stTitle.textContent = card.querySelector(".t-body b").textContent;
      stMeta.textContent = metaEl ? metaEl.textContent : "";
      stText.innerHTML = "";
      if (tpl) stText.appendChild(tpl.content.cloneNode(true));
      if (imgEl) {
        stPhoto.src = imgEl.src;
        stPhoto.alt = imgEl.alt;
        stPhoto.style.display = "";
      } else {
        stPhoto.style.display = "none";
      }
      stLastFocus = document.activeElement;
      clearTimeout(stHideTimer);
      storyModal.hidden = false;
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          storyModal.classList.add("open");
        });
      });
      document.body.style.overflow = "hidden";
      storyModal.querySelector(".story-close").focus();
    }
    function stClose() {
      storyModal.classList.remove("open");
      document.body.style.overflow = "";
      stHideTimer = setTimeout(function () {
        storyModal.hidden = true;
      }, 320);
      if (stLastFocus) stLastFocus.focus();
    }

    storyCards.forEach(function (card) {
      card.addEventListener("click", function (e) {
        if (e.target.closest(".r-thumb")) return; /* photo opens lightbox instead */
        stOpen(card);
      });
      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          stOpen(card);
        }
      });
    });

    storyModal.querySelectorAll("[data-story-close]").forEach(function (el) {
      el.addEventListener("click", stClose);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !storyModal.hidden) stClose();
    });
  }

  /* ----- Footer year ----- */
  var yr = document.getElementById("yr");
  if (yr) yr.textContent = new Date().getFullYear();
})();
