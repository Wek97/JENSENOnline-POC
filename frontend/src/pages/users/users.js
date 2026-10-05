import Navbar from "../../utilities/menu.js";
import DataClient from "../../utilities/data-client.js";

const form = document.querySelector("form");
const message = document.querySelector("#message");

const initApp = () => {
  new Navbar();
};

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    const client = new DataClient("accounts/register");
    const result = await client.add(data);

    if (result) {
      form.reset();
      location.href = "/pages/users/login.html";
    }
  } catch (error) {
    message.textContent =
      "Kunde inte skapa konto. Kontrollera uppgifterna eller prova en annan e-post.";
  }
};

initApp();

form.addEventListener("submit", handleSubmit);
