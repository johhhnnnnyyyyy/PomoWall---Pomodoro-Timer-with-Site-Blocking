//code for switching slides

const slides=document.querySelectorAll('.slide');
const arrows=document.querySelectorAll('.A');
let currSlide=0;
const totalSlide=3;  //focus=0,short break=1,long break=2

function prevSlide(){
  slides[currSlide].classList.remove('active');
  currSlide=(currSlide-1+totalSlide)%3;
  slides[currSlide].classList.add('active');
}
function nextSlide(){
  slides[currSlide].classList.remove('active');
  currSlide=(currSlide+1)%3;
  slides[currSlide].classList.add('active');
}

arrows.forEach(arrow => {
  arrow.addEventListener('click',()=>{
    if(arrow.classList.contains('left'))        prevSlide();
    else if(arrow.classList.contains('right'))  nextSlide();
  })
});


//PENDING - clickabilty, MAIN CHROME EXTENSION LOGIC