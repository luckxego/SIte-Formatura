const CONFIG = {
  EVENT_DATE: "2026-12-17T20:00:00-03:00",
  PIX_EXPIRES_SECONDS: 600,

  GATEWAY_URL: null
};
const TK = [
  {
    id: "aluno",
    k: "a",
    name: "Aluno",
    price: 15,
    band: "Preta",
    c: "#0c0c0c"
  },
  {
    id: "ex",
    k: "b",
    name: "Ex-aluno",
    price: 20,
    band: "Amarela",
    c: "#ffd800"
  },
  {
    id: "ext",
    k: "c",
    name: "Público externo",
    price: 25,
    band: "Branca",
    c: "#fff"
  }
];
const FAQ = [
  ["Quanto custa o ingresso?", "Aluno R$ 15,00, ex-aluno R$ 20,00 e público externo R$ 25,00."],
  ["Quem pode comprar ingresso de aluno?", "Alunos do Instituto Helena Goullart. A categoria é conferida na entrada."],
  ["Qual pulseira corresponde a cada ingresso?", "Aluno: preta. Ex-aluno: amarela. Público externo: branca."],
  ["Como funciona o pagamento?", "Via PIX, com QR Code ou código copia e cola, confirmado automaticamente."],
  ["Como receberei meu ingresso?", "Após a confirmação, o ingresso digital aparece na tela e pode ser salvo ou impresso."],
  ["O ingresso possui QR Code?", "Sim, cada ingresso tem um identificador único em QR Code."],
  ["Posso comprar para outra pessoa?", "Sim, informe os dados de quem usará o ingresso."]
];
const $ = s => document.querySelector(s),
  brl = v => "R$ " + v.toFixed(2).replace(".", ","),
  S = {
    t: null,
    step: 1,
    form: {},
    status: "wait",
    left: 0,
    timer: null
  };
$("#burger").onclick = e => {
  e.currentTarget.classList.toggle("o");
  $("#links").classList.toggle("o");
};
$("#links").onclick = e => {
  if (e.target.tagName === "A") {
    $("#burger").classList.remove("o");
    $("#links").classList.remove("o");
  }
};
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) {
    e.target.classList.add("in");
    io.unobserve(e.target);
  }
}), { threshold: .1 });
$("#faqs").innerHTML = FAQ.map(f =>
  `<div class="q rv"><button><span>${f[0]}</span><i></i></button><div><p>${f[1]}</p></div></div>`
).join("");
$("#faqs").onclick = e => {
  const b = e.target.closest("button");
  if (b)
    b.parentElement.classList.toggle("o");
};
$("#tg").innerHTML = TK.map(t =>
  `<button class="tc ${t.k} rv" data-id="${t.id}"><div class="top"><span>${t.name}</span><span class="pill">Pulseira ${t.band.toLowerCase()}</span></div><div class="p">${brl(t.price)}</div><div class="box"><small>ACESSO</small><span><i class="dot" style="background:${t.c}"></i>Pulseira ${t.band.toLowerCase()}</span></div><span class="btn">Comprar →</span></button>`
).join("");
$("#tg").onclick = e => {
  const c = e.target.closest(".tc");
  if (!c)
    return;
  S.t = TK.find(t => t.id === c.dataset.id);
  document.querySelectorAll(".tc").forEach(x => x.classList.toggle("sel", x === c));
  S.step = 2;
  $("#checkout").style.display = "block";
  render();
  setTimeout(() => $("#checkout").scrollIntoView({ behavior: "smooth" }), 60);
};

