
(function () {
  "use strict";
  var grid = document.getElementById("partnerGrid");
  var status = document.getElementById("partnerStatus");
  var filterButtons = Array.prototype.slice.call(document.querySelectorAll("[data-partner-filter]"));
  var records = [];
  var activeFilter = "all";

  function make(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function validUrl(value) {
    if (typeof value !== "string") return null;
    if (value.charAt(0) === "/" && value.charAt(1) !== "/") return value;
    try {
      var parsed = new URL(value);
      return parsed.protocol === "https:" ? parsed.href : null;
    } catch (_) {
      return null;
    }
  }

  function render() {
    if (!grid) return;
    grid.textContent = "";
    var visible = records.filter(function (item) {
      return activeFilter === "all" || item.kind === activeFilter;
    });

    visible.forEach(function (item) {
      var card = make("article", "partner-card" + (item.featured ? " is-featured" : ""));
      var top = make("div", "partner-card-top");
      var mark = make("div", "partner-mark", item.mark || (item.name ? item.name.charAt(0).toUpperCase() : "↗"));
      mark.setAttribute("aria-hidden", "true");
      var statusTag = make("span", "partner-status", item.status || "Disponível");
      top.appendChild(mark);
      top.appendChild(statusTag);

      var eyebrow = make("span", "partner-eyebrow", item.kind === "project" ? "PROJETO DO ECOSSISTEMA" : "SITE PARCEIRO");
      var title = make("h3", "", item.name || "Site");
      var category = make("span", "partner-category", item.category || "Parceiro");
      var description = make("p", "partner-description", item.description || "");
      var linkUrl = validUrl(item.url);
      var action;
      if (linkUrl) {
        action = make("a", "partner-link", item.cta || "Acessar site");
        action.href = linkUrl;
        if (/^https:/.test(linkUrl)) {
          action.target = "_blank";
          action.rel = "noopener noreferrer";
        }
      } else {
        action = make("span", "partner-link is-disabled", "Link em preparação");
      }

      card.appendChild(top);
      card.appendChild(eyebrow);
      card.appendChild(title);
      card.appendChild(category);
      card.appendChild(description);
      card.appendChild(action);
      grid.appendChild(card);
    });

    var empty = document.getElementById("partnerEmpty");
    if (empty) empty.hidden = visible.length !== 0;
    if (status) status.textContent = visible.length + (visible.length === 1 ? " item" : " itens") + " exibidos";
  }

  function setFilter(filter) {
    activeFilter = filter;
    filterButtons.forEach(function (button) {
      var selected = button.getAttribute("data-partner-filter") === filter;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-pressed", selected ? "true" : "false");
    });
    render();
  }

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      setFilter(button.getAttribute("data-partner-filter") || "all");
    });
  });

  fetch("/assets/partners.json", { cache: "no-cache" })
    .then(function (response) {
      if (!response.ok) throw new Error("Não foi possível carregar a lista de parceiros.");
      return response.json();
    })
    .then(function (data) {
      records = Array.isArray(data) ? data : [];
      render();
    })
    .catch(function () {
      if (status) status.textContent = "Não foi possível carregar os projetos agora.";
      var empty = document.getElementById("partnerEmpty");
      if (empty) {
        empty.hidden = false;
        empty.textContent = "A lista está temporariamente indisponível. Tente novamente mais tarde.";
      }
    });
})();
