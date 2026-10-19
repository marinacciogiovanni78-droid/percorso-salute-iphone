# Percorso Salute — edizione privata per iPhone

Questa versione non usa Supabase, account, cookie di tracciamento, analytics o API remote. Tutti i dati inseriti sono memorizzati nel `localStorage` dell'origine web che ospita l'app. Il service worker salva in cache i file necessari all'uso offline dopo la prima visita.

## Installazione

1. Pubblicare i file statici della cartella su un sito HTTPS, senza aggiungere script di tracciamento o analytics. Il progetto non è ancora pubblicato.
2. Aprire l'indirizzo con Safari su iPhone.
3. Da Condividi scegliere Aggiungi alla schermata Home e, se disponibile, Apri come app.
4. Aprire l'app almeno una volta online per consentire la memorizzazione offline.

**Importante:** l'hosting riceve comunque i normali dati tecnici di accesso (ad esempio IP e richieste HTTP), ma i contenuti del diario non vengono inviati dall'app al server. I file JSON esportati possono essere sincronizzati da servizi come iCloud se salvati lì: scegliere «Sul mio iPhone» per mantenerli sul dispositivo.

## Backup

Aprire la scheda Backup → Esporta backup JSON. Conservare il file in un luogo sicuro. Per ripristinare, scegliere il file dalla stessa scheda. Il ripristino sostituisce il diario presente.

Il salvataggio locale del browser non equivale a un backup iOS garantito. La cancellazione dei dati del sito, la disinstallazione o alcune condizioni di gestione dello spazio possono eliminare i dati. Esportare periodicamente.

## Avvertenze

Il piano alimentare è indicativo e non sostituisce la valutazione di medico/dietista. Non usare questa app per decisioni cliniche urgenti.
