//code for switching slides

const slides=document.querySelectorAll('.slide');
const arrows=document.querySelectorAll('.material-symbols-outlined.A');
let currSlide=0;
const totalSlide=3;  //focus=0,short break=1,long break=2

function prevSlide(){
  currSlide=(currSlide-1+totalSlide)%3;
  showSlide();
}
function nextSlide(){
  currSlide=(currSlide+1)%3;
  showSlide();
}

function showSlide(){}

//PENDING - hovering effect, clickabilty, MAIN CHROME EXTENSION LOGIC