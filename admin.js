// Variabili globali
let sb;

document.addEventListener('DOMContentLoaded', () => {
    // 1. Controlla se config.js è stato caricato
    if (typeof window.APP_CONFIG === 'undefined') {
        alert("Errore Critico: Il file config.js non è stato caricato o contiene errori.");
        return;
    }

    const { SUPABASE_URL, SUPABASE_ANON_KEY } = window.APP_CONFIG;

    // 2. Controlla se Supabase (libreria) è caricata
    if (typeof supabase === 'undefined') {
        alert("Errore Connessione: Impossibile caricare la libreria Supabase. Controlla la tua connessione internet.");
        return;
    }

    // 3. Controlla se le credenziali sono state impostate
    if (!SUPABASE_URL || SUPABASE_URL.includes("tuo-project-id")) {
        alert("Attenzione: Non hai configurato Supabase nel file config.js.\nInserisci le tue credenziali reali per continuare.");
        return;
    }

    // Inizializza Supabase
    const { createClient } = supabase;
    sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Controlla se già loggato in sessione
    if (sessionStorage.getItem('admin_logged_in') === 'true') {
        showDashboard();
    }
});

// --- FUNZIONI AUTH ---

function checkPassword() {
    const input = document.getElementById('password-input').value;
    const errorMsg = document.getElementById('login-error');

    if (typeof window.APP_CONFIG === 'undefined') return;

    if (input === window.APP_CONFIG.ADMIN_PASSWORD) {
        sessionStorage.setItem('admin_logged_in', 'true');
        showDashboard();
        errorMsg.classList.add('hidden');
    } else {
        errorMsg.classList.remove('hidden');
    }
}

function logout() {
    sessionStorage.removeItem('admin_logged_in');
    location.reload();
}

function showDashboard() {
    document.getElementById('login-section').classList.add('hidden');
    document.getElementById('dashboard-section').classList.remove('hidden');
    loadSettings();
    loadProducts();
}

// --- FUNZIONI SETTINGS ---

async function loadSettings() {
    const { data, error } = await sb.from('bar_settings').select('*').single();
    if (data) {
        document.getElementById('bar-name').value = data.bar_name || '';
        document.getElementById('bar-phone').value = data.phone_number || '';
    }
}

async function saveSettings() {
    const name = document.getElementById('bar-name').value;
    const phone = document.getElementById('bar-phone').value;

    const { data: current } = await sb.from('bar_settings').select('id').single();
    
    let result;
    if (current) {
        result = await sb.from('bar_settings').update({ bar_name: name, phone_number: phone }).eq('id', current.id);
    } else {
        result = await sb.from('bar_settings').insert({ bar_name: name, phone_number: phone });
    }

    if (result.error) {
        alert("Errore salvataggio: " + result.error.message);
    } else {
        alert("Impostazioni salvate!");
    }
}

// --- FUNZIONI PRODOTTI ---

async function loadProducts() {
    const { data: products, error } = await sb.from('products').select('*').order('name');
    const tbody = document.getElementById('products-table-body');
    tbody.innerHTML = '';

    if (products) {
        products.forEach(p => {
            const tr = document.createElement('tr');
            tr.className = "border-b hover:bg-gray-50";
            tr.innerHTML = `
                <td class="p-3 font-mono text-sm">${p.id}</td>
                <td class="p-3 font-bold">${p.name}</td>
                <td class="p-3">€${p.price}</td>
                <td class="p-3 text-center">
                    <button onclick="editProduct('${p.id}', '${p.name.replace(/'/g, "\\'")}', ${p.price})" class="text-blue-500 hover:text-blue-700 mx-2">
                        <i class="fa fa-edit"></i>
                    </button>
                    <button onclick="deleteProduct('${p.id}')" class="text-red-500 hover:text-red-700 mx-2">
                        <i class="fa fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }
}

// Gestione Modale
function openProductModal(isEdit = false) {
    document.getElementById('product-modal').classList.remove('hidden');
    if (!isEdit) {
        document.getElementById('modal-title').innerText = "Aggiungi Prodotto";
        document.getElementById('prod-id').value = "";
        document.getElementById('prod-id').disabled = false;
        document.getElementById('prod-name').value = "";
        document.getElementById('prod-price').value = "";
        document.getElementById('prod-id-hidden').value = "";
    }
}

function closeProductModal() {
    document.getElementById('product-modal').classList.add('hidden');
}

function editProduct(id, name, price) {
    openProductModal(true);
    document.getElementById('modal-title').innerText = "Modifica Prodotto";
    document.getElementById('prod-id').value = id;
    document.getElementById('prod-id').disabled = true;
    document.getElementById('prod-name').value = name;
    document.getElementById('prod-price').value = price;
    document.getElementById('prod-id-hidden').value = id;
}

async function saveProduct() {
    const id = document.getElementById('prod-id').value;
    const name = document.getElementById('prod-name').value;
    const price = parseFloat(document.getElementById('prod-price').value);
    const isEdit = document.getElementById('prod-id').disabled;

    if (!id || !name || isNaN(price)) {
        alert("Compila tutti i campi correttamente.");
        return;
    }

    let result;
    if (isEdit) {
        result = await sb.from('products').update({ name, price }).eq('id', id);
    } else {
        result = await sb.from('products').insert({ id, name, price });
    }

    if (result.error) {
        alert("Errore: " + result.error.message);
    } else {
        closeProductModal();
        loadProducts();
    }
}

async function deleteProduct(id) {
    if (confirm(`Sei sicuro di voler eliminare il prodotto ${id}?`)) {
        const { error } = await sb.from('products').delete().eq('id', id);
        if (error) {
            alert("Errore eliminazione: " + error.message);
        } else {
            loadProducts();
        }
    }
}
