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
  /* Site sécurisé (Cloudflare) : la pharmacie vient de la clé d'accès — officine et code postal verrouillés */
  function lockFromKey(){
    if(location.hostname.indexOf('github.io')!==-1||location.protocol==='file:')return;
    fetch('/api/me',{credentials:'same-origin',cache:'no-store'}).then(function(r){return r.ok?r.json():null;}).then(function(me){
      if(!me||!me.ok)return;
      window.DBN_REF=me.ref||window.DBN_REF;
      var set=function(n,v,lock){var el=document.querySelector('[name="'+n+'"]');if(!el||!v)return;if(lock||!el.value){el.value=v;el.dispatchEvent(new Event('input',{bubbles:true}));}if(lock){el.readOnly=true;el.style.background='#F4E7D2';el.style.cursor='not-allowed';el.title='Lié à votre accès personnel';}};
      set('officine',me.officine,true);set('code_postal',me.cp,true);set('contact',me.contact);set('telephone',me.tel);set('email',me.email);
      var f=document.getElementById('orderForm');
      if(f){var h=f.querySelector('[name="ref"]');if(!h){h=document.createElement('input');h.type='hidden';h.name='ref';f.appendChild(h);}h.value=me.ref||'';}
    }).catch(function(){});
  }
  function fill(){
    Object.keys(saved).forEach(function(n){
      if(n==='ref')return;
      var el=document.querySelector('[name="'+n+'"]');
      if(el&&!el.value){el.value=saved[n];el.dispatchEvent(new Event('input',{bubbles:true}));}
    });
    var f=document.getElementById('orderForm');
    if(f&&saved.ref&&!f.querySelector('[name="ref"]')){var h=document.createElement('input');h.type='hidden';h.name='ref';h.value=saved.ref;f.appendChild(h);}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){fill();lockFromKey();});else{fill();lockFromKey();}
})();
