// retirar o modal da tela caso houver erro


if (document.querySelector('#modalErro')) {
    const errorMessageElement = document.querySelector('#modalErro');

    setTimeout(() => {
        errorMessageElement.style.display = 'none';
    }, 3000); 

    errorMessageElement.addEventListener('click', ()=>{
        errorMessageElement.style.display = 'none';
    })
    
}

if (document.querySelector('#modalCorreto')) {
    const corretMessageElement = document.querySelector('#modalCorreto');
    
    setTimeout(() => {
        corretMessageElement.style.display = 'none';
    }, 3000); 

    corretMessageElement.addEventListener('click', ()=>{
        corretMessageElement.style.display = 'none';
    })
    
}

