const navToggle = document.querySelector(".nav-toggle");
const mainNav = document.querySelector(".main-nav");
const navLinks = [...document.querySelectorAll(".main-nav a")];
const currentPage = document.body.dataset.page;

document.querySelector(`[data-page-link="${currentPage}"]`)?.classList.add("active");

navToggle?.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

const filterButtons = document.querySelectorAll(".filters button");
const menuCards = document.querySelectorAll(".menu-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle("active", item === button));
    menuCards.forEach((card) => {
      const categories = card.dataset.category.split(" ");
      card.classList.toggle("hidden", filter !== "all" && !categories.includes(filter));
    });
  });
});

const menuCategoryButtons = document.querySelectorAll("[data-menu-target]");
const menuPanels = document.querySelectorAll("[data-menu-panel]");

menuCategoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const targetId = button.dataset.menuTarget;
    menuCategoryButtons.forEach((item) => item.classList.toggle("active", item === button));
    menuPanels.forEach((panel) => {
      panel.classList.toggle("active", panel.id === targetId);
    });
  });
});

const dishFilterButtons = document.querySelectorAll("[data-dish-filter]");
const dishMenuCards = document.querySelectorAll("[data-dish-category]");
const dishBookTitle = document.querySelector("[data-dish-book-title]");
const dishPageButtons = document.querySelectorAll("[data-dish-page]");
const dishBookSpread = document.querySelector(".dish-book-spread");
const dishSpreadTitle = document.querySelector("[data-dish-spread-title]");
const dishBookList = document.querySelector("[data-dish-book-list]");
const dishBookPhotos = document.querySelector("[data-dish-book-photos]");
const isMobileMenu = () => window.matchMedia("(max-width: 640px)").matches;

const loadDishCardImage = (card) => {
  const image = card.querySelector("img[data-src]");
  if (!image) return;
  image.src = image.dataset.src;
  image.removeAttribute("data-src");
};

const applyDishFilter = (filter) => {
  dishMenuCards.forEach((card) => {
    const isVisible = card.dataset.dishCategory === filter;
    if (isVisible) loadDishCardImage(card);
    card.classList.toggle("hidden", !isVisible);
  });
};

const renderDishBookSpread = (filter, title) => {
  if (!dishBookList || !dishBookPhotos || !dishSpreadTitle) return;

  const cards = [...dishMenuCards].filter((card) => card.dataset.dishCategory === filter);
  dishSpreadTitle.textContent = title;
  dishBookList.replaceChildren();
  dishBookPhotos.replaceChildren();

  cards.forEach((card) => {
    const name = card.querySelector("h3")?.textContent.trim() || "";
    const price = card.querySelector("strong")?.textContent.trim() || "";
    const item = document.createElement("li");
    const itemName = document.createElement("span");
    const itemPrice = document.createElement("strong");
    itemName.textContent = name;
    itemPrice.textContent = price;
    item.append(itemName, itemPrice);
    dishBookList.append(item);
  });

  cards.slice(0, 3).forEach((card, index) => {
    const image = card.querySelector("img");
    const figure = document.createElement("figure");
    const photo = document.createElement("img");
    photo.src = image?.currentSrc || image?.src || image?.dataset.src || "";
    photo.alt = image?.alt || "";
    photo.loading = "lazy";
    figure.className = index === 0 ? "featured-photo" : "";
    figure.append(photo);
    dishBookPhotos.append(figure);
  });
};

const setActiveDishFilter = (filter, button, shouldAnimate = false) => {
  const applyFilter = () => {
    dishFilterButtons.forEach((item) => item.classList.toggle("active", item === button));
    applyDishFilter(filter);
    const title = button.textContent.trim();
    if (dishBookTitle) dishBookTitle.textContent = title;
    renderDishBookSpread(filter, title);
    if (shouldAnimate) button.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  };

  if (!shouldAnimate || !isMobileMenu() || !dishBookSpread) {
    applyFilter();
    return;
  }

  dishBookSpread.classList.add("book-turning");
  window.setTimeout(applyFilter, 120);
  window.setTimeout(() => dishBookSpread.classList.remove("book-turning"), 380);
};

dishFilterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setActiveDishFilter(button.dataset.dishFilter, button, true);
  });
});

dishPageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const buttons = [...dishFilterButtons];
    const activeIndex = Math.max(0, buttons.findIndex((item) => item.classList.contains("active")));
    const direction = button.dataset.dishPage === "next" ? 1 : -1;
    const nextButton = buttons[(activeIndex + direction + buttons.length) % buttons.length];
    setActiveDishFilter(nextButton.dataset.dishFilter, nextButton, true);
  });
});

const activeDishButton = document.querySelector("[data-dish-filter].active");
if (activeDishButton) {
  setActiveDishFilter(activeDishButton.dataset.dishFilter, activeDishButton);
}

document.querySelector("form.booking-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const name = new FormData(form).get("name") || "quý khách";
  form.querySelector(".form-status").textContent = `Cảm ơn ${name}, Sen đã nhận yêu cầu tư vấn.`;
  form.reset();
});
