// Blocco BOX del prodotto
function createProductBox(item) {
  const box = document.createElement("div");
  box.className =
    "bob__menu_prodotto flex flex-row justify-between rounded";

  box.innerHTML = `
    <label
    class="flex flex-col rounded-lg bob__menu_prodotto_input_label w-4/6 border-2 bg-white items-left justify-between p-2"
    >
    <div class="flex items-center">
      <input
      type="checkbox"
      id="check-${item.id}"
      class="mr-2 bob__menu_prodotto_input"
      onchange="toggleQuantity('${item.id}')"
      />
      <span class="font-medium bob__menu_prodotto_name">${item.name}</span>
    </div>
    <span class="text-sm text-gray-500 bob__menu_prodotto_price">€${item.price.toFixed(2)}</span>
    </label>
    <div class="h-full flex items-center justify-center w-2/6 bob__menu_prodotto_qtywrap hidden">
    <button
      onclick="adjustQuantity('${item.id}', -1)"
      class="h-full px-2 py-1 bg-gray-300 rounded"
    >-</button>
    <input
      type="number"
      id="qty-${item.id}"
      value="1"
      min="1"
      class="h-full w-12 p-1 text-center border rounded bob__menu_prodotto_qty"
      onchange="updateCartFromMenu()"
    />
    <button
      onclick="adjustQuantity('${item.id}', 1)"
      class="h-full px-2 py-1 bg-gray-300 rounded"
    >+</button>
    </div>
  `;
  return box;
}