function hash(s) {
  let h = 2166136261;
  for (const c of s) {
    h ^= c.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function drawQR(cv, seed) {
  const n = 29, m = 6;
  cv.width = cv.height = n * m;
  const g = cv.getContext("2d");
  g.fillStyle = "#fff";
  g.fillRect(0, 0, n * m, n * m);
  g.fillStyle = "#0d0f12";
  let h = hash(seed) || 1;
  const r = () => {
    h ^= h << 13;
    h >>>= 0;
    h ^= h >>> 17;
    h ^= h << 5;
    h >>>= 0;
    return h / 4294967295;
  };
  const fin = (x, y) => {
    for (let i = 0; i < 7; i++)
      for (let j = 0; j < 7; j++)
        if (i % 6 == 0 || j % 6 == 0 || (i > 1 && i < 5 && j > 1 && j < 5))
          g.fillRect((x + i) * m, (y + j) * m, m, m);
  };
  for (let y = 0; y < n; y++)
    for (let x = 0; x < n; x++) {
      if (!((x < 8 && y < 8) || (x > n - 9 && y < 8) || (x < 8 && y > n - 9)) && r() > .52)
        g.fillRect(x * m, y * m, m, m);
    }
  fin(0, 0);
  fin(n - 7, 0);
  fin(0, n - 7);
}

function steps() {
  $("#steps").innerHTML = ["1 Ingresso", "2 Dados", "3 Pagamento"].map((l, i) =>
    `<span class="step ${S.step === i + 1 ? "on" : S.step > i + 1 ? "done" : ""}">${l}</span>`
  ).join("");
}

function render() {
  steps();
  const b = $("#cobody");
  clearInterval(S.timer);
  if (S.step === 1) {
    b.innerHTML =
      `<div class="panel"><h3>Escolha seu ingresso</h3><div class="opts">${TK.map(t =>
        `<button class="opt ${S.t && S.t.id === t.id ? "sel" : ""}" data-t="${t.id}"><span>${t.name} · pulseira ${t.band.toLowerCase()}</span><b>${brl(t.price)}</b></button>`
      ).join("")}</div><div class="row"><button class="btn" id="n1" ${S.t ? "" : "disabled"}>Continuar</button></div></div>`;
    b.onclick = e => {
      const o = e.target.closest("[data-t]");
      if (o) {
        S.t = TK.find(t => t.id === o.dataset.t);
        render();
      }
      if (e.target.id === "n1") {
        S.step = 2;
        render();
      }
    };
  } else if (S.step === 2) {
    const f = S.form;
    b.innerHTML =
      `<div class="panel"><h3>Preencha seus dados</h3><label>Nome completo</label><input id="fn" autocomplete="name" value="${f.n || ""}"><label>E-mail</label><input id="fe" type="email" autocomplete="email" value="${f.e || ""}"><label>Telefone</label><input id="ft" type="tel" autocomplete="tel" placeholder="(21) 90000-0000" value="${f.t || ""}"><div class="total"><span>${S.t.name}</span><b>Total: ${brl(S.t.price)}</b></div><div class="row"><button class="btn out" id="bk">Voltar</button><button class="btn" id="n2">Ir para pagamento</button></div><p class="demo" id="er" style="color:#b3261e"></p></div>`;
    b.onclick = e => {
      if (e.target.id === "bk") {
        S.step = 1;
        render();
      }
      if (e.target.id === "n2") {
        const n = $("#fn").value.trim(),
          m = $("#fe").value.trim(),
          t = $("#ft").value.trim();
        if (n.length < 3 || !/^\S+@\S+\.\S+$/.test(m) || t.replace(/\D/g, "").length < 10) {
          $("#er").textContent = "Confira nome, e-mail e telefone.";
          return;
        }
        S.form = {
          n,
          e: m,
          t
        };
        S.step = 3;
        charge();
      }
    };
  } else
    pay();
}

async function gwCreate() {
  if (CONFIG.GATEWAY_URL) {
    const r = await fetch(CONFIG.GATEWAY_URL + "/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        category: S.t.id,
        amount: S.t.price,
        buyer: S.form
      })
    });
    return r.json();
  }
  const id = "DEMO" + Math.random().toString(36).slice(2, 8).toUpperCase();
  return {
    id,
    copyPaste: "DEMONSTRACAO-PIX-NAO-PAGAVEL-" + id,
    expiresIn: CONFIG.PIX_EXPIRES_SECONDS
  };
}

async function gwStatus(id) {
  if (CONFIG.GATEWAY_URL)
    return (await (await fetch(CONFIG.GATEWAY_URL + "/status?id=" + id)).json()).status;
  return null;
}

async function charge() {
  S.status = "wait";
  S.c = await gwCreate();
  S.left = S.c.expiresIn;
  render();
}

