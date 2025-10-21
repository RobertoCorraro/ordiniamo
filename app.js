// ✅ Versione: 1.3 - 21/10/2025

// 🛠️ Variabili customizzabili per l'invio del messaggio
const WHATSAPP_PHONE_NUMBER = "+393881137272"; // Numero di telefono destinatario
const MESSAGE_HEADER = "Ciao Amici del BAR! 🍽️\nVorremmo ordinare:\n\n"; // Testo prima dell'elenco prodotti
const MESSAGE_FOOTER = "\n\nGrazie mille! 🙏"; // Testo dopo l'elenco prodotti

// 🧱 MENU BASE
const menuItems = [
  { id: "caffe", name: "☕ Caffè", price: 1.2 },
  { id: "ginseng_amaro", name: "☕ Ginseng Amaro", price: 1.5 },
  { id: "zucchero_di_canna", name: "☕ Zucchero di Canna", price: 1.5 },
  { id: "cappuccino", name: "🥛 Cappuccino", price: 1.5 },
  { id: "cornetto_crema_limone", name: "🥐 Cornetto Crema Limone", price: 1.3 },
  { id: "succo", name: "🧃 Succo di frutta", price: 1.2 },
  { id: "te_limone", name: "🍵 Tè al Limone", price: 1.4 },
  { id: "te_pesca", name: "🍵 Tè alla Pesca", price: 1.4 },
];

let people = 2;
let DEBUG = false;
const log = (msg) => {
  if (DEBUG) console.log(msg);
};

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('whatsapp-number').textContent = WHATSAPP_PHONE_NUMBER;
  renderMenu();
  updateCart(); // Initial cart update

  document.getElementById("send").addEventListener("click", sendOrder);

  document.getElementById("splitToggle").addEventListener("change", (e) => {
    document.getElementById("splitControls").classList.toggle("hidden", !e.target.checked);
    updateCart();
  });

  document.addEventListener('cartchange', renderMenu);
});

// 🧩 MOSTRA MENU
function renderMenu() {
  const menu = document.getElementById("menu");
  menu.innerHTML = "";
  menuItems.forEach((item) => {
    const cartItem = cart.find(cartItem => cartItem.name === item.name);

    const box = document.createElement("div");
    box.className = "bg-white rounded-xl shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300";
    box.setAttribute('data-product-id', item.id);

    let buttonHtml;
    if (cartItem) {
      buttonHtml = `
        <div class="flex justify-between items-center mt-4">
          <button onclick="removeFromCart('${cartItem.name}')" class="w-[48%] bg-red-500 text-white py-2 rounded-md font-bold hover:bg-red-600 transition-colors duration-300">
            <i class="fa fa-minus"></i>
          </button>
          <span class="font-bold text-lg text-gray-800 mx-2">${cartItem.quantity}</span>
          <button onclick="addToCart('${item.id}')" class="w-[48%] bg-green-500 text-white py-2 rounded-md font-bold hover:bg-green-600 transition-colors duration-300">
            <i class="fa fa-plus"></i>
          </button>
        </div>
      `;
    } else {
      buttonHtml = `
        <button onclick="addToCart('${item.id}')" class="w-full bg-green-500 text-white py-2 rounded-md font-bold hover:bg-green-600 transition-colors duration-300">
          <i class="fa fa-plus"></i>
        </button>
      `;
    }

    box.innerHTML = `
      <div class="p-4">
        <h3 class="text-lg font-semibold text-gray-800">${item.name}</h3>
        <p class="text-gray-500 mt-1">€${item.price.toFixed(2)}</p>
        <div class="mt-4"></div>
      </div>
      <div class="p-4">
        ${buttonHtml}
      </div>
    `;
    menu.appendChild(box);
  });
}

// 👥 NUMERO PERSONE
function adjustPeople(delta) {
  people = Math.max(1, people + delta);
  document.getElementById("peopleCount").textContent = people;
  updateCart();
}

// ➕ PRODOTTI PERSONALIZZATI
function toggleCustomFields() {
  const el = document.getElementById("customFields");
  el.classList.toggle("hidden");
}

function addCustomProduct() {
  const name = document.getElementById("customName").value.trim();
  const price = parseFloat(document.getElementById("customPrice").value);
  if (!name || isNaN(price)) return alert("Compila entrambi i campi.");

  cart.push({ name: `✨ ${name}`, price, quantity: 1 });
  updateCart();

  document.getElementById("customName").value = "";
  document.getElementById("customPrice").value = "";
}

// ➕ MODAL NUOVO PRODOTTO
function openAddProductModal() {
  document.getElementById('addProductModal').classList.remove('hidden');
}

function closeAddProductModal() {
  document.getElementById('addProductModal').classList.add('hidden');
}

function addNewProduct() {
  const name = document.getElementById('newProductName').value.trim();
  const price = parseFloat(document.getElementById('newProductPrice').value);

  if (!name || isNaN(price)) {
    alert('Per favore, inserisci un nome e un prezzo validi.');
    return;
  }

  const newProduct = {
    id: name.toLowerCase().replace(/\s+/g, '-'),
    name: name,
    price: price,
  };

  menuItems.push(newProduct);
  renderMenu();
  closeAddProductModal();
}

// 📤 INVIA ORDINE WHATSAPP
function sendOrder() {
  if (cart.length === 0) return alert("Ouh, a durmì ste!! Il carrello è vuoto.");

  const lines = cart
    .map((item) => `- ${item.quantity}x ${item.name}`)
    .join("\n");
  let msg = `${MESSAGE_HEADER}${lines}`;
  if (document.getElementById("splitToggle").checked) {
    msg += `\n\nTotale diviso tra ${people} persone.`;
  }
  msg += MESSAGE_FOOTER;
  const url = `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodeURIComponent(
    msg
  )}`;
  window.open(url, "_blank");
}