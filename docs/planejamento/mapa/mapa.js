/* Mapa de rastreabilidade interativo — integrado ao tema Material do MkDocs.
   Os dados vêm de dados.js (gerado a partir da documentação). */
(function () {
  function initMapa() {
    var root = document.getElementById("mapa-rastreabilidade");
    var D = window.MAPA_DATA;
    if (!root || !D || root.dataset.ready) return;
    root.dataset.ready = "1";
    var BASE = root.getAttribute("data-base") || "../../";

    var COLS = ["oe", "tema", "epico", "us"];
    var LABEL = { oe: "Objetivo específico", tema: "Tema", epico: "Épico", us: "User story" };
    var W = { oe: 130, tema: 170, epico: 190, us: 270 }, GAP = 44, PAD = 14, TOP = 30, NH = 40, P = 46;
    var X = {}, x = PAD;
    COLS.forEach(function (c) { X[c] = x; x += W[c] + GAP; });
    var WIDTH = x - GAP + PAD;

    var $ = function (s, el) { return (el || document).querySelector(s); };
    var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "\u0026amp;", "<": "\u0026lt;", ">": "\u0026gt;", '"': "\u0026quot;" }[c]; }); };

    var feitosPorUs = {};
    function isDone(u, i) {
      var lista = feitosPorUs[u.id] || u.feitos || [];
      return lista.indexOf(i) >= 0;
    }
    function doneCount(u) {
      return u.criterios.filter(function (_, i) { return isDone(u, i); }).length;
    }
    var DOR_ITENS = [
      "A User Story apresenta critérios de aceitação verificáveis?",
      "O fluxo e as regras de negócio estão claros e sem bloqueios?",
      "O requisito é viável em termos de tempo e complexidade?",
      "A User Story possui protótipo validado?",
      "A validação e o status de aprovação estão rastreáveis?"
    ];
    var DOD_ITENS = [
      "O código foi devidamente revisado e integrado?",
      "A funcionalidade atende às regras de negócio e critérios de aceitação?",
      "Os Requisitos Não Funcionais (RNFs) aplicáveis foram atendidos?",
      "Os testes foram executados com sucesso (ou com exceção devidamente registrada)?",
      "A entrega passou pelas etapas de verificação, demonstração e aceite?",
      "A documentação foi atualizada?"
    ];
    var dorPorUs = {}, dodPorUs = {};
    function renderCheck(itens, feitos) {
      return '<ul class="mapa-check">' + itens.map(function (txt, i) {
        var ok = (feitos || []).indexOf(i) >= 0;
        return '<li><label><input type="checkbox" disabled' + (ok ? " checked" : "") + "><span>" + esc(txt) + "</span></label></li>";
      }).join("") + "</ul>";
    }

    // "feitos" (dados.js): critérios já entregues; só valem enquanto o navegador não tem marcação própria da US.
  window.MAPA_DATA.us.forEach(function (u) { if (u.feitos && !checks[u.id]) { checks[u.id] = {}; u.feitos.forEach(function (i) { checks[u.id]["c" + i] = true; }); } });
  var sel = null, hover = null;

    /* ---------- grafo ---------- */
    var nodes = {}, edges = [], fwd = {}, bwd = {};
    var temaIdx = {};
    D.temaOrder.forEach(function (t, i) { temaIdx[t] = i; });
    function add(id, col, label, sub, tema) { nodes[id] = { id: id, col: col, label: label, sub: sub, tema: tema }; }
    D.oeOrder.forEach(function (o) { add(o, "oe", o, D.oe[o].curto, null); });
    D.temaOrder.forEach(function (t) { add(t, "tema", t, D.temas[t].nome, t); edges.push([D.temas[t].oe, t]); });
    D.epicoOrder.forEach(function (e) { var ep = D.epicos[e]; add(e, "epico", e + " · " + ep.cp, ep.nome, ep.tema); edges.push([ep.tema, e]); });
    D.us.forEach(function (u) {
      var t = D.epicos[u.epicos[0]].tema;
      add(u.id, "us", u.id, u.nome, t);
      u.epicos.forEach(function (e) { edges.push([e, u.id]); });
    });
    edges.forEach(function (e) { (fwd[e[0]] = fwd[e[0]] || []).push(e[1]); (bwd[e[1]] = bwd[e[1]] || []).push(e[0]); });

    function chain(id) {
      var set = {}; set[id] = 1;
      [[fwd], [bwd]].forEach(function (m) {
        var st = [id];
        while (st.length) { var c = st.pop(); (m[0][c] || []).forEach(function (n) { if (!set[n]) { set[n] = 1; st.push(n); } }); }
      });
      return set;
    }
    function usApplying(id) {
      var eps = Object.keys(D.epicos).filter(function (e) {
        var ep = D.epicos[e];
        return ep.cp === id || ep.rn.indexOf(id) >= 0 || ep.rnf.indexOf(id) >= 0 ||
          (D.rn[id] && D.rn[id].cps.indexOf(ep.cp) >= 0) || (D.rnf[id] && D.rnf[id].cps.indexOf(ep.cp) >= 0);
      });
      return D.us.filter(function (u) { return u.epicos.some(function (e) { return eps.indexOf(e) >= 0; }); }).map(function (u) { return u.id; });
    }
    function activeSet(id) {
      if (!id) return null;
      if (nodes[id]) return chain(id);
      var s = {};
      usApplying(id).forEach(function (u) { var c = chain(u); for (var k in c) s[k] = 1; });
      return s;
    }

    /* ---------- layout ---------- */
    var pos = {};
    D.us.forEach(function (u, i) { pos[u.id] = TOP + i * P; });
    function mean(ids) { return ids.reduce(function (s, i) { return s + pos[i]; }, 0) / ids.length; }
    function spread(ids) {
      ids.sort(function (a, b) { return pos[a] - pos[b]; });
      for (var i = 1; i < ids.length; i++) if (pos[ids[i]] < pos[ids[i - 1]] + P) pos[ids[i]] = pos[ids[i - 1]] + P;
    }
    var byCol = function (c) { return Object.keys(nodes).filter(function (k) { return nodes[k].col === c; }); };
    byCol("epico").forEach(function (e) { pos[e] = mean(fwd[e]); }); spread(byCol("epico"));
    byCol("tema").forEach(function (t) { pos[t] = mean(fwd[t]); }); spread(byCol("tema"));
    byCol("oe").forEach(function (o) { pos[o] = mean(fwd[o]); }); spread(byCol("oe"));
    var HEIGHT = Math.max.apply(null, Object.keys(pos).map(function (k) { return pos[k]; })) + NH + PAD;

    /* ---------- montagem do DOM ---------- */
    root.classList.add("mapa");
    root.innerHTML =
      '<div class="mapa-bar"><div class="mapa-prog"><span id="mapa-prog-txt"></span><div class="mapa-barra"><i id="mapa-prog-bar"></i></div></div>' +
      '<button type="button" class="mapa-btn" id="mapa-full" title="Ampliar o mapa">Tela cheia</button></div>' +
      '<div class="mapa-scroller"><div class="mapa-map" id="mapa-map" style="width:' + WIDTH + 'px;height:' + HEIGHT + 'px">' +
      '<svg class="mapa-links" id="mapa-links" width="' + WIDTH + '" height="' + HEIGHT + '" aria-hidden="true"></svg></div></div>' +
      '<div class="mapa-chips"><span class="mapa-chips-t">Características de produto</span><span id="mapa-cps"></span></div>' +
      '<div class="mapa-chips"><span class="mapa-chips-t">Regras de negócio</span><span id="mapa-rns"></span></div>' +
      '<div class="mapa-chips"><span class="mapa-chips-t">Requisitos não funcionais</span><span id="mapa-rnfs"></span></div>' +
      '<p class="mapa-dica">Passe o mouse para ver o caminho de cada item; clique para abrir os detalhes e acompanhar os critérios sincronizados com o GitHub.</p>';

    var map = $("#mapa-map");
    var heads = COLS.map(function (c) { return '<div class="mapa-h" style="left:' + X[c] + 'px;width:' + W[c] + 'px">' + LABEL[c] + "</div>"; }).join("");
    map.insertAdjacentHTML("beforeend", heads);

    function ring(u) {
      var d = doneCount(u), t = u.criterios.length, r = 11, C = 2 * Math.PI * r, f = t ? d / t : 0;
      return '<svg class="mapa-ring" viewBox="0 0 28 28" aria-label="' + d + ' de ' + t + ' critérios">' +
        '<circle cx="14" cy="14" r="' + r + '" class="rb"/><circle cx="14" cy="14" r="' + r + '" class="rf" stroke-dasharray="' + (C * f) + " " + C + '" transform="rotate(-90 14 14)"/>' +
        '<text x="14" y="17" text-anchor="middle">' + d + "/" + t + "</text></svg>";
    }

    Object.keys(nodes).forEach(function (id) {
      var n = nodes[id], b = document.createElement("button");
      b.type = "button"; b.className = "mapa-node t" + (n.tema ? temaIdx[n.tema] : "x") + " " + n.col;
      b.dataset.id = id; b.title = id + " — " + n.sub;
      b.style.cssText = "left:" + X[n.col] + "px;top:" + pos[id] + "px;width:" + W[n.col] + "px;height:" + NH + "px";
      var u = n.col === "us" ? D.us.filter(function (q) { return q.id === id; })[0] : null;
      b.innerHTML = '<span class="mapa-txt"><b>' + esc(n.label) + "</b><small>" + esc(n.sub) + "</small></span>" + (u ? ring(u) : "");
      map.appendChild(b);
    });

    function drawLinks() {
      $("#mapa-links").innerHTML = edges.map(function (e) {
        var a = nodes[e[0]], b = nodes[e[1]];
        var x1 = X[a.col] + W[a.col], y1 = pos[e[0]] + NH / 2, x2 = X[b.col], y2 = pos[e[1]] + NH / 2, m = (x2 - x1) / 2;
        return '<path data-e="' + e[0] + ">" + e[1] + '" data-a="' + e[0] + '" data-b="' + e[1] + '" d="M' + x1 + "," + y1 + " C" + (x1 + m) + "," + y1 + " " + (x2 - m) + "," + y2 + " " + x2 + "," + y2 + '"/>';
      }).join("");
    }
    drawLinks();

    function chip(id) {
      var sub = "";
      if (D.cp[id]) sub = D.cp[id].nome; else if (D.rn[id]) sub = D.rn[id].nome; else if (D.rnf[id]) sub = D.rnf[id].nome; else if (nodes[id]) sub = nodes[id].sub;
      return '<button type="button" class="mapa-chip" data-open="' + id + '" title="' + esc(sub) + '">' + id + (sub ? " · " + esc(sub.length > 38 ? sub.slice(0, 36) + "…" : sub) : "") + "</button>";
    }
    var chipsOf = function (ids) { return '<div class="mapa-list">' + ids.map(chip).join("") + "</div>"; };
    $("#mapa-cps").innerHTML = Object.keys(D.cp).map(function (c) { return '<button type="button" class="mapa-chip" data-open="' + c + '">' + c + "</button>"; }).join("");
    $("#mapa-rns").innerHTML = Object.keys(D.rn).map(function (c) { return '<button type="button" class="mapa-chip" data-open="' + c + '" title="' + esc(D.rn[c].nome) + '">' + c + "</button>"; }).join("");
    $("#mapa-rnfs").innerHTML = Object.keys(D.rnf).map(function (c) { return '<button type="button" class="mapa-chip" data-open="' + c + '" title="' + esc(D.rnf[c].nome) + '">' + c + "</button>"; }).join("");

    /* ---------- destaque ---------- */
    function applyHl() {
      var a = hover || sel, s = activeSet(a);
      map.querySelectorAll(".mapa-node").forEach(function (n) {
        n.classList.toggle("dim", !!s && !s[n.dataset.id]);
        n.classList.toggle("sel", n.dataset.id === sel);
      });
      map.querySelectorAll("path").forEach(function (p) {
        var on = !!s && s[p.dataset.a] && s[p.dataset.b];
        p.classList.toggle("hl", !!on);
        p.classList.toggle("dim", !!s && !on);
      });
      root.querySelectorAll(".mapa-chip").forEach(function (c) { c.classList.toggle("sel", c.dataset.open === sel); });
    }
    function progress() {
      var t = 0, d = 0; D.us.forEach(function (u) { t += u.criterios.length; d += doneCount(u); });
      $("#mapa-prog-txt").textContent = "Critérios verificados: " + d + " de " + t;
      $("#mapa-prog-bar").style.width = (t ? 100 * d / t : 0) + "%";
    }
    progress();

    /* ---------- painel lateral ---------- */
    var oldDrawer = document.querySelector(".mapa-drawer");
    if (oldDrawer) oldDrawer.remove();
    var dr = document.createElement("aside");
    dr.className = "mapa-drawer"; dr.setAttribute("aria-hidden", "true");
    dr.innerHTML = '<div class="mapa-dhead"><div><div class="mapa-k" id="mapa-dk"></div><h2 id="mapa-dt"></h2></div>' +
      '<button type="button" class="mapa-btn" id="mapa-close" aria-label="Fechar painel">Fechar</button></div><div class="mapa-dbody" id="mapa-db"></div>';
    document.body.appendChild(dr);

    var docLink = function (file, id, text) { return '<a href="' + BASE + "documento-visao/" + file + "/#" + id.toLowerCase() + '">' + text + "</a>"; };
    function epicosDe(rule) { return Object.keys(D.epicos).filter(function (e) { return rule(D.epicos[e]); }); }

    function content(id) {
      var h = "", k, t;
      var u = D.us.filter(function (q) { return q.id === id; })[0];
      if (u) {
        var ep0 = D.epicos[u.epicos[0]];
        var rn = [], rnf = [];
        u.epicos.forEach(function (e) { D.epicos[e].rn.forEach(function (r) { if (rn.indexOf(r) < 0) rn.push(r); }); D.epicos[e].rnf.forEach(function (r) { if (rnf.indexOf(r) < 0) rnf.push(r); }); });
        var cps = u.epicos.map(function (e) { return D.epicos[e].cp; }).filter(function (v, i, a) { return a.indexOf(v) === i; });
        k = "User story · " + D.temas[ep0.tema].nome; t = u.id + " — " + u.nome;
        h = '<div class="mapa-story">' + esc(u.historia) + "</div>" +
          "<h4>Épico</h4>" + chipsOf(u.epicos) + "<h4>Característica de produto</h4>" + chipsOf(cps) +
          (u.rf ? '<h4>Requisito funcional</h4><p class="mapa-def"><a class="mapa-valor" href="' + BASE + (u.rfUrl || ("documento-visao/8_requisitos/#" + u.rf.toLowerCase())) + '">' + esc(u.rf) + "</a></p>" : "") +
          (u.ciclo ? '<h4>Ciclo</h4><p class="mapa-def"><a class="mapa-valor" href="' + BASE + u.cicloUrl + '">' + esc(u.ciclo) + "</a></p>" : "") +
          (u.valorNegocio ? '<h4>Valor de negócio e Esforço</h4><p class="mapa-def"><a class="mapa-valor" href="' + BASE + u.valorNegocioUrl + '">' + esc(u.valorNegocio) + "</a></p>" : "") +
          "<h4>Critérios de aceitação</h4><ul class=\"mapa-check\">" +
          u.criterios.map(function (c, i) {
            return '<li><label><input type="checkbox" disabled' + (isDone(u, i) ? " checked" : "") + "><span>" + esc(c) + "</span></label></li>";
          }).join("") + "</ul>" +
          '<span class="mapa-src">' + (u.issue ? 'Fonte: <a href="' + u.issueUrl + '" target="_blank" rel="noopener">issue #' + u.issue + "</a>" + (u.adaptado ? " (último critério reformulado)" : "") : "Critérios escritos no formato das issues; a história ainda não tem issue própria.") + "</span>" +
          "<h4>DoR (Definition of Ready)</h4>" + renderCheck(DOR_ITENS, dorPorUs[u.id]) +
          "<h4>DoD (Definition of Done)</h4>" + renderCheck(DOD_ITENS, dodPorUs[u.id]) +
          '<h4>Protótipo</h4><div class="mapa-proto"><img src="' + BASE + 'assets/prototipos/' + u.id.toLowerCase() + '.png" alt="Protótipo da ' + u.id + '" onerror="this.parentNode.classList.add(\'vazio\');this.remove()"><span>Espaço reservado para a captura do protótipo.</span></div>' +
          "<h4>Regras de negócio</h4>" + (rn.length ? chipsOf(rn) : '<p class="mapa-nada">Nenhuma regra de negócio específica.</p>') +
          "<h4>Requisitos não funcionais</h4>" + chipsOf(rnf) +
          '<p class="mapa-pagina"><a href="' + BASE + "user-stories/" + u.id.toLowerCase() + '/">Abrir a página desta história →</a></p>';
      } else if (D.oe[id]) {
        k = "Objetivo específico"; t = id + " — " + D.oe[id].curto;
        h = "<p>" + esc(D.oe[id].texto) + "</p><h4>Temas</h4>" + chipsOf(D.temaOrder.filter(function (x) { return D.temas[x].oe === id; })) +
          "<h4>Características de produto</h4>" + chipsOf(Object.keys(D.cp).filter(function (c) { return D.cp[c].oe === id; }));
      } else if (D.temas[id]) {
        k = "Tema"; t = id + " — " + D.temas[id].nome;
        h = "<h4>Objetivo específico</h4>" + chipsOf([D.temas[id].oe]) + "<h4>Épicos</h4>" + chipsOf(D.epicoOrder.filter(function (e) { return D.epicos[e].tema === id; }));
      } else if (D.epicos[id]) {
        var ep = D.epicos[id];
        k = "Épico"; t = id + " — " + ep.nome;
        h = "<h4>Tema</h4>" + chipsOf([ep.tema]) + "<h4>Característica de produto</h4>" + chipsOf([ep.cp]) +
          "<h4>User stories</h4>" + chipsOf(D.us.filter(function (q) { return q.epicos.indexOf(id) >= 0; }).map(function (q) { return q.id; })) +
          "<h4>Regras de negócio</h4>" + (ep.rn.length ? chipsOf(ep.rn) : '<p class="mapa-nada">Nenhuma regra de negócio específica.</p>') +
          "<h4>Requisitos não funcionais</h4>" + chipsOf(ep.rnf);
      } else if (D.cp[id]) {
        var cp = D.cp[id], eps = epicosDe(function (e) { return e.cp === id; });
        k = "Característica de produto"; t = id + " — " + cp.nome;
        h = '<p class="mapa-def"><b>' + docLink("2_solucao", id, "Ver na seção 2.3") + "</b></p><h4>Objetivo específico</h4>" + chipsOf([cp.oe]) +
          "<h4>Épicos</h4>" + chipsOf(eps) + "<h4>Regras de negócio</h4>" + chipsOf(Object.keys(D.rn).filter(function (r) { return D.rn[r].cps.indexOf(id) >= 0; })) +
          "<h4>Requisitos não funcionais</h4>" + chipsOf(Object.keys(D.rnf).filter(function (r) { return D.rnf[r].cps.indexOf(id) >= 0; }));
      } else if (D.rn[id] || D.rnf[id]) {
        var r = D.rn[id] || D.rnf[id];
        k = (D.rn[id] ? "Regra de negócio" : "Requisito não funcional" + (r.classe ? " · " + r.classe : "")); t = id + " — " + r.nome;
        h = "<h4>Relação no catálogo</h4><p>" + esc(r.rel) + "</p><h4>Aplica-se às histórias</h4>" + chipsOf(usApplying(id)) +
          '<p class="mapa-pagina">' + docLink("8_requisitos", id, "Ver no catálogo de requisitos →") + "</p>";
      }
      return { k: k, t: t, h: h };
    }
    function open(id) {
      var c = content(id); if (!c.h) return;
      sel = id; applyHl();
      $("#mapa-dk").textContent = c.k; $("#mapa-dt").textContent = c.t; $("#mapa-db").innerHTML = c.h;
      dr.classList.add("open"); dr.setAttribute("aria-hidden", "false");
    }
    function close() { sel = null; applyHl(); dr.classList.remove("open"); dr.setAttribute("aria-hidden", "true"); }

    /* ---------- eventos ---------- */
    document.addEventListener("click", function (e) {
      var o = e.target.closest ? e.target.closest("[data-open]") : null;
      if (o && (root.contains(o) || dr.contains(o))) { open(o.dataset.open); return; }
      var n = e.target.closest ? e.target.closest(".mapa-node") : null;
      if (n && root.contains(n)) { (sel === n.dataset.id && dr.classList.contains("open")) ? close() : open(n.dataset.id); return; }
      if (e.target.id === "mapa-close") close();
      if (e.target.id === "mapa-full") {
        var on = root.classList.toggle("mapa-tela");
        document.body.classList.toggle("mapa-sem-rolagem", on);
        e.target.textContent = on ? "Sair da tela cheia" : "Tela cheia";
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { if (dr.classList.contains("open")) close(); else if (root.classList.contains("mapa-tela")) $("#mapa-full").click(); }
    });
    map.addEventListener("mouseover", function (e) { var n = e.target.closest(".mapa-node"); var id = n ? n.dataset.id : null; if (id !== hover) { hover = id; applyHl(); } });
    map.addEventListener("mouseleave", function () { hover = null; applyHl(); });

    function syncIssues() {
      fetch("https://api.github.com/repos/mdsreq-fga-unb/REQ-2026.2-T01-IBRADA-NET/issues?state=all&per_page=100")
        .then(function (res) { return res.ok ? res.json() : []; })
        .then(function (items) {
          var porNumero = {};
          items.forEach(function (it) { porNumero[it.number] = it; });

          D.us.forEach(function (u) {
            var it = u.issue ? porNumero[u.issue] : null;
            if (!it) return;
            var matches = (it.body || "").match(/^\s*[-*]\s+\[([ xX])\]/gm) || [];
            var nCrit = u.criterios.length;
            var nDor = DOR_ITENS.length;
            var nDod = DOD_ITENS.length;

            function indicesMarcados(lista) {
              var out = [];
              lista.forEach(function (m, idx) { if (/\[[xX]\]/.test(m)) out.push(idx); });
              return out;
            }

            feitosPorUs[u.id] = indicesMarcados(matches.slice(0, nCrit));
            dorPorUs[u.id] = indicesMarcados(matches.slice(nCrit, nCrit + nDor));
            dodPorUs[u.id] = indicesMarcados(matches.slice(nCrit + nDor, nCrit + nDor + nDod));

            var r = map.querySelector('.mapa-node[data-id="' + u.id + '"] .mapa-ring');
            if (r) r.outerHTML = ring(u);
          });

          progress();
          if (sel && dr.classList.contains("open")) open(sel);
        })
        .catch(function () {});
    }
    syncIssues();
  }

  initMapa();
  if (typeof document$ !== "undefined") {
    document$.subscribe(initMapa);
  }
})();