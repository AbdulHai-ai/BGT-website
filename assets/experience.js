/* Progressive, dependency-free interface interactions. The 3D scene is isolated. */
(() => {
  "use strict";
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  let motionPaused = false;
  const flowControllers = new WeakMap();
  const setTabKeys = (tabs, select) =>
    tabs.forEach((tab, index) => {
      tab.addEventListener("keydown", (event) => {
        let next = index;
        if (event.key === "ArrowRight" || event.key === "ArrowDown")
          next = (index + 1) % tabs.length;
        else if (event.key === "ArrowLeft" || event.key === "ArrowUp")
          next = (index - 1 + tabs.length) % tabs.length;
        else if (event.key === "Home") next = 0;
        else if (event.key === "End") next = tabs.length - 1;
        else return;
        event.preventDefault();
        select(next, true);
        tabs[next].focus();
      });
    });

  document.querySelectorAll("[data-flow]").forEach((root) => {
    const tabs = [...root.querySelectorAll("[data-flow-tab]")];
    const panels = [...root.querySelectorAll("[data-flow-panel]")];
    let current = 0;
    let manualY = null;
    const select = (index, manual = false) => {
      if (manual) manualY = scrollY;
      current = index;
      tabs.forEach((tab, i) => {
        tab.setAttribute("aria-selected", String(i === index));
        tab.tabIndex = i === index ? 0 : -1;
      });
      panels.forEach((panel, i) => {
        panel.classList.toggle("is-active", i === index);
        panel.hidden = i !== index;
      });
    };
    tabs.forEach((tab, index) =>
      tab.addEventListener("click", () => select(index, true)),
    );
    setTabKeys(tabs, select);
    root.querySelectorAll("[data-sample-time]").forEach((button) => {
      button.addEventListener("click", () => {
        root
          .querySelectorAll("[data-sample-time]")
          .forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
        root.querySelectorAll("[data-booking-time]").forEach((label) => {
          label.textContent = button.dataset.sampleTime;
        });
      });
    });
    select(0);
    flowControllers.set(root, {
      selectAuto(index) {
        if (manualY !== null && Math.abs(scrollY - manualY) < 100) return;
        manualY = null;
        if (index !== current) select(index);
      },
    });
  });

  document.querySelectorAll("[data-dashboard]").forEach((root) => {
    const tabs = [...root.querySelectorAll("[data-dash-tab]")];
    const panels = [...root.querySelectorAll("[data-dash-panel]")];
    const select = (index) => {
      tabs.forEach((tab, i) => {
        tab.setAttribute("aria-selected", String(i === index));
        tab.tabIndex = i === index ? 0 : -1;
      });
      panels.forEach((panel, i) => {
        panel.classList.toggle("is-active", i === index);
        panel.hidden = i !== index;
      });
    };
    tabs.forEach((tab, i) => tab.addEventListener("click", () => select(i)));
    setTabKeys(tabs, select);
    select(0);
  });

  const pauseButton = document.createElement("button");
  pauseButton.type = "button";
  pauseButton.className = "page-motion-toggle";
  pauseButton.setAttribute("aria-pressed", "false");
  pauseButton.textContent = "Pause motion";
  pauseButton.hidden = reduced.matches;
  document.querySelector(".hero-bottomline")?.append(pauseButton);
  pauseButton.addEventListener("click", () => {
    motionPaused = !motionPaused;
    document.body.classList.toggle("motion-paused", motionPaused);
    pauseButton.textContent = motionPaused ? "Resume motion" : "Pause motion";
    pauseButton.setAttribute("aria-pressed", String(motionPaused));
    dispatchEvent(
      new CustomEvent("bht-motion-change", {
        detail: { paused: motionPaused },
      }),
    );
  });
  reduced.addEventListener("change", () => {
    pauseButton.hidden = reduced.matches;
    updateStory();
  });

  const hero = document.querySelector("[data-hero-scene]");
  if ("IntersectionObserver" in window) {
    const reveal = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in-view");
            reveal.unobserve(entry.target);
          }
        }),
      { threshold: 0.1 },
    );
    document
      .querySelectorAll("[data-reveal]")
      .forEach((node) => reveal.observe(node));
    if (hero) {
      const heroObserver = new IntersectionObserver(
        (entries) => {
          hero.classList.toggle("is-visible", entries[0].isIntersecting);
        },
        { threshold: 0.04 },
      );
      heroObserver.observe(hero);
    }
  }

  const story = document.querySelector("[data-story]");
  const storySteps = story
    ? [...story.querySelectorAll("[data-story-step]")]
    : [];
  const storyFlow = story?.querySelector("[data-flow]");
  const wide = matchMedia("(min-width: 851px)");
  let scrollFrame = 0;
  function updateStory() {
    scrollFrame = 0;
    if (!story || !wide.matches || reduced.matches || motionPaused) return;
    const region = story.getBoundingClientRect();
    if (region.top > innerHeight || region.bottom < 0) return;
    const marker = innerHeight * 0.48;
    let active = 0,
      distance = Infinity;
    storySteps.forEach((step, index) => {
      const box = step.getBoundingClientRect();
      const d = Math.abs(box.top + Math.min(box.height / 2, 130) - marker);
      if (d < distance) {
        distance = d;
        active = index;
      }
    });
    storySteps.forEach((step, i) =>
      step.classList.toggle("is-current", i === active),
    );
    flowControllers.get(storyFlow)?.selectAuto(active);
  }
  addEventListener(
    "scroll",
    () => {
      if (!scrollFrame) scrollFrame = requestAnimationFrame(updateStory);
    },
    { passive: true },
  );
  wide.addEventListener("change", updateStory);
  updateStory();

  const studios = [];
  document.querySelectorAll("[data-studio]").forEach((root) => {
    const play = root.querySelector("[data-study-play]");
    const label = play.querySelector("span");
    const art = root.querySelector("[data-study-art]");
    const copy = root.querySelector("[data-study-copy]");
    const clock = root.querySelector("[data-study-clock]");
    const progress = root.querySelector("[data-study-progress]");
    const duration = 12000;
    let elapsed = 0,
      playing = false,
      start = 0,
      raf = 0,
      phase = -1;
    const phrases = [
      "Beyond<br>the frame.",
      "One idea.<br>New worlds.",
      "Make<br>it move.",
    ];
    const setPlaying = (state) => {
      playing = state;
      play.setAttribute("aria-pressed", String(state));
      play.setAttribute(
        "aria-label",
        state
          ? "Pause motion study"
          : elapsed >= duration
            ? "Replay motion study"
            : "Play motion study",
      );
      label.textContent = state
        ? "Pause motion study"
        : elapsed >= duration
          ? "Replay study"
          : "Play motion study";
      const path = play.querySelector("path");
      path.setAttribute("d", state ? "M8 5v14M16 5v14" : "m8 5 11 7-11 7Z");
      root.classList.toggle("study-playing", state);
    };
    const paint = () => {
      const fraction = Math.min(1, elapsed / duration);
      art.style.setProperty("--study-progress", fraction.toFixed(4));
      progress.style.width = `${fraction * 100}%`;
      clock.textContent = `0:${String(Math.floor(elapsed / 1000)).padStart(2, "0")} / 0:12`;
      const nextPhase = Math.min(2, Math.floor(fraction * 3));
      if (nextPhase !== phase) {
        copy.innerHTML = phrases[nextPhase];
        phase = nextPhase;
      }
    };
    const tick = (time) => {
      if (!playing) return;
      elapsed = Math.min(duration, time - start);
      paint();
      if (elapsed >= duration) {
        setPlaying(false);
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    const pause = () => {
      if (!playing) return;
      elapsed = Math.min(duration, performance.now() - start);
      cancelAnimationFrame(raf);
      setPlaying(false);
      paint();
    };
    play.addEventListener("click", () => {
      if (playing) {
        pause();
        return;
      }
      if (elapsed >= duration) elapsed = 0;
      start = performance.now() - elapsed;
      setPlaying(true);
      raf = requestAnimationFrame(tick);
    });
    root.querySelectorAll("[data-ratio]").forEach((button) =>
      button.addEventListener("click", () => {
        root
          .querySelectorAll("[data-ratio]")
          .forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
        art.dataset.format = button.dataset.ratio;
      }),
    );
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        if (!entries[0].isIntersecting) pause();
      });
      observer.observe(root);
    }
    studios.push({ pause });
    paint();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) studios.forEach((studio) => studio.pause());
    if (hero) hero.classList.toggle("document-hidden", document.hidden);
  });
  addEventListener("bht-motion-change", (event) => {
    if (event.detail.paused) studios.forEach((studio) => studio.pause());
  });
})();
