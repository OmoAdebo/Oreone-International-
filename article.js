(() => {
  const $ = id => document.getElementById(id);
  const cfg = window.OREONE_CONFIG || {};
  const status = $('article-status');
  const pathParts = window.location.pathname.split('/').filter(Boolean);
  const slug = new URLSearchParams(window.location.search).get('slug') || (pathParts[0] === 'insights' ? pathParts[1] : '');
  const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  function setMeta(name, value, property=false) {
    if (!value) return;
    const attr = property ? 'property' : 'name';
    let el = document.querySelector(`meta[${attr}="${name}"]`);
    if (!el) { el=document.createElement('meta'); el.setAttribute(attr,name); document.head.appendChild(el); }
    el.content=value;
  }
  if (!slug) { status.textContent='No article was specified. Return to Insights to choose an article.'; $('article-title').textContent='Insight not found'; return; }
  const supabaseKey = cfg.supabasePublishableKey || cfg.supabaseAnonKey;
  if (!(cfg.supabaseUrl && supabaseKey && window.supabase?.createClient)) { status.textContent='The Insights CMS has not been configured yet. Please check back later.'; $('article-title').textContent='Insights setup in progress'; $('article-body').textContent='Oreone is preparing its Insights publishing system.'; return; }
  const client=window.supabase.createClient(cfg.supabaseUrl,supabaseKey);
  client.from('insights').select('title,slug,excerpt,body,category,author,featured_image_url,seo_title,meta_description,published_at,created_at').eq('slug',slug).eq('status','published').maybeSingle().then(({data,error})=>{
    if (error || !data) { $('article-title').textContent='Insight not found'; $('article-excerpt').textContent='This article may not be published or the link may be incorrect.'; $('article-body').textContent='Please return to the Insights page to see available articles.'; status.textContent='Article unavailable.'; document.title='Insight not found | Oreone'; return; }
    const title=data.seo_title || `${data.title} | Oreone Insights`;
    document.title=title;
    $('article-title').textContent=data.title;
    $('article-excerpt').textContent=data.excerpt || '';
    $('article-meta').textContent=`${data.category || 'Oreone Insights'} · ${data.author || 'Oreone International'} · ${data.published_at ? new Intl.DateTimeFormat('en-NG',{year:'numeric',month:'long',day:'numeric'}).format(new Date(data.published_at)) : ''}`;
    $('article-body').textContent=data.body || '';
    if(data.featured_image_url && /^https?:\/\//i.test(data.featured_image_url)){const img=$('article-featured-image');img.src=data.featured_image_url;img.alt=data.title;img.classList.remove('hidden');}
    setMeta('description',data.meta_description || data.excerpt);
    setMeta('og:title',title,true);setMeta('og:description',data.meta_description || data.excerpt,true);setMeta('og:type','article',true);
    let canonical=document.querySelector('link[rel="canonical"]');if(!canonical){canonical=document.createElement('link');canonical.rel='canonical';document.head.appendChild(canonical);}canonical.href=window.location.origin+window.location.pathname;
    const structured={"@context":"https://schema.org","@type":"Article","headline":data.title,"description":data.meta_description || data.excerpt,"author":{"@type":"Organization","name":data.author || 'Oreone International Limited'},"publisher":{"@type":"Organization","name":"Oreone International Limited"},"datePublished":data.published_at || data.created_at,"mainEntityOfPage":canonical.href};
    if(data.featured_image_url && /^https?:\/\//i.test(data.featured_image_url)) structured.image=[data.featured_image_url];
    const jsonld=document.createElement('script');jsonld.type='application/ld+json';jsonld.textContent=JSON.stringify(structured);document.head.appendChild(jsonld);
    status.textContent='';
  });
})();
