(() => {
  const path=window.location.pathname;
  let canonicalPath=path;
  if(canonicalPath==='/index.html'||canonicalPath==='/')canonicalPath='/';
  else canonicalPath=canonicalPath.replace(/\.html$/,'').replace(/\/$/,'');
  if(path.startsWith('/insights/'))canonicalPath=path.replace(/\/$/,'');
  let link=document.querySelector('link[rel="canonical"]');
  if(!link){link=document.createElement('link');link.rel='canonical';document.head.appendChild(link);}
  link.href=window.location.origin+canonicalPath;
  let og=document.querySelector('meta[property="og:url"]');
  if(!og){og=document.createElement('meta');og.setAttribute('property','og:url');document.head.appendChild(og);}
  og.content=link.href;
})();
