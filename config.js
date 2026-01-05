// Configurazione Supabase
// Sostituisci questi valori con quelli del tuo progetto Supabase
// Trovi questi dati in: Project Settings -> API

const SUPABASE_URL = "https://hukdyygetojmakqbanph.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_yqrJJ_uMi2-4TBlwc6GcSQ_QKg2Fr0_";

// Inizializza il client Supabase (disponibile globalmente grazie allo script in index.html)
let supabase;

if (typeof supabase !== 'undefined') {
    // Se la libreria è già caricata (ma qui lo faremo in app.js probabilmente o qui)
    // Meglio esporre solo le costanti o inizializzare qui se window.supabase è disponibile
}
