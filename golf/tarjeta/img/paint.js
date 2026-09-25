// How img/tee-painting.jpg was made (not loaded by the page). Run makeSketch() in the browser on a page
// served from golf/tarjeta/, with img/tee-view.jpg available; it returns the painting as a data URL in
// sketchURL. Figures and tee markers are placed in photo pixels (475 x 318) in paintGolfers().

// The home page picture: the tee photo repainted in the browser as an oil painting. Four golfers and
// a pair of tee markers are drawn onto the photo first; then the whole picture is rebuilt from brush
// strokes, coarse to fine, each laid along the direction of the shapes underneath, with a little
// relief so the paint catches the light. The result is kept on this phone so it is only painted once.
let sketchURL = null, sketching = false;
const PAINT_VERSION = 'paint-v14';
function paintGolfers(x, S) {
  clubs = [];
  // photo pixels (475 x 318) to canvas pixels
  const P = (px, py) => [px * S, py * S];
  const sh = (col, f) => { const n = parseInt(col.slice(1), 16), c = [n >> 16, n >> 8 & 255, n & 255].map(v => Math.max(0, Math.min(255, Math.round(v * f)))); return `rgb(${c})`; };
  const poly = (pts, col) => { x.fillStyle = col; x.beginPath(); pts.forEach(([a, b], i) => i ? x.lineTo(a, b) : x.moveTo(a, b)); x.closePath(); x.fill(); };
  const line = (a, b, c, d, w, col) => { x.strokeStyle = col; x.lineWidth = w; x.lineCap = 'round'; x.beginPath(); x.moveTo(a, b); x.lineTo(c, d); x.stroke(); };
  const disc = (a, b, r, col) => { x.fillStyle = col; x.beginPath(); x.arc(a, b, r, 0, 7); x.fill(); };
  const skin = '#c98f6b', hair = '#4a3426';
  const shadow = (fx, fy, w) => { x.fillStyle = 'rgba(25,45,20,.45)'; x.beginPath(); x.ellipse(fx + w * .25, fy + w * .06, w, w * .2, 0, 0, 7); x.fill(); };
  // a man watching the drive, seen from behind as he looks up after the ball. pose 'cheer': both arms up,
  // driver raised in his right hand. pose 'hold': both hands on
  // his driver in front of him, only its head showing between his feet; pose 'lean': leaning on the
  // driver planted at his right side, left hand on his hip, legs crossed at the ankles
  const watcher = (fx, fy, h, shirt, pants, cap, pose = 'hold') => {
    const u = h / 64, X = v => fx + v * u, Y = v => fy - v * u, lean = pose === 'lean' ? 1.6 : 0;
    shadow(fx + 2 * u, fy, 10 * u);
    if (pose === 'lean') {
      poly([[X(-4.5), Y(33)], [X(0), Y(33)], [X(-1.5), Y(1)], [X(-5), Y(1)]], sh(pants, .82));                  // left leg, standing
      poly([[X(-.5), Y(33)], [X(4), Y(33)], [X(1.5), Y(12)], [X(-5.5), Y(2.5)], [X(-7.5), Y(4)], [X(-1.5), Y(13)]], pants); // right leg crossed over
      poly([[X(-6), Y(1.5)], [X(-.5), Y(1.5)], [X(-.5), Y(-.5)], [X(-6.5), Y(-.5)]], '#2a241f');
      x.save(); x.translate(X(-6.8), Y(2.6)); x.rotate(-.5); x.fillStyle = '#2a241f'; x.beginPath(); x.ellipse(0, 0, 2.8 * u, 1.3 * u, 0, 0, 7); x.fill(); x.restore(); // right foot on its toe
    } else {
      poly([[X(-4.5), Y(33)], [X(-.5), Y(33)], [X(-2), Y(1)], [X(-5.5), Y(1)]], sh(pants, .85));
      poly([[X(.5), Y(33)], [X(4.5), Y(33)], [X(5), Y(1)], [X(1.5), Y(1)]], pants);
      poly([[X(-6.5), Y(1.5)], [X(-1.5), Y(1.5)], [X(-1.5), Y(-.5)], [X(-7), Y(-.5)]], '#2a241f');
      poly([[X(1), Y(1.5)], [X(6), Y(1.5)], [X(6), Y(-.5)], [X(.5), Y(-.5)]], '#2a241f');
      if (pose === 'hold') clubs.push([X(-.2), Y(12), X(-.6), Y(1.2), .9 * u, '#4b4943', [-1.2 * u, 0, 2.2 * u, 1.1 * u, 0]]);   // driver between his feet
    }
    const T = v => X(v + lean);                                                                                  // upper body leans towards the club
    poly([[T(-5.5), Y(54)], [T(5.5), Y(54.3)], [X(5), Y(32)], [X(-4.8), Y(32)]], shirt);                         // back
    poly([[T(1.8), Y(54.2)], [T(5.5), Y(54.3)], [X(5), Y(32)], [X(2), Y(32)]], sh(shirt, .8));
    poly([[X(-4.8), Y(34)], [X(5), Y(34)], [X(5), Y(32)], [X(-4.8), Y(32)]], sh(pants, .6));                    // belt
    if (pose === 'lean') {
      line(T(-5), Y(52), X(-10), Y(43), 3.2 * u, shirt); line(X(-10), Y(43), X(-5), Y(35.5), 2.6 * u, skin);     // hand on the hip
      line(T(5), Y(52), X(8.5), Y(42), 3.2 * u, sh(shirt, .85)); line(X(8.5), Y(42), X(9.5), Y(35), 2.6 * u, skin); // arm down to the grip
      disc(X(9.6), Y(34.5), 1.9 * u, skin);
      clubs.push([X(9.6), Y(34.5), X(11.5), Y(.8), 1.1 * u, '#4b4943', [1.6 * u, 0, 2.6 * u, 1.3 * u, 0]]);    // driver planted at his side
    } else if (pose === 'cheer') {
      // both arms thrown up in a V for the great shot, the driver raised in his right hand
      line(T(-5), Y(52.5), X(-8.5), Y(62), 3.2 * u, shirt); line(X(-8.5), Y(62), X(-11), Y(71), 2.6 * u, skin);
      line(T(5), Y(52.5), X(8.5), Y(62), 3.2 * u, sh(shirt, .85)); line(X(8.5), Y(62), X(11), Y(71), 2.6 * u, sh(skin, .9));
      disc(X(-11.2), Y(71.8), 2 * u, skin); disc(X(11.2), Y(71.8), 2 * u, sh(skin, .95));
      clubs.push([X(11.2), Y(71.8), X(24), Y(88), 1.1 * u, '#4b4943', [1.6 * u, -1.2 * u, 2.6 * u, 1.3 * u, -.9]]);
    } else {
      line(T(-5), Y(52), X(-6), Y(38), 3.2 * u, shirt); line(T(5), Y(52), X(5.5), Y(38), 3.2 * u, sh(shirt, .85));  // arms forward to the grip
    }
    line(T(0), Y(54.5), T(.2), Y(57), 2.6 * u, sh(skin, .85));                                                     // neck
    disc(T(.2), Y(60), 3.8 * u, sh(skin, .9));
    x.fillStyle = hair; x.beginPath(); x.arc(T(.2), Y(60), 3.8 * u, .15, Math.PI - .15); x.fill();               // back of the head
    x.fillStyle = cap; x.beginPath(); x.arc(T(.2), Y(60.8), 4 * u, Math.PI + .1, -.1); x.fill();                 // cap from behind
    x.save(); x.translate(T(-1.2), Y(64.2)); x.rotate(-2.1); x.fillStyle = sh(cap, .85); x.fillRect(0, -.7 * u, 3.2 * u, 1.4 * u); x.restore(); // peak tipped up after the ball
  };
  // the golfer holding his finish, seen from behind: weight on the left foot, right foot up on its toe
  // with the sole showing, hands high over the left shoulder, club across behind his head, head turned
  // up to watch the ball
  const golfer = (fx, fy, h, shirt, pants, cap) => {
    const u = h / 64, X = v => fx + v * u, Y = v => fy - v * u;
    shadow(fx + 2 * u, fy, 11 * u);
    poly([[X(-5.5), Y(32)], [X(-1), Y(32)], [X(-2.5), Y(1)], [X(-6), Y(1)]], pants);                                          // left leg, straight
    // right leg as in the reference: thigh down from the hip, knee turned in towards the left leg, shin
    // running down and out to the right to a foot a little nearer to us, up on its toe
    poly([[X(.2), Y(32)], [X(4.8), Y(32)], [X(2.6), Y(16.5)], [X(9), Y(1.6)], [X(5.8), Y(.2)], [X(-1.4), Y(15)]], sh(pants, .7));
    line(X(-1.2), Y(15.6), X(2.4), Y(16.4), .8 * u, sh(pants, .5));                                                           // crease at the knee
    poly([[X(-7), Y(1.5)], [X(-1.5), Y(1.5)], [X(-1.5), Y(-.5)], [X(-7.5), Y(-.5)]], '#2a241f');                            // left shoe
    x.save(); x.translate(X(7.8), Y(-1.2)); x.rotate(-1.3);                                                                    // right shoe on its toe, sole to us
    x.fillStyle = '#2a241f'; x.beginPath(); x.ellipse(0, 0, 3.1 * u, 1.6 * u, 0, 0, 7); x.fill();
    x.fillStyle = '#6d655c'; x.beginPath(); x.ellipse(.2 * u, .35 * u, 2.4 * u, 1 * u, 0, 0, 7); x.fill(); x.restore();
    poly([[X(-6.5), Y(54)], [X(6), Y(53)], [X(4.8), Y(32)], [X(-5), Y(32)]], shirt);                                          // back, turned to the target
    poly([[X(1.5), Y(53.5)], [X(6), Y(53)], [X(4.8), Y(32)], [X(1.8), Y(32)]], sh(shirt, .8));
    line(X(-1), Y(50), X(0), Y(38), 1 * u, sh(shirt, .7));                                                                     // crease down the back
    poly([[X(-5), Y(34)], [X(4.8), Y(34)], [X(4.8), Y(32)], [X(-5), Y(32)]], sh(pants, .6));                                  // belt
    line(X(-5.5), Y(52), X(-9), Y(58), 3.3 * u, shirt); line(X(-9), Y(57), X(-6.8), Y(61), 2.7 * u, skin);                   // left arm up
    line(X(5), Y(52), X(-1), Y(58.5), 3.3 * u, sh(shirt, .85)); line(X(-1), Y(57.5), X(-5.4), Y(61), 2.7 * u, sh(skin, .9)); // right arm across
    disc(X(-6), Y(61.5), 2.1 * u, skin);                                                                                        // hands, by his left ear
    line(X(.3), Y(54.5), X(.5), Y(57), 2.6 * u, sh(skin, .85));                                                               // neck
    disc(X(.6), Y(60), 3.9 * u, sh(skin, .9));
    x.fillStyle = hair; x.beginPath(); x.arc(X(.6), Y(60), 3.9 * u, .2, Math.PI - .2); x.fill();                             // back of the head
    x.fillStyle = cap; x.beginPath(); x.arc(X(.6), Y(60.8), 4.1 * u, Math.PI + .15, -.35); x.fill();                        // cap from behind
    x.save(); x.translate(X(3.8), Y(63.4)); x.rotate(-.9); x.fillStyle = sh(cap, .85); x.fillRect(0, -.7 * u, 3.6 * u, 1.4 * u); x.restore(); // peak up to the right
    x.fillStyle = '#e8dcc0'; x.fillRect(X(-.4), Y(1.6), .8 * u, 1.8 * u);                                                    // empty tee peg in front
    // club resting across the back of his neck: seen from behind it lies in front of his head, unbroken
    clubs.push([X(-6), Y(61.5), X(26), Y(50.5), 1.5 * u, '#3a3833', null]);
    clubs.push([X(-6), Y(61.5), X(26), Y(50.5), .7 * u, '#d8d8d0', [1.8 * u, 1.2 * u, 3 * u, 1.7 * u, .5]]);
  };
  // tee markers
  const marker = (mx, my, r) => {
    x.fillStyle = 'rgba(25,45,20,.45)'; x.beginPath(); x.ellipse(mx + r * .3, my + r * .2, r * 1.4, r * .35, 0, 0, 7); x.fill();
    x.fillStyle = '#e6b710'; x.beginPath(); x.arc(mx, my, r, Math.PI, 0); x.fill();
    x.fillStyle = '#ffe36a'; x.beginPath(); x.arc(mx - r * .35, my - r * .45, r * .35, 0, 7); x.fill();
  };
  // markers where the tee is in use; the golfer tees up between them, just behind their line
  marker(...P(124, 210), 3.9 * S); marker(...P(223, 208.5), 3.9 * S);
  const g = P(172, 213);
  golfer(g[0], g[1], 57 * S, '#f1eee6', '#2e3a52', '#2f5a3a');
  ballInAir = P(265, 57);
  // the other three to his right and a little behind him, backs to us, watching the ball
  watcher(...P(262, 234), 58 * S, '#2f4a6e', '#8c8474', '#6b2e2b', 'cheer');
  watcher(...P(286, 239), 60 * S, '#a7c1d9', '#b19c73', '#27344f');
  watcher(...P(311, 232), 57 * S, '#9a4a45', '#3a3d45', '#3a3d45', 'lean');
}
let clubs = [];
function paintClubs(x) {
  x.save(); x.lineCap = 'round'; x.shadowColor = 'rgba(0,0,0,.25)'; x.shadowBlur = 1.5;
  for (const [ax, ay, bx, by, w, col, head] of clubs) {
    x.strokeStyle = col; x.lineWidth = w; x.beginPath(); x.moveTo(ax, ay); x.lineTo(bx, by); x.stroke();
    if (head) { x.fillStyle = '#1e1e1c'; x.beginPath(); x.ellipse(bx + head[0], by + head[1], head[2], head[3], head[4], 0, 7); x.fill(); }
  }
  if (ballInAir) {
    const [bx, by] = ballInAir;
    x.strokeStyle = 'rgba(255,255,255,.55)'; x.lineWidth = 1.4; x.shadowBlur = 0;
    x.beginPath(); x.moveTo(bx - 26, by + 40); x.quadraticCurveTo(bx - 10, by + 8, bx - 3, by + 3); x.stroke();   // faint trail
    x.fillStyle = '#ffffff'; x.shadowColor = 'rgba(0,0,0,.35)'; x.shadowBlur = 2;
    x.beginPath(); x.arc(bx, by, 3.4, 0, 7); x.fill();
  }
  x.restore();
}
let ballInAir = null;
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

