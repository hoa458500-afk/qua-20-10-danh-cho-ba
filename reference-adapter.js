/* Preserve the reference's native Tiny scenes and artwork. The host supplies
   the story clock, audio, replay and accessible controls. */
(() => {
  'use strict';
  const origin = location.origin, targetOrigin = origin === 'null' ? '*' : origin, timeline = window.GiftTimeline;
  let currentScene = 0, initialized = false;
  const send = message => parent.postMessage(message, targetOrigin);
  const bouquet = document.getElementById('final-bouquet');
  const smileIndex = timeline.scenes.findIndex(scene => scene.id === 'smile');
  const flightIndex = timeline.scenes.findIndex(scene => scene.id === 'flight');
  const bouquetStartsAt = timeline.scenes.find(scene => scene.id === 'smile').at + .8;
  const reducedMotion = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  function syncBouquet(seconds) {
    if (!bouquet) return;
    const visible = currentScene === smileIndex && seconds >= bouquetStartsAt;
    bouquet.classList.toggle('is-visible', visible);
    if (!visible) {bouquet.classList.remove('is-arrived');return;}
    const progress = reducedMotion ? 1 : Math.min(1, (seconds - bouquetStartsAt) / 9);
    const eased = progress * progress * (3 - 2 * progress);
    const sway = Math.sin(Math.PI * progress);
    const x = 8 + 42 * eased + 2.5 * Math.sin(3 * Math.PI * progress) * sway;
    const y = -20 + 68 * eased + 1.6 * Math.sin(4 * Math.PI * progress) * sway;
    const tilt = -18 * (1 - eased) + 6 * Math.sin(4 * Math.PI * progress) * sway;
    bouquet.style.transform = `translate3d(${x.toFixed(4)}vw, ${y.toFixed(4)}vh, 0) translate(-50%, -50%) rotate(${tilt.toFixed(4)}deg)`;
    bouquet.classList.toggle('is-arrived', progress === 1);
  }
  function prepareIntro() {
    document.documentElement.classList.add('gift-smooth');
    tinySoundtrack.pause();tinySoundtrack.muted = true;
    musicAllowedPastGate = true;musicGateClosed = false;
    if (lyricInterval !== null) {clearInterval(lyricInterval);lyricInterval = null;}
    if (musicFadeTimer !== null) {clearInterval(musicFadeTimer);musicFadeTimer = null;}
    document.querySelectorAll('.text-layer').forEach(el => el.classList.remove('hien-thi'));
    text1.classList.add('hien-thi');clickCount = 0;canClick = true;activeWish = '';
    matElements.forEach(eye => eye.classList.remove('thuc'));
    dungLiec(false);
    window.GiftContinuation.prepareScene?.('intro');
  }
  function sync(seconds) {
    seconds = window.GiftContinuation.limitTime(seconds);
    const target = timeline.scenes.indexOf(timeline.sceneAt(seconds));
    while (currentScene < target) {
      if (currentScene < flightIndex) {canClick = true;clickCount = currentScene;chuyenCanh();}
      else if (currentScene === flightIndex) {pumpWishFuel(1);beginTinyRealityScene();}
      else if (currentScene === flightIndex + 1) window.GiftContinuation.showLetter();
      currentScene++;
      if (typeof budgetSceneTransition === 'function') budgetSceneTransition(1200);
      window.GiftContinuation.prepareScene?.(timeline.scenes[currentScene].id);
    }
    syncBouquet(seconds);
    window.GiftContinuation.sync(seconds);
  }
  window.addEventListener('message', event => {
    if (event.source !== parent || event.origin !== origin) return;
    const data = event.data;if (!data || typeof data !== 'object') return;
    if (data.type === 'gift-hello' && initialized) send({type:'gift-ready'});
    if (data.type === 'gift-clock' && Number.isFinite(data.elapsed))sync(Math.max(0,Math.min(timeline.duration,data.elapsed)));
    if (data.type === 'gift-visibility') {
      document.documentElement.classList.toggle('host-page-hidden',!!data.hidden);
      window.GiftContinuation.setHidden(!!data.hidden);
      const video = document.getElementById('waguri-smile-video');
      if (video && currentScene === smileIndex) {if (data.hidden)video.pause();else video.play().catch(() => {});}
    }
  });
  try {
    prepareIntro();
    initialized = true;
    // iOS Safari sometimes delays font loading. The scene can start with a fallback font.
    send({type:'gift-ready'});
    if (document.fonts && document.fonts.ready) {
      Promise.resolve(document.fonts.ready).then(() => send({type:'gift-ready'}), () => {});
    }
  } catch (error) {
    send({type:'gift-error',message:'Không mở được cảnh hoạt ảnh. Bà hãy tải lại trang nhé.'});
    console.error('Reference scene initialization failed:',error);
  }
})();
