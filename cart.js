let cart = [];

// 🛍️ AGGIORNA VISUALIZZAZIONE CARRELLO
function updateCart() {
  const cartDiv = document.getElementById("cartItems");
  cartDiv.innerHTML = "";

  if (cart.length === 0) {
    cartDiv.innerHTML = '<p class="text-gray-400">Il carrello è vuoto.</p>';
    document.getElementById("total").textContent = "0.00";
    document.getElementById("splitInfo").classList.add("hidden");
    return;
  }

  let total = 0;
  cart.forEach((item) => {
    const subTotal = item.price * item.quantity;
    total += subTotal;

    const row = document.createElement("div");
    row.className = "flex items-center justify-between py-2 border-b border-gray-200";
    row.innerHTML = `
      <div>
        <p class="font-semibold text-gray-700">${item.name}</p>
        <p class="text-sm text-gray-500">${item.quantity} x €${item.price.toFixed(2)}</p>
      </div>
      <div class="flex items-center">
        <p class="font-bold text-gray-800 mr-4">€${subTotal.toFixed(2)}</p>
        <button onclick="removeFromCart('${item.name}')" class="text-red-500 hover:text-red-700">
          <i class="fa fa-trash"></i>
        </button>
      </div>
    `;
    cartDiv.appendChild(row);
  });

  document.getElementById("total").textContent = total.toFixed(2);

  if (document.getElementById("splitToggle").checked) {
    document.getElementById("splitInfo").classList.remove("hidden");
    document.getElementById("splitTotal").textContent = (
      total / people
    ).toFixed(2);
  } else {
    document.getElementById("splitInfo").classList.add("hidden");
  }
}

function addToCart(itemId) {
  const item = menuItems.find((item) => item.id === itemId);
  if (!item) return;

  const existingItem = cart.find((cartItem) => cartItem.name === item.name);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ name: item.name, price: item.price, quantity: 1 });
  }

  updateCart();
  document.dispatchEvent(new Event('cartchange'));
}

function removeFromCart(itemName) {
  const itemIndex = cart.findIndex((item) => item.name === itemName);

  if (itemIndex === -1) return;

  if (cart[itemIndex].quantity > 1) {
    cart[itemIndex].quantity--;
  } else {
    cart.splice(itemIndex, 1);
  }

  updateCart();
  document.dispatchEvent(new Event('cartchange'));
}