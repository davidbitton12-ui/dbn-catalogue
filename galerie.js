/* DBN — galerie photos produit : un élément [data-gal="img1|img2|img3"] ouvre une galerie (flèches, glisser, points, clavier) */
(function(){
  var st=document.createElement('style');
  st.textContent='.galN{position:absolute;left:3px;top:3px;z-index:2;font:800 10px/1 "Hanken Grotesk",system-ui,sans-serif;color:#fff;background:#1206A6;border-radius:99px;padding:3px 6px;pointer-events:none}'+
  '.galW{position:relative;display:inline-flex}'+
  '.gal{position:fixed;inset:0;z-index:5000;background:rgba(20,18,51,.86);display:none;align-items:center;justify-content:center;padding:18px}.gal.on{display:flex}'+
  '.gal figure{margin:0;position:relative;background:#fff;border-radius:18px;padding:16px 16px 12px;width:min(640px,94vw);box-shadow:0 24px 60px -20px rgba(0,0,0,.6)}'+
  '.gal .gv{position:relative;overflow:hidden;border-radius:10px;touch-action:pan-y}'+
  '.gal .gt{display:flex;transition:transform .3s ease}.gal .gt img{flex:0 0 100%;width:100%;height:min(62vh,520px);object-fit:contain;display:block;user-select:none;-webkit-user-drag:none}'+
  '.gal figcaption{text-align:center;font:700 15px/1.3 "Hanken Grotesk",system-ui,sans-serif;color:#141233;margin-top:10px}'+
  '.gal .gd{display:flex;justify-content:center;gap:7px;margin-top:9px}.gal .gd button{width:9px;height:9px;border-radius:50%;border:0;padding:0;background:#D3D6E4;cursor:pointer}.gal .gd button.on{background:#1206A6;transform:scale(1.25)}'+
  '.gal .ga{position:absolute;top:50%;transform:translateY(-50%);width:44px;height:44px;border-radius:50%;border:0;background:rgba(255,255,255,.95);box-shadow:0 4px 14px -4px rgba(0,0,0,.35);font-size:22px;font-weight:800;color:#1206A6;cursor:pointer;z-index:3}'+
  '.gal .ga.p{left:6px}.gal .ga.n{right:6px}.gal .ga:disabled{opacity:.3;cursor:default}'+
  '.gal .gx{position:absolute;top:8px;right:8px;z-index:4;width:38px;height:38px;border-radius:50%;border:0;background:#F1F2F7;font-size:18px;font-weight:800;cursor:pointer;color:#141233}'+
  '.gal .gc{position:absolute;left:14px;top:12px;z-index:4;font:800 12px "Hanken Grotesk",system-ui,sans-serif;color:#55586D}'+
  '@media(max-width:600px){.gal .ga{width:38px;height:38px;font-size:19px}}';
  document.head.appendChild(st);
  var ov=document.createElement('div');ov.className='gal';ov.setAttribute('role','dialog');ov.setAttribute('aria-modal','true');
  ov.innerHTML='<figure><span class="gc"></span><button type="button" class="gx" aria-label="Fermer">✕</button><div class="gv"><div class="gt"></div><button type="button" class="ga p" aria-label="Photo précédente">‹</button><button type="button" class="ga n" aria-label="Photo suivante">›</button></div><figcaption></figcaption><div class="gd"></div></figure>';
  document.body.appendChild(ov);
  var tr=ov.querySelector('.gt'),dots=ov.querySelector('.gd'),cap=ov.querySelector('figcaption'),cnt=ov.querySelector('.gc'),bp=ov.querySelector('.ga.p'),bn=ov.querySelector('.ga.n'),L=[],ix=0;
  function show(i){ix=Math.max(0,Math.min(L.length-1,i));tr.style.transform='translateX('+(-100*ix)+'%)';bp.disabled=ix===0;bn.disabled=ix===L.length-1;cnt.textContent=(ix+1)+' / '+L.length;[].forEach.call(dots.children,function(d,k){d.classList.toggle('on',k===ix);});}
  function open(list,label){L=list;tr.innerHTML=L.map(function(s){return '<img src="'+s+'" alt="" />';}).join('');dots.innerHTML=L.map(function(_,k){return '<button type="button" aria-label="Photo '+(k+1)+'"></button>';}).join('');cap.textContent=label||'';ov.classList.add('on');show(0);}
  function close(){ov.classList.remove('on');}
  document.addEventListener('click',function(e){
    var t=e.target.closest&&e.target.closest('[data-gal]');
    if(t&&!ov.contains(t)){e.preventDefault();e.stopPropagation();var row=t.closest('.p,.disp,.ix-p'),n=t.getAttribute('data-l')||(row&&row.querySelector('.n,.ix-n,.tx b')||{}).textContent||'';open(t.getAttribute('data-gal').split('|'),n);}
  },true);
  ov.addEventListener('click',function(e){if(e.target===ov||e.target.closest('.gx'))close();else if(e.target===bp)show(ix-1);else if(e.target===bn)show(ix+1);else if(e.target.parentNode===dots)show([].indexOf.call(dots.children,e.target));});
  document.addEventListener('keydown',function(e){if(!ov.classList.contains('on'))return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')show(ix-1);if(e.key==='ArrowRight')show(ix+1);});
  var x0=null;ov.querySelector('.gv').addEventListener('touchstart',function(e){x0=e.touches[0].clientX;},{passive:true});
  ov.querySelector('.gv').addEventListener('touchend',function(e){if(x0===null)return;var dx=e.changedTouches[0].clientX-x0;if(Math.abs(dx)>40)show(ix+(dx<0?1:-1));x0=null;});
})();
