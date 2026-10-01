export function mountAtmosphere(){
 const root=document.querySelector('.nightmare-shell');if(!root)return;
 const upload=document.querySelector('#backgroundUpload');const saved=localStorage.getItem('pn.background');
 if(saved)apply(saved);
 upload?.addEventListener('change',e=>{const f=e.target.files?.[0];if(!f)return;const r=new FileReader();r.onload=()=>{localStorage.setItem('pn.background',r.result);apply(r.result)};r.readAsDataURL(f)});
 window.addEventListener('mousemove',e=>{document.querySelectorAll('.pn-sentinel img').forEach((img,i)=>{const x=(e.clientX/innerWidth-.5)*2,y=(e.clientY/innerHeight-.5)*2;img.style.transform='translate('+(x*(i?-7:7))+'px,'+(y*6)+'px)'})});
 function apply(src){const bg=root.querySelector('.pn-background');if(!bg)return;bg.innerHTML='';if(src.startsWith('data:video/')){const v=document.createElement('video');v.src=src;v.autoplay=true;v.loop=true;v.muted=true;v.playsInline=true;bg.appendChild(v)}else bg.style.backgroundImage='url("'+src+'")';root.classList.add('custom-background')}
}