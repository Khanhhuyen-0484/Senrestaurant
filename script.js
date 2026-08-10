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

const applyDishFilter = (filter) => {
  dishMenuCards.forEach((card) => {
    card.classList.toggle("hidden", card.dataset.dishCategory !== filter);
  });
};

dishFilterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.dishFilter;
    dishFilterButtons.forEach((item) => item.classList.toggle("active", item === button));
    applyDishFilter(filter);
  });
});

const activeDishFilter = document.querySelector("[data-dish-filter].active")?.dataset.dishFilter;
if (activeDishFilter) {
  applyDishFilter(activeDishFilter);
}

document.querySelector("form.booking-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const name = new FormData(form).get("name") || "quý khách";
  form.querySelector(".form-status").textContent = `Cảm ơn ${name}, Sen đã nhận yêu cầu tư vấn.`;
  form.reset();
});
