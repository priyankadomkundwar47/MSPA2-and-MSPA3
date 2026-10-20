const USD_TO_INR = 88; // Approximate rate, update as needed

// Backup products, used only if the API cannot be reached
const backupProducts = [
  { id: 1, title: "Men's Cotton Shirt", price: 25 },
  { id: 2, title: "Women's Dress", price: 30 },
  { id: 3, title: "Leather Wallet", price: 15 },
  { id: 4, title: "Smart Watch", price: 60 },
  { id: 5, title: "Running Shoes", price: 45 },
  { id: 6, title: "Cotton Socks", price: 5 },
  { id: 7, title: "Sun Glasses", price: 20 },
  { id: 8, title: "Desk Lamp", price: 35 }
];

let cart = [];
let nextCartId = 1;

const productsEl = document.getElementById("products");
const cartEl = document.getElementById("cart");
const totalEl = document.getElementById("total");

async function getProducts() {
  try {
    const res = await fetch("https://dummyjson.com/products?limit=8");
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    return data.products;
  } catch (err) {
    console.error("Could not load API, using backup list:", err);
    return backupProducts;
  }
}

async function loadProducts() {
  const raw = await getProducts();

  const products = raw.map(p => ({
    id: p.id,
    title: p.title.split(" ").pop(), // "Men's Cotton Shirt" -> "Shirt"
    price: Math.round(p.price * USD_TO_INR)
  }));

  productsEl.innerHTML = products
    .map(p => `<div class="product">${p.title} - ₹${p.price} <button data-id="${p.id}">Add to Cart</button></div>`)
    .join("");

  productsEl.onclick = e => {
    if (e.target.tagName !== "BUTTON") return;
    const product = products.find(x => x.id === Number(e.target.dataset.id));
    cart.push({ ...product, cartId: nextCartId++ });
    renderCart();
  };
}

function renderCart() {
  cartEl.innerHTML = cart
    .map(i => `<li>${i.title} - ₹${i.price} <button data-cartid="${i.cartId}">Remove</button></li>`)
    .join("");
  totalEl.textContent = cart.reduce((sum, i) => sum + i.price, 0);
}

cartEl.onclick = e => {
  if (e.target.tagName !== "BUTTON") return;
  const id = Number(e.target.dataset.cartid);
  cart = cart.filter(i => i.cartId !== id);
  renderCart();
};

loadProducts();