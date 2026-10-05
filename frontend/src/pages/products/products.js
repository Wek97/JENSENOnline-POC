import Navbar from "../../utilities/menu.js";
import DataClient from "../../utilities/data-client.js";
import Cart from "../../utilities/cart.js";

const productList = document.querySelector("#product-list");
const searchForm = document.querySelector("#search-form");
const cart = new Cart("cart");

const initApp = async () => {
  new Navbar();
  await loadProducts("");
};

const loadProducts = async (search) => {
  const client = new DataClient(
    `products?search=${encodeURIComponent(search)}`,
  );
  const products = await client.listAll();

  if (products) {
    displayProducts(products);
  }
};

const handleSearch = async (e) => {
  e.preventDefault();
  const search = document.querySelector("#search").value.trim();
  await loadProducts(search);
};

const displayProducts = (products) => {
  productList.replaceChildren();

  if (products.length === 0) {
    const message = document.createElement("p");
    message.textContent = "Inga produkter hittades.";
    productList.append(message);
    return;
  }

  products.forEach((product) => {
    const section = document.createElement("section");
    section.classList.add("product-item");

    const name = document.createElement("h4");
    name.textContent = product.name;

    const description = document.createElement("p");
    description.textContent = product.description;

    const price = document.createElement("p");
    price.textContent = `${product.price.toFixed(2)} Kr`;

    const button = document.createElement("button");
    button.classList.add("btn", "btn-rounded");
    button.textContent = "Lägg i kundvagn";
    button.addEventListener("click", () => {
      cart.updateCart({
        id: product.id,
        name: product.name,
        price: product.price,
      });
      button.textContent = "Tillagd!";
    });

    section.append(name, description, price, button);
    productList.append(section);
  });
};

initApp();

searchForm.addEventListener("submit", handleSearch);
