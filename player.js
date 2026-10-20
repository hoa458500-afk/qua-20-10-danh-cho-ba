(() => {
  'use strict';
  const timeline = window.GiftTimeline, $ = id => document.getElementById(id);
  const gift = $('gift'), frame = $('scene-frame'), zone = $('scene-zone');
  const audio = $('music'), start = $('start'), sound = $('sound'), fullscreen = $('fullscreen');
  const state = {ready:false,started:false,wantsSound:true,pendingStart:false,elapsed:0,last:0,lastMessage:0,lastSent:0,lastScene:'intro',resumeAudio:false,run:0,fuelReady:false,fuelStarted:false,clockMode:'waiting',playRequest:0,audioWaitSince:0,audioProgressAt:0,lastAudioTime:0};
  const appleMobile = /iPad|iPhone|iPod/.test(navigator.userAgent)
    || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  let loadTimer = 0, sceneLoading = false, loadFailed = false, ticking = false;
  function loadingFallback() {
    if (state.ready || !sceneLoading) return;
    sceneLoading = false;loadFailed = true;
    $('loading').textContent = 'Mở món quà hơi lâu. Bấm nút bên dưới để thử lại nhé ♡';
    start.disabled = false;
    start.innerHTML = 'Tải lại món quà <span aria-hidden="true">♡</span>';
  }
  function startWatchdog() {
    clearTimeout(loadTimer);
    loadTimer = setTimeout(loadingFallback, 9000);
  }
  function loadScene() {
    sceneLoading = true;loadFailed = false;
    gift.classList.remove('entrance');start.disabled = true;
    start.innerHTML = 'Đang mở món quà…';$('loading').textContent = 'Đang mở món quà…';
    frame.src = `experience.html?v=20&run=${state.run}${appleMobile?'&tinyfx=safe':''}`;
    startWatchdog();
  }
  const origin = location.origin, targetOrigin = origin === 'null' ? '*' : origin;
  function send(message) {if(state.ready)frame.contentWindow.postMessage(message,targetOrigin);}
  function interactive(enabled) {
    gift.classList.toggle('interactive',enabled);
    frame.setAttribute('aria-hidden',String(!enabled));frame.setAttribute('tabindex',enabled?'0':'-1');
  }
  function fit() {const box = zone.getBoundingClientRect();const scale = Math.min(box.width/1536,box.height/784);frame.style.setProperty('--scene-scale',String(Math.max(.01,scale)));}
  function audioUI() {
    const on = !audio.paused && !audio.muted && !audio.ended;gift.classList.toggle('playing',on);
    sound.setAttribute('aria-pressed',String(on));sound.setAttribute('aria-label',on?'Tắt âm thanh':'Bật âm thanh');sound.title=on?'Tắt âm thanh':'Bật âm thanh';
  }
  async function playAudio() {
    const request=++state.playRequest;
    if(state.clockMode==='silent'&&!state.fuelStarted&&state.elapsed<timeline.fuelAt)audio.currentTime=state.elapsed;
    audio.muted=false;audio.volume=1;
    try {await audio.play();if(request!==state.playRequest)return;state.wantsSound=true;if(state.clockMode==='waiting')state.clockMode='audio';}
    catch (_) {if(request!==state.playRequest)return;state.clockMode='silent';$('status').textContent='Chạm nút nhạc để bật âm thanh.';}
    audioUI();
  }
  function primeAudio() {
    const request=++state.playRequest;
    audio.muted=true;
    audio.play().then(()=>{
      if(request!==state.playRequest||state.started)return;
      audio.pause();audio.currentTime=0;audioUI();
    },()=>{});
  }
  function begin() {
    if(!state.ready){
      state.pendingStart=true;
      if(!sceneLoading){
        // Unlock audio in the tap, before the iframe's asynchronous handshake.
        if(state.wantsSound)primeAudio();
        loadScene();
      }
      return;
    }
    state.started=true;state.pendingStart=false;state.elapsed=0;state.last=performance.now();state.lastMessage=0;state.lastSent=0;state.lastScene='intro';state.fuelReady=false;state.fuelStarted=false;
    state.clockMode=state.wantsSound?'waiting':'silent';
    state.audioWaitSince=performance.now();state.audioProgressAt=state.audioWaitSince;state.lastAudioTime=0;
    interactive(false);$('wish').textContent=timeline.scenes[0].text;
    gift.classList.add('started');audio.currentTime=0;audio.muted=!state.wantsSound;
    if(state.wantsSound)void playAudio();send({type:'gift-clock',elapsed:0});
    if(!ticking){ticking=true;requestAnimationFrame(tick);}
  }
  function replay() {
    ++state.playRequest;audio.pause();audio.currentTime=0;state.ready=false;state.started=false;state.pendingStart=true;state.elapsed=0;
    state.fuelReady=false;state.fuelStarted=false;interactive(false);
    gift.classList.remove('ready','started');++state.run;
    if(state.wantsSound)primeAudio();loadScene();audioUI();
  }
  window.addEventListener('message',event=>{
    if(event.source!==frame.contentWindow||event.origin!==origin)return;
    const data=event.data;if(!data||typeof data!=='object')return;
    if(data.type==='gift-ready'&&data.run===state.run){
      sceneLoading=false;loadFailed=false;
      const first=!state.ready;state.ready=true;clearTimeout(loadTimer);gift.classList.add('ready');start.disabled=false;start.innerHTML='Chạm để bắt đầu <span aria-hidden="true">♡</span>';fit();
      if(first&&state.pendingStart)begin();
    }
    if(data.type==='gift-fuel-ready'&&state.started&&!state.fuelStarted){
      state.fuelReady=true;interactive(true);$('status').textContent='Chạm Nạp năng lượng để máy bay cất cánh.';
    }
    if(data.type==='gift-fuel-start'&&state.started&&state.fuelReady&&!state.fuelStarted){
      state.fuelStarted=true;state.elapsed=Math.max(state.elapsed,timeline.fuelAt);state.last=performance.now();
      interactive(false);send({type:'gift-clock',elapsed:state.elapsed});$('status').textContent='Đang nạp năng lượng cho máy bay…';
    }
    if(data.type==='gift-interactive')interactive(!!data.enabled);
    if(data.type==='gift-replay'){replay();return;}
    if(data.type==='gift-letter-open')$('status').textContent='Lá thư đã mở. Bà có thể cuộn để đọc hết lời chúc.';
    if(data.type==='gift-error'){$('loading').textContent=data.message;$('status').textContent=data.message;}
  });
  frame.addEventListener('load',()=>{if(!sceneLoading)return;frame.contentWindow.postMessage({type:'gift-hello'},targetOrigin);startWatchdog();});
  frame.addEventListener('error',loadingFallback);
  function tick(now) {
    requestAnimationFrame(tick);const delta=state.last?Math.min((now-state.last)/1000,.2):0;state.last=now;
    if(document.hidden||!state.started||!state.ready)return;
    // Before the fuel stop, the recording drives every cue, including its intro
    // music change. Waiting and the recipient's click never seek the soundtrack.
    const limit=state.fuelStarted?timeline.duration:timeline.fuelAt;
    if(state.elapsed<limit){
      if(state.clockMode==='waiting' && now-state.audioWaitSince>4500){
        // On iOS a media play() promise can remain pending while buffering.
        state.clockMode='silent';
        $('status').textContent='Nhạc tải chậm; câu chuyện vẫn tiếp tục. Có thể bấm nút loa để bật nhạc.';
      }
      if(state.clockMode==='audio' && !audio.seeking && Number.isFinite(audio.currentTime)){
        if(audio.currentTime>state.lastAudioTime+.025){state.lastAudioTime=audio.currentTime;state.audioProgressAt=now;}
        else if(now-state.audioProgressAt>4500 && !document.hidden){
          state.clockMode='silent';
          $('status').textContent='Nhạc tạm ngừng; câu chuyện vẫn tiếp tục.';
        }
      }
      if(state.fuelStarted||state.clockMode==='silent')state.elapsed=Math.min(limit,state.elapsed+delta);
      else if(state.clockMode==='audio'&&!audio.seeking&&Number.isFinite(audio.currentTime))state.elapsed=Math.min(limit,Math.max(state.elapsed,audio.currentTime));
    }
    // Keep a 60 Hz clock without losing every other frame on 75/90 Hz displays.
    // Do no frame work while the story or soundtrack is waiting.
    const interval=1000/60, since=now-state.lastMessage;
    if(since>=interval-.01&&Math.abs(state.elapsed-state.lastSent)>.0001){
      state.lastMessage+=Math.floor((since+.01)/interval)*interval;state.lastSent=state.elapsed;send({type:'gift-clock',elapsed:state.elapsed});
      const scene=timeline.sceneAt(state.elapsed);if(scene.id!==state.lastScene){state.lastScene=scene.id;$('wish').textContent=scene.text;}
    }
  }
  function requestStart(){if(loadFailed){replay();return;}begin();}
  start.addEventListener('click',requestStart);zone.addEventListener('click',()=>{if(!state.started)requestStart();});$('replay').addEventListener('click',replay);
  sound.addEventListener('click',async()=>{
    if(!state.started){state.wantsSound=true;begin();return;}
    if(!audio.paused&&!audio.muted&&!audio.ended){state.wantsSound=false;audio.muted=true;audioUI();return;}
    await playAudio();
  });
  const root=document.documentElement;if(!root.requestFullscreen&&!root.webkitRequestFullscreen)fullscreen.hidden=true;
  fullscreen.addEventListener('click',async()=>{
    try {
      if(document.fullscreenElement){await document.exitFullscreen();if(screen.orientation&&screen.orientation.unlock)screen.orientation.unlock();}
      else {if(root.requestFullscreen)await root.requestFullscreen();else root.webkitRequestFullscreen();if(screen.orientation&&screen.orientation.lock)screen.orientation.lock('landscape').catch(()=>{});}
    } catch (_) {$('status').textContent='Bà có thể xoay ngang điện thoại để xem trọn khung hình.';}
    fit();
  });
  document.addEventListener('fullscreenchange',()=>{fullscreen.setAttribute('aria-label',document.fullscreenElement?'Thoát toàn màn hình':'Toàn màn hình');fit();});
  document.addEventListener('visibilitychange',()=>{
    send({type:'gift-visibility',hidden:document.hidden});
    if(document.hidden){state.resumeAudio=!audio.paused&&!audio.ended;if(state.resumeAudio)audio.pause();}
    else {state.last=performance.now();if(state.resumeAudio)audio.play().catch(()=>audioUI());}audioUI();
  });
  for(const event of ['play','pause','ended','volumechange'])audio.addEventListener(event,audioUI);
  audio.addEventListener('error',()=>{state.clockMode='silent';$('status').textContent='Không tải được nhạc; hoạt ảnh vẫn tiếp tục.';audioUI();});
  window.addEventListener('resize',fit,{passive:true});fit();audioUI();
})();
