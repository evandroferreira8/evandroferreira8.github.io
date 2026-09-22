(()=>{
  const root=document.documentElement;
  const loader=document.getElementById('siteLoader');
  if(loader){
    root.classList.add('is-loading');
    const start=performance.now();
    const finish=()=>{
      const elapsed=performance.now()-start;
      const minVisible=780;
      const hide=()=>{
        loader.classList.add('is-hidden');
        root.classList.remove('is-loading');
      };
      if(elapsed<minVisible)setTimeout(hide,minVisible-elapsed);
      else hide();
    };
    let done=false;
    const once=()=>{if(done)return;done=true;finish();};
    window.addEventListener('load',once,{once:true});
    setTimeout(once,2200);
  }

  const header=document.querySelector('.site-header');
  const button=document.querySelector('.menu-button');
  const menu=document.querySelector('#menu');
  const navLinks=[...document.querySelectorAll('.menu a')];

  const addGoNexusBridge=()=>{
    if(!menu||document.querySelector('[data-go-nexus-bridge]'))return;
    const link=document.createElement('a');
    link.href='https://evandroferreira8.github.io/GoNexus/';
    link.textContent='GO Nexus';
    link.dataset.goNexusBridge='true';
    link.setAttribute('aria-label','Abrir GO Nexus, ferramentas para Pokemon GO');
    menu.appendChild(link);
  };
  addGoNexusBridge();

  const setHeader=()=>header?.classList.toggle('scrolled',window.scrollY>24);
  setHeader();
  window.addEventListener('scroll',setHeader,{passive:true});

  if(button&&menu){
    button.addEventListener('click',()=>{
      const open=menu.classList.toggle('open');
      button.setAttribute('aria-expanded',String(open));
    });
    [...document.querySelectorAll('.menu a')].forEach(link=>link.addEventListener('click',()=>{
      menu.classList.remove('open');
      button.setAttribute('aria-expanded','false');
    }));
  }

  const backToTop=document.querySelector('.back-to-top');
  const setBackToTop=()=>backToTop?.classList.toggle('is-visible',window.scrollY>520);
  setBackToTop();
  window.addEventListener('scroll',setBackToTop,{passive:true});

  const revealEls=document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('visible');revealObserver.unobserve(entry.target)}
    }),{threshold:.08});
    revealEls.forEach(el=>revealObserver.observe(el));

    const sections=[...document.querySelectorAll('main section[id]')];
    const sectionObserver=new IntersectionObserver(entries=>{
      const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
      if(!visible)return;
      navLinks.forEach(link=>link.classList.toggle('active',link.getAttribute('href')===`#${visible.target.id}`));
    },{rootMargin:'-30% 0px -55% 0px',threshold:[0,.1,.25,.5]});
    sections.forEach(section=>sectionObserver.observe(section));
  } else revealEls.forEach(el=>el.classList.add('visible'));

  const filters=[...document.querySelectorAll('.archive-filter')];
  const items=[...document.querySelectorAll('.archive-item')];
  filters.forEach(filter=>filter.addEventListener('click',()=>{
    const value=filter.dataset.filter;
    filters.forEach(f=>f.classList.toggle('is-active',f===filter));
    items.forEach(item=>{const kinds=(item.dataset.kind||'').split(/\s+/);item.hidden=value!=='all'&&!kinds.includes(value)});
  }));

  const galleryButtons=[...document.querySelectorAll('.gallery-open')];
  const lightbox=document.querySelector('.lightbox');
  if(galleryButtons.length&&lightbox){
    const image=lightbox.querySelector('.lightbox-image');
    const caption=lightbox.querySelector('.lightbox-caption');
    const closeButtons=[...lightbox.querySelectorAll('[data-lightbox-close]')];
    const prev=lightbox.querySelector('.lightbox-prev');
    const next=lightbox.querySelector('.lightbox-next');
    let current=0;
    let lastFocus=null;

    const render=(index)=>{
      current=(index+galleryButtons.length)%galleryButtons.length;
      const btn=galleryButtons[current];
      image.src=btn.dataset.full||btn.querySelector('img')?.src||'';
      image.alt=btn.querySelector('img')?.alt||'Fotografia ampliada';
      caption.textContent=btn.dataset.caption||'';
    };
    const open=(index,trigger)=>{
      lastFocus=trigger||document.activeElement;
      render(index);
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden','false');
      document.body.classList.add('lightbox-open');
      lightbox.querySelector('.lightbox-close')?.focus();
    };
    const close=()=>{
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden','true');
      document.body.classList.remove('lightbox-open');
      image.src='';
      lastFocus?.focus?.();
    };
    galleryButtons.forEach((btn,index)=>btn.addEventListener('click',()=>open(index,btn)));
    closeButtons.forEach(btn=>btn.addEventListener('click',close));
    prev?.addEventListener('click',()=>render(current-1));
    next?.addEventListener('click',()=>render(current+1));
    document.addEventListener('keydown',(event)=>{
      if(!lightbox.classList.contains('is-open'))return;
      if(event.key==='Escape')close();
      if(event.key==='ArrowLeft')render(current-1);
      if(event.key==='ArrowRight')render(current+1);
    });
  }

})();
