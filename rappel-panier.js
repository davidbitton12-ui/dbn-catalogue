/* DBN — rappel « commande en attente » (accueil, portail, Commander en ligne) : lit les paniers dbn_panier_* de cet appareil */
(function(){
  var TTL=7*864e5,LAB={'DBN - Commande Arganicare.html':'Arganicare','DBN - Commande Biosynex.html':'Biosynex','DBN - Commande Bonjour Drink.html':'Bonjour Drink','DBN - Commande Flayre.html':'Flayre','DBN - Commande OOPS Optics.html':'OOPS Optics','DBN - Commande SAMPAR.html':'SAMPAR','DBN - Commande Sisters Republic.html':'Sisters Republic','DBN - Commande Hydratis.html':'Hydratis'};
  try{if(sessionStorage.getItem('dbn_rappel_off'))return;}catch(e){}
  var L=[];
  try{for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(k.indexOf('dbn_panier_')!==0)continue;
    var page=decodeURIComponent(k.slice(11));if(!LAB[page])continue;
    var d=JSON.parse(localStorage.getItem(k)||'null');if(!d||!d.q)continue;
    if(Date.now()-d.t>TTL){localStorage.removeItem(k);continue;}
    var n=0;for(var q in d.q)n+=+d.q[q]||0;if(n>0)L.push({p:page,l:LAB[page],n:n,t:d.t});}}catch(e){return;}
  if(!L.length)return;
  L.sort(function(a,b){return b.t-a.t;});
  function dd(t){var x=new Date(t+TTL);return ('0'+x.getDate()).slice(-2)+'/'+('0'+(x.getMonth()+1)).slice(-2);}
  var st=document.createElement('style');
  st.textContent='.prap{box-sizing:border-box;width:calc(100% - 80px);max-width:1120px;margin:14px auto 0;display:flex;align-items:center;gap:12px;flex-wrap:wrap;padding:11px 14px 11px 12px;background:#EAF6F1;border:1.5px solid #2E9E7A;border-radius:14px;font-family:"Hanken Grotesk",system-ui,sans-serif;font-size:14.5px;line-height:1.35;color:#1C1611}'+
   '.prap .ic{flex:none;width:34px;height:34px;border-radius:50%;background:#2E9E7A;color:#fff;display:flex;align-items:center;justify-content:center;font-size:17px}'+
   '.prap .tx{flex:1;min-width:200px}.prap .tx b{color:#14453F}.prap .go{display:flex;gap:8px;flex-wrap:wrap}'+
   '.prap a.r{display:inline-flex;align-items:center;gap:6px;background:#2E9E7A;color:#fff;text-decoration:none;font-weight:700;font-size:13.5px;border-radius:999px;padding:8px 15px;white-space:nowrap}.prap a.r:hover{background:#14453F;color:#fff}'+
   '.prap a.r i{font-style:normal;background:rgba(255,255,255,.22);border-radius:99px;padding:1px 7px;font-size:12px}'+
   '.prap .x{flex:none;background:none;border:none;color:#6E6557;font-size:16px;cursor:pointer;padding:4px;line-height:1}.prap .x:hover{color:#1C1611}'+
   '@media(max-width:900px){.prap{width:calc(100% - 48px)}}@media(max-width:600px){.prap{width:calc(100% - 24px);margin:10px auto 0;font-size:13.5px}.prap .go{width:100%}.prap a.r{flex:1;justify-content:center}}@media print{.prap{display:none}}';
  document.head.appendChild(st);
  var b=document.createElement('div');b.className='prap';b.setAttribute('role','status');
  var one=L.length===1;
  b.innerHTML='<span class="ic">🛒</span><span class="tx">'+(one?'Vous avez une commande <b>'+L[0].l+'</b> en attente (<b>'+L[0].n+' article'+(L[0].n>1?'s':'')+'</b>). Elle est conservée jusqu\'au '+dd(L[0].t)+'.':'Vous avez <b>'+L.length+' commandes en attente</b>. Reprenez-les en un clic :')+'</span>'+
    '<span class="go">'+L.map(function(x){return '<a class="r" href="'+encodeURI(x.p)+'">'+(one?'Reprendre ma commande':x.l+' <i>'+x.n+'</i>')+' →</a>';}).join('')+'</span>'+
    '<button class="x" type="button" aria-label="Masquer">✕</button>';
  b.querySelector('.x').addEventListener('click',function(){b.remove();try{sessionStorage.setItem('dbn_rappel_off','1');}catch(e){}});
  function place(){var h=document.querySelector('header.dbn-hdr,header');if(h&&h.parentNode)h.parentNode.insertBefore(b,h.nextSibling);else document.body.insertBefore(b,document.body.firstChild);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',place);else place();
})();
