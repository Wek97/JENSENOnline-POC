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

const logOut = async () => {
  await new DataClient("accounts/logout").logOut();
  location.href = "/pages/users/login.html";
};

initApp();

logout.addEventListener("click", logOut);
