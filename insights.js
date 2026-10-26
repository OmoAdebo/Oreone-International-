(() => {
  const list = document.querySelector('#insights-list');
  const status = document.querySelector('#cms-status');
  const cfg = window.OREONE_CONFIG || {};
  const supabaseKey = cfg.supabasePublishableKey || cfg.supabaseAnonKey;
  const configured = Boolean(cfg.supabaseUrl && supabaseKey && window.supabase?.createClient);
  const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const dateText = value => {
    if (!value) return 'Oreone Insights';
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? 'Oreone Insights' : new Intl.DateTimeFormat('en-NG',{year:'numeric',month:'short',day:'numeric'}).format(d);
  };
  if (!list || !status) return;
  if (!configured) {
    list.innerHTML = '<div class="card"><h3>Insights publishing is being connected</h3><p>Published Oreone articles will appear here when the CMS setup is complete.</p></div>';
    status.textContent = 'CMS setup pending: the published article library is not connected yet.';
    return;
  }
  const client = window.supabase.createClient(cfg.supabaseUrl, supabaseKey);
  client.from('insights').select('id,title,slug,excerpt,category,author,featured_image_url,published_at,created_at').eq('status','published').order('published_at',{ascending:false}).then(({data,error}) => {
    if (error) {
      list.innerHTML = '<div class="card"><h3>Insights are temporarily unavailable</h3><p>Please try again later, or contact Oreone if you need information.</p></div>';
      status.textContent = 'The Insights CMS could not be reached. The page has not displayed draft content.';
      console.error('Oreone Insights CMS:', error.message);
      return;
    }
    if (!data || data.length === 0) {
      list.innerHTML = '<div class="card"><h3>No published insights yet</h3><p>New articles will appear here when the Oreone team publishes them.</p></div>';
      status.textContent = 'The CMS is connected. No articles have been published yet.';
      return;
    }
    list.innerHTML = data.map((a,i) => {
      const image = a.featured_image_url && /^https?:\/\//i.test(a.featured_image_url) ? `<img class="article-card-image" src="${escapeHTML(a.featured_image_url)}" alt="" loading="lazy">` : `<div class="article-image photo-topic-${i%3}">${escapeHTML(a.category || 'Oreone Insights')}</div>`;
      return `<article class="card article-card">${image}<div class="article-body"><span class="tag">${escapeHTML(a.category)}</span><h3><a href="/insights/${encodeURIComponent(a.slug)}">${escapeHTML(a.title)}</a></h3><p>${escapeHTML(a.excerpt)}</p><div class="article-meta">${escapeHTML(a.author || 'Oreone International')} · ${escapeHTML(dateText(a.published_at || a.created_at))}</div><a class="card-link" href="/insights/${encodeURIComponent(a.slug)}">Read insight →</a></div></article>`;
    }).join('');
    status.textContent = `${data.length} published ${data.length === 1 ? 'insight' : 'insights'} loaded from the Oreone CMS.`;
  });
})();
