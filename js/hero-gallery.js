(() => {
  const hero = document.querySelector("#hero");
  const gallery = hero?.querySelector("[data-hero-gallery]");
  if (!hero || !gallery) return;

  const slides = Array.from(gallery.querySelectorAll("[data-gallery-slide]"));
  const previews = Array.from(gallery.querySelectorAll("[data-gallery-preview]"));
  const position = gallery.querySelector("[data-gallery-position]");
  const progressFill = gallery.querySelector("[data-gallery-progress-fill]");
  const motionNote = gallery.querySelector("[data-gallery-motion-note]");
  const playbackToggle = gallery.querySelector("[data-gallery-toggle]");

  if (slides.length !== 3 || previews.length !== slides.length || !position || !progressFill || !motionNote || !playbackToggle) return;

  const reducedMotion = window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)")
    : { matches: false };
  const rotationDelay = 3500;
  let currentSlide = Math.max(0, slides.findIndex((slide) => slide.dataset.current === "true"));
  let heroIsVisible = false;
  let rotationTimer = null;
  let manuallyPaused = reducedMotion.matches;

  function stopRotation() {
    if (rotationTimer !== null) {
      window.clearTimeout(rotationTimer);
      rotationTimer = null;
    }
  }

  function updateSlide() {
    slides.forEach((slide, index) => {
      const isCurrent = index === currentSlide;
      slide.dataset.current = String(isCurrent);
      slide.setAttribute("aria-hidden", String(!isCurrent));
      slide.setAttribute("aria-label", "Slide " + (index + 1) + " of " + slides.length + ": " + slide.dataset.slideName);
      if (isCurrent) slide.setAttribute("aria-current", "true");
      else slide.removeAttribute("aria-current");
      previews[index].setAttribute("data-current", String(isCurrent));
    });

    position.textContent =
      String(currentSlide + 1).padStart(2, "0") + " / " + String(slides.length).padStart(2, "0");
    progressFill.style.width = ((currentSlide + 1) / slides.length) * 100 + "%";
  }

  function canRotate() {
    return heroIsVisible && !document.hidden && !reducedMotion.matches && !manuallyPaused;
  }

  function updatePlaybackToggle() {
    const isPaused = manuallyPaused || reducedMotion.matches;
    playbackToggle.hidden = reducedMotion.matches;
    playbackToggle.dataset.paused = String(isPaused);
    playbackToggle.setAttribute("aria-pressed", String(isPaused));
    playbackToggle.setAttribute(
      "aria-label",
      reducedMotion.matches
        ? "Automatic slideshow paused due to reduced motion"
        : manuallyPaused
          ? "Resume slideshow"
          : "Pause slideshow"
    );
  }

  function scheduleRotation() {
    stopRotation();
    if (!canRotate()) return;

    rotationTimer = window.setTimeout(() => {
      currentSlide = (currentSlide + 1) % slides.length;
      updateSlide();
      scheduleRotation();
    }, rotationDelay);
  }

  function updateVisibility(isVisible) {
    heroIsVisible = Boolean(isVisible);
    scheduleRotation();
  }

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      const entry = entries.find((candidate) => candidate.target === hero);
      if (entry) updateVisibility(entry.isIntersecting && entry.intersectionRatio > 0);
    }, { threshold: 0 });
    observer.observe(hero);
  } else {
    const checkVisibility = () => {
      const bounds = hero.getBoundingClientRect();
      updateVisibility(bounds.bottom > 0 && bounds.top < window.innerHeight);
    };
    window.addEventListener("scroll", checkVisibility, { passive: true });
    window.addEventListener("resize", checkVisibility);
    checkVisibility();
  }

  document.addEventListener("visibilitychange", scheduleRotation);

  playbackToggle.addEventListener("click", () => {
    if (reducedMotion.matches) return;

    manuallyPaused = !manuallyPaused;
    updatePlaybackToggle();
    scheduleRotation();
  });

  const handleMotionChange = () => {
    if (reducedMotion.matches) manuallyPaused = true;
    motionNote.hidden = !reducedMotion.matches;
    updatePlaybackToggle();
    scheduleRotation();
  };
  if (typeof reducedMotion.addEventListener === "function") {
    reducedMotion.addEventListener("change", handleMotionChange);
  } else if (typeof reducedMotion.addListener === "function") {
    reducedMotion.addListener(handleMotionChange);
  }

  motionNote.hidden = !reducedMotion.matches;
  updatePlaybackToggle();
  updateSlide();
})();
