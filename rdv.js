/* DBN — Prise de rendez-vous en officine : bouton « Prendre rendez-vous » dans le menu + fenêtre de réservation.
   Créneaux : lundi et mardi, 10h · 12h · 14h, 2 h d'écart avec les RDV de l'agenda (lus via la passerelle, action=dispo). */
(function(){
  var GW='https://script.google.com/macros/s/AKfycbx3f6RYXm3y6_T_hqE4hZU-_J5sTNUKUOFSm81xwn5u25tic32LxBkrmK8jyofwYb7Atg/exec';
  var SLOTS=['10:00','12:00','14:00'],GAP=120,NDAYS=18,OPEN=[1,2];
  var HOLI=['2026-11-11','2026-12-25','2027-01-01','2027-04-05','2027-05-01','2027-05-08','2027-05-13','2027-05-24','2027-07-14','2027-08-15'];
  var LABS=['Arganicare','Biosynex','Bonjour Drink','Cut by Fred','Du Monde à la Provence','Flayre','Hydratis','OOPS Optics','SAMPAR','Séfia','Sisters Republic','Autres labos'];
  var J=['dim.','lun.','mar.','mer.','jeu.','ven.','sam.'],M=['janv.','févr.','mars','avr.','mai','juin','juil.','août','sept.','oct.','nov.','déc.'];
  var BUSY=null,S={day:null,t:null,labs:[]},DAYS=[];

  /* --- bouton dans le menu, « Contact » retiré --- */
  document.querySelectorAll('nav a').forEach(function(a){if(/^\s*Contact\s*$/.test(a.textContent))a.remove();});
  var st=document.createElement('style');st.textContent=
   '.rdvBtn{display:inline-flex;align-items:center;gap:8px;border:0;border-radius:99px;background:#E8442A;color:#fff!important;font:800 19px "Hanken Grotesk",system-ui,sans-serif;padding:14px 26px;cursor:pointer;white-space:nowrap;text-decoration:none;box-shadow:0 10px 22px -10px rgba(232,68,42,.75);flex:none}'+
   '.rdvBtn:hover{background:#c93820}.rdvBtn .ic{font-size:22px;line-height:1}'+
   '@media(max-width:700px){.rdvBtn{font-size:14px;padding:9px 14px}.rdvBtn .tx2{display:none}}'+
   '.rdvOv{position:fixed;inset:0;z-index:3000;background:rgba(28,22,17,.55);display:none;align-items:flex-start;justify-content:center;padding:28px 14px;overflow:auto;font-family:"Hanken Grotesk",system-ui,sans-serif;color:#1C1611}.rdvOv.on{display:flex}'+
   '.rdvBox{width:100%;max-width:740px;background:#fff;border-radius:22px;box-shadow:0 30px 70px -20px rgba(0,0,0,.45);overflow:hidden;font-size:16px;line-height:1.5}'+
   '.rdvBh{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:16px 22px;background:#F4E7D2;border-bottom:1px solid #EBE0CE}.rdvBh h3{font-family:Spectral,Georgia,serif;font-size:24px;margin:0}.rdvBh button{border:0;background:none;font-size:22px;cursor:pointer;color:#6E6557}'+
   '.rdvSt{display:flex;gap:6px;padding:12px 22px 0}.rdvSt i{flex:1;height:4px;border-radius:4px;background:#EBE0CE}.rdvSt i.on{background:#1206A6}'+
   '.rdvBb{padding:16px 22px 22px}.rdvBb h4{font-size:13px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:#6E6557;margin:4px 0 10px}'+
   '.rdvDays{display:flex;gap:8px;overflow-x:auto;padding:2px 0 6px}.rdvDay{flex:none;width:84px;border:1.5px solid #EBE0CE;border-radius:14px;background:#fff;padding:9px 6px;text-align:center;cursor:pointer;font:inherit;color:inherit}'+
   '.rdvDay small{display:block;font-size:11.5px;font-weight:700;text-transform:uppercase;color:#6E6557}.rdvDay b{display:block;font-family:Spectral,Georgia,serif;font-size:24px;line-height:1.1}.rdvDay em{display:block;font-style:normal;font-size:11.5px;font-weight:700;color:#1F7A5C}'+
   '.rdvDay.full{opacity:.5;cursor:default}.rdvDay.full em{color:#6E6557}.rdvDay.on{border-color:#1206A6;background:#E4ECF6}'+
   '.rdvSl{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin:14px 0 4px}.rdvSl button{position:relative;border:1.5px solid #EBE0CE;border-radius:12px;background:#fff;padding:12px 6px;text-align:center;font:800 17px "Hanken Grotesk",sans-serif;cursor:pointer;color:#1C1611}'+
   '.rdvSl button small{display:block;font-size:11.5px;font-weight:600;color:#6E6557}.rdvSl button:hover:not(:disabled){border-color:#1206A6}.rdvSl button.on{background:#1206A6;border-color:#1206A6;color:#fff}.rdvSl button.on small{color:#E4ECF6}.rdvSl button:disabled{background:#F6F2EB;color:#B9AE9D;text-decoration:line-through;cursor:default}'+
   '.rdvHint{font-size:13px;color:#6E6557;margin:6px 0 0}.rdvLd{padding:30px 0;text-align:center;color:#6E6557}'+
   '.rdvF2{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:10px}.rdvF3{display:grid;grid-template-columns:minmax(0,2fr) minmax(0,1fr) minmax(0,1.2fr);gap:10px}'+
   '.rdvFl{display:flex;flex-direction:column;gap:4px;margin-bottom:10px}.rdvFl span{font-size:13px;font-weight:700}.rdvFl input,.rdvFl textarea{font:inherit;font-size:16px;border:1.5px solid #EBE0CE;border-radius:11px;padding:10px 12px;background:#FBF5EB;color:#1C1611}.rdvFl input:focus,.rdvFl textarea:focus{outline:none;border-color:#1206A6;background:#fff}'+
   '.rdvLabs{display:flex;flex-wrap:wrap;gap:7px;margin-bottom:12px}.rdvLabs button{border:1.5px solid #EBE0CE;border-radius:99px;background:#fff;padding:7px 13px;font:700 14px "Hanken Grotesk",sans-serif;cursor:pointer;color:#1C1611}.rdvLabs button.on{background:#1206A6;border-color:#1206A6;color:#fff}'+
   '.rdvSum{display:flex;align-items:center;gap:12px;background:#E4ECF6;border-radius:14px;padding:12px 14px;margin-bottom:14px}.rdvSum b{display:block;font-family:Spectral,Georgia,serif;font-size:19px;color:#1206A6}.rdvSum span{font-size:14px;color:#6E6557}.rdvSum button{margin-left:auto;border:0;background:none;color:#1206A6;font:700 14px sans-serif;cursor:pointer;text-decoration:underline}'+
   '.rdvRow{display:flex;gap:10px;margin-top:6px}.rdvGo{flex:1;border:0;border-radius:12px;background:#E8442A;color:#fff;font:800 16px "Hanken Grotesk",sans-serif;padding:13px 18px;cursor:pointer}.rdvGo:hover{background:#c93820}.rdvGo:disabled{background:#D9CFC2;cursor:not-allowed}'+
   '.rdvBk{border:1.5px solid #EBE0CE;background:#fff;border-radius:12px;padding:0 16px;font:700 15px sans-serif;cursor:pointer;color:#1C1611}'+
   '.rdvErr{color:#A3301E;font-size:13.5px;font-weight:700;margin:-2px 0 10px;display:none}'+
   '.rdvDone{text-align:center;padding:16px 4px 6px}.rdvDone .ok{width:72px;height:72px;margin:0 auto 12px;border-radius:50%;background:#E7F5EF;color:#1F7A5C;display:flex;align-items:center;justify-content:center;font-size:34px;font-weight:800}.rdvDone h4{font-family:Spectral,Georgia,serif;font-size:26px;text-transform:none;letter-spacing:0;color:#1C1611;margin:0 0 6px}'+
   '@media(max-width:700px){.rdvF2,.rdvF3{grid-template-columns:minmax(0,1fr)}}@media print{.rdvBtn,.rdvOv{display:none!important}}';
  document.head.appendChild(st);
  var btn=document.createElement('button');btn.type='button';btn.className='rdvBtn';btn.innerHTML='<span class="ic">📅</span><span>Prendre<span class="tx2"> rendez-vous</span></span>';
  var spot=document.querySelector('.dbn-hdr-in,.nav-in,header .wrap');
  var old=spot&&[].slice.call(spot.querySelectorAll('a')).find(function(a){return /Nous contacter/.test(a.textContent);});
  if(old)old.replaceWith(btn);else if(spot)spot.appendChild(btn);
  document.querySelectorAll('a').forEach(function(a){if(a!==btn&&/^\s*Nous contacter/.test(a.textContent)&&!a.closest('footer,#contact'))a.remove();});
  if(spot&&getComputedStyle(spot).display!=='flex'){spot.style.display='flex';spot.style.alignItems='center';spot.style.gap='18px';}

  /* --- fenêtre --- */
  var ov=document.createElement('div');ov.className='rdvOv';ov.setAttribute('role','dialog');ov.setAttribute('aria-modal','true');
  ov.innerHTML='<div class="rdvBox"><div class="rdvBh"><h3 id="rdvT">Prendre rendez-vous</h3><button type="button" aria-label="Fermer">✕</button></div><div class="rdvSt"><i class="on"></i><i></i><i></i></div><div class="rdvBb" id="rdvB"></div></div>';
  document.body.appendChild(ov);
  var bb=ov.querySelector('#rdvB'),bt=ov.querySelector('#rdvT'),sti=ov.querySelectorAll('.rdvSt i');
  function close(){ov.classList.remove('on');}
  ov.querySelector('.rdvBh button').onclick=close;ov.addEventListener('click',function(e){if(e.target===ov)close();});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')close();});
  function steps(n){sti.forEach(function(x,i){x.classList.toggle('on',i<n);});}
  function iso(d){return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2);}
  function mn(t){var p=String(t).split(':');return +p[0]*60+ +(p[1]||0);}
  function lbl(x){return J[x.d.getDay()]+' '+x.d.getDate()+' '+M[x.d.getMonth()];}
  function hh(t){return t.replace(':00','h');}
  function jsonp(params,ok,ko){var cb='rdvCb'+Date.now()+Math.floor(Math.random()*1e3),s=document.createElement('script'),done=false;
    var tm=setTimeout(function(){if(!done){done=true;ko();}},9000);
    window[cb]=function(r){if(done)return;done=true;clearTimeout(tm);try{delete window[cb];}catch(e){}s.remove();ok(r);};
    s.onerror=function(){if(!done){done=true;clearTimeout(tm);ko();}};
    s.src=GW+'?'+Object.keys(params).map(function(k){return k+'='+encodeURIComponent(params[k]);}).join('&')+'&callback='+cb;document.head.appendChild(s);}
  function build(){DAYS=[];var d=new Date();d.setHours(0,0,0,0);d.setDate(d.getDate()+1);var lim=0;
    while(DAYS.length<NDAYS&&lim++<60){var w=d.getDay(),ds=iso(d);
      if(w>=1&&w<=6&&HOLI.indexOf(ds)<0){var op=OPEN.indexOf(w)>=0;DAYS.push({d:new Date(d),ds:ds,sl:SLOTS.map(function(t){var s=mn(t);return {t:t,ok:op&&!(BUSY||[]).some(function(b){return b[0]===ds&&mn(b[2])>s-GAP&&mn(b[1])<s+GAP;})};})});}
      d.setDate(d.getDate()+1);}}
  function step1(){steps(1);bt.textContent='Choisissez un créneau';
    if(!S.day||DAYS.indexOf(S.day)<0)S.day=DAYS.find(function(x){return x.sl.some(function(s){return s.ok;});})||DAYS[0];
    var h='<h4>Jour</h4><div class="rdvDays">'+DAYS.map(function(x,i){var n=x.sl.filter(function(s){return s.ok;}).length;return '<button type="button" class="rdvDay'+(n?'':' full')+(x===S.day?' on':'')+'" data-i="'+i+'"'+(n?'':' disabled')+'><small>'+J[x.d.getDay()]+'</small><b>'+x.d.getDate()+'</b><small>'+M[x.d.getMonth()]+'</small><em>'+(n?n+' créneau'+(n>1?'x':''):'complet')+'</em></button>';}).join('')+'</div>';
    h+='<h4 style="margin-top:14px">Heure · '+lbl(S.day)+'</h4><div class="rdvSl">'+S.day.sl.map(function(s){return '<button type="button" data-t="'+s.t+'"'+(S.t===s.t?' class="on"':'')+(s.ok?'':' disabled')+'>'+hh(s.t)+'<small>'+(s.ok?'≈ 1 h':'indisponible')+'</small></button>';}).join('')+'</div>';
    h+='<p class="rdvHint">Rendez-vous d\'environ 1 heure dans votre officine, le lundi ou le mardi. Vous recevez un e-mail de confirmation de votre demande, puis ma confirmation sous 24 h.</p>';
    h+='<div class="rdvRow"><button class="rdvGo" type="button" id="rdvN1"'+(S.t?'':' disabled')+'>Continuer →</button></div>';
    bb.innerHTML=h;
    bb.querySelectorAll('.rdvDay').forEach(function(b){b.onclick=function(){S.day=DAYS[+b.dataset.i];S.t=null;step1();};});
    bb.querySelectorAll('.rdvSl button').forEach(function(b){b.onclick=function(){S.t=b.dataset.t;step1();};});
    bb.querySelector('#rdvN1').onclick=step2;}
  function v(n){var e=bb.querySelector('[name="'+n+'"]');return e?e.value.trim():'';}
  function esc(s){return String(s||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');}
  function step2(){steps(2);bt.textContent='Vos coordonnées';
    var P={};try{P=JSON.parse(localStorage.getItem('dbn_prefill')||'{}');}catch(e){}var C=S.c||{};
    function f(n,l,a,b){return '<label class="rdvFl"><span>'+l+' *</span><input name="'+n+'" value="'+esc(C[n]||P[a||n]||b||'')+'"'+(n==='cp'?' inputmode="numeric"':n==='email'?' type="email"':n==='tel'?' type="tel"':'')+' /></label>';}
    var h='<div class="rdvSum"><span style="font-size:22px">📅</span><div><b>'+lbl(S.day)+' · '+hh(S.t)+'</b><span>≈ 1 h dans votre officine</span></div><button type="button" id="rdvCh">Modifier</button></div>';
    h+='<div class="rdvF2">'+f('officine','Officine')+f('contact','Votre nom')+'</div>';
    h+='<div class="rdvF3">'+f('adresse','Adresse')+f('cp','Code postal')+f('ville','Ville','ville','Paris')+'</div>';
    h+='<div class="rdvF2">'+f('tel','Téléphone','tel')+f('email','E-mail')+'</div>';
    h+='<h4>Laboratoires à présenter</h4><div class="rdvLabs">'+LABS.map(function(l){return '<button type="button" data-l="'+l+'"'+(S.labs.indexOf(l)>=0?' class="on"':'')+'>'+l+'</button>';}).join('')+'</div>';
    h+='<label class="rdvFl"><span>Un message ? (facultatif)</span><textarea name="msg" rows="2" placeholder="Ex. plutôt avec le titulaire, parking difficile…">'+esc(S.msg)+'</textarea></label>';
    h+='<p class="rdvErr" id="rdvE">Merci de remplir les champs marqués *.</p><div class="rdvRow"><button class="rdvBk" type="button" id="rdvB2">← Retour</button><button class="rdvGo" type="button" id="rdvN2">Demander ce rendez-vous</button></div>';
    bb.innerHTML=h;
    bb.querySelectorAll('.rdvLabs button').forEach(function(b){b.onclick=function(){var l=b.dataset.l,i=S.labs.indexOf(l);if(i>=0)S.labs.splice(i,1);else S.labs.push(l);b.classList.toggle('on');};});
    bb.querySelector('#rdvCh').onclick=step1;bb.querySelector('#rdvB2').onclick=step1;
    bb.querySelector('#rdvN2').onclick=function(){var k=['officine','contact','adresse','cp','ville','tel','email'];
      if(!k.every(function(n){return v(n);})){bb.querySelector('#rdvE').style.display='block';return;}
      S.c={};k.forEach(function(n){S.c[n]=v(n);});S.msg=v('msg');send(this);};}
  function send(b){b.disabled=true;b.textContent='Envoi en cours…';
    var d={date:S.day.ds,heure:S.t,officine:S.c.officine,contact:S.c.contact,adresse:S.c.adresse,cp:S.c.cp,ville:S.c.ville,tel:S.c.tel,email:S.c.email,labos:S.labs.join(', '),message:S.msg,page:document.title};
    try{var P=JSON.parse(localStorage.getItem('dbn_prefill')||'{}');['officine','adresse','cp','ville','contact','tel','email'].forEach(function(n){if(S.c[n])P[n]=S.c[n];});localStorage.setItem('dbn_prefill',JSON.stringify(P));}catch(e){}
    jsonp({action:'rdv',payload:JSON.stringify(d)},function(r){if(r&&r.ok)done();else fallback(d);},function(){fallback(d);});
    if(window.gtag)gtag('event','rdv_demande',{labos:d.labos});}
  function fallback(d){var fd=new FormData();fd.append('_subject','DEMANDE RDV - '+d.officine+' - '+d.date+' '+d.heure);Object.keys(d).forEach(function(k){fd.append(k,d[k]);});
    fetch('https://formspree.io/f/mwvjnpak',{method:'POST',body:fd,headers:{Accept:'application/json'}}).then(done,done);}
  function done(){steps(3);bt.textContent='Demande envoyée';
    bb.innerHTML='<div class="rdvDone"><div class="ok">✓</div><h4>Merci '+esc(S.c.contact.split(' ')[0])+' !</h4><p style="margin:0 0 4px"><b>'+lbl(S.day)+' à '+hh(S.t)+'</b> · '+esc(S.c.officine)+'</p><p style="margin:0 0 14px;color:#6E6557;font-size:14.5px">'+esc(S.c.adresse)+', '+esc(S.c.cp)+' '+esc(S.c.ville)+(S.labs.length?'<br />Labos : '+esc(S.labs.join(', ')):'')+'</p><p style="margin:0 0 18px;font-size:14.5px">Vous allez recevoir un e-mail de confirmation de votre demande. Je vous confirme ensuite le rendez-vous par e-mail sous 24 h.</p><button class="rdvGo" type="button" id="rdvF" style="max-width:240px">Fermer</button></div>';
    bb.querySelector('#rdvF').onclick=close;}
  function open(){S.t=null;ov.classList.add('on');
    if(BUSY){build();step1();return;}
    steps(1);bt.textContent='Choisissez un créneau';bb.innerHTML='<div class="rdvLd">Chargement de mes disponibilités…</div>';
    jsonp({action:'dispo'},function(r){BUSY=(r&&r.busy)||[];build();step1();},function(){BUSY=[];build();step1();});}
  btn.onclick=open;
  window.dbnRdvOpen=open;
})();
