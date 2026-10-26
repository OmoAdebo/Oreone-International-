const toggle=document.querySelector('.menu-toggle');
const nav=document.querySelector('.nav-links');
if(toggle&&nav){toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');toggle.setAttribute('aria-expanded','false')}));}
const year=document.querySelector('[data-year]');if(year)year.textContent=new Date().getFullYear();

const contactForm=document.querySelector('#contact-form');
if(contactForm){
  contactForm.addEventListener('submit',async e=>{
    e.preventDefault();
    if(!contactForm.reportValidity())return;
    const data=new FormData(contactForm);
    const subject=`Website enquiry: ${data.get('enquiry')||'General Enquiry'}`;
    const body=`Name: ${data.get('name')}\nEmail: ${data.get('email')}\nOrganisation: ${data.get('organisation')||'Not provided'}\nPhone: ${data.get('phone')||'Not provided'}\nEnquiry type: ${data.get('enquiry')}\n\nMessage:\n${data.get('message')}`;
    const status=document.querySelector('#form-status');
    const endpoint=(window.OREONE_CONFIG||{}).formsparkEndpoint||'';
    const submitButton=contactForm.querySelector('button[type="submit"]');
    const liveEndpoint=endpoint.startsWith('https://submit-form.com/')&&!/YOUR|REPLACE|FORM_ID/i.test(endpoint);
    if(liveEndpoint){
      if(submitButton){submitButton.disabled=true;submitButton.textContent='Sending…';}
      if(status)status.textContent='Sending your enquiry securely…';
      try{
        const response=await fetch(endpoint,{method:'POST',body:data,headers:{'Accept':'application/json'}});
        if(!response.ok)throw new Error(`Submission returned ${response.status}`);
        if(status)status.textContent='Thank you. Your enquiry was submitted successfully. Oreone will follow up using the contact details you provided.';
        contactForm.reset();
      }catch(err){
        console.error('Contact form submission failed:',err);
        if(status){status.textContent='The online form could not submit your enquiry. Please email support.oreoneinc@gmail.com directly; your message has not been confirmed as sent.';}
      }finally{if(submitButton){submitButton.disabled=false;submitButton.textContent='Send enquiry →';}}
      return;
    }
    const mailto=`mailto:support.oreoneinc@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    if(status)status.textContent='The online email service is not configured yet. Your email application will open with the enquiry prepared; press Send there to complete delivery.';
    window.location.href=mailto;
  });
}
