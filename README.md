# Ribellula Yoga · sito di Chiara

Sito di Ribellula Yoga (Chiara), a cura di Marea Creative. Al momento è una demo: pagamento, area riservata e catalogo sono simulati e i prezzi sono "da definire". Le pagine sono `noindex`.

## Com'è fatto
- **Radice del repository:** il sito pronto da pubblicare (`index.html`, `404.html`, `assets/`, `_headers`, `wrangler.jsonc`). È statico, nessuna build.
- **`sorgenti/`:** i file da cui nasce la pagina (`site/index.src.html`, CSS e JS in `site/assets/`, `build.py` e le firme in `script-*.json`).

## Pubblicazione
Cloudflare Workers con file statici: `wrangler deploy` dalla radice, oppure collegando questo repository dal pannello di Cloudflare.
Demo attuale: https://ribellula-yoga.mareacreative.workers.dev/
