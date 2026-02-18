// smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(link=>{
  link.addEventListener("click",e=>{
    const target=document.querySelector(link.getAttribute("href"));
    if(!target)return;
    e.preventDefault();
    target.scrollIntoView({behavior:"smooth"});
  });
});

// scroll animations
const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add("show");
    }
  });
},{threshold:0.15});

document.querySelectorAll(
  ".career-card,.skill,.enroll-card,.feature-card"
).forEach(el=>{
  el.classList.add("fade-up");
  observer.observe(el);
});