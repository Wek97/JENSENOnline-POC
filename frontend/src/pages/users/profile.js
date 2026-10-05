import Navbar from "../../utilities/menu.js";
import DataClient from "../../utilities/data-client.js";

const logout = document.querySelector("#logout");

const initApp = async () => {
  new Navbar();

  const user = await new DataClient("accounts/me").getUserInfo();

  if (!user) {
    location.href = "/pages/users/login.html";
  } else {
    displayUserInfo(user);
    loadOrders();
  }
};

const displayUserInfo = (user) => {
  const userInfo = document.querySelector("#user-info");

  const email = document.createElement("p");
  email.textContent = `E-post: ${user.email}`;

  const role = document.createElement("p");
  role.textContent = `Roll: ${user.role}`;

  userInfo.append(email, role);
};

const loadOrders = async () => {
  const orders = await new DataClient("orders/mine").listAll();
  const ordersElement = document.querySelector("#orders");

  if (!orders || orders.length === 0) {
    ordersElement.textContent = "Du har inga beställningar än.";
    return;
  }

  orders.forEach((order) => {
    const heading = document.createElement("h4");
    const date = new Date(order.createdAt).toLocaleDateString("sv-SE");
    heading.textContent = `Order ${order.id} – ${date} – ${order.total.toFixed(2)} Kr`;

    const list = document.createElement("ul");
    order.items.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = `${item.productName}, ${item.quantity} st à ${item.unitPrice.toFixed(2)} Kr`;
      list.append(li);
    });

    ordersElement.append(heading, list);
  });
};

const logOut = async () => {
  await new DataClient("accounts/logout").logOut();
  location.href = "/pages/users/login.html";
};

initApp();

logout.addEventListener("click", logOut);
