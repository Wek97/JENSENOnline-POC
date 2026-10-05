import { settings } from "../config/settings.js";

export default class DataClient {
  #data = undefined;
  #url = "";

  constructor(resource) {
    this.#url = `${settings.BASE_API_URL}/${resource}`;
  }

  async add(data) {
    const success = await this.#addData(data);
    return success;
  }

  async update(id, data) {
    const success = await this.#updateData(id, data);
    return success;
  }

  async listAll() {
    await this.#fetchData();
    return this.#data;
  }

  async login(data) {
    try {
      const response = await fetch(this.#url, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (response.ok) {
        return await response.json();
      }

      throw new Error(`${response.status} - ${response.statusText}`);
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  async getUserInfo() {
    try {
      const response = await fetch(this.#url, {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        return await response.json();
      } else {
        throw new Error(`${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async logOut() {
    try {
      const response = await fetch(this.#url, {
        method: "POST",
        credentials: "include",
      });

      if (response.status !== 204) {
        throw new Error(`${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async #addData(data) {
    try {
      const response = await fetch(this.#url, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (response.status === 201) {
        return true;
      } else {
        throw new Error(`${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  async #updateData(id, data) {
    try {
      const response = await fetch(`${this.#url}/${id}`, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (response.ok) return true;
      return false;
    } catch (error) {
      console.log(error);
    }
  }

  async #fetchData() {
    try {
      const response = await fetch(this.#url, { credentials: "include" });

      if (response.ok) {
        this.#data = await response.json();
        return;
      }
    } catch (error) {
      console.log(error);
    }
  }
}
