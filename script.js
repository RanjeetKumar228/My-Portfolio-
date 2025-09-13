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

// Project data with details and live URLs
const projects = [
  {
    details: "https://github.com/RanjeetKumar228/BMI-Calculator/blob/main/README.md",
    live: "https://ranjeetkumar228.github.io/BMI-Calculator/"
  },
  {
    details: "https://github.com/RanjeetKumar228/project-two-details", // Placeholder: Update with actual URL
    live: "https://ranjeetkumar228.github.io/project-two-live" // Placeholder: Update with actual URL
  },
  {
    details: "https://github.com/RanjeetKumar228/project-three-details", // Placeholder: Update with actual URL
    live: "https://ranjeetkumar228.github.io/project-three-live" // Placeholder: Update with actual URL
  }
];

// Add action overlay to project cards
document.querySelectorAll('.project').forEach((card, index)=>{
  card.setAttribute('data-tilt','');
  // Prefer explicit data attributes on the article so adding a new project is copy-paste easy
  const dataLive = card.dataset.live;
  const dataDetails = card.dataset.details || card.dataset.detailId; // support both names
  const fallback = projects[index] || { details: "#", live: "#" };
  const liveUrl = dataLive || fallback.live;
  const detailsUrl = dataDetails || fallback.details;

  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  overlay.innerHTML = `
    <div class="meta-left">
      <small class="muted">Project</small>
    </div>
    <div class="actions">
      <a class="btn details-btn" href="${detailsUrl}" target="_blank" rel="noopener">Details</a>
      <a class="btn primary" href="${liveUrl}" target="_blank" rel="noopener">Live</a>
    </div>`;
  card.appendChild(overlay);

  // Allow keyboard users to open the first action with Enter when focused on the card
  card.setAttribute('tabindex','0');
  card.addEventListener('keydown', (e)=>{
    if(e.key === 'Enter'){
      const firstLink = card.querySelector('.actions a');
      if(firstLink) firstLink.click();
    }
  });

  // Ensure touch taps on overlay anchors open the links immediately on mobile
  overlay.querySelectorAll('a').forEach(a=>{
    a.addEventListener('pointerdown', (ev)=>{
      // On some mobile browsers a pointermove on parent can swallow taps; stop propagation
      ev.stopPropagation();
      // Allow normal link navigation; for safety, also open in a new tab on pointerup if needed
      // (most browsers will handle the href on pointerup/click)
    }, { passive: true });
  });
});

// Subtle 3D tilt on pointer move — only enable on hover-capable devices (avoid interfering with touch)
if(matchMedia('(hover: hover)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches){
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

// Ensure overlay anchors don't get swallowed by parent handlers on touch devices
document.querySelectorAll('.project .overlay a').forEach(a=>{
  // Stop propagation on click/tap so parent handlers (like pointer handlers) don't intercept
  a.addEventListener('click', (ev)=>{ ev.stopPropagation(); });
  // pointerdown to avoid 300ms/tap issues — not passive so we could preventDefault if needed
  a.addEventListener('pointerdown', (ev)=>{ ev.stopPropagation(); });
  // touchend fallback: if for some reason the navigation doesn't happen, ensure we open the link
  a.addEventListener('touchend', (ev)=>{
    // allow normal behavior if it will navigate; otherwise open explicitly
    // (this is conservative; most browsers will follow the href automatically)
    // ev.stopPropagation(); // already handled
  }, { passive: true });
});


