(function(){

  // checks if the user asked their OS to cut back on animations (accessibility!)
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------------- WELCOME MEDIA :D ----------------
  // just a placeholder fo now
  // swap for a real <video>/embed
  var mediaBtn = document.querySelector('.media-frame');
  // only wire it up if the element actually exists on the page
  if(mediaBtn){
    mediaBtn.addEventListener('click', function(){
      // clicking the frame scrolls down to connect, instant jump if reduced motion is on
      document.getElementById('connect').scrollIntoView({behavior: reduceMotion ? 'auto' : 'smooth'});
    });
  }

  // ---------------- HERO VIDEO ----------------
const heroVideo = document.querySelector('.hero-video');
if (heroVideo && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  heroVideo.pause();
}
if (heroVideo && 'IntersectionObserver' in window) {
  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) heroVideo.play().catch(() => {});
    else heroVideo.pause();
  }, { threshold: 0.1 }).observe(heroVideo);
}

  // ---------------- EMBERS :3 ----------------
  var emberCanvas = document.getElementById('ember-canvas');
  var ectx = emberCanvas.getContext('2d');
  var EW, EH; // canvas width/height, kept in sync with the page

  // makes the canvas cover the whole page, not just the visible screen
  function resizeEmber(){
    EW = emberCanvas.width = window.innerWidth;
    EH = emberCanvas.height = window.innerHeight;
  }
  resizeEmber();
  window.addEventListener('resize', resizeEmber);
  // re-run on load too, since images/fonts can change the page height
  window.addEventListener('load', resizeEmber);

  var embers = [];
  // fewer embers on small screens so phones don't suffer
  var COUNT = window.innerWidth < 700 ? 14 : 26;

  // makes one ember. randomY = true scatters them across the page at start,
  // false drops a new one just below the bottom edge so it floats up into view
  function spawnEmber(randomY){
    return {
      x: Math.random()*EW,
      y: randomY ? Math.random()*EH : EH + 10,
      vy: -(0.2 + Math.random()*0.45),   // negative = moves up, each at a slightly different speed
      vx: (Math.random()-0.5) * 0.2,     // tiny sideways drift (left or right)
      size: Math.random() < 0.8 ? 2 : 5, // mostly 2px, occasionally a chunky 5px one
      seed: Math.random()*Math.PI*2      // random starting point for the wobble/flicker so they're not in sync
    };
  }
  // fill the page with embers to start
  for(var k=0;k<COUNT;k++){ embers.push(spawnEmber(true)); }

  // runs every frame: clear, move every ember, redraw
  function emberFrame(){
    ectx.clearRect(0,0,EW,EH);
    for(var j=0;j<embers.length;j++){
      var em = embers[j];
      em.seed += 0.05; // advances the wobble/flicker over time
      // drift sideways plus a little sine-wave sway
      em.x += em.vx + Math.sin(em.seed)*0.08;
      em.y += em.vy;
      // floated off the top? swap it for a fresh one at the bottom
      if(em.y < -10){ embers[j] = spawnEmber(false); continue; }
      // flick is a value between 0.1 and 1 that pulses, makes the glow flicker
      var flick = 0.55 + 0.45*Math.sin(em.seed*2.3);
      // brighter flick = more yellow and more opaque, dimmer = deeper orange and faded
      ectx.fillStyle = 'rgba(255,' + (140+Math.floor(60*flick)) + ',40,' + (0.5+0.4*flick) + ')';
      // rounded to whole pixels so they stay crisp and pixel-y
      ectx.fillRect(Math.round(em.x), Math.round(em.y), em.size, em.size);
    }
    requestAnimationFrame(emberFrame); // loop forever
  }
  // skip the animation entirely if the user prefers reduced motion
  if(!reduceMotion){ requestAnimationFrame(emberFrame); }

})();

// key -> section id. add more here and they just work
// (keys are case sensitive, so 'p' won't fire with caps lock on)
const shortcuts = {
  'a': '#about',
  'Enter': '#projects',
  'p': '#projects',
  'c': '#connect',
  's': '#support',
  'b': 'index.html'
};

// ---------------- KEYBOARD SHORTCUTS :^) ----------------
document.addEventListener('keydown', (e) => {
  // Keeps shortcuts from messing up other inputs
  // (so typing a "p" in a form doesn't yank you to projects)
  const tag = e.target.tagName;
  if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tag) || e.target.isContentEditable) return;

  // Don't override Enter on a focused link or button
  // (they already activate on Enter, so let them do their thing)
  if (e.key === 'Enter' && ['A', 'BUTTON'].includes(tag)) return;

  // Ignore combos
  // (so Ctrl+C still copies, Ctrl+P still prints, etc)
  if (e.ctrlKey || e.metaKey || e.altKey) return;

  // look up which section this key goes to, bail if it isn't one of ours
  const target = shortcuts[e.key];
  if (!target) return;

  // page links (like index.html) navigate; #section links scroll
  if (!target.startsWith('#')) {
    e.preventDefault();
    window.location.href = target;
    return;
  }

  // bail if this page doesn't have that section (ex: 'c' on the construction page)
  const section = document.querySelector(target);
  if (!section) return;

  // stop the browser's default behavior for the key, then scroll to the section
  e.preventDefault();
  section.scrollIntoView({ behavior: 'smooth' });
  history.pushState(null, '', target); // Keeps the URL hash in sync. nice.
});

// ---------------- CLICK TO COPY EMAIL :] ----------------
document.querySelectorAll('.copy-email').forEach((btn) => {
  const original = btn.textContent; // remember the email so we can put it back

  btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(btn.dataset.email);
      btn.textContent = 'copied!';
    } catch {
      btn.textContent = 'copy failed :('; // ex: clipboard blocked by the browser
    }
    // flip back to the email after a moment
    setTimeout(() => { btn.textContent = original; }, 750);
  });
});