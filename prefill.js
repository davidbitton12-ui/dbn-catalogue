/* DBN — préremplissage des bons de commande depuis l'URL (liens CRM / mails après commande)
   Paramètres acceptés : ref, officine, adresse, cp (ou code_postal), ville, contact, tel (ou telephone), email
   Les valeurs vides, "undefined" ou "null" sont ignorées. Mémorisé dans le navigateur pour les pages suivantes. */
(function(){
  var KEY='dbn_prefill', MAP={officine:'officine',adresse:'adresse',cp:'code_postal',code_postal:'code_postal',ville:'ville',contact:'contact',tel:'telephone',telephone:'telephone',email:'email',ref:'ref'};
  function ok(v){return v!=null&&v!==''&&v!=='undefined'&&v!=='null';}
  var saved={}; try{saved=JSON.parse(localStorage.getItem(KEY)||'{}')||{};}catch(e){}
  var p=new URLSearchParams(location.search), got=false;
  Object.keys(MAP).forEach(function(k){var v=p.get(k); if(ok(v)){saved[MAP[k]]=v.trim(); got=true;}});
  if(got){try{localStorage.setItem(KEY,JSON.stringify(saved));}catch(e){}}
  window.DBN_REF=saved.ref||'';
  function fill(){
    Object.keys(saved).forEach(function(n){
      if(n==='ref')return;
      var el=document.querySelector('[name="'+n+'"]');
      if(el&&!el.value){el.value=saved[n];el.dispatchEvent(new Event('input',{bubbles:true}));}
    });
    var f=document.getElementById('orderForm');
    if(f&&saved.ref&&!f.querySelector('[name="ref"]')){var h=document.createElement('input');h.type='hidden';h.name='ref';h.value=saved.ref;f.appendChild(h);}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',fill);else fill();
})();
