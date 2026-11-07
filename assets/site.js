/* Big Hawk Technologies. Progressive enhancements; all page content is static HTML. */
(() => {
  "use strict";

  // Preserve the original contact assembly, with real anchor fallbacks for keyboard/no-JS use.
  const number = ["92", "321"].join("") + ["339", "2689"].join("");
  const contact = {
    whatsapp: ["https:", "//", "wa", ".me/"].join("") + number,
    email:
      ["mail", "to:"].join("") +
      ["bighawk", "technologies"].join("") +
      String.fromCharCode(64) +
      ["gmail", "com"].join("."),
    call: ["tel", ":+"].join("") + number,
  };
  document.querySelectorAll("[data-contact-action]").forEach((link) => {
    const destination = contact[link.dataset.contactAction];
    if (destination) link.href = destination;
  });

  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#main-nav");
  if (toggle && nav) {
    const closeMenu = (returnFocus = false) => {
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open navigation");
      nav.classList.remove("is-open");
      if (returnFocus) toggle.focus();
    };
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") !== "true";
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute(
        "aria-label",
        open ? "Close navigation" : "Open navigation",
      );
      nav.classList.toggle("is-open", open);
    });
    document.addEventListener("keydown", (event) => {
      if (
        event.key === "Escape" &&
        toggle.getAttribute("aria-expanded") === "true"
      ) {
        closeMenu(true);
      }
    });
    document.addEventListener("click", (event) => {
      if (!event.target.closest(".site-header"))
        closeMenu(nav.contains(document.activeElement));
    });
    document.addEventListener("focusin", (event) => {
      if (!event.target.closest(".site-header")) closeMenu();
    });
    nav.querySelectorAll("a").forEach((link) =>
      link.addEventListener("click", () => {
        if (toggle.getAttribute("aria-expanded") !== "true") return;
        closeMenu();
        const destination = new URL(link.href);
        if (destination.pathname === location.pathname && destination.hash) {
          document
            .getElementById(destination.hash.slice(1))
            ?.focus({ preventScroll: true });
        }
      }),
    );
    const desktop = matchMedia("(min-width: 851px)");
    desktop.addEventListener("change", () => {
      const focusedInNav = nav.contains(document.activeElement);
      closeMenu(!desktop.matches && focusedInNav);
    });
    document.documentElement.classList.add("js");
  }

  const form = document.querySelector("#project-form");
  if (form) {
    const interest = form.elements.service;
    const selectedService = new URLSearchParams(location.search).get("service");
    if (
      selectedService &&
      [...interest.options].some((option) => option.value === selectedService)
    ) {
      interest.value = selectedService;
    }
    const status = document.querySelector("#form-status");
    const submit = form.querySelector('[type="submit"]');
    const validationFields = [...form.querySelectorAll("[data-validate]")];
    let pending = false;
    form.noValidate = true;
    const valid = (input) => {
      const value = input.value.trim();
      if (input.name === "name") return value.length >= 2;
      if (input.name === "email")
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && input.validity.valid;
      if (input.name === "message") return value.length >= 5;
      return Boolean(value);
    };
    const updateValidity = (input) => {
      const okay = valid(input);
      input.setAttribute("aria-invalid", String(!okay));
      document.getElementById(input.getAttribute("aria-describedby")).hidden =
        okay;
      return okay;
    };
    validationFields.forEach((input) => {
      input.addEventListener("blur", () => updateValidity(input));
      input.addEventListener("input", () => {
        if (input.getAttribute("aria-invalid") === "true")
          updateValidity(input);
      });
      input.addEventListener("change", () => {
        if (input.getAttribute("aria-invalid") === "true")
          updateValidity(input);
      });
    });
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (pending) return;
      const results = validationFields.map((input) => ({
        input,
        okay: updateValidity(input),
      }));
      const invalid = results.find((result) => !result.okay);
      if (invalid) {
        status.className = "form-status error";
        status.textContent =
          "Please check the highlighted fields before sending.";
        invalid.input.focus();
        return;
      }
      pending = true;
      submit.disabled = true;
      submit.textContent = "Sending enquiry…";
      form.setAttribute("aria-busy", "true");
      status.className = "form-status";
      status.textContent = "Sending your enquiry…";
      const payload = Object.fromEntries(new FormData(form));
      Object.keys(payload).forEach((key) => {
        payload[key] = payload[key].trim();
      });
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 20000);
      try {
        if (location.protocol === "file:")
          throw new Error("Static file preview");
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Request failed");
        const type = response.headers.get("content-type") || "";
        // Reject a static host's HTML fallback rather than mistaking it for receipt.
        if (type.includes("text/html")) throw new Error("Endpoint unavailable");
        if (type.includes("application/json") && response.status !== 204) {
          const result = await response.json();
          if (result && (result.success === false || result.ok === false))
            throw new Error("Enquiry rejected");
        }
        status.className = "form-status success";
        status.textContent =
          "Thank you. Your enquiry was received. We’ll review your brief and reply by email.";
        form.reset();
        if (
          selectedService &&
          [...interest.options].some(
            (option) => option.value === selectedService,
          )
        )
          interest.value = selectedService;
        validationFields.forEach((input) =>
          input.removeAttribute("aria-invalid"),
        );
      } catch (error) {
        status.className = "form-status error";
        status.textContent =
          error.name === "AbortError"
            ? "We couldn’t confirm receipt. Your details are still here. Please contact us by email or WhatsApp before trying again."
            : "Your enquiry could not be sent. Your details are still here. Please try again, or use the email or WhatsApp links below.";
      } finally {
        clearTimeout(timeout);
        pending = false;
        submit.disabled = false;
        submit.textContent = "Send enquiry";
        form.removeAttribute("aria-busy");
      }
    });
  }

  const search = document.querySelector("#client-search");
  if (search) {
    const clients = [...document.querySelectorAll("#client-directory > li")];
    const count = document.querySelector("#client-count");
    const empty = document.querySelector("#client-empty");
    const wall = document.querySelector("#client-directory");
    const normalize = (value) =>
      value
        .toLocaleLowerCase()
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "");
    const filterClients = () => {
      const query = normalize(search.value.trim());
      let matches = 0;
      clients.forEach((client) => {
        const match = normalize(client.textContent).includes(query);
        client.hidden = !match;
        if (match) matches++;
      });
      count.textContent = query
        ? `${matches} of ${clients.length} clients`
        : `${clients.length} clients`;
      empty.hidden = matches !== 0;
      wall.hidden = matches === 0;
    };
    search.addEventListener("input", filterClients);
    document.querySelector("#clear-search").addEventListener("click", () => {
      search.value = "";
      filterClients();
      search.focus();
    });
    document.querySelector("#directory-tools").hidden = false;
  }

  // Progressive reveal: content is never hidden awaiting JavaScript or observation.
  if (
    "IntersectionObserver" in window &&
    !matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-in");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.08 },
    );
    document
      .querySelectorAll("[data-reveal]")
      .forEach((element) => observer.observe(element));
  }
})();
