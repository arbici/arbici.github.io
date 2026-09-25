// How img/tee-painting.jpg was made (not loaded by the page). Run makeSketch() in the browser on a page
// served from golf/tarjeta/, with img/tee-view.jpg available; it returns the painting as a data URL in
// sketchURL. Figures and tee markers are placed in photo pixels (475 x 318) in paintGolfers().

// The home page picture: the tee photo repainted in the browser as an oil painting. Four golfers and
// a pair of tee markers are drawn onto the photo first; then the whole picture is rebuilt from brush
// strokes, coarse to fine, each laid along the direction of the shapes underneath, with a little
// relief so the paint catches the light. The result is kept on this phone so it is only painted once.
let sketchURL = null, sketching = false;
const PAINT_VERSION = 'paint-v6';
function paintGolfers(x, S) {
  clubs = [];
  // photo pixels (475 x 318) to canvas pixels
  const P = (px, py) => [px * S, py * S];
  const sh = (col, f) => { const n = parseInt(col.slice(1), 16), c = [n >> 16, n >> 8 & 255, n & 255].map(v => Math.max(0, Math.min(255, Math.round(v * f)))); return `rgb(${c})`; };
  const poly = (pts, col) => { x.fillStyle = col; x.beginPath(); pts.forEach(([a, b], i) => i ? x.lineTo(a, b) : x.moveTo(a, b)); x.closePath(); x.fill(); };
  const line = (a, b, c, d, w, col) => { x.strokeStyle = col; x.lineWidth = w; x.lineCap = 'round'; x.beginPath(); x.moveTo(a, b); x.lineTo(c, d); x.stroke(); };
  const disc = (a, b, r, col) => { x.fillStyle = col; x.beginPath(); x.arc(a, b, r, 0, 7); x.fill(); };
  const skin = '#c98f6b';
  const shadow = (fx, fy, w) => { x.fillStyle = 'rgba(25,45,20,.45)'; x.beginPath(); x.ellipse(fx + w * .25, fy + w * .06, w, w * .2, 0, 0, 7); x.fill(); };
  // a man about to watch the drive: standing, turned towards the left, both hands on his driver, head resting on the grass
  const watcher = (fx, fy, h, shirt, pants, cap) => {
    const u = h / 64, X = v => fx + v * u, Y = v => fy - v * u;
    shadow(fx, fy, 11 * u);
    poly([[X(-3.5), Y(33)], [X(-1), Y(33)], [X(-2), Y(1)], [X(-5.5), Y(1)]], sh(pants, .8));       // far leg
    poly([[X(0), Y(33)], [X(4), Y(33)], [X(4.6), Y(1)], [X(1.2), Y(1)]], pants);                  // near leg
    poly([[X(-6.5), Y(1.5)], [X(-1.5), Y(1.5)], [X(-1.5), Y(-.5)], [X(-7), Y(-.5)]], '#2a241f');
    poly([[X(0.5), Y(1.5)], [X(5.5), Y(1.5)], [X(5.5), Y(-.5)], [X(0), Y(-.5)]], '#2a241f');
    poly([[X(-5.5), Y(54)], [X(5.5), Y(54.5)], [X(5), Y(32)], [X(-4.5), Y(32)]], shirt);           // torso
    poly([[X(1.5), Y(54.3)], [X(5.5), Y(54.5)], [X(5), Y(32)], [X(2), Y(32)]], sh(shirt, .78));    // shaded side
    poly([[X(-4.5), Y(34)], [X(5), Y(34)], [X(5), Y(32)], [X(-4.5), Y(32)]], sh(pants, .65));      // belt
    line(X(-4.5), Y(52), X(-7), Y(38), 3.2 * u, sh(shirt, .9)); line(X(-7), Y(38), X(-6), Y(33), 2.6 * u, skin);  // arms to the grip
    line(X(4.5), Y(52), X(-2), Y(40), 3.2 * u, sh(shirt, .8)); line(X(-2), Y(40), X(-5.5), Y(33.5), 2.6 * u, sh(skin, .9));
    disc(X(-5.8), Y(33), 1.9 * u, sh(skin, .95));
    line(X(-1), Y(55), X(-.5), Y(57.5), 2.4 * u, sh(skin, .85));                                    // neck
    disc(X(-.6), Y(61), 3.9 * u, skin); disc(X(1.2), Y(61), 2.6 * u, sh(skin, .82));                // head, lit from the left
    poly([[X(-4.5), Y(62.5)], [X(3.8), Y(62.5)], [X(3.4), Y(65.3)], [X(-4.2), Y(65.3)]], cap);     // cap
    poly([[X(-8), Y(62.2)], [X(-4), Y(62.2)], [X(-4), Y(61.2)], [X(-8), Y(61.4)]], sh(cap, .85));  // brim, facing left
    clubs.push([X(-5.8), Y(33), X(-11), Y(0.5), 1.1 * u, '#4b4943', [-1.6 * u, 0, 2.6 * u, 1.3 * u, 0]]);
  };
  // the golfer at the top of his backswing, side on to the target line (seen a little from behind), facing
  // right with the ball on his right; the target is up the picture and slightly right, and at the top the
  // ball flies along that line (aim: photo direction (150, -51))
  const golfer = (fx, fy, h, shirt, pants, cap) => {
    const u = h / 64, X = v => fx + v * u, Y = v => fy - v * u;
    shadow(fx + 4 * u, fy, 12 * u);
    poly([[X(-6), Y(31)], [X(-1.5), Y(32)], [X(2.5), Y(16)], [X(1.5), Y(1)], [X(-2), Y(1)], [X(-2), Y(16)]], sh(pants, .82));  // trail leg, knee flexed
    poly([[X(-3), Y(31)], [X(1.5), Y(32)], [X(6), Y(17)], [X(5.5), Y(2.5)], [X(2), Y(2.5)], [X(1.5), Y(17)]], pants);          // lead leg, a step further away
    poly([[X(-3), Y(1.5)], [X(3), Y(1.5)], [X(3.5), Y(-.5)], [X(-3), Y(-.5)]], '#2a241f');
    poly([[X(1.5), Y(3)], [X(7.5), Y(3)], [X(8), Y(1)], [X(1.5), Y(1)]], '#2a241f');
    poly([[X(-6.5), Y(33)], [X(0), Y(34)], [X(6.5), Y(52)], [X(-1), Y(54)]], shirt);                 // torso tilted towards the ball
    poly([[X(-2), Y(33.5)], [X(0), Y(34)], [X(6.5), Y(52)], [X(3.5), Y(53)]], sh(shirt, .8));
    poly([[X(-6.5), Y(33)], [X(0), Y(34)], [X(.5), Y(36)], [X(-6), Y(35.5)]], sh(pants, .65));      // belt
    line(X(4), Y(51), X(-3), Y(60), 3.2 * u, sh(shirt, .85)); line(X(-3), Y(60), X(-6), Y(66), 2.6 * u, sh(skin, .9)); // lead arm up
    line(X(1), Y(52), X(-4.5), Y(57), 3.2 * u, shirt); line(X(-4.5), Y(57), X(-6.5), Y(65), 2.6 * u, skin);              // trail arm folded
    disc(X(-6.3), Y(66), 2 * u, skin);                                                                // hands at the top
    line(X(5.5), Y(54), X(6.5), Y(56.5), 2.4 * u, sh(skin, .85));                                    // neck
    disc(X(7.5), Y(59.5), 3.8 * u, skin); disc(X(9), Y(59), 2.4 * u, sh(skin, .85));                 // head, looking down at the ball
    poly([[X(3.6), Y(61)], [X(11), Y(61.5)], [X(10.6), Y(64.2)], [X(4), Y(64)]], cap);
    poly([[X(10.5), Y(61)], [X(14), Y(60)], [X(14), Y(59.2)], [X(10.5), Y(60)]], sh(cap, .85));       // brim towards the ball
    x.fillStyle = '#e8dcc0'; x.fillRect(X(17.6), Y(1.4), .8 * u, 1.8 * u);                           // tee peg, a club length from his feet
    disc(X(18), Y(2.5), 1.25 * u, '#fbfbf6');                                                         // ball
    // club almost vertical at the top, leaning slightly right (photo direction (17, -40))
    const L = 24, dx = .391 * L, dy = .920 * L;
    clubs.push([X(-6.3), Y(66), X(-6.3 + dx), Y(66 + dy), 1.5 * u, '#3a3833', null]);
    clubs.push([X(-6.3), Y(66), X(-6.3 + dx), Y(66 + dy), .7 * u, '#d8d8d0', [1.1 * u, -1.4 * u, 2.9 * u, 1.6 * u, -1.1]]);
  };
  // tee markers
  const marker = (mx, my, r) => {
    x.fillStyle = 'rgba(25,45,20,.45)'; x.beginPath(); x.ellipse(mx + r * .3, my + r * .2, r * 1.4, r * .35, 0, 0, 7); x.fill();
    x.fillStyle = '#e6b710'; x.beginPath(); x.arc(mx, my, r, Math.PI, 0); x.fill();
    x.fillStyle = '#ffe36a'; x.beginPath(); x.arc(mx - r * .35, my - r * .45, r * .35, 0, 7); x.fill();
  };
  // markers where the tee is in use; the golfer tees up between them, just behind their line
  marker(...P(124, 210), 3.9 * S); marker(...P(223, 208.5), 3.9 * S);
  const g = P(162, 213);
  golfer(g[0], g[1], 57 * S, '#f1eee6', '#2e3a52', '#f1eee6');
  // the other three to his right and a little behind him, facing him
  watcher(...P(262, 234), 58 * S, '#2f4a6e', '#8c8474', '#f1eee6');
  watcher(...P(286, 239), 60 * S, '#a7c1d9', '#b19c73', '#27344f');
  watcher(...P(311, 232), 57 * S, '#9a4a45', '#3a3d45', '#f1eee6');
}
let clubs = [];
function paintClubs(x) {
  x.save(); x.lineCap = 'round'; x.shadowColor = 'rgba(0,0,0,.25)'; x.shadowBlur = 1.5;
  for (const [ax, ay, bx, by, w, col, head] of clubs) {
    x.strokeStyle = col; x.lineWidth = w; x.beginPath(); x.moveTo(ax, ay); x.lineTo(bx, by); x.stroke();
    if (head) { x.fillStyle = '#1e1e1c'; x.beginPath(); x.ellipse(bx + head[0], by + head[1], head[2], head[3], head[4], 0, 7); x.fill(); }
  }
  x.restore();
}
function blurred(src, W, H, r) {
  const c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d');
  x.filter = `blur(${r}px)`; x.drawImage(src, 0, 0); return x.getImageData(0, 0, W, H).data;
}
async function makeSketch() {
  if (sketchURL || sketching) return; sketching = true;
  try {
    try { const c = localStorage.getItem(PAINT_VERSION); if (c) { sketchURL = c; const el = document.querySelector('.agh-sketch'); if (el) el.src = c; return; } } catch (e) {}
    const img = new Image(); img.src = 'img/tee-view.jpg'; await img.decode();
    const S = 2, W = img.width * S, H = img.height * S;
    // reference: the photo with the golfers painted in, colours pushed towards the richness of an oil painting
    const ref = document.createElement('canvas'); ref.width = W; ref.height = H;
    const rx = ref.getContext('2d'); rx.imageSmoothingQuality = 'high'; rx.drawImage(img, 0, 0, W, H);
    paintGolfers(rx, S);
    const rd = rx.getImageData(0, 0, W, H);
    for (let i = 0; i < rd.data.length; i += 4) {
      let r = rd.data[i], g = rd.data[i + 1], b = rd.data[i + 2];
      const l = .3 * r + .59 * g + .11 * b;
      r = l + (r - l) * 1.5; g = l + (g - l) * 1.45; b = l + (b - l) * 1.35;
      r = (r - 128) * 1.1 + 134; g = (g - 128) * 1.1 + 128; b = (b - 128) * 1.1 + 118;
      rd.data[i] = r; rd.data[i + 1] = g; rd.data[i + 2] = b;
    }
    rx.putImageData(rd, 0, 0);
    // stroke direction follows the edges: perpendicular to the brightness gradient of a softened copy
    const soft = blurred(ref, W, H, 3), lum = new Float32Array(W * H);
    for (let i = 0; i < W * H; i++) lum[i] = .3 * soft[i * 4] + .59 * soft[i * 4 + 1] + .11 * soft[i * 4 + 2];
    const dir = (px, py) => {
      const i = py * W + px, gx = lum[i + 1] - lum[i - 1], gy = lum[i + W] - lum[i - W];
      return Math.hypot(gx, gy) < 2 ? null : Math.atan2(gy, gx) + Math.PI / 2;
    };
    const out = document.createElement('canvas'); out.width = W; out.height = H;
    const ox = out.getContext('2d'); ox.filter = 'blur(10px)'; ox.drawImage(ref, 0, 0); ox.filter = 'none';
    let seed = 5; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    ox.lineCap = 'round';
    for (const R of [11, 6.5, 3.8, 2.2]) {
      const layer = blurred(ref, W, H, R * .5), cur = ox.getImageData(0, 0, W, H).data, strokes = [];
      for (let gy = 0; gy < H; gy += R) for (let gx = 0; gx < W; gx += R) {
        const px = Math.min(W - 2, Math.max(1, Math.round(gx + rnd() * R))), py = Math.min(H - 2, Math.max(1, Math.round(gy + rnd() * R))), i = (py * W + px) * 4;
        const err = Math.abs(cur[i] - layer[i]) + Math.abs(cur[i + 1] - layer[i + 1]) + Math.abs(cur[i + 2] - layer[i + 2]);
        if (R < 11 && err < 26) continue;
        strokes.push([px, py, i]);
      }
      for (let k = strokes.length - 1; k > 0; k--) { const j = Math.floor(rnd() * (k + 1)); [strokes[k], strokes[j]] = [strokes[j], strokes[k]]; }
      for (const [px, py, i] of strokes) {
        const a = dir(px, py) ?? (rnd() * Math.PI), len = R * (1.4 + rnd() * 1.8), j = () => (rnd() - .5) * 14;
        ox.strokeStyle = `rgb(${layer[i] + j()},${layer[i + 1] + j()},${layer[i + 2] + j()})`;
        ox.globalAlpha = .88; ox.lineWidth = R * (1.1 + rnd() * .5);
        const cx = Math.cos(a) * len / 2, cy = Math.sin(a) * len / 2, bend = (rnd() - .5) * R * .8;
        ox.beginPath(); ox.moveTo(px - cx, py - cy); ox.quadraticCurveTo(px + bend * Math.sin(a), py - bend * Math.cos(a), px + cx, py + cy); ox.stroke();
      }
    }
    ox.globalAlpha = 1;
    paintClubs(ox);
    // relief: light from the top left on the paint's own brightness, plus canvas weave
    const od = ox.getImageData(0, 0, W, H), d = od.data, L = new Float32Array(W * H);
    for (let i = 0; i < W * H; i++) L[i] = .3 * d[i * 4] + .59 * d[i * 4 + 1] + .11 * d[i * 4 + 2];
    for (let py = 1; py < H - 1; py++) for (let px = 1; px < W - 1; px++) {
      const i = py * W + px, relief = (L[i - W - 1] - L[i + W + 1]) * .35, weave = ((px + py) % 4 === 0 ? -5 : 0) + ((px - py + 4000) % 4 === 0 ? -3 : 0);
      for (let k = 0; k < 3; k++) d[i * 4 + k] = d[i * 4 + k] + relief + weave;
    }
    ox.putImageData(od, 0, 0);
    sketchURL = out.toDataURL('image/jpeg', .9);
    try { localStorage.setItem(PAINT_VERSION, sketchURL); } catch (e) {}
    const el = document.querySelector('.agh-sketch'); if (el) el.src = sketchURL;
  } catch (e) { /* the page works without the picture */ }
}

