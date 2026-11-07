/* ============================================================
   DBN — Suivi de visites (Google Analytics 4)
   ------------------------------------------------------------
   POUR ACTIVER LE SUIVI (à faire UNE seule fois) :
   1. Va sur https://analytics.google.com  → Administration
   2. Crée une propriété GA4 pour ton site, puis un flux "Web"
      avec l'URL  https://davidbitton12-ui.github.io/dbn-catalogue/
   3. Copie ton "ID de mesure" (format  G-XXXXXXXXXX )
   4. Colle-le ci-dessous à la place de  G-XXXXXXXXXX
   C'est la SEULE ligne à modifier. Tant qu'elle contient des X,
   le suivi reste désactivé et le site fonctionne normalement.
   ============================================================ */

(function () {
  var GA_ID = 'G-NN5YVFMTNW';   // <-- REMPLACE par ton ID de mesure GA4

  /* --- Lecture des paramètres du lien tracké --- */
  var p = new URLSearchParams(location.search);
  /* 'undefined' / 'null' arrivent quand un générateur de lien laisse une variable vide : on les ignore */
  function val(k){
    var v = (p.get(k) || '').trim();
    if (!v || v === 'undefined' || v === 'null') return '';
    return v;
  }
  var ref    = (val('ref') || val('utm_campaign')).toLowerCase();
  var source = val('utm_source');
  var medium = val('utm_medium');
  try {
    if (ref) sessionStorage.setItem('dbn_ref', ref);      // mémorise pour les pages suivantes
    else ref = sessionStorage.getItem('dbn_ref') || '';   // reprend si déjà connue dans la session
    /* le canal d'origine survit à la navigation interne */
    if (source) sessionStorage.setItem('dbn_src', source);
    else source = sessionStorage.getItem('dbn_src') || '';
    if (medium) sessionStorage.setItem('dbn_med', medium);
    else medium = sessionStorage.getItem('dbn_med') || '';
  } catch (e) {}

  /* --- Tant que l'ID n'est pas renseigné : on ne charge rien --- */
  if (GA_ID.indexOf('XXXX') !== -1) return;

  /* --- Chargement officiel gtag.js --- */
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());

  /* --- Associe la visite à la pharmacie (propriété + événement) --- */
  if (ref) {
    gtag('set', 'user_properties', { pharmacie: ref });
  }
  /* si la query string a été abîmée en route, on réinjecte le canal mémorisé */
  var cfg = {};
  if (source) cfg.campaign_source = source;
  if (medium) cfg.campaign_medium = medium;
  if (ref)    cfg.campaign_name   = ref;
  gtag('config', GA_ID, cfg);
  if (ref) {
    gtag('event', 'visite_pharmacie', { pharmacie: ref, canal: medium || source || '(direct)' });
  }

  /* --- Site sécurisé (Cloudflare) : la pharmacie est connue grâce à sa clé d'accès --- */
  var host = location.hostname;
  if (host.indexOf('github.io') === -1 && location.protocol !== 'file:') {
    if (host.indexOf('dbn-test') === 0) gtag('set', 'user_properties', { site: 'test' });
    fetch('/api/me', { credentials: 'same-origin', cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (me) {
        if (!me || !me.ok || !me.ref) return;
        gtag('set', 'user_properties', { pharmacie: me.ref });
        var seen = ''; try { seen = sessionStorage.getItem('dbn_me') || ''; } catch (e) {}
        if (seen !== me.ref) {
          gtag('event', 'visite_pharmacie', { pharmacie: me.ref, canal: 'acces' });
          try { sessionStorage.setItem('dbn_me', me.ref); } catch (e) {}
        }
      }).catch(function () {});
  }
})();

/* ============================================================
   Pop-up « nouvel Espace pharmacie » — catalogue uniquement,
   une fois à chaque visite (session) : invite à demander un accès.
   ============================================================ */
