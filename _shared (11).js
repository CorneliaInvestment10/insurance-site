(function(){
  const ham = document.getElementById('ham');
  const mnav = document.getElementById('mobileNav');
  if(ham && mnav){
    ham.addEventListener('click', () => {
      ham.classList.toggle('open');
      mnav.classList.toggle('open');
    });
  }
  window.addEventListener('scroll', () => {
    const nb = document.querySelector('.navbar');
    if(nb) nb.classList.toggle('scrolled', window.scrollY > 30);
  });
})();
