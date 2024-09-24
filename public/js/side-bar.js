var accordionItemList = document.querySelectorAll('.accordion-item');


for(let i = 0; i < accordionItemList.length; i++){
    accordionItemList[i].addEventListener('click', ()=>{
        accordionItemList[i].classList.toggle('drop-active');
    })
}