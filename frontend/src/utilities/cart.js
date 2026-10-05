export default class Cart {
  constructor(key) {
    this.key = key;
  }

  getCartItems() {
    const items = JSON.parse(localStorage.getItem(this.key));
    if (!items) return [];
    return items;
  }

  setCartItems(data) {
    localStorage.setItem(this.key, JSON.stringify(data));
  }

  updateCart(item) {
    let items = this.getCartItems();
    let found = items.find((i) => i.id === item.id);

    if (found) {
      item.quantity = found.quantity + 1;
      items = items.filter((i) => i.id !== item.id);
    } else {
      item.quantity = 1;
    }

    items.push(item);
    this.setCartItems(items);
  }

  removeItem(id) {
    const items = this.getCartItems().filter((i) => i.id !== id);
    this.setCartItems(items);
  }

  clearCart() {
    localStorage.removeItem(this.key);
  }
}
