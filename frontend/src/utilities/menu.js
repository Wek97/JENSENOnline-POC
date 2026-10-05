import DataClient from "./data-client.js";

export default class Navbar {
  constructor() {
    const navbar = this.#createNavbar();
    document.querySelector("header").insertAdjacentHTML("afterbegin", navbar);
    this.#addUserLinks();
  }

  async #addUserLinks() {
    const user = await new DataClient("accounts/me").getUserInfo();
    const menu = document.querySelector("nav ul");

    if (!user) {
      menu.insertAdjacentHTML(
        "beforeend",
        /*html*/ `
        <li class="menu-item"><a href="/pages/users/login.html">Logga in</a></li>`,
      );
      return;
    }

    if (user.role === "admin") {
      menu.insertAdjacentHTML(
        "beforeend",
        /*html*/ `
        <li class="menu-item"><a href="/pages/admin/admin.html">Admin</a></li>`,
      );
    }

    menu.insertAdjacentHTML(
      "beforeend",
      /*html*/ `
      <li class="menu-item"><a href="/pages/users/profile.html">Mitt konto</a></li>`,
    );
  }

  #createNavbar() {
    return /*html*/ `
      <nav>
        <ul>
          <li class="logo">
            <a href="/"><span>JENSENOnline</span></a>
          </li>
          <li class="toggle">
            <input type="checkbox" id="menu-btn" class="menu-btn" />
            <label for="menu-btn" class="menu-icon">
              <span class="nav-icon"></span>
            </label>
          </li>
          <li class="menu-item"><a href="/">Start</a></li>
          <li class="menu-item"><a href="/pages/products/products.html">Produkter</a></li>
        </ul>
      </nav>`;
  }
}
