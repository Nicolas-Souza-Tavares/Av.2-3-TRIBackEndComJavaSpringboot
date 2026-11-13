(() => {
  "use strict";

  const POSTS_KEY = "gataria-posts-v1";
  const seedPosts = [
    {
      id: "o-apartamento-tambem-e-territorio",
      title: "O apartamento também é território de aventura",
      category: "Comportamento",
      summary: "Janelas, prateleiras e pequenos rituais podem transformar a rotina de casa para o seu gato.",
      content: "Para um gato, casa não é só cenário: é mapa, cheiro, altura e lugar seguro. Quando a gente olha o apartamento na altura dos bigodes, percebe quantas descobertas cabem em poucos metros quadrados.\n\nUma janela protegida vira cinema ao vivo. Uma caixa de papelão pode ser esconderijo por dias. E uma prateleira firme, instalada num caminho tranquilo, oferece aquele ponto alto que tantos gatos procuram para observar o movimento sem serem incomodados.\n\nO segredo é apresentar as novidades devagar. Deixe o gato investigar no tempo dele e mantenha rotas de fuga e cantinhos de descanso. Plantas precisam ser escolhidas com cuidado e telas bem instaladas fazem parte de qualquer janela segura.\n\nEnriquecer o ambiente não pede uma reforma. Pede curiosidade: experimente mudar um brinquedo de lugar, esconder alguns petiscos ou reservar um momento para brincar juntos. A casa fica mais interessante quando também conta a história de quem vive nela.",
      image: "",
      publishedAt: "2026-10-18"
    },
    {
      id: "brincadeira-boa-tem-pausa",
      title: "Brincadeira boa também tem hora de pausa",
      category: "Enriquecimento",
      summary: "Uma rotina simples de caça, movimento e descanso respeita o jeito felino de brincar.",
      content: "Brincar é mais do que gastar energia. Para muitos gatos, a brincadeira imita uma pequena sequência de caça: perceber, perseguir, alcançar e, no fim, descansar. Um brinquedo leve preso a uma vareta pode criar essa história sem precisar de nada complicado.\n\nFaça movimentos que pareçam imprevisíveis e deixe o gato capturar o brinquedo de vez em quando. Se ele nunca consegue alcançar o alvo, a diversão pode virar frustração. Também vale alternar os objetos: bolinhas, túneis e brinquedos recheáveis trazem novidades sem transformar a sala num parque permanente.\n\nSessões curtas, de alguns minutos, podem funcionar melhor do que insistir quando o gato já perdeu o interesse. Observe as orelhas, a cauda e o ritmo da respiração. Sinais de cansaço pedem uma pausa e um lugar tranquilo para recuperar o fôlego.\n\nCada gato tem seu próprio compasso. O melhor roteiro é aquele que termina com curiosidade satisfeita, água fresca por perto e um cochilo sem pressa.",
      image: "",
      publishedAt: "2026-09-29"
    },
    {
      id: "cuidado-diario-sem-complicar",
      title: "Cuidado diário, sem complicar o cotidiano",
      category: "Cuidados",
      summary: "Água fresca, observação atenta e bons hábitos fazem diferença no bem-estar de todo dia.",
      content: "Cuidar de um gato acontece em gestos pequenos e repetidos. Trocar a água, manter a caixa de areia limpa e reparar se o apetite ou o comportamento mudaram são maneiras simples de acompanhar como ele está.\n\nUma escovação gentil pode ser um momento bom para os dois, desde que o gato esteja confortável. Comece com pouco tempo, use uma escova macia e pare se ele demonstrar incômodo. Nem todo gato gosta do mesmo tipo de toque, e respeitar esse limite também é cuidado.\n\nMudanças persistentes na alimentação, na energia ou no uso da caixa merecem atenção. Para orientações sobre saúde e prevenção, converse com um médico-veterinário que conheça o histórico do seu companheiro. Dicas gerais nunca substituem uma avaliação profissional.\n\nNo fim, a rotina mais útil é aquela que cabe na vida real e deixa espaço para observar. Às vezes, conhecer bem o jeito de sempre é o que nos ajuda a notar quando algo mudou.",
      image: "",
      publishedAt: "2026-09-12"
    }
  ];

  const app = document.querySelector("#app");
  const toast = document.querySelector("#toast");
  let posts = loadPosts();
  let activeCategory = "Todas";
  let searchTerm = "";
  let toastTimer;

  function loadPosts() {
    try {
      const stored = localStorage.getItem(POSTS_KEY);
      if (!stored) return [...seedPosts];
      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed)) return [...seedPosts];
      const normalized = parsed.map((post) => ({ ...post, image: "" }));
      try { localStorage.setItem(POSTS_KEY, JSON.stringify(normalized)); } catch {}
      return normalized;
    } catch {
      return [...seedPosts];
    }
  }

  function savePosts() {
    try {
      localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
      return true;
    } catch {
      return false;
    }
  }

  function escapeHtml(value = "") {
    return String(value).replace(/[&<>"']/g, (character) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;"
    })[character]);
  }

  function formatDate(value) {
    if (!value) return "recém-publicado";
    const [year, month, day] = value.slice(0, 10).split("-").map(Number);
    return new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "long", year: "numeric" })
      .format(new Date(year, month - 1, day));
  }

  function readMinutes(post) {
    const words = `${post.summary || ""} ${post.content || ""}`.trim().split(/\s+/).length;
    return Math.max(2, Math.ceil(words / 190));
  }

  function catMark() {
    return `<svg viewBox="0 0 64 64" fill="none" aria-hidden="true"><path d="M15 27 12 12l15 8a24 24 0 0 1 10 0l15-8-3 16a21 21 0 1 1-34 0Z" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"/><path d="M23 34h.1M41 34h.1M27 42c3.3 3 6.7 3 10 0M32 37l-2 2h4l-2-2Z" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><path d="m18 39-9-2m9 7-9 2m37-7 9-2m-9 7 9 2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`;
  }

  function imageMarkup(post, className = "post-card-image") {
    if (post.image) {
      return `<img class="${className}" src="${escapeHtml(post.image)}" alt="${escapeHtml(post.imageAlt || post.title)}" loading="lazy" />`;
    }
    return `<div class="post-placeholder" aria-label="Ilustração de gato">${catMark()}</div>`;
  }

  function cardMarkup(post) {
    return `<article class="post-card">
      <a class="post-card-link" href="#artigo/${encodeURIComponent(post.id)}" aria-label="Ler: ${escapeHtml(post.title)}">
        <div class="post-card-image-wrap">${imageMarkup(post)}</div>
        <div class="post-meta"><span class="post-category">${escapeHtml(post.category)}</span><span class="meta-dot" aria-hidden="true"></span><time datetime="${escapeHtml(post.publishedAt)}">${formatDate(post.publishedAt)}</time></div>
        <h3>${escapeHtml(post.title)}</h3>
        <p class="post-card-summary">${escapeHtml(post.summary)}</p>
        <div class="post-card-bottom"><span>${readMinutes(post)} min de leitura</span><span aria-hidden="true">→</span></div>
      </a>
    </article>`;
  }

  function setActiveNav(route) {
    document.querySelectorAll("[data-nav]").forEach((link) => link.removeAttribute("aria-current"));
    const target = route === "write" ? "write" : route === "article" ? "readings" : "home";
    document.querySelector(`[data-nav="${target}"]`)?.setAttribute("aria-current", "page");
  }

  function categories() {
    return ["Todas", ...new Set(posts.map((post) => post.category).filter(Boolean))];
  }

  function renderCards() {
    const target = document.querySelector("#post-grid");
    if (!target) return;
    const normalized = searchTerm.trim().toLocaleLowerCase("pt-BR");
    const filtered = posts
      .filter((post) => activeCategory === "Todas" || post.category === activeCategory)
      .filter((post) => !normalized || `${post.title} ${post.category} ${post.summary}`.toLocaleLowerCase("pt-BR").includes(normalized))
      .sort((a, b) => (b.publishedAt || "").localeCompare(a.publishedAt || ""));
    target.innerHTML = filtered.length
      ? filtered.map(cardMarkup).join("")
      : `<div class="empty-state"><strong>Nenhum miado por aqui.</strong>Tente outra palavra ou escolha uma categoria diferente.</div>`;
    const count = document.querySelector("#post-count");
    if (count) count.textContent = `${filtered.length} ${filtered.length === 1 ? "leitura" : "leituras"}`;
  }

  function renderHome(scrollToReadings = false) {
    setActiveNav("home");
    const filterButtons = categories().map((category) => `<button class="filter-button" type="button" data-category="${escapeHtml(category)}" aria-pressed="${category === activeCategory}">${escapeHtml(category)}</button>`).join("");
    app.innerHTML = `
      <section class="home-hero" aria-labelledby="hero-title">
        <div class="hero-copy">
          <p class="eyebrow">um caderno felino</p>
          <h1 id="hero-title">A vida fica mais bonita <em>com um gato por perto.</em></h1>
          <p class="hero-lede">Histórias, descobertas e ideias gentis para cuidar melhor de quem divide a casa — e o melhor lugar do sofá — com a gente.</p>
          <div class="hero-actions"><a class="button-primary" href="#leituras">Explorar as leituras <span aria-hidden="true">↓</span></a><a class="button-quiet" href="#escrever">Tem uma história? Conte aqui.</a></div>
        </div>
        <div class="hero-image-wrap">
          <img class="hero-image" src="${window.GATARIA_IMAGES.hero}" alt="Gato ruivo aproveitando a luz da manhã perto da janela" fetchpriority="high" />
          <div class="hero-stamp"><span>um pequeno</span>mundo<br />de bigodes</div>
        </div>
      </section>
      <section id="leituras" class="readings-section" aria-labelledby="readings-title">
        <div class="section-inner">
          <div class="section-heading"><div><p class="eyebrow">o caderno de miados</p><h2 id="readings-title">Leituras para<br />ficar por perto.</h2></div><p>Pequenas histórias sobre viver junto, entender os sinais e deixar a rotina mais interessante.</p></div>
          <div class="reading-tools">
            <div class="category-list" role="group" aria-label="Filtrar publicações por categoria">${filterButtons}</div>
            <label class="search-box"><svg width="15" height="15" viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="8.7" cy="8.7" r="5.7" stroke="currentColor" stroke-width="1.5"/><path d="m13 13 4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg><input id="post-search" type="search" placeholder="Procurar no caderno" aria-label="Buscar publicações" /></label>
          </div>
          <div class="post-grid" id="post-grid" aria-live="polite"></div>
          <p id="post-count" class="sr-only" aria-live="polite"></p>
        </div>
      </section>
      <section class="about-band" aria-labelledby="about-title">
        <div class="about-mark">${catMark()}</div>
        <div class="about-copy"><p class="eyebrow">um blog feito de afeto</p><h2 id="about-title">A casa é deles.<br />A gente só mora junto.</h2><p>A Gataria é um diário pessoal sobre gatos e a vida ao lado deles. Por aqui cabem dicas possíveis, observações do cotidiano e aquele tipo de carinho que sempre encontra espaço no sofá.</p><a class="about-signoff" href="#escrever">Com licença, vou escrever →</a></div>
      </section>`;

    renderCards();
    const searchInput = document.querySelector("#post-search");
    if (searchInput) searchInput.value = searchTerm;
    document.querySelectorAll("[data-category]").forEach((button) => button.addEventListener("click", () => {
      activeCategory = button.dataset.category;
      document.querySelectorAll("[data-category]").forEach((item) => item.setAttribute("aria-pressed", String(item.dataset.category === activeCategory)));
      renderCards();
    }));
    searchInput?.addEventListener("input", (event) => {
      searchTerm = event.currentTarget.value;
      renderCards();
    });
    if (scrollToReadings) requestAnimationFrame(() => document.querySelector("#leituras")?.scrollIntoView({ behavior: "smooth" }));
  }

  function bodyMarkup(content) {
    return String(content || "").split(/\n\s*\n/).map((paragraph) => paragraph.trim()).filter(Boolean)
      .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, "<br />")}</p>`).join("");
  }

  function renderArticle(id) {
    const post = posts.find((item) => item.id === id);
    if (!post) return renderNotFound();
    setActiveNav("article");
    const related = posts.filter((item) => item.id !== post.id).slice(0, 2);
    app.innerHTML = `<article class="page-shell">
      <a class="back-link" href="#leituras"><span aria-hidden="true">←</span> Voltar para as leituras</a>
      <header class="article-header"><p class="eyebrow">${escapeHtml(post.category)}</p><h1>${escapeHtml(post.title)}</h1><p class="article-deck">${escapeHtml(post.summary)}</p><div class="article-byline"><span>Gataria</span><span aria-hidden="true">·</span><time datetime="${escapeHtml(post.publishedAt)}">${formatDate(post.publishedAt)}</time><span aria-hidden="true">·</span><span>${readMinutes(post)} min de leitura</span></div></header>
      <figure class="article-cover">${imageMarkup(post, "")}</figure>
      <div class="article-body">${bodyMarkup(post.content)}</div>
      <div class="article-end">${catMark()}<span>Um afago demorado e até a próxima.</span></div>
      ${related.length ? `<h2 class="related-heading">Mais histórias do caderno</h2><div class="related-grid">${related.map(cardMarkup).join("")}</div>` : ""}
    </article>`;
  }

  function renderWrite() {
    setActiveNav("write");
    app.innerHTML = `<section class="write-shell" aria-labelledby="write-title">
      <a class="back-link" href="#inicio"><span aria-hidden="true">←</span> Voltar ao início</a>
      <header class="write-intro"><p class="eyebrow">seu espaço no caderno</p><h1 id="write-title">Toda boa história<br />merece um cantinho.</h1><p>Escreva uma dica, uma lembrança ou uma descoberta. Quando publicar, seu texto aparece nas leituras da Gataria.</p></header>
      <div class="write-layout">
        <form class="publish-form" id="publish-form" novalidate>
          <div class="form-field"><label for="post-title">Título <span>· obrigatório</span></label><input id="post-title" name="title" type="text" maxlength="100" placeholder="Uma frase que dá vontade de ler" required autocomplete="off" /><div class="form-error" data-error="title"></div></div>
          <div class="form-row">
            <div class="form-field"><label for="post-category">Categoria <span>· obrigatório</span></label><select id="post-category" name="category" required><option value="">Escolha uma categoria</option><option>Comportamento</option><option>Enriquecimento</option><option>Cuidados</option><option>Bem-estar</option><option>Curiosidades</option><option>Tutoriais</option><option>Notícias</option></select><div class="form-error" data-error="category"></div></div>
            <div class="form-field"><label for="post-summary">Resumo <span>· obrigatório</span></label><input id="post-summary" name="summary" type="text" maxlength="180" placeholder="Conte um pouquinho do que vem por aí" required /><div class="form-help"><span>Uma linha para apresentar sua história.</span><span id="summary-count">0/180</span></div><div class="form-error" data-error="summary"></div></div>
          </div>
          <div class="form-field"><label for="post-content">Conteúdo <span>· obrigatório</span></label><textarea id="post-content" name="content" minlength="40" maxlength="10000" placeholder="Pode escrever com calma. Separe os parágrafos com uma linha em branco." required></textarea><div class="form-help"><span>Escreva pelo menos 40 caracteres.</span><span id="content-count">0</span></div><div class="form-error" data-error="content"></div></div>
          <div class="form-submit-row"><button class="button-primary" type="submit">Publicar no caderno <span aria-hidden="true">↗</span></button><p>Seu artigo fica guardado<br />neste navegador.</p></div>
        </form>
        <aside class="write-aside"><p class="aside-label">uma nota antes de começar</p><h2>Escreva como quem conta uma história.</h2><p>Um conselho que funcionou, uma cena engraçada ou uma dúvida que virou descoberta: o melhor texto é o que nasce da convivência.</p><ul><li>Escolha um título fácil de encontrar.</li><li>Conte o contexto junto com a dica.</li><li>Para saúde, procure sempre orientação veterinária.</li></ul></aside>
      </div>
    </section>`;

    const form = document.querySelector("#publish-form");
    const summary = document.querySelector("#post-summary");
    const content = document.querySelector("#post-content");
    summary.addEventListener("input", () => { document.querySelector("#summary-count").textContent = `${summary.value.length}/180`; });
    content.addEventListener("input", () => { document.querySelector("#content-count").textContent = `${content.value.length} caracteres`; });
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      form.querySelectorAll(".form-error").forEach((node) => { node.textContent = ""; });
      const values = Object.fromEntries(new FormData(form).entries());
      const errors = {};
      if (values.title.trim().length < 4) errors.title = "Escreva um título com pelo menos 4 caracteres.";
      if (!values.category) errors.category = "Escolha uma categoria para organizar a publicação.";
      if (values.summary.trim().length < 12) errors.summary = "Conte um pouco mais no resumo (pelo menos 12 caracteres).";
      if (values.content.trim().length < 40) errors.content = "O conteúdo precisa ter pelo menos 40 caracteres.";
      if (Object.keys(errors).length) {
        Object.entries(errors).forEach(([field, message]) => { form.querySelector(`[data-error="${field}"]`).textContent = message; });
        form.querySelector(`[data-error="${Object.keys(errors)[0]}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
      const newPost = {
        id: `post-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        title: values.title.trim(),
        category: values.category,
        summary: values.summary.trim(),
        content: values.content.trim(),
        image: "",
        publishedAt: new Date().toISOString().slice(0, 10)
      };
      posts = [newPost, ...posts];
      const persisted = savePosts();
      sessionStorage.setItem("gataria-last-published", persisted ? "saved" : "session-only");
      location.hash = `#artigo/${encodeURIComponent(newPost.id)}`;
    });
  }

  function renderNotFound() {
    setActiveNav("home");
    app.innerHTML = `<section class="not-found"><p class="eyebrow">página não encontrada</p><h1>Esse cantinho ficou vazio.</h1><p>A publicação pode ter sido removida ou o endereço não existe.</p><a class="button-primary" href="#inicio">Voltar para a Gataria</a></section>`;
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 5200);
  }

  function route() {
    const hash = decodeURIComponent(location.hash.slice(1) || "inicio");
    if (hash === "escrever") {
      renderWrite();
      window.scrollTo(0, 0);
      return;
    }
    if (hash === "leituras") return renderHome(true);
    if (hash.startsWith("artigo/")) {
      renderArticle(hash.slice("artigo/".length));
      window.scrollTo(0, 0);
      return;
    }
    return renderHome(hash === "leituras");
  }

  document.querySelector("#year").textContent = new Date().getFullYear();
  window.addEventListener("hashchange", route);
  route();

  const savedNotice = sessionStorage.getItem("gataria-last-published");
  if (savedNotice) {
    sessionStorage.removeItem("gataria-last-published");
    window.setTimeout(() => showToast(savedNotice === "saved" ? "Artigo publicado e salvo neste navegador. Que bom ter sua história por aqui." : "Artigo adicionado a esta sessão. O navegador não permitiu salvar uma cópia permanente."), 350);
  }
})();