export default class Navbar {
  constructor() {
    const navbar = this.#createNavbar();
    document.querySelector("header").insertAdjacentHTML("afterbegin", navbar);
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
