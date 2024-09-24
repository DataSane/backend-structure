var openModalAdicionarMonitor = document.querySelector('#openModalAdicionarMonitor')
var closeAdicionarMonitor = document.querySelector('#closeAdicionarMonitor');

openModalAdicionarMonitor.addEventListener('click', function(){
    modalAdicionarMonitor.classList.toggle('active');
})


closeAdicionarMonitor.addEventListener('click', function(){
    modalAdicionarMonitor.classList.toggle('active');
})