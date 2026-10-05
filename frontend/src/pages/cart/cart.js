import Navbar from "../../utilities/menu.js";
import DataClient from "../../utilities/data-client.js";
import Cart from "../../utilities/cart.js";

const cartItems = document.querySelector("#cart-items");
const cartTotal = document.querySelector("#cart-total");
const orderButton = document.querySelector("#order-button");
const message = document.querySelector("#message");

const cart = new Cart("cart");

const initApp = () => {
  new Navbar();
  loadCart();
};

const loadCart = () => {
  const items = cart.getCartItems();
  cartItems.replaceChildren();

  if (items.length === 0) {
    cartTotal.textContent = "Din kundvagn är tom.";
    orderButton.style.display = "none";
    return;
  }

  items.forEach((item) => {
    const row = document.createElement("div");
    row.classList.add("cart-item");

    const text = document.createElement("span");
    text.textContent = `${item.name} – ${item.quantity} st à ${item.price.toFixed(2)} Kr`;

    const button = document.createElement("button");
    button.classList.add("btn", "btn-rounded");
    button.textContent = "Ta bort";
    button.addEventListener("click", () => {
      cart.removeItem(item.id);
      loadCart();
    });

    row.append(text, button);
    cartItems.append(row);
  });

  const total = items.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0,
  );
  cartTotal.textContent = `Summa: ${total.toFixed(2)} Kr`;
};

const handleOrder = async () => {
  const items = cart.getCartItems().map((item) => ({
    productId: item.id,
    quantity: item.quantity,
  }));

  try {
    await new DataClient("orders").add({ items });
    cart.clearCart();
    loadCart();
    message.textContent =
      "Tack för din beställning! Du hittar den under Mitt konto.";
  } catch (error) {
    message.textContent = "Kunde inte lägga ordern. Är du inloggad?";
  }
};

initApp();

orderButton.addEventListener("click", handleOrder);
