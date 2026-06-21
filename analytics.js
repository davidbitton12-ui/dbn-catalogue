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
  var GA_ID = 'G-XXXXXXXXXX';   // <-- REMPLACE par ton ID de mesure GA4

  /* --- Récupère la pharmacie depuis le lien tracké (?ref= ou utm_campaign) --- */
  var p = new URLSearchParams(location.search);
  var ref = (p.get('ref') || p.get('utm_campaign') || '').toLowerCase().trim();
  try {
    if (ref) sessionStorage.setItem('dbn_ref', ref);      // mémorise pour les pages suivantes
    else ref = sessionStorage.getItem('dbn_ref') || '';   // reprend si déjà connue dans la session
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
  gtag('config', GA_ID);
  if (ref) {
    gtag('event', 'visite_pharmacie', { pharmacie: ref });
  }
})();
