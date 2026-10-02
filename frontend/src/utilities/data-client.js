import { settings } from "../config/settings.js";

export default class DataClient {
  #data = undefined;
  #url = "";

  constructor(resource) {
    this.#url = `${settings.BASE_API_URL}/${resource}`;
  }

  async listAll() {
    await this.#fetchData();
    return this.#data;
  }

  async #fetchData() {
    try {
      const response = await fetch(this.#url);

      if (response.ok) {
        this.#data = await response.json();
        return;
      }
    } catch (error) {
      console.log(error);
    }
  }
}
