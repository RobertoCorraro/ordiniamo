
      // ✅ Versione: 1.2 - 09/07/2025

      // 🧱 MENU BASE
      const menuItems = [
        { id: "caffe", name: "☕ Caffè", price: 1.2 },
        { id: "ginseng_amaro", name: "🥛 Ginseng Amaro", price: 1.5 },
        { id: "cappuccino", name: "🥛 Cappuccino", price: 1.5 },
        { id: "cornetto", name: "🥐 Cornetto", price: 1.3 },
        { id: "succo", name: "🧃 Succo di frutta", price: 1.2 },
        { id: "te_limone", name: "🍵 Tè al Limone", price: 1.4 },
        { id: "te_pesca", name: "🍵 Tè alla Pesca", price: 1.4 },
      ];

      let cart = [];
      let people = 2;
      let DEBUG = false;
      const log = (msg) => {
        if (DEBUG) console.log(msg);
      };

      // 🧩 MOSTRA MENU
      function renderMenu() {
        const menu = document.getElementById("menu");
        menu.innerHTML = "";
        menuItems.forEach((item) => {
          const box = document.createElement("div");
          box.className =
            "bob__menu_prodotto flex flex-col w-full justify-between gap-x-6 py-5 pt-4";

          box.innerHTML = `
          <!-- Blocco BOX del prodotto  -->
          <label class="bob__menu_prodotto_input_label w-full border-2 bg-white mt-2 pb-3 rounded shadow flex flex-col justify-between items-center space-y-2 text-center bob__menu_prodotto_label">
            <input type="checkbox" id="check-${
              item.id
            }" class="mr-2 bob__menu_prodotto_input" onchange="toggleQuantity('${item.id}')">
            <span class="font-medium bob__menu_prodotto_name">${item.name}</span><br>
            <span class="text-sm text-gray-500 bob__menu_prodotto_price">€${item.price.toFixed(2)}</span>
          </label>
          <div class="h-8 flex items-center justify-center w-full bob__menu_prodotto_qtywrap">
            <input type="number" id="qty-${
              item.id
            }" value="1" min="1" class="w-full p-1 text-center border rounded hidden bob__menu_prodotto_qty" onchange="updateCartFromMenu()" />
          </div>
        `;
          menu.appendChild(box);
        });
      }

      /* ============================
    Sezione: Funzione per aggiornare lo stato dei container
    ============================ */
  function aggiornaStatoProdottiSelezionati() {
    const prodotti = document.querySelectorAll('.bob__menu_prodotto_input_label ');
    prodotti.forEach(div => {
      const checkbox = div.querySelector('input[type="checkbox"]');
      if (!checkbox) return;

      if (checkbox.checked) {
        div.classList.add(
          'border-2',          // bordo spesso 2px
          'border-green-500',  // bordo verde medio
          'bg-green-100'       // sfondo verdino chiaro
        );
        log('Selezionato:', div);
      } else {
        div.classList.remove(
          'border-2',
          'border-green-500',
          'bg-green-100'
        );
        log('Deselezionato:', div);
      }
    });
  }

  /* ============================
    Sezione: Eventi
    ============================ */
  // Aggiorna allo start pagina
  document.addEventListener('DOMContentLoaded', () => {
    aggiornaStatoProdottiSelezionati();

    // Aggiorna al cambiamento checkbox
    document.querySelectorAll('.bob__menu_prodotto input[type="checkbox"]').forEach(cb => {
      cb.addEventListener('change', aggiornaStatoProdottiSelezionati);
    });
  });

      // 📦 MOSTRA/NASCONDI Q.TÀ
      function toggleQuantity(id) {
        const qtyInput = document.getElementById("qty-" + id);
        qtyInput.classList.toggle("hidden");
        updateCartFromMenu();
      }

      // 🛒 AGGIORNA CARRELLO DA MENU
      function updateCartFromMenu() {
        cart = [];

        menuItems.forEach((item) => {
          const check = document.getElementById("check-" + item.id);
          const qtyInput = document.getElementById("qty-" + item.id);
          const qty = parseInt(qtyInput?.value || 0);

          if (check?.checked && qty > 0) {
            cart.push({ name: item.name, price: item.price, quantity: qty });
          }
        });

        updateCart();
      }

      // 🛍️ AGGIORNA VISUALIZZAZIONE CARRELLO
      function updateCart() {
        const cartDiv = document.getElementById("cartItems");
        cartDiv.innerHTML = "";

        let total = 0;
        cart.forEach((item) => {
          const subTotal = item.price * item.quantity;
          total += subTotal;

          const row = document.createElement("div");
          row.className = "bob__cart_item";
          row.innerHTML = `${item.quantity}x ${item.name} - €${subTotal.toFixed(
            2
          )}`;
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

      // 👥 NUMERO PERSONE
      function adjustPeople(delta) {
        people = Math.max(1, people + delta);
        document.getElementById("peopleCount").textContent = people;
        updateCart();
      }

      // 🔁 SWITCH ROMANA
      document.getElementById("splitToggle").addEventListener("change", (e) => {
        document
          .getElementById("splitControls")
          .classList.toggle("hidden", !e.target.checked);
        updateCart();
      });

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

      // 📤 INVIA ORDINE WHATSAPP
      function sendOrder() {
        if (cart.length === 0) return alert("Il carrello è vuoto!");

        const lines = cart
          .map((item) => `- ${item.quantity}x ${item.name}`)
          .join("\n");
        let msg = `Ciao Amici del BAR! 🍽️\nVorremmo ordinare:\n\n${lines}`;
        if (document.getElementById("splitToggle").checked) {
          msg += `\n\nTotale diviso tra ${people} persone.`;
        }
        msg += "\n\nGrazie mille! 🙏";
        const url = `https://wa.me/send?text=${encodeURIComponent(
          msg
        )}`;
        window.open(url, "_blank");
      }

      // ▶️ AVVIO
      renderMenu();
      document.getElementById("send").addEventListener("click", sendOrder);
