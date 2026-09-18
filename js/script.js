(function(){

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------------- welcome media ----------------
  // just a placeholder fo now.
  // swap for a real <video>/embed once footage exists.
  var mediaBtn = document.querySelector('.media-frame');
  if(mediaBtn){
    mediaBtn.addEventListener('click', function(){
      document.getElementById('connect').scrollIntoView({behavior: reduceMotion ? 'auto' : 'smooth'});
    });
  }

  // ---------------- embers ----------------
  var emberCanvas = document.getElementById('ember-canvas');
  var ectx = emberCanvas.getContext('2d');
  var EW, EH;

  function resizeEmber(){
    EW = emberCanvas.width = window.innerWidth;
    EH = emberCanvas.height = document.documentElement.scrollHeight;
  }
  resizeEmber();
  window.addEventListener('resize', resizeEmber);
  window.addEventListener('load', resizeEmber);

  var embers = [];
  var COUNT = window.innerWidth < 700 ? 14 : 26;

  function spawnEmber(randomY){
    return {
      x: Math.random()*EW,
      y: randomY ? Math.random()*EH : EH + 10,
      vy: -(0.2 + Math.random()*0.45),
      vx: (Math.random()-0.5) * 0.2,
      size: Math.random() < 0.8 ? 2 : 3,
      seed: Math.random()*Math.PI*2
    };
  }
  for(var k=0;k<COUNT;k++){ embers.push(spawnEmber(true)); }

  function emberFrame(){
    ectx.clearRect(0,0,EW,EH);
    for(var j=0;j<embers.length;j++){
      var em = embers[j];
      em.seed += 0.05;
      em.x += em.vx + Math.sin(em.seed)*0.08;
      em.y += em.vy;
      if(em.y < -10){ embers[j] = spawnEmber(false); continue; }
      var flick = 0.55 + 0.45*Math.sin(em.seed*2.3);
      ectx.fillStyle = 'rgba(255,' + (140+Math.floor(60*flick)) + ',40,' + (0.5+0.4*flick) + ')';
      ectx.fillRect(Math.round(em.x), Math.round(em.y), em.size, em.size);
    }
    requestAnimationFrame(emberFrame);
  }
  if(!reduceMotion){ requestAnimationFrame(emberFrame); }

})();