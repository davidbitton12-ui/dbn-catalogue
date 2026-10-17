/* DBN — panier conservé (mise en attente) : quantités mémorisées par page et par appareil, 30 jours */
(function(){
  var f=document.getElementById('orderForm');if(!f)return;
  var KEY='dbn_panier_'+location.pathname.split('/').pop(),TTL=7*864e5,restoring=false;
  function inputs(){return Array.prototype.slice.call(f.querySelectorAll('input[type=number]'));}
  function id(el,i){return (el.getAttribute('aria-label')||el.name||'')+'#'+i;}
  function save(){if(restoring)return;var q={},n=0;inputs().forEach(function(el,i){var v=parseInt(el.value,10)||0;if(v>0){q[id(el,i)]=v;n+=v;}});
    try{if(n)localStorage.setItem(KEY,JSON.stringify({t:Date.now(),q:q}));else localStorage.removeItem(KEY);}catch(e){}}
  function later(){setTimeout(save,60);}
  f.addEventListener('click',later);f.addEventListener('change',later);f.addEventListener('input',later);
  var st=document.createElement('style');
  st.textContent='.pnr{box-sizing:border-box;max-width:1200px;margin-left:auto!important;margin-right:auto!important;display:flex;align-items:center;gap:10px;flex-wrap:wrap;background:#EAF6F1;border:1.5px solid #2E9E7A;border-radius:14px;padding:10px 14px;margin:0 0 16px;font-family:"Hanken Grotesk",system-ui,sans-serif;font-size:14px;color:#1C1611}.pnr b{color:#14453F}.pnr button{margin-left:auto;background:none;border:1px solid #2E9E7A;color:#14453F;border-radius:999px;padding:6px 14px;font:inherit;font-size:12.5px;font-weight:700;cursor:pointer}.pnr button:hover{background:#2E9E7A;color:#fff}.pnrHold{display:block;width:100%;margin-top:8px;background:none;border:1px dashed #9C9283;border-radius:10px;padding:7px 10px;font-family:inherit;font-size:12.5px;font-weight:600;color:#6E6557;cursor:pointer}.pnrHold:hover{border-color:#2E9E7A;color:#14453F;background:#EAF6F1}.pnrToast{position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:3000;max-width:min(420px,92vw);background:#14453F;color:#fff;border-radius:14px;padding:13px 18px;font-family:"Hanken Grotesk",system-ui,sans-serif;font-size:14px;line-height:1.45;box-shadow:0 14px 34px -10px rgba(0,0,0,.45);transition:opacity .4s}.pnrToast.out{opacity:0}@media print{.pnr,.pnrHold{display:none}}';
  document.head.appendChild(st);
  function restore(){
    var d;try{d=JSON.parse(localStorage.getItem(KEY)||'null');}catch(e){}
    if(!d||!d.q||Date.now()-d.t>TTL){try{localStorage.removeItem(KEY);}catch(e){}return;}
    var n=0;restoring=true;
    inputs().forEach(function(el,i){var v=d.q[id(el,i)];if(v){el.value=v;el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));n+=v;}});
    restoring=false;if(!n)return;save();
    var b=document.createElement('div');b.className='pnr';
    b.innerHTML='🛒 <span>Votre panier a été conservé : <b>'+n+' article'+(n>1?'s':'')+'</b> en attente. Vous pouvez reprendre votre commande.</span><button type="button">Vider le panier</button>';
    b.querySelector('button').addEventListener('click',function(){restoring=true;inputs().forEach(function(el){if((parseInt(el.value,10)||0)>0){el.value=0;el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));}});restoring=false;try{localStorage.removeItem(KEY);}catch(e){}b.remove();});
    f.parentNode.insertBefore(b,f);
  }
  var sb=document.getElementById('sendBtn');
  if(sb){var hb=document.createElement('button');hb.type='button';hb.className='pnrHold';hb.innerHTML='⏸ Mettre ma commande en attente';
    sb.insertAdjacentElement('afterend',hb);
    hb.addEventListener('click',function(){save();sendHold();var n=0;inputs().forEach(function(el){n+=parseInt(el.value,10)||0;});
      var t=document.createElement('div');t.className='pnrToast';
      t.innerHTML=n?'✓ <b>Commande mise en attente</b><br>Votre panier ('+n+' article'+(n>1?'s':'')+') est enregistré sur cet appareil pendant 7 jours. Revenez quand vous voulez pour la finaliser.':'Ajoutez d\'abord des produits à votre commande.';
      document.body.appendChild(t);setTimeout(function(){t.classList.add('out');},3600);setTimeout(function(){t.remove();},4100);});}
  var GW='https://script.google.com/macros/s/AKfycbx3f6RYXm3y6_T_hqE4hZU-_J5sTNUKUOFSm81xwn5u25tic32LxBkrmK8jyofwYb7Atg/exec';
  function fv(names){for(var i=0;i<names.length;i++){var el=f.querySelector('[name="'+names[i]+'"]');if(el&&el.value.trim())return el.value.trim();}return '';}
  function sendHold(){
    var lignes=[],n=0;
    inputs().forEach(function(el){var v=parseInt(el.value,10)||0;if(v>0){n+=v;lignes.push(v+' × '+(el.getAttribute('aria-label')||'Produit').replace(/^Quantité\s*/i,''));}});
    if(!n)return;
    var email=fv(['email','e-mail','mail']);
    if(!email){email=(window.prompt('Votre e-mail pour recevoir un rappel de votre commande en attente (facultatif) :','')||'').trim();var ef=f.querySelector('[name="email"]');if(email&&ef){ef.value=email;}}
    var file=decodeURIComponent(location.pathname.split('/').pop()||'');
    var labo=(file.match(/Commande (.+)\.html/)||[])[1]||document.title;
    var d={labo:labo,officine:fv(['officine']),cp:fv(['code_postal','cp']),ville:fv(['ville']),contact:fv(['contact','nom']),tel:fv(['telephone','tel']),email:email,
      unites:n,lignes:lignes,lien:location.origin+location.pathname,ref:fv(['ref'])};
    try{var cb='pnrCb'+Date.now();window[cb]=function(){try{delete window[cb];}catch(e){}};
      var s=document.createElement('script');s.src=GW+'?action=panier&callback='+cb+'&payload='+encodeURIComponent(JSON.stringify(d));s.onerror=function(){s.remove();};document.body.appendChild(s);}catch(e){}
    if(window.gtag)gtag('event','panier_attente',{labo:labo,unites:n});
  }
  var done=document.getElementById('doneBox');
  if(done&&window.MutationObserver)new MutationObserver(function(){if(done.classList.contains('on')){try{localStorage.removeItem(KEY);}catch(e){}}}).observe(done,{attributes:true,attributeFilter:['class']});
  if(document.readyState==='complete')setTimeout(restore,300);else window.addEventListener('load',function(){setTimeout(restore,300);});
})();
