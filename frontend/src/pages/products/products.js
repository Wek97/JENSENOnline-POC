import Navbar from "../../utilities/menu.js";
import DataClient from "../../utilities/data-client.js";

const productList = document.querySelector("#product-list");

const initApp = async () => {
  new Navbar();

  const client = new DataClient("products");
  const products = await client.listAll();

  if (products) {
    displayProducts(products);
  }
};

const displayProducts = (products) => {
  products.forEach((product) => {
    const section = document.createElement("section");
    section.classList.add("product-item");

    const name = document.createElement("h4");
    name.textContent = product.name;

    const description = document.createElement("p");
    description.textContent = product.description;

    const price = document.createElement("p");
    price.textContent = `${product.price.toFixed(2)} Kr`;

    section.append(name, description, price);
    productList.append(section);
  });
};

initApp();
