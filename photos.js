/* =====================================================================
   photos.js — offline "photographic" scene renderer
   Draws plausible village-asset photographs to a canvas so the app looks
   like a real product without shipping binary assets or hitting a CDN.
   ===================================================================== */
(function (global) {
  'use strict';

  function hashStr(s) {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function rng(seed) {
    let s = (seed >>> 0) || 1;
    return function () {
      s ^= s << 13; s >>>= 0;
      s ^= s >> 17;
      s ^= s << 5; s >>>= 0;
      return s / 4294967296;
    };
  }
  const lerp = (a, b, t) => a + (b - a) * t;
  const mix = (c1, c2, t) => {
    const p = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
    const a = p(c1), b = p(c2);
    return 'rgb(' + Math.round(lerp(a[0], b[0], t)) + ',' + Math.round(lerp(a[1], b[1], t)) + ',' + Math.round(lerp(a[2], b[2], t)) + ')';
  };

  /* Scene palettes: sky top/bottom, ground far/near, structure wall/roof */
  const P = {
    water:      { sky: ['#9dc6e4', '#e6f1f6'], far: '#8fa78f', ground: ['#9a8f6c', '#6f6647'], wall: '#d8cdb6', roof: '#6d5c49', accent: '#2f6f96' },
    school:     { sky: ['#8fbde4', '#f2ead3'], far: '#94a68c', ground: ['#a89b74', '#7b6f4c'], wall: '#e7dcc4', roof: '#a05a3c', accent: '#c2452f' },
    health:     { sky: ['#a9cde8', '#eef4f7'], far: '#9db094', ground: ['#9aa08c', '#6d7364'], wall: '#eceae2', roof: '#5d6b74', accent: '#c0392b' },
    road:       { sky: ['#93bfe6', '#e9f0f6'], far: '#8ba082', ground: ['#8d8d88', '#4f5050'], wall: '#c9c4b8', roof: '#6b6459', accent: '#f0c04a' },
    shelter:    { sky: ['#a4c8e6', '#f3ecd9'], far: '#93a88a', ground: ['#a2906a', '#6f6244'], wall: '#e3d7bd', roof: '#7c5f45', accent: '#2f7a4d' },
    worship:    { sky: ['#b5cbe8', '#f6ecdd'], far: '#9fae8d', ground: ['#a69572', '#72674b'], wall: '#efe4d0', roof: '#9a6b52', accent: '#d9a441' },
    market:     { sky: ['#9ec4e0', '#f1e8d6'], far: '#9aa88a', ground: ['#a79373', '#75664a'], wall: '#e6d5bb', roof: '#9c5f3f', accent: '#c4462f' },
    farm:       { sky: ['#8fbde8', '#eaf2f7'], far: '#8fa684', ground: ['#93a45e', '#5e6f3b'], wall: '#d6cdb4', roof: '#7d6b4d', accent: '#7a8f3c' },
    power:      { sky: ['#9cc3e6', '#e9f1f6'], far: '#95a78d', ground: ['#98917b', '#635c48'], wall: '#cfc9ba', roof: '#707a82', accent: '#d9d9d9' },
    sanitation: { sky: ['#a8cbe6', '#eff3f4'], far: '#9cad90', ground: ['#a0967a', '#6d6450'], wall: '#dfd6c2', roof: '#8c7b62', accent: '#3d8f77' },
    waste:      { sky: ['#a3c7e3', '#eef2f2'], far: '#9aac8d', ground: ['#97917c', '#615c4c'], wall: '#d8d2c4', roof: '#7c8378', accent: '#3f8f4f' }
  };

  function sky(x, W, H, p, r, opts) {
    const g = x.createLinearGradient(0, 0, 0, H * 0.72);
    g.addColorStop(0, p.sky[0]);
    g.addColorStop(0.55, mix(p.sky[0], p.sky[1], 0.45));
    g.addColorStop(1, p.sky[1]);
    x.fillStyle = g;
    x.fillRect(0, 0, W, H);

    /* sun + bloom */
    const sx = W * (0.15 + r() * 0.7), sy = H * (0.08 + r() * 0.22);
    const bloom = x.createRadialGradient(sx, sy, 0, sx, sy, W * 0.62);
    bloom.addColorStop(0, 'rgba(255,252,235,' + (opts.dark ? 0.18 : 0.85) + ')');
    bloom.addColorStop(0.12, 'rgba(255,248,220,' + (opts.dark ? 0.10 : 0.42) + ')');
    bloom.addColorStop(0.4, 'rgba(255,246,214,' + (opts.dark ? 0.04 : 0.16) + ')');
    bloom.addColorStop(1, 'rgba(255,248,220,0)');
    x.fillStyle = bloom;
    x.fillRect(0, 0, W, H);

    /* soft clouds (layered, blurred) */
    const cl = document.createElement('canvas');
    cl.width = W; cl.height = H;
    const c2 = cl.getContext('2d');
    for (let i = 0; i < 5 + Math.floor(r() * 4); i++) {
      const cx = r() * W, cy = H * (0.04 + r() * 0.3);
      const cw = W * (0.14 + r() * 0.24), ch = H * (0.015 + r() * 0.03);
      c2.globalAlpha = 0.35 + r() * 0.4;
      c2.fillStyle = '#ffffff';
      c2.beginPath();
      c2.ellipse(cx, cy, cw, ch, 0, 0, Math.PI * 2);
      c2.ellipse(cx + cw * 0.35, cy + ch * 0.4, cw * 0.6, ch * 0.7, 0, 0, Math.PI * 2);
      c2.fill();
    }
    x.save();
    x.globalAlpha = opts.dark ? 0.10 : 0.55;
    x.filter = 'blur(3px)';
    x.drawImage(cl, 0, 0);
    x.restore();
  }

  function hills(x, W, H, p, r) {
    const horizon = H * 0.56;

    /* far ridge, blurred for atmospheric perspective */
    const layer = document.createElement('canvas');
    layer.width = W; layer.height = H;
    const lx = layer.getContext('2d');
    lx.fillStyle = mix(p.far, p.sky[1], 0.62);
    lx.beginPath();
    lx.moveTo(0, horizon);
    for (let i = 0; i <= 12; i++) {
      const y = horizon - H * (0.02 + r() * 0.09);
      lx.lineTo(W * (i / 12), y);
      lx.lineTo(W * ((i + 0.5) / 12), horizon - H * (0.005 + r() * 0.03));
    }
    lx.lineTo(W, horizon); lx.lineTo(W, H); lx.lineTo(0, H); lx.closePath();
    lx.fill();
    x.save();
    x.filter = 'blur(4px)';
    x.globalAlpha = 0.85;
    x.drawImage(layer, 0, 0);
    x.restore();

    /* mid tree line — varied canopy */
    for (let i = 0; i < 60; i++) {
      const tx = r() * W, th = H * (0.04 + r() * 0.075), ty = horizon - th * 0.25;
      const dark = 0.25 + r() * 0.4;
      x.fillStyle = mix(mix(p.far, '#2f4230', 0.5), '#6d7f5c', dark);
      x.beginPath();
      x.ellipse(tx, ty, th * (0.45 + r() * 0.35), th * (0.55 + r() * 0.4), 0, 0, Math.PI * 2);
      x.fill();
      if (r() > 0.55) {
        x.fillRect(tx - 1.5, ty, 3, th * 0.8);
      }
    }
    return horizon;
  }

  function ground(x, W, H, p, horizon, r, kind) {
    const g = x.createLinearGradient(0, horizon, 0, H);
    g.addColorStop(0, mix(p.ground[0], p.sky[1], 0.22));
    g.addColorStop(0.35, p.ground[0]);
    g.addColorStop(1, p.ground[1]);
    x.fillStyle = g;
    x.fillRect(0, horizon, W, H - horizon);

    /* scattered texture */
    for (let i = 0; i < 1400; i++) {
      const px = r() * W, py = horizon + r() * (H - horizon);
      const depth = (py - horizon) / (H - horizon);
      x.fillStyle = 'rgba(' + (r() > 0.5 ? '255,255,255' : '0,0,0') + ',' + (0.02 + r() * 0.07 * depth) + ')';
      x.fillRect(px, py, 1 + depth * 2, 1 + depth);
    }

    /* clumps of grass / scrub */
    for (let i = 0; i < 26; i++) {
      const px = r() * W, py = horizon + r() * (H - horizon) * 0.8;
      const depth = (py - horizon) / (H - horizon);
      x.globalAlpha = 0.25 + depth * 0.35;
      x.fillStyle = mix(p.ground[1], '#3f5a2c', 0.45);
      x.beginPath();
      x.ellipse(px, py, 6 + depth * 26, 3 + depth * 9, 0, 0, Math.PI * 2);
      x.fill();
    }
    x.globalAlpha = 1;

    /* path / road */
    if (kind === 'road' || kind === 'market' || kind === 'school' || kind === 'health') {
      x.fillStyle = 'rgba(120,118,110,0.55)';
      x.beginPath();
      x.moveTo(W * (0.38 + r() * 0.1), horizon);
      x.lineTo(W * (0.06 + r() * 0.1), H);
      x.lineTo(W * (0.92 + r() * 0.05), H);
      x.lineTo(W * (0.56 + r() * 0.05), horizon);
      x.closePath();
      x.fill();
    }
  }

  function shadow(x, cx, cy, w, h) {
    x.save();
    x.globalAlpha = 0.22;
    x.fillStyle = '#1c1a14';
    x.beginPath();
    x.ellipse(cx, cy, w, h, 0, 0, Math.PI * 2);
    x.fill();
    x.restore();
  }

  function building(x, W, H, horizon, p, r, kind) {
    const bw = W * (0.30 + r() * 0.16);
    const bh = H * (0.26 + r() * 0.12);
    const bx = W * (0.24 + r() * 0.26);
    const by = horizon + H * 0.06;
    const base = by + bh;

    shadow(x, bx + bw * 0.5, base + 4, bw * 0.62, bh * 0.10);

    /* plinth */
    x.fillStyle = mix(p.wall, '#6b6357', 0.35);
    x.fillRect(bx - 6, base - 8, bw + 12, 12);

    /* wall with light/shadow split */
    const wg = x.createLinearGradient(bx, 0, bx + bw, 0);
    wg.addColorStop(0, mix(p.wall, '#ffffff', 0.22));
    wg.addColorStop(0.55, p.wall);
    wg.addColorStop(1, mix(p.wall, '#3b352a', 0.26));
    x.fillStyle = wg;
    x.fillRect(bx, by, bw, bh);

    /* roof */
    x.fillStyle = p.roof;
    x.beginPath();
    x.moveTo(bx - 10, by);
    x.lineTo(bx + bw * 0.5, by - bh * 0.24);
    x.lineTo(bx + bw + 10, by);
    x.closePath();
    x.fill();
    x.fillStyle = 'rgba(0,0,0,0.16)';
    x.fillRect(bx - 10, by - 3, bw + 20, 4);

    /* door */
    const dw = bw * 0.16, dh = bh * 0.46;
    x.fillStyle = mix(p.roof, '#000000', 0.35);
    x.fillRect(bx + bw * 0.42 - dw / 2, base - dh, dw, dh);
    x.fillStyle = 'rgba(255,255,255,0.12)';
    x.fillRect(bx + bw * 0.42 - dw / 2, base - dh, dw * 0.3, dh);

    /* windows */
    const rows = kind === 'school' ? 1 : 2;
    for (let rIdx = 0; rIdx < rows; rIdx++) {
      const wy = by + bh * (0.18 + rIdx * 0.34);
      for (let cIdx = 0; cIdx < 3; cIdx++) {
        const wx = bx + bw * (0.12 + cIdx * 0.28);
        const ww = bw * 0.15, wh = bh * 0.18;
        x.fillStyle = mix('#2d3a42', '#8fb0c0', 0.35 + r() * 0.25);
        x.fillRect(wx, wy, ww, wh);
        x.strokeStyle = 'rgba(255,255,255,0.55)';
        x.lineWidth = 1.5;
        x.strokeRect(wx, wy, ww, wh);
        x.beginPath();
        x.moveTo(wx + ww / 2, wy); x.lineTo(wx + ww / 2, wy + wh);
        x.moveTo(wx, wy + wh / 2); x.lineTo(wx + ww, wy + wh / 2);
        x.stroke();
      }
    }

    /* painted band / signage */
    x.fillStyle = p.accent;
    x.fillRect(bx, by + bh * 0.04, bw, bh * 0.045);

    /* type-specific details */
    if (kind === 'school') {
      x.fillStyle = '#d94b3a';
      x.fillRect(bx + bw * 0.06, by - bh * 0.2, 3, bh * 0.22);
      x.fillStyle = '#e8c33a';
      x.beginPath();
      x.moveTo(bx + bw * 0.06, by - bh * 0.2);
      x.lineTo(bx + bw * 0.18, by - bh * 0.16);
      x.lineTo(bx + bw * 0.06, by - bh * 0.12);
      x.closePath(); x.fill();
    }
    if (kind === 'health') {
      x.fillStyle = '#ffffff';
      x.fillRect(bx + bw - bw * 0.22, by - bh * 0.3, bw * 0.16, bh * 0.16);
      x.fillStyle = '#c0392b';
      x.fillRect(bx + bw - bw * 0.2, by - bh * 0.27, bw * 0.12, bh * 0.05);
      x.fillRect(bx + bw - bw * 0.175, by - bh * 0.29, bw * 0.045, bh * 0.11);
    }
    if (kind === 'worship') {
      x.fillStyle = p.accent;
      x.beginPath();
      x.arc(bx + bw * 0.5, by - bh * 0.24, bw * 0.09, Math.PI, 0);
      x.fill();
      x.fillRect(bx + bw * 0.49, by - bh * 0.38, 2, bh * 0.16);
    }
    if (kind === 'market') {
      x.fillStyle = 'rgba(210,60,50,0.9)';
      for (let i = 0; i < 5; i++) x.fillRect(bx + bw * (0.05 + i * 0.19), by - 6, bw * 0.18, 12);
    }
    if (kind === 'power') {
      x.fillStyle = '#6c6a63';
      x.fillRect(bx + bw * 0.82, by - bh * 0.75, 5, bh * 0.78);
      x.fillRect(bx + bw * 0.76, by - bh * 0.72, bw * 0.18, 5);
    }
    if (kind === 'sanitation') {
      x.fillStyle = p.accent;
      x.fillRect(bx + bw * 0.05, by + bh * 0.2, bw * 0.1, bh * 0.1);
    }
  }

  function waterStructure(x, W, H, horizon, p, r) {
    const cx = W * (0.38 + r() * 0.2);
    const cy = horizon + H * 0.18;
    const rad = W * (0.09 + r() * 0.04);
    shadow(x, cx, cy + rad * 0.6, rad * 1.5, rad * 0.28);

    /* platform */
    x.fillStyle = mix(p.ground[0], '#ffffff', 0.18);
    x.beginPath(); x.ellipse(cx, cy, rad * 1.8, rad * 0.7, 0, 0, Math.PI * 2); x.fill();

    /* well rim */
    const g = x.createLinearGradient(cx - rad, 0, cx + rad, 0);
    g.addColorStop(0, '#9d9382'); g.addColorStop(0.5, '#c9c0ad'); g.addColorStop(1, '#8b8272');
    x.fillStyle = g;
    x.beginPath(); x.ellipse(cx, cy, rad, rad * 0.38, 0, 0, Math.PI * 2); x.fill();
    x.fillStyle = '#3a3730';
    x.beginPath(); x.ellipse(cx, cy - 2, rad * 0.72, rad * 0.26, 0, 0, Math.PI * 2); x.fill();

    /* posts + roof */
    x.fillStyle = '#7b6b52';
    x.fillRect(cx - rad * 0.9, cy - rad * 1.5, 5, rad * 1.5);
    x.fillRect(cx + rad * 0.85, cy - rad * 1.5, 5, rad * 1.5);
    x.fillStyle = '#8a4b3a';
    x.beginPath();
    x.moveTo(cx - rad * 1.35, cy - rad * 1.45);
    x.lineTo(cx, cy - rad * 2.1);
    x.lineTo(cx + rad * 1.35, cy - rad * 1.45);
    x.closePath(); x.fill();

    /* bucket */
    x.fillStyle = '#3f6f96';
    x.fillRect(cx + rad * 1.5, cy - rad * 0.5, rad * 0.35, rad * 0.45);
    x.fillRect(cx + rad * 1.5, cy - rad * 0.62, rad * 0.35, 5);
  }

  function poleAndWires(x, W, H, horizon, p, r) {
    const px = W * (0.12 + r() * 0.1);
    x.fillStyle = '#8b7f63';
    x.fillRect(px, horizon - H * 0.34, 6, H * 0.36);
    x.fillRect(px - 14, horizon - H * 0.3, 34, 4);
    x.strokeStyle = 'rgba(40,40,40,0.55)';
    x.lineWidth = 1.2;
    for (let i = 0; i < 3; i++) {
      x.beginPath();
      x.moveTo(px - 8 + i * 8, horizon - H * 0.3);
      x.quadraticCurveTo(W * 0.5, horizon - H * 0.16, W, horizon - H * 0.26);
      x.stroke();
    }
  }

  function person(x, cx, cy, h, color) {
    x.fillStyle = color;
    x.beginPath(); x.arc(cx, cy - h * 0.86, h * 0.11, 0, Math.PI * 2); x.fill();
    x.beginPath();
    x.moveTo(cx - h * 0.12, cy - h * 0.74);
    x.lineTo(cx + h * 0.12, cy - h * 0.74);
    x.lineTo(cx + h * 0.09, cy);
    x.lineTo(cx - h * 0.09, cy);
    x.closePath(); x.fill();
  }

  function foreground(x, W, H, horizon, p, r, opts) {
    /* grass / scrub */
    for (let i = 0; i < 260; i++) {
      const gx = r() * W, gy = horizon + (H - horizon) * (0.35 + r() * 0.65);
      const gh = 3 + (gy - horizon) / (H - horizon) * 16;
      x.strokeStyle = 'rgba(' + (60 + r() * 60 | 0) + ',' + (90 + r() * 60 | 0) + ',50,0.35)';
      x.lineWidth = 1;
      x.beginPath(); x.moveTo(gx, gy); x.lineTo(gx + (r() - 0.5) * 4, gy - gh); x.stroke();
    }
    if (opts.people) {
      person(x, W * 0.68, H * 0.93, H * 0.3, '#2f3a44');
      person(x, W * 0.75, H * 0.95, H * 0.26, '#5a3f34');
    }
  }

  function postProcess(x, W, H, opts, r) {
    /* lens vignette */
    const v = x.createRadialGradient(W * 0.48, H * 0.45, Math.min(W, H) * 0.26, W / 2, H / 2, Math.max(W, H) * 0.72);
    v.addColorStop(0, 'rgba(0,0,0,0)');
    v.addColorStop(0.7, 'rgba(24,20,12,' + (opts.dark ? 0.18 : 0.12) + ')');
    v.addColorStop(1, 'rgba(18,15,9,' + (opts.dark ? 0.62 : 0.42) + ')');
    x.fillStyle = v;
    x.fillRect(0, 0, W, H);

    /* filmic grade */
    x.globalCompositeOperation = 'overlay';
    const warm = opts.warm === false ? 'rgba(150,190,255,0.10)' : 'rgba(255,214,150,0.13)';
    x.fillStyle = warm;
    x.fillRect(0, 0, W, H);
    x.globalCompositeOperation = 'soft-light';
    x.fillStyle = 'rgba(255,255,255,0.06)';
    x.fillRect(0, 0, W, H);
    x.globalCompositeOperation = 'source-over';

    /* sensor grain */
    const img = x.getImageData(0, 0, W, H);
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const n = (r() - 0.5) * 30;
      d[i] = Math.max(0, Math.min(255, d[i] + n * 1.05));
      d[i + 1] = Math.max(0, Math.min(255, d[i + 1] + n));
      d[i + 2] = Math.max(0, Math.min(255, d[i + 2] + n * 0.9));
    }
    x.putImageData(img, 0, 0);

    /* very slight lens softness */
    const soft = document.createElement('canvas');
    soft.width = W; soft.height = H;
    const sx = soft.getContext('2d');
    sx.filter = 'blur(0.6px)';
    sx.drawImage(x.canvas, 0, 0);
    x.clearRect(0, 0, W, H);
    x.drawImage(soft, 0, 0);
  }

  function roadScene(x, W, H, horizon, p, r) {
    /* road receding to the horizon */
    x.fillStyle = 'rgba(96,96,92,.9)';
    x.beginPath();
    x.moveTo(W * 0.47, horizon); x.lineTo(W * 0.53, horizon);
    x.lineTo(W * 0.98, H); x.lineTo(W * 0.02, H);
    x.closePath(); x.fill();
    x.strokeStyle = 'rgba(240,236,210,.75)'; x.lineWidth = 3;
    for (let i = 0; i < 7; i++) {
      const t = i / 7, y = horizon + (H - horizon) * Math.pow(t, 1.7);
      const w = 2 + t * 9;
      x.beginPath(); x.moveTo(W / 2 - w / 2, y); x.lineTo(W / 2 + w / 2, y); x.stroke();
    }
    /* roadside fields */
    x.fillStyle = mix(p.ground[0], '#8fa35c', 0.5);
    x.beginPath();
    x.moveTo(0, horizon); x.lineTo(W * 0.47, horizon); x.lineTo(W * 0.02, H); x.lineTo(0, H);
    x.closePath(); x.fill();
    /* bus stop */
    const bx = W * 0.16, by = horizon + H * 0.1;
    x.fillStyle = '#d9d4c6';
    x.fillRect(bx, by, W * 0.05, H * 0.16);
    x.fillStyle = '#2f4a5c';
    x.fillRect(bx + 3, by + 6, W * 0.044, H * 0.09);
    x.fillStyle = '#7d5b3c';
    x.fillRect(bx + W * 0.05, by + H * 0.03, 5, H * 0.13);
    shadow(x, bx + W * 0.03, by + H * 0.16, W * 0.05, H * 0.02);
  }

  function farmScene(x, W, H, horizon, p, r) {
    /* field furrows */
    for (let i = 0; i < 14; i++) {
      const t = i / 14;
      x.strokeStyle = 'rgba(' + (110 + r() * 40 | 0) + ',' + (130 + r() * 40 | 0) + ',70,.5)';
      x.lineWidth = 2 + t * 6;
      x.beginPath();
      x.moveTo(W * (t * 1.4 - 0.2), H);
      x.lineTo(W * (0.25 + t * 0.5), horizon);
      x.stroke();
    }
    /* small pump house */
    const bx = W * 0.6, by = horizon + H * 0.03, bw = W * 0.2, bh = H * 0.16;
    shadow(x, bx + bw / 2, by + bh + 3, bw * 0.7, bh * 0.16);
    x.fillStyle = mix(p.wall, '#ffffff', 0.1);
    x.fillRect(bx, by, bw, bh);
    x.fillStyle = p.roof;
    x.beginPath(); x.moveTo(bx - 8, by); x.lineTo(bx + bw / 2, by - bh * 0.3); x.lineTo(bx + bw + 8, by); x.closePath(); x.fill();
    x.fillStyle = '#3d5a44'; x.fillRect(bx + bw * 0.12, by + bh * 0.35, bw * 0.3, bh * 0.45);
    /* channel */
    x.fillStyle = 'rgba(80,130,150,.75)';
    x.fillRect(W * 0.1, horizon + H * 0.08, W * 0.3, H * 0.05);
  }

  function powerScene(x, W, H, horizon, p, r) {
    const px = W * 0.28;
    x.fillStyle = '#8b8065';
    x.fillRect(px, horizon - H * 0.5, 9, H * 0.52);
    x.fillStyle = '#7c7f86';
    x.fillRect(px - 26, horizon - H * 0.46, 61, 6);
    x.fillRect(px - 20, horizon - H * 0.41, 49, 5);
    x.strokeStyle = 'rgba(45,45,45,.6)'; x.lineWidth = 1.4;
    for (let i = 0; i < 3; i++) {
      x.beginPath();
      x.moveTo(px - 18 + i * 18, horizon - H * 0.46);
      x.quadraticCurveTo(W * 0.6, horizon - H * 0.26, W * 1.05, horizon - H * 0.36);
      x.stroke();
    }
    /* transformer box */
    const bx = W * 0.56, by = horizon + H * 0.06;
    shadow(x, bx + 20, by + H * 0.15, 30, 8);
    x.fillStyle = '#9aa3a8'; x.fillRect(bx, by, 40, H * 0.15);
    x.fillStyle = '#6f7a80'; x.fillRect(bx + 4, by + 8, 32, H * 0.09);
    x.fillStyle = '#d8b23c'; x.fillRect(bx + 14, by + H * 0.055, 12, 12);
  }

  function render(kind, seed, opts) {
    opts = opts || {};
    const W = opts.w || 560, H = opts.h || 420;
    const r = rng(hashStr(kind + '|' + seed + '|' + (opts.v || 0)));
    const p = P[kind] || P.shelter;

    const c = document.createElement('canvas');
    c.width = W; c.height = H;
    const x = c.getContext('2d');

    sky(x, W, H, p, r, opts);
    const horizon = hills(x, W, H, p, r);
    ground(x, W, H, p, horizon, r, kind);

    if (kind === 'water') waterStructure(x, W, H, horizon, p, r);
    else if (kind === 'road') roadScene(x, W, H, horizon, p, r);
    else if (kind === 'farm') farmScene(x, W, H, horizon, p, r);
    else if (kind === 'power') powerScene(x, W, H, horizon, p, r);
    else building(x, W, H, horizon, p, r, kind);

    if (kind !== 'power' && r() > 0.45) poleAndWires(x, W, H, horizon, p, r);

    foreground(x, W, H, horizon, p, r, opts);

    /* bad-photo variants for the guide */
    if (opts.dark) { x.fillStyle = 'rgba(8,10,22,0.58)'; x.fillRect(0, 0, W, H); }
    if (opts.blur) { x.filter = 'blur(3px)'; x.drawImage(c, 0, 0); x.filter = 'none'; }
    if (opts.crop) {
      x.drawImage(c, W * 0.22, H * 0.16, W * 0.45, H * 0.45, 0, 0, W, H);
    }
    if (opts.people) {
      x.save();
      x.globalAlpha = 0.9;
      person(x, W * 0.3, H * 0.97, H * 0.34, '#22303c');
      x.restore();
    }

    postProcess(x, W, H, opts, r);
    return c.toDataURL('image/jpeg', opts.q || 0.84);
  }

  global.VillagePhoto = { render: render };
})(window);
