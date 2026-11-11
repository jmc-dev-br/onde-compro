
(function () {
  "use strict";
  var STORAGE_KEY = "onde-compro-theme";
  var root = document.documentElement;
  var media = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;

  function systemTheme() {
    return media && media.matches ? "dark" : "light";
  }

  function applyTheme(theme, persist) {
    var selected = theme === "dark" ? "dark" : "light";
    root.setAttribute("data-theme", selected);
    root.style.colorScheme = selected;
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", selected === "dark" ? "#101713" : "#173C2C");

    var button = document.querySelector("[data-theme-toggle]");
    if (button) {
      var icon = button.querySelector(".theme-toggle-icon");
      var label = button.querySelector(".theme-toggle-label");
      if (icon) icon.textContent = selected === "dark" ? "☀" : "☾";
      if (label) label.textContent = selected === "dark" ? "Claro" : "Escuro";
      button.setAttribute("aria-label", selected === "dark" ? "Ativar modo claro" : "Ativar modo escuro");
      button.setAttribute("title", selected === "dark" ? "Mudar para modo claro" : "Mudar para modo escuro");
      button.setAttribute("aria-pressed", selected === "dark" ? "true" : "false");
    }
    if (persist) {
      try { localStorage.setItem(STORAGE_KEY, selected); } catch (_) {}
    }
  }

  function mountToggle() {
    var existing = document.querySelector("[data-theme-toggle]");
    if (existing) return existing;
    var host = document.querySelector(".nav-actions") ||
      document.querySelector(".partners-actions") ||
      document.querySelector(".social-nav") ||
      document.querySelector(".club-nav") ||
      document.querySelector("header nav");
    if (!host) return null;

    var button = document.createElement("button");
    button.type = "button";
    button.className = "theme-toggle";
    button.setAttribute("data-theme-toggle", "");
    button.innerHTML = '<span class="theme-toggle-icon" aria-hidden="true">☾</span><span class="theme-toggle-label">Escuro</span>';
    if (host.classList.contains("nav-actions") || host.classList.contains("partners-actions")) host.prepend(button);
    else host.appendChild(button);
    return button;
  }

  function init() {
    var stored = null;
    try { stored = localStorage.getItem(STORAGE_KEY); } catch (_) {}
    applyTheme(stored === "dark" || stored === "light" ? stored : systemTheme(), false);
    var toggle = mountToggle();
    if (toggle) {
      applyTheme(root.getAttribute("data-theme"), false);
      toggle.addEventListener("click", function () {
        applyTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark", true);
      });
    }

    var menuButton = document.getElementById("mobileNavToggle");
    var nav = menuButton && menuButton.closest("nav");
    if (menuButton && nav) {
      menuButton.addEventListener("click", function () {
        var open = nav.classList.toggle("is-menu-open");
        menuButton.setAttribute("aria-expanded", open ? "true" : "false");
        menuButton.textContent = open ? "× Fechar" : "☰ Menu";
      });
      nav.querySelectorAll(".navlinks a").forEach(function (link) {
        link.addEventListener("click", function () {
          nav.classList.remove("is-menu-open");
          menuButton.setAttribute("aria-expanded", "false");
          menuButton.textContent = "☰ Menu";
        });
      });
      document.addEventListener("click", function (event) {
        if (!nav.contains(event.target)) {
          nav.classList.remove("is-menu-open");
          menuButton.setAttribute("aria-expanded", "false");
          menuButton.textContent = "☰ Menu";
        }
      });
    }

    if (media && media.addEventListener) {
      media.addEventListener("change", function (event) {
        var preference = null;
        try { preference = localStorage.getItem(STORAGE_KEY); } catch (_) {}
        if (preference !== "dark" && preference !== "light") {
          applyTheme(event.matches ? "dark" : "light", false);
        }
      });
    }
    window.addEventListener("storage", function (event) {
      if (event.key === STORAGE_KEY && (event.newValue === "dark" || event.newValue === "light")) {
        applyTheme(event.newValue, false);
      }
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