(function () {
  var h = location.hostname;
  if (/dbnpharma|pages\.dev/.test(h)) return;             // jamais sur l'Espace pharmacie
  try { if (sessionStorage.getItem('dbn_bascule_vu')) return; } catch (e) {}
  var URL = 'https://dbnpharma.fr/?demande=1';
  function show() {
    if (document.getElementById('bsOv')) return;
    var st = document.createElement('style');
    st.textContent = '#bsOv{position:fixed;inset:0;z-index:9000;background:rgba(28,22,17,.55);display:flex;align-items:center;justify-content:center;padding:16px;font-family:"Hanken Grotesk",system-ui,sans-serif}' +
      '#bsBx{position:relative;width:100%;max-width:540px;max-height:calc(100vh - 32px);overflow:auto;background:#fff;border-radius:22px;box-shadow:0 30px 70px -20px rgba(0,0,0,.5);color:#1C1611;text-align:left}' +
      '#bsBx .x{position:absolute;right:14px;top:12px;border:0;background:rgba(255,255,255,.18);color:#fff;width:34px;height:34px;border-radius:10px;font-size:16px;cursor:pointer}#bsBx .x:hover{background:rgba(255,255,255,.3)}' +
      '#bsBx .h{background:#1206A6;color:#fff;padding:22px 56px 20px 26px}' +
      '#bsBx .h small{display:block;font-size:11.5px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;opacity:.85}' +
      '#bsBx .h h3{color:#fff!important;font-family:Spectral,Georgia,serif;font-size:27px;font-weight:700;margin:4px 0 0;line-height:1.15}' +
      '#bsBx .b{padding:18px 26px 22px}#bsBx .b p{margin:0 0 12px;font-size:15.5px;line-height:1.5}' +
      '#bsBx ul{list-style:none;padding:0;margin:0 0 18px;display:grid;gap:9px}' +
      '#bsBx li{display:flex;gap:11px;align-items:center;font-size:15px;line-height:1.4}#bsBx li i{font-style:normal;flex:none;width:30px;height:30px;border-radius:9px;background:#E4ECF6;display:flex;align-items:center;justify-content:center;font-size:15px}' +
      '#bsBx .cta{display:block;text-align:center;background:#E8442A;color:#fff!important;text-decoration:none;font-weight:800;font-size:17px;border-radius:14px;padding:15px}#bsBx .cta:hover{background:#c93820}' +
      '#bsBx .ltr{display:block;margin:12px auto 0;border:0;background:none;color:#6E6557;font:600 14px "Hanken Grotesk",system-ui,sans-serif;text-decoration:underline;cursor:pointer}' +
      '@media(max-width:520px){#bsBx .h h3{font-size:22px}#bsBx .b{padding:16px 18px 18px}}@media print{#bsOv{display:none!important}}';
    document.head.appendChild(st);
    var o = document.createElement('div'); o.id = 'bsOv';
    o.innerHTML = '<div id="bsBx" role="dialog" aria-modal="true" aria-labelledby="bsTi"><button type="button" class="x" aria-label="Fermer">✕</button>' +
      '<div class="h"><small>Nouveau · réservé aux pharmacies</small><h3 id="bsTi">Commandez plus vite sur votre nouvel Espace pharmacie</h3></div>' +
      '<div class="b"><p>Tous les catalogues sont maintenant sur <b>www.dbnpharma.fr</b>, dans un espace réservé à votre officine :</p><ul>' +
      '<li><i>⚡</i><span><b>Vos coordonnées déjà remplies</b> à chaque commande</span></li>' +
      '<li><i>🎁</i><span><b>Les offres du moment</b> et les promos de chaque labo</span></li>' +
      '<li><i>🧾</i><span><b>L’historique de vos commandes</b>, à recommander en 1 clic</span></li>' +
      '<li><i>🧮</i><span><b>Vos outils offerts</b> : simulateur de marge, affichettes, kit vitrine</span></li></ul>' +
      '<a class="cta" href="' + URL + '" target="_blank" rel="noopener">✨ Demander mon accès (1 minute)</a>' +
      '<button type="button" class="ltr">Plus tard</button></div></div>';
    document.body.appendChild(o);
    try { sessionStorage.setItem('dbn_bascule_vu', '1'); } catch (e) {}
    function close() { o.remove(); }
    o.querySelector('.x').onclick = close; o.querySelector('.ltr').onclick = close;
    o.addEventListener('click', function (e) { if (e.target === o) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    o.querySelector('.cta').addEventListener('click', function () { if (window.gtag) gtag('event', 'bascule_demande_acces'); close(); });
  }
  function go() { setTimeout(show, 1200); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go); else go();
})();
