var openModalAdicionarMonitor = document.querySelector('#openModalAdicionarMonitor')
var modalAdicionarMonitor = document.querySelector('#modalAdicionarMonitor');
var closeAdicionarMonitor = document.querySelector('#closeAdicionarMonitor');

modalAdicionarMonitor.addEventListener('click', function(){
    modalAdicionarMonitor.classList.toggle('active');
})

openModalAdicionarMonitor.addEventListener('click', function(){
    modalAdicionarMonitor.classList.toggle('active');
})

closeAdicionarMonitor.addEventListener('click', function(){
    modalAdicionarMonitor.classList.toggle('active');
})