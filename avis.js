/* Enquête de satisfaction après commande — s'affiche dans #doneBox, envoie à la passerelle Brevo (onglet AVIS SITE) */
(function(){
  var GW='https://script.google.com/macros/s/AKfycbx3f6RYXm3y6_T_hqE4hZU-_J5sTNUKUOFSm81xwn5u25tic32LxBkrmK8jyofwYb7Atg/exec';
  var FS='https://formspree.io/f/mwvjnpak';
  var Q=[['catalogue','Le catalogue digital'],['commande','La prise de commande'],['facilite','La facilité des étapes'],['globale','Note globale']];
  var css='.avisOv{position:fixed;inset:0;z-index:3000;background:rgba(28,22,17,.55);display:flex;align-items:center;justify-content:center;padding:16px;opacity:0;transition:opacity .3s}'+
  '.avisOv.on{opacity:1}'+
  '.avis{position:relative;width:100%;max-width:560px;max-height:92vh;overflow-y:auto;background:#fff;border:2px solid #1206A6;border-radius:20px;padding:24px 24px 20px;transform:translateY(18px) scale(.97);transition:transform .35s cubic-bezier(.22,1,.36,1);font-family:"Hanken Grotesk",system-ui,sans-serif;color:#1C1611;box-shadow:0 24px 50px -36px rgba(18,6,166,.5)}'+
  '.avisOv.on .avis{transform:none}'+
  '.avis .ax{position:absolute;top:12px;right:12px;width:32px;height:32px;border:none;border-radius:10px;background:#F4E7D2;color:#1C1611;font-size:16px;cursor:pointer}'+
  '.avis .ax:hover{background:#EBE0CE}'+
  '.avis .ahd{display:flex;align-items:center;gap:12px;margin-bottom:4px;padding-right:36px}'+
  '.avis .ahd img{height:44px;width:auto}'+
  '.avis .ab .later{background:none;color:#6E6557;font-weight:600;padding:12px 6px;text-decoration:underline}'+
  '.avis .ab .later:hover{background:none;color:#1C1611}'+
  '.avis h3{font-family:Spectral,Georgia,serif;font-size:21px;font-weight:600;margin:0;color:#1206A6}'+
  '.avis .as{font-size:13.5px;color:#6E6557;margin:4px 0 14px}'+
  '.avis .aq{display:grid;grid-template-columns:1fr 1fr;gap:10px}'+
  '.avis .ar{background:#FBF5EB;border:1px solid #EBE0CE;border-radius:12px;padding:10px 12px}'+
  '.avis .ar.gl{background:#EDF2FA;border-color:#9DB8D6}'+
  '.avis .al{display:block;font-size:12.5px;font-weight:700;margin-bottom:6px}'+
  '.avis .st{display:flex;gap:2px}'+
  '.avis .st button{background:none;border:none;padding:2px;font-size:26px;line-height:1;color:#D9CFC2;cursor:pointer;transition:transform .12s,color .12s}'+
  '.avis .st button.on{color:#F2A900}.avis .st button:hover{transform:scale(1.15)}'+
  '.avis textarea{width:100%;margin-top:12px;min-height:70px;resize:vertical;font:inherit;font-size:16px;color:#1C1611;background:#FBF5EB;border:1px solid #EBE0CE;border-radius:12px;padding:11px 13px;box-sizing:border-box}'+
  '.avis textarea:focus{outline:none;border-color:#1206A6;background:#fff}'+
  '.avis .ab{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-top:12px}'+
  '.avis .ab button{background:#1206A6;color:#fff;border:none;border-radius:12px;padding:12px 22px;font:inherit;font-size:15px;font-weight:700;cursor:pointer}'+
  '.avis .ab button:hover{background:#0c0488}.avis .ab button:disabled{background:#D9CFC2;cursor:not-allowed}'+
  '.avis .ab span{font-size:12.5px;color:#6E6557}'+
  '.avis .af{font-size:12.5px;line-height:1.45;color:#5A4F44;background:#F4E7D2;border-radius:10px;padding:8px 11px;margin:0 0 12px}.avis .af b{color:#1C1611}'+
  '.avis .ok{text-align:center;padding:8px 0}.avis .ok b{display:block;font-family:Spectral,Georgia,serif;font-size:21px;color:#1206A6;margin-bottom:4px}'+
  '@media print{.avisOv{display:none!important}}@media(max-width:600px){.avis{padding:18px 14px 16px;border-radius:16px}.avis .aq{grid-template-columns:1fr 1fr}.avis .ahd img{height:36px}}';
  var built=false;
  function v(n){var el=document.querySelector('[name="'+n+'"]');return el?String(el.value||'').trim():'';}
  function labo(){var m=(document.title||'').match(/Commande\s+(.+?)\s+[—-]/);return m?m[1]:document.title;}
  function ref(){try{var q=new URLSearchParams(location.search);var r=q.get('ref')||q.get('utm_campaign');if(r)return r;var p=JSON.parse(localStorage.getItem('dbn_prefill')||'{}');return p.ref||'';}catch(e){return '';}}
  var KEY='dbn_avis_done';
  var TEST=/[?&]avis=test/.test(location.search);
  function already(){if(window.__AVIS_PREVIEW||TEST)return false;try{return !!localStorage.getItem(KEY);}catch(e){return false;}}
  function mark(){if(window.__AVIS_PREVIEW||TEST)return;try{localStorage.setItem(KEY,new Date().toISOString());}catch(e){}}
  function build(box){
    if(built||already())return;built=true;
    var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
    var ov=document.createElement('div');ov.className='avisOv';ov.setAttribute('role','dialog');ov.setAttribute('aria-modal','true');
    var w=document.createElement('div');w.className='avis';ov.appendChild(w);
    var rows=Q.map(function(q){return '<div class="ar'+(q[0]==='globale'?' gl':'')+'"><span class="al">'+q[1]+'</span><div class="st" data-k="'+q[0]+'">'+
      [1,2,3,4,5].map(function(n){return '<button type="button" data-n="'+n+'" aria-label="'+n+' sur 5">★</button>';}).join('')+'</div></div>';}).join('');
    w.innerHTML='<button type="button" class="ax" aria-label="Fermer">✕</button><div class="ahd"><img src="assets/dbn-logo-tight.png" alt="" /><h3>Votre avis est important pour moi</h3></div><p class="as">Il m\'aide à vous apporter un meilleur service.</p><p class="af">Cette enquête a un seul but : m\'améliorer. N\'hésitez pas à être <b>franc</b>, même si ce n\'est pas positif — vos remarques comptent plus que des compliments.</p>'+
      '<div class="aq">'+rows+'</div><textarea placeholder="Une idée à explorer ? Vous souhaitez que je modifie ou rajoute quelque chose ? (facultatif)"></textarea>'+
      '<div class="ab"><button type="button" class="go" disabled>Envoyer mon avis</button><button type="button" class="later">Plus tard</button><span>Merci — David</span></div>';
    var notes={};var send=w.querySelector('.ab .go');
    function close(){ov.classList.remove('on');setTimeout(function(){if(ov.parentNode)ov.parentNode.removeChild(ov);},300);}
    w.querySelector('.ax').addEventListener('click',close);w.querySelector('.later').addEventListener('click',close);
    ov.addEventListener('click',function(e){if(e.target===ov)close();});
    document.addEventListener('keydown',function(e){if(e.key==='Escape')close();});
    w.querySelectorAll('.st').forEach(function(s){
      s.querySelectorAll('button').forEach(function(b){
        b.addEventListener('click',function(){var n=+b.dataset.n;notes[s.dataset.k]=n;
          s.querySelectorAll('button').forEach(function(x){x.classList.toggle('on',+x.dataset.n<=n);});
          send.disabled=false;});
      });
    });
    send.addEventListener('click',function(){
      send.disabled=true;send.textContent='Envoi…';
      var d={labo:labo(),officine:v('officine'),cp:v('code_postal')||v('cp'),ville:v('ville'),contact:v('contact'),email:v('email'),ref:ref(),
        catalogue:notes.catalogue||'',commande:notes.commande||'',facilite:notes.facilite||'',globale:notes.globale||'',
        suggestion:w.querySelector('textarea').value.trim()};
      var done=false;
      function ok(){if(done)return;done=true;mark();w.innerHTML='<div class="ok"><b>Merci beaucoup !</b>Votre avis a bien été transmis.</div>';setTimeout(close,2200);
        if(window.gtag)gtag('event','avis_envoye',{labo:d.labo,note:d.globale});}
      function fb(){if(done)return;var f=new FormData();f.append('_subject','Avis client — '+d.labo+' — '+d.officine);
        Object.keys(d).forEach(function(k){f.append(k,d[k]);});
        fetch(FS,{method:'POST',body:f,headers:{Accept:'application/json'}}).then(ok).catch(ok);}
      var cb='dbnAvis'+Date.now(),s=document.createElement('script');
      var to=setTimeout(function(){clean();fb();},45000);
      function clean(){clearTimeout(to);try{delete window[cb];}catch(e){window[cb]=undefined;}if(s.parentNode)s.parentNode.removeChild(s);}
      window[cb]=function(r){clean();(r&&r.ok)?ok():fb();};
      s.onerror=function(){clean();fb();};
      s.src=GW+'?action=avis&callback='+cb+'&payload='+encodeURIComponent(JSON.stringify(d));
      document.body.appendChild(s);
    });
    document.body.appendChild(ov);
    setTimeout(function(){ov.classList.add('on');},1600);
  }
  function watch(){
    var box=document.getElementById('doneBox');if(!box)return;
    if(box.classList.contains('on')){build(box);return;}
    new MutationObserver(function(){if(box.classList.contains('on'))build(box);}).observe(box,{attributes:true,attributeFilter:['class']});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',watch);else watch();
})();