function pay() {
  const c = S.c,
    b = $("#cobody"),
    tx = {
      wait: "Aguardando pagamento",
      ok: "Pagamento confirmado",
      exp: "Pagamento expirado"
    },
    mm = () => String(Math.floor(S.left / 60)).padStart(2, "0") + ":" + String(S.left % 60).padStart(2, "0");
  b.innerHTML =
    `<div class="panel" style="max-width:760px"><h3>Pague sua entrada via PIX</h3><div class="pixg"><div class="qr"><canvas id="pq"></canvas></div><div><span class="st ${S.status}">${tx[S.status]}</span><div class="serif" style="font-size:44px;font-weight:600">Total: ${brl(S.t.price)}</div><div class="demo" id="tm" style="margin:4px 0">${S.status === "wait" ? "Expira em " + mm() : ""}</div><div class="code">${c.copyPaste}</div><div class="row" style="margin-top:0"><button class="btn" id="cp">Copiar código PIX</button>${S.status === "exp" ? '<button class="btn out" id="rg">Gerar novo PIX</button>' : ""}</div></div></div><p class="demo">MODO DEMONSTRAÇÃO — gateway não configurado. QR e código ilustrativos, sem valor financeiro.</p><div class="row"><button class="btn out" id="bk">Voltar</button>${S.status === "wait" ? '<button class="btn out" id="sim">Simular confirmação (demo)</button>' : ""}</div></div>`;
  drawQR($("#pq"), c.id);
  b.onclick = async (e) => {
    const i = e.target.id;
    if (i === "bk") {
      S.step = 2;
      render();
    }
    if (i === "cp") {
      try {
        await navigator.clipboard.writeText(c.copyPaste);
      } catch (_) { }
      e.target.textContent = "Código copiado";
      setTimeout(() => e.target.textContent = "Copiar código PIX", 1800);
    }
    if (i === "rg")
      charge();
    if (i === "sim")
      ok();
  };
  if (S.status === "wait")
    S.timer = setInterval(async () => {
      S.left--;
      const tm = $("#tm");
      if (tm)
        tm.textContent = "Expira em " + mm();
      if (S.left % 5 === 0 && await gwStatus(c.id) === "paid")
        return ok();
      if (S.left <= 0) {
        S.status = "exp";
        pay();
      }
    }, 1000);
}

function ok() {
  clearInterval(S.timer);
  const id = "IHG-" + hash(S.c.id + Date.now()).toString(36).toUpperCase().slice(0, 6),
    d = new Date().toLocaleString("pt-BR", {
      dateStyle: "short",
      timeStyle: "short"
    });
  $("#ticket").innerHTML =
    `<div class="l"><b style="font-size:22px">IHG®</b><h3>Formatura<br>9º Ano</h3><span class="cat">${S.t.name.toUpperCase()}</span><dl><div><dt>COMPRADOR</dt><dd>${S.form.n.replace(/</g, "&lt;")}</dd></div><div><dt>VALOR PAGO</dt><dd>${brl(S.t.price)}</dd></div><div><dt>CÓDIGO</dt><dd>ID: ${id}</dd></div><div><dt>DATA DA COMPRA</dt><dd>${d}</dd></div></dl></div><div class="r"><canvas id="tq"></canvas><small style="font-weight:700;letter-spacing:.12em">ID: ${id}</small></div>`;
  drawQR($("#tq"), id);
  $("#checkout").style.display = "none";
  $("#digital").style.display = "block";
  setTimeout(() => $("#digital").scrollIntoView({ behavior: "smooth" }), 60);
}

const cd = $("#cd");
cd.innerHTML = ["Dias", "Horas", "Minutos", "Segundos"].map(l => `<div class="cdb"><b>00</b><span>${l.toUpperCase()}</span></div>`).join("");

function tick() {
  const s = Math.max(0, Math.floor((new Date(CONFIG.EVENT_DATE) - Date.now()) / 1000)),
    v = [Math.floor(s / 86400), Math.floor(s % 86400 / 3600), Math.floor(s % 3600 / 60), s % 60];
  cd.querySelectorAll("b").forEach((b, i) => b.textContent = String(v[i]).padStart(2, "0"));
}

tick();
setInterval(tick, 1000);
document.querySelectorAll(".rv").forEach(x => io.observe(x));
