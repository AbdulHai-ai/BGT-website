(function(){
  /* Contact links are assembled on click, so the details are not plain hrefs. */
  function contact(type){
    var n=['92','321'].join('')+['339','2689'].join('');
    if(type==='whatsapp'){window.open(['https:','//','wa','.me/'].join('')+n,'_blank','noopener,noreferrer');return}
    if(type==='email'){window.location.href=['mail','to:'].join('')+['bighawk','technologies'].join('')+String.fromCharCode(64)+['gmail','com'].join('.');return}
    if(type==='call'){window.location.href=['tel',':+'].join('')+n}
  }
  document.addEventListener('click',function(e){var b=e.target.closest('[data-contact]');if(b){e.preventDefault();contact(b.getAttribute('data-contact'))}});

  var hdr=document.querySelector('.hdr');
  function sc(){hdr&&hdr.classList.toggle('sc',window.scrollY>8)}addEventListener('scroll',sc,{passive:true});sc();

  /* Mobile menu: aria state, Escape to close, focus returns to the button */
  var mb=document.getElementById('menu-btn'),mn=document.getElementById('mnav');
  function setMenu(open,ret){if(!mb||!mn)return;mn.classList.toggle('open',open);document.documentElement.classList.toggle('menu-open',open);mb.setAttribute('aria-expanded',open);mb.textContent=open?'Close':'Menu';if(!open&&ret)mb.focus()}
  if(mb){mb.addEventListener('click',function(){setMenu(!mn.classList.contains('open'))});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&mn.classList.contains('open'))setMenu(false,true)});
    mn.addEventListener('click',function(e){if(e.target.closest('a'))setMenu(false)});addEventListener('resize',function(){if(innerWidth>860&&mn.classList.contains('open'))setMenu(false)})}

  /* Reveals with stagger (content stays visible without JS) */
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('.grid4.rv,.grid3.rv,.tags.rv,.steps.rv,.rows.rv').forEach(function(c){c.classList.remove('rv');[].forEach.call(c.children,function(k,i){k.classList.add('rv');k.style.setProperty('--i',i)})});
  var rv=document.querySelectorAll('.rv');
  if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}})},{threshold:.08,rootMargin:'0px 0px -6% 0px'});rv.forEach(function(el){io.observe(el)})}
  else rv.forEach(function(el){el.classList.add('in')});

  /* Scroll choreography: progress bar, hero parallax, word scrub, workflow progression */
  var sp=document.createElement('div');sp.id='sp';document.body.appendChild(sp);
  var hero=document.querySelector('.nl'),scr=document.querySelector('.scrub'),flows=[].slice.call(document.querySelectorAll('.flow')),tick=false;
  function words(el){var out=[];(function walk(n){[].slice.call(n.childNodes).forEach(function(c){if(c.nodeType===3){var f=document.createDocumentFragment();c.textContent.split(/(\s+)/).forEach(function(t){if(!t)return;if(/^\s+$/.test(t))f.appendChild(document.createTextNode(t));else{var s=document.createElement('span');s.className='w';s.textContent=t;f.appendChild(s);out.push(s)}});c.parentNode.replaceChild(f,c)}else if(c.nodeType===1)walk(c)})})(el);return out}
  var ws=scr?words(scr):[];
  function frame(){tick=false;var vh=innerHeight,y=scrollY,d=document.documentElement;
    sp.style.transform='scaleX('+(y/((d.scrollHeight-vh)||1))+')';
    if(hero&&!reduce)hero.style.setProperty('--p',Math.min(1,y/(hero.offsetHeight||1)).toFixed(3));
    if(ws.length&&!reduce){var r=scr.getBoundingClientRect(),p=Math.max(0,Math.min(1,(vh*.82-r.top)/(r.height+vh*.35)));ws.forEach(function(w,i){w.style.opacity=(.16+.84*Math.max(0,Math.min(1,p*(ws.length+6)-i))).toFixed(2)})}
    flows.forEach(function(f){[].forEach.call(f.children,function(li){li.classList.toggle('on',li.getBoundingClientRect().top<vh*.62)})})}
  function req(){if(!tick){tick=true;requestAnimationFrame(frame)}}
  addEventListener('scroll',req,{passive:true});addEventListener('resize',req);frame();

  /* Count-up numbers in the hero */
  document.querySelectorAll('.stats b').forEach(function(b){var t=parseInt(b.textContent,10);if(reduce||!t)return;b.textContent='0';
    setTimeout(function(){var s=null;requestAnimationFrame(function step(ts){s=s||ts;var k=Math.min(1,(ts-s)/1400);b.textContent=Math.round(t*(1-Math.pow(1-k,3)));if(k<1)requestAnimationFrame(step)})},1100)});

  /* Card spotlight on hover-capable devices */
  if(matchMedia('(hover:hover)').matches)document.addEventListener('pointermove',function(e){var c=e.target.closest&&e.target.closest('.card');if(c){var r=c.getBoundingClientRect();c.style.setProperty('--mx',(e.clientX-r.left)+'px');c.style.setProperty('--my',(e.clientY-r.top)+'px')}},{passive:true});

  /* Client search */
  var cs=document.getElementById('client-search');
  if(cs){var items=[].slice.call(document.querySelectorAll('#client-list li')),cnt=document.getElementById('client-count'),emp=document.getElementById('client-empty');
    cs.addEventListener('input',function(){var q=cs.value.trim().toLowerCase(),n=0;items.forEach(function(li){var ok=li.textContent.toLowerCase().indexOf(q)>-1;li.hidden=!ok;if(ok)n++});
      cnt.textContent=n+' of '+items.length+' clients';emp.hidden=n>0})}

  /* Enquiry form */
  var form=document.getElementById('enquiry-form');
  if(form){
    var map={'ai-systems-automation':'AI Systems & Automation','custom-software-erp':'Custom Software & ERP','ai-video-production':'AI Video Production','media-creative-production':'Media & Creative Production'};
    var q=new URLSearchParams(location.search).get('service'),sel=form.elements.service;
    if(q&&map[q])sel.value=map[q];
    var st=document.getElementById('form-status'),alt=document.getElementById('form-alt'),btn=document.getElementById('send'),pending=false;
    function chk(f,ok){f.setAttribute('aria-invalid',!ok);var e=document.getElementById('e-'+f.name);if(e)e.hidden=ok;return ok}
    form.addEventListener('submit',function(ev){
      ev.preventDefault();if(pending)return;
      if(form.elements.website.value)return; /* spam trap: nothing is sent or shown */
      var el=form.elements,okN=chk(el.name,el.name.value.trim()!==''),okE=chk(el.email,/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.email.value.trim())),okM=chk(el.message,el.message.value.trim()!=='');
      if(!(okN&&okE&&okM)){st.className='status bad';st.textContent='Please check the highlighted fields.';var bad=form.querySelector('[aria-invalid=true]');bad&&bad.focus();return}
      pending=true;btn.disabled=true;btn.textContent='Sending…';st.className='status';st.textContent='Sending your enquiry…';alt.hidden=true;
      var data={name:el.name.value.trim(),email:el.email.value.trim(),company:el.company.value.trim(),service:el.service.value,budget:el.budget.value,message:el.message.value.trim()};
      fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)})
        .then(function(r){if(!r.ok)throw new Error('status '+r.status);st.className='status ok';st.textContent='Thank you. Your enquiry has been sent.';form.reset();if(q&&map[q])sel.value=map[q]})
        .catch(function(){st.className='status bad';st.textContent='We could not send your enquiry. Your details are still here. You can try again, or contact us directly:';alt.hidden=false})
        .then(function(){pending=false;btn.disabled=false;btn.textContent='Send enquiry'});
    });
  }
})();
