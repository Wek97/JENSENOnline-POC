import Navbar from "../../utilities/menu.js";
import DataClient from "../../utilities/data-client.js";

const form = document.querySelector("form");
const formTitle = document.querySelector("#form-title");
const message = document.querySelector("#message");
const productList = document.querySelector("#admin-products");

const initApp = async () => {
  new Navbar();

  const user = await new DataClient("accounts/me").getUserInfo();
  if (!user || user.role !== "admin") {
    location.href = "/";
    return;
  }

  loadProducts();
};

const loadProducts = async () => {
  const products = await new DataClient("products").listAll();
  productList.replaceChildren();

  products.forEach((product) => {
    const item = document.createElement("div");
    item.classList.add("admin-item");

    const text = document.createElement("span");
    text.textContent = `${product.name} – ${product.price.toFixed(2)} Kr`;

    const button = document.createElement("button");
    button.classList.add("btn", "btn-rounded");
    button.textContent = "Ändra";
    button.addEventListener("click", () => fillForm(product));

    item.append(text, button);
    productList.append(item);
  });
};

const fillForm = (product) => {
  form.id.value = product.id;
  form.name.value = product.name;
  form.description.value = product.description;
  form.category.value = product.category;
  form.price.value = product.price;
  formTitle.textContent = "Ändra produkt";
  message.textContent = "";
};

const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  const id = data.id;
  delete data.id;
  data.price = Number(data.price);

  try {
    const client = new DataClient("products");
    const success = id ? await client.update(id, data) : await client.add(data);

    if (!success) throw new Error("Kunde inte spara");

    message.textContent = id ? "Produkten är ändrad." : "Produkten är skapad.";
    form.reset();
    formTitle.textContent = "Lägg till produkt";
    loadProducts();
  } catch (error) {
    message.textContent =
      "Kunde inte spara produkten. Kontrollera uppgifterna.";
  }
};

initApp();

form.addEventListener("submit", handleSubmit);
