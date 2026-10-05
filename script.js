(() => {
  const body = document.body;
  const enterBtn = document.getElementById('enterBtn');
  const gate = document.getElementById('entryGate');
  const audio = document.getElementById('shutterAudio');
  const progressBar = document.getElementById('progressBar');
  const cursor = document.getElementById('cursor');
  const year = document.getElementById('year');
  const bookingModal = document.getElementById('bookingModal');
  const bookingForm = document.getElementById('bookingForm');
  const closeBooking = document.getElementById('closeBooking');
  const packageInput = document.getElementById('packageInput');
  let entered = false;
  let rafPending = false;
  let statsPlayed = false;

  year.textContent = new Date().getFullYear();

  const enterExperience = () => {
    if (entered) return;
    entered = true;
    try { audio.currentTime = 0; audio.volume = .45; audio.play().catch(()=>{}); } catch(e) {}
    gate.classList.add('is-exiting');
    body.classList.remove('locked');
    body.classList.add('entered');
    setTimeout(() => gate.setAttribute('aria-hidden','true'), 1000);
  };

  enterBtn.addEventListener('click', enterExperience);
  window.addEventListener('keydown', (e) => {
    if (!entered && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      enterExperience();
    }
  });

  // Cinematic scroll-linked progress engine: each .story gets a 0–1 CSS --p value.
  function updateScrollStories(){
    rafPending = false;
    const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    const globalProgress = scrollY / max;
    progressBar.style.width = `${Math.min(100, Math.max(0, globalProgress*100))}%`;

    document.querySelectorAll('.story').forEach(story => {
      const rect = story.getBoundingClientRect();
      const travel = story.offsetHeight - innerHeight;
      const local = travel > 0 ? Math.min(1, Math.max(0, -rect.top / travel)) : 0;
      story.style.setProperty('--p', local.toFixed(4));
    });

    const impact = document.getElementById('impact');
    if (!statsPlayed && impact) {
      const r = impact.getBoundingClientRect();
      if (r.top < innerHeight * .7) {
        statsPlayed = true;
        animateStats();
      }
    }
  }

  function scheduleScroll(){
    if (!rafPending) {
      rafPending = true;
      requestAnimationFrame(updateScrollStories);
    }
  }
  addEventListener('scroll', scheduleScroll, {passive:true});
  addEventListener('resize', scheduleScroll);
  updateScrollStories();

  // Subtle pointer-driven parallax / 3D tilt.
  let tx = 0, ty = 0, cx = 0, cy = 0;
  addEventListener('pointermove', (e) => {
    tx = (e.clientX / innerWidth - .5) * 2;
    ty = (e.clientY / innerHeight - .5) * 2;
    if (cursor && matchMedia('(pointer:fine)').matches) {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    }
  }, {passive:true});
  function pointerLoop(){
    cx += (tx-cx)*.06; cy += (ty-cy)*.06;
    document.documentElement.style.setProperty('--mx', cx.toFixed(3));
    document.documentElement.style.setProperty('--my', cy.toFixed(3));
    requestAnimationFrame(pointerLoop);
  }
  pointerLoop();

  document.querySelectorAll('a,button,.phone-card,.social-card').forEach(el => {
    el.addEventListener('mouseenter',()=>body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave',()=>body.classList.remove('cursor-hover'));
  });

  function animateStats(){
    document.querySelectorAll('[data-count]').forEach(el => {
      const target = Number(el.dataset.count || 0);
      const decimals = Number(el.dataset.decimals || 0);
      const suffix = el.dataset.suffix || '';
      const start = performance.now();
      const duration = 1500;
      const step = now => {
        const t = Math.min(1,(now-start)/duration);
        const ease = 1 - Math.pow(1-t,3);
        const val = target * ease;
        el.textContent = `${val.toFixed(decimals)}${suffix}`;
        if(t<1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }

  // Booking modal and WhatsApp brief.
  document.querySelectorAll('.open-booking').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.dataset.package) packageInput.value = btn.dataset.package;
      if (typeof bookingModal.showModal === 'function') bookingModal.showModal();
      else bookingModal.setAttribute('open','');
    });
  });
  closeBooking.addEventListener('click',()=>bookingModal.close());
  bookingModal.addEventListener('click',(e)=>{
    const rect = bookingModal.getBoundingClientRect();
    const inside = e.clientX>=rect.left && e.clientX<=rect.right && e.clientY>=rect.top && e.clientY<=rect.bottom;
    if(!inside) bookingModal.close();
  });

  bookingForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    const name = document.getElementById('nameInput').value.trim();
    const brand = document.getElementById('brandInput').value.trim();
    const pkg = packageInput.value;
    const date = document.getElementById('dateInput').value;
    const idea = document.getElementById('ideaInput').value.trim();
    const text = [
      'Hi Kavindu, I would like to discuss a collaboration.',
      '',
      `Name: ${name}`,
      `Brand / Company: ${brand}`,
      `Package: ${pkg}`,
      date ? `Preferred date: ${date}` : '',
      idea ? `Campaign idea: ${idea}` : '',
      '',
      'I understand that a 50% advance is required to confirm orders/projects.'
    ].filter(Boolean).join('\n');
    const url = `https://wa.me/94704034120?text=${encodeURIComponent(text)}`;
    window.open(url,'_blank','noopener,noreferrer');
  });

  // Keyboard escape fallback for browsers with dialog quirks.
  addEventListener('keydown',(e)=>{ if(e.key==='Escape' && bookingModal.open) bookingModal.close(); });
})();
