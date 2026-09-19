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
})();
