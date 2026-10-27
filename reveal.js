/* Scroll animations: elements marked data-reveal glide into place with a
   soft bounce as they scroll into view. Variants: data-reveal="up" (default),
   "left", "right", "zoom". Siblings that are all marked get a short stagger. */
(function () {
  var root = document.documentElement;
  if (!root.classList.contains("reveal-on")) return;
  window.__revealReady = true;

  var items = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));

  // Stagger siblings: each marked sibling waits a little longer than the last.
  items.forEach(function (el) {
    var sibs = Array.prototype.filter.call(el.parentElement.children, function (c) {
      return c.hasAttribute("data-reveal");
    });
    var i = sibs.indexOf(el);
    if (sibs.length > 1 && i > 0) el.style.transitionDelay = Math.min(i * 110, 550) + "ms";
  });

  function finish(el) {
    // Hand the element back to its normal styles (keeps button hover effects working).
    el.removeAttribute("data-reveal");
    el.classList.remove("revealed");
    el.style.transitionDelay = "";
  }

  function show(el) {
    el.classList.add("revealed");
    var done = false;
    function end() { if (!done) { done = true; finish(el); } }
    el.addEventListener("transitionend", function (e) {
      if (e.target === el && e.propertyName === "transform") end();
    });
    setTimeout(end, 1800);
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        io.unobserve(entry.target);
        show(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

  items.forEach(function (el) { io.observe(el); });
})();
