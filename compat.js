/* Small fallbacks for the DOM and animation calls used by this gift. */
(function () {
  'use strict';
  if (!Element.prototype.replaceChildren) {
    Element.prototype.replaceChildren = function () {
      while (this.firstChild) this.removeChild(this.firstChild);
      for (var i = 0; i < arguments.length; i++) this.appendChild(arguments[i]);
    };
  }
  window.giftAnimate = function (element, frames, options) {
    if (typeof element.animate === 'function') return element.animate(frames, options);
    var end = frames[frames.length - 1], timer = 0, cancelled = false;
    var animation = {onfinish: null, cancel: function () {
      cancelled = true;clearTimeout(timer);
    }};
    // Older Safari can still reach every scene without Web Animations support.
    Object.keys(end).forEach(function (key) {
      if (key !== 'offset' && key !== 'easing') element.style[key] = end[key];
    });
    timer = setTimeout(function () {
      if (!cancelled && typeof animation.onfinish === 'function') animation.onfinish();
    }, Math.max(0, Number(options.duration) || 0));
    return animation;
  };
}());
