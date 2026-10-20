/* The same Tiny, clover, aircraft and moon renderer continue after v7. */
(() => {
  'use strict';
  const timeline = window.GiftTimeline;
  const stage = document.getElementById('gift-letter-stage');
  const card = document.getElementById('gift-letter-card');
  const open = document.getElementById('open-letter');
  const body = document.getElementById('gift-letter-body');
  const flight = document.getElementById('share-flight-scene');
  const fuelButton = document.getElementById('share-fuel-button');
  const flightAt = timeline.scenes.find(scene => scene.id === 'flight').at;
  const origin = location.origin === 'null' ? '*' : location.origin;
  const send = message => parent.postMessage(message, origin);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let shown = false, opened = false, hidden = false, fuelReady = false, fuelRequested = false;
  let letterPrepared = false;
  const warmJobs = new Set();
  let pausedAnimations = [];

  function prepareLetter() {
    if (letterPrepared) return;
    letterPrepared = true;
    const florals = document.getElementById('gift-letter-florals');
    document.querySelectorAll('#beauty-stage .wish-floral').forEach(source => florals.appendChild(source.cloneNode(true)));
  }
  function idleOnce(key, task, delay = 0) {
    if (warmJobs.has(key)) return;
    warmJobs.add(key);
    setTimeout(() => {
      const run = () => {if (!hidden) task();else warmJobs.delete(key);};
      if (typeof requestIdleCallback === 'function') requestIdleCallback(run,{timeout:1800});
      else setTimeout(run,120);
    },delay);
  }
  function prepareScene(id) {
    if (id === 'intro') idleOnce('images', () => {
      if (typeof Image !== 'function') return;
      const health=(window.TINY_PERF && window.TINY_PERF.mobile)?'assets/health-mobile.webp':'assets/health.webp';
      const files=['assets/ao-dai.png',health,'assets/waguri-poster.png','assets/bouquet.svg'];
      files.forEach((src,index) => setTimeout(() => {
        const image=new Image();image.src=src;
        if (typeof image.decode === 'function') image.decode().catch(() => {});
      },index*250));
    },800);
    if (id === 'clover') idleOnce('luck', () => {
      if (typeof taoCanhMayManMotLan === 'function') taoCanhMayManMotLan();
      if (typeof luckCanvasLeaves !== 'undefined') luckCanvasLeaves.prepare();
    },1400);
    if (id === 'ready' || id === 'flight') idleOnce('letter',prepareLetter,1400);
  }

  // A bounded, deterministic pool. No particle creation during letter reading.
  let seed = 2010;
  const random = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
  const stars = document.getElementById('gift-letter-stars');
  for (let i = 0; i < 64; i++) {
    const star = document.createElement('i');
    star.className = i % 11 === 0 ? 'letter-star is-cross' : 'letter-star';
    star.style.cssText = `--x:${(random()*100).toFixed(2)}%;--y:${(random()*100).toFixed(2)}%;--s:${(1.4+random()*3.7).toFixed(2)}px;--d:${(2.4+random()*3).toFixed(2)}s;--delay:${(-random()*6).toFixed(2)}s`;
    stars.appendChild(star);
  }
  const petals = document.getElementById('gift-letter-petals');
  for (let i = 0; i < 9; i++) {
    const petal = document.createElement('i');
    petal.className = 'letter-petal';
    petal.style.cssText = `--x:${(random()*100).toFixed(2)}%;--d:${(9+random()*7).toFixed(2)}s;--delay:${(-random()*16).toFixed(2)}s;--drift:${(-8+random()*16).toFixed(2)}vw`;
    petals.appendChild(petal);
  }

  function showLetter() {
    if (shown) return;
    shown = true;
    activeWish = 'letter';
    ngatChopMat();
    const previous = khungMat.getBoundingClientRect();
    prepareLetter();
    khungMat.className = '';
    khungMat.removeAttribute('style');
    khungMat.querySelectorAll('.reality-one-piece-svg,.tiny-folding-smile-svg,.tiny-restored-caret,.tiny-morph-svg,.mat-hinh').forEach(el => el.remove());
    trucXElements.forEach(host => {
      host.classList.remove('reference-wink-active','clover-x-active','clover-opening-eye');
      host.removeAttribute('style');
    });
    matElements.forEach(eye => {
      eye.className = 'con-mat thuc';
      eye.removeAttribute('style');
    });
    document.getElementById('gift-letter-eyes').appendChild(khungMat);
    stage.classList.add('is-visible');
    stage.setAttribute('aria-hidden','false');
    stage.inert = false;
    for (const element of document.body.children) {
      if (element !== stage && !['SCRIPT','STYLE'].includes(element.tagName)) {
        element.setAttribute('aria-hidden','true');
        element.inert = true;
      }
    }
    document.body.classList.add('letter-finale-active');
    const moon = document.getElementById('tiny-reality-scene');
    moon.classList.add('reality-to-letter');
    const next = khungMat.getBoundingClientRect();
    if (!reduced && typeof khungMat.animate === 'function') {
      khungMat.animate([
        {transform:`translate(${previous.left+previous.width/2-next.left-next.width/2}px,${previous.top+previous.height/2-next.top-next.height/2}px) scale(${previous.width/Math.max(1,next.width)})`},
        {transform:'translate(0,0) scale(1)'}
      ], {duration:1200,easing:'cubic-bezier(.2,.8,.2,1)'});
    }
    // Stop the old rover loop once the crossfade finishes.
    setTimeout(() => moon.classList.remove('reality-visible','reality-cute'), 1400);
    send({type:'gift-interactive',enabled:true});
  }

  open.addEventListener('click', () => {
    if (opened) return;
    opened = true;
    const previousHeight = card.getBoundingClientRect().height;
    card.classList.add('is-open');
    body.hidden = false;
    open.setAttribute('aria-expanded','true');
    document.getElementById('gift-letter-intro').hidden = true;
    open.hidden = true;
    card.scrollTop = 0;
    if (!reduced && typeof card.animate === 'function') {
      const nextHeight = card.getBoundingClientRect().height;
      card.animate([{height:`${previousHeight}px`},{height:`${nextHeight}px`}],{duration:650,easing:'cubic-bezier(.22,.61,.36,1)'});
      if (typeof body.animate === 'function') body.animate([{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:550,easing:'ease-out'});
    }
    card.focus({preventScroll:true});
    send({type:'gift-letter-open'});
  });
  document.getElementById('letter-replay').addEventListener('click', () => send({type:'gift-replay'}));

  fuelButton.addEventListener('click', event => {
    event.stopPropagation();
    if (!fuelReady || fuelRequested || hidden || activeWish !== 'share') return;
    fuelRequested = true;
    fuelButton.disabled = true;
    flight.classList.remove('fuel-awaiting');
    pumpWishFuel(0);
    send({type:'gift-fuel-start'});
  });

  function prepareFuel() {
    if (fuelReady) return;
    fuelReady = true;
    fuelButton.disabled = false;
    fuelButton.setAttribute('tabindex','0');
    flight.classList.add('fuel-awaiting');
    flight.inert = false;
    flight.setAttribute('aria-hidden','false');
    for (const element of document.body.children) {
      if (element !== flight && !['SCRIPT','STYLE'].includes(element.tagName)) {
        element.setAttribute('aria-hidden','true');element.inert = true;
      }
    }
    document.getElementById('share-flight-status').textContent='Bà bấm Nạp năng lượng để gửi điều ước nha ♡';
    send({type:'gift-fuel-ready'});
  }

  function sync(seconds) {
    if (hidden) return;
    if (seconds >= flightAt && !shown) prepareFuel();
    if (!fuelRequested) return;
    if (seconds >= timeline.fuelAt && seconds < timeline.fuelAt + timeline.fuelDuration) {
      pumpWishFuel((seconds - timeline.fuelAt) / timeline.fuelDuration);
    } else if (seconds >= timeline.fuelAt + timeline.fuelDuration && !shown) {
      pumpWishFuel(1);
    }
  }
  function setHidden(value) {
    hidden = value;
    if (value) {
      pausedAnimations = typeof document.getAnimations === 'function'
        ? document.getAnimations().filter(animation => animation.playState === 'running') : [];
      pausedAnimations.forEach(animation => animation.pause());
    } else {
      pausedAnimations.forEach(animation => {if (animation.playState === 'paused') animation.play();});
      pausedAnimations = [];
    }
  }
  window.GiftContinuation = {showLetter, sync, setHidden, prepareScene,
    limitTime: seconds => fuelRequested ? seconds : Math.min(seconds,timeline.fuelAt)};
})();
