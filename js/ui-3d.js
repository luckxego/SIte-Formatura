
(function () {
  document.querySelectorAll(".sp").forEach(el => {
    let i = 0;
    el.innerHTML = el.innerHTML.split(/<br\s*\/?>/).map(l => l.trim().split(" ").map(w => `<span class="w"><span style="--i:${i++}">${w}</span></span>`).join(" ")).join("<br>");
  });
  const ld = document.getElementById("ld"),
    lc = document.getElementById("lc");
  let n = 0;
  const iv = setInterval(() => {
    n = Math.min(100, n + 7);
    lc.textContent = String(n).padStart(3, "0");
    if (n >= 100) {
      clearInterval(iv);
      setTimeout(() => ld.classList.add("gone"), 200);
    }
  }, 40);
  const nv = document.getElementById("nv");
  addEventListener("scroll", () => nv.classList.toggle("s", scrollY > 40), { passive: true });
  if (matchMedia("(hover:hover) and (pointer:fine)").matches) {
    const c = document.getElementById("cur");
    let x = 0, y = 0, tx = 0, ty = 0;
    addEventListener("pointermove", e => {
      tx = e.clientX;
      ty = e.clientY;
      c.style.opacity = 1;
    }, { passive: true });
    (function l() {
      x += (tx - x) * .18;
      y += (ty - y) * .18;
      c.style.transform = `translate(${x}px,${y}px)`;
      requestAnimationFrame(l);
    })();
    document.addEventListener("pointerover", e => c.classList.toggle("h", !!e.target.closest("a,button,.tc,.q")));
  }
})();


