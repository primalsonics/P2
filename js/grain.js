/* grain.js — lightweight animated film-grain overlay
   Renders noise at a reduced internal resolution and lets the browser
   scale it up, which keeps this smooth even on low-powered machines. */

(function () {
  const canvas = document.getElementById("grain");
  if (!canvas) return;

  const ctx = canvas.getContext("2d", { alpha: true });
  const SCALE = 0.28; // internal resolution relative to viewport (lower = cheaper)
  const FPS = 14; // grain "flicker" rate — film grain doesn't need 60fps

  let w = 0, h = 0;
  let lastFrame = 0;
  let rafId = null;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function resize() {
    w = Math.max(1, Math.floor(window.innerWidth * SCALE));
    h = Math.max(1, Math.floor(window.innerHeight * SCALE));
    canvas.width = w;
    canvas.height = h;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
  }

  function drawNoiseFrame() {
    const imageData = ctx.createImageData(w, h);
    const buffer = imageData.data;
    for (let i = 0; i < buffer.length; i += 4) {
      const shade = Math.random() * 255;
      buffer[i] = shade;
      buffer[i + 1] = shade;
      buffer[i + 2] = shade;
      buffer[i + 3] = 255;
    }
    ctx.putImageData(imageData, 0, 0);
  }

  function loop(timestamp) {
    if (timestamp - lastFrame >= 1000 / FPS) {
      drawNoiseFrame();
      lastFrame = timestamp;
    }
    rafId = requestAnimationFrame(loop);
  }

  resize();
  window.addEventListener("resize", resize);

  if (reduceMotion) {
    // Draw one static grain frame and stop — respects reduced-motion preference.
    drawNoiseFrame();
  } else {
    rafId = requestAnimationFrame(loop);
  }

  // Pause the animation when the tab isn't visible to save CPU/battery.
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    } else if (!document.hidden && !reduceMotion && !rafId) {
      rafId = requestAnimationFrame(loop);
    }
  });
})();
