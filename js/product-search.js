(() => {
  const search = document.querySelector("[data-product-search]");
  const form = search?.querySelector("[data-product-search-form]");
  const input = search?.querySelector("[data-product-search-input]");
  const clearButton = search?.querySelector("[data-product-search-clear]");
  const status = search?.querySelector("[data-product-search-status]");
  const cards = Array.from(document.querySelectorAll("#product-grid .product-card"));

  if (!search || !form || !input || !clearButton || !status || cards.length === 0) return;

  const searchableText = new Map(cards.map((card) => {
    const title = card.querySelector(".card-title")?.textContent || "";
    const category = card.querySelector(".card-subtitle")?.textContent || "";
    return [card, normalize(title + " " + category)];
  }));

  function normalize(value) {
    return value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim()
      .toLocaleLowerCase();
  }

  function applyFilter() {
    const query = normalize(input.value);
    let visibleCount = 0;

    cards.forEach((card) => {
      const matches = !query || searchableText.get(card).includes(query);
      card.hidden = !matches;
      if (matches) visibleCount += 1;
    });

    clearButton.disabled = query.length === 0;
    status.textContent = query
      ? visibleCount === 0
        ? "No matching footwear references."
        : "Showing " + visibleCount + " of " + cards.length + " products."
      : "All " + cards.length + " products are visible.";
  }

  form.addEventListener("submit", (event) => event.preventDefault());
  input.addEventListener("input", applyFilter);
  clearButton.addEventListener("click", () => {
    input.value = "";
    applyFilter();
    input.focus();
  });

  search.addEventListener("toggle", () => {
    if (search.open) {
      window.requestAnimationFrame(() => input.focus());
      return;
    }

    if (input.value) {
      input.value = "";
      applyFilter();
    }
  });

  search.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !search.open) return;
    event.preventDefault();
    search.open = false;
    input.value = "";
    applyFilter();
    search.querySelector("summary")?.focus();
  });

  document.addEventListener("pointerdown", (event) => {
    if (search.open && !search.contains(event.target)) search.open = false;
  });

  applyFilter();
})();
