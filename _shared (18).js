(function(){
  const ham = document.getElementById('ham');
  const mnav = document.getElementById('mobileNav');
  if(ham && mnav){
    mnav.style.display = 'none';
    ham.addEventListener('click', () => {
      ham.classList.toggle('open');
      const isOpen = ham.classList.contains('open');
      mnav.classList.toggle('open', isOpen);
      mnav.style.display = isOpen ? 'flex' : 'none';
    });
  }
  window.addEventListener('scroll', () => {
    const nb = document.querySelector('.navbar');
    if(nb) nb.classList.toggle('scrolled', window.scrollY > 30);
  });
})();
