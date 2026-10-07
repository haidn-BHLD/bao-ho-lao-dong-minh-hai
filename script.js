document.getElementById("year").textContent = new Date().getFullYear();

const filters = document.querySelectorAll(".filter");
const cards = document.querySelectorAll(".product-card");

filters.forEach((button) => {
  button.addEventListener("click", () => {
    filters.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    const filter = button.dataset.filter;
    cards.forEach((card) => {
      const show = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("is-hidden", !show);
    });
  });
});
