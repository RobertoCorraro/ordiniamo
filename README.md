# ☕ Ordiniamo - Ordini Bar Ufficio

**Ordiniamo** è una semplice web app progettata per facilitare la raccolta degli ordini del bar in ufficio. Permette di selezionare prodotti da un menu predefinito, gestire un carrello condiviso, calcolare il totale (con opzione "alla romana") e inviare l'ordine direttamente su WhatsApp.

![Ordiniamo Preview](https://via.placeholder.com/800x400?text=Preview+Ordiniamo)
*(Sostituisci questo link con uno screenshot reale dell'applicazione se disponibile)*

## ✨ Funzionalità

- **Menu Interattivo**: Visualizzazione chiara dei prodotti con prezzi e immagini (o icone).
- **Gestione Carrello**: Aggiunta e rimozione rapida dei prodotti, con calcolo automatico del totale.
- **Divisione Conto ("Alla Romana")**: Funzionalità per dividere il totale tra un numero specifico di persone.
- **Integrazione WhatsApp**: Generazione automatica di un messaggio pre-formattato con l'elenco dell'ordine pronto per essere inviato.
- **Prodotti Personalizzati**: Possibilità di aggiungere note o prodotti fuori menu (se abilitato).
- **Responsive Design**: Ottimizzato per l'uso da smartphone e desktop grazie a Tailwind CSS.

## 🚀 Tecnologie Utilizzate

Il progetto è realizzato con tecnologie web standard, senza necessità di build complex o backend:

- **HTML5**: Struttura semantica della pagina.
- **Tailwind CSS** (via CDN): Per lo styling moderno e responsive.
- **Vanilla JavaScript** (ES6+): Logica dell'applicazione (`app.js`, `cart.js`).
- **FontAwesome**: Per le icone dell'interfaccia.

## 📂 Struttura del Progetto

```
/
├── index.html          # Punto di ingresso dell'applicazione (UI principale)
├── app.js              # Logica principale: inizializzazione, rendering menu, eventi
├── cart.js             # Gestione dello stato del carrello e calcoli
├── single-product.js   # Componenti per la visualizzazione dei singoli prodotti
├── style.css           # Stili CSS personalizzati aggiuntivi
├── README.md           # Documentazione del progetto
└── .github/            # Configurazioni GitHub (es. workflow per GitHub Pages)
```

## 🛠️ Installazione e Configurazione

Non è necessaria alcuna installazione complessa (npm, pip, ecc.). Essendo una pagina statica, puoi eseguirla in due modi:

### 1. Esecuzione Locale
Semplicemente apri il file `index.html` nel tuo browser preferito.

### 2. Personalizzazione
Per adattare l'app alle tue esigenze (es. cambiare il numero di telefono o il menu), modifica il file `app.js`:

**Configurazione WhatsApp:**
```javascript
// app.js
const WHATSAPP_PHONE_NUMBER = "+393881137272"; // Inserisci il numero del bar
const MESSAGE_HEADER = "Ciao! Ecco l'ordine:\n\n";
```

**Modifica del Menu:**
Cerca l'array `menuItems` in `app.js` e aggiungi/rimuovi oggetti:
```javascript
const menuItems = [
  { id: "caffe", name: "☕ Caffè", price: 1.2 },
  { id: "cornetto", name: "🥐 Cornetto", price: 1.5 },
  // ... aggiungi altri prodotti
];
```

## 🌐 Deploy

Il progetto è configurato per essere ospitato gratuitamente su **GitHub Pages**.
Il workflow `.github/workflows/static.yml` si occupa di pubblicare automaticamente le modifiche pushate sul branch principale.

## 🤝 Contribuire

Sentiti libero di aprire issue o pull request per migliorare il progetto, aggiungere nuove funzionalità o correggere bug.

## 📝 Licenza

Questo progetto è distribuito sotto licenza MIT. Vedi il file `LICENSE` per maggiori dettagli (se presente).