(function () {
  const cv = document.getElementById("gl");
  if (!window.THREE) {
    return;
  }
  try {
    const R = new THREE.WebGLRenderer({
      canvas: cv,
      antialias: true,
      alpha: true
    });
    R.setPixelRatio(Math.min(devicePixelRatio, 1.75));
    R.outputEncoding = THREE.sRGBEncoding;
    R.toneMapping = THREE.ACESFilmicToneMapping;
    R.toneMappingExposure = 1.1;
    const sc = new THREE.Scene(),
      cam = new THREE.PerspectiveCamera(32, 1, .1, 200);
    const pm = new THREE.PMREMGenerator(R),
      es = new THREE.Scene();
    es.add(new THREE.Mesh(new THREE.BoxGeometry(40, 40, 40), new THREE.MeshBasicMaterial({
      color: 0x8a9098,
      side: THREE.BackSide
    })));
    const sb = (w, h, x, y, z, k) => {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({
        color: new THREE.Color(k, k, k),
        side: THREE.DoubleSide
      }));
      m.position.set(x, y, z);
      m.lookAt(0, 0, 0);
      es.add(m);
    };
    sb(18, 6, 0, 14, 5, 10);
    sb(5, 16, -14, 2, 3, 7);
    sb(5, 14, 14, 0, -2, 5);
    sb(16, 3, 0, -10, 8, 3);
    try {
      sc.environment = pm.fromScene(es, .03).texture;
    } catch (e) {
      console.warn(e);
    }
    sc.add(new THREE.HemisphereLight(0xffffff, 0x8a9098, .55));
    const key = new THREE.DirectionalLight(0xffffff, .6);
    key.position.set(4, 8, 10);
    sc.add(key);
    function tex(bg, fg, bump, k) {
      const c = document.createElement("canvas");
      c.width = 2048;
      c.height = 172;
      const g = c.getContext("2d");
      g.fillStyle = bg;
      g.fillRect(0, 0, 2048, 172);
      if (!bump) {
        g.fillStyle = "rgba(255,255,255,.04)";
        for (let x = 0; x < 2048; x += 4)
          g.fillRect(x, 0, 1, 172);
      }
      g.fillStyle = fg;
      g.strokeStyle = fg;
      g.globalAlpha = bump ? 1 : .92;
      g.textBaseline = "middle";
      g.textAlign = "center";
      g.fillRect(0, 16, 2048, 2);
      g.fillRect(0, 154, 2048, 2);
      for (let i = 0; i < 3; i++) {
        const cx = i * 683 + 341;
        if ("letterSpacing" in g)
          g.letterSpacing = "9px";
        g.font = "600 62px 'Inter Tight',Arial,sans-serif";
        g.fillText("IHG • 9º ANO", cx, 88);
        g.font = "500 17px 'JetBrains Mono',monospace";
        if ("letterSpacing" in g)
          g.letterSpacing = "5px";
        g.fillText("FORMATURA 2026", cx, 44);
        g.fillText("Nº 00" + (k * 3 + i + 1), cx, 134);
      }
      const t = new THREE.CanvasTexture(c);
      t.anisotropy = 8;
      t.wrapS = THREE.RepeatWrapping;
      if (!bump)
        t.encoding = THREE.sRGBEncoding;
      return t;
    }
    function band(bg, fg, k) {
      const Ro = 1.9,
        H = .5,
        rt = Ro + .04,
        bv = .05,
        Ri = Ro - .02;
      const grp = new THREE.Group(),
        spin = new THREE.Group();
      grp.add(spin);
      const outer = new THREE.Mesh(new THREE.CylinderGeometry(Ro + .045, Ro + .045, H * 2, 160, 1, true), new THREE.MeshPhysicalMaterial({
        map: tex(bg, fg, false, k),
        bumpMap: tex("#7a7a7a", "#ffffff", true, k),
        bumpScale: 2.2,
        roughness: .4,
        clearcoat: .55,
        clearcoatRoughness: .3
      }));
      const pr = [
        [Ri, -H],
        [rt - bv, -H],
        [rt, -H + bv],
        [rt, H - bv],
        [rt - bv, H],
        [Ri, H]
      ].map(p => new THREE.Vector2(p[0], p[1]));
      const body = new THREE.Mesh(new THREE.LatheGeometry(pr, 160), new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(bg),
        roughness: .5,
        clearcoat: .4,
        side: THREE.DoubleSide
      }));
      const sm = new THREE.MeshStandardMaterial({
        color: 0xc5c9cf,
        metalness: 1,
        roughness: .22
      });
      const th = 2.3,
        dir = new THREE.Vector3(Math.sin(th), 0, Math.cos(th));
      const s1 = new THREE.Mesh(new THREE.CylinderGeometry(.2, .22, .06, 40), sm),
        s2 = new THREE.Mesh(new THREE.SphereGeometry(.11, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2), sm);
      [s1, s2].forEach((m, i) => {
        m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
        m.position.copy(dir).multiplyScalar(Ro + .07 + i * .03);
      });
      spin.add(outer, body, s1, s2);
      spin.rotation.y = k * 1.3;
      grp.rotation.x = 1.02;
      return grp;
    }
    const defs = [
      ["#0b0b0c", "#f1f1f1"],
      ["#f1c40a", "#121212"],
      ["#ecece8", "#141414"]
    ],
      X = [-5.2, 0, 5.2],
      bands = defs.map((d, k) => {
        const b = band(d[0], d[1], k);
        b.position.x = X[k];
        sc.add(b);
        return b;
      });
    const P = [],
      D = [];
    for (let i = 0; i < 64; i++) {
      const p = new THREE.Vector3((Math.random() - .5) * 36, (Math.random() - .5) * 16, (Math.random() - .5) * 14 - 3),
        a = Math.floor(Math.random() * 3),
        L = 2 + Math.random() * 5,
        v = new THREE.Vector3();
      v.setComponent(a, L);
      if (Math.random() < .35)
        v.setComponent((a + 1) % 3, L * .7);
      P.push(p, p.clone().add(v));
      D.push(p);
    }
    const lg = new THREE.BufferGeometry().setFromPoints(P),
      lines = new THREE.LineSegments(lg, new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: .75
      }));
    const dots = new THREE.Points(new THREE.BufferGeometry().setFromPoints(D), new THREE.PointsMaterial({
      color: 0xffffff,
      size: .07,
      transparent: true,
      opacity: .9
    }));
    sc.add(lines, dots);
    const pul = document.getElementById("pulseiras"),
      pis = [...document.querySelectorAll(".pi")],
      dts = [...document.querySelectorAll(".dots i")];
    let act = 0;
    const th2 = Math.tan(16 * Math.PI / 180);
    let asp = 1,
      land = true,
      zh = 15,
      zf = 7,
      off = 0,
      ly = 0,
      vh0 = 8;
    function size() {
      const w = innerWidth,
        h = innerHeight;
      R.setSize(w, h, false);
      asp = w / h;
      cam.aspect = asp;
      cam.updateProjectionMatrix();
      land = asp > 1.1;
      zh = (land ? 15 : 10) / (2 * th2 * asp);
      vh0 = 2 * zh * th2;
      zf = Math.max(6, (land ? 7 : 6) / (2 * th2 * asp));
      off = land ? 1.9 : 0;
      ly = land ? 0 : 2 * zf * th2 * .13;
    }
    size();
    addEventListener("resize", size);
    let mx = 0, my = 0;
    addEventListener("pointermove", e => {
      mx = e.clientX / innerWidth - .5;
      my = e.clientY / innerHeight - .5;
    }, { passive: true });
    const ease = x => x * x * (3 - 2 * x),
      clk = new THREE.Clock(),
      tp = new THREE.Vector3(),
      tl = new THREE.Vector3(),
      cl = new THREE.Vector3(0, 0, 0);
    cam.position.set(0, 0, zh);
    let hideT = 0;
    (function frame() {
      requestAnimationFrame(frame);
      const dt = Math.min(clk.getDelta(), .05),
        t = clk.elapsedTime,
        y = scrollY,
        vh = innerHeight,
        top = pul.offsetTop,
        len = pul.offsetHeight - vh,
        end = top + pul.offsetHeight - vh * .5,
        show = y < end;
      cv.style.opacity = show ? 1 : 0;
      if (!show) {
        hideT = hideT || performance.now();
        if (performance.now() - hideT > 900)
          return;
      } else
        hideT = 0;
      let a, ff;
      if (y < top) {
        a = ease(Math.max(0, y / top));
        ff = 0;
      } else {
        a = 1;
        ff = Math.min(1, (y - top) / len) * 2;
      }
      const bx = -5.2 + ff * 5.2,
        hx = 0,
        hy = -vh0 * .14;
      tp.set(hx + (bx - off - hx) * a + mx * .6, (1 - a) * 0 + ly * a - my * .3, zh + (zf - zh) * a);
      tl.set(hx + (bx - off - hx) * a, hy * (1 - a) + ly * a, 0);
      const k = 1 - Math.pow(.002, dt);
      cam.position.lerp(tp, k);
      cl.lerp(tl, k);
      cam.lookAt(cl);
      const idx = Math.round(ff);
      if (idx !== act) {
        act = idx;
        pis.forEach((p, i) => p.classList.toggle("on", i === idx));
        dts.forEach((p, i) => p.classList.toggle("on", i === idx));
      }
      bands.forEach((b, i) => {
        b.children[0].rotation.y += dt * (i === idx && y >= top ? .35 : .15);
        b.position.y = Math.sin(t * .8 + i * 2) * .14;
        b.rotation.z = Math.sin(t * .5 + i) * .06 + mx * .25;
        b.rotation.x = 1.02 + my * .15;
        const s = y >= top * .6 ? (i === idx ? 1.06 : .8) : 1;
        b.scale.lerp(new THREE.Vector3(s, s, s), k);
      });
      lines.rotation.y = t * .01;
      dots.rotation.y = t * .01;
      lines.position.x = -y * .0006;
      R.render(sc, cam);
    })();
  } catch (e) {
    console.error('3D', e);
  }
})();
