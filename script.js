// Progressive reveal
const io = new IntersectionObserver((entries)=>{
  for(const e of entries){
    if(e.isIntersecting){ e.target.classList.add('is-in'); io.unobserve(e.target); }
  }
}, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

// Year stamp
document.getElementById('y').textContent = new Date().getFullYear();

// Optional: View Transition for in-page hash jumps (progressive)
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', (ev)=>{
    const href = a.getAttribute('href');
    const target = document.querySelector(href);
    if(!target || !document.startViewTransition) return; // fallback
    ev.preventDefault();
    document.startViewTransition(()=>{
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.pushState(null, '', href);
    });
  });
});

// Add action overlay to project cards
document.querySelectorAll('.project').forEach(card=>{
  card.setAttribute('data-tilt','');
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  overlay.innerHTML = `
    <div class="meta-left">
      <small class="muted">Project</small>
    </div>
    <div class="actions">
      <a class="btn" href="#">Details</a>
      <a class="btn primary" href="#">Live</a>
    </div>`;
  card.appendChild(overlay);
});

// Subtle 3D tilt on pointer move (lightweight, respects reduce-motion)
if(!matchMedia('(prefers-reduced-motion: reduce)').matches){
  document.querySelectorAll('.project[data-tilt]').forEach(el=>{
    el.addEventListener('pointermove', (e)=>{
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      const rx = -py * 6; // tilt x
      const ry = px * 6;  // tilt y
      el.style.transform = `translateY(-2px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    el.addEventListener('pointerleave', ()=>{ el.style.transform = ''; });
  });
}
