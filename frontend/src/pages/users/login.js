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
    const client = new DataClient("accounts/login");
    await client.login(data);
    form.reset();
    location.href = "/pages/users/profile.html";
  } catch (error) {
    message.textContent = "Fel e-post eller lösenord.";
  }
};

initApp();

form.addEventListener("submit", handleSubmit);
