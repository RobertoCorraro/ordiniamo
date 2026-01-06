// ✅ Versione: 1.4 - Supabase Integration

// 🛠️ Variabili (modificabili da Supabase)
let WHATSAPP_PHONE_NUMBER = "+393881137272"; 
const MESSAGE_HEADER = "Ciao Amici del BAR! 🍽️\nVorremmo ordinare:\n\n"; 
const MESSAGE_FOOTER = "\n\nGrazie mille! 🙏"; 

// 🧱 MENU BASE (Fallback)
let menuItems = [
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

// Inizializzazione App e Supabase
async function initApp() {
  try {
    if (typeof supabase !== 'undefined' && typeof window.APP_CONFIG !== 'undefined') {
       const { createClient } = supabase;
       const { SUPABASE_URL, SUPABASE_ANON_KEY } = window.APP_CONFIG;

       if (SUPABASE_URL && !SUPABASE_URL.includes("tuo-project-id")) {
           const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
           
           // 1. Carica Impostazioni Bar
           const { data: settings } = await sb.from('bar_settings').select('*').single();
           if (settings) {
               WHATSAPP_PHONE_NUMBER = settings.phone_number;
               if (settings.bar_name) {
                   const barNameEl = document.getElementById('bar-name-display');
                   if (barNameEl) barNameEl.textContent = settings.bar_name;
               }
           }

           // 2. Carica Prodotti
           const { data: products } = await sb.from('products').select('*').eq('is_available', true);
           if (products && products.length > 0) {
               menuItems = products.map(p => ({
                   id: p.id,
                   name: p.name,
                   price: parseFloat(p.price)
               }));
           }
       } else {
           console.log("Supabase non configurato in config.js. Uso dati locali.");
       }
    }
  } catch (error) {
    console.error("Errore init Supabase:", error);
  }

  // Aggiorna UI
  document.getElementById('whatsapp-number').textContent = WHATSAPP_PHONE_NUMBER;
  renderMenu();
  updateCart();
}

document.addEventListener('DOMContentLoaded', () => {
  initApp();

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

    // [BLOCK] Product Card Container
    // Rappresenta la scheda del singolo prodotto nella griglia
    const box = document.createElement("div");
    // Added class: js-product-card
    box.className = "js-product-card flex justify-between bg-white rounded-xl shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300";
    box.setAttribute('data-product-id', item.id);

    let buttonHtml;
    if (cartItem) {
      // [STATE] Product In Cart
      // Mostra i controlli +/- quando il prodotto è già nel carrello
      buttonHtml = `
        <!-- [SECTION] Cart Controls (Product In Cart) -->
        <div class="js-cart-controls flex justify-between items-center">
          <!-- Button: Decrease Quantity -->
          <button style="min-width: 48px;" onclick="removeFromCart('${cartItem.name}')" class="js-decrease-btn w-[48%] bg-red-500 text-white py-2 rounded-md font-bold hover:bg-red-600 transition-colors duration-300">
            <i class="fa fa-minus"></i>
          </button>
          
          <!-- Display: Quantity -->
          <span class="js-quantity-display font-bold text-lg text-gray-800 mx-2">${cartItem.quantity}</span>
          
          <!-- Button: Increase Quantity -->
          <button style="min-width: 48px;"  onclick="addToCart('${item.id}')" class="js-increase-btn w-[48%] bg-green-500 text-white py-2 rounded-md font-bold hover:bg-green-600 transition-colors duration-300">
            <i class="fa fa-plus"></i>
          </button>
        </div>
      `;
    } else {
      // [STATE] Product Not In Cart
      // Mostra solo il bottone "Aggiungi"
      buttonHtml = `
        <!-- [SECTION] Add Button (Product Not In Cart) -->
        <button style="min-width: 48px;" onclick="addToCart('${item.id}')" class="js-add-to-cart-btn w-full bg-green-500 text-white py-2 rounded-md font-bold hover:bg-green-600 transition-colors duration-300">
          <i class="fa fa-plus"></i>
        </button>
      `;
    }

    // [SECTION] Product Info & Actions
    box.innerHTML = `
      <div class="p-4 flex flex-row justify-between">
        <!-- Product Name -->
        <h3 style="line-height: 1;" class="pt-1 js-product-name text-lg font-semibold text-gray-800">${item.name}</h3>
        <!-- Product Price -->
        <p style="line-height: 1" class="ml-2 js-product-price text-gray-500 mt-1">€${item.price.toFixed(2)}</p>
